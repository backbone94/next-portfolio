import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/app/components/About'));
const Skill = dynamic(() => import('@/app/components/Skill'));
const Project = dynamic(() => import('@/app/components/Project'));
const Contact = dynamic(() => import('@/app/components/Contact'));
const Experience = dynamic(() => import('@/app/components/Experience'));
const Education = dynamic(() => import('@/app/components/Education'));

export default function Home() {
  return (
    <main className="pt-16 md:pt-20">
      <About />
      <Experience />
      <Education />
      <Skill />
      <Project />
      <Contact />
    </main>
  );
}
