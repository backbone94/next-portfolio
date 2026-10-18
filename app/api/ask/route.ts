import Anthropic from '@anthropic-ai/sdk';
import { STARTER_QUESTIONS } from '@/app/content/projectAnswers';
import { getProject, type Project } from '@/app/content/projects';
import { askHref } from '@/app/content/site';
import { claudeAvailable, fakeClaude, notice, streamClaude, type Scope } from '@/app/lib/ask/claude';
import { NONE, ROUTES, starterAnswer } from '@/app/lib/ask/prepared';
import { findProjects, routeQuestion, type RouteDecision } from '@/app/lib/ask/router';
import { recordAsk, type Usage } from '@/app/lib/ask/store';
import type { AskAnswer, AskStreamEvent } from '@/app/lib/ask/types';

/** 답이 정해지면 부른다. Vercel 로그에 한 줄 찍고 질문 기록(ask_log)에도 남긴다. usage는 Claude가 답했을 때만 온다. */
type Log = (answer: AskAnswer, usage?: Usage) => void;

/**
 * 검색창 하나가 받는 모든 질문이 여기로 온다.
 *
 * 질문 → Jev가 분류 → 직접 쓴 답변이 있으면 바로 답하고, 없으면 Claude.
 * Claude는 질문당 비용이 드는 유일한 경로라 호출 횟수를 따로 묶는다.
 */

const MAX_LENGTH = 200;
/** Jev가 이 확률 이상으로 고른 선택지만 직접 쓴 답변으로 답한다 */
const ROUTE_THRESHOLD = 0.6;
const OFF_TOPIC_THRESHOLD = 0.85;

/*
  IP별 호출 제한. 서버리스 인스턴스마다 따로 세는 메모리 값이라 정확한 상한은
  아니다 — 반복 호출을 늦추는 첫 번째 방어선이고, 진짜 상한은 Anthropic
  콘솔의 월 지출 한도가 맡는다.
*/
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = { all: 30, claude: 8 };
const hits = new Map<string, { all: number[]; claude: number[] }>();

function allow(ip: string, kind: 'all' | 'claude') {
  const now = Date.now();
  const entry = hits.get(ip) ?? { all: [], claude: [] };
  entry[kind] = entry[kind].filter((t) => now - t < WINDOW_MS);
  if (entry[kind].length >= LIMIT[kind]) return false;
  entry[kind].push(now);
  hits.set(ip, entry);
  return true;
}

/**
 * AI 답은 한 줄에 소식 하나씩(NDJSON) 흘려 보낸다. 직접 쓴 답은 바로 나오니 평소처럼 JSON 한 번이다.
 * 마지막 줄은 언제나 done이다. 호출이 실패해도 안내 답을 done으로 보낸다.
 */
function streamAnswer(write: (emit: (event: AskStreamEvent) => void) => Promise<AskAnswer>, done: (answer: AskAnswer) => void) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: AskStreamEvent) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        } catch {
          // 방문자가 창을 닫아 이미 끊긴 흐름이다
        }
      };
      let answer: AskAnswer;
      try {
        answer = await write(emit);
      } catch (error) {
        console.error('[ask] Claude 호출 실패', error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
        answer = notice('지금은 답을 가져오지 못했습니다. 잠시 뒤에 다시 시도해 주세요.');
      }
      done(answer);
      emit({ type: 'done', answer });
      try {
        controller.close();
      } catch {
        // 이미 끊긴 흐름
      }
    },
  });
  return new Response(body, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store, no-transform' },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { question?: unknown; project?: unknown } | null;
  const asked = typeof body?.question === 'string' ? body.question.trim() : '';
  // 상세 페이지 옆 칸에서 온 질문이면 그 페이지의 프로젝트가 함께 온다
  const project = typeof body?.project === 'string' ? getProject(body.project) : undefined;
  if (!asked) return Response.json({ error: '질문이 비어 있습니다.' }, { status: 400 });
  if (asked.length > MAX_LENGTH) {
    return Response.json(notice(`질문은 ${MAX_LENGTH}자 안으로 줄여 주세요.`));
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!allow(ip, 'all')) {
    return Response.json(notice('질문이 조금 많았습니다. 잠시 뒤에 다시 물어봐 주세요.'), { status: 429 });
  }

  if (project) return answerInPanel(asked, project, ip, request.signal);

  // 프로젝트 하나를 지목해 어려웠던 점·역할·결과를 짧게 물으면 미리 써 둔 답으로 바로 답한다. 둘 이상이면 비교라 Claude가 맡는다.
  const named = findProjects(asked);
  const starter = named.length === 1 ? starterAnswer(named[0], asked) : null;
  if (starter) {
    const route = `starter:${named[0].slug}:${starter.kind}`;
    console.info('[ask]', JSON.stringify({ question: asked, route, answeredBy: 'prepared' }));
    recordAsk({ question: asked, route, answer: starter.answer });
    return Response.json(starter.answer);
  }

  const decision = await routeQuestion(asked);
  // 어떤 질문이 들어오고 어디로 갔는지 보고 답변을 늘려 가는 용도다. IP는 남기지 않는다.
  const log: Log = (answer, usage) => {
    console.info('[ask]', JSON.stringify({ question: asked, ...decision, answeredBy: answer.source }));
    recordAsk({ question: asked, route: decision.route, decision, answer, usage });
  };
  const route = ROUTES[decision.route];
  const prepared = decision.route !== NONE && route && decision.confidence >= ROUTE_THRESHOLD ? route.answer(asked) : null;

  if (prepared) {
    log(prepared);
    return Response.json(prepared);
  }
  if (decision.offTopic >= OFF_TOPIC_THRESHOLD) {
    const answer = notice('이 검색창은 정준 님의 경력과 프로젝트에 대해서만 답합니다.', ['자기소개 부탁드려요', '가장 자신 있는 프로젝트는?']);
    log(answer);
    return Response.json(answer);
  }
  return askClaude(asked, ip, request.signal, log);
}

/**
 * Claude에게 넘기는 마지막 단계. 첫 화면과 옆 칸이 같이 쓴다.
 * 테스트 모드면 가짜 답을, 키가 없거나 호출 제한에 걸리면 안내를 낸다.
 */
function askClaude(question: string, ip: string, signal: AbortSignal, log: Log, scope?: Scope) {
  let answer: AskAnswer;
  if (process.env.ASK_DRY_RUN === '1') {
    // 화면 확인용. Jev도 Claude도 부르지 않는다 (.env.local에 ASK_DRY_RUN=1)
    return streamAnswer((emit) => fakeClaude(question, emit), log);
  } else if (!claudeAvailable()) {
    answer = notice('아직 이 질문에 대한 답을 준비하지 못했습니다. 메일로 물어봐 주시면 직접 답해 드리겠습니다.');
  } else if (!allow(ip, 'claude')) {
    answer = notice('직접 써 둔 답변이 없는 질문이 많아 잠시 쉬어 갑니다. 10분 뒤에 다시 물어봐 주세요.');
  } else {
    // 토큰 수는 답이 끝나야 나온다. 받아 두었다가 기록할 때 함께 넘긴다.
    let usage: Usage | undefined;
    return streamAnswer(
      (emit) => streamClaude(question, emit, signal, scope, (u) => (usage = u)),
      (answer) => log(answer, usage),
    );
  }
  log(answer);
  return Response.json(answer);
}

/*
  상세 페이지 옆 칸. 그 페이지의 프로젝트에 대해서만 답한다.
  다른 프로젝트는 그 프로젝트 페이지로, 경력·자기소개·연락처처럼 사이트 전체에 대한 질문은 첫 화면으로 안내한다.
  이 프로젝트에 대한 질문은 미리 써 둔 답이 있으면 그 답으로, 없으면 Claude가 이 프로젝트 문서만 보고 답한다.
*/

/** 옆 칸에서도 이 프로젝트 기준으로 답할 수 있는 분류. "여기서 Redis 썼어요?"는 기술 질문으로 분류되지만 이 프로젝트에 대한 질문이다. */
const IN_PANEL = new Set(['skill', 'achievements']);

/** 이름을 대지 않고 이 프로젝트 밖을 가리키는 말. "다른 방법은?"처럼 프로젝트 안의 질문은 걸리지 않게 좁게 잡는다. */
const ELSEWHERE = /(다른|딴|그 ?밖의|나머지) ?(프로젝트|회사|직장)|(이전|예전|전) ?(회사|직장)/;

const shortName =(p: Project) => p.title.split('|').pop()!.trim();

async function answerInPanel(asked: string, project: Project, ip: string, signal: AbortSignal) {
  // 분류를 거친 질문은 그 확률도 남긴다. 옆 칸에서 어떤 질문이 어디로 가는지 보고 고치는 용도다.
  const log =
    (route: string, decision?: RouteDecision): Log =>
    (answer, usage) => {
      console.info('[ask]', JSON.stringify({ question: asked, project: project.slug, ...decision, route, answeredBy: answer.source }));
      recordAsk({ question: asked, page: project.slug, route, decision, answer, usage });
    };
  const reply = (answer: AskAnswer, route: string, decision?: RouteDecision) => {
    log(route, decision)(answer);
    return Response.json(answer);
  };
  const here = `이 대화창은 ${shortName(project)}에 대해서만 답합니다.`;
  // 첫 화면 링크(/?q=)는 누르면 첫 화면에서 그 질문이 바로 실행된다
  const toHome: AskAnswer = { ...notice(`${here} 다른 질문은 첫 화면 검색창에서 물어봐 주세요.`), links: [{ label: '첫 화면에서 물어보기', href: askHref(asked) }] };

  const others = findProjects(asked).filter((p) => p.slug !== project.slug);
  if (others.length > 0) {
    const answer: AskAnswer = {
      ...notice(`${here} ${shortName(others[0])}에 대한 질문은 그 프로젝트 페이지에서 물어봐 주세요.`),
      links: others.map((p) => ({ label: `${shortName(p)} 페이지`, href: `/projects/${p.slug}` })),
    };
    return reply(answer, `other:${others.map((p) => p.slug).join(',')}`);
  }
  // "다른 프로젝트에서도 WebSocket 써 봤어요?"는 이름이 없어도 이 프로젝트 밖을 묻는다. Claude를 부르지 않고 첫 화면으로 보낸다.
  if (ELSEWHERE.test(asked)) return reply(toHome, 'home:elsewhere');

  const starter = starterAnswer(project, asked);
  if (starter) return reply(starter.answer, `starter:${starter.kind}`);

  const decision = await routeQuestion(asked, project.title);
  const route = decision.route;
  if (decision.offTopic >= OFF_TOPIC_THRESHOLD) return reply(notice(`${here} 이 프로젝트에 대해 궁금한 점을 물어봐 주세요.`), 'off_topic', decision);
  // 인사에는 첫 화면으로 보내지 않고 인사로 받는다. 이 칸에서 물어볼 만한 질문을 함께 건넨다.
  if (route === 'greeting' && decision.confidence >= ROUTE_THRESHOLD) {
    const answer: AskAnswer = {
      source: 'prepared',
      kind: '인사',
      segments: [{ text: `안녕하세요, 들러 주셔서 반갑습니다. ${shortName(project)}에 대해 궁금한 점을 편하게 물어보세요.` }],
      sources: [],
      links: [],
      follow: Object.values(STARTER_QUESTIONS),
    };
    return reply(answer, 'greeting', decision);
  }
  // 사이트 전체에 대한 답으로 분류됐으면 첫 화면으로 안내한다. 이 프로젝트의 개괄은 이미 페이지에 있으니 Claude가 질문에 맞게 답한다.
  const elsewhere = route !== NONE && route !== `project:${project.slug}` && !IN_PANEL.has(route) && ROUTES[route] && decision.confidence >= ROUTE_THRESHOLD;
  if (elsewhere) return reply(toHome, `home:${route}`, decision);

  // "여기서 제일 힘들었던 건?"처럼 이름 없이 물어도 어느 프로젝트인지 알 수 있게 이름을 붙여 넘긴다
  const question = findProjects(asked).length > 0 ? asked : `${project.title}에 대해: ${asked}`;
  return askClaude(question, ip, signal, log(route, decision), { slug: project.slug, title: project.title, outside: toHome });
}
