import type { ReactNode } from 'react';
import Reveal from './Reveal';

type Props = {
  id: string;
  title: string;
  /** 제목 옆 보조 설명 */
  lead?: string;
  /** 우측 상단 링크 등 */
  action?: ReactNode;
  children: ReactNode;
};

export default function Section({ id, title, lead, action, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-shell scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      {/*
        제목도 내용과 함께 도착한다. 제목만 먼저 놓여 있고 아래만 움직이면
        둘이 한 덩어리로 읽히지 않는다. 제목이 위에 있으니 순서는 저절로
        제목 → 내용이 된다.

        children도 Reveal로 감싸야 한다. 여기만 감싸고 내용을 정적으로 두면
        내용이 먼저 떠 있다가 제목이 뒤늦게 올라와 순서가 거꾸로 보인다.
      */}
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.25rem)] font-black tracking-[-0.02em]">
            {title}
          </h2>
          {lead && <p className="mt-2 max-w-prose text-muted">{lead}</p>}
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}
