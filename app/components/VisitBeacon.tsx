'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { collectBehavior } from './collectBehavior';

/** 방문으로 기록하는 공개 경로 */
const RECORDED = /^\/(?:ask|projects\/[^/]+)?$/;

function send(body: object) {
  return fetch('/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // 탭을 닫는 중에도 요청이 끝까지 가게 한다
    keepalive: true,
  }).then((response) => response.ok, () => false);
}

/**
 * 화면이 브라우저에서 실제로 실행됐다고 알린다. 관리자 화면이 봇을 가려내는 데 쓴다(app/lib/visit.ts의 confirmVisit).
 * HTML만 받아 가는 봇은 이 코드를 실행하지 않는다. 화면을 열자마자 닫거나 1초 안에 떠나는 요청도 세지 않는다.
 * 서버가 방문을 확인했고 쿠키를 응답했다면 브라우저가 다음 요청부터 함께 보낸다.
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
    // 첫 페이지의 요청 기록은 proxy가 남긴다. 사이트 안에서 이동한 페이지는 이 신호로 기록한다.
    const navigated = previous.current != null && previous.current !== pathname;
    previous.current = pathname;
    if (!RECORDED.test(pathname)) return;
    const stopBehavior = collectBehavior(pathname);

    // 실행 표시를 보낸 뒤에만 머문 시간을 보낸다. 서버는 실행 표시가 된 방문에만 시간을 적는다
    let confirmation: Promise<boolean> | undefined;
    let total = 0;
    let since: number | null = document.visibilityState === 'visible' ? performance.now() : null;

    const report = () => {
      if (since != null) {
        total += performance.now() - since;
        since = document.visibilityState === 'visible' ? performance.now() : null;
      }
      if (confirmation && total >= 1000) {
        const seconds = total / 1000;
        void confirmation.then((ok) => {
          if (ok) void send({ path: pathname, seconds });
        });
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') since ??= performance.now();
      else report();
    };

    const timer = setTimeout(() => {
      confirmation = send({ path: pathname, webdriver: navigator.webdriver === true, navigated });
    }, 1000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', report);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', report);
      // 사이트 안에서 다른 화면으로 옮겼다. 이 화면에 머문 시간을 마저 보낸다
      report();
      stopBehavior?.();
    };
  }, [pathname]);

  return null;
}
