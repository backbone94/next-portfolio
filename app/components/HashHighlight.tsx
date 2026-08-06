'use client';

import { useEffect } from 'react';
import { runHashHighlight } from '../lib/hashHighlight';

/**
 * "/#id" 링크로 들어왔을 때(또는 브라우저 뒤/앞으로가기로 해시가 바뀔 때)
 * 그 요소로 스크롤하고 도착 시점에 맞춰 잠깐 강조한다.
 *
 * 마운트 시 한 번만으로는 부족하다. Next.js가 뒤로가기에서 이 컴포넌트를
 * 다시 마운트하지 않고 캐시된 트리를 재사용하는 경우가 있어, hashchange와
 * popstate를 직접 구독해 해시가 바뀔 때마다 다시 실행한다. 같은 페이지 안의
 * 클릭은 HashHighlightLink가 이 이벤트에 기대지 않고 직접 호출한다 — 그래야
 * 브라우저가 해시 대입에 걸어 두는 네이티브 즉시 점프를 피할 수 있다.
 */
export default function HashHighlight() {
  useEffect(() => {
    const run = () => {
      const id = window.location.hash.slice(1);
      if (id) runHashHighlight(id);
    };

    run();
    window.addEventListener('hashchange', run);
    window.addEventListener('popstate', run);

    return () => {
      window.removeEventListener('hashchange', run);
      window.removeEventListener('popstate', run);
    };
  }, []);

  return null;
}
