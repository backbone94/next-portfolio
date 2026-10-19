import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '@/app/content/projects';
import { ENVS, PERIODS, loadStats, type Env, type Stats } from './stats';

/**
 * 관리자 화면. 방문 기록(visit_log)과 질문 기록(ask_log)을 한눈에 본다.
 * 비밀번호는 middleware.ts가 묻는다. 여기서도 ADMIN_PASSWORD가 없으면 한 번 더 막는다.
 *
 * 기본은 실제 사이트(production)의 지난 30일이다. ?env=preview, ?days=7로 바꿔 볼 수 있다.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { env?: string; days?: string } };

const number = (n: number) => n.toLocaleString('ko-KR');
const regions = new Intl.DisplayNames(['ko'], { type: 'region' });
const titles = new Map(projects.map((p) => [`/projects/${p.slug}`, p.title]));

function countryName(code: string | null) {
  if (!code) return '(알 수 없음)';
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
}

function pageName(path: string | null) {
  if (path === '/') return '첫 화면';
  return (path && titles.get(path)) ?? path ?? '';
}

/**
 * 유입 경로 이름. null은 브라우저가 출처를 보내지 않은 방문이다. 주소를 직접 친 경우뿐 아니라
 * PDF·메신저 앱에서 연 링크, 북마크, 이름을 밝히지 않는 봇이 모두 여기에 섞인다.
 * ref:로 시작하면 주소에 직접 붙인 출처 표시(?ref=resume)다(app/lib/visit.ts)
 */
const REF: Record<string, string> = { resume: '이력서 PDF' };

function sourceName(referrer: string | null) {
  if (!referrer) return '(출처 없음)';
  if (!referrer.startsWith('ref:')) return referrer;
  const ref = referrer.slice(4);
  return REF[ref] ? `${REF[ref]} (?ref=${ref})` : `?ref=${ref}`;
}

const DEVICE: Record<string, string> ={ mobile: '휴대폰', tablet: '태블릿', desktop: '컴퓨터' };

/**
 * 봇으로 의심할 이유. 하나라도 있으면 봇 의심이다. 이 정보를 남기기 전의 방문은 null을 낸다.
 * 화면 실행이 가장 확실한 신호다. HTML만 받아 가는 봇은 화면을 실행하지 않는다.
 * 브라우저를 통째로 조종하는 봇은 화면을 실행하므로, 자동화 표시·언어·헤더로 한 번 더 거른다.
 */
function botReasons(v: Stats['recent'][number]): string[] | null {
  if (v.browser == null) return null;
  const reasons: string[] = [];
  if (v.webdriver) reasons.push('자동화 브라우저');
  if (!v.js && !v.fresh) reasons.push('화면 실행 안 됨');
  if (!v.lang) reasons.push('언어 정보 없음');
  if (v.fetchMeta === false) reasons.push('브라우저 헤더 없음');
  if (v.browser.startsWith('기타')) reasons.push('알 수 없는 브라우저');
  return reasons;
}

export default async function AdminPage({ searchParams }: Props) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  const env: Env = ENVS.find((e) => e === searchParams.env) ?? 'production';
  const days = PERIODS.find((d) => String(d) === searchParams.days) ?? 30;
  const stats = await loadStats(env, days);
  const href = (next: { env?: Env; days?: number }) => `/admin?env=${next.env ?? env}&days=${next.days ?? days}`;

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <p className="font-medium text-accent">관리자</p>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">방문과 질문</h1>
      <p className="mt-4 max-w-prose text-muted">
        IP와 쿠키는 남기지 않습니다. 순방문은 같은 날 같은 기기를 한 명으로 셉니다. 날이 바뀌면 같은 사람도 새로 셉니다.
      </p>
      <p className="mt-2 max-w-prose text-sm text-muted">
        이 화면에 로그인한 브라우저와 EXCLUDED_IPS에 적은 IP의 방문은 기록하지 않습니다.
      </p>

      <nav aria-label="기간과 환경" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <Choices label="기간" items={PERIODS.map((d) => ({ key: String(d), text: `${d}일`, href: href({ days: d }), on: d === days }))} />
        <Choices label="환경" items={ENVS.map((e) => ({ key: e, text: e, href: href({ env: e }), on: e === env }))} />
      </nav>

      {stats ? <Dashboard stats={stats} /> : <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>}
    </div>
  );
}

function Choices({ label, items }: { label: string; items: { key: string; text: string; href: string; on: boolean }[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-muted">{label}</span>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.on ? 'page' : undefined}
          className={
            item.on
              ? 'rounded-md bg-accent px-3 py-1.5 font-medium text-accent-ink'
              : 'rounded-md bg-surface-2 px-3 py-1.5 font-medium transition-colors hover:text-accent'
          }
        >
          {item.text}
        </Link>
      ))}
    </div>
  );
}

function Verdict({ visit }: { visit: Stats['recent'][number] }) {
  const reasons = botReasons(visit);
  if (reasons == null) return <span className="text-muted">정보 없음</span>;
  if (reasons.length > 0) {
    return (
      <span className="whitespace-nowrap">
        <span className="font-medium">봇 의심</span>
        <span className="block text-xs text-muted">{reasons.join(', ')}</span>
      </span>
    );
  }
  return <span className="whitespace-nowrap text-muted">{visit.js ? '사람' : '확인 중'}</span>;
}

function Dashboard({ stats }: { stats: Stats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.visits));
  const verdicts = stats.recent.map(botReasons).filter((r): r is string[] => r != null);
  const judged = verdicts.length;
  const suspects = verdicts.filter((r) => r.length > 0).length;
  return (
    <>
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
        {[
          ['방문', stats.visits],
          ['순방문', stats.visitors],
          ['질문', stats.asks],
          ['Claude 답변', stats.claudeCalls],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface p-5">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="mt-1 text-3xl font-black tracking-[-0.02em]" data-numeric>
              {number(value as number)}
            </dd>
          </div>
        ))}
      </dl>

      <Block title="날짜별 방문">
        {stats.daily.length === 0 ? (
          <Empty />
        ) : (
          <Table head={['날짜', '방문', '순방문', '']} numeric={[1, 2]}>
            {stats.daily.map((d) => (
              <tr key={d.day} className="border-t">
                <td className="py-2 pr-4" data-numeric>
                  {d.day}
                </td>
                <td className="py-2 pr-4 text-right" data-numeric>
                  {number(d.visits)}
                </td>
                <td className="py-2 pr-4 text-right" data-numeric>
                  {number(d.visitors)}
                </td>
                <td className="w-1/2 py-2" aria-hidden>
                  <div className="h-2 rounded-full bg-accent/20">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${(d.visits / maxDaily) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Block>

      <div className="grid gap-x-12 lg:grid-cols-2">
        <Block title="많이 본 페이지">
          <CountTable head={['페이지', '방문', '순방문']} rows={stats.pages.map((p) => [pageName(p.label), p.count, p.visitors ?? 0])} />
        </Block>
        <Block title="유입 경로" note="방문자마다 그날 처음 들어온 경로. 출처 없음은 PDF·메신저 앱·북마크처럼 브라우저가 출처를 보내지 않은 방문입니다">
          <CountTable head={['경로', '순방문']} rows={stats.referrers.map((r) => [sourceName(r.label), r.count])} />
        </Block>
        <Block title="국가">
          <CountTable head={['국가', '순방문']} rows={stats.countries.map((c) => [countryName(c.label), c.count])} />
        </Block>
        <Block title="도시와 기기">
          <CountTable head={['도시', '순방문']} rows={stats.cities.map((c) => [`${c.city} · ${countryName(c.country)}`, c.count])} />
          <div className="mt-6">
            <CountTable head={['기기', '순방문']} rows={stats.devices.map((d) => [DEVICE[d.label ?? ''] ?? d.label ?? '', d.count])} />
          </div>
        </Block>
      </div>

      <Block
        title="최근 방문"
        note={`한국 시간 기준, 최근 100건. 방문자 값이 같으면 같은 날 같은 기기다. 판별한 ${number(judged)}건 중 봇 의심 ${number(suspects)}건`}
      >
        {stats.recent.length === 0 ? (
          <Empty />
        ) : (
          <Table head={['시각', '페이지', '유입 경로', '위치', '기기', '언어', '판별', '방문자']}>
            {stats.recent.map((v, i) => (
              <tr key={i} className="border-t align-top">
                <td className="whitespace-nowrap py-2 pr-4" data-numeric>
                  <time>{v.at}</time>
                </td>
                <td className="py-2 pr-4">{pageName(v.path)}</td>
                <td className="py-2 pr-4 text-muted">{sourceName(v.referrer)}</td>
                <td className="py-2 pr-4 text-muted">{v.city ? `${v.city} · ${countryName(v.country)}` : countryName(v.country)}</td>
                <td className="whitespace-nowrap py-2 pr-4 text-muted">
                  {DEVICE[v.device ?? ''] ?? v.device}
                  {v.browser && <span className="block text-xs">{v.browser}</span>}
                </td>
                <td className="whitespace-nowrap py-2 pr-4 text-muted">{v.lang ?? (v.browser ? '없음' : '')}</td>
                <td className="py-2 pr-4">
                  <Verdict visit={v} />
                </td>
                <td className="py-2 font-mono text-xs text-muted">{v.visitor}</td>
              </tr>
            ))}
          </Table>
        )}
      </Block>

      <Block title="많이 들어온 질문">
        <CountTable head={['질문', '횟수', '마지막']} rows={stats.questions.map((q) => [q.question, q.asked, q.last])} />
      </Block>

      <Block title="Claude가 답한 질문" note="자주 나오면 미리 써 둘 답의 후보 (최근 30건)">
        {stats.claudeAnswers.length === 0 ? (
          <Empty />
        ) : (
          <Table head={['시각', '질문', '어디서', '분류', '확률']} numeric={[4]}>
            {stats.claudeAnswers.map((a, i) => (
              <tr key={i} className="border-t align-top">
                <td className="whitespace-nowrap py-2 pr-4 text-muted" data-numeric>
                  {a.at}
                </td>
                <td className="py-2 pr-4">{a.question}</td>
                <td className="py-2 pr-4 text-muted">{a.page ? pageName(`/projects/${a.page}`) : '첫 화면'}</td>
                <td className="py-2 pr-4 text-muted">{a.route}</td>
                <td className="py-2 text-right text-muted" data-numeric>
                  {a.confidence == null ? '' : a.confidence.toFixed(2)}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Block>

      <Block title="날짜별 Claude 호출과 토큰" note="캐시 쓰기는 입력의 1.25배, 캐시 읽기는 0.1배로 계산된다">
        {stats.claudeDaily.length === 0 ? (
          <Empty />
        ) : (
          <Table head={['날짜', '호출', '입력', '캐시 쓰기', '캐시 읽기', '출력']} numeric={[1, 2, 3, 4, 5]}>
            {stats.claudeDaily.map((d) => (
              <tr key={d.day} className="border-t">
                {[d.day, d.calls, d.input, d.cacheWrite, d.cacheRead, d.output].map((v, i) => (
                  <td key={i} className={`py-2 pr-4 ${i ? 'text-right' : ''}`} data-numeric>
                    {typeof v === 'number' ? number(v) : v}
                  </td>
                ))}
              </tr>
            ))}
          </Table>
        )}
      </Block>
    </>
  );
}

function Block({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-xl font-black tracking-[-0.02em]">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-4 overflow-x-auto">{children}</div>
    </section>
  );
}

function Table({ head, numeric = [], children }: { head: string[]; numeric?: number[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted">
          {head.map((h, i) => (
            <th key={i} scope="col" className={`pb-2 pr-4 font-medium ${numeric.includes(i) ? 'text-right' : 'text-left'}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/** 첫 칸은 이름, 나머지는 숫자인 표. 숫자 칸은 오른쪽으로 붙인다 */
function CountTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (rows.length === 0) return <Empty />;
  return (
    <Table head={head} numeric={head.map((_, i) => i).filter((i) => i > 0)}>
      {rows.map((row, r) => (
        <tr key={r} className="border-t align-top">
          {row.map((cell, i) => (
            <td key={i} className={i ? 'whitespace-nowrap py-2 pl-4 text-right' : 'py-2'} data-numeric={i ? '' : undefined}>
              {typeof cell === 'number' ? number(cell) : cell}
            </td>
          ))}
        </tr>
      ))}
    </Table>
  );
}

function Empty() {
  return <p className="text-sm text-muted">아직 기록이 없습니다.</p>;
}
