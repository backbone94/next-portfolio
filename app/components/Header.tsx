'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth',
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-evenly items-center px-4 md:px-10 h-16 md:h-20 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
    >
      <div className="flex items-center">
        <div className="home text-4xl">
          <Link href="/" className="opacity-50 transition-opacity hover:opacity-100">Jun&apos;s Portfolio</Link>
        </div>
      </div>

      <nav className="section hidden md:flex items-center space-x-4 font-cursive">
        <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">ABOUT</a>
        <a href="#experience" onClick={(e) => handleSmoothScroll(e, 'experience')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">EXPERIENCE</a>
        <a href="#education" onClick={(e) => handleSmoothScroll(e, 'education')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">EDUCATION</a>
        <a href="#skill" onClick={(e) => handleSmoothScroll(e, 'skill')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">SKILL</a>
        <a href="#project" onClick={(e) => handleSmoothScroll(e, 'project')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">PROJECT</a>
        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">CONTACT</a>
      </nav>

      <div className="md:hidden">
        <button className="text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
      </div>

      {isMenuOpen && (
        <nav className="section absolute top-16 left-0 right-0 bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">ABOUT</a>
          <a href="#experience" onClick={(e) => handleSmoothScroll(e, 'experience')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">EXPERIENCE</a>
          <a href="#education" onClick={(e) => handleSmoothScroll(e, 'education')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">EDUCATION</a>
          <a href="#skill" onClick={(e) => handleSmoothScroll(e, 'skill')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">SKILL</a>
          <a href="#project" onClick={(e) => handleSmoothScroll(e, 'project')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">PROJECT</a>
          <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">CONTACT</a>
        </nav>
      )}
    </header>
  );
}
