import { NextResponse, type NextRequest } from 'next/server';
import { isRecordedPage } from '@/app/lib/recorded-page';
import { confirmVisit, recordDuration, VISITOR_COOKIE, VISITOR_COOKIE_AGE } from '@/app/lib/visit';

/**
 * 화면이 실제로 실행됐다는 신호와 머문 시간을 받는다(app/components/VisitBeacon.tsx).
 * 응답은 늘 204다. 기록이 실패해도 방문자 화면에는 아무 영향이 없어야 한다.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { path?: unknown; webdriver?: unknown; navigated?: unknown; seconds?: unknown }
    | null;
  const path = typeof body?.path === 'string' ? body.path.slice(0, 200) : '';
  if (!isRecordedPage(path)) return new Response(null, { status: 204 });
  const response = new NextResponse(null, { status: 204 });

  // 머문 시간. 화면을 떠나거나 탭을 옮길 때 온다
  if (typeof body?.seconds === 'number') {
    if (Number.isFinite(body.seconds) && body.seconds >= 1) {
      await recordDuration(request, path, body.seconds).catch((error) =>
        console.warn('[visit] 머문 시간 기록 실패', error instanceof Error ? error.message : error),
      );
    }
  } else {
    const token = await confirmVisit(request, path, body?.webdriver === true, body?.navigated === true).catch((error) => {
      console.warn('[visit] 실행 확인 기록 실패', error instanceof Error ? error.message : error);
      return undefined;
    });
    if (token) {
      response.cookies.set(VISITOR_COOKIE, token, {
        httpOnly: true,
        secure: request.nextUrl.protocol === 'https:',
        sameSite: 'lax',
        path: '/',
        maxAge: VISITOR_COOKIE_AGE,
      });
    }
  }
  return response;
}
