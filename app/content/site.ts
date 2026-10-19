/**
 * 사이트 전역 상수.
 *
 * SITE_URL: 배포 주소. metadata·sitemap·robots가 모두 이 값을 읽는다.
 * Vercel Primary Domain이 www 없는 쪽이므로 여기도 www를 붙이지 않는다 —
 * 어긋나면 canonical이 실제 서빙 주소와 달라진다.
 *
 * RESUME_URL: 이력서 PDF. 경로를 한 곳에서만 바꾸도록 여기에 둔다.
 * 뒤에 붙는 ?v=는 PDF 내용의 해시다(next.config.mjs). 파일을 바꾸면 주소도 바뀌어 예전 파일이 다시 열리지 않는다.
 */
export const SITE_URL = 'https://leejj.dev';

export const RESUME_URL = `/resume.pdf?v=${process.env.RESUME_VERSION}`;

/**
 * 자주 묻는 질문의 대표 문장. 헤더 메뉴, 첫 화면 바로가기, 옛 주소 넘기기가
 * 모두 이 문장으로 /?q=를 만든다. 직접 쓴 답변으로 이어지는 문장이어야 한다.
 */
export const ASK = {
  projects: '프로젝트 전부 보여 주세요',
  career: '경력을 알려 주세요',
  contact: '연락처를 알려 주세요',
  education: '학력과 자격증은요?',
} as const;

/**
 * 첫 화면의 예시 질문. 면접관이 처음 훑을 때 궁금해하는 순서(누구인지 → 대표작 → 일하는 방식 →
 * 이 사이트)로 두고, 모두 직접 써 둔 답으로 이어지게 했다. 바로 뜨고 비용이 없다. 넓은 화면에서
 * 한 줄에 들어가도록 네 개만 둔다. 경력은 자기소개 답이 회사를 모두 말하고 그 답 아래 이어지는
 * 질문으로도 붙어 있어 뺐다. 기술 스택은 목록이라 새로 알게 되는 것이 적어서 입력창의 흐린 예시로 돌렸다.
 * 실패담처럼 깊은 질문과 장난스러운 질문은 입력창의 흐린 예시로 돌린다.
 *
 * 사이트맵도 이 목록을 읽는다. 방문자가 가장 많이 누를 질문이라 검색에도 이 주소가 걸려야 한다.
 */
export const STARTERS = [
  '자기소개 부탁드려요',
  '가장 자신 있는 프로젝트는?',
  '측정해서 개선한 사례가 있나요?',
  // 설계 판단을 보여 주는 질문. "AI Native Developer"라는 소개를 이 사이트 자체로 증명한다.
  '이 사이트는 어떻게 만들었어요?',
] as const;

/**
 * 질문을 기록한다는 안내(app/lib/ask/store.ts). 첫 질문을 하기 전에 보여야 하므로 첫 화면,
 * 대화 화면, 상세 페이지 대화창의 입력창 가까이에 모두 둔다.
 */
export const RECORD_NOTICE = '질문은 답변을 개선하는 데 쓰입니다.';

/** 질문 하나를 주소로. 이 주소로 들어오면 그 질문과 답이 펼쳐진 채로 열린다. */
export const askHref = (question: string) => `/?q=${encodeURIComponent(question)}`;

/** 이름·직함은 히어로·푸터·구조화 데이터가 함께 쓴다. 세 곳이 어긋나지 않게 여기서 낸다. */
export const PROFILE = {
  name: '이정준',
  nameEn: 'Jeongjun Lee',
  jobTitle: 'AI Native Developer',
  affiliation: '와커스 (WACUS)',
  alumniOf: '아주대학교 소프트웨어학과',
} as const;

/**
 * 전화번호는 두지 않는다. 검색에 걸리는 공개 도메인이라 평문으로 적어 두면
 * 스크래퍼가 그대로 긁어간다. 필요한 사람은 이력서 PDF에서 확인한다.
 */
export const CONTACT = {
  email: 'backbone94@naver.com',
  github: 'https://github.com/backbone94',
  blog: 'https://sandy-cyclone-cbb.notion.site/55b2fd6390f540caa557399c36957e70',
} as const;
