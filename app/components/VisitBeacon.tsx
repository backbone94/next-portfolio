'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** 방문으로 기록하는 경로. middleware.ts의 matcher와 같다(관리자 화면 제외) */
const RECORDED = /^\/($|projects\/[^/]+$)/;

/**
 * 화면이 브라우저에서 실제로 실행됐다고 알린다. 관리자 화면이 봇을 가려내는 데 쓴다(app/lib/visit.ts의 confirmVisit).
 * HTML만 받아 가는 봇은 이 코드를 실행하지 않는다. 화면을 열자마자 닫거나 1초 안에 떠나는 요청도 세지 않는다.
 * 쿠키도, 따로 만든 식별 값도 보내지 않는다. 서버가 같은 방문자 값으로 방금 남긴 방문을 찾는다.
 */
export default function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!RECORDED.test(pathname)) return;
    const timer = setTimeout(() => {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, webdriver: navigator.webdriver === true }),
        keepalive: true,
      }).catch(() => {
        // 기록용이라 실패해도 방문자에게 알릴 일이 없다
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
