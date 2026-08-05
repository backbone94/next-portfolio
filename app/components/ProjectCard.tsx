import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '../content/projects';

/**
 * 릴리스 카드. 미디어가 먼저 크게 오고 설명이 뒤따른다 —
 * 이 사이트가 "문서"가 아니라 "만든 것"으로 읽혀야 하는 이유.
 * 채도는 스크린샷이 내고, 카드 크롬은 무채색으로 물러난다.
 */
export default function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const [type, ...techTags] = project.tags;
  const thumbnail = project.media.find((item) => item.type === 'image');
  const videoCount = project.media.filter((item) => item.type === 'video').length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-300 hover:border-accent/60"
    >
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        {thumbnail ? (
          <Image
            src={thumbnail.src}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : videoCount > 0 ? (
          /* 영상만 있는 프로젝트. 빈 상자로 보이지 않도록 의도된 패널로 만든다. */
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-2 px-8 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden>
                <path d="M4.5 2.8v9.4l8-4.7z" />
              </svg>
            </span>
            <span className="text-sm leading-relaxed text-muted">데모 영상이 있습니다</span>
          </div>
        ) : (
          /* 자료가 아직 없는 경우. 없는 영상을 있다고 말하지 않는다. */
          <div className="flex h-full w-full items-center justify-center bg-surface-2 px-8 text-center">
            <span className="text-sm leading-relaxed text-muted">화면 자료 준비 중</span>
          </div>
        )}

        {videoCount > 0 && thumbnail && (
          <span className="absolute bottom-3 right-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            영상 {videoCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-medium text-accent">{type}</span>
          <span className="text-border">·</span>
          <time className="text-muted">{project.duration}</time>
        </div>

        <h3 className="mt-2.5 text-lg font-bold leading-snug tracking-[-0.01em]">
          {project.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>

        <p className="mt-4 border-l-2 border-accent/50 pl-3 text-sm leading-relaxed">
          {project.highlight}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
