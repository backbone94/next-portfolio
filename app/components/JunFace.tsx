'use client';

import dynamic from 'next/dynamic';
import type { RefObject } from 'react';
import styles from './RobotGuide.module.css';

const RobotThree = dynamic(() => import('./RobotThree'), { ssr: false });

export default function JunFace({
  greetingCount = 0, inputRef,
}: { greetingCount?: number; inputRef?: RefObject<HTMLInputElement> }) {
  return (
    <>
      <RobotThree greetingCount={greetingCount} inputRef={inputRef} />
      <span aria-hidden className={styles.fallback} />
    </>
  );
}
