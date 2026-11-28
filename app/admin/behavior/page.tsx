import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/app/content/projects';
import { HEATMAP_COLUMNS, HEATMAP_ROWS, isBehaviorId, isViewport, type Viewport } from '@/app/lib/behavior';
import { isRecordedPage } from '@/app/lib/recorded-page';
import { Block, Empty, number, pageName, Table } from '../ui';
import { loadBehavior, loadBehaviorSession } from './data';
import Replay from './Replay';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '방문 행동', robots: { index: false, follow: false } };

const PAGES = ['/', '/ask', ...projects.map(({ slug }) => `/projects/${slug}`)];
const VIEWPORT: Record<Viewport, string> = { wide: '넓은 화면 (768px 이상)', narrow: '좁은 화면 (768px 미만)' };
const link = 'font-medium text-accent underline-offset-4 hover:underline';
type Dashboard = NonNullable<Awaited<ReturnType<typeof loadBehavior>>>;
type Session = NonNullable<Awaited<ReturnType<typeof loadBehaviorSession>>>;
type Query = { path?: string; viewport?: string; session?: string; view?: string };

function behaviorHref({ path, viewport, session, view }: Query) {
  const params = new URLSearchParams();
  if (path) params.set('path', path);
  if (viewport) params.set('viewport', viewport);
  if (session) params.set('session', session);
  if (view) params.set('view', view);
  return `/admin/behavior?${params}`;
}

export default async function BehaviorPage({ searchParams }: { searchParams: Promise<Query> }) {
  if (!process.env.ADMIN_PASSWORD) notFound();
  const query = await searchParams;
  const path = typeof query.path === 'string' && isRecordedPage(query.path) ? query.path : '/';
  const viewport = isViewport(query.viewport) ? query.viewport : 'wide';
  const session = isBehaviorId(query.session) ? query.session : undefined;
  const view = isBehaviorId(query.view) ? query.view : undefined;
  const filters = { path, viewport };
  const data = await Promise.all([loadBehavior(path, viewport), session ? loadBehaviorSession(session, view) : null]).catch((error: unknown) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') return null;
    throw error;
  });
  const [dashboard, detail] = data ?? [];

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <Link href="/admin" className={`text-sm ${link}`}>← 대시보드</Link>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">방문 행동</h1>
      <p className="mt-4 max-w-prose text-muted">최근 30일 동안 실제 사이트에서 기록한 페이지 이동, 클릭과 스크롤을 확인합니다. 시각은 한국 시간 기준입니다.</p>

      {!dashboard ? (
        <p className="mt-10 text-sm text-muted">{data ? 'DATABASE_URL이 없어 기록을 읽을 수 없습니다.' : '행동 기록용 데이터베이스 테이블을 준비하면 집계를 볼 수 있습니다.'}</p>
      ) : (
        <>
          <Block title="페이지별 히트맵" note="페이지와 화면 너비를 선택하면 해당 조건의 클릭 위치와 스크롤 깊이를 볼 수 있습니다.">
            <Heatmaps dashboard={dashboard} path={path} viewport={viewport} />
          </Block>

          <div className="grid gap-x-10 lg:grid-cols-[1fr_1.15fr]">
            <Block title="많이 이동한 경로" note="같은 세션 안에서 다른 페이지로 이동한 횟수입니다.">
              {dashboard.transitions.length ? (
                <Table head={['출발', '도착', '이동']} numeric={[2]}>
                  {dashboard.transitions.map(({ fromPath, toPath, count }) => (
                    <tr key={`${fromPath}:${toPath}`} className="border-t align-top">
                      <td className="py-2 pr-4">{pageName(fromPath)}</td>
                      <td className="py-2 pr-4">{pageName(toPath)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{number(count)}회</td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty />}
            </Block>

            <Block title="최근 방문 세션" note="최신 20건을 보여 줍니다. 세션을 열면 페이지를 본 순서와 각 페이지에서의 행동을 확인할 수 있습니다.">
              {dashboard.sessions.length ? (
                <Table head={['시작', '처음 본 페이지', '페이지', '세션']} numeric={[2]}>
                  {dashboard.sessions.map(({ id, at, count, firstPath }) => (
                    <tr key={id} className="border-t align-top">
                      <td className="whitespace-nowrap py-2 pr-4 tabular-nums">{at}</td>
                      <td className="py-2 pr-4">{pageName(firstPath)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{number(count)}</td>
                      <td className="whitespace-nowrap py-2 pr-4">
                        <Link href={`${behaviorHref({ ...filters, session: id })}#session`} className={link} aria-current={session === id ? 'true' : undefined} prefetch={false}>열기</Link>
                      </td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty />}
            </Block>
          </div>

          {session && (
            <div id="session" className="scroll-mt-8">
              <Block title="세션 이동 경로" note="페이지를 선택하면 좌표로 기록한 행동을 시간순으로 재생할 수 있습니다.">
                {detail ? <SessionDetail detail={detail} query={{ ...filters, session }} /> : <Empty />}
              </Block>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Heatmaps({ dashboard, path, viewport }: { dashboard: Dashboard; path: string; viewport: Viewport }) {
  const views = dashboard.scroll[0]?.count ?? 0;
  const clickCount = dashboard.clicks.reduce((sum, cell) => sum + cell.count, 0);
  const maximum = Math.max(1, ...dashboard.clicks.map(({ count }) => count));
  const cells = new Map(dashboard.clicks.map(({ x, y, count }) => [y * HEATMAP_COLUMNS + x, count]));
  const top = [...dashboard.clicks].sort((a, b) => b.count - a.count || a.y - b.y || a.x - b.x).slice(0, 3);

  return (
    <>
      <form action="/admin/behavior" className="flex flex-wrap items-end gap-3 text-sm">
        <label className="grid min-w-0 gap-1">
          <span className="text-muted">페이지</span>
          <select name="path" defaultValue={path} className="max-w-full rounded-md border bg-surface-2 px-3 py-2">
            {PAGES.map((item) => <option key={item} value={item}>{pageName(item)}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-muted">화면 너비</span>
          <select name="viewport" defaultValue={viewport} className="rounded-md border bg-surface-2 px-3 py-2">
            <option value="wide">{VIEWPORT.wide}</option>
            <option value="narrow">{VIEWPORT.narrow}</option>
          </select>
        </label>
        <button className="rounded-md border px-3 py-2 font-medium hover:text-accent">조회</button>
      </form>

      {views === 0 ? <p className="mt-5 text-sm text-muted">이 조건에서 기록한 페이지 조회가 아직 없습니다.</p> : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border p-4 sm:p-5">
            <h3 className="font-bold">클릭 히트맵</h3>
            <p className="mt-1 text-sm text-muted">페이지 조회 {number(views)}회에서 클릭 {number(clickCount)}회를 기록했습니다. 위에서 아래로 페이지 전체를 표시합니다.</p>
            {clickCount > 0 && (
              <>
                <div aria-hidden className="mt-4 grid max-w-md gap-px overflow-hidden rounded-md border bg-surface-2" style={{ gridTemplateColumns: `repeat(${HEATMAP_COLUMNS}, minmax(0, 1fr))` }}>
                  {Array.from({ length: HEATMAP_COLUMNS * HEATMAP_ROWS }, (_, i) => {
                    const count = cells.get(i) ?? 0;
                    return <span key={i} className="h-3 border border-current/5" title={`${number(count)}회`} style={{ backgroundColor: count ? `rgb(234 88 12 / ${0.22 + 0.78 * count / maximum})` : undefined }} />;
                  })}
                </div>
                <ul className="mt-3 space-y-1 text-xs tabular-nums text-muted">
                  {top.map(({ x, y, count }) => (
                    <li key={`${x}:${y}`}>가로 {Math.round(100 * (x + 0.5) / HEATMAP_COLUMNS)}%, 세로 {Math.round(100 * (y + 0.5) / HEATMAP_ROWS)}% 부근에서 {number(count)}회</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="rounded-xl border p-4 sm:p-5">
            <h3 className="font-bold">스크롤 도달률</h3>
            <p className="mt-1 text-sm text-muted">페이지의 각 깊이까지 화면에 표시된 조회 비율입니다.</p>
            <ul className="mt-4 grid gap-2 text-xs tabular-nums">
              {dashboard.scroll.filter(({ depth }) => depth > 0).map(({ depth, count }) => {
                const percent = Math.round(100 * count / views);
                return (
                  <li key={depth} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3">
                    <span>{depth}%</span>
                    <span className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden><span className="block h-full rounded-full bg-accent" style={{ width: `${percent}%` }} /></span>
                    <span className="text-right text-muted">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

function SessionDetail({ detail, query }: { detail: Session; query: Query }) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(13rem,1fr)_2fr]">
      <ol className="grid content-start gap-2 text-sm">
        {detail.steps.map(({ id, path, at }, index) => (
          <li key={id}>
            <Link href={`${behaviorHref({ ...query, view: id })}#session`} aria-current={detail.selected.id === id ? 'true' : undefined} prefetch={false} className="flex items-baseline gap-3 rounded-md border px-3 py-2 hover:text-accent aria-[current=true]:border-accent aria-[current=true]:bg-surface-2">
              <span className="text-xs tabular-nums text-muted">{index + 1}</span>
              <span className="flex-1">{pageName(path)}</span>
              <span className="text-xs tabular-nums text-muted">{at}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div>
        <p className="mb-3 text-sm text-muted">{VIEWPORT[detail.selected.viewport]}, 스크롤 최대 {detail.selected.depth}%</p>
        <Replay key={detail.selected.id} events={detail.events} />
      </div>
    </div>
  );
}
