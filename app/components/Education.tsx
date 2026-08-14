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
    /*
      페이지에서 가장 조용한 구역이다. 여백을 가장 좁게 주고(quiet) 카드도
      쓰지 않는다. 여기까지 내려온 사람이 확인하려는 건 "있다/없다"뿐이라,
      상자를 세우는 대신 가로선 목록으로 눕힌다.

      폭은 max-w-3xl로 조인다. shell 폭(78rem)을 다 쓰면 제목과 날짜 사이가
      한 화면 가까이 벌어져 어느 날짜가 어느 항목 것인지 눈으로 잇기 어렵다.
      선이 짝을 묶어 주더라도 거리가 멀면 선을 따라가야 하는 일이 된다.
    */
    <Section id="education" title="학력 · 자격증" space="quiet">
      <div className="max-w-3xl space-y-8">
        <div>
          <h3 className="text-sm font-medium text-muted">학력</h3>
          <ul className="mt-3 border-t border-border">
            <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border py-3">
              <span className="font-medium">{education.institution}</span>
              <time className="text-sm text-muted">{education.duration}</time>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted">자격증</h3>
          <ul className="mt-3 border-t border-border">
            {certifications.map((certification) => (
              <li
                key={certification.title}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border py-3"
              >
                <span className="font-medium">{certification.title}</span>
                <time className="text-sm text-muted">{certification.issueDate}</time>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
