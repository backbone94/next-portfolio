'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import type { Project } from '../content/projects';

type Props = {
  projects: Project[];
  tags: string[];
};

const ALL = '전체';

export default function ProjectList({ projects, tags }: Props) {
  const [activeTag, setActiveTag] = useState(ALL);

  const visible = useMemo(
    () => (activeTag === ALL ? projects : projects.filter((p) => p.tags.includes(activeTag))),
    [projects, activeTag]
  );

  return (
    <div>
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

      <p className="mt-6 text-sm text-muted" data-numeric>
        {visible.length}개 / 전체 {projects.length}개
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {visible.map((project, index) => (
          <Reveal key={`${activeTag}-${project.slug}`} className="h-full">
            <ProjectCard project={project} priority={index < 2} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
