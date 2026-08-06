/**
 * 사이트 전역 상수.
 *
 * SITE_URL: 배포 주소. metadata·sitemap·robots가 모두 이 값을 읽는다.
 * Vercel Primary Domain이 www 없는 쪽이므로 여기도 www를 붙이지 않는다 —
 * 어긋나면 canonical이 실제 서빙 주소와 달라진다.
 *
 * RESUME_URL: 이력서 PDF. 경로를 한 곳에서만 바꾸도록 여기에 둔다.
 */
export const SITE_URL = 'https://leejj.dev';

export const RESUME_URL = '/resume.pdf';

/** 이름·직함은 히어로·푸터·구조화 데이터가 함께 쓴다. 세 곳이 어긋나지 않게 여기서 낸다. */
export const PROFILE = {
  name: '이정준',
  nameEn: 'Jeongjun Lee',
  jobTitle: 'AI Native Developer',
  affiliation: '와커스 (WACUS)',
  alumniOf: '아주대학교 소프트웨어학과',
} as const;

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
