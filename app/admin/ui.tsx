import Link from 'next/link';
import { projects } from '@/app/content/projects';
import type { Question, Visit } from './stats';

/**
 * 관리자 화면 두 곳(대시보드 app/admin/page.tsx, 방문 기록 app/admin/visits/page.tsx)이 같이 쓰는 표와 이름 풀이.
 */

export const number = (n: number) => n.toLocaleString('ko-KR');
const regions = new Intl.DisplayNames(['ko'], { type: 'region' });
const titles = new Map(projects.map((p) => [`/projects/${p.slug}`, p.title]));

/** 관리자 화면 주소. 방문자와 쪽 번호만 붙인다 */
export function adminHref(base: '/admin' | '/admin/visits', query: { visitor?: string | null; page?: number } = {}) {
  const params = new URLSearchParams();
  if (query.visitor) params.set('visitor', query.visitor);
  if (query.page && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `${base}?${search}` : base;
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

/**
 * 네트워크 이름. AS 이름은 "KIXS-AS-KR Korea Telecom"처럼 대문자 별칭 뒤에 회사 이름이 붙으니 회사 이름만 보여 준다.
 * 별칭만 있으면(AMAZON-02) 그대로 둔다
 */
export function networkName(name: string | null) {
  if (!name) return '';
  return name.match(/^[A-Z0-9-]+\s+(.+)$/)?.[1] ?? name;
}

export const DEVICE: Record<string, string> = { mobile: '휴대폰', tablet: '태블릿', desktop: '컴퓨터' };

/** 방문 한 건씩. 방문자 값을 누르면 그 방문자의 방문만 모아 본다 */
export function VisitTable({ visits }: { visits: Visit[] }) {
  if (visits.length === 0) return <Empty />;
  return (
    <Table head={['시각', '페이지', '머문 시간', '유입 경로', '위치·네트워크', '기기', '언어', '방문자']} numeric={[2]}>
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
          <td className="py-2 pr-4 text-muted">
            {v.city ? `${v.city} · ${countryName(v.country)}` : countryName(v.country)}
            {v.network && (
              <span className="block text-xs" title={`AS${v.asn} ${v.network}`}>
                {networkName(v.network)}
              </span>
            )}
          </td>
          <td className="whitespace-nowrap py-2 pr-4 text-muted">
            {DEVICE[v.device ?? ''] ?? v.device}
            {v.browser && <span className="block text-xs">{v.browser}</span>}
          </td>
          <td className="whitespace-nowrap py-2 pr-4 text-muted">{v.lang ?? (v.browser ? '없음' : '')}</td>
          <td className="whitespace-nowrap py-2 font-mono text-xs">
            <VisitorLink visitor={v.visitor} />
          </td>
        </tr>
      ))}
    </Table>
  );
}

/** 방문자 값. 누르면 방문 기록 화면에서 그 방문자의 방문과 질문을 모아 본다 */
function VisitorLink({ visitor }: { visitor: string }) {
  return (
    <Link
      href={adminHref('/admin/visits', { visitor })}
      title="이 방문자의 방문과 질문 보기"
      className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
    >
      {visitor}
    </Link>
  );
}

const ANSWERED_BY: Record<string, string> = { prepared: '미리 쓴 답', claude: 'Claude', notice: '안내' };

/** 질문 한 건씩. 방문자 값이 있으면 눌러서 그 방문자가 어떤 페이지를 보고 물었는지 따라간다 */
export function QuestionTable({ questions, showVisitor = true }: { questions: Question[]; showVisitor?: boolean }) {
  if (questions.length === 0) return <Empty />;
  const head = ['시각', '질문', '어디서', '답'];
  return (
    <Table head={showVisitor ? [...head, '방문자'] : head}>
      {questions.map((q, i) => (
        <tr key={i} className="border-t align-top">
          <td className="whitespace-nowrap py-2 pr-4" data-numeric>
            <time>{q.at}</time>
          </td>
          <td className="py-2 pr-4">{q.question}</td>
          <td className="py-2 pr-4 text-muted">{q.page ? pageName(`/projects/${q.page}`) : '첫 화면'}</td>
          <td className="whitespace-nowrap py-2 pr-4 text-muted">{ANSWERED_BY[q.answeredBy] ?? q.answeredBy}</td>
          {showVisitor && (
            <td className="whitespace-nowrap py-2 font-mono text-xs">
              {q.visitor ? <VisitorLink visitor={q.visitor} /> : <span className="text-muted">없음</span>}
            </td>
          )}
        </tr>
      ))}
    </Table>
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

export function Empty() {
  return <p className="text-sm text-muted">아직 기록이 없습니다.</p>;
}
