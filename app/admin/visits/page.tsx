import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Pager, pageRange, parsePage } from '../pagination';
import { loadVisitorQuestions, loadVisits } from '../stats';
import { Block, QuestionTable, VisitTable, adminHref, number, visitorLabel } from '../ui';

/**
 * 방문 기록 전체. 대시보드(app/admin/page.tsx)는 최근 몇 건만 보여 주고, 여기서 최신순으로 쪽을 나눠 본다.
 * 비밀번호는 proxy.ts에서 확인한다.
 *
 * 방문자 값으로 같은 브라우저의 방문과 질문을 모아 본다.
 * 대시보드와 같이 확실히 사람인 방문만 보여 준다.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ visitor?: string; page?: string }> };


export default async function VisitsPage({ searchParams }: Props) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  const query = await searchParams;
  const key = query.visitor ?? '';
  const visitor = /^(?:[0-9a-f]{6}|[0-9a-f]{16}|b_[0-9a-f]{32})$/.test(key) ? key : null;
  const page = parsePage(query.page);

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
        한국 시간 기준 최신순입니다. 같은 브라우저에서 마지막 페이지를 연 뒤 30분이 지나 다시 열면 재방문으로 표시합니다.
        쿠키가 없는 기록과 이전 방식의 기록은 같은 날의 접속만 모아 볼 수 있습니다.
      </p>

      {visitor && (
        <p className="mt-6 text-sm">
          방문자 <span className="font-mono">{visitorLabel(visitor)}</span>의 방문과 질문을 보고 있습니다.{' '}
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
        <Block title={`${number(result.total)}건`} note={pageRange(page, result.total)}>
          <VisitTable visits={result.visits} />
          <Pager page={page} total={result.total} href={(p) => href({ page: p })} />
        </Block>
      ) : (
        <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>
      )}
    </div>
  );
}
