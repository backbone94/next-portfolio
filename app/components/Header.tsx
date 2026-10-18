'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 프로젝트 상세 같은 하위 페이지의 머리줄. 로고만 둔다.
 * 프로젝트·경력·연락처는 첫 화면의 대화가 맡고, 로고를 누르면 거기로 돌아간다.
 */
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
      </div>
    </header>
  );
}
