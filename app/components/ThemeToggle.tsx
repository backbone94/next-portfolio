'use client';

import { useEffect, useState } from 'react';

/**
 * 다크가 기본, 라이트는 선택. layout의 인라인 스크립트가 첫 페인트 전에
 * 클래스를 정하므로 여기서는 이후 전환만 담당한다.
 */
export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isLight;
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {
      /* 저장 실패해도 이번 세션 전환은 유효하다 */
    }
    setIsLight(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && isLight ? '어두운 테마로 전환' : '밝은 테마로 전환'}
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {/* 마운트 전에는 어느 쪽도 단정하지 않아 하이드레이션 불일치를 피한다 */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden
      >
        {mounted && isLight ? (
          <>
            <circle cx="8" cy="8" r="3.1" />
            <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13M12.95 12.95l-1.13-1.13M4.18 4.18L3.05 3.05" />
          </>
        ) : (
          <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.9 5.9 0 1 0 7.1 7.1z" />
        )}
      </svg>
    </button>
  );
}
