import Link from 'next/link';
import { projects } from '@/app/content/projects';
import type { Env, Kind, Visit } from './stats';

/**
 * 관리자 화면 두 곳(대시보드 app/admin/page.tsx, 방문 기록 app/admin/visits/page.tsx)이 같이 쓰는 표와 이름 풀이.
 */

export const number = (n: number) => n.toLocaleString('ko-KR');
const regions = new Intl.DisplayNames(['ko'], { type: 'region' });
const titles = new Map(projects.map((p) => [`/projects/${p.slug}`, p.title]));

/** 관리자 화면 주소. 기간과 환경은 화면을 옮겨 다녀도 그대로 이어 간다 */
export function adminHref(
  base: '/admin' | '/admin/visits',
  query: { env: Env; days: number; visitor?: string | null; kind?: Kind; page?: number },
) {
  const params = new URLSearchParams({ env: query.env, days: String(query.days) });
  if (query.visitor) params.set('visitor', query.visitor);
  if (query.kind && query.kind !== 'all') params.set('kind', query.kind);
  if (query.page && query.page > 1) params.set('page', String(query.page));
  return `${base}?${params}`;
}

export function countryName(code: string | null) {
  if (!code) return '(알 수 없음)';
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
}

/** 머문 시간 (45초, 3분 5초, 1시간 2분). 없으면 빈칸 */
export function durationText(seconds: number | null) {
  if (seconds == null) return '';
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return seconds % 60 ? `${minutes}분 ${seconds % 60}초` : `${minutes}분`;
  return minutes % 60 ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분` : `${Math.floor(minutes / 60)}시간`;
}

export function pageName(path: string | null) {
  if (path === '/') return '첫 화면';
  return (path && titles.get(path)) ?? path ?? '';
}

/**
 * 유입 경로 이름. null은 브라우저가 출처를 보내지 않은 방문이다. 주소를 직접 친 경우뿐 아니라
 * PDF·메신저 앱에서 연 링크, 북마크, 이름을 밝히지 않는 봇이 모두 여기에 섞인다.
 * ref:로 시작하면 주소에 직접 붙인 출처 표시(?ref=resume)다(app/lib/visit.ts)
 */
const REF: Record<string, string> = { resume: '이력서 PDF' };

export function sourceName(referrer: string | null) {
  if (!referrer) return '(출처 없음)';
  if (!referrer.startsWith('ref:')) return referrer;
  const ref = referrer.slice(4);
  return REF[ref] ? `${REF[ref]} (?ref=${ref})` : `?ref=${ref}`;
}

export const DEVICE: Record<string, string> = { mobile: '휴대폰', tablet: '태블릿', desktop: '컴퓨터' };

/**
 * 봇으로 의심할 이유. 하나라도 있으면 봇 의심이다. 이 정보를 남기기 전의 방문은 null을 낸다.
 * 화면 실행이 가장 확실한 신호다. HTML만 받아 가는 봇은 화면을 실행하지 않는다.
 * 브라우저를 통째로 조종하는 봇은 화면을 실행하므로, 자동화 표시·언어·헤더로 한 번 더 거른다.
 * 기간 전체를 세거나 고를 때 쓰는 SQL 조건(app/admin/stats.ts의 SUSPECT)과 같은 기준이다. 한쪽을 바꾸면 다른 쪽도 바꾼다.
 */
function botReasons(v: Visit): string[] | null {
  if (v.browser == null) return null;
  const reasons: string[] = [];
  if (v.webdriver) reasons.push('자동화 브라우저');
  if (!v.js && !v.fresh) reasons.push('화면 실행 안 됨');
  if (!v.lang) reasons.push('언어 정보 없음');
  if (v.fetchMeta === false) reasons.push('브라우저 헤더 없음');
  if (v.browser.startsWith('기타')) reasons.push('알 수 없는 브라우저');
  return reasons;
}

function Verdict({ visit }: { visit: Visit }) {
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

/** 방문 한 건씩. 방문자 값을 누르면 그 방문자의 방문만 모아 본다 */
export function VisitTable({ visits, env, days }: { visits: Visit[]; env: Env; days: number }) {
  if (visits.length === 0) return <Empty />;
  return (
    <Table head={['시각', '페이지', '머문 시간', '유입 경로', '위치', '기기', '언어', '판별', '방문자']} numeric={[2]}>
      {visits.map((v, i) => (
        <tr key={i} className="border-t align-top">
          <td className="whitespace-nowrap py-2 pr-4" data-numeric>
            <time>{v.at}</time>
          </td>
          <td className="py-2 pr-4">{pageName(v.path)}</td>
          <td className="whitespace-nowrap py-2 pr-4 text-right text-muted" data-numeric>
            {durationText(v.duration)}
          </td>
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
          <td className="whitespace-nowrap py-2 font-mono text-xs">
            <Link
              href={adminHref('/admin/visits', { env, days, visitor: v.visitor })}
              title="이 방문자의 방문만 보기"
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {v.visitor}
            </Link>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function Choices({ label, items }: { label: string; items: { key: string; text: string; href: string; on: boolean }[] }) {
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

export function Block({
  title,
  note,
  action,
  children,
}: {
  title: string;
  note?: string;
  /** 제목 오른쪽에 붙는 링크 (전체 보기 등) */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-xl font-black tracking-[-0.02em]">{title}</h2>
        {action}
      </div>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-4 overflow-x-auto">{children}</div>
    </section>
  );
}

export function Table({ head, numeric = [], children }: { head: string[]; numeric?: number[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted">
          {head.map((h, i) => (
            <th key={i} scope="col" className={`whitespace-nowrap pb-2 pr-4 font-medium ${numeric.includes(i) ? 'text-right' : 'text-left'}`}>
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
export function CountTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
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

export function Empty() {
  return <p className="text-sm text-muted">아직 기록이 없습니다.</p>;
}
