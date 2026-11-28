import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pager, pageRange, parsePage } from '../pagination';
import { loadQuestions } from '../stats';
import { Block, QuestionTable, adminHref, number } from '../ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '질문 기록 | 관리자',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ page?: string | string[] }> };

export default async function QuestionsPage({ searchParams }: Props) {
  if (!process.env.ADMIN_PASSWORD) notFound();

  const page = parsePage((await searchParams).page);
  const result = await loadQuestions(page);

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8">
      <Link href={adminHref('/admin')} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
        ← 대시보드
      </Link>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">질문 기록</h1>
      <p className="mt-4 text-muted">한국 시간 기준 최신순입니다.</p>

      {result ? (
        <Block title={`전체 ${number(result.total)}건`} note={pageRange(page, result.total)}>
          <QuestionTable questions={result.questions} />
          <Pager page={page} total={result.total} href={(next) => adminHref('/admin/questions', { page: next })} />
        </Block>
      ) : (
        <p className="mt-12 text-muted">DATABASE_URL이 없어 기록을 읽을 수 없습니다.</p>
      )}
    </div>
  );
}
