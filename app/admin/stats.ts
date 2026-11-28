import { neon } from '@neondatabase/serverless';

/**
 * 관리자 화면이 보여 주는 숫자. visit_log(db/visit_log.sql)와 ask_log(db/ask_log.sql)를 읽기만 한다.
 * 봇과 의심 접속은 운영 기록에 저장되고 관리자 화면의 방문 목록과 집계에서는 제외된다.
 * 실제 사이트(production)의 기록만 읽는다. 미리보기 배포와 로컬 개발에서 남은 기록은 보지 않는다. 날짜는 한국 시간으로 자른다.
 */

/** 관리자 화면이 읽는 기록의 환경. 기록할 때 VERCEL_ENV 값으로 남긴다(app/lib/visit.ts) */
const ENV = 'production';
/** 날짜별 Claude 호출과 토큰 표에 보여 주는 날수 */
const CLAUDE_DAYS = 30;

/** 대시보드 방문과 질문 표에 보여 주는 최근 기록 수 */
export const RECENT = 10;
/** 전체 기록 화면 한 쪽에 보여 주는 기록 수 */
export const PAGE_SIZE = 50;

const kst = (column: string) => `(${column} at time zone 'Asia/Seoul')`;
const visitorFilter = (visitor: string) => (visitor.length === 6 ? 'left(visitor, 6) = $2' : 'visitor = $2');

/** Visit 한 건을 읽는 칼럼 */
const VISIT_COLUMNS = `to_char(${kst('created_at')}, 'YYYY-MM-DD HH24:MI:SS') as at, path, referrer, country, city, device,
  visitor, browser, lang, fetch_meta as "fetchMeta", js, webdriver, duration, asn, network, ip_district as "ipDistrict",
  case when left(visitor, 2) = 'b_' then
    case
      when lag(created_at) over browser_visits is null then 'first'
      when created_at - lag(created_at) over browser_visits >= interval '30 minutes' then 'return'
    end
  end as "visitKind"`;
const BY_BROWSER = 'window browser_visits as (partition by visitor order by created_at, id)';

/** ip_asn 표에 저장되는 클라우드, CDN, 호스팅망의 등록 이름. */
const HOSTING = [
  'amazon', 'google-cloud', '^google$', 'microsoft', 'digitalocean', 'ovh', 'hetzner', 'linode',
  'akamai', 'choopa', 'vultr', 'oracle', 'alibaba', 'tencent', 'huawei[ -]cloud', 'contabo',
  'leaseweb', 'm247', 'datacamp', '^cdnext$', 'scaleway', 'ionos', 'hostinger', 'naver cloud',
  'nbp', 'clouvider', 'glesys',
].join('|');

/** 운영 기록에 나타난 유입 도메인은 Matomo 공개 스팸 목록에서 확인했다. */
const REFERRER_SPAM = '(^|[.])scriblihelp[.]com[.]?(:[0-9]+)?$';

// GSL 회선은 통신용으로도 사용한다. 여러 국가에서 같은 브라우저로 홈만 연 기록과 같은 조건일 때 제외한다.
const TRANSIT_SCAN = `(
  asn is not distinct from 137409 and path = '/' and referrer is null and duration is null
  and lang = 'en-US' and browser ~ '^Chrome 146[^[:alnum:]]+Windows$'
)`;

/** 화면 실행을 확인하고 기존 봇 신호, 알려진 스팸 유입과 의심 접속을 검사한다. */
const HUMAN = `not is_bot and browser is not null and js is true and not (
  webdriver is true or lang is null or fetch_meta is false or browser like '기타%'
  or coalesce(network, '') ~* '${HOSTING}' or coalesce(referrer, '') ~* '${REFERRER_SPAM}'
  or ${TRANSIT_SCAN}
)`;

/** 방문 한 건. 시각은 한국 시간으로 초까지 보여 준다. */
export type Visit = {
  at: string;
  path: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  ipDistrict: string | null;
  device: string | null;
  visitor: string;
  visitKind: 'first' | 'return' | null;
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

/** 질문 한 건. 방문자 값을 저장하기 전에 남은 질문은 null이다. */
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
  answered_by as "answeredBy", visitor`;
const NEWEST_QUESTIONS = 'order by created_at desc, id desc';

export type Stats = {
  /** 사람의 방문 수 전체. 방문 기록 화면으로 가는 링크에 쓴다 */
  visits: number;
  /** 최근 방문 몇 건. 전체는 방문 기록 화면(loadVisits)에서 본다 */
  recent: Visit[];
  /** 최근 질문 몇 건. 누가 물었는지 방문 기록과 이어 본다 */
  recentQuestions: Question[];
  claudeAnswers: { at: string; page: string | null; question: string; route: string | null; confidence: number | null }[];
  claudeDaily: { day: string; calls: number; input: number; cacheWrite: number; cacheRead: number; output: number }[];
};

export async function loadStats(): Promise<Stats | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  // 방문은 사람의 방문만 읽는다
  const visits = `env = $1 and ${HUMAN}`;
  const params = [ENV];

  const [totals, recent, recentQuestions, claudeAnswers, claudeDaily] = await Promise.all([
    sql.query(`select count(*)::int as visits from visit_log where ${visits}`, params),
    sql.query(
      `select ${VISIT_COLUMNS} from visit_log where ${visits} ${BY_BROWSER} order by created_at desc, id desc limit ${RECENT}`,
      params,
    ),
    sql.query(`select ${QUESTION_COLUMNS} from ask_log where env = $1 ${NEWEST_QUESTIONS} limit ${RECENT}`, params),
    sql.query(
      `select to_char(${kst('created_at')}, 'MM-DD HH24:MI') as at, page, question, route, confidence
       from ask_log where env = $1 and answered_by = 'claude'
       order by created_at desc limit 30`,
      params,
    ),
    sql.query(
      `select ${kst('created_at')}::date::text as day, count(*)::int as calls,
              coalesce(sum(input_tokens), 0)::int as input, coalesce(sum(cache_write), 0)::int as "cacheWrite",
              coalesce(sum(cache_read), 0)::int as "cacheRead", coalesce(sum(output_tokens), 0)::int as output
       from ask_log where env = $1 and answered_by = 'claude'
         and created_at > now() - interval '${CLAUDE_DAYS} days'
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

export async function loadQuestions(page: number): Promise<{ questions: Question[]; total: number } | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const [questions, totals] = await sql.transaction(
    [
      sql.query(
        `select ${QUESTION_COLUMNS} from ask_log where env = $1 ${NEWEST_QUESTIONS} limit $2 offset $3`,
        [ENV, PAGE_SIZE, (page - 1) * PAGE_SIZE],
      ),
      sql.query('select count(*)::int as total from ask_log where env = $1', [ENV]),
    ],
    { isolationLevel: 'RepeatableRead', readOnly: true },
  );
  return { questions: questions as Question[], total: totals[0]?.total ?? 0 };
}

/**
 * 방문 기록 화면(app/admin/visits/page.tsx)의 한 쪽. 최신순으로 PAGE_SIZE건씩 끊는다.
 * 방문자 값으로 고를 수 있다. 기존 6자리 링크도 지원한다.
 */
export async function loadVisits({ page, visitor }: { page: number; visitor: string | null }): Promise<{ visits: Visit[]; total: number } | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  const params: unknown[] = [ENV];
  let where = `env = $1 and ${HUMAN}`;
  if (visitor) {
    params.push(visitor);
    where += ` and ${visitorFilter(visitor)}`;
  }

  const [visits, totals] = await Promise.all([
    sql.query(
      `select ${VISIT_COLUMNS} from visit_log where ${where} ${BY_BROWSER}
       order by created_at desc, id desc limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`,
      params,
    ),
    sql.query(`select count(*)::int as total from visit_log where ${where}`, params),
  ]);
  return { visits: visits as Visit[], total: totals[0]?.total ?? 0 };
}

/** 방문자 한 명이 한 질문 전부. 방문 기록 화면에서 방문자 값으로 거를 때 함께 보여 준다. 오래된 것부터 낸다 */
export async function loadVisitorQuestions(visitor: string): Promise<Question[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query(
    `select ${QUESTION_COLUMNS} from ask_log
     where env = $1 and ${visitorFilter(visitor)} order by created_at`,
    [ENV, visitor],
  );
  return rows as Question[];
}
