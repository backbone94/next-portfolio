import Image from 'next/image';
import Reveal from './Reveal';
import Section from './Section';

const categories = [
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
