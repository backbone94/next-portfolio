import { neon } from '@neondatabase/serverless';

/**
 * 관리자 화면이 보여 주는 숫자. visit_log(db/visit_log.sql)와 ask_log(db/ask_log.sql)를 읽기만 한다.
 * ask_log 쪽 쿼리는 db/queries.sql의 1·2·4번과 같다. 날짜는 한국 시간으로 자른다.
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
  left(visitor, 6) as visitor, browser, lang, fetch_meta as "fetchMeta", js, webdriver, duration,
  created_at > now() - interval '1 minute' as fresh`;

/**
 * 봇 의심 조건. 관리자 화면의 botReasons(app/admin/ui.tsx)와 같은 기준이다. 한쪽을 바꾸면 다른 쪽도 바꾼다.
 * 판별 정보(browser)가 없는 예전 방문은 어느 쪽에도 넣지 않는다
 */
const SUSPECT = `browser is not null and (webdriver is true or (js is not true and created_at <= now() - interval '1 minute')
  or lang is null or fetch_meta is false or browser like '기타%')`;
const HUMAN = `browser is not null and not (${SUSPECT})`;

export const KINDS = ['all', 'human', 'suspect'] as const;
export type Kind = (typeof KINDS)[number];

type Count = { label: string | null; count: number; visitors?: number };
/** 많이 본 페이지. 평균 머문 시간(초)은 시간이 적힌 방문만으로 낸다. 하나도 없으면 null이다 */
type PageCount = Count & { duration: number | null };

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
  /** 1분 안에 남은 방문. 화면 실행 신호가 아직 오지 않았을 수 있다 */
  fresh: boolean;
};

export type Stats = {
  visits: number;
  visitors: number;
  /** 봇 판별 정보가 있는 방문 수와 그중 봇 의심 수 (기간 전체) */
  judged: number;
  suspects: number;
  asks: number;
  claudeCalls: number;
  daily: { day: string; visits: number; visitors: number }[];
  pages: PageCount[];
  referrers: Count[];
  countries: Count[];
  cities: { country: string | null; city: string | null; count: number }[];
  devices: Count[];
  /** 최근 방문 몇 건. 전체는 방문 기록 화면(loadVisits)에서 본다 */
  recent: Visit[];
  questions: { question: string; asked: number; last: string }[];
  claudeAnswers: { at: string; page: string | null; question: string; route: string | null; confidence: number | null }[];
  claudeDaily: { day: string; calls: number; input: number; cacheWrite: number; cacheRead: number; output: number }[];
};

export async function loadStats(env: Env, days: number): Promise<Stats | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [totals, daily, pages, referrers, countries, cities, devices, recent, askTotals, questions, claudeAnswers, claudeDaily] =
    await Promise.all([
      // visitor 값은 날마다 바뀌므로 서로 다른 값의 수가 곧 "날짜별 순방문 수의 합"이다
      sql.query(
        `select count(*)::int as visits, count(distinct visitor)::int as visitors,
                count(*) filter (where browser is not null)::int as judged,
                count(*) filter (where ${SUSPECT})::int as suspects
         from visit_log where env = $1 and created_at > $2`,
        [env, since],
      ),
      sql.query(
        `select ${kst('created_at')}::date::text as day, count(*)::int as visits, count(distinct visitor)::int as visitors
         from visit_log where env = $1 and created_at > $2
         group by day order by day desc`,
        [env, since],
      ),
      sql`select path as label, count(*)::int as count, count(distinct visitor)::int as visitors,
                round(avg(duration))::int as duration
          from visit_log where env = ${env} and created_at > ${since}
          group by path order by count desc limit 20`,
      // 방문자마다 그날 처음 연 페이지의 유입 경로만 센다. 사이트 안에서 옮겨 다닌 기록은 referrer가 null이라
      // 전부 세면 "출처 없음"이 부풀어 오른다
      sql`select referrer as label, count(*)::int as count
          from (select distinct on (visitor) referrer from visit_log
                where env = ${env} and created_at > ${since} order by visitor, created_at) first_visit
          group by referrer order by count desc limit 15`,
      sql`select country as label, count(distinct visitor)::int as count
          from visit_log where env = ${env} and created_at > ${since}
          group by country order by count desc limit 15`,
      sql`select country, city, count(distinct visitor)::int as count
          from visit_log where env = ${env} and created_at > ${since} and city is not null
          group by country, city order by count desc limit 10`,
      sql`select device as label, count(distinct visitor)::int as count
          from visit_log where env = ${env} and created_at > ${since}
          group by device order by count desc`,
      sql.query(`select ${VISIT_COLUMNS} from visit_log where env = $1 and created_at > $2 order by created_at desc limit ${RECENT}`, [
        env,
        since,
      ]),
      sql`select count(*)::int as asks, count(*) filter (where answered_by = 'claude')::int as claude
          from ask_log where env = ${env} and created_at > ${since}`,
      sql.query(
        `select question, count(*)::int as asked, to_char(max(${kst('created_at')}), 'MM-DD HH24:MI') as last
         from ask_log where env = $1 and created_at > $2
         group by question order by asked desc, max(created_at) desc limit 20`,
        [env, since],
      ),
      sql.query(
        `select to_char(${kst('created_at')}, 'MM-DD HH24:MI') as at, page, question, route, confidence
         from ask_log where env = $1 and created_at > $2 and answered_by = 'claude'
         order by created_at desc limit 30`,
        [env, since],
      ),
      sql.query(
        `select ${kst('created_at')}::date::text as day, count(*)::int as calls,
                coalesce(sum(input_tokens), 0)::int as input, coalesce(sum(cache_write), 0)::int as "cacheWrite",
                coalesce(sum(cache_read), 0)::int as "cacheRead", coalesce(sum(output_tokens), 0)::int as output
         from ask_log where env = $1 and created_at > $2 and answered_by = 'claude'
         group by day order by day desc`,
        [env, since],
      ),
    ]);

  return {
    visits: totals[0]?.visits ?? 0,
    visitors: totals[0]?.visitors ?? 0,
    judged: totals[0]?.judged ?? 0,
    suspects: totals[0]?.suspects ?? 0,
    asks: askTotals[0]?.asks ?? 0,
    claudeCalls: askTotals[0]?.claude ?? 0,
    daily: daily as Stats['daily'],
    pages: pages as PageCount[],
    referrers: referrers as Count[],
    countries: countries as Count[],
    cities: cities as Stats['cities'],
    devices: devices as Count[],
    recent: recent as Visit[],
    questions: questions as Stats['questions'],
    claudeAnswers: claudeAnswers as Stats['claudeAnswers'],
    claudeDaily: claudeDaily as Stats['claudeDaily'],
  };
}

/**
 * 방문 기록 화면(app/admin/visits/page.tsx)의 한 쪽. 최신순으로 PAGE_SIZE건씩 끊는다.
 * visitor는 화면에 보이는 앞 6자리다. 주면 그 방문자의 방문만, kind를 주면 사람이나 봇 의심만 고른다.
 */
export async function loadVisits(
  env: Env,
  days: number,
  { page, visitor, kind }: { page: number; visitor: string | null; kind: Kind },
): Promise<{ visits: Visit[]; total: number } | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const params: unknown[] = [env, since];
  let where = 'env = $1 and created_at > $2';
  if (visitor) {
    params.push(visitor);
    where += ` and left(visitor, 6) = $${params.length}`;
  }
  if (kind === 'human') where += ` and ${HUMAN}`;
  if (kind === 'suspect') where += ` and ${SUSPECT}`;

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
