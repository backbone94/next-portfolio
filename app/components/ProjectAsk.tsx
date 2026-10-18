'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { RECORD_NOTICE } from '../content/site';
import type { AskAnswer } from '../lib/ask/types';
import { Answer, Thinking, chip, readStream } from './AskBox';

/**
 * 상세 페이지 옆 칸의 작은 대화창. 본문을 읽다가 그 자리에서 이 프로젝트를 물어본다.
 *
 * 첫 화면 대화와 같은 답 화면(Answer)을 쓰고, 그 프로젝트에 대해서만 답한다. 다른 프로젝트와 경력은
 * 서버가 그 페이지나 첫 화면으로 안내한다. "여기서 제일 힘들었던 건?"처럼 짧게 물어도 된다. 대화는 이 페이지에만
 * 있고 주소에 남기지 않는다. 페이지를 닫으면 사라진다.
 */

type Entry = {
  id: number;
  question: string;
  answer?: AskAnswer;
  live?: boolean;
  instant?: boolean;
};

const FAILED: AskAnswer = {
  source: 'notice',
  segments: [{ text: '연결이 잠시 끊겼습니다. 다시 시도해 주세요.' }],
  sources: [],
  links: [],
  follow: [],
};

export default function ProjectAsk({ slug, title }: { slug: string; title: string }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLOListElement>(null);
  const [value, setValue] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const nextId = useRef(0);
  const pending = entries.some((e) => !e.answer || e.live);
  const last = entries.at(-1);
  const announcement = !last ? '' : !last.answer || last.live ? '답을 찾는 중입니다.' : last.answer.segments.map((s) => s.text).join('');

  /*
    칸은 내용만큼 자라다가 최대 높이에서 멈추고, 그다음부터는 칸 안에서 스크롤된다.
    대화가 칸을 넘치면 새 질문을 칸 위쪽으로 올린다. 답은 그 아래로 흘러나온다.
    넘치기 전에는 다 보이니 움직이지 않는다. 답이 흘러오며 넘치는 순간도 있어서 크기 변화를 지켜본다.
    질문 하나에 한 번만 올린다. 읽으려고 위로 올린 화면을 다시 끌어내리지 않는다.
  */
  const lifted = useRef<number | null>(null);
  const lastId = last?.id;
  useEffect(() => {
    const list = scroller.current;
    const item = list?.lastElementChild as HTMLElement | null;
    if (!list || !item || lastId === undefined) return;
    const lift = () => {
      if (lifted.current === lastId || list.scrollHeight <= list.clientHeight) return;
      lifted.current = lastId;
      // 마지막 질문이 칸 높이만큼 자리를 잡아야 답이 짧아도 칸 위쪽까지 올라간다
      item.style.minHeight = `${list.clientHeight}px`;
      // 부드러운 스크롤은 답이 흘러오며 내용이 바뀌는 사이에 끊긴다. 칸 안의 짧은 거리라 바로 옮긴다.
      list.scrollTop += item.getBoundingClientRect().top - list.getBoundingClientRect().top;
    };
    lift();
    const observer = new ResizeObserver(lift);
    observer.observe(item);
    return () => {
      observer.disconnect();
      // 다음 질문이 오면 이 자리는 내용만큼으로 돌아간다. 지난 대화 사이에 빈칸이 남지 않게 한다.
      // 표시도 함께 지운다. 개발 모드는 효과를 한 번 지웠다 다시 돌리는데, 표시가 남으면 두 번째에 올리지 않는다.
      item.style.minHeight = '';
      lifted.current = null;
    };
  }, [lastId]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || pending) return;
    const id = nextId.current++;
    setValue('');
    setEntries((prev) => [...prev, { id, question: q }]);
    // 시작 질문 버튼은 누르면 사라진다. 포커스가 페이지 처음으로 튀지 않게 입력창으로 옮긴다. 페이지는 움직이지 않는다.
    // 터치 화면은 빼 둔다. 입력창에 포커스가 가면 키보드가 올라와 흘러나오는 답을 가린다.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });

    const update = (patch: Partial<Entry>) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    let answer: AskAnswer;
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, project: slug }),
      });
      answer = res.headers.get('Content-Type')?.includes('ndjson')
        ? await readStream(res, (live) => update({ answer: live, live: true }))
        : await res.json();
      if (!answer.segments) throw new Error('bad response');
    } catch {
      answer = FAILED;
    }
    update({
      answer,
      live: false,
      ...(answer.source === 'claude' ? { instant: true } : {}),
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(value);
  }

  const starters = ['가장 어려웠던 점은?', '맡은 역할은?', '결과는 어땠어요?'];

  return (
    <section
      aria-labelledby={`${inputId}-title`}
      // 최대 높이는 600px와 화면 높이 중 작은 쪽이다. 칸이 화면 위에 붙어 있을 때 입력창이 늘 보인다.
      className="flex max-h-[min(37.5rem,calc(100svh-8rem))] flex-col rounded-xl border border-border bg-surface"
    >
      <h2 id={`${inputId}-title`} className="px-5 pt-5 text-[0.9375rem] font-bold">
        이 프로젝트에 대해 물어보기
      </h2>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {entries.length === 0 ? (
        <div className="px-5 pt-2">
          {/* 이 칸이 답하는 범위를 처음부터 알린다. 다른 질문은 첫 화면에서 받는다. */}
          <p className="text-sm leading-relaxed text-muted">
            읽다가 궁금한 점을 바로 물어보세요. 이 대화창은 이 프로젝트에 대해서만 답합니다. 다른 프로젝트나 경력은{' '}
            <a href="/" className="underline underline-offset-4 transition-colors hover:text-accent">
              첫 화면
            </a>
            에서 물어봐 주세요.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="질문 예시">
            {starters.map((q) => (
              <li key={q}>
                <button type="button" onClick={() => ask(q)} className={chip}>
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol ref={scroller} className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain px-5 pt-4 text-[0.9375rem]">
          {entries.map(({ id, question, answer, live, instant }) => (
            <li key={id}>
              <div className="flex justify-end">
                <p className="max-w-[90%] rounded-lg bg-surface-2 px-3.5 py-2 leading-relaxed">{question}</p>
              </div>
              <div className="mt-4">
                {answer ? (
                  <Answer
                    // 직접 쓴 답은 쓴 질문 그대로 분류해 찾았다. 답 링크도 그 질문으로 만든다.
                    question={question}
                    answer={answer}
                    instant={instant}
                    live={live}
                    onFollow={ask}
                    disabled={pending}
                    narrow
                    here={`/projects/${slug}`}
                  />
                ) : (
                  <Thinking />
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      <form
        onSubmit={onSubmit}
        className="m-3 mt-4 flex items-center gap-2 rounded-lg border border-border bg-bg py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-accent"
      >
        <label htmlFor={inputId} className="sr-only">
          {title}에 대해 질문하기
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="이 프로젝트에 대해 물어보세요"
          maxLength={200}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.9375rem] placeholder:text-muted/80 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <button
          type="submit"
          disabled={pending || !value.trim()}
          aria-label="물어보기"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-ink transition-opacity hover:opacity-85 disabled:bg-surface-2 disabled:text-muted disabled:opacity-100"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
      <p className="mx-4 -mt-1 mb-3 text-xs text-muted">{RECORD_NOTICE}</p>
    </section>
  );
}
