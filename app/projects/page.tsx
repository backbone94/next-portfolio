import type { Metadata } from 'next';
import { getFilterTags, projects } from '../content/projects';
import ProjectList from './ProjectList';

export const metadata: Metadata = {
  title: '프로젝트',
  description: '이정준이 진행한 실무·사이드 프로젝트 목록입니다.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8 md:pt-20">
      <header className="mb-10">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-black tracking-[-0.03em]">프로젝트</h1>
        <p className="mt-3 max-w-prose text-muted">
          지금까지 만든 {projects.length}개를 모두 모았습니다. 태그를 눌러 좁혀 볼 수 있습니다.
        </p>
      </header>

      <ProjectList projects={projects} tags={getFilterTags()} />
    </div>
  );
}
