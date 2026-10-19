'use client';

import { useEffect, useRef, useState } from 'react';
import { GUIDE_EVENT, GUIDE_LINES, type GuideCue, type GuideMessage } from '../lib/guide';

/**
 * 손을 흔드는 안내 로봇. 지금 상황에 맞는 말을 오른쪽 말풍선에 띄운다.
 *
 * 영상 없이 그림 한 장을 층으로 나눠 CSS로 움직인다(public/guide/robot-*.webp).
 * - 몸통: 위아래로 떠다니고, 발밑을 축으로 좌우로 살짝 기운다. 바닥 그림자는 떠오를 때 작아진다.
 * - 손: 손목 띠 바로 위에서 잘라 낸 손을 띠 윗변 가운데를 축으로 흔든다. 평소에는 가만히 있고, 로봇을 누를 때만 흔든다.
 *   몸통 층에서는 손을 지우고 띠는 남겨 두었다.
 * - 눈: 따로 떼어 낸 눈을 세로로 납작하게 눌러 깜빡인다. 몸통 층의 눈 자리는 고글 색으로 메워 두었다.
 *
 * 몸통과 손은 바탕이 투명한 그림이다. 처음에는 흰 바탕 그림에 곱하기 혼합을 걸었는데, 움직이는 층에서는
 * 브라우저가 혼합을 풀어 버려 손을 흔들 때마다 흰 직사각형이 같이 움직였다.
 */

/** 손이 도는 축(손목 띠 윗변 가운데). 그림 틀 폭·높이에 대한 %다. 그림을 다시 자르면 다시 잰다. */
const WRIST = '16.34% 46.15%';

/** 떼어 낸 눈 그림의 자리와 크기(그림 틀 폭·높이에 대한 %) */
const EYES = [
  { name: 'left', left: '39.01%', top: '21.49%' },
  { name: 'right', left: '63.27%', top: '25.17%' },
];
const EYE_SIZE = { width: '12.67%', height: '10.96%' };

/** 안내 로봇의 이름. 대화 화면의 프로필과 말풍선 자기소개에 같이 쓴다. */
export const GUIDE_NAME = 'Jun';

/**
 * 질문을 기다리는 동안 차례로 돌아가며 하는 말. 가만히 두면 TALK_EVERY마다, 로봇을 누르면 바로 다음 말로 넘어간다.
 * 첫 말은 기다리는 상황의 기본 문구(GUIDE_LINES.ask)다.
 */
const TALK_LINES = [GUIDE_LINES.ask, '반가워요! 👋', `저는 이 사이트를 안내하는 ${GUIDE_NAME}이에요`, '궁금한 게 있으면 아래에 적어 주세요'];

/** 말이 저절로 바뀌는 간격. 입력창의 예시 질문(2.6초)보다 훨씬 느리게 두어 둘이 같이 깜빡거리지 않게 한다. */
const TALK_EVERY = 6000;

/** 누르면 손을 두 번 흔들고 내린다. */
const WAVE: Keyframe[] = [
  { transform: 'rotate(0)' },
  { transform: 'rotate(-14deg)', offset: 0.22 },
  { transform: 'rotate(8deg)', offset: 0.45 },
  { transform: 'rotate(-12deg)', offset: 0.69 },
  { transform: 'rotate(5deg)', offset: 0.87 },
  { transform: 'rotate(0)' },
];

/** 뒤에 점이 하나씩 늘어나는(. .. ...) 상황. 듣거나 찾는 중이라 기다리는 느낌을 준다. */
const DOTTED = new Set<GuideCue>(['typing', 'thinking']);

/** 말풍선 꼬리. 로봇 쪽(왼쪽)을 가리킨다. 테두리 두 변만 그려 말풍선 테두리와 이어지게 한다. */
const TAIL = 'left-0 top-4 -translate-x-1/2 rotate-45 border-b border-l';

/**
 * cue: 지금 상황. say()로 온 상황이 있으면 그쪽이 잠시 앞선다.
 * 말풍선은 로봇 오른쪽에 붙고, sm 이상에서 늘 한 줄로 둔다. 휴대폰은 로봇 옆 자리가 좁아 화면 끝에서 줄을 바꾼다.
 * className: 자리와 폭(w-…)을 정한다. 그림과 움직임은 모두 이 폭에 대한 비율이라 폭만 바꾸면 된다.
 */
export default function RobotGuide({ cue, className = '' }: { cue: GuideCue; className?: string }) {
  const [override, setOverride] = useState<GuideCue | null>(null);
  const [dots, setDots] = useState(1);
  const current = override ?? cue;
  const handRef = useRef<HTMLImageElement>(null);
  const pokes = useRef(0);
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
    const next = turn + 1;
    setTurn(next);
    if (!idle) setPoke({ id: pokes.current++, line: TALK_LINES[next % TALK_LINES.length] });
    // 동작 줄이기를 켜면 말만 바꾸고 손은 흔들지 않는다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    handRef.current?.animate(WAVE, { duration: 1300, easing: 'ease-in-out' });
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
    // 자리 잡기(absolute 등)와 폭은 바깥 틀이 받는다. 그림자는 그 안의 relative 틀을, 말풍선은 기울기 틀을 기준으로 붙는다.
    <div aria-hidden className={`select-none ${className}`}>
      {/* 아래 여백은 그림자 자리다. 로봇이 떠오르면 발과 그림자 사이가 벌어진다. */}
      <div className="relative pb-[7%]">
        <span className="absolute bottom-[2%] left-[24%] h-[5%] w-[50%] animate-[guide-shadow_3.2s_ease-in-out_infinite] rounded-[50%] bg-[radial-gradient(closest-side,rgb(10_12_18/0.2),transparent)]" />

        {/* 떠다니는 틀. 로봇과 말풍선이 함께 오르내린다. */}
        <div className="relative animate-[guide-float_3.2s_ease-in-out_infinite]">
          <div className="animate-[guide-sway_4.8s_ease-in-out_infinite] [transform-origin:50%_100%]">
            {/* 누르면 반응하는 자리. 장식이라 화면 낭독기와 키보드 이동에서는 빠진다(바깥 틀이 aria-hidden). */}
            <div onClick={onPoke} className="relative aspect-[1010/1168] cursor-pointer touch-manipulation">
              {/* eslint-disable-next-line @next/next/no-img-element -- 층을 정확히 겹쳐야 해서 next/image의 감싸는 요소를 피한다 */}
              <img src="/guide/robot-body.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
              {EYES.map(({ name, ...at }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={name}
                  src={`/guide/robot-eye-${name}.webp`}
                  alt=""
                  draggable={false}
                  className="absolute animate-[guide-blink_4.2s_ease-in-out_infinite]"
                  style={{ ...at, ...EYE_SIZE }}
                />
              ))}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={handRef}
                src="/guide/robot-hand.webp"
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={{ transformOrigin: WRIST }}
              />
            </div>

            {/*
              말풍선은 기울기 틀 안에 두어 로봇 머리와의 거리를 늘 같게 유지한다. 틀 밖에 두면 머리가 말풍선 쪽으로 기울 때 둘이 겹친다.
              말풍선 자체는 같은 주기로 반대로 돌려(guide-sway-counter) 글자가 기울지 않게 한다.
            */}
            <p
              className={`absolute w-max animate-[guide-sway-counter_4.8s_ease-in-out_infinite] rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium leading-snug text-text shadow-sm ${'left-[98%] top-[7%] max-w-[calc(100vw-13rem)] sm:max-w-none sm:whitespace-nowrap'}`}
            >
              <span aria-hidden className={`absolute h-2.5 w-2.5 border-border bg-surface ${TAIL}`} />
              <span key={poke ? `poke-${poke.id}` : idle ? `talk-${turn}` : current} className="relative block animate-[guide-in_0.25s_ease-out]">
                {poke ? poke.line : idle ? TALK_LINES[turn % TALK_LINES.length] : GUIDE_LINES[current]}
                {/* 점이 늘어날 때 말풍선 폭이 흔들리지 않게 점 세 개 자리를 잡아 둔다 */}
                {!poke && DOTTED.has(current) && <span className="inline-block w-[1.2em] text-left">{'.'.repeat(dots)}</span>}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 대화 화면의 프로필. 메신저처럼 답변마다 왼쪽에 얼굴이 붙는다.
 * busy: 답을 찾는 동안 첫 화면의 로봇처럼 위아래로 떠다닌다.
 */
export function RobotAvatar({ busy = false, className = '' }: { busy?: boolean; className?: string }) {
  return (
    <span aria-hidden className={`block shrink-0 overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <span className={`block h-full w-full ${busy ? 'animate-[guide-float_1.6s_ease-in-out_infinite]' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 작은 고정 크기라 next/image의 최적화가 필요 없다 */}
        <img src="/guide/robot-avatar.webp" alt="" draggable={false} className="h-full w-full" />
      </span>
    </span>
  );
}
