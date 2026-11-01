'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** 방문으로 기록하는 경로. middleware.ts의 matcher와 같다(관리자 화면 제외) */
const RECORDED = /^\/($|projects\/[^/]+$)/;

function send(body: object) {
  fetch('/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // 탭을 닫는 중에도 요청이 끝까지 가게 한다
    keepalive: true,
  }).catch(() => {
    // 기록용이라 실패해도 방문자에게 알릴 일이 없다
  });
}

/**
 * 화면이 브라우저에서 실제로 실행됐다고 알린다. 관리자 화면이 봇을 가려내는 데 쓴다(app/lib/visit.ts의 confirmVisit).
 * HTML만 받아 가는 봇은 이 코드를 실행하지 않는다. 화면을 열자마자 닫거나 1초 안에 떠나는 요청도 세지 않는다.
 * 쿠키도, 따로 만든 식별 값도 보내지 않는다. 서버가 같은 방문자 값으로 방금 남긴 방문을 찾는다.
 *
 * 머문 시간도 같이 잰다(recordDuration). 탭이 화면에 보이는 동안만 세고, 다른 탭으로 옮기거나 창을 내리면 멈춘다.
 * 화면을 떠나거나 탭이 가려질 때마다 지금까지의 합을 보낸다. 휴대폰은 앱을 내릴 때 탭을 닫았는지 알려 주지 않고
 * 가려졌다는 신호만 주기 때문에, 떠날 때 한 번만 보내면 놓치는 방문이 많다.
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

    // 실행 표시를 보낸 뒤에만 머문 시간을 보낸다. 서버는 실행 표시가 된 방문에만 시간을 적는다
    let confirmed = false;
    let total = 0;
    let since: number | null = document.visibilityState === 'visible' ? performance.now() : null;

    const report = () => {
      if (since != null) {
        total += performance.now() - since;
        since = document.visibilityState === 'visible' ? performance.now() : null;
      }
      if (confirmed && total >= 1000) send({ path: pathname, seconds: total / 1000 });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') since ??= performance.now();
      else report();
    };

    const timer = setTimeout(() => {
      send({ path: pathname, webdriver: navigator.webdriver === true, navigated });
      confirmed = true;
    }, 1000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', report);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', report);
      // 사이트 안에서 다른 화면으로 옮겼다. 이 화면에 머문 시간을 마저 보낸다
      report();
    };
  }, [pathname]);

  return null;
}
