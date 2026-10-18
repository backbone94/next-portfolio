'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * 첫 화면(/)은 검색창 하나만 있는 화면이다. 헤더·푸터·맨 위로 가기가 같이
 * 뜨면 "검색창 하나"라는 인상이 깨진다. 레이아웃에 남겨 두고 이 경로에서만 숨긴다.
 */
export default function HideOnAskHome({ children }: { children: ReactNode }) {
  return usePathname() === '/' ? null : <>{children}</>;
}
