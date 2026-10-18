import Contact from '@/app/components/Contact';
import Education from '@/app/components/Education';
import Experience from '@/app/components/Experience';
import FeaturedProjects from '@/app/components/FeaturedProjects';
import Hero from '@/app/components/Hero';
import JsonLd from '@/app/components/JsonLd';
import Skill from '@/app/components/Skill';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '포트폴리오',
  alternates: { canonical: '/portfolio' },
};

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <FeaturedProjects />
      <Experience />
      <Skill />
      <Education />
      <Contact />
    </>
  );
}
