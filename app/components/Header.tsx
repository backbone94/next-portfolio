'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RESUME_URL } from '../content/site';
import ThemeToggle from './ThemeToggle';

export default function Header() {
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
