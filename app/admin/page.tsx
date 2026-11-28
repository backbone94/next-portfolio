import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RECENT, loadStats, type Stats } from './stats';
import { Block, Empty, QuestionTable, Table, VisitTable, adminHref, number, pageName } from './ui';

/**
 * 관리자 화면. 최근 방문과 질문, Claude가 답한 질문과 그 비용(토큰)을 본다.
 * 비밀번호는 proxy.ts에서 확인한다.
 *
 * 실제 사이트(production)의 기록만 본다.
 * 방문은 확실히 사람인 것만 보여 준다(app/admin/stats.ts의 HUMAN). 봇과 봇 의심 방문은 보여 주지 않는다.
 * 방문은 최근 몇 건만 보여 주고, 전체는 방문 기록 화면(app/admin/visits/page.tsx)에서 쪽을 나눠 본다.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ network?: string }> }) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  const [stats, { network }] = await Promise.all([loadStats(), searchParams]);

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <p className="font-medium text-accent">관리자</p>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">방문과 질문</h1>
      <p className="mt-4 max-w-prose text-muted">
        이 화면에는 사람의 방문으로 판단한 기록만 표시됩니다. 봇 방문은 데이터베이스에서 확인할 수 있습니다.
      </p>

      <VisitExclusions state={network} />
      {stats ? <Dashboard stats={stats} /> : <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>}
    </div>
  );
}

function VisitExclusions({ state }: { state?: string }) {
  const message = state === 'excluded'
    ? '현재 네트워크를 방문 기록에서 제외했습니다.'
    : state === 'included'
      ? '현재 네트워크의 제외 설정을 해제했습니다.'
      : state === 'failed'
        ? '네트워크 설정을 저장하지 못했습니다.'
        : null;
  const button = 'rounded-md bg-surface-2 px-3 py-2 text-sm font-medium transition-colors hover:text-accent';

  return (
    <Block title="내 방문 제외">
      <p className="max-w-prose text-sm text-muted">
        로그인한 이 브라우저의 방문은 자동으로 제외됩니다. 휴대폰에서 평소 쓰는 브라우저로 이 화면에 로그인하면
        모바일 데이터로 접속할 때도 제외됩니다. 집에서는 홈 네트워크를 등록하세요.
      </p>
      <form action="/admin/networks" method="post" className="mt-3 flex flex-wrap gap-2">
        <button type="submit" name="action" value="exclude" className={button}>현재 네트워크 제외</button>
        <button type="submit" name="action" value="include" className={button}>현재 네트워크 제외 해제</button>
      </form>
      <p className="mt-2 text-xs text-muted">인터넷 회선 주소가 바뀌면 현재 네트워크를 다시 등록하세요.</p>
      {message && <p className="mt-2 text-sm" role="status">{message}</p>}
    </Block>
  );
}

function Dashboard({ stats }: { stats: Stats }) {
  return (
    <>
      <Block
        title="최근 방문"
        note={`한국 시간 기준, 최근 ${RECENT}건. 방문자 값을 누르면 그 브라우저의 방문 기록이 열립니다`}
        action={
          <Link href={adminHref('/admin/visits')} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            전체 {number(stats.visits)}건 보기 →
          </Link>
        }
      >
        <VisitTable visits={stats.recent} />
      </Block>

      <Block
        title="최근 질문"
        note={`한국 시간 기준, 최근 ${RECENT}건. 방문자 값을 누르면 그 방문자가 어떤 페이지를 보고 물었는지 함께 봅니다. 방문자를 남기기 전의 질문은 없음으로 나옵니다`}
        action={
          <Link href={adminHref('/admin/questions')} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            전체 질문 보기 →
          </Link>
        }
      >
        <QuestionTable questions={stats.recentQuestions} />
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
                <td className="py-2 pr-4 text-muted">{a.page ? pageName(`/projects/${a.page}`) : 'Jun에게 묻기'}</td>
                <td className="py-2 pr-4 text-muted">{a.route}</td>
                <td className="py-2 text-right text-muted" data-numeric>
                  {a.confidence == null ? '' : a.confidence.toFixed(2)}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Block>

      <Block title="날짜별 Claude 호출과 토큰" note="최근 30일. 캐시 쓰기는 입력의 1.25배, 캐시 읽기는 0.1배로 계산된다">
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
