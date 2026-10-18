import { certifications, education, experiences, skillCategories } from '@/app/content/career';
import { projectAnswers, STARTER_LABELS, STARTER_QUESTIONS, type StarterKind } from '@/app/content/projectAnswers';
import {
  getProject,
  getProjectsForSkill,
  projects,
  PROJECT_TYPES,
  summaryPhrase,
  type MediaItem,
  type Project,
} from '@/app/content/projects';
import { ASK, CONTACT, PROFILE, RESUME_URL } from '@/app/content/site';
import type { AnswerProject, AskAnswer } from './types';

/**
 * 직접 써 둔 답변. 자주 나올 질문은 AI를 부르지 않고 여기서 바로 답한다.
 * 빠르고, 비용이 없고, 무엇보다 본인의 말이다.
 *
 * 사실에 해당하는 문장은 전부 사이트 데이터에서 만든다. 공백기·실패담·
 * 개발을 시작한 계기처럼 데이터에 없는 이야기는 일부러 두지 않았다 —
 * 그런 질문은 Claude가 상세 서술을 근거로 답하거나, 근거가 없다고 말한다.
 */

type Route = {
  /** Jev 선택지 설명. 분류기가 읽는 문장이라 경계를 분명히 적는다. */
  criteria: string;
  answer: (question: string) => AskAnswer | null;
};

const prepared = (text: string, extra: Partial<AskAnswer> = {}): AskAnswer => ({
  source: 'prepared',
  segments: [{ text }],
  sources: [],
  links: [],
  follow: [],
  ...extra,
});

const resumeLink = { label: '이력서 PDF', href: RESUME_URL };

/** "가장 자신 있는 프로젝트는?"에 답할 프로젝트. 본인이 고른 것이다. */
const BEST = 'the1seoul';

/** 위 답 아래에 붙는 이어지는 질문. "~도"가 붙어 혼자서는 어색하므로 ASK(사이트맵에 오르는 문장)에 두지 않는다. */
const MORE_FEATURED = '대표 프로젝트도 보여 주세요';

/** 연락처·이력서처럼 대화가 끝나기 쉬운 답 아래에 붙인다. 이미 관심이 생긴 사람에게 가장 보여 줄 만한 답이다. */
const KEEP_GOING = ['가장 자신 있는 프로젝트는?', '측정해서 개선한 사례가 있나요?'];

/**
 * 답 글의 짜임. 첫 문단이 결론이고(화면에서 굵게 선다), 나머지는 짧은 문단과 목록이다.
 * 문단은 빈 줄로, 목록은 줄마다 "- "로 표시한다. 화면은 AskBox의 toBlocks가 그린다.
 */
const doc = (...blocks: (string | false | undefined)[]) => blocks.filter(Boolean).join('\n\n');
const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

/**
 * 답변에 붙일 프로젝트 모양. 카드에는 대표 이미지 한 장과 시연 영상 한 편만
 * 싣는다 — 나머지는 상세 페이지에 있고, 대화 안에서 영상이 줄줄이 돌면 무겁다.
 */
function toAnswerProject(project: Project, withMedia: 'none' | 'thumb' | 'full' = 'none'): AnswerProject {
  const image = project.media.find((m) => m.type === 'image');
  const motion = project.media.find((m) => m.type !== 'image');
  return {
    slug: project.slug,
    title: project.title,
    type: project.tags[0],
    duration: project.duration,
    summary: project.summary,
    role: project.role,
    stack: project.stack,
    media: withMedia === 'none' ? undefined : [image, withMedia === 'full' ? motion : undefined].filter((m): m is MediaItem => Boolean(m)),
  };
}

// 목록도 썸네일을 싣는다. 글만 나열하면 훑는 사람이 어느 게 무엇인지 화면으로 기억하지 못한다.
const projectList = (list: Project[], withMedia: 'none' | 'thumb' = 'thumb') => ({
  view: 'list' as const,
  items: list.map((p) => toAnswerProject(p, withMedia)),
});

/* ── 기술 검증: 질문에서 기술 이름을 찾아 실제로 쓴 곳을 보여 준다 ── */

/** 사이트에 기록된 기술 이름 전체. 프로젝트 stack·tags와 경력 stack에서 모은다. */
const KNOWN_SKILLS = Array.from(
  new Set(
    [
      ...projects.flatMap((p) => [...p.tags.slice(1), ...p.stack.split(',')]),
      ...experiences.flatMap((job) => job.projects.flatMap((p) => p.stack ?? [])),
    ]
      .map((s) => s.replace(/[()]/g, '').trim())
      .filter((s) => /^[A-Za-z]/.test(s) && s.length <= 20),
  ),
);

/** 한글로 묻는 경우가 많다. 사이트에 실제로 있는 기술만 별칭을 단다. */
const ALIASES: Record<string, string> = {
  // "뷰"는 넣지 않는다. "리뷰"에 걸려 영화 한 줄 리뷰 질문이 Vue 질문이 된다.
  리액트: 'React',
  넥스트: 'Next.js',
  뷰제이에스: 'Vue.js',
  앵귤러: 'Angular',
  타입스크립트: 'TypeScript',
  스프링: 'Spring Boot',
  스프링부트: 'Spring Boot',
  네스트: 'NestJS',
  프리즈마: 'Prisma',
  도커: 'Docker',
  엔진엑스: 'Nginx',
  오라클: 'Oracle',
  레디스: 'Redis',
  포스트그레스: 'PostgreSQL',
  웹소켓: 'WebSocket',
  깃허브액션: 'GitHub Actions',
  오픈에이아이: 'OpenAI',
  테일윈드: 'Tailwind',
};

/** 사이트에 그 이름으로는 없지만 가까운 기록이 있는 기술 */
const RELATED: Record<string, string> = {
  java: 'Spring Boot',
  kotlin: 'Spring Boot',
  postgres: 'PostgreSQL',
  k8s: 'Docker',
  kubernetes: 'Docker',
  ec2: 'AWS',
  s3: 'AWS',
  lightsail: 'AWS',
  javascript: 'TypeScript',
  js: 'TypeScript',
  ts: 'TypeScript',
  gpt: 'OpenAI',
  llm: 'OpenAI',
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function findSkill(question: string) {
  const q = question.toLowerCase().replace(/\s+/g, '');
  for (const [alias, name] of Object.entries(ALIASES)) if (q.includes(alias)) return name;
  // 긴 이름부터 맞춰야 "Next.js"가 "Next"보다 먼저 잡힌다
  const byLength = [...KNOWN_SKILLS].sort((a, b) => b.length - a.length);
  // "Vue"로 물어도 "Vue.js"를 찾도록 .js를 뗀 이름으로도 맞춰 본다
  const lower = question.toLowerCase();
  return byLength.find((skill) =>
    [skill, skill.replace(/\.js$/i, '')].some((name) => new RegExp(`(^|[^a-z])${escape(name.toLowerCase())}([^a-z.]|$)`).test(lower)),
  );
}

/** 질문 속 영문 기술명 후보. 사이트에 없는 기술을 물었을 때 이름을 그대로 돌려주려고 쓴다. */
function findUnknownTerm(question: string) {
  const stop = new Set(['pdf', 'ai', 'api', 'ui', 'ux', 'it', 'ok']);
  return question.match(/[A-Za-z][A-Za-z0-9.+#-]{1,20}/g)?.find((w) => !stop.has(w.toLowerCase()));
}

function skillAnswer(question: string): AskAnswer | null {
  const skill = findSkill(question);
  if (skill) {
    const used = getProjectsForSkill(skill);
    const jobs = experiences.filter((job) => job.projects.some((p) => p.stack?.some((s) => s.toLowerCase() === skill.toLowerCase())));
    if (jobs.length === 0 && used.length === 0) return null;
    // 회사와 프로젝트는 겹친다(와커스 = 더원서울안과). 따로 세어 한 문장씩 낸다.
    const parts = [
      jobs.length > 0 && `${jobs.map((job) => job.company).join(', ')}에서 실무로 썼고`,
      used.length > 0 && `사이트에 올린 프로젝트 중 ${used.length}개에 쓰였습니다`,
    ].filter((part): part is string => Boolean(part));
    const sentence = parts.length === 2 ? parts.join(', ') : jobs.length > 0 ? `${parts[0].replace(/고$/, '습니다')}` : parts[0];
    return prepared(doc('네, 써 봤습니다.', `${skill}는 ${sentence}.`), {
      kind: '기술 검증',
      projects: used.length > 0 ? projectList(used) : undefined,
      follow: ['가장 자신 있는 프로젝트는?', '측정해서 개선한 사례가 있나요?'],
    });
  }

  const term = findUnknownTerm(question);
  if (!term) return null;
  const related = RELATED[term.toLowerCase()];
  return prepared(
    related
      ? doc(`사이트에는 ${term} 경험이 따로 기록되어 있지 않습니다.`, `가장 가까운 기록은 ${related} 경험입니다.`)
      : `솔직히 말씀드리면 사이트에는 ${term} 경험이 기록되어 있지 않습니다.`,
    {
      kind: '기술 검증',
      projects: related ? projectList(getProjectsForSkill(related)) : undefined,
      follow: related ? [`${related} 써 보셨어요?`] : ['어떤 기술을 주로 쓰나요?'],
    },
  );
}

/* ── 선택지 ── */

const current = experiences.find((job) => job.current);
const measured = experiences
  .flatMap((job) => job.projects.flatMap((p) => p.tasks.map((task) => ({ company: job.company, task }))))
  // 단위가 붙은 숫자(20초, 8,000명)와 해결한 장애만 고른다. "EPSG:3857" 같은 식별자 숫자는 성과가 아니다
  .filter(({ task }) => /\d[\d,]*\s*(초|분|명|%|배|건)/.test(task) || task.includes('SSO'));

export const ROUTES: Record<string, Route> = {
  intro: {
    criteria: '자기소개를 부탁하거나 이 사람이 누구인지 전반적으로 묻는다 (introduce yourself, who are you)',
    answer: () =>
      prepared(
        doc(
          `안녕하세요, ${PROFILE.jobTitle} ${PROFILE.name}입니다.`,
          (current ? `지금은 ${current.company}에서 일하고 있습니다. ` : '') +
            `이전에는 ${experiences
              .filter((j) => !j.current)
              .map((j) => j.company)
              .join(', ')}에서 일했습니다.`,
          list(['Angular, Vue, React, Next.js를 모두 실무로 다뤘습니다.', '백엔드와 AWS 운영까지 맡아 왔습니다.']),
        ),
        {
          kind: '자기소개',
          links: [resumeLink],
          follow: [ASK.projects, ASK.career, '측정해서 개선한 사례가 있나요?'],
        },
      ),
  },
  career: {
    criteria: '경력, 다닌 회사, 연차, 재직 이력을 묻는다',
    answer: () =>
      prepared(
        doc(
          `지금까지 ${experiences.length}곳에서 일했습니다.`,
          list(
            experiences.map(
              // 회사 이름에 "(WACUS)"처럼 괄호가 있어 기간까지 괄호로 묶으면 괄호가 겹친다. 가운뎃점으로 나눈다.
              (job) =>
                `${[job.company, job.duration, job.role].filter(Boolean).join(' · ')}: ${job.projects.map((p) => p.name).join(', ')}`,
            ),
          ),
          '맡은 일과 성과는 이력서 PDF에 더 자세히 적어 두었습니다.',
        ),
        { kind: '경력', links: [resumeLink], follow: ['측정해서 개선한 사례가 있나요?', ASK.projects, ASK.education] },
      ),
  },
  achievements: {
    criteria: '성과, 수치로 남은 개선, 문제 해결 사례, 가장 큰 기여를 묻는다',
    answer: () =>
      prepared(
        doc(`숫자나 결과로 남은 개선은 ${measured.length}건입니다.`, list(measured.map(({ company, task }) => `${task} (${company})`))),
        {
          kind: '측정된 개선',
          follow: ['빌드 시간은 어떻게 줄였나요?', '메일 발송 Timeout은 왜 생겼나요?'],
        },
      ),
  },
  // "가장 자신 있는"은 하나를 묻는 질문이라 하나로 답한다. 여러 건을 내밀면 고르지 못한 것처럼 읽힌다.
  best: {
    criteria: '가장 자신 있는 프로젝트, 가장 내세우고 싶은 프로젝트 하나를 묻는다 (특정 프로젝트를 지목하지 않음)',
    answer: () => {
      const p = getProject(BEST)!;
      return prepared(
        doc(
          `가장 자신 있는 프로젝트는 ${p.title}입니다.`,
          '지금 운영 중인 병원 사이트를 리뉴얼하면서 맡은 범위가 가장 넓었습니다.',
          list([
            '백엔드 API를 프론트엔드와 연동',
            '회원 인증 전체와 소셜 로그인',
            '로그인 시도 제한과 접근 제어 같은 보안 보완',
            '캡차 음성 듣기로 웹 접근성 향상',
            '새 서버로 데이터와 파일을 옮기고 도메인 전환',
          ]),
          '코드를 새로 쓰는 데서 끝나지 않고, 실제 방문자가 들어오는 사이트를 새 서버로 끝까지 옮겨 놓았습니다.',
        ),
        {
          kind: '가장 자신 있는 프로젝트',
          projects: { view: 'card', items: [toAnswerProject(p, 'full')] },
          links: [
            { label: '전체 이야기 읽기', href: `/projects/${p.slug}` },
            ...(p.reference ? [{ label: '운영 중인 사이트', href: p.reference }] : []),
          ],
          follow: [`${p.title}에서 가장 어려웠던 점은?`, MORE_FEATURED],
        },
      );
    },
  },
  featured: {
    criteria: '대표 프로젝트, 대표작 여러 개를 보여 달라고 한다 (특정 프로젝트 하나를 지목하지 않음)',
    answer: () => {
      const list = projects.filter((p) => p.featured);
      return prepared(`대표 프로젝트는 ${list.length}건입니다.`, {
        kind: '대표 프로젝트',
        projects: projectList(list, 'thumb'),
        follow: [ASK.projects, '측정해서 개선한 사례가 있나요?'],
      });
    },
  },
  projects: {
    criteria: '프로젝트 전체 목록, 모든 프로젝트, 지금까지 만든 것 전부를 보여 달라고 한다',
    answer: () => {
      const counts = PROJECT_TYPES.map((type) => [type, projects.filter((p) => p.tags[0] === type).length] as const).filter(
        ([, n]) => n > 0,
      );
      return prepared(
        doc(
          `사이트에 올린 프로젝트는 모두 ${projects.length}건입니다.`,
          `${counts.map(([type, n]) => `${type} ${n}건`).join(', ')}입니다.`,
        ),
        { kind: '프로젝트 전체', projects: projectList(projects), follow: ['가장 자신 있는 프로젝트는?', 'React 써 보셨어요?'] },
      );
    },
  },
  stack: {
    criteria: '주로 쓰는 기술 스택, 다룰 수 있는 기술 전반을 묻는다 (특정 기술 하나를 지목하지 않음)',
    answer: () =>
      prepared(
        doc(
          `주로 쓰는 기술은 ${skillCategories.length}갈래로 나뉩니다.`,
          list(skillCategories.map((c) => `${c.label.replace(' · ', '와 ')}: ${c.skills.map((s) => s.label).join(', ')}`)),
        ),
        { kind: '기술 스택', follow: ['React 써 보셨어요?', 'Kotlin 할 줄 아세요?', ASK.projects] },
      ),
  },
  skill: {
    criteria: '특정 기술·언어·프레임워크·도구를 써 봤는지, 다룰 수 있는지 묻는다 (React 써 봤어요?, Kotlin 할 줄 알아요?)',
    answer: skillAnswer,
  },
  education: {
    criteria: '학력, 전공, 대학교, 자격증을 묻는다',
    answer: () =>
      prepared(
        doc(
          `${education.institution}를 졸업했습니다 (${education.duration}).`,
          `자격증은 ${certifications.length}개가 있습니다.`,
          list(certifications.map((c) => `${c.title} (${c.issueDate})`)),
        ),
        { kind: '학력과 자격증', follow: [ASK.career, ASK.projects] },
      ),
  },
  contact: {
    criteria: '연락처, 이메일, GitHub, 블로그, 연락 방법을 묻는다',
    answer: () =>
      prepared(doc(`메일 주소는 ${CONTACT.email}입니다.`, '전화번호는 이력서 PDF에 적어 두었습니다.'), {
        kind: '연락처',
        copy: CONTACT.email,
        links: [resumeLink, { label: 'GitHub', href: CONTACT.github }, { label: '블로그', href: CONTACT.blog }],
        follow: KEEP_GOING,
      }),
  },
  resume: {
    criteria: '이력서, 경력기술서, PDF 파일을 요청한다',
    answer: () =>
      prepared('이력서는 PDF로 준비해 두었습니다.', {
        kind: '이력서',
        links: [{ label: '이력서 PDF 받기', href: RESUME_URL }],
        follow: KEEP_GOING,
      }),
  },
  greeting: {
    criteria: '인사만 한다 (안녕하세요, hi, hello)',
    answer: () =>
      prepared('안녕하세요, 들러 주셔서 반갑습니다. 궁금한 점을 편하게 물어보세요.', {
        kind: '인사',
        follow: ['자기소개 부탁드려요', '가장 자신 있는 프로젝트는?'],
      }),
  },
  laugh: {
    criteria: '웃음이나 감탄만 남긴다 (ㅋㅋ, ㅎㅎ, lol, 오)',
    answer: () =>
      prepared('웃어 주셔서 감사합니다. 이제 진지한 질문도 하나 해 주실래요?', {
        kind: '대화',
        follow: ['측정해서 개선한 사례가 있나요?', '협업할 때 어떤 편인가요?'],
      }),
  },
  are_you_ai: {
    criteria: '이 답변을 AI가 하는지, 사람이 하는지, 챗봇인지 묻는다',
    answer: () =>
      prepared(
        doc(
          '반은 맞습니다.',
          list([
            '자주 나올 질문은 제가 직접 써 둔 답변으로 바로 답합니다.',
            '그 밖의 질문은 AI가 실제 경력과 프로젝트 기록만 근거로 답하고, 출처를 함께 보여 드립니다.',
          ]),
        ),
        { kind: '이 검색창에 대해', follow: ['이 사이트는 어떻게 만들었어요?', '더원서울안과 리뉴얼에서 가장 어려웠던 점은?'] },
      ),
  },
  about_site: {
    criteria: '이 포트폴리오 사이트(검색창)를 어떻게 만들었는지, 어떤 구조로 동작하는지 묻는다',
    answer: () =>
      prepared(
        doc(
          '이 사이트는 검색창 하나로 포트폴리오를 둘러보게 만든 Next.js 사이트입니다.',
          '질문이 들어오면 분류용 AI가 먼저 어떤 질문인지 가립니다.',
          list([
            '자기소개나 경력처럼 자주 나오는 질문은 제가 미리 써 둔 답으로 바로 답합니다. 기다릴 필요도, 비용도 없습니다.',
            '그 밖의 질문은 AI가 사이트에 적힌 경력과 프로젝트 기록만 근거로 답하고, 근거가 된 출처를 함께 보여 줍니다.',
          ]),
          '근거를 찾지 못하면 지어내지 않고 메일로 안내합니다.',
        ),
        { kind: '이 사이트에 대해', follow: ['이거 AI가 답하는 거예요?', ASK.projects] },
      ),
  },
  recommend: {
    criteria: '무엇을 물어볼지 모르겠다거나 아무거나 추천해 달라고 한다',
    answer: () =>
      prepared('면접관분들이 가장 궁금해하실 만한 질문을 골라 드릴게요.', {
        kind: '추천 질문',
        follow: ['측정해서 개선한 사례가 있나요?', '팀에서 주로 맡는 역할은?', '실패하거나 아쉬웠던 경험은?'],
      }),
  },
  insult: {
    criteria: '비난, 욕설, 조롱을 한다',
    answer: () => prepared('앗, 따끔하네요. 아쉬운 점을 알려 주시면 고쳐 보겠습니다.', { kind: '피드백', copy: CONTACT.email }),
  },
  // 프로젝트 하나를 지목해 개괄만 묻는 경우. 세부 질문은 Claude가 상세 서술로 답한다.
  ...Object.fromEntries(
    projects.map((p) => [
      `project:${p.slug}`,
      {
        criteria: `"${p.title}" 프로젝트가 무엇인지 개괄만 묻는다 (어려웠던 점·이유·구체적 구현은 제외)`,
        answer: () =>
          prepared(doc(`${p.title} 프로젝트는 ${summaryPhrase(p)}입니다.`, p.highlight), {
            kind: '프로젝트',
            projects: { view: 'card', items: [toAnswerProject(p, 'full')] },
            links: [
              { label: '전체 이야기 읽기', href: `/projects/${p.slug}` },
              ...(p.reference ? [{ label: '운영 중인 사이트', href: p.reference }] : []),
              ...(p.github ? [{ label: 'GitHub', href: p.github }] : []),
            ],
            follow: [`${p.title}에서 가장 어려웠던 점은?`, `${p.title}의 기술 선택 이유는?`],
          }),
      } satisfies Route,
    ]),
  ),
};

export const NONE = 'none';

/* ── 프로젝트 하나의 어려웠던 점·역할·결과 ── */

/*
  짧게 물은 경우만 받는다. "왜", "어떻게 해결했나요", "자세히"처럼 더 파고들면 미리 써 둔 답으로는
  부족해서 Claude에게 넘긴다. 순서가 중요하다. "어려웠던 결과"처럼 겹치면 앞의 것을 고른다.
*/
const STARTER_INTENTS: [StarterKind, RegExp][] = [
  ['hard', /어려웠|어려운 점|힘들었|힘든 점|막혔|고생/],
  ['role', /역할|맡은|맡았|담당|기여/],
  ['result', /결과|성과|어땠|어떻게 됐/],
];
const DIG_DEEPER = /왜|해결|자세히|구체적|어떤 식으로|어떻게 (했|하셨|만들|구현)/;

export function starterAnswer(project: Project, question: string): { answer: AskAnswer; kind: StarterKind } | null {
  if (question.length > 40 || DIG_DEEPER.test(question)) return null;
  const kind = STARTER_INTENTS.find(([, pattern]) => pattern.test(question))?.[0];
  const text = kind && projectAnswers[project.slug]?.[kind];
  if (!kind || !text) return null;
  return {
    kind,
    answer: prepared(text, {
      kind: STARTER_LABELS[kind],
      // 나머지 두 질문을 이어서 건넨다. 프로젝트 이름을 붙여 두어야 첫 화면에서 눌러도 같은 프로젝트로 간다.
      follow: (Object.keys(STARTER_QUESTIONS) as StarterKind[])
        .filter((k) => k !== kind)
        // "슬기로운 아이티센 생활 | 셔틀 서비스"처럼 긴 제목은 "|" 뒤의 짧은 이름으로 부른다. 그 이름으로도 프로젝트를 알아본다.
        .map((k) => `${project.title.split('|').pop()!.trim()}${k === 'result' ? '의 ' : '에서 '}${STARTER_QUESTIONS[k]}`),
    }),
  };
}
