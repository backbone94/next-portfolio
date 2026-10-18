import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { recordVisit } from './app/lib/visit';

/**
 * 하는 일은 둘이다.
 *
 * 1. /admin을 비밀번호로 막는다. ADMIN_PASSWORD가 비어 있으면 페이지가 없는 것처럼 404를 낸다.
 *    브라우저 기본 로그인 창(Basic Auth)을 쓴다. 아이디 칸은 무엇을 넣어도 되고 비밀번호만 본다.
 *    로그인 화면과 세션을 따로 만들지 않아도 되고, 브라우저가 창을 닫을 때까지 기억해 준다.
 * 2. 첫 화면과 프로젝트 상세를 연 방문을 기록한다(app/lib/visit.ts).
 */

function authorized(request: NextRequest, password: string) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const given = decoded.slice(decoded.indexOf(':') + 1);
  // 글자마다 끝까지 비교한다. 앞에서부터 틀리는 즉시 멈추면 응답 시간으로 맞힌 글자 수가 드러난다
  let diff = given.length ^ password.length;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ password.charCodeAt(i % password.length);
  return diff === 0;
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
    if (!authorized(request, password)) {
      return new NextResponse('비밀번호가 필요합니다.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="admin", charset="UTF-8"', 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    return NextResponse.next({ headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
  }

  recordVisit(request, event);
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/projects/:slug', '/admin', '/admin/:path*'],
};
