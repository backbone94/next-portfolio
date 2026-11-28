'use client';

import { useState } from 'react';
import { locateSeoulDistrict, type DistrictBoundaries, type SeoulDistrict } from '../lib/seoul-location';

function currentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12_000 }),
  );
}

export default function ShareDistrict() {
  const [district, setDistrict] = useState<SeoulDistrict | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const button = 'rounded-md bg-surface-2 px-3 py-2 text-sm font-medium hover:text-accent disabled:opacity-60';

  async function findDistrict() {
    if (!navigator.geolocation) {
      setMessage('이 브라우저에서 현재 위치를 확인할 수 없습니다.');
      return;
    }

    setPending(true);
    setMessage('현재 지역을 확인하고 있습니다.');
    try {
      const { coords } = await currentPosition();
      const response = await fetch('/geo/seoul-districts.json');
      if (!response.ok) throw new Error('boundary data unavailable');
      const boundaries: DistrictBoundaries = await response.json();
      const found = locateSeoulDistrict(boundaries, coords);
      setDistrict(found);
      setMessage(found ? `서울 ${found}입니다. 이 지역을 공유할 수 있습니다.` : '현재 위치가 어느 서울 자치구인지 확인할 수 없습니다.');
    } catch (error) {
      const denied = error && typeof error === 'object' && 'code' in error && error.code === 1;
      setMessage(denied ? '브라우저에서 위치 권한이 허용되지 않았습니다.' : '현재 지역을 확인할 수 없습니다.');
    } finally {
      setPending(false);
    }
  }

  async function shareDistrict() {
    if (!district) return;

    setPending(true);
    setMessage('지역을 공유하고 있습니다.');
    try {
      const response = await fetch('/api/visit/district', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district }),
      });
      if (response.status === 404) {
        setMessage('이번 방문 기록을 찾지 못해 지역을 공유할 수 없습니다.');
      } else if (response.ok) {
        setMessage(`서울 ${district}를 공유했습니다.`);
      } else {
        throw new Error('district could not be saved');
      }
      setDistrict(null);
    } catch {
      setMessage('지역을 공유하지 못했습니다. 잠시 뒤 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="share-district" className="mt-9 border-t border-border pt-7">
      <h2 className="text-xl font-bold">방문 지역 공유</h2>
      <p className="mt-2 leading-relaxed text-muted">
        서울에 있다면 현재 위치의 자치구를 확인해 공유할 수 있습니다. 좌표는 브라우저에서만 사용합니다.
        공유를 선택하면 구 이름만 이번 방문 기록에 추가됩니다.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {district ? (
          <>
            <button type="button" className={button} disabled={pending} onClick={() => void shareDistrict()}>
              서울 {district} 공유
            </button>
            <button
              type="button"
              className="px-2 py-2 text-sm text-muted hover:text-accent"
              disabled={pending}
              onClick={() => { setDistrict(null); setMessage(''); }}
            >
              취소
            </button>
          </>
        ) : (
          <button type="button" className={button} disabled={pending} onClick={() => void findDistrict()}>
            현재 자치구 확인
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted" role="status">{message}</p>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        서울 자치구 경계는 <a className="underline" href="https://sgis.mods.go.kr/view/pss/openDataIntrcn">국가데이터처 SGIS</a>의
        행정동 경계(공공누리 제1유형)를 바탕으로 한 <a className="underline" href="https://github.com/vuski/admdongkor">vuski/admdongkor</a> 자료를
        자치구 단위로 합쳐 사용합니다. <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
      </p>
    </section>
  );
}
