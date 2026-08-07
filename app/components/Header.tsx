'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: '프로젝트', href: '/projects' },
  { label: '경력', href: '/#experience' },
  { label: '연락처', href: '/#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

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
          Jun&apos;s Portfolio
        </Link>

        <div className="flex items-center gap-1.5">
          <nav className="hidden items-center md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/projects' && pathname.startsWith('/projects');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // 색만으로는 어느 메뉴에 있는지 화면 낭독기가 알 수 없다
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-text ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="메뉴"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden
            >
              {isMenuOpen ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2.5 5h11M2.5 11h11" />}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-border bg-bg md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block border-b border-border px-5 py-4 font-medium text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
