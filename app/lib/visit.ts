import { neon } from '@neondatabase/serverless';
import type { NextFetchEvent, NextRequest } from 'next/server';

/**
 * 방문 기록. 첫 화면과 프로젝트 상세를 열 때마다 Neon Postgres의 visit_log 표에 한 줄씩 남긴다(표는 db/visit_log.sql).
 * middleware.ts에서 부른다. 상세 페이지는 빌드할 때 미리 만든 정적 페이지라 페이지 안에서는 방문을 알 수 없다.
 *
 * - 응답을 먼저 보내고 기록은 그 뒤에 한다. middleware의 event.waitUntil로 기록이 끝날 때까지 붙잡아 둔다.
 *   기록이 느리거나 실패해도 방문자는 기다리지 않는다(app/lib/ask/store.ts와 같다).
 * - IP·쿠키·User-Agent 원문은 남기지 않는다. 같은 날 같은 사람을 묶는 데만 IP와 User-Agent를 해시해 쓰고 버린다.
 *   해시에 그날 날짜를 섞어서 날이 바뀌면 같은 사람도 다른 값이 된다. 며칠에 걸쳐 한 사람을 따라갈 수 없다.
 * - 봇·크롤러, 링크 미리 불러오기(prefetch), 접속 주소가 없을 때는 남기지 않는다.
 */

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

/**
 * 해시에 섞는 비밀값. 따로 정하지 않으면 접속 주소를 쓴다. 어느 쪽이든 서버 밖으로 나가지 않는 값이라,
 * 기록이 새어도 IP 전체(약 40억 개)를 대입해 보는 식으로 되돌릴 수 없다.
 */
const SECRET = process.env.VISIT_SALT || process.env.DATABASE_URL || '';

/** 검색엔진·미리보기·모니터링·자동화 도구. 이 단어가 User-Agent에 들어 있으면 사람이 아니다 */
const BOT =
  /bot|crawl|spider|slurp|scrap|preview|fetch|monitor|lighthouse|headless|phantom|puppeteer|playwright|selenium|facebookexternalhit|embedly|vercel|curl|wget|python|httpx|axios|node|go-http|java\/|okhttp|postman|insomnia|\bdaum(oa)?\b|yeti/i;

function device(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

/** 다른 사이트에서 왔을 때만 그 도메인을 낸다. 같은 사이트 안에서 옮겨 다닌 경우는 유입 경로가 아니다 */
function externalReferrer(request: NextRequest) {
  const raw = request.headers.get('referer');
  if (!raw) return null;
  try {
    const host = new URL(raw).host;
    return host && host !== request.nextUrl.host ? host : null;
  } catch {
    return null;
  }
}

/** Vercel 위치 헤더. 도시 이름은 "S%C3%A3o%20Paulo"처럼 인코딩돼 온다 */
function header(request: NextRequest, name: string) {
  const value = request.headers.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** 한국 시간 기준 날짜. 자정에 방문자 값이 바뀌는 시점을 방문자가 많은 쪽의 하루에 맞춘다 */
function today() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function visitorId(ip: string, ua: string) {
  const data = new TextEncoder().encode(`${SECRET}|${today()}|${ip}|${ua}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, '0')).join('');
}

export function recordVisit(request: NextRequest, event: NextFetchEvent) {
  if (!sql || request.method !== 'GET') return;
  const h = request.headers;
  // 링크에 마우스를 올리거나 화면에 보일 때 Next가 미리 불러오는 요청. 실제로 연 페이지가 아니다
  if (h.get('next-router-prefetch') || h.get('purpose') === 'prefetch' || h.get('sec-purpose')?.includes('prefetch')) return;
  const ua = h.get('user-agent') ?? '';
  if (!ua || BOT.test(ua)) return;

  const ip = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const write = visitorId(ip, ua)
    .then(
      (visitor) => sql`
        insert into visit_log (env, path, referrer, country, city, device, visitor)
        values (${process.env.VERCEL_ENV ?? 'development'}, ${request.nextUrl.pathname}, ${externalReferrer(request)},
          ${header(request, 'x-vercel-ip-country')}, ${header(request, 'x-vercel-ip-city')}, ${device(ua)}, ${visitor})
      `,
    )
    .then(
      () => undefined,
      (error) => console.warn('[visit] 방문 기록 실패', error instanceof Error ? error.message : error),
    );
  event.waitUntil(write);
}
