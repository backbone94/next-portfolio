'use client';

import dynamic from 'next/dynamic';
import styles from './RobotGuide.module.css';

const RobotThree = dynamic(() => import('./RobotThree'), { ssr: false });

export default function JunFace({ greetingCount = 0 }: { greetingCount?: number }) {
  return (
    <>
      <RobotThree greetingCount={greetingCount} />
      <span aria-hidden className={styles.fallback} />
    </>
  );
}
