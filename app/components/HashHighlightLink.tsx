'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { runHashHighlight } from '../lib/hashHighlight';

/**
 * "/#id" 형태의 같은 페이지 앵커 전용 링크.
 *
 * 이미 그 페이지에 있을 때 location.hash를 직접 대입하면 브라우저가 자체
 * 스크롤을 즉시(점프) 걸어 버려서 우리가 원하는 smooth 스크롤이 할 일이
 * 없어진다. 대신 history.pushState로 주소만 바꾸고(네이티브 스크롤도,
 * hashchange도 안 뜬다) runHashHighlight를 직접 호출해 스크롤·강조를
 * 전부 우리가 통제한다. 다른 경로에서 들어올 때는 Link의 기본 이동에
 * 맡기고, 새로 마운트되는 HashHighlight가 처리한다.
 */
export default function HashHighlightLink({
  href,
  className,
  children,
}: {
  href: `/#${string}`;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const id = href.slice(2);

  const handleClick = (event: React.MouseEvent) => {
    if (pathname !== '/') return; // 다른 경로면 실제 이동이 필요하니 기본 동작 유지

    event.preventDefault();
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', href);
    }
    runHashHighlight(id);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
