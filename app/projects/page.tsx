import type { Metadata } from 'next';
import { getFilterTags, getProjectsForSkill, projects } from '../content/projects';
import ProjectList from './ProjectList';

export const metadata: Metadata = {
  title: '프로젝트',
  description: '이정준이 진행한 실무·사이드 프로젝트 목록입니다.',
  alternates: { canonical: '/projects' },
};

type Props = {
  searchParams: { skill?: string; tag?: string };
};

/**
 * 필터를 서버에서 처리한다. 클라이언트 상태로 두면 목록 전체가 브라우저에서만
 * 그려져 크롤러에게는 빈 페이지가 되는데, 이 페이지는 상세 11개로 가는 허브라
 * 내부 링크가 사라지는 대가가 크다. searchParams를 읽는 만큼 정적 생성은
 * 포기하지만, 아무것도 안 담긴 정적 페이지보다는 낫다.
 */
export default function ProjectsPage({ searchParams }: Props) {
  const { skill, tag } = searchParams;

  // skill은 기술 스택에서 넘어온 경로라 stack 자유텍스트까지 훑고,
  // tag는 카드에 붙은 태그와 정확히 일치할 때만 걸린다.
  const visible = skill
    ? getProjectsForSkill(skill)
    : tag
      ? projects.filter((project) => project.tags.includes(tag))
      : projects;

  return (
    <div className="mx-auto max-w-shell px-5 pb-24 pt-14 md:px-8 md:pt-20">
      <header className="mb-10">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-black tracking-[-0.03em]">프로젝트</h1>
        <p className="mt-3 max-w-prose text-muted">
          지금까지 만든 {projects.length}개를 모두 모았습니다. 태그를 눌러 좁혀 볼 수 있습니다.
        </p>
      </header>

      <ProjectList
        visible={visible}
        total={projects.length}
        tags={getFilterTags()}
        activeTag={tag}
        skill={skill}
      />
    </div>
  );
}
