'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** 순차 등장을 위한 지연(초). 목록에서 index로 계산해 넘긴다. */
  delay?: number;
  className?: string;
  id?: string;
  /** "/#id"로 도착했을 때 강조 대상으로 삼을지. 표시가 없으면 기본 앵커 이동만 한다. */
  hashHighlight?: boolean;
};

/**
 * 스크롤로 들어올 때 한 번만 재생되는 등장 효과.
 *
 * 의도적으로 절제했다. 모든 요소에 fade-in-up을 거는 건 AI가 만든 티가 나는
 * 대표 패턴이라, 실제로 "차례로 도착하는" 것이 내용상 참인 곳
 * (프로젝트 카드, 경력 목록)에만 쓴다. 섹션 제목처럼 구조에 해당하는 것은
 * 움직이지 않는다.
 *
 * 한때 Section이 제목을, Skill·Education이 내용 전체를 이걸로 감싸고 있었다.
 * 그 상태에서는 홈의 거의 모든 덩어리가 스크롤마다 올라와서 페이지가 끝내
 * 안착하지 않았고, "차례로 도착한다"는 뜻도 같이 사라졌다. 위 규칙대로
 * 되돌렸다 — 지금 움직이는 것은 프로젝트 카드와 경력 두 곳뿐이다.
 *
 * 실제 거리·시간(20px / 0.9s)은 globals.css의 [data-reveal]에 있다.
 *
 * Motion(구 Framer Motion)을 먼저 붙여 봤으나 First Load JS가 99KB에서
 * 140KB로 늘었다. 페이드 하나에 41KB는 값이 맞지 않아, 실제 동작은
 * CSS 트랜지션에 맡기고 여기서는 화면에 들어왔다는 사실만 알린다.
 * 더 복잡한 안무(경로 애니메이션, 제스처)가 필요해지면 그때 라이브러리를
 * 다시 검토하면 된다.
 *
 * 상태는 클래스로만 바꾸고 스타일은 globals.css의 [data-reveal]이 갖는다.
 */
/**
 * 요소의 위쪽 모서리가 화면 높이의 70% 지점까지 올라와야 재생한다.
 *
 * 처음엔 12%만 잘라 뒀는데, 그러면 첫 화면에서 130px 남짓만 스크롤해도
 * 아래 프로젝트 카드가 움직이기 시작했다. 아직 히어로를 보고 있는 사람에게
 * 화면 밖 어딘가가 꿈틀거리는 셈이라 어색했다. 30%까지 늘리면 히어로를
 * 확실히 지나온 뒤에야 재생된다.
 *
 * 대신 문서 맨 아래 요소가 그 지점까지 못 올라오는 경우가 생기는데,
 * 아래 useEffect에서 그런 요소는 지연 없이 바로 보여 준다.
 */
const REVEAL_THRESHOLD = 0.7;
const REVEAL_ROOT_MARGIN = `0px 0px -${100 - REVEAL_THRESHOLD * 100}% 0px`;

export default function Reveal({ children, delay = 0, className, id, hashHighlight }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.dataset.revealed = 'true';
    };

    // 지원하지 않는 환경에서는 숨긴 채로 두지 않는다.
    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return;
    }

    // 이미 화면 안이면 관찰자를 기다리지 않는다. 첫 화면 콘텐츠가 빨리 뜨고,
    // 탭이 백그라운드라 콜백이 지연되는 상황에서도 내용이 잠기지 않는다.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
      return;
    }

    // 문서 끝까지 내려도 재생 지점에 닿지 못하는 요소는 지금 보여준다.
    // 문턱을 화면의 70%로 올린 대가다. 목록이 필터로 짧아지면 마지막 요소가
    // 그 선까지 올라오지 못한 채 남을 수 있는데, 읽을 수 없게 두는 것보다
    // 애니메이션을 건너뛰는 편이 낫다.
    const remainingScroll =
      document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (rect.top - remainingScroll >= window.innerHeight * REVEAL_THRESHOLD) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect(); // 한 번 나타나면 다시 감시하지 않는다
      },
      { rootMargin: REVEAL_ROOT_MARGIN }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-reveal
      data-hash-highlight={hashHighlight || undefined}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
