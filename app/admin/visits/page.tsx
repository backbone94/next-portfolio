import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PAGE_SIZE, loadVisitorQuestions, loadVisits } from '../stats';
import { Block, QuestionTable, VisitTable, adminHref, number } from '../ui';

/**
 * 방문 기록 전체. 대시보드(app/admin/page.tsx)는 최근 몇 건만 보여 주고, 여기서 최신순으로 쪽을 나눠 본다.
 * 비밀번호는 middleware.ts가 /admin 아래를 모두 묻는다.
 *
 * ?visitor=3fefab처럼 방문자 값을 주면 그 방문자의 방문과 질문만 본다. 같은 날 한 사람이 어떻게 옮겨 다니며 무엇을 물었는지 따라갈 때 쓴다.
 * 대시보드와 같이 확실히 사람인 방문만 보여 준다.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '방문 기록',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { visitor?: string; page?: string } };


export default async function VisitsPage({ searchParams }: Props) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  // 화면에 보이는 앞 6자리만 받는다(app/admin/stats.ts의 Visit)
  const visitor = /^[0-9a-f]{6}$/.test(searchParams.visitor ?? '') ? searchParams.visitor! : null;
  const page = Math.max(1, Math.floor(Number(searchParams.page)) || 1);

  const [result, questions] = await Promise.all([
    loadVisits({ page, visitor }),
    visitor ? loadVisitorQuestions(visitor) : null,
  ]);
  const href = (next: { visitor?: string | null; page?: number }) =>
    adminHref('/admin/visits', {
      visitor: next.visitor === undefined ? visitor : next.visitor,
      page: next.page,
    });

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <Link href={adminHref('/admin')} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
        ← 대시보드
      </Link>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">방문 기록</h1>
      <p className="mt-4 max-w-prose text-muted">
        한국 시간 기준 최신순입니다. 방문자 값이 같으면 같은 날 같은 기기입니다. 방문자 값을 누르면 그 방문자의 방문만 모아 봅니다.
      </p>

      {visitor && (
        <p className="mt-6 text-sm">
          방문자 <span className="font-mono">{visitor}</span>의 방문과 질문만 보고 있습니다.{' '}
          <Link href={href({ visitor: null })} className="font-medium text-accent underline-offset-4 hover:underline">
            모든 방문 보기
          </Link>
        </p>
      )}

      {questions && (
        <Block title={`질문 ${number(questions.length)}건`} note="이 방문자가 한 질문입니다. 오래된 것부터 보여 줍니다">
          <QuestionTable questions={questions} showVisitor={false} />
        </Block>
      )}

      {result ? (
        <Block title={`${number(result.total)}건`} note={range(page, result.total)}>
          <VisitTable visits={result.visits} />
          <Pager page={page} total={result.total} href={(p) => href({ page: p })} />
        </Block>
      ) : (
        <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>
      )}
    </div>
  );
}

/** 지금 쪽이 몇 번째부터 몇 번째까지인지 (51–100번째) */
function range(page: number, total: number) {
  if (total === 0) return undefined;
  const first = (page - 1) * PAGE_SIZE + 1;
  if (first > total) return '이 쪽에는 방문이 없습니다.';
  return `${number(first)}–${number(Math.min(page * PAGE_SIZE, total))}번째`;
}

function Pager({ page, total, href }: { page: number; total: number; href: (page: number) => string }) {
  const last = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (last === 1) return null;
  const step = 'rounded-md bg-surface-2 px-3 py-1.5 font-medium transition-colors hover:text-accent';
  return (
    <nav aria-label="쪽 옮기기" className="mt-6 flex items-center gap-3 text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} className={step}>
          ← 최신
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-muted">← 최신</span>
      )}
      <span className="text-muted" data-numeric>
        {number(Math.min(page, last))} / {number(last)}쪽
      </span>
      {page < last ? (
        <Link href={href(page + 1)} className={step}>
          이전 →
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-muted">이전 →</span>
      )}
    </nav>
  );
}
