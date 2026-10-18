/** 방문자가 운영체제에서 동작 줄이기를 켰는지. 켰으면 부드러운 스크롤 같은 움직임을 즉시 이동으로 바꾼다. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
