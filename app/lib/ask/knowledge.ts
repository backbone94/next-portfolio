import { certifications, education, experiences } from '@/app/content/career';
import { projects, summaryPhrase } from '@/app/content/projects';
import { ASK, CONTACT, PROFILE, RESUME_URL, askHref } from '@/app/content/site';

/**
 * Claude에 건네는 근거 문서. 사이트에 이미 있는 데이터에서만 만든다.
 * 따로 손으로 적은 소개문을 두면 사이트와 답변이 어긋나기 시작하고,
 * 그러면 "지어내지 않는다"는 원칙을 이 기능이 먼저 깨게 된다.
 *
 * 블록 하나가 인용 한 단위다. 출처를 눌렀을 때 어디로 갈지 정할 수 있도록
 * 문서마다 href를 같이 들고 다닌다.
 */
export type KnowledgeDoc = {
  title: string;
  href: string;
  blocks: string[];
};

/** 상세 서술은 HTML 문자열이다. 소제목은 살리고 태그는 걷어 낸다. */
function htmlToSections(html: string) {
  const text = html
    .replace(/<h3>(.*?)<\/h3>/g, '\n\n## $1\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ');

  return text
    .split(/\n(?=## )/)
    .map((section) => section.replace(/\n\s*\n+/g, '\n').trim())
    .filter(Boolean);
}

const profileDoc: KnowledgeDoc = {
  title: '소개와 연락처',
  href: askHref(ASK.contact),
  blocks: [
    `이름: ${PROFILE.name} (${PROFILE.nameEn}). 직함: ${PROFILE.jobTitle}. 현재 소속: ${PROFILE.affiliation}.`,
    `학력: ${education.institution} (${education.duration}).`,
    `자격증: ${certifications.map((c) => `${c.title}(${c.issueDate})`).join(', ')}.`,
    `연락처: 이메일 ${CONTACT.email}, GitHub ${CONTACT.github}. 이력서 PDF는 사이트의 ${RESUME_URL}에서 받을 수 있다. 전화번호는 사이트에 공개하지 않으며 이력서 PDF에 있다.`,
  ],
};

const experienceDocs: KnowledgeDoc[] = experiences.map((job) => ({
  title: `${job.company} 경력`,
  href: askHref(ASK.career),
  blocks: [
    `${job.company}, ${job.duration}${job.role ? `, ${job.role}` : ''}${job.current ? ' (현재 재직 중)' : ''}.`,
    ...job.projects.flatMap((project) => [
      `프로젝트: ${project.name}${project.stack ? ` (기술: ${project.stack.join(', ')})` : ''}.`,
      ...project.tasks.map((task) => `${project.name}에서 한 일: ${task}`),
    ]),
  ],
}));

const projectDocs: KnowledgeDoc[] = projects.map((project) => ({
  title: `${project.title} 프로젝트`,
  href: `/projects/${project.slug}`,
  blocks: [
    // 항목 이름:값 형식으로 두면 Claude가 그 형식째 인용해 답 문장이 깨진다. 문장으로 적는다.
    // 제목이 영어로 끝나기도 해서 제목 바로 뒤에 조사를 붙이지 않는다
    `${project.title} 프로젝트는 ${summaryPhrase(project)}입니다. ${project.highlight}`,
    `${project.tags[0]} 프로젝트로 ${project.duration}에 진행했습니다. 팀 인원은 ${project.teamSize}입니다. 정준 님이 맡은 역할은 ${project.role}이고, 기여도는 ${project.contribution}입니다.`,
    `주요 기능은 ${project.features}입니다. 사용한 기술은 ${project.stack}입니다.`,
    ...htmlToSections(project.description),
  ],
}));

/** 순서가 바뀌면 프롬프트 캐시가 깨진다. 항상 같은 순서로 낸다. */
export const KNOWLEDGE: KnowledgeDoc[] = [profileDoc, ...experienceDocs, ...projectDocs];
