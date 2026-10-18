import type { Project } from '../content/projects';

/**
 * 상세 페이지 본문 위의 요약 카드. 기여도, 주요 기능, 기술 스택, 참고 링크를 한곳에 모은다.
 *
 * 이 페이지를 여는 사람은 대개 본문을 읽기 전에 "무엇을 썼고 얼마나 맡았는지"부터 훑는다.
 * 그래서 본문 뒤가 아니라 앞에 둔다. 항목은 프로젝트 파일에 쉼표로 적힌 글을 나눠 그린다.
 */

const list = (text: string) =>
  text
    .split(/,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

/** "40% (소셜 로그인, …)"를 숫자와 맡은 일로 나눈다. 모양이 다르면 글 그대로 보여 준다. */
function parseContribution(text: string) {
  const match = text.match(/^(\d{1,3})%\s*(?:\((.*)\))?$/);
  if (!match) return null;
  return { percent: Number(match[1]), parts: match[2] ? list(match[2]) : [] };
}

const label = 'text-[0.8125rem] font-medium text-muted';
const filled = 'rounded bg-surface-2 px-2.5 py-1 text-[0.8125rem] leading-snug text-text/90';

export default function ProjectFacts({ project }: { project: Project }) {
  const contribution = project.contribution ? parseContribution(project.contribution) : null;
  const features = list(project.features);
  const stack = list(project.stack);
  const link = project.github || project.reference;

  return (
    // 넓은 화면에서는 두 줄이다. 윗줄은 기여도가 한 줄을 다 쓰고, 아랫줄에 주요 기능·기술 스택·참고가 나란히 선다.
    // 좁은 화면에서는 모두 위아래로 쌓는다.
    <div className="rounded-xl border border-border bg-surface">
      {project.contribution && (
        <dl className="p-5 sm:p-6">
          <div>
            <dt className={label}>기여도</dt>
            <dd className="mt-2">
              {contribution ? (
                // 막대는 한 줄 끝까지 늘여 프로젝트마다 비율 차이가 또렷하게 보이게 한다. 긴 선이 가늘어 보이지 않게 조금 두껍게 둔다.
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-[1.75rem] font-black leading-none tracking-[-0.02em]">{contribution.percent}%</span>
                    {/* 숫자를 막대로도 보여 준다. 글자는 옆에 있으니 화면 낭독기에는 감춘다. */}
                    <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${contribution.percent}%` }} />
                    </span>
                  </div>
                  {contribution.parts.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="맡은 일">
                      {contribution.parts.map((part) => (
                        <li key={part} className={filled}>
                          {part}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <span className="leading-[1.75]">{project.contribution}</span>
              )}
            </dd>
          </div>
        </dl>
      )}

      {/* 참고는 링크 버튼 하나라 버튼 폭만 쓰고(긴 주소는 16rem에서 줄임표로 자른다), 남은 폭은 주요 기능과 기술 스택이 반씩 나눈다 */}
      <dl
        // grid-cols-1: 좁은 화면에서 열 폭이 가장 긴 태그나 참고 주소를 따라 화면 밖으로 늘어나지 않게 한다
        className={`grid grid-cols-1 divide-y divide-border lg:divide-y-0 ${
          link ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_fit-content(16rem)]' : 'lg:grid-cols-2'
        } ${project.contribution ? 'border-t border-border' : ''}`}
      >
        <div className="p-5 sm:p-6">
          <dt className={label}>주요 기능</dt>
          <dd className="mt-3">
            {/* 맡은 일·기술 스택과 같은 옅은 바탕 태그다. 테두리를 두르면 상자가 겹쳐 표처럼 보인다. */}
            <ul className="flex flex-wrap gap-1.5">
              {features.map((feature) => (
                <li key={feature} className={filled}>
                  {feature}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <div className="p-5 sm:p-6">
          <dt className={label}>기술 스택</dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <li key={tech} className={`${filled} font-medium`}>
                  {tech}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        {link && (
          <div className="p-5 sm:p-6">
            <dt className={label}>{project.github ? 'GitHub' : '참고'}</dt>
            <dd className="mt-3 min-w-0">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                <span aria-hidden>↗</span>
                <span className="sr-only">(새 창)</span>
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
