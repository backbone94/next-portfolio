'use client';

import { useEffect, useRef, useState } from 'react';
import { GUIDE_EVENT, GUIDE_LINES, type GuideCue, type GuideMessage } from '../lib/guide';
import JunFace from './JunFace';
import styles from './RobotGuide.module.css';

/** 안내 로봇의 이름. 대화 화면의 프로필과 말풍선 자기소개에 같이 쓴다. */
export const GUIDE_NAME = 'Jun';

/**
 * 질문을 기다리는 동안 차례로 돌아가며 하는 말. 가만히 두면 TALK_EVERY마다, 로봇을 누르면 바로 다음 말로 넘어간다.
 * 첫 말은 기다리는 상황의 기본 문구(GUIDE_LINES.ask)다.
 */
const TALK_LINES = [GUIDE_LINES.ask, '반가워요! 👋', `저는 이 사이트를 안내하는 ${GUIDE_NAME} 이에요`, '궁금한 게 있으면 아래에 적어 주세요'];

/** 말이 저절로 바뀌는 간격. 입력창의 예시 질문(2.6초)보다 훨씬 느리게 두어 둘이 같이 깜빡거리지 않게 한다. */
const TALK_EVERY = 6000;

/** 뒤에 점이 하나씩 늘어나는(. .. ...) 상황. 듣거나 찾는 중이라 기다리는 느낌을 준다. */
const DOTTED = new Set<GuideCue>(['typing', 'thinking']);

/** say()로 전달된 상황이 있으면 말풍선에 잠시 먼저 표시한다. */
export default function RobotGuide({ cue }: { cue: GuideCue }) {
  const [override, setOverride] = useState<GuideCue | null>(null);
  const [dots, setDots] = useState(1);
  const current = override ?? cue;
  const pokes = useRef(0);
  const [greetingCount, setGreetingCount] = useState(0);
  const [poke, setPoke] = useState<{ id: number; line: string } | null>(null);
  const [turn, setTurn] = useState(0);
  // 질문을 기다리는 중이고 다른 반응(마우스 올리기·복사 등)이 없을 때만 말이 저절로 돈다
  const idle = !override && !poke && cue === 'ask';

  useEffect(() => {
    if (!idle) return;
    // 누를 때마다 turn이 바뀌어 이 타이머도 새로 잡힌다. 누른 뒤 바로 다음 말로 넘어가 버리지 않는다.
    const timer = setTimeout(() => setTurn((n) => n + 1), TALK_EVERY);
    return () => clearTimeout(timer);
  }, [idle, turn]);

  // 기다리는 중이 아닐 때(답을 찾는 중, 입력 중 등) 누른 말은 2.4초 동안 보이고, 그 뒤에는 원래 상황 문구로 돌아간다.
  useEffect(() => {
    if (!poke) return;
    const timer = setTimeout(() => setPoke(null), 2400);
    return () => clearTimeout(timer);
  }, [poke]);

  function onPoke() {
    setGreetingCount(count => count + 1);
    const next = turn + 1;
    setTurn(next);
    if (!idle) setPoke({ id: pokes.current++, line: TALK_LINES[next % TALK_LINES.length] });
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onSay = (event: Event) => {
      const { cue, ms } = (event as CustomEvent<GuideMessage>).detail;
      clearTimeout(timer);
      setOverride(cue);
      if (cue && ms) timer = setTimeout(() => setOverride(null), ms);
    };
    window.addEventListener(GUIDE_EVENT, onSay);
    return () => {
      window.removeEventListener(GUIDE_EVENT, onSay);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!DOTTED.has(current)) return;
    const timer = setInterval(() => setDots((n) => (n % 3) + 1), 380);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className={`flex min-w-0 select-none flex-col items-center gap-2 ${styles.artwork}`}>
      <div className="relative w-[150px] pb-2 sm:w-[200px]">
        <span aria-hidden className={`pointer-events-none absolute inset-x-1/4 bottom-0 h-[13%] rounded-[50%] motion-safe:animate-[guide-shadow_3.22s_ease-in-out_infinite] ${styles.shadow}`} />
        <button
          type="button"
          aria-label="Jun에게 인사하기"
          onClick={onPoke}
          className="relative block aspect-[7/5] w-full cursor-pointer touch-manipulation rounded-2xl"
        >
          <JunFace greetingCount={greetingCount} />
        </button>
      </div>
      <p
        aria-hidden="true"
        className="relative max-w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-center text-sm font-medium leading-snug text-text"
      >
        <span aria-hidden className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-border bg-surface" />
        <span key={poke ? `poke-${poke.id}` : idle ? `talk-${turn}` : current} className="relative block animate-[guide-in_0.25s_ease-out]">
          {poke ? poke.line : idle ? TALK_LINES[turn % TALK_LINES.length] : GUIDE_LINES[current]}
          {!poke && DOTTED.has(current) && <span className="inline-block w-[1.2em] text-left">{'.'.repeat(dots)}</span>}
        </span>
      </p>
    </div>
  );
}

/** 최신 답변에만 Three.js를 붙이고, 앞선 답변은 같은 모습의 렌더 이미지로 보여 준다. */
export function RobotAvatar({ active, className = '' }: { active: boolean; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 items-center ${styles.artwork} ${className}`}>
      <span className="relative block aspect-[7/5] w-full">
        {active ? <JunFace /> : <span className={`${styles.fallback} ${styles.avatarIdle}`} />}
      </span>
    </span>
  );
}
