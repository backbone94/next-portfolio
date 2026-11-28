export const HEATMAP_COLUMNS = 12;
export const HEATMAP_ROWS = 20;
export const MAX_EVENTS = 260;
export const MAX_SECONDS = 6 * 60 * 60;

export type Viewport = 'narrow' | 'wide';

// 초, 이벤트 종류, 가로 위치, 세로 위치. 스크롤의 세로 위치는 화면에 보인 최대 깊이다.
export type BehaviorEvent = [second: number, kind: 'move' | 'click' | 'scroll', x: number, y: number];

export type Behavior = {
  view: string;
  session: string;
  step: number;
  revision: number;
  path: string;
  viewport: Viewport;
  depth: number;
  events: BehaviorEvent[];
};

export function isBehaviorId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}

export function isViewport(value: unknown): value is Viewport {
  return value === 'narrow' || value === 'wide';
}

function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function isBehaviorEvent(value: unknown): value is BehaviorEvent {
  if (!Array.isArray(value) || value.length !== 4) return false;
  const [second, kind, x, y] = value;
  return integer(second, 0, MAX_SECONDS) && (kind === 'move' || kind === 'click' || kind === 'scroll') &&
    integer(x, 0, 100) && integer(y, 0, 100);
}

export function parseBehavior(value: unknown): Behavior | null {
  if (typeof value !== 'object' || value === null) return null;
  const { view, session, step, revision, path, viewport, depth, events } = value as Partial<Behavior>;
  if (!isBehaviorId(view) || !isBehaviorId(session) || !integer(step, 1, 10000) || !integer(revision, 1, 10000) ||
    typeof path !== 'string' || path.length > 200 || !isViewport(viewport) || !integer(depth, 0, 100) ||
    !Array.isArray(events) || events.length > MAX_EVENTS || !events.every(isBehaviorEvent)) return null;

  return { view, session, step, revision, path, viewport, depth, events };
}
