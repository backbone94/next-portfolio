import { neon } from '@neondatabase/serverless';

/**
 * 관리자 화면이 보여 주는 숫자. visit_log(db/visit_log.sql)와 ask_log(db/ask_log.sql)를 읽기만 한다.
 * ask_log 쪽 쿼리는 db/queries.sql의 1·2·4번과 같다. 날짜는 한국 시간으로 자른다.
 */

export const ENVS = ['production', 'preview', 'development'] as const;
export type Env = (typeof ENVS)[number];
export const PERIODS = [7, 30, 90] as const;

type Count = { label: string | null; count: number; visitors?: number };

export type Stats = {
  visits: number;
  visitors: number;
  asks: number;
  claudeCalls: number;
  daily: { day: string; visits: number; visitors: number }[];
  pages: Count[];
  referrers: Count[];
  countries: Count[];
  cities: { country: string | null; city: string | null; count: number }[];
  devices: Count[];
  recent: {
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
    /** 1분 안에 남은 방문. 화면 실행 신호가 아직 오지 않았을 수 있다 */
    fresh: boolean;
  }[];
  questions: { question: string; asked: number; last: string }[];
  claudeAnswers: { at: string; page: string | null; question: string; route: string | null; confidence: number | null }[];
  claudeDaily: { day: string; calls: number; input: number; cacheWrite: number; cacheRead: number; output: number }[];
};

export async function loadStats(env: Env, days: number): Promise<Stats | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const kst = (column: string) => `(${column} at time zone 'Asia/Seoul')`;

  const [totals, daily, pages, referrers, countries, cities, devices, recent, askTotals, questions, claudeAnswers, claudeDaily] =
    await Promise.all([
      // visitor 값은 날마다 바뀌므로 서로 다른 값의 수가 곧 "날짜별 순방문 수의 합"이다
      sql`select count(*)::int as visits, count(distinct visitor)::int as visitors
          from visit_log where env = ${env} and created_at > ${since}`,
      sql.query(
        `select ${kst('created_at')}::date::text as day, count(*)::int as visits, count(distinct visitor)::int as visitors
         from visit_log where env = $1 and created_at > $2
         group by day order by day desc`,
        [env, since],
      ),
      sql`select path as label, count(*)::int as count, count(distinct visitor)::int as visitors
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
      // 방문 한 건씩. 시각은 한국 시간으로 초까지, 방문자 값은 같은 날 같은 사람인지 알아볼 만큼 앞 6자리만 낸다
      sql.query(
        `select to_char(${kst('created_at')}, 'YYYY-MM-DD HH24:MI:SS') as at, path, referrer, country, city, device,
                left(visitor, 6) as visitor, browser, lang, fetch_meta as "fetchMeta", js, webdriver,
                created_at > now() - interval '1 minute' as fresh
         from visit_log where env = $1 and created_at > $2
         order by created_at desc limit 100`,
        [env, since],
      ),
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
    asks: askTotals[0]?.asks ?? 0,
    claudeCalls: askTotals[0]?.claude ?? 0,
    daily: daily as Stats['daily'],
    pages: pages as Count[],
    referrers: referrers as Count[],
    countries: countries as Count[],
    cities: cities as Stats['cities'],
    devices: devices as Count[],
    recent: recent as Stats['recent'],
    questions: questions as Stats['questions'],
    claudeAnswers: claudeAnswers as Stats['claudeAnswers'],
    claudeDaily: claudeDaily as Stats['claudeDaily'],
  };
}
