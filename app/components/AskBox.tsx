'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { ASK, CONTACT, RECORD_NOTICE, RESUME_URL, STARTERS, askHref } from '../content/site';
import { answerToHtml, answerToMarkdown, applyStreamEvent, cleanSegments, toBlocks } from '../lib/ask/format';
import type { AnswerProject, AskAnswer, AskStreamEvent } from '../lib/ask/types';
import CopyEmailButton from './CopyEmailButton';
import ProjectMedia from './ProjectMedia';

/**
 * 첫 화면 전체. 요즘 AI 채팅 화면의 문법을 따른다.
 *
 * - 질문 전: 인사말과 입력창이 화면 가운데에 있다.
 * - 질문 후: 대화가 위에서 아래로 시간순으로 흐르고, 입력창은 화면 아래에 붙는다.
 *   방문자의 질문은 오른쪽 말풍선, 답변은 상자 없는 본문 글자다.
 * - 답변은 글자가 흘러나오듯 나타나고, 다 나온 뒤에 출처·이어서 물어보기가 붙는다.
 *
 * 옛 포트폴리오 화면으로 내보내지 않는다. 프로젝트 목록·카드·경력은 답변
 * 안에서 그린다. 마지막 질문은 주소(/?q=)에 남아서, 그 주소를 보내면 받은
 * 사람에게도 같은 답이 펼쳐진 채로 열린다.
 */

const EXAMPLES = [
  'React 써 보셨어요?',
  '주로 쓰는 기술 스택은?',
  '더원서울안과 리뉴얼에서 가장 어려웠던 점은?',
  '실패하거나 아쉬웠던 경험은?',
  'Kotlin 할 줄 아세요?',
  '이력서 PDF 있나요?',
  '이거 AI가 답하는 거예요?',
];

/** instant: 주소로 들어와 서버가 미리 그린 답. 글자가 흘러나오는 연출 없이 바로 보인다. */
/** live: AI 답이 아직 흘러오는 중이다. 도착한 만큼 바로 보이고, 도구 줄은 다 온 뒤에 붙는다. */
type Entry = { id: number; question: string; answer?: AskAnswer; instant?: boolean; live?: boolean };

/**
 * 새 탭으로 여는 링크. 바깥 사이트와 PDF에 더해 프로젝트 상세도 새 탭으로 연다.
 * 상세를 읽고 탭을 닫으면 하던 대화가 그대로 남아 있어야 한다.
 */
const isExternal = (href: string) =>
  href.startsWith('http') || href.endsWith('.pdf') || href.startsWith('mailto:') || href.startsWith('/projects/');

/** "/?q=질문" 링크는 페이지를 옮기지 않고 같은 대화에 질문을 잇는다 */
const questionOf = (href: string) => (href.startsWith('/?q=') ? decodeURIComponent(href.slice(4)) : null);

/**
 * 질문 버튼. 줄바꿈을 막지 않는다. 짧은 질문은 어절 단위 줄바꿈(keep-all) 덕에 어차피 한 줄로 서고,
 * 긴 질문("더원서울안과 홈페이지 리뉴얼에서 가장 어려웠던 점은?")만 칸이 모자랄 때 줄을 바꾼다.
 * 한 줄로 못박으면 휴대폰 글자 크기 설정을 키웠을 때 화면 밖으로 나가 잘린다.
 */
export const chip =
  'max-w-full rounded-md bg-surface-2 px-3.5 py-1.5 text-left text-sm font-medium text-text/80 transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-50';

/**
 * inline: "/?q=" 링크를 지금 대화에 이어 묻는다. 상세 페이지 옆 칸은 그 프로젝트만 답해서,
 * 거기서는 끄고 첫 화면을 새 탭으로 연다. 옆 칸에서 다시 물으면 같은 안내만 되돌아온다.
 */
function ChipLink({
  href,
  children,
  onAsk,
  className = chip,
  inline = true,
}: {
  href: string;
  children: ReactNode;
  onAsk: (q: string) => void;
  className?: string;
  inline?: boolean;
}) {
  const question = questionOf(href);
  if (question && !inline) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (question) {
    return (
      <button type="button" onClick={() => onAsk(question)} className={className}>
        {children}
      </button>
    );
  }
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ── 기다리는 동안 ── */

/**
 * 직접 쓴 답변은 0.3초 안에 오고, 1초를 넘기면 Claude가 사이트를 읽고 있는
 * 것이다. 그래서 시간에 따라 바뀌는 문구가 실제 단계와 거의 맞는다.
 */
const STAGES: [number, string][] = [
  [0, '질문을 읽고 있습니다'],
  [900, '사이트에서 근거를 찾고 있습니다'],
  [4500, '답을 정리하고 있습니다'],
];

/** 천천히 도는 별. 진행 중이라는 현재 상태 표시라 앰버를 쓴다 */
function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 shrink-0 animate-[spin_2.4s_linear_infinite] text-accent">
      {[0, 45, 90, 135].map((deg) => (
        <path key={deg} d="M12 3v18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

export function Thinking() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = STAGES.slice(1).map(([at], i) => setTimeout(() => setStage(i + 1), at));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex items-center gap-2.5 py-1">
      <Spark />
      <span aria-hidden className="animate-pulse text-[0.9375rem] text-muted">
        {STAGES[stage][1]}…
      </span>
    </div>
  );
}

/* ── 답변이 흘러나오는 효과 ── */

/**
 * 받은 답을 한 번에 붙이지 않고 글자 단위로 드러낸다. 답은 이미 다 도착해
 * 있고 보여 주는 속도만 조절하는 연출이다. 동작 줄이기를 켠 방문자에게는
 * 처음부터 전부 보여 준다.
 */
function useReveal(total: number, instant = false) {
  const [shown, setShown] = useState(instant ? total : 0);

  useEffect(() => {
    if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(total);
      return;
    }
    // 프레임 수가 아니라 흐른 시간으로 센다. 탭이 백그라운드로 가서 프레임이 줄어도 제때 끝난다.
    // 초당 200자, 긴 답도 1초 안에 끝나도록 속도를 올린다.
    const perMs = Math.max(0.2, total / 1000);
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const count = Math.min(total, Math.ceil((performance.now() - start) * perMs));
      setShown(count);
      if (count < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // 프레임이 아예 멈춘 탭에서도 끝까지 보이게 하는 안전판
    const fallback = setTimeout(() => setShown(total), 1600);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [total, instant]);

  return shown;
}

/**
 * 답 글을 문단과 목록으로 나눠 그린다. 나누는 규칙은 format.ts의 toBlocks다.
 *
 * AI 답은 출처가 붙는 지점마다 조각으로 잘려 온다. 조각을 이어 붙일 때 출처 번호
 * 자리에 표시(\u0000번호\u0001)를 끼워 두고, 문단을 나눈 뒤 그 자리에 [n]을 그린다.
 * 그래야 문단이나 목록이 조각 경계와 어긋나도 번호가 원래 문장 끝에 붙는다.
 */
const CITE = /\u0000(\d+)\u0001/;

function AnswerBody({ answer, shown, onAsk, here }: { answer: AskAnswer; shown: number; onAsk: (q: string) => void; here?: string }) {
  // 보여 줄 만큼만 이어 붙인다. 출처 번호는 그 조각이 다 나온 뒤에 붙는다.
  const groups: number[][] = [];
  let remaining = shown;
  let text = '';
  for (const segment of answer.segments) {
    if (remaining <= 0) break;
    text += segment.text.slice(0, remaining);
    const done = remaining >= segment.text.length;
    remaining -= segment.text.length;
    if (done && segment.cites?.length) text += `\u0000${groups.push(segment.cites) - 1}\u0001`;
  }

  const mark = 'ml-0.5 align-super text-[0.7em] font-medium text-accent';
  const cite = (c: number) => {
    const source = answer.sources[c];
    const question = source && questionOf(source.href);
    // 지금 보고 있는 페이지가 출처면 링크를 걸지 않는다. 근거 문장은 마우스를 올리면 보인다.
    if (here && source?.href.split('#')[0] === here) {
      return (
        <span key={c} title={source.quote} className={mark}>
          [{c + 1}]
        </span>
      );
    }
    return question ? (
      <button key={c} type="button" onClick={() => onAsk(question)} title={source.quote} className={mark}>
        [{c + 1}]
      </button>
    ) : (
      <a
        key={c}
        href={source?.href}
        title={source?.quote}
        {...(source && isExternal(source.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={mark}
      >
        [{c + 1}]
      </a>
    );
  };
  // split에 괄호를 쓰면 홀수 자리에 번호가 남는다: [글, 번호, 글, 번호, …]
  const inline = (value: string) =>
    value.split(CITE).map((part, i) => (i % 2 === 1 ? <span key={i}>{groups[Number(part)].map(cite)}</span> : part));

  const blocks = toBlocks(text);
  // 덩어리가 여럿이면 첫 문단을 결론처럼 굵게 세운다
  const lead = blocks.length > 1;
  return (
    <div className="space-y-4">
      {blocks.map((block, i) =>
        block.kind === 'para' ? (
          <p key={i} className={i === 0 && lead ? 'font-semibold leading-[1.75]' : 'leading-[1.75] text-text/90'}>
            {inline(block.text)}
          </p>
        ) : (
          <ul key={i} className="space-y-2">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3 leading-[1.75] text-text/90">
                {/* 작은 회색 점. 줄 높이(1.75em)의 첫 줄 가운데에 맞춰서, 항목이 두 줄로 넘어가도 첫 줄 옆에 남는다 */}
                <span aria-hidden className="ml-1 mt-[calc(0.875em-2.5px)] h-[5px] w-[5px] shrink-0 bg-muted" />
                <span>{inline(item)}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

/* ── 답변 안의 프로젝트 ── */


/**
 * 여러 건을 훑는 화면. 실제 화면이 타일을 거의 다 차지하고, 글은 두 줄이다.
 * 첫 줄은 제목과 유형·시점, 둘째 줄은 무엇을 만든 프로젝트인지 알려 주는 한 줄
 * 소개다. 제목만으로는 무엇인지 알 수 없는 프로젝트("살롱 | SSALON")가 많다.
 * 타일은 하나씩 차례로 떠오른다(동작 줄이기를 켜면 전역 규칙이 꺼 준다).
 */
function ProjectList({ items, instant, narrow }: { items: AnswerProject[]; instant?: boolean; narrow?: boolean }) {
  return (
    <ul className={`mt-5 grid grid-cols-1 gap-x-4 gap-y-6 ${narrow ? '' : 'sm:grid-cols-2'}`}>
      {items.map((p, i) => {
        const thumb = p.media?.[0];
        return (
          <li key={p.slug} className={instant ? undefined : 'animate-rise'} style={instant ? undefined : { animationDelay: `${i * 45}ms` }}>
            <Link href={`/projects/${p.slug}`} target="_blank" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface-2 transition-colors group-hover:border-accent">
                {thumb ? (
                  <Image
                    src={thumb.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 490px, 90vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span aria-hidden className="grid h-full place-items-center text-2xl font-black text-muted">
                    {p.title.slice(0, 1)}
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-baseline justify-between gap-3">
                <span className="truncate text-[0.9375rem] font-semibold transition-colors group-hover:text-accent">{p.title}</span>
                <span className="flex shrink-0 gap-2 text-xs text-muted">
                  <span>{p.type}</span>
                  <span>{p.duration.split('–')[0].slice(0, 7)}</span>
                </span>
              </p>
              <p className="mt-0.5 truncate text-sm text-muted">{p.summary}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** 한 건을 자세히. 실제 화면이 먼저, 역할과 스택이 뒤에 온다. */
function ProjectCard({ project }: { project: AnswerProject }) {
  return (
    <div className="mt-5">
      {project.media && project.media.length > 0 && (
        // 슬라이더는 상세 페이지와 같은 부품이라 최대 폭이 896px로 묶여 있다. 대화 폭(1000px)을 다 쓰게 푼다.
        <div className="[&>div]:max-w-none">
          <ProjectMedia media={project.media} />
        </div>
      )}
      <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted">기간</dt>
        <dd>{project.duration}</dd>
        {project.role && (
          <>
            <dt className="text-muted">역할</dt>
            <dd>{project.role}</dd>
          </>
        )}
        {project.stack && (
          <>
            {/* 상세 페이지 요약 카드와 같은 옅은 바탕 태그다. 대화에서 상세로 넘어가도 같은 모양으로 읽힌다. */}
            <dt className="mt-1.5 text-muted">스택</dt>
            <dd className="mt-1">
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.split(/,\s*/).map((tech) => (
                  <li key={tech} className="rounded bg-surface-2 px-2.5 py-1 text-[0.8125rem] font-medium leading-snug text-text/90">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

const answerLength = (answer: AskAnswer) => answer.segments.reduce((sum, s) => sum + s.text.length, 0);

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {done ? (
        <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 3.5v-.5A1.5 1.5 0 009 1.5H4A1.5 1.5 0 002.5 3v5A1.5 1.5 0 004 9.5h.5" />
        </>
      )}
    </svg>
  );
}

/**
 * narrow: 상세 페이지 옆 칸처럼 좁은 자리. 프로젝트 타일을 한 줄에 하나씩 둔다.
 * here: 지금 보고 있는 페이지 주소. 그 페이지가 출처면 링크 대신 "이 페이지"로 적는다. 눌러도 같은 페이지가 새 탭으로 하나 더 열릴 뿐이다.
 */
export function Answer({
  question,
  answer,
  instant,
  live,
  onFollow,
  disabled,
  narrow,
  here,
}: {
  question: string;
  answer: AskAnswer;
  instant?: boolean;
  live?: boolean;
  onFollow: (q: string) => void;
  disabled: boolean;
  narrow?: boolean;
  here?: string;
}) {
  const total = answerLength(answer);
  // 흘러오는 답은 도착하는 속도가 곧 연출이라 따로 늦추지 않는다
  const shown = useReveal(total, instant || live);
  const done = shown >= total && !live;
  const pill = chip;
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(value: string) {
    // 브라우저가 복사를 막으면(권한, 창이 포커스를 잃음) 넘어간다. "복사했습니다"를 거짓으로 띄우지 않는다.
    if (!(await navigator.clipboard.writeText(value).then(() => true, () => false))) return;
    setCopied(value);
    setTimeout(() => setCopied(null), 1800);
  }

  /** 답 전체를 마크다운과 HTML로 함께 복사한다. 붙여 넣는 곳이 고른다. */
  async function copyAnswer() {
    const markdown = answerToMarkdown(answer, location.origin);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([markdown], { type: 'text/plain' }),
          'text/html': new Blob([answerToHtml(answer, location.origin)], { type: 'text/html' }),
        }),
      ]);
    } catch {
      // 여러 형식 복사를 막는 브라우저도 있다. 그때는 마크다운만 넣는다. 그것도 막히면 넘어간다.
      if (!(await navigator.clipboard.writeText(markdown).then(() => true, () => false))) return;
    }
    setCopied('answer');
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div>
      <AnswerBody answer={answer} shown={shown} onAsk={onFollow} here={here} />

      {done && (
        <div className={instant ? undefined : 'animate-rise'}>
          {answer.projects?.view === 'list' && <ProjectList items={answer.projects.items} instant={instant} narrow={narrow} />}
          {answer.projects?.view === 'card' && answer.projects.items[0] && <ProjectCard project={answer.projects.items[0]} />}

          <div className="mt-4 flex flex-wrap gap-2 empty:hidden">
            {answer.copy && (
              <button type="button" onClick={() => copy(answer.copy!)} className={pill}>
                {copied === answer.copy ? '복사했습니다' : '메일 주소 복사'}
              </button>
            )}
            {answer.links.map((link) => (
              <ChipLink key={link.href} href={link.href} onAsk={onFollow} className={pill} inline={!narrow}>
                {link.label} →
              </ChipLink>
            ))}
            {answer.sources.map((source, i) =>
              here && source.href.split('#')[0] === here ? (
                <span key={source.href} className="whitespace-nowrap rounded-md bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-muted">
                  [{i + 1}] 이 페이지
                </span>
              ) : (
                <ChipLink key={source.href} href={source.href} onAsk={onFollow} className={pill} inline={!narrow}>
                  [{i + 1}] {source.title} →
                </ChipLink>
              ),
            )}
          </div>

          {/* AI 답변 아래의 작은 도구 줄. 답 복사와 누가 쓴 답인지 */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <button
              type="button"
              onClick={copyAnswer}
              aria-label={copied === 'answer' ? '복사했습니다' : '답변 복사'}
              className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-surface-2 hover:text-text"
            >
              <CopyIcon done={copied === 'answer'} />
            </button>
            {/* 직접 쓴 답은 매번 같으니 주소로 보낼 수 있다. Claude 답은 열 때마다 새로 쓰여 내용이 달라진다. */}
            {answer.source === 'prepared' && (
              <button
                type="button"
                onClick={() => copy(`${location.origin}${askHref(question)}`)}
                className="rounded-md px-2 py-1 transition-colors hover:bg-surface-2 hover:text-text"
              >
                {copied?.endsWith(askHref(question)) ? '링크를 복사했습니다' : '이 답 링크 복사'}
              </button>
            )}
          </div>

          {answer.follow.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="이어서 물어보기">
              {answer.follow.map((q) => (
                <li key={q}>
                  <button type="button" onClick={() => onFollow(q)} disabled={disabled} className={pill}>
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 흘러오는 AI 답 받기 ── */

/**
 * /api/ask가 한 줄에 하나씩 보내는 소식을 읽어, 지금까지 온 답을 onProgress로 넘긴다.
 * 출처 번호는 그 조각이 끝난 뒤에 붙인다. 쓰는 중인 문장 끝에 번호가 따라다니지 않게 한다.
 * 마지막 소식(done)의 최종 답을 돌려준다. done 없이 끊기면 실패로 본다.
 */
export async function readStream(res: Response, onProgress: (answer: AskAnswer) => void): Promise<AskAnswer> {
  if (!res.body) throw new Error('no body');
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  const draft: AskAnswer = { source: 'claude', segments: [], sources: [], links: [], follow: [] };
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) throw new Error('stream ended early');
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as AskStreamEvent;
      if (event.type === 'done') return event.answer;
      applyStreamEvent(draft, event);
    }
    const segments = cleanSegments(draft.segments).map((s, i, all) => (i === all.length - 1 ? { text: s.text } : s));
    // 첫 글자가 오기 전까지는 "생각하는 중" 표시를 그대로 둔다
    if (segments.some((s) => s.text.trim())) onProgress({ ...draft, segments, sources: [...draft.sources] });
  }
}

/* ── 아래로 내려가기 ── */

/**
 * 위로 올려 읽다가 대화 끝으로 돌아오는 버튼. AI 채팅 화면처럼 입력창 바로 위
 * 가운데에 뜨고, 끝에서 조금이라도 멀어졌을 때만 보인다. 답이 길어져 끝이
 * 밀려나는 경우도 있어서 스크롤뿐 아니라 내용 높이가 바뀔 때도 다시 잰다.
 */
function ScrollToBottom() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const gap = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setVisible(gap > 240);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const observer = new ResizeObserver(check);
    observer.observe(document.body);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      observer.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
      aria-label="대화 끝으로 이동"
      tabIndex={visible ? 0 : -1}
      className={`absolute -top-12 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-lg border border-border bg-surface text-muted shadow-sm transition-opacity duration-300 hover:border-accent hover:text-accent ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
      </svg>
    </button>
  );
}

/* ── 입력창 ── */

function Composer({
  value,
  onChange,
  onSubmit,
  placeholder,
  pending,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  placeholder: string;
  pending: boolean;
  inputRef: RefObject<HTMLInputElement>;
}) {
  const inputId = useId();
  return (
    <form
      onSubmit={onSubmit}
      // 포커스 표시는 바깥 둥근 테두리 하나로 한다. 안쪽 입력 칸에 전역 포커스 링까지 그리면 사각형이 겹쳐 보인다.
      className="flex items-center gap-2 rounded-xl border border-border bg-surface py-2 pl-5 pr-2 transition-colors focus-within:border-accent"
    >
      <label htmlFor={inputId} className="sr-only">
        이정준에게 질문하기
      </label>
      <input
        ref={inputRef}
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // 비어 있을 때 Tab을 누르면 흐린 예시 질문이 그대로 입력된다. 글자가 들어간 뒤의
        // Tab은 원래대로 다음 칸으로 넘어가므로, 키보드 이동이 막히지는 않는다.
        onKeyDown={(e) => {
          if (e.key === 'Tab' && !e.shiftKey && !value && placeholder) {
            e.preventDefault();
            onChange(placeholder);
          }
        }}
        placeholder={placeholder}
        aria-describedby={`${inputId}-hint`}
        maxLength={200}
        autoComplete="off"
        autoFocus
        className="peer min-w-0 flex-1 bg-transparent py-2 text-[1.0625rem] placeholder:text-muted/80 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {/* 입력창에 포커스가 있고 키보드가 있는 화면에서만 알려 준다. 휴대폰에는 Tab 키가 없다. */}
      <kbd
        id={`${inputId}-hint`}
        aria-label="Tab 키를 누르면 예시 질문이 입력됩니다"
        className={`shrink-0 rounded border border-border px-1.5 py-0.5 font-sans text-[0.6875rem] text-muted ${value ? 'hidden' : 'hidden sm:peer-focus:block'}`}
      >
        Tab
      </kbd>
      <button
        type="submit"
        disabled={pending || !value.trim()}
        aria-label="물어보기"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-85 disabled:bg-surface-2 disabled:text-muted disabled:opacity-100"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}

/* ── 화면 ── */

type Props = {
  /** 주소(/?q=)로 들어왔고 직접 쓴 답이 있으면 서버가 미리 찾아 넘긴다 */
  initial?: { question: string; answer: AskAnswer };
  /** 주소로 들어왔지만 직접 쓴 답이 없는 질문. 화면이 뜬 뒤 평소처럼 물어본다 */
  askOnLoad?: string;
};

export default function AskBox({ initial, askOnLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestion = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  /*
    대화 하나가 브라우저 기록 한 칸이다. 첫 질문을 할 때 한 칸을 쌓고, 이어지는
    질문은 그 칸의 주소만 바꾼다. 그래서 대화 중에 뒤로 가기를 누르면 사이트를
    떠나지 않고 검색창으로 돌아오고, 앞으로 가기를 누르면 대화가 그대로 돌아온다.
  */
  const [log, setLog] = useState<Entry[]>(initial ? [{ id: -1, ...initial, instant: true }] : []);
  const [inChat, setInChat] = useState(Boolean(initial));
  const entries = inChat ? log : [];
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0]);
  const nextId = useRef(0);
  const pending = entries.some((e) => !e.answer || e.live);
  const started = entries.length > 0;
  const last = entries.at(-1);
  const announcement = !last ? '' : !last.answer || last.live ? '답을 찾는 중입니다.' : last.answer.segments.map((s) => s.text).join('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => setPlaceholder(EXAMPLES[++i % EXAMPLES.length]), 2600);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const backToChat = (event.state as { askChat?: unknown } | null)?.askChat === true;
      // 앞으로 가기로 되살린 답은 이미 읽은 답이다. 글자가 다시 흘러나오지 않게 한다.
      if (backToChat) setLog((prev) => prev.map((e) => (e.answer ? { ...e, instant: true } : e)));
      setInChat(backToChat);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /*
    공유받은 주소(/?q=)로 바로 들어온 경우. 그대로 두면 뒤로 가기가 링크를 누른
    사이트로 가 버린다. 지금 칸을 검색창(/)으로 바꾸고 그 위에 대화 칸을 쌓아서,
    여기서도 뒤로 가기 한 번이면 검색창이 나오게 한다.
  */
  const enteredByLink = useRef(false);
  useEffect(() => {
    const question = initial?.question ?? askOnLoad;
    if (!question || enteredByLink.current) return;
    // 한 박자 늦춘다. Next 라우터는 자기 표시(__NA)를 기록에 남기는 일을 이 효과보다 늦게 하는데,
    // 그 표시가 없는 칸으로 뒤로 가면 Next가 페이지를 통째로 새로 읽는다.
    // 표시는 타이머 안에서 단다. 개발 모드는 효과를 한 번 지웠다 다시 돌리는데, 밖에서 달면 두 번째가 그냥 지나간다.
    const timer = setTimeout(() => {
      enteredByLink.current = true;
      window.history.replaceState({ askChat: false }, '', '/');
      window.history.pushState({ askChat: true }, '', askHref(question));
      // 직접 쓴 답이 없는 질문이면 이제 물어본다. 기록 칸은 방금 쌓았다.
      if (askOnLoad) ask(askOnLoad, { stacked: true });
    }, 0);
    return () => clearTimeout(timer);
    // 처음 한 번만 한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새 질문을 하면 그 질문이 화면 위쪽으로 올라오게 한다. 답이 그 아래로 흘러나온다.
  // 답이 도착할 때 한 번 더 확인한다 — 부드러운 스크롤이 도중에 끊기는 브라우저가 있다.
  const lastAnswered = Boolean(entries.at(-1)?.answer);
  useLayoutEffect(() => {
    const el = lastQuestion.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > 120) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [entries.length, lastAnswered]);

  async function ask(question: string, { stacked = false } = {}) {
    const q = question.trim();
    if (!q || pending) return;
    const id = nextId.current++;
    setValue('');
    if (inChat) {
      setLog((prev) => [...prev, { id, question: q }]);
    } else {
      // 검색창에서 새로 시작하는 대화. 앞서 닫은 대화는 버린다.
      setLog([{ id, question: q }]);
      setInChat(true);
    }
    // 지금 보고 있는 질문을 주소에 남긴다. 새로고침하거나 주소를 보내도 같은 질문이 열린다.
    // 기록 칸은 대화를 시작할 때만 쌓는다. Next가 history.pushState를 감싸 두어서 직접 불러도 라우터와 어긋나지 않는다.
    window.history[inChat || stacked ? 'replaceState' : 'pushState']({ askChat: true }, '', askHref(q));
    inputRef.current?.focus();

    const update = (patch: Partial<Entry>) => setLog((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    let answer: AskAnswer;
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      answer = res.headers.get('Content-Type')?.includes('ndjson') ? await readStream(res, (live) => update({ answer: live, live: true })) : await res.json();
      if (!answer.segments) throw new Error('bad response');
    } catch {
      answer = { source: 'notice', segments: [{ text: '연결이 잠시 끊겼습니다. 다시 시도해 주세요.' }], sources: [], links: [], follow: [] };
    }
    // 흘러온 답은 이미 다 보였다. 최종 답으로 갈아 끼울 때 글자가 다시 흘러나오지 않게 한다.
    update({ answer, live: false, ...(answer.source === 'claude' ? { instant: true } : {}) });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(value);
  }

  const composer = (
    <Composer value={value} onChange={setValue} onSubmit={onSubmit} placeholder={placeholder} pending={pending} inputRef={inputRef} />
  );

  /** 검색창으로 돌아가기. 뒤로 가기와 같은 동작이라, 앞으로 가기로 방금 대화에 돌아올 수 있다. */
  function reset() {
    if ((window.history.state as { askChat?: unknown } | null)?.askChat === true) window.history.back();
    else setInChat(false);
  }

  const textLink = 'font-medium text-muted transition-colors hover:text-accent';
  const quickLinks = (
    <>
      <a href={RESUME_URL} target="_blank" rel="noreferrer" className={textLink}>
        이력서 PDF
      </a>
      <CopyEmailButton className={textLink} />
      <a href={CONTACT.github} target="_blank" rel="noreferrer" className={textLink}>
        GitHub
      </a>
    </>
  );

  if (!started) {
    // 정가운데에 두면 눈이 가는 입력창이 화면 중심보다 아래에 놓여 처져 보인다. 아래 여백으로 묶음을 화면 높이의 12%만큼 올려
    // 입력창이 위에서 44% 안팎에 오게 한다.
    return (
      <section className="relative mx-auto flex min-h-[100svh] max-w-intro flex-col justify-center px-5 pb-[24svh] lg:px-0">
        <div className="animate-rise">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-black leading-[1.2] tracking-[-0.03em]">
            안녕하세요, 이정준입니다.
            <br />
            <span className="text-accent">무엇이든 물어보세요.</span>
          </h1>
          <div className="mt-8">{composer}</div>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="질문 예시">
            {STARTERS.map((q) => (
              <li key={q}>
                <button type="button" onClick={() => ask(q)} className={chip}>
                  {q}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted">{RECORD_NOTICE}</p>
        </div>
        {/* 질문하지 않고 훑으려는 사람을 위한 길. 화면을 옮기지 않고 같은 대화로 연다. */}
        <nav aria-label="질문 없이 둘러보기" className="absolute inset-x-5 bottom-8 flex flex-wrap gap-x-5 gap-y-2 text-sm lg:inset-x-0">
          <button type="button" onClick={() => ask(ASK.projects)} className={textLink}>
            프로젝트 전체 보기 →
          </button>
          {quickLinks}
        </nav>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-chat px-5 xl:px-0">
      {/* 대화 중에도 누구의 사이트인지, 이력서와 연락처가 어디인지 보이게 한다 */}
      <div className="flex h-16 items-center justify-between gap-4 text-sm">
        <button type="button" onClick={reset} className="font-bold tracking-tight transition-colors hover:text-accent">
          leejj.dev
        </button>
        <div className="flex gap-4">{quickLinks}</div>
      </div>

      {/*
        화면 낭독기에 알리는 자리는 대화 목록과 따로 둔다. 목록 전체를 알림 영역으로 두면
        글자가 늘 때마다 같은 답을 처음부터 다시 읽는다. 여기서는 답이 다 온 뒤 한 번만 읽힌다.
      */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <ol className="space-y-10 pb-48 pt-6">
        {entries.map(({ id, question, answer, instant, live }, i) => (
          // 마지막 대화는 화면 높이만큼 자리를 잡는다. 그래야 대화가 짧아도 새 질문이 화면 위쪽까지 올라온다.
          <li key={id} className={i === entries.length - 1 ? 'min-h-[calc(100svh-14rem)]' : undefined}>
            <div ref={i === entries.length - 1 ? lastQuestion : undefined} className="flex scroll-mt-6 justify-end">
              <p className="max-w-[85%] rounded-lg bg-surface-2 px-4 py-2.5 leading-relaxed">{question}</p>
            </div>
            <div className="mt-5">{answer ? <Answer question={question} answer={answer} instant={instant} live={live} onFollow={ask} disabled={pending} /> : <Thinking />}</div>
          </li>
        ))}
      </ol>

      {/* 화면 아래에 붙는 입력창. 위로 지나가는 대화가 비치지 않게 바닥색을 깐다 */}
      <div className="fixed inset-x-0 bottom-0 bg-bg pb-5 pt-3">
        <div className="relative mx-auto max-w-chat px-5 xl:px-0">
          <ScrollToBottom />
          {composer}
          <p className="mt-2.5 text-center text-xs text-muted">
            모든 답은 실제 경력과 프로젝트 기록을 근거로 합니다. {RECORD_NOTICE}
          </p>
        </div>
      </div>
    </section>
  );
}
