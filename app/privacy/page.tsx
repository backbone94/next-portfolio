import type { Metadata } from 'next';
import ShareDistrict from './ShareDistrict';

export const metadata: Metadata = { title: '방문 데이터 안내 | Jun의 포트폴리오' };

export default function VisitPrivacyPage() {
  return (
    <article className="mx-auto max-w-prose px-5 pb-20 pt-14 md:px-8">
      <h1 className="text-3xl font-black">방문 데이터 안내</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>
          사이트 이용 현황을 파악하기 위해 방문 기록을 남깁니다. 방문 시각, 열어 본 페이지, 방문 경로, 머문 시간,
          대략적인 접속 지역과 네트워크, 브라우저와 기기 정보가 포함됩니다. Jun에게 보낸 질문은 방문 기록과 연결될 수 있습니다.
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
      <ShareDistrict />
    </article>
  );
}
