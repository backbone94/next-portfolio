import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { isAdminAuthorized } from './app/lib/admin-auth';
import { ADMIN_COOKIE, recordVisit } from './app/lib/visit';

/**
 * 하는 일은 둘이다.
 *
 * 1. /admin을 비밀번호로 막는다. ADMIN_PASSWORD가 비어 있으면 페이지가 없는 것처럼 404를 낸다.
 *    브라우저 기본 로그인 창(Basic Auth)을 쓴다. 아이디 칸은 무엇을 넣어도 되고 비밀번호만 본다.
 *    로그인 화면과 세션을 따로 만들지 않아도 되고, 브라우저가 창을 닫을 때까지 기억해 준다.
 *    로그인에 성공하면 그 브라우저의 이후 방문과 질문을 기록에서 뺀다.
 * 2. 공개 페이지에 들어온 요청을 방문 로그에 기록한다(app/lib/visit.ts).
 */

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
    if (!isAdminAuthorized(request, password)) {
      return new NextResponse('비밀번호가 필요합니다.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="admin", charset="UTF-8"', 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    const response = NextResponse.next({ headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
    response.cookies.set(ADMIN_COOKIE, '1', {
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  recordVisit(request, event);
  return NextResponse.next();
}

export const config = {
  // :path*는 프로젝트 상세와 관리자 하위 주소를 포함한다.
  matcher: ['/', '/ask', '/projects/:path*', '/admin', '/admin/:path*'],
};
