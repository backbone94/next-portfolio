import Image from 'next/image';
import Link from 'next/link';
import { getProjectsForSkill } from '../content/projects';
import HashHighlightLink from './HashHighlightLink';
import Reveal from './Reveal';
import Section from './Section';

type SkillItem = {
  label: string;
  src?: string;
  mono?: boolean;
  /** 근거가 /projects 필터로 안 잡히는 경우(경력에만 있는 스킬)에 쓰는 오버라이드 */
  href?: string;
};
type SkillCategory = { label: string; skills: SkillItem[] };

const categories: SkillCategory[] = [
  {
    label: '프론트엔드',
    skills: [
      { src: '/images/skill/typescript.ico', label: 'TypeScript' },
      { src: '/images/skill/react.ico', label: 'React' },
      { src: '/images/skill/vue.ico', label: 'Vue.js', href: '/#itcen-entech' },
      { src: '/images/skill/angular.ico', label: 'Angular' },
      { src: '/images/skill/nextjs.ico', label: 'Next.js' },
    ],
  },
  {
    label: '백엔드 · 데이터베이스',
    skills: [
      { src: '/images/skill/spring.ico', label: 'Spring Boot' },
      { src: '/images/skill/oracle.ico', label: 'Oracle', href: '/#itcen-entech' },
      { src: '/images/skill/nestjs.png', label: 'NestJS' },
      { src: '/images/skill/prisma.png', label: 'Prisma' },
    ],
  },
  /* 아래 둘은 프로젝트 스택과 경력에 이미 적혀 있던 것을 끌어올린 것이다. */
  {
    label: '인프라 · 운영',
    skills: [
      { src: '/images/skill/amazonaws.svg', label: 'AWS' },
      { src: '/images/skill/docker.svg', label: 'Docker' },
      { src: '/images/skill/nginx.svg', label: 'Nginx' },
      { src: '/images/skill/githubactions.svg', label: 'GitHub Actions' },
    ],
  },
  {
    label: 'AI',
    skills: [
      { src: '/images/skill/openai.svg', label: 'OpenAI', mono: true },
      { src: '/images/skill/perplexity.svg', label: 'Perplexity', mono: true },
    ],
  },
];

export default function Skill() {
  return (
    <Section
      id="skill"
      title="기술 스택"
      lead="프레임워크에 구애받지 않는 기술 스택을 쌓았습니다. 항목을 누르면 실제로 쓴 곳으로 이동합니다."
    >
      {/* 제목만 Reveal이고 여기가 정적이면 내용이 먼저 떠 있다가 제목이 나중에 온다 */}
      <Reveal className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.label} className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-muted">{category.label}</h3>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
              {category.skills.map((skill) => {
                // 근거가 있는 것만 누를 수 있게 한다 — 갔더니 결과가 0개인 링크는
                // 주장보다 못하다.
                const href = skill.href ?? (
                  getProjectsForSkill(skill.label).length > 0
                    ? `/projects?skill=${encodeURIComponent(skill.label)}`
                    : undefined
                );

                const icon = skill.src && (
                  <Image
                    src={skill.src}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized={skill.src.endsWith('.svg')}
                    data-mono-icon={skill.mono || undefined}
                    className="h-[22px] w-[22px]"
                  />
                );

                if (!href) {
                  return (
                    <li key={skill.label} className="flex items-center gap-2.5">
                      {icon}
                      <span className="font-medium">{skill.label}</span>
                    </li>
                  );
                }

                const linkClassName =
                  'group flex items-center gap-2.5 rounded-full transition-colors';
                const label = (
                  <span className="font-medium underline decoration-border decoration-1 underline-offset-4 transition-colors group-hover:text-accent group-hover:decoration-accent">
                    {skill.label}
                  </span>
                );

                return (
                  <li key={skill.label}>
                    {href.startsWith('/#') ? (
                      <HashHighlightLink href={href as `/#${string}`} className={linkClassName}>
                        {icon}
                        {label}
                      </HashHighlightLink>
                    ) : (
                      <Link href={href} className={linkClassName}>
                        {icon}
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
