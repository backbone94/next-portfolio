import { CONTACT, PROFILE, SITE_URL } from '../content/site';

/**
 * 검색엔진이 이 사이트를 "이정준이라는 사람"으로 알아보게 하는 구조화 데이터.
 * 화면에 이미 있는 사실만 옮긴다 — 여기에만 있는 주장을 적으면 사람이 보는
 * 내용과 크롤러가 읽는 내용이 갈라진다.
 *
 * 전화번호는 넣지 않는다. 스크래퍼에게 기계가 읽기 좋은 형태로 건네는 꼴이다.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.name,
  alternateName: PROFILE.nameEn,
  url: SITE_URL,
  jobTitle: PROFILE.jobTitle,
  worksFor: { '@type': 'Organization', name: PROFILE.affiliation },
  alumniOf: { '@type': 'CollegeOrUniversity', name: PROFILE.alumniOf },
  email: `mailto:${CONTACT.email}`,
  sameAs: [CONTACT.github, CONTACT.blog],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과라 사용자 입력이 섞이지 않는다.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
