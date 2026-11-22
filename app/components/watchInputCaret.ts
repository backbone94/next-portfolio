export type CaretTarget = { x: number; y: number; width: number };

export function watchInputCaret(input: HTMLInputElement, onTarget: (target: CaretTarget | null) => void) {
  // A native single-line input exposes the caret index, but not its screen position.
  // Measure the same text with a collapsed DOM range, including the input's font and spacing.
  const mirror = document.createElement('span');
  mirror.setAttribute('aria-hidden', 'true');
  Object.assign(mirror.style, {
    position: 'fixed', top: '0', left: '0', width: 'max-content',
    visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'pre',
  });
  const text = document.createTextNode('');
  mirror.append(text);
  document.body.append(mirror);
  const range = document.createRange();
  let active = document.activeElement === input && input.value !== '';
  let frame = 0;

  function measure() {
    frame = 0;
    if (!active || document.activeElement !== input) return;

    const bounds = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    const left = bounds.left + input.clientLeft + parseFloat(style.paddingLeft);
    const width = Math.max(0, input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    Object.assign(mirror.style, {
      font: style.font,
      fontKerning: style.fontKerning,
      fontFeatureSettings: style.fontFeatureSettings,
      fontVariationSettings: style.fontVariationSettings,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      direction: style.direction,
    });
    text.data = input.value;
    const index = input.selectionDirection === 'backward' ? input.selectionStart : input.selectionEnd;
    range.setStart(text, index ?? text.length);
    range.collapse(true);
    const offset = range.getBoundingClientRect().left - mirror.getBoundingClientRect().left - input.scrollLeft;
    onTarget({
      x: left + Math.max(0, Math.min(offset, width)),
      y: bounds.top + bounds.height / 2,
      width,
    });
  }

  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(measure);
  }

  function start() {
    active = true;
    schedule();
  }

  function clear() {
    active = false;
    cancelAnimationFrame(frame);
    frame = 0;
    onTarget(null);
  }

  const triggers = ['input', 'keydown', 'pointerup', 'compositionupdate', 'compositionend'] as const;
  triggers.forEach(event => input.addEventListener(event, start));
  input.addEventListener('blur', clear);
  input.addEventListener('select', schedule);
  document.addEventListener('selectionchange', schedule);
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  const viewport = window.visualViewport;
  viewport?.addEventListener('resize', schedule);
  viewport?.addEventListener('scroll', schedule, { passive: true });
  const size = new ResizeObserver(schedule);
  size.observe(input);
  schedule();

  return () => {
    clear();
    size.disconnect();
    triggers.forEach(event => input.removeEventListener(event, start));
    input.removeEventListener('blur', clear);
    input.removeEventListener('select', schedule);
    document.removeEventListener('selectionchange', schedule);
    window.removeEventListener('scroll', schedule, true);
    viewport?.removeEventListener('resize', schedule);
    viewport?.removeEventListener('scroll', schedule);
    mirror.remove();
  };
}
