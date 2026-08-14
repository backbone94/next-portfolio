import type { ReactNode } from 'react';

/**
 * 세로 여백은 섹션마다 다르다. 전부 같은 py를 주면 스크롤 내내 같은 박자가
 * 반복되고, 그게 이 페이지가 템플릿으로 읽히던 이유였다. 프로젝트에서
 * 가장 넓게 열고 아래로 갈수록 조인 뒤, 마지막 앰버 색면에서 다시 연다.
 */
const SPACE = {
  wide: { section: 'py-24 md:py-32', head: 'mb-12' },
  base: { section: 'py-20 md:py-28', head: 'mb-10' },
  close: { section: 'py-16 md:py-24', head: 'mb-8' },
  quiet: { section: 'py-12 md:py-16', head: 'mb-6' },
} as const;

type Props = {
  id: string;
  title: string;
  /** 제목 옆 보조 설명 */
  lead?: string;
  /** 우측 상단 링크 등 */
  action?: ReactNode;
  /** 이 섹션이 페이지에서 갖는 무게. 여백으로만 표현한다. */
  space?: keyof typeof SPACE;
  children: ReactNode;
};

export default function Section({ id, title, lead, action, space = 'base', children }: Props) {
  const { section, head } = SPACE[space];

  return (
    <section id={id} className={`mx-auto max-w-shell scroll-mt-20 px-5 md:px-8 ${section}`}>
      {/*
        제목은 움직이지 않는다. 구조에 해당하는 것까지 스크롤마다 올라오면
        페이지가 끝내 안착하지 않고, 등장 효과가 "차례로 도착한다"는 뜻을
        잃는다. 움직이는 것은 실제로 순서가 있는 목록뿐이다 — 프로젝트
        카드와 경력. 나머지는 그냥 거기 있다.
      */}
      <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${head}`}>
        <div>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.25rem)] font-black tracking-[-0.02em]">
            {title}
          </h2>
          {lead && <p className="mt-2 max-w-prose text-muted">{lead}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
