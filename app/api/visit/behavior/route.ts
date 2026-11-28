import type { NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { parseBehavior } from '@/app/lib/behavior';
import { isRecordedPage } from '@/app/lib/recorded-page';
import { canRecordBehavior } from '@/app/lib/visit';

const MAX_BODY = 16_384;
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function POST(request: NextRequest) {
  const done = () => new Response(null, { status: 204 });
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  if (!sql || (origin && origin !== request.nextUrl.origin) || (site && site !== 'same-origin') ||
    Number(request.headers.get('content-length')) > MAX_BODY) return done();

  const behavior = await request.text().then((text) => {
    return text.length <= MAX_BODY ? parseBehavior(JSON.parse(text)) : null;
  }).catch(() => null);
  if (!behavior || !isRecordedPage(behavior.path)) return done();

  try {
    if (!(await canRecordBehavior(request))) return done();
    const { view, session, step, revision, path, viewport, depth, events } = behavior;
    await sql`
      insert into visit_behavior (env, view_id, session_id, step, revision, path, viewport, scroll_depth, events)
      values (${process.env.VERCEL_ENV ?? 'development'}, ${view}, ${session}, ${step}, ${revision}, ${path},
        ${viewport}, ${depth}, ${JSON.stringify(events)}::jsonb)
      on conflict (env, view_id) do update
        set revision = excluded.revision, scroll_depth = excluded.scroll_depth, events = excluded.events
        where visit_behavior.revision < excluded.revision
          and visit_behavior.session_id = excluded.session_id and visit_behavior.step = excluded.step
          and visit_behavior.path = excluded.path and visit_behavior.viewport = excluded.viewport
    `;
  } catch (error) {
    console.warn('[visit] 행동 기록 실패', error instanceof Error ? error.message : error);
  }
  return done();
}
