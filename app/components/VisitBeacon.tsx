'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** 방문으로 기록하는 경로. middleware.ts의 matcher와 같다(관리자 화면 제외) */
const RECORDED = /^\/($|projects\/[^/]+$)/;

/**
 * 화면이 브라우저에서 실제로 실행됐다고 알린다. 관리자 화면이 봇을 가려내는 데 쓴다(app/lib/visit.ts의 confirmVisit).
 * HTML만 받아 가는 봇은 이 코드를 실행하지 않는다. 화면을 열자마자 닫거나 1초 안에 떠나는 요청도 세지 않는다.
 * 쿠키도, 따로 만든 식별 값도 보내지 않는다. 서버가 같은 방문자 값으로 방금 남긴 방문을 찾는다.
 */
export default function VisitBeacon() {
  const pathname = usePathname();
  // 바로 전에 본 경로. 레이아웃에 붙어 있어 사이트 안에서 옮겨 다녀도 그대로 남는다.
  // 개발 모드에서 효과가 두 번 실행돼도 같은 경로라 옮겨 온 것으로 세지 않는다
  const previous = useRef<string | null>(null);

  useEffect(() => {
    // 처음 연 화면은 middleware가 이미 방문을 남겼으니 그 줄에 실행 표시만 한다.
    // 링크를 눌러 옮겨 온 화면은 middleware가 세지 않으므로 서버가 방문을 새로 남긴다(app/lib/visit.ts)
    const navigated = previous.current != null && previous.current !== pathname;
    previous.current = pathname;
    if (!RECORDED.test(pathname)) return;
    const timer = setTimeout(() => {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, webdriver: navigator.webdriver === true, navigated }),
        keepalive: true,
      }).catch(() => {
        // 기록용이라 실패해도 방문자에게 알릴 일이 없다
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
