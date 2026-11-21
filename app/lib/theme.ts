export const THEME_STORAGE_KEY = 'theme';
export const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

// CSS가 그려지기 전에 저장된 선택과 시스템 테마를 읽는다.
export const THEME_SCRIPT = `(() => {
  const root = document.documentElement;
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  root.toggleAttribute('data-system-dark', matchMedia(${JSON.stringify(DARK_THEME_QUERY)}).matches);
})();`;
