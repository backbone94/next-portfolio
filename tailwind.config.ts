import type { Config } from "tailwindcss";

/** globals.css의 CSS 변수를 그대로 읽는다. 테마 토글이 클래스 하나로 끝난다. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        text: token('text'),
        muted: token('muted'),
        border: token('border'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
      },
      borderColor: {
        DEFAULT: token('border'),
      },
      fontWeight: {
        /* Wanted Sans는 400–1000 가변. 위계를 색이 아니라 무게로 만든다. */
        book: '450',
        medium: '550',
        bold: '700',
        black: '860',
      },
      maxWidth: {
        shell: '78rem',
        prose: '42rem',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        /* 히어로 하단 스크롤 안내. 6px만 움직인다 — 눈에 걸리되 시선을 끌진 않게. */
        'scroll-cue': {
          '0%, 100%': { opacity: '0.55', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(6px)' },
        },
      },
      animation: {
        rise: 'rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
