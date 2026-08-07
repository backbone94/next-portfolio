const HIGHLIGHT_CLASS = 'animate-focus-pulse';
/** 스크롤이 멈췄는지 확인하는 간격과, 몇 번 연속 같아야 멈춘 것으로 볼지 */
const SETTLE_INTERVAL_MS = 100;
const SETTLE_TICKS = 2;
/** 그래도 안 끝나면 여기서 끊는다. 무한정 기다리는 것보다 늦게라도 재생하는 편이 낫다. */
const SETTLE_TIMEOUT_MS = 2000;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function pulse(el: HTMLElement) {
  // 같은 카드를 다시 봐도 재생되도록, 뗐다가 리플로우를 강제한 뒤 다시 붙인다.
  el.classList.remove(HIGHLIGHT_CLASS);
  void el.offsetWidth;
  el.classList.add(HIGHLIGHT_CLASS);
  el.addEventListener('animationend', () => el.classList.remove(HIGHLIGHT_CLASS), { once: true });
}

/**
 * 스크롤이 실제로 멈춘 시점을 알린다.
 *
 * scrollend가 있으면 그걸 쓰고, 없으면(사파리 등) scrollY가 더 이상 변하지
 * 않을 때까지 지켜본다. 고정 타임아웃으로 대신하던 때는 값을 얼마로 잡든
 * 거리가 길면 도착 전에 끝나고 짧으면 괜히 기다렸다 — 실제 위치를 보는 편이
 * 거리와 무관하게 맞는다.
 */
function onScrollSettled(run: () => void) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', finish);
    clearInterval(timer);
    clearTimeout(hardStop);
    run();
  };

  let last = window.scrollY;
  let stable = 0;
  const timer = setInterval(() => {
    if (window.scrollY === last) {
      stable += 1;
      if (stable >= SETTLE_TICKS) finish();
      return;
    }
    last = window.scrollY;
    stable = 0;
  }, SETTLE_INTERVAL_MS);

  const hardStop = setTimeout(finish, SETTLE_TIMEOUT_MS);
  window.addEventListener('scrollend', finish, { once: true });
}

/**
 * id로 스크롤한 뒤, 스크롤이 실제로 끝난 시점에만 펄스를 재생한다.
 * 이동 중에 걸면 도착하기도 전에 애니메이션이 끝나 보인다.
 *
 * 동작 축소를 요청한 경우 부드러운 이동 자체를 쓰지 않는다. CSS에는
 * scroll-behavior: auto를 걸어 뒀지만 JS에서 behavior: 'smooth'를 명시하면
 * 그 규칙을 덮어써 버리므로, 여기서 직접 판단해야 한다.
 */
export function runHashHighlight(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (prefersReducedMotion()) {
    el.scrollIntoView({ behavior: 'auto', block: 'center' });
    pulse(el); // 즉시 이동이라 기다릴 것이 없다
    return;
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  onScrollSettled(() => pulse(el));
}
