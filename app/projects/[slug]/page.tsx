import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectAsk from '../../components/ProjectAsk';
import ProjectFacts from '../../components/ProjectFacts';
import ProjectMedia from '../../components/ProjectMedia';
import { getProject, projects } from '../../content/projects';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * 프로젝트는 로컬 파일의 고정된 목록이라 여기 없는 슬러그는 존재할 수 없다.
 * 열어 두면 없는 주소마다 서버 렌더를 시도하다 notFound()에 걸리는데, 그때는
 * 404 화면이 스트리밍으로 넘어가 HTML에 아무것도 안 담긴다. 닫아 두면 정적
 * 404 라우트가 그대로 나가 서버가 완성한 화면을 준다.
 */
export const dynamicParams = false;

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

  const [type] = project.tags;

  // 확인되지 않은 항목은 아예 내보내지 않는다. 값이 비면 빠뜨린 것처럼 보이고,
  // 채우려다 없는 숫자를 지어내게 된다.
  const facts = [type, project.duration, project.role, project.teamSize].filter(Boolean);

  return (
    <article className="mx-auto max-w-shell px-5 pb-24 pt-8 md:px-8 md:pt-12">
      {/* 상세는 대화에서 새 탭으로 열린다. 목록으로 돌아가는 길은 탭을 닫는 것이라 따로 두지 않는다. */}
      <header>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-black leading-[1.2] tracking-[-0.03em]">{project.title}</h1>
        {/* 한 줄 소개는 "…프로젝트"로 끝나는 명사구라 본문 문장처럼 두면 아래 문장과 같은 말을 되풀이하는 것처럼 읽힌다. 제목에 붙은 부제로 둔다. */}
        <p className="mt-2 text-lg font-medium text-muted">{project.summary}</p>

        {/* 예전에는 오른쪽 정보 상자에 나눠 담았다. 한 줄로 모아 제목 아래에 둔다. */}
        <p className="mt-4 text-[0.9375rem] text-muted">
          {facts.map((fact, i) => (
            <span key={fact}>
              {i > 0 && (
                <span aria-hidden className="mx-2 text-border">
                  ·
                </span>
              )}
              {fact}
            </span>
          ))}
        </p>

        <p className="mt-6 max-w-prose font-semibold leading-[1.75]">{project.highlight}</p>
      </header>

      {/* 화면이 먼저다 */}
      <div className="my-10 md:my-12">
        <ProjectMedia media={project.media} priority />
      </div>

      {/* 훑어보는 사람이 먼저 찾는 사실. 화면 아래에 넓게 깔고, 대화창은 그 아래 본문 옆에서 시작한다. */}
      <div className="mb-12 md:mb-14">
        <ProjectFacts project={project} />
      </div>

      {/* 제목과 화면은 넓게 두고, 그 아래부터 본문과 옆 칸이 나란히 선다. 예전 정보 상자가 있던 자리다. */}
      {/*
        좁은 화면에서도 열을 grid-cols-1(minmax(0, 1fr))로 못박는다. 열을 정하지 않으면 열 폭이 내용의 최소 폭을 따르는데,
        대화창 입력칸은 글자 수만큼의 기본 폭이 있어서 휴대폰 글자 크기 설정을 키우면 화면보다 넓어진다.
        그러면 같은 열의 본문까지 밀려나고, 넘친 부분은 overflow-x: clip에 잘려 보이지 않는다.
      */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <div className="min-w-0">
          {/*
        본문은 대화 답변과 같은 글자 크기와 줄 간격을 쓴다. 대화에서 넘어와 읽을 때
        다른 사이트로 옮겨 온 느낌이 들지 않게 하려는 것이다.
      */}
          <section aria-labelledby="how">
            <h2 id="how" className="text-xl font-bold tracking-[-0.01em]">
              이렇게 만들었습니다
            </h2>
            <div
              className="mt-5 max-w-prose leading-[1.75] text-text/90 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h3]:mb-2 [&_h3]:mt-9 [&_h3]:text-[1.0625rem] [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-text [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-text"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </section>
        </div>

        {/*
        옆 칸은 정보 상자 대신 대화창이다. 이전·다음 프로젝트 이동도 없앴다. 다른 프로젝트가
        궁금하면 여기서 물어보면 된다. 넓은 화면에서는 본문을 따라 내려오고, 좁은 화면에서는 본문 뒤에 온다.
      */}
        <aside data-hides-scroll-top className="lg:sticky lg:top-24 lg:self-start">
          <ProjectAsk slug={project.slug} title={project.title} />
        </aside>
      </div>
    </article>
  );
}
