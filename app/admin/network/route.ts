import { neon } from '@neondatabase/serverless';
import { NextResponse, type NextRequest } from 'next/server';
import { loadAsn } from '@/db/asn.mjs';

/**
 * 관리자 화면의 "지금 갱신" 버튼(app/admin/NetworkRefresh.tsx). IP 대역별 네트워크 표(ip_asn)를 최신 데이터로 다시 채운다.
 * 명령줄의 `node --env-file=.env.local db/load-asn.mjs`와 같은 일이다(db/asn.mjs).
 *
 * - 비밀번호는 middleware.ts가 /admin 아래를 모두 묻는다.
 * - 브라우저는 저장해 둔 관리자 비밀번호를 다른 사이트가 보낸 폼에도 붙여 보낸다. 그래서 이 사이트에서 보낸 요청인지(Origin) 한 번 더 본다.
 * - 1분 안팎 걸린다. 도중에 끊겨도 쓰던 표는 그대로라 방문 기록은 계속 네트워크를 찾는다.
 * - 끝나면 관리자 화면으로 돌아가며 ?network=ok 또는 fail을 붙인다.
 */

export const dynamic = 'force-dynamic';
// 기본 시간 제한으로는 모자랄 수 있다. 요금제가 허용하는 만큼까지 늘어난다
export const maxDuration = 300;

/** 돌아갈 관리자 화면 주소. 폼이 보낸 값이 /admin으로 시작할 때만 믿는다 */
function back(value: FormDataEntryValue | null, result: 'ok' | 'fail') {
  const path = typeof value === 'string' && /^\/admin(\?|$)/.test(value) ? value : '/admin';
  const url = new URL(path, 'http://x');
  url.searchParams.set('network', result);
  return `${url.pathname}${url.search}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) return new Response(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== request.headers.get('host')) {
    return new Response('이 사이트의 관리자 화면에서만 갱신할 수 있습니다.', { status: 403 });
  }
  const form = await request.formData().catch(() => null);
  if (!process.env.DATABASE_URL) return NextResponse.redirect(new URL(back(form?.get('back') ?? null, 'fail'), request.url), 303);

  try {
    const { ranges, refreshedAt } = await loadAsn(neon(process.env.DATABASE_URL));
    console.log(`[network] ip_asn 갱신 (대역 ${ranges}개, ${refreshedAt})`);
    return NextResponse.redirect(new URL(back(form?.get('back') ?? null, 'ok'), request.url), 303);
  } catch (error) {
    console.warn('[network] ip_asn 갱신 실패', error instanceof Error ? error.message : error);
    return NextResponse.redirect(new URL(back(form?.get('back') ?? null, 'fail'), request.url), 303);
  }
}
