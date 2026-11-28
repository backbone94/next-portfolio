import 'server-only';

import { neon } from '@neondatabase/serverless';
import { HEATMAP_COLUMNS, HEATMAP_ROWS, isBehaviorId, type BehaviorEvent, type Viewport } from '@/app/lib/behavior';

const ENV = 'production';
const DAYS = 30;
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

type ScrollCount = { depth: number; count: number };
type HeatCell = { x: number; y: number; count: number };
type Transition = { fromPath: string; toPath: string; count: number };
type Session = { id: string; at: string; count: number; firstPath: string };
type Step = { id: string; path: string; at: string; viewport: Viewport; depth: number };

export async function loadBehavior(path: string, viewport: Viewport) {
  if (!sql) return null;
  const [scroll, clicks, transitions, sessions] = await Promise.all([
    sql`
      with views as (
        select scroll_depth from visit_behavior where env = ${ENV} and path = ${path} and viewport = ${viewport}
          and created_at >= now() - ${DAYS} * interval '1 day'
      )
      select depth, (select count(*)::int from views where scroll_depth >= depth) as count
      from generate_series(0, 100, 10) as depth order by depth
    `,
    sql`
      select least(${HEATMAP_COLUMNS} - 1, (event->>2)::int * ${HEATMAP_COLUMNS} / 100) as x,
             least(${HEATMAP_ROWS} - 1, (event->>3)::int * ${HEATMAP_ROWS} / 100) as y, count(*)::int as count
      from visit_behavior cross join lateral jsonb_array_elements(events) as event
      where env = ${ENV} and path = ${path} and viewport = ${viewport} and event->>1 = 'click'
        and created_at >= now() - ${DAYS} * interval '1 day'
      group by 1, 2
    `,
    sql`
      with journey as (
        select path, lag(path) over (partition by session_id order by step, created_at, view_id) as previous,
               created_at
        from visit_behavior where env = ${ENV} and created_at >= now() - (${DAYS} * interval '1 day' + interval '30 minutes')
      )
      select previous as "fromPath", path as "toPath", count(*)::int as count from journey
      where created_at >= now() - ${DAYS} * interval '1 day' and previous <> path
      group by previous, path order by count desc, previous, path limit 15
    `,
    sql`
      select session_id::text as id,
        to_char(min(created_at) at time zone 'Asia/Seoul', 'MM-DD HH24:MI:SS') as at, count(*)::int as count,
        (array_agg(path order by step, created_at, view_id))[1] as "firstPath"
      from visit_behavior where env = ${ENV} and created_at >= now() - ${DAYS} * interval '1 day'
      group by session_id order by max(created_at) desc, session_id limit 20
    `,
  ]);

  return { scroll: scroll as ScrollCount[], clicks: clicks as HeatCell[], transitions: transitions as Transition[], sessions: sessions as Session[] };
}

export async function loadBehaviorSession(session: string, view: string | undefined) {
  if (!sql || !isBehaviorId(session)) return null;
  const steps = await sql`
    select view_id::text as id, path, to_char(created_at at time zone 'Asia/Seoul', 'HH24:MI:SS') as at,
      viewport, scroll_depth as depth
    from visit_behavior where env = ${ENV} and session_id = ${session}
      and created_at >= now() - ${DAYS} * interval '1 day'
    order by step, created_at, view_id
  ` as Step[];
  const selected = steps.find((step) => step.id === view) ?? steps[0];
  if (!selected) return null;
  const [replay] = await sql`select events from visit_behavior where env = ${ENV} and view_id = ${selected.id}`;
  return { steps, selected, events: (replay?.events ?? []) as BehaviorEvent[] };
}
