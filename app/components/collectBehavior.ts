import { isBehaviorId, MAX_EVENTS, MAX_SECONDS, type Behavior, type BehaviorEvent } from '@/app/lib/behavior';

const SESSION_KEY = 'leejj_behavior_session';
const IDLE_MS = 30 * 60 * 1000;
const PRIVATE = 'form, input, textarea, select, [contenteditable], [data-analytics-private]';
type Session = { id: string; step: number; activeAt: number };
let inMemorySession: Session | undefined;

function loadSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    if (isBehaviorId(value?.id) && Number.isInteger(value.step) && Number.isFinite(value.activeAt)) {
      return value as Session;
    }
  } catch {
    // 저장소를 차단한 브라우저에서는 현재 문서 안에서만 이동을 이어 본다.
  }
  return inMemorySession;
}

function saveSession(session: Session) {
  inMemorySession = session;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // 메모리에 저장한 값은 클라이언트 쪽 페이지 이동 동안 유지된다.
  }
}

function beginSession() {
  const previous = loadSession();
  const now = Date.now();
  const session = previous && now - previous.activeAt < IDLE_MS && previous.step < 10000
    ? { ...previous, step: previous.step + 1, activeAt: now }
    : { id: crypto.randomUUID(), step: 1, activeAt: now };
  saveSession(session);
  return session;
}

const percent = (value: number, total: number) => Math.round(Math.max(0, Math.min(1, value / Math.max(total, 1))) * 100);

function fromPrivateArea(event: PointerEvent | MouseEvent) {
  return event.target instanceof Element && event.target.closest(PRIVATE) !== null;
}

export function collectBehavior(path: string) {
  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (privacy.webdriver || privacy.doNotTrack === '1' || privacy.globalPrivacyControl || !crypto.randomUUID) return;

  const session = beginSession();
  const start = performance.now();
  const behavior: Behavior = {
    view: crypto.randomUUID(), session: session.id, step: session.step, revision: 0, path,
    viewport: window.innerWidth < 768 ? 'narrow' : 'wide', depth: 0, events: [],
  };
  let sentDepth = -1;
  let sentEvents = -1;
  let lastMove = -Infinity;
  let lastScroll = -Infinity;
  let lastSampledDepth = -1;
  let activeAt = session.activeAt;
  let visible = document.visibilityState === 'visible';

  function sample(kind: BehaviorEvent[1], x: number, y: number) {
    activeAt = Date.now();
    const second = Math.floor((performance.now() - start) / 1000);
    // 이동과 스크롤이 많아도 클릭을 담을 자리를 남긴다.
    if (second > MAX_SECONDS || behavior.events.length >= (kind === 'click' ? MAX_EVENTS : 180)) return;
    behavior.events.push([second, kind, x, y]);
  }

  function scrollDepth() {
    const height = document.documentElement.scrollHeight;
    return percent(window.scrollY + window.innerHeight, height);
  }

  function observeScroll() {
    if (document.visibilityState !== 'visible') return;
    const depth = scrollDepth();
    behavior.depth = Math.max(behavior.depth, depth);
    const now = performance.now();
    if (now - lastScroll < 500 || Math.abs(depth - lastSampledDepth) < 5) return;
    lastScroll = now;
    lastSampledDepth = depth;
    sample('scroll', 0, depth);
  }

  function point(event: MouseEvent) {
    return [percent(event.clientX, window.innerWidth), percent(event.clientY + window.scrollY, document.documentElement.scrollHeight)] as const;
  }

  function move(event: PointerEvent) {
    if (!event.isTrusted || event.pointerType !== 'mouse' || performance.now() - lastMove < 400 || fromPrivateArea(event)) return;
    lastMove = performance.now();
    sample('move', ...point(event));
  }

  function click(event: MouseEvent) {
    if (event.isTrusted && event.detail > 0 && !fromPrivateArea(event)) sample('click', ...point(event));
  }

  function flush() {
    if (!visible) return;
    if (performance.now() - start < 1000 && behavior.events.length === 0) return;
    if (document.visibilityState === 'visible') {
      const depth = scrollDepth();
      behavior.depth = Math.max(behavior.depth, depth);
      if (lastSampledDepth < 0) lastSampledDepth = depth;
    }
    if (behavior.depth === sentDepth && behavior.events.length === sentEvents) return;
    const revision = ++behavior.revision;
    const current = loadSession();
    if (current?.id === session.id && activeAt > current.activeAt) saveSession({ ...current, activeAt });
    sentDepth = behavior.depth;
    sentEvents = behavior.events.length;
    void fetch('/api/visit/behavior', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(behavior), keepalive: true,
    }).then((response) => {
      if (!response.ok && revision === behavior.revision) sentEvents = -1;
    }, () => {
      if (revision === behavior.revision) sentEvents = -1;
    });
  }

  function onVisibility() {
    visible ||= document.visibilityState === 'visible';
    flush();
  }

  const first = window.setTimeout(flush, 1000);
  const interval = window.setInterval(flush, 10000);
  window.addEventListener('scroll', observeScroll, { passive: true });
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('click', click, true);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', flush);

  return () => {
    window.clearTimeout(first);
    window.clearInterval(interval);
    window.removeEventListener('scroll', observeScroll);
    document.removeEventListener('pointermove', move);
    document.removeEventListener('click', click, true);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', flush);
    flush();
  };
}
