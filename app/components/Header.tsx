'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ASK_PATH, RESUME_URL } from '../content/site';
import JunFace from './JunFace';
import robotStyles from './RobotGuide.module.css';
import ThemeToggle from './ThemeToggle';

const junLink = `relative inline-flex h-11 w-14 justify-center rounded-lg transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 sm:w-16 ${robotStyles.artwork}`;

export default function Header() {
  const isProjectDetail = /^\/projects\/[^/]+\/?$/.test(usePathname());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'border-b border-border bg-bg/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 md:px-8">
        <Link href="/" className="text-[0.95rem] font-bold tracking-tight">
          leejj.dev
        </Link>
        <nav aria-label="포트폴리오 메뉴" className="flex shrink-0 items-center gap-3 text-xs font-semibold sm:gap-6 sm:text-sm">
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:text-accent">이력서</a>
          {/* 커서를 따라 고개를 돌리는 Jun의 머리. 상세 화면에서는 그 프로젝트 대화창으로, 나머지에서는 전체 대화로 간다. */}
          {isProjectDetail ? (
            <a href="#project-ask" aria-label="Jun에게 이 프로젝트 묻기" title="Jun에게 이 프로젝트 묻기" className={junLink}>
              <JunFace />
            </a>
          ) : (
            <Link href={ASK_PATH} aria-label="Jun에게 묻기" title="Jun에게 묻기" className={junLink}>
              <JunFace />
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
