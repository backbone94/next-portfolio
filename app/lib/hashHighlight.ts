const HIGHLIGHT_CLASS = 'animate-focus-pulse';
/** scrollend 미지원 브라우저나, 이미 화면 안이라 스크롤이 아예 안 걸리는 경우의 안전망 */
const FALLBACK_DELAY_MS = 600;

function pulse(el: HTMLElement) {
  // 같은 카드를 다시 봐도 재생되도록, 뗐다가 리플로우를 강제한 뒤 다시 붙인다.
  el.classList.remove(HIGHLIGHT_CLASS);
  void el.offsetWidth;
  el.classList.add(HIGHLIGHT_CLASS);
  el.addEventListener('animationend', () => el.classList.remove(HIGHLIGHT_CLASS), { once: true });
}

/**
 * id로 스크롤한 뒤, 스크롤이 실제로 끝난 시점에만 펄스를 재생한다.
 * scrollIntoView 호출 직후 곧바로 펄스를 걸면 도착하기도 전에 애니메이션이
 * 끝나 보이므로, scrollend를 기다리고 없는 브라우저는 타임아웃으로 대신한다.
 */
export function runHashHighlight(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  let started = false;
  const begin = () => {
    if (started) return;
    started = true;
    pulse(el);
  };

  window.addEventListener('scrollend', begin, { once: true });
  setTimeout(begin, FALLBACK_DELAY_MS);
}
