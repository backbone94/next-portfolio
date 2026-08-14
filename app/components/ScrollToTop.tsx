'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/hashHighlight';

/** 한 화면 정도 내려가야 나타난다. 첫 화면부터 떠 있으면 필요 없을 때도 시야를 가린다. */
const SHOW_THRESHOLD = 600;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      /* 페이지 끝에서 맨 위까지는 이동 거리가 가장 길다. 동작 축소를 요청한
         사용자에게는 그만큼 부담이 커지므로 즉시 이동으로 바꾼다. */
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
      aria-label="맨 위로 이동"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted shadow-sm transition-opacity duration-300 hover:border-accent hover:text-accent md:bottom-8 md:right-8 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
