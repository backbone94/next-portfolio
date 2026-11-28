import Link from 'next/link';
import { PAGE_SIZE } from './stats';
import { number } from './ui';

export function parsePage(value: string | string[] | undefined) {
  const page = typeof value === 'string' ? Number(value) : 1;
  return Number.isSafeInteger(page) && page > 0 && page <= Math.floor(Number.MAX_SAFE_INTEGER / PAGE_SIZE) ? page : 1;
}

export function pageRange(page: number, total: number) {
  if (total === 0) return undefined;
  const first = (page - 1) * PAGE_SIZE + 1;
  if (first > total) return '이 쪽에는 기록이 없습니다.';
  return `${number(first)}–${number(Math.min(page * PAGE_SIZE, total))}번째`;
}

export function Pager({ page, total, href }: { page: number; total: number; href: (page: number) => string }) {
  const last = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page === 1 && last === 1) return null;

  const step = 'rounded-md bg-surface-2 px-3 py-1.5 font-medium transition-colors hover:text-accent';
  return (
    <nav aria-label="쪽 옮기기" className="mt-6 flex items-center gap-3 text-sm">
      {page > 1 ? (
        <Link href={href(Math.min(page - 1, last))} className={step}>
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
