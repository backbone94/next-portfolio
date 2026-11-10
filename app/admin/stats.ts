import { neon } from '@neondatabase/serverless';

/**
 * 관리자 화면이 보여 주는 숫자. visit_log(db/visit_log.sql)와 ask_log(db/ask_log.sql)를 읽기만 한다.
 * 방문은 확실히 사람인 것(HUMAN)만 읽는다. 봇이거나 봇으로 의심되는 방문은 기록에는 남지만 관리자 화면에는 나오지 않는다.
 * 날짜는 한국 시간으로 자른다.
 */

export const ENVS = ['production', 'preview', 'development'] as const;
export type Env = (typeof ENVS)[number];
export const PERIODS = [7, 30, 90] as const;

/** 대시보드에 보여 주는 최근 방문 수 */
export const RECENT = 10;
/** 방문 기록 화면 한 쪽에 보여 주는 방문 수 */
export const PAGE_SIZE = 50;

const kst = (column: string) => `(${column} at time zone 'Asia/Seoul')`;

/** Visit 한 건을 읽는 칼럼 */
const VISIT_COLUMNS = `to_char(${kst('created_at')}, 'YYYY-MM-DD HH24:MI:SS') as at, path, referrer, country, city, device,
  left(visitor, 6) as visitor, browser, lang, fetch_meta as "fetchMeta", js, webdriver, duration, asn, network`;

/**
 * 데이터센터·클라우드 네트워크 이름에 들어가는 말. 사람은 집·회사·휴대폰 망에서 들어오므로, 이런 망에서 온 방문은 거의 봇이다.
 * 네트워크 이름은 ip_asn 표(db/ip_asn.sql)의 AS 이름이다 (AMAZON-02, GOOGLE-CLOUD-PLATFORM, DIGITALOCEAN-ASN).
 * SQL(~*)과 자바스크립트(RegExp) 양쪽에서 그대로 쓰므로 두 문법에 공통인 |와 ^·$만 쓴다
 */
const HOSTING =
  'amazon|google-cloud|^google$|microsoft|digitalocean|ovh|hetzner|linode|akamai|choopa|vultr|oracle|alibaba|tencent|huawei-cloud|contabo|leaseweb|m247|datacamp|scaleway|ionos|hostinger|naver cloud|nbp';

/**
 * 봇 의심 조건. 자동화 브라우저, 화면 실행 안 됨, 언어 정보 없음, 브라우저 헤더 없음, 알 수 없는 브라우저, 데이터센터 접속 중
 * 하나라도 해당하면 봇으로 의심한다
 */
const SUSPECT = `browser is not null and (webdriver is true or (js is not true and created_at <= now() - interval '1 minute')
  or lang is null or fetch_meta is false or browser like '기타%' or coalesce(network, '') ~* '${HOSTING}')`;
/**
 * 확실히 사람인 방문. 봇 의심 이유가 하나도 없고, 화면이 브라우저에서 실제로 실행된 것(js)까지 확인된 방문만 넣는다.
 * 방금 들어와 실행 신호를 기다리는 방문은 신호가 올 때까지 빠진다. 판별 정보(browser)가 없는 예전 방문도 빠진다
 */
const HUMAN = `browser is not null and js is true and not (${SUSPECT})`;

/** 방문 한 건. 시각은 한국 시간으로 초까지, 방문자 값은 같은 날 같은 사람인지 알아볼 만큼 앞 6자리만 낸다 */
export type Visit = {
  at: string;
  path: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  visitor: string;
  /** 아래는 봇을 가늠하는 정보. 이 칸들을 더하기 전에 남은 방문은 모두 null이다(db/visit_log.sql) */
  browser: string | null;
  lang: string | null;
  fetchMeta: boolean | null;
  js: boolean | null;
  webdriver: boolean | null;
  /** 화면을 보고 있던 시간(초). 1초 안에 떠났거나 이 칸을 더하기 전의 방문은 null이다 */
  duration: number | null;
  /**
   * 접속한 네트워크(AS) 번호와 이름. 표(ip_asn)에 없는 주소이거나 이 칸을 더하기 전의 방문은 null이다.
   * 번호는 bigint라 Neon 드라이버가 문자열로 돌려준다
   */
  asn: string | null;
  network: string | null;
};

/** 질문 한 건. 방문자 값은 Visit과 같이 앞 6자리만 낸다. 질문 기록에 방문자를 남기기 전의 질문은 null이다 */
export type Question = {
  at: string;
  /** 상세 페이지 옆 대화창이면 그 프로젝트 slug, 첫 화면이면 null */
  page: string | null;
  question: string;
  /** prepared · claude · notice */
  answeredBy: string;
  visitor: string | null;
};

/** Question 한 건을 읽는 칼럼 */
const QUESTION_COLUMNS = `to_char(${kst('created_at')}, 'YYYY-MM-DD HH24:MI:SS') as at, page, question,
  answered_by as "answeredBy", left(visitor, 6) as visitor`;

export type Stats = {
  /** 이 기간 사람의 방문 수. 방문 기록 화면으로 가는 링크에 쓴다 */
  visits: number;
  /** 최근 방문 몇 건. 전체는 방문 기록 화면(loadVisits)에서 본다 */
  recent: Visit[];
  /** 최근 질문 몇 건. 누가 물었는지 방문 기록과 이어 본다 */
  recentQuestions: Question[];
  claudeAnswers: { at: string; page: string | null; question: string; route: string | null; confidence: number | null }[];
  claudeDaily: { day: string; calls: number; input: number; cacheWrite: number; cacheRead: number; output: number }[];
};

export async function loadStats(env: Env, days: number): Promise<Stats | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  // 방문은 사람의 방문만 읽는다
  const visits = `env = $1 and created_at > $2 and ${HUMAN}`;
  const params = [env, since];

  const [totals, recent, recentQuestions, claudeAnswers, claudeDaily] = await Promise.all([
    sql.query(`select count(*)::int as visits from visit_log where ${visits}`, params),
    sql.query(`select ${VISIT_COLUMNS} from visit_log where ${visits} order by created_at desc limit ${RECENT}`, params),
    sql.query(`select ${QUESTION_COLUMNS} from ask_log where env = $1 and created_at > $2 order by created_at desc limit ${RECENT}`, params),
    sql.query(
      `select to_char(${kst('created_at')}, 'MM-DD HH24:MI') as at, page, question, route, confidence
       from ask_log where env = $1 and created_at > $2 and answered_by = 'claude'
       order by created_at desc limit 30`,
      params,
    ),
    sql.query(
      `select ${kst('created_at')}::date::text as day, count(*)::int as calls,
              coalesce(sum(input_tokens), 0)::int as input, coalesce(sum(cache_write), 0)::int as "cacheWrite",
              coalesce(sum(cache_read), 0)::int as "cacheRead", coalesce(sum(output_tokens), 0)::int as output
       from ask_log where env = $1 and created_at > $2 and answered_by = 'claude'
       group by day order by day desc`,
      params,
    ),
  ]);

  return {
    visits: totals[0]?.visits ?? 0,
    recent: recent as Visit[],
    recentQuestions: recentQuestions as Question[],
    claudeAnswers: claudeAnswers as Stats['claudeAnswers'],
    claudeDaily: claudeDaily as Stats['claudeDaily'],
  };
}

/**
 * 방문 기록 화면(app/admin/visits/page.tsx)의 한 쪽. 최신순으로 PAGE_SIZE건씩 끊는다.
 * visitor는 화면에 보이는 앞 6자리다. 주면 그 방문자의 방문만 고른다. 사람의 방문만 낸다.
 */
export async function loadVisits(
  env: Env,
  days: number,
  { page, visitor }: { page: number; visitor: string | null },
): Promise<{ visits: Visit[]; total: number } | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const params: unknown[] = [env, since];
  let where = `env = $1 and created_at > $2 and ${HUMAN}`;
  if (visitor) {
    params.push(visitor);
    where += ` and left(visitor, 6) = $${params.length}`;
  }

  const [visits, totals] = await Promise.all([
    sql.query(
      `select ${VISIT_COLUMNS} from visit_log where ${where}
       order by created_at desc limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`,
      params,
    ),
    sql.query(`select count(*)::int as total from visit_log where ${where}`, params),
  ]);
  return { visits: visits as Visit[], total: totals[0]?.total ?? 0 };
}

/** 방문자 한 명이 이 기간에 한 질문 전부. 방문 기록 화면에서 방문자 값으로 거를 때 함께 보여 준다. 오래된 것부터 낸다 */
export async function loadVisitorQuestions(env: Env, days: number, visitor: string): Promise<Question[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const rows = await sql.query(
    `select ${QUESTION_COLUMNS} from ask_log
     where env = $1 and created_at > $2 and left(visitor, 6) = $3 order by created_at`,
    [env, since, visitor],
  );
  return rows as Question[];
}
