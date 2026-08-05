/**
 * 사이트 전역 상수.
 *
 * RESUME_URL: 이력서 PDF. 파일은 아직 없으며 `public/resume.pdf`에 넣으면
 * 바로 연결된다. 경로를 한 곳에서만 바꾸도록 여기에 둔다.
 */
export const RESUME_URL = '/resume.pdf';

/**
 * 히어로가 크게 보여주는 프로젝트.
 * 대표 프로젝트 그리드는 이 항목을 제외한다 — 같은 화면이 연달아 두 번 나오면
 * 아래 카드가 자리값을 못 한다.
 */
export const HERO_PROJECT_SLUG = 'the1seoul';

export const CONTACT = {
  email: 'backbone94@naver.com',
  phone: '010-9287-1684',
  phoneHref: 'tel:+821092871684',
  github: 'https://github.com/backbone94',
  blog: 'https://sandy-cyclone-cbb.notion.site/55b2fd6390f540caa557399c36957e70',
} as const;
