'use client';

import { usePathname } from 'next/navigation';
import { ASK_PATH } from '../content/site';
import type { ReactNode } from 'react';

export default function HideOnAskHome({ children }: { children: ReactNode }) {
  return usePathname() === ASK_PATH ? null : <>{children}</>;
}
