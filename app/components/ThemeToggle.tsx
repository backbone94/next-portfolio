'use client';

import { useEffect, useState } from 'react';
import { DARK_THEME_QUERY, THEME_STORAGE_KEY } from '../lib/theme';

function hasDarkTheme(root: HTMLElement) {
  return root.dataset.theme === 'dark' || (!root.dataset.theme && root.hasAttribute('data-system-dark'));
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const system = window.matchMedia(DARK_THEME_QUERY);
    const syncSystem = () => {
      root.toggleAttribute('data-system-dark', system.matches);
      setIsDark(hasDarkTheme(root));
    };
    const syncPreference = ({ key, newValue }: StorageEvent) => {
      if (key !== THEME_STORAGE_KEY && key !== null) return;
      if (newValue === 'dark' || newValue === 'light') root.dataset.theme = newValue;
      else root.removeAttribute('data-theme');
      setIsDark(hasDarkTheme(root));
    };

    syncSystem();
    system.addEventListener('change', syncSystem);
    window.addEventListener('storage', syncPreference);
    return () => {
      system.removeEventListener('change', syncSystem);
      window.removeEventListener('storage', syncPreference);
    };
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const next = hasDarkTheme(root) ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장할 수 없는 환경에서도 현재 페이지에서는 테마를 전환한다.
    }
    setIsDark(next === 'dark');
  }

  const label = isDark ? '라이트 모드로 전환' : '다크 모드로 전환';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        {isDark ? (
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
