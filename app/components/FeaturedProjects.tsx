import Link from 'next/link';
import { featuredProjects, projects } from '../content/projects';
import { HERO_PROJECT_SLUG } from '../content/site';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import Section from './Section';

/** 히어로가 이미 크게 보여준 프로젝트는 빼서 같은 화면이 두 번 나오지 않게 한다. */
const gridProjects = featuredProjects.filter((project) => project.slug !== HERO_PROJECT_SLUG);

export default function FeaturedProjects() {
  return (
    <Section
      id="project"
      title="프로젝트"
      lead="각 프로젝트마다 어떤 화면을 어떻게 만들었는지 자세히 적어 뒀습니다."
      // 페이지에서 가장 넓게 여는 구역. 이 사이트가 보여주려는 것이 여기 있다.
      space="wide"
      action={
        <Link
          href="/projects"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          전체 {projects.length}개
        </Link>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {gridProjects.map((project) => (
          // 지연 없이 같이 올라온다. 좌우는 읽는 순서가 아니라서 어긋나게 하면
          // 없는 순서를 있는 것처럼 보이게 할 뿐이다.
          //
          // priority는 주지 않는다. 이 구역은 100svh짜리 히어로 아래라 처음엔
          // 반드시 화면 밖이고, 미리 받아 봐야 정작 LCP인 히어로 이미지와
          // 대역폭만 다툰다. 스크롤해서 만날 때 lazy로 받으면 된다.
          <Reveal key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
