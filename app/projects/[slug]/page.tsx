import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectMedia from '../../components/ProjectMedia';
import { getProject, projects } from '../../content/projects';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};

  const thumbnail = project.media.find((item) => item.type === 'image');

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: thumbnail ? [{ url: thumbnail.src, alt: project.title }] : undefined,
    },
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const [type, ...techTags] = project.tags;

  // 확인되지 않은 항목은 줄 자체를 내보내지 않는다. 라벨만 남고 값이 비면
  // 빠뜨린 것처럼 보이고, 채우려다 없는 숫자를 지어내게 된다.
  const meta = [
    { label: '기간', value: project.duration },
    { label: '역할', value: project.role },
    { label: '인원', value: project.teamSize },
    { label: '기여도', value: project.contribution },
  ].filter((item) => item.value);

  return (
    <article className="mx-auto max-w-shell px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> 프로젝트
      </Link>

      <header className="mt-7 max-w-4xl">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-medium text-accent">{type}</span>
          <span className="text-border">·</span>
          <time className="text-muted">{project.duration}</time>
        </div>

        <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.05] tracking-[-0.03em]">
          {project.title}
        </h1>

        <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        <p className="mt-5 max-w-prose border-l-2 border-accent pl-4 text-[1.0625rem] leading-relaxed">
          {project.highlight}
        </p>
      </header>

      {/* 화면이 먼저다 */}
      <div className="my-10 md:my-14">
        <ProjectMedia media={project.media} priority />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div className="order-2 min-w-0 lg:order-1">
          <h2 className="text-xl font-bold tracking-[-0.01em]">이렇게 만들었습니다</h2>
          <div
            className="mt-5 max-w-prose text-[0.9688rem] leading-[1.9] text-text/85 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h3]:mb-2.5 [&_h3]:mt-10 [&_h3]:border-l-2 [&_h3]:border-accent [&_h3]:pl-3 [&_h3]:text-[1.0625rem] [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-text [&_strong]:font-bold [&_strong]:text-text"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>

        <aside className="order-1 lg:order-2">
          <div className="rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
            <dl className="space-y-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-muted">{item.label}</dt>
                  <dd className="mt-1 text-sm font-medium">{item.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-muted">주요 기능</dt>
                <dd className="mt-1 text-sm leading-relaxed">{project.features}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">기술 스택</dt>
                <dd className="mt-1 text-sm leading-relaxed">{project.stack}</dd>
              </div>
              {(project.github || project.reference) && (
                <div>
                  <dt className="text-xs text-muted">{project.github ? 'GitHub' : 'Reference'}</dt>
                  <dd className="mt-1">
                    <a
                      href={project.github || project.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-accent underline underline-offset-4"
                    >
                      {project.github || project.reference}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
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
        </aside>
      </div>

      <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/60"
          >
            <span className="text-xs text-muted">이전</span>
            <span className="mt-1 block font-medium transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/60 sm:text-right"
          >
            <span className="text-xs text-muted">다음</span>
            <span className="mt-1 block font-medium transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
