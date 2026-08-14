import { CONTACT, RESUME_URL } from '../content/site';

const channels = [
  { label: '이메일', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'GitHub', value: 'backbone94', href: CONTACT.github, external: true },
  { label: '블로그', value: 'Notion', href: CONTACT.blog, external: true },
];

/**
 * 이 사이트에서 색이 화면 전체를 덮는 유일한 구역.
 * 악센트를 여기저기 흩뿌리는 대신 행동이 필요한 한 곳에 몰아 준다.
 */
export default function Contact() {
  return (
    /* pt는 위 섹션과 거리를 벌리려고 준다. 마지막 구역이니 앞과 붙어 있지 않는 편이 낫다 */
    <section id="contact" className="scroll-mt-32 px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-shell rounded-2xl bg-accent px-6 py-14 text-accent-ink md:px-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.9rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">
              Contact
            </h2>
            {/*
              opacity-80이었다. 불투명도로 흐리게 만들면 최종 색이 계산에
              잡히지 않는데, 라이트 모드에서 아래 라벨(opacity-70)이 앰버
              위에서 3.95 : 1까지 떨어져 AA를 못 넘기고 있었다. 섞인 결과를
              토큰으로 못박아 두 모드 모두 실측값을 갖게 한다.
            */}
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-accent-ink-body">
              제품을 직접 만들고 빠른 속도의 팀에 관심이 많습니다. 이력서는 아래에서 바로 받으실
              수 있습니다.
            </p>

            {/*
              "이력서 PDF 내려받기"였다. 320px에서 이 버튼이 쓸 수 있는 폭이
              232px 남짓이라 라벨이 두 줄로 접혔다. 누를 수 있는 글자는 한 줄
              짜리 물건이다 — 줄이 바뀌면 눌러도 되는 것인지부터 흐려진다.
              라벨을 줄이고 nowrap으로 못박는다.
            */}
            <a
              href={RESUME_URL}
              className="mt-8 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-accent-ink px-6 py-3.5 font-medium text-accent transition-opacity hover:opacity-85"
            >
              이력서 PDF
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7.5 2v8m0 0L4.3 6.8M7.5 10l3.2-3.2M2.5 12.5h10" />
              </svg>
            </a>
          </div>

          {/* self-start가 없으면 dl이 부모 그리드에서 늘어나 아래에 빈 띠가 생긴다 */}
          <dl className="grid gap-px self-start overflow-hidden rounded-xl bg-accent-ink/15">
            {channels.map((channel) => (
              <div key={channel.label} className="bg-accent">
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex items-baseline justify-between gap-4 px-5 py-4 transition-opacity hover:opacity-70"
                >
                  <dt className="text-sm text-accent-ink-soft">{channel.label}</dt>
                  <dd className="font-medium">{channel.value}</dd>
                </a>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
