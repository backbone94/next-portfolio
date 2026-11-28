import type { Metadata } from 'next';

export const metadata: Metadata = { title: '방문 데이터 안내 | Jun의 포트폴리오' };

export default function VisitPrivacyPage() {
  return (
    <article className="mx-auto max-w-prose px-5 pb-20 pt-14 md:px-8">
      <h1 className="text-3xl font-black">방문 데이터 안내</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>
          사이트 이용 현황을 파악하기 위해 방문 기록을 남깁니다. 방문 시각, 열어 본 페이지, 방문 경로, 머문 시간,
          네트워크, 브라우저와 기기 정보가 포함됩니다. 접속 지역은 IP 정보를 바탕으로 추정합니다. 서울에서는 자치구까지
          추정할 수 있으면 구 이름도 기록합니다. Jun에게 보낸 질문은 방문 기록과 연결될 수 있습니다.
        </p>
        <p>
          화면을 개선하기 위해 페이지를 연 순서, 클릭 위치, 스크롤 깊이, 일정 간격으로 확인한 마우스 위치를 기록합니다.
          페이지 안에서의 위치는 백분율로 저장합니다. 행동 기록에는 입력한 내용을 담지 않으며, 탭의 세션 저장소에 둔 임의의 값으로 페이지 이동을 연결합니다.
          Global Privacy Control 또는 Do Not Track 신호가 켜져 있으면 이러한 행동 기록을 수집하지 않습니다.
        </p>
        <p>
          같은 브라우저의 재방문을 확인하기 위해 이 사이트에서만 쓰는 무작위 쿠키를 90일 동안 사용합니다.
          방문 기록에는 쿠키를 변환한 값이 남습니다. IP 주소와 브라우저 식별 문자열은 원문으로 저장하지 않습니다.
        </p>
        <p>
          이 사이트의 쿠키를 삭제하면 다음 방문부터 새 브라우저 식별값으로 기록합니다. Global Privacy Control이나
          Do Not Track이 켜져 있으면 재방문 쿠키를 쓰지 않고, 방문 당일에만 유효한 값으로 기록합니다.
        </p>
      </div>
    </article>
  );
}
