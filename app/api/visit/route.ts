import type { NextRequest } from 'next/server';
import { getProject } from '@/app/content/projects';
import { confirmVisit, recordDuration } from '@/app/lib/visit';

/** 방문으로 기록하는 경로만 받는다. 사이트 안 이동은 여기서 방문 한 줄을 새로 쓰므로 아무 경로나 받지 않는다 */
function recorded(path: string) {
  if (path === '/') return true;
  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  return slug != null && getProject(slug) != null;
}

/**
 * 화면이 실제로 실행됐다는 신호와 머문 시간을 받는다(app/components/VisitBeacon.tsx).
 * 응답은 늘 204다. 기록이 실패해도 방문자 화면에는 아무 영향이 없어야 한다.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { path?: unknown; webdriver?: unknown; navigated?: unknown; seconds?: unknown }
    | null;
  const path = typeof body?.path === 'string' ? body.path.slice(0, 200) : '';
  if (!path || !recorded(path)) return new Response(null, { status: 204 });

  // 머문 시간. 화면을 떠나거나 탭을 옮길 때 온다
  if (typeof body?.seconds === 'number') {
    if (Number.isFinite(body.seconds) && body.seconds >= 1) {
      await recordDuration(request, path, body.seconds).catch((error) =>
        console.warn('[visit] 머문 시간 기록 실패', error instanceof Error ? error.message : error),
      );
    }
  } else {
    await confirmVisit(request, path, body?.webdriver === true, body?.navigated === true).catch((error) =>
      console.warn('[visit] 실행 확인 기록 실패', error instanceof Error ? error.message : error),
    );
  }
  return new Response(null, { status: 204 });
}
