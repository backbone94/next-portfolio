import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ENVS, PERIODS, RECENT, loadStats, type Env, type Stats } from './stats';
import { Block, Choices, Empty, QuestionTable, Table, VisitTable, adminHref, number, pageName } from './ui';

/**
 * 관리자 화면. 최근 방문과 질문, Claude가 답한 질문과 그 비용(토큰)을 본다.
 * 비밀번호는 middleware.ts가 묻는다. 여기서도 ADMIN_PASSWORD가 없으면 한 번 더 막는다.
 *
 * 기본은 실제 사이트(production)의 지난 30일이다. ?env=preview, ?days=7로 바꿔 볼 수 있다.
 * 방문은 확실히 사람인 것만 보여 준다(app/admin/stats.ts의 HUMAN). 봇과 봇 의심 방문은 보여 주지 않는다.
 * 방문은 최근 몇 건만 보여 주고, 전체는 방문 기록 화면(app/admin/visits/page.tsx)에서 쪽을 나눠 본다.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { env?: string; days?: string } };

export default async function AdminPage({ searchParams }: Props) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  const env: Env = ENVS.find((e) => e === searchParams.env) ?? 'production';
  const days = PERIODS.find((d) => String(d) === searchParams.days) ?? 30;
  const stats = await loadStats(env, days);
  const href = (next: { env?: Env; days?: number }) => adminHref('/admin', { env: next.env ?? env, days: next.days ?? days });

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <p className="font-medium text-accent">관리자</p>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">방문과 질문</h1>
      <p className="mt-4 max-w-prose text-muted">
        IP와 쿠키는 남기지 않습니다. 이 화면에 로그인한 브라우저와 EXCLUDED_IPS에 적은 IP의 방문은 기록하지 않습니다.
        방문은 화면이 브라우저에서 실제로 실행된 사람의 방문만 보여 줍니다.
      </p>

      <nav aria-label="기간과 환경" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <Choices label="기간" items={PERIODS.map((d) => ({ key: String(d), text: `${d}일`, href: href({ days: d }), on: d === days }))} />
        <Choices label="환경" items={ENVS.map((e) => ({ key: e, text: e, href: href({ env: e }), on: e === env }))} />
      </nav>

      {stats ? <Dashboard stats={stats} env={env} days={days} /> : <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>}
    </div>
  );
}

function Dashboard({ stats, env, days }: { stats: Stats; env: Env; days: number }) {
  return (
    <>
      <Block
        title="최근 방문"
        note={`한국 시간 기준, 최근 ${RECENT}건. 방문자 값이 같으면 같은 날 같은 기기다`}
        action={
          <Link href={adminHref('/admin/visits', { env, days })} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            전체 {number(stats.visits)}건 보기 →
          </Link>
        }
      >
        <VisitTable visits={stats.recent} env={env} days={days} />
      </Block>

      <Block
        title="최근 질문"
        note={`한국 시간 기준, 최근 ${RECENT}건. 방문자 값을 누르면 그 방문자가 어떤 페이지를 보고 물었는지 함께 봅니다. 방문자를 남기기 전의 질문은 없음으로 나옵니다`}
      >
        <QuestionTable questions={stats.recentQuestions} env={env} days={days} />
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
