import Image from 'next/image';
import Reveal from './Reveal';
import Section from './Section';

/**
 * 아이콘은 있는 것만 붙인다. 인프라·AI는 마땅한 아이콘 파일이 없는데,
 * 그 때문에 항목을 빼면 "백엔드와 인프라까지"라는 소개가 스택에서 증명되지
 * 않는다. 글자만 있는 항목을 허용하는 편이 낫다.
 */
type SkillItem = { label: string; src?: string };
type SkillCategory = { label: string; skills: SkillItem[] };

const categories: SkillCategory[] = [
  {
    label: '프론트엔드',
    skills: [
      { src: '/images/skill/typescript.ico', label: 'TypeScript' },
      { src: '/images/skill/react.ico', label: 'React' },
      { src: '/images/skill/vue.ico', label: 'Vue.js' },
      { src: '/images/skill/angular.ico', label: 'Angular' },
      { src: '/images/skill/nextjs.ico', label: 'Next.js' },
    ],
  },
  {
    label: '백엔드 · 데이터베이스',
    skills: [
      { src: '/images/skill/java.ico', label: 'Java' },
      { src: '/images/skill/spring.ico', label: 'Spring Boot' },
      { src: '/images/skill/oracle.ico', label: 'Oracle' },
      { src: '/images/skill/nestjs.png', label: 'NestJS' },
      { src: '/images/skill/prisma.png', label: 'Prisma' },
    ],
  },
  /* 아래 둘은 프로젝트 스택과 경력에 이미 적혀 있던 것을 끌어올린 것이다. */
  {
    label: '인프라 · 운영',
    skills: [
      { label: 'AWS' },
      { label: 'Docker' },
      { label: 'nginx' },
      { label: 'GitHub Actions' },
    ],
  },
  {
    label: 'AI',
    skills: [{ label: 'OpenAI' }, { label: 'Perplexity' }, { label: 'Naver CLOVA' }],
  },
];

export default function Skill() {
  return (
    <Section
      id="skill"
      title="기술 스택"
      lead="프레임워크에 구애받지 않는 기술 스택을 쌓았습니다."
    >
      {/* 제목만 Reveal이고 여기가 정적이면 내용이 먼저 떠 있다가 제목이 나중에 온다 */}
      <Reveal className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.label} className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-muted">{category.label}</h3>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
              {category.skills.map((skill) => (
                <li key={skill.label} className="flex items-center gap-2.5">
                  {skill.src && (
                    <Image
                      src={skill.src}
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px]"
                    />
                  )}
                  <span className="font-medium">{skill.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
