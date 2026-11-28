import type { Metadata } from 'next';

export const metadata: Metadata = { title: '방문 데이터 안내 | Jun의 포트폴리오' };

export default function VisitPrivacyPage() {
  return (
    <article className="mx-auto max-w-prose px-5 pb-20 pt-14 md:px-8">
      <h1 className="text-3xl font-black">방문 데이터 안내</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>
          사이트 이용 흐름을 파악하기 위해 방문 시각, 열어 본 페이지, 유입 출처, 머문 시간, 네트워크,
          브라우저와 기기 정보를 기록합니다. 접속 지역은 IP 정보로 추정하며, 서울에서는 구를 추정할 수 있을 때 구 이름도 기록합니다.
          Jun에게 보낸 질문은 방문 기록과 연결될 수 있습니다.
        </p>
        <p>
          같은 브라우저가 다시 찾아왔는지 확인하는 데 이 사이트에서만 쓰는 90일짜리 무작위 쿠키를 사용합니다.
          로그에는 쿠키를 변환한 값이 남습니다. IP 주소와 브라우저 식별 문자열은 원문으로 저장하지 않습니다.
        </p>
        <p>
          브라우저에서 이 사이트의 쿠키를 삭제하면 이후 방문은 새 브라우저 값으로 시작합니다. 브라우저의
          Global Privacy Control 또는 Do Not Track 신호가 켜져 있으면 재방문 쿠키를 사용하지 않으며, 방문은
          그날에만 유효한 값으로 기록합니다.
        </p>
      </div>
    </article>
  );
}
