import AskBox from '@/app/components/AskBox';
import { NONE, ROUTES } from '@/app/lib/ask/prepared';
import { routeWithKeywords } from '@/app/lib/ask/router';
import type { Metadata } from 'next';

type Props = { searchParams: { q?: string | string[] } };

// 기존 공유 주소와 여러 번 인코딩된 예전 프로젝트 목록 주소를 처리한다.
function decodeOnceMore(text: string) {
  if (!/%[0-9A-Fa-f]{2}/.test(text)) return text;
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

function resolve(searchParams: Props['searchParams']) {
  const raw = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const question = raw && decodeOnceMore(raw).trim().slice(0, 200);
  if (!question) return null;
  const { route } = routeWithKeywords(question);
  const answer = route !== NONE ? ROUTES[route]?.answer(question) : null;
  return { question, answer: answer ?? null };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const found = resolve(searchParams);
  if (!found?.answer) return { title: 'Jun에게 묻기', alternates: { canonical: '/ask' } };
  const description = found.answer.segments.map((s) => s.text).join('').replace(/\n+(- )?/g, ' ').slice(0, 150);
  return {
    description,
    title: found.answer.kind ?? 'Jun에게 묻기',
    alternates: { canonical: null },
    openGraph: { title: `${found.answer.kind ?? found.question} | 이정준`, description },
  };
}

export default function AskPage({ searchParams }: Props) {
  const found = resolve(searchParams);
  return (
    <AskBox
      // 질문이 바뀌면 대화를 새로 시작한다 (헤더 메뉴에서 다른 질문 주소로 들어온 경우)
      key={found?.question ?? ''}
      initial={found?.answer ? { question: found.question, answer: found.answer } : undefined}
      askOnLoad={found && !found.answer ? found.question : undefined}
    />
  );
}
