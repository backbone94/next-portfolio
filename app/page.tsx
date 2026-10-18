import AskBox from '@/app/components/AskBox';
import JsonLd from '@/app/components/JsonLd';
import { NONE, ROUTES } from '@/app/lib/ask/prepared';
import { routeWithKeywords } from '@/app/lib/ask/router';
import type { Metadata } from 'next';

/**
 * 첫 화면. 인사말과 검색창 하나만 둔다.
 *
 * 방문자가 사이트를 읽기 전에 먼저 말을 걸게 하는 것이 이 화면의 목적이다.
 * 포트폴리오 내용은 대화 안에서 보여 준다.
 *
 * /?q=질문 으로 들어오면 그 질문의 답이 펼쳐진 채로 열린다. 직접 쓴 답이
 * 있으면 서버에서 미리 그려서 보낸다 — 공유받은 사람은 기다리지 않고,
 * 검색엔진과 링크 미리보기도 답 내용을 읽는다. 여기서는 키워드 규칙만 쓴다.
 * 주소를 여는 것만으로 Jev나 Claude를 부르면 크롤러가 돌 때마다 돈이 든다.
 */

type Props = { searchParams: { q?: string | string[] } };

function resolve(searchParams: Props['searchParams']) {
  const raw = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const question = raw?.trim().slice(0, 200);
  if (!question) return null;
  const { route } = routeWithKeywords(question);
  const answer = route !== NONE ? ROUTES[route]?.answer(question) : null;
  return { question, answer: answer ?? null };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const found = resolve(searchParams);
  // 직접 쓴 답이 있는 질문만 따로 색인한다. 나머지는 첫 화면과 같은 페이지로 본다.
  if (!found?.answer) return { alternates: { canonical: '/' } };
  const description = found.answer.segments.map((s) => s.text).join('').replace(/\n+(- )?/g, ' ').slice(0, 150);
  return {
    description,
    /*
      canonical을 "/?q=…"로 두고 싶지만 Next 14는 경로가 "/"인 canonical에서 쿼리를
      떼어 버린다(next/dist/lib/metadata/resolvers/resolve-url.js). 그러면 레이아웃의
      canonical "/"과 같아져 이 주소가 첫 화면의 중복으로 처리된다. canonical을
      비워서 검색엔진이 이 주소를 그대로 쓰게 둔다.
    */
    alternates: { canonical: null },
    openGraph: { title: `${found.answer.kind ?? found.question} | 이정준`, description },
  };
}

export default function AskHome({ searchParams }: Props) {
  const found = resolve(searchParams);
  return (
    <>
      <JsonLd />
      <AskBox
        // 질문이 바뀌면 대화를 새로 시작한다 (헤더 메뉴에서 다른 질문 주소로 들어온 경우)
        key={found?.question ?? ''}
        initial={found?.answer ? { question: found.question, answer: found.answer } : undefined}
        askOnLoad={found && !found.answer ? found.question : undefined}
      />
    </>
  );
}
