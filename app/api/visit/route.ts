import type { NextRequest } from 'next/server';
import { confirmVisit } from '@/app/lib/visit';

/**
 * 화면이 실제로 실행됐다는 신호를 받는다(app/components/VisitBeacon.tsx).
 * 응답은 늘 204다. 기록이 실패해도 방문자 화면에는 아무 영향이 없어야 한다.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { path?: unknown; webdriver?: unknown } | null;
  const path = typeof body?.path === 'string' ? body.path.slice(0, 200) : '';
  if (path) {
    await confirmVisit(request, path, body?.webdriver === true).catch((error) =>
      console.warn('[visit] 실행 확인 기록 실패', error instanceof Error ? error.message : error),
    );
  }
  return new Response(null, { status: 204 });
}
