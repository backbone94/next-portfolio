import Image from 'next/image';
import Link from 'next/link';
import { getProject } from '../content/projects';
import { HERO_PROJECT_SLUG, RESUME_URL } from '../content/site';

/** 제목·이미지·링크를 프로젝트 데이터 한 곳에서 가져온다. */
const heroProject = getProject(HERO_PROJECT_SLUG);
const heroImage = heroProject?.media.find((item) => item.type === 'image');

export default function Hero() {
  return (
    /*
      첫 화면은 히어로만 갖는다. 이게 없으면 945px 화면 기준으로 히어로가
      536px에서 끝나 아래 프로젝트 카드가 접힘 위에 걸리고, 스크롤로 만나야 할
      등장 효과가 로드 시점에 재생돼 버린다.

      4rem은 sticky 헤더(h-16)가 이미 가져간 높이다. 그냥 100svh를 주면
      헤더만큼 넘쳐서 히어로 아랫부분이 접힘 아래로 잘린다.

      min-h이라 내용이 길어지면 그만큼 늘어나고, 짧은 화면에서 잘리지 않는다.
      svh는 모바일 주소창이 접혔다 펴질 때 높이가 튀는 것을 막는다.
      가운데 정렬은 세로 축에만 준다 — 가로는 좌측 텍스트가 넓은 비대칭
      그리드 그대로다. pb-24는 아래 스크롤 안내가 앉을 자리다.
    */
    <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-shell flex-col justify-center px-5 pb-24 pt-14 md:px-8 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-14">
        <div className="animate-rise">

          <h1 className="mt-5 text-[clamp(2.75rem,7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em]">
            이정준
          </h1>

          <p className="mt-3 text-[1.0625rem] font-medium text-accent">AI Native Developer</p>

          <p className="mt-5 max-w-prose text-pretty text-[clamp(1.05rem,2.2vw,1.35rem)] font-book leading-[1.6] text-text/85">
            고객과 제품, 그리고 피드백
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition-opacity hover:opacity-85"
            >
              프로젝트 보기
            </Link>
            <a
              href={RESUME_URL}
              className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              이력서 PDF
            </a>
          </div>
        </div>

        {/* 작업물이 첫 화면에서 실물 크기로 존재해야 한다 */}
        {heroProject && heroImage && (
          <Link href={`/projects/${heroProject.slug}`} className="group block">
            <figure className="overflow-hidden rounded-xl border border-border bg-surface">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 640px"
                className="w-full transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <figcaption className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm">
                <span className="truncate font-medium">{heroProject.title}</span>
                <span className="shrink-0 text-muted transition-colors group-hover:text-accent">
                  자세히
                </span>
              </figcaption>
            </figure>
          </Link>
        )}
      </div>

      {/*
        첫 화면이 꽉 차면 여기서 끝인 줄 알 수 있다. 아래에 더 있다고 알린다.

        절대 위치라 가운데 정렬된 본문을 밀지 않는다. 대신 section의 pb-24가
        이 자리를 비워 두는 값이다 — 줄이면 본문과 겹친다.

        장식이 아니라 링크다. 호기심이 생긴 사람이 눌렀을 때 아무 일도
        일어나지 않으면 안 된다.
      */}
      <Link
        href="#project"
        aria-label="프로젝트 섹션으로 이동"
        className="group absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
      >
        <span className="text-xs font-medium tracking-[0.08em]">아래로</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="h-5 w-5 animate-scroll-cue"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>
    </section>
  );
}
