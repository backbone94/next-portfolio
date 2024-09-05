import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/app/components/About'));
const Skill = dynamic(() => import('@/app/components/Skill'));
const Project = dynamic(() => import('@/app/components/Project'));
const Contact = dynamic(() => import('@/app/components/Contact'));

export default function Home() {
  return (
    <main className="pt-16 md:pt-20">
      <About />
      <Skill />
      <Project />
      <Contact />
    </main>
  );
}
