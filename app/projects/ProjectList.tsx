import Link from 'next/link';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../content/projects';

type Props = {
  visible: Project[];
  total: number;
  tags: string[];
  /** 지금 선택된 태그. 없으면 "전체" */
  activeTag?: string;
  /** 기술 스택에서 넘어온 경우에만 있다 */
  skill?: string;
};

const ALL = '전체';

/**
 * 서버 컴포넌트다. 칩을 버튼+useState로 두면 이 목록이 클라이언트 전용이 되고,
 * 그 순간 ProjectCard와 프로젝트 데이터 전체(상세 본문 포함)가 브라우저 번들로
 * 딸려간다. 칩을 링크로 두면 필터 상태에 주소가 생겨 공유·뒤로가기도 된다.
 */
export default function ProjectList({ visible, total, tags, activeTag, skill }: Props) {
  return (
    <div>
      {skill ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent">
            &quot;{skill}&quot; 관련 프로젝트
          </span>
          <Link
            href="/projects"
            className="text-sm font-medium text-muted underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            전체 보기
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {[ALL, ...tags].map((tag) => {
            const isAll = tag === ALL;
            const isActive = isAll ? !activeTag : tag === activeTag;
            return (
              <Link
                key={tag}
                href={isAll ? '/projects' : `/projects?tag=${encodeURIComponent(tag)}`}
                scroll={false}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-border text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-muted" data-numeric>
        {visible.length}개 / 전체 {total}개
      </p>

      {/*
        기술 스택 링크는 근거가 0개면 아예 링크를 걸지 않으므로 여기까지 오는 건
        주소를 직접 친 경우다. 그래도 빈 화면만 남겨 두지는 않는다.
      */}
      {visible.length === 0 ? (
        <p className="mt-5 rounded-xl border border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          조건에 맞는 프로젝트가 없습니다.{' '}
          <Link
            href="/projects"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-4"
          >
            전체 보기
          </Link>
        </p>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {visible.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index < 2} />
          ))}
        </div>
      )}
    </div>
  );
}
