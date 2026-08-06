'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getProjectsForSkill } from '../content/projects';
import type { Project } from '../content/projects';

type Props = {
  projects: Project[];
  tags: string[];
};

const ALL = '전체';

export default function ProjectList({ projects, tags }: Props) {
  const [activeTag, setActiveTag] = useState(ALL);
  const searchParams = useSearchParams();
  const router = useRouter();
  /** 기술 스택 아이콘에서 넘어온 경우. tags 칩과는 다른 매칭(stack 자유텍스트 포함)을 쓴다. */
  const skillParam = searchParams.get('skill');

  const visible = useMemo(() => {
    if (skillParam) return getProjectsForSkill(skillParam);
    return activeTag === ALL ? projects : projects.filter((p) => p.tags.includes(activeTag));
  }, [projects, activeTag, skillParam]);

  return (
    <div>
      {skillParam ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent">
            &quot;{skillParam}&quot; 관련 프로젝트
          </span>
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="text-sm font-medium text-muted underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            전체 보기
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {[ALL, ...tags].map((tag) => {
            const isActive = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                aria-pressed={isActive}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-border text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-muted" data-numeric>
        {visible.length}개 / 전체 {projects.length}개
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {visible.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}
