import Link from 'next/link';

/**
 * 기본 404는 사이트 밖에 있는 화면처럼 보인다 — 헤더도 푸터도 없고 영어 한 줄만
 * 남아 돌아갈 길이 없다. 주소를 잘못 쳤거나 예전 링크를 타고 온 사람이 여기서
 * 끊기지 않도록, 레이아웃 안에서 갈 곳을 준다.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-shell flex-col justify-center px-5 pb-24 pt-14 md:px-8">
      <p className="font-medium text-accent" data-numeric>
        404
      </p>

      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">
        페이지를 찾지 못했습니다
      </h1>

      <p className="mt-4 max-w-prose text-muted">
        주소가 바뀌었거나 없는 페이지입니다. 아래에서 이어서 보실 수 있습니다.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition-opacity hover:opacity-85"
        >
          프로젝트 보기
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
