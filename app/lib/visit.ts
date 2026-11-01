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
 * - 이름을 밝히지 않는 봇도 많아서 봇인지 가늠할 정보를 같이 남긴다. 브라우저 종류, 언어, 브라우저가 붙이는 헤더가
 *   있었는지, 그리고 화면이 실제로 실행됐는지(confirmVisit)를 기록한다. 판단은 관리자 화면이 한다.
 * - 사이트 주인의 방문도 남기지 않는다. 관리자 화면에 로그인한 브라우저(ADMIN_COOKIE)와
 *   EXCLUDED_IPS에 적은 IP(집 와이파이 등)에서 온 요청은 건너뛴다(isOwner). 질문 기록도 같은 기준을 쓴다.
 */

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

/** 관리자 화면에 로그인하면 middleware가 심는 쿠키. 이 쿠키가 있는 브라우저는 방문으로 세지 않는다 */
export const ADMIN_COOKIE = 'leejj_admin';

/** 기록하지 않을 IP. 쉼표로 여러 개를 적는다. IP는 저장소에 올리지 않으려고 환경 변수로 받는다 */
const EXCLUDED_IPS = new Set(
  (process.env.EXCLUDED_IPS ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean),
);

function clientIp(request: NextRequest) {
  return request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
}

/** 사이트 주인이 보낸 요청인지. 방문 기록과 질문 기록(app/api/ask)이 같은 기준으로 주인을 뺀다 */
export function isOwner(request: NextRequest) {
  return request.cookies.has(ADMIN_COOKIE) || EXCLUDED_IPS.has(clientIp(request));
}

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

/** 이름이 앞에 있을수록 먼저 본다. 웨일·삼성·엣지·인앱 브라우저는 User-Agent에 Chrome·Safari도 같이 적는다 */
const BROWSERS: [string, RegExp][] = [
  ['KakaoTalk', /KAKAOTALK\/?([\d.]+)?/i],
  ['NAVER', /NAVER\(inapp|NAVER\/([\d.]+)/],
  ['Instagram', /Instagram ([\d.]+)/],
  ['Whale', /Whale\/([\d.]+)/],
  ['Samsung', /SamsungBrowser\/([\d.]+)/],
  ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
  ['Opera', /OPR\/([\d.]+)/],
  ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
  ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
  ['Safari', /Version\/([\d.]+).*Safari/],
];

/** 브라우저 종류와 큰 버전, 운영체제만 짧게 낸다 (Chrome 141 · Android). 원문은 남기지 않는다 */
function browserLabel(ua: string) {
  const os = /iphone|ipad|ipod/i.test(ua)
    ? 'iOS'
    : /android/i.test(ua)
      ? 'Android'
      : /windows/i.test(ua)
        ? 'Windows'
        : /cros/i.test(ua)
          ? 'ChromeOS'
          : /mac os x/i.test(ua)
            ? 'macOS'
            : /linux/i.test(ua)
              ? 'Linux'
              : null;
  const found = BROWSERS.find(([, re]) => re.test(ua));
  const major = found ? ua.match(found[1])?.[1]?.split('.')[0] : undefined;
  const browser = found ? (major ? `${found[0]} ${major}` : found[0]) : '기타';
  return os ? `${browser} · ${os}` : browser;
}

/** Accept-Language의 첫 번째 언어 (ko-KR,ko;q=0.9 → ko-KR) */
function firstLanguage(request: NextRequest) {
  return request.headers.get('accept-language')?.split(',')[0]?.split(';')[0]?.trim() || null;
}

/**
 * 유입 경로. 주소에 ?ref=resume처럼 출처를 적어 두었으면 그 값을 ref:resume으로 낸다.
 * PDF·메신저 앱·채용 사이트에서 연 링크는 브라우저가 Referer를 보내지 않아서, 직접 붙인 표시가 아니면 출처를 알 수 없다.
 * 표시가 없으면 다른 사이트에서 왔을 때만 그 도메인을 낸다. 같은 사이트 안에서 옮겨 다닌 경우는 유입 경로가 아니다
 */
function source(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')?.trim().toLowerCase();
  if (ref && /^[a-z0-9_-]{1,32}$/.test(ref)) return `ref:${ref}`;
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

/** 방문 한 줄. 화면 실행 신호로 남기는 방문(confirmVisit)은 js와 webdriver를 처음부터 채운다 */
function insertVisit(
  request: NextRequest,
  path: string,
  referrer: string | null,
  visitor: string,
  ua: string,
  ran?: { webdriver: boolean },
) {
  return sql!`
    insert into visit_log (env, path, referrer, country, city, device, visitor, browser, lang, fetch_meta, js, webdriver)
    values (${process.env.VERCEL_ENV ?? 'development'}, ${path}, ${referrer},
      ${header(request, 'x-vercel-ip-country')}, ${header(request, 'x-vercel-ip-city')}, ${device(ua)}, ${visitor},
      ${browserLabel(ua)}, ${firstLanguage(request)}, ${request.headers.has('sec-fetch-mode')},
      ${ran ? true : null}, ${ran ? ran.webdriver : null})
  `;
}

export function recordVisit(request: NextRequest, event: NextFetchEvent) {
  if (!sql || request.method !== 'GET') return;
  const h = request.headers;
  // 문서를 통째로 여는 요청만 방문으로 센다. 링크가 화면에 보일 때 Next가 미리 불러오는 요청(prefetch)과
  // 사이트 안에서 옮겨 다니는 요청은 fetch로 가서 Sec-Fetch-Dest가 empty다. Next는 middleware를 부르기 전에
  // RSC·Next-Router-Prefetch 헤더와 _rsc 쿼리를 지우므로 그 값으로는 가릴 수 없다.
  // 이 헤더를 보내지 않는 오래된 브라우저와 수집 프로그램은 그대로 남긴다. 봇인지는 관리자 화면이 가늠한다.
  // 사이트 안에서 옮겨 다닌 방문은 화면 실행 신호가 대신 남긴다(confirmVisit)
  const dest = h.get('sec-fetch-dest');
  if (dest && dest !== 'document') return;
  // 브라우저가 다음에 열 페이지를 미리 받아 두는 요청. 실제로 연 페이지가 아니다
  if (h.get('purpose') === 'prefetch' || h.get('sec-purpose')?.includes('prefetch')) return;
  if (isOwner(request)) return;
  const ua = h.get('user-agent') ?? '';
  if (!ua || BOT.test(ua)) return;

  const write = visitorId(clientIp(request), ua)
    .then((visitor) => insertVisit(request, request.nextUrl.pathname, source(request), visitor, ua))
    .then(
      () => undefined,
      (error) => console.warn('[visit] 방문 기록 실패', error instanceof Error ? error.message : error),
    );
  event.waitUntil(write);
}

/**
 * 화면이 브라우저에서 실제로 실행됐다는 신호(app/components/VisitBeacon.tsx → /api/visit).
 * 같은 방문자 값과 경로로 방금 남긴 방문 한 건에 js = true와 webdriver 값을 채운다. 쿠키 없이 묶으려고 방문자 값을 다시 계산한다.
 * 맞는 방문이 없으면(주인의 방문, 봇으로 걸러진 요청, 10분이 지난 화면) 아무것도 하지 않는다.
 *
 * navigated는 사이트 안에서 링크를 눌러 옮겨 온 화면이라는 뜻이다. 이 이동은 middleware가 방문으로 세지 않으므로
 * (recordVisit) 여기서 방문 한 줄을 새로 남긴다. 화면이 실행된 뒤에 온 신호라 js는 처음부터 true다.
 */
export async function confirmVisit(request: NextRequest, path: string, webdriver: boolean, navigated: boolean) {
  if (!sql || isOwner(request)) return;
  const ua = request.headers.get('user-agent') ?? '';
  const visitor = await visitorId(clientIp(request), ua);
  if (navigated) {
    if (!ua || BOT.test(ua)) return;
    await insertVisit(request, path, null, visitor, ua, { webdriver });
    return;
  }
  await sql`
    update visit_log set js = true, webdriver = ${webdriver}
    where id = (
      select id from visit_log
      where env = ${process.env.VERCEL_ENV ?? 'development'} and visitor = ${visitor} and path = ${path}
        and js is null and created_at > now() - interval '10 minutes'
      order by created_at desc limit 1
    )
  `;
}

/** 머문 시간의 상한(초). 탭을 열어 두고 잊어버린 화면이 평균을 끌어올리지 않게 자른다 */
const MAX_DURATION = 6 * 60 * 60;

/**
 * 화면을 보고 있던 시간(app/components/VisitBeacon.tsx → /api/visit). 탭이 가려져 있던 시간은 빠져 있다.
 * 화면을 떠나거나 탭을 옮길 때마다 지금까지의 합이 오므로, 같은 방문자 값과 경로로 실행 표시가 된(js = true)
 * 가장 최근 방문 한 건을 더 큰 값으로만 늘린다. 신호가 순서를 바꿔 도착해도 줄어들지 않는다.
 */
export async function recordDuration(request: NextRequest, path: string, seconds: number) {
  if (!sql || isOwner(request)) return;
  const visitor = await visitorId(clientIp(request), request.headers.get('user-agent') ?? '');
  const value = Math.min(Math.round(seconds), MAX_DURATION);
  await sql`
    update visit_log set duration = greatest(coalesce(duration, 0), ${value})
    where id = (
      select id from visit_log
      where env = ${process.env.VERCEL_ENV ?? 'development'} and visitor = ${visitor} and path = ${path}
        and js and created_at > now() - interval '6 hours 10 minutes'
      order by created_at desc limit 1
    )
  `;
}
