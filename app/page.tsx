import Contact from '@/app/components/Contact';
import Education from '@/app/components/Education';
import Experience from '@/app/components/Experience';
import FeaturedProjects from '@/app/components/FeaturedProjects';
import Hero from '@/app/components/Hero';
import Skill from '@/app/components/Skill';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Experience />
      <Skill />
      <Education />
      <Contact />
    </>
  );
}
