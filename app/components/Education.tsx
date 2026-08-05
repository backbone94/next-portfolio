import Reveal from './Reveal';
import Section from './Section';

const education = {
  institution: '아주대학교 소프트웨어학과',
  duration: '2020.03 — 2025.02',
};

const certifications = [
  { title: 'SQLD', issueDate: '2025.12' },
  { title: 'AWS SAA', issueDate: '2025.09' },
  { title: 'OPIc IM2', issueDate: '2024.11' },
  { title: '정보처리기사', issueDate: '2021.11' },
];

export default function Education() {
  return (
    <Section id="education" title="학력 · 자격증">
      {/* 제목과 함께 도착한다. Skill과 같은 이유 — 정적으로 두면 순서가 뒤집힌다 */}
      {/*
        1.2fr은 자격증이 2열이던 시절 폭이었다. 한 열이 된 지금은 반씩 나눈다.

        items-start가 없으면 두 카드가 같은 높이로 늘어나, 내용이 짧은 학력
        카드 아래가 130px 넘게 빈다. 각자 내용만큼만 차지하게 둔다.
      */}
      <Reveal className="grid items-start gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-sm font-medium text-muted">학력</h3>
          <p className="mt-4 text-lg font-bold tracking-[-0.01em]">{education.institution}</p>
          <time className="mt-1 block text-sm text-muted">{education.duration}</time>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-sm font-medium text-muted">자격증</h3>
          {/*
            2열 그리드였다. 셀 안에서 제목과 날짜를 양끝으로 밀어 두니 한 쌍
            사이가 150px 넘게 벌어지는데 열 사이는 24px이라, 날짜가 제 짝이
            아니라 옆 열 제목에 붙어 읽혔다. 한 열로 세우고 가로선으로 행을
            묶는다 — 선이 짝을 대신 알려 주니 폭이 넓어도 흩어지지 않는다.
          */}
          <ul className="mt-4 divide-y divide-border">
            {certifications.map((certification) => (
              <li
                key={certification.title}
                className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="font-medium">{certification.title}</span>
                <time className="text-sm text-muted">{certification.issueDate}</time>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
