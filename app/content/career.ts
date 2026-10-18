/**
 * 경력·학력·자격증·기술 목록. 검색창의 미리 써 둔 답(prepared.ts)과 Claude에게 넘기는 근거 자료(knowledge.ts)가 읽는다.
 *
 * 예전에는 옛 포트폴리오 화면의 컴포넌트(Experience, Education, Skill) 파일 안에 데이터가 함께 있었다.
 * 화면을 걷어 내면서 데이터만 여기로 옮겼다.
 */

/**
 * 한 회사에서 여러 프로젝트를 한다. 회사 아래 프로젝트를 두고 한 일은 그
 * 아래에 붙인다. 평평한 목록이면 프로젝트가 늘었을 때 어느 일이 어느
 * 프로젝트 것인지 읽는 쪽에서 알 수 없다.
 *
 * 스택도 회사가 아니라 프로젝트가 갖는다. 같은 회사에서도 프로젝트마다
 * 다르기 때문이다.
 */
type Project = {
  name: string;
  stack?: string[];
  tasks: string[];
};

export type Job = {
  company: string;
  duration: string;
  /** 확인된 경우에만 적는다. 추정해서 채우지 않는다. */
  role?: string;
  current?: boolean;
  projects: Project[];
};

export const experiences: Job[] = [
  {
    company: '와커스 (WACUS)',
    duration: '2026.07 – 재직 중',
    current: true,
    // 직무(정규직/계약직)는 아직 확인 전이라 비워 둔다. 지어내지 않는다.
    projects: [
      {
        name: '더원서울안과 홈페이지 리뉴얼',
        stack: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL'],
        tasks: [
          '사용자·관리자 화면·백엔드 API 연동 전반 참여',
          '회원가입·로그인·계정 찾기 인증 흐름 구축 및 네이버·카카오 소셜 로그인 연동',
          '인증·권한 취약점 보완 — 아이디 열거 방지, 로그인 시도 제한, 관리자 화면 접근 제어',
          '의료진 소개·학술발표·유튜브·메인 팝업을 관리자 화면에서 직접 운영하도록 연동',
          '웹 접근성 향상 — 시각장애 사용자를 위한 캡차에 음성 듣기 추가',
          '신규 서버 이관 — DB·업로드 파일 옮기고 SSL 인증서 발급·자동 갱신 구성 후 도메인 전환',
          'SEO 강화 — 검색 결과 노출을 위한 구조화 데이터(JSON-LD) 적용 및 SEO 관리자 설정 화면 정리',
        ],
      },
    ],
  },
  {
    company: '아이티센엔텍',
    duration: '2025.06 – 2026.05',
    role: '정규직',
    projects: [
      {
        name: '삼성전자 DS 임직원 OA 장비 관리 시스템',
        stack: ['Vue.js', 'Spring Boot', 'Oracle', 'MyBatis'],
        tasks: [
          '모바일 SSO 인증 실패 이슈 분석 및 AD 연동 로그인 안정성 확보',
          'synchronized 기반 동시성(날짜 중복 선택) 제어 로직 구현으로 데이터 정합성 보장',
          '약 8,000명 대상 대량 메일 발송 Timeout 이슈 원인 분석 및 해결',
          'Vue CLI(Webpack) → Vite 마이그레이션으로 빌드 시간 20초 → 5초 단축',
          'Samsung Knox API 기반 Q&A 등록 시 관리자 자동 메일 발송 기능 개발',
          '운영 중 장애 대응과 사용자 문의 처리로 서비스 안정성 유지',
        ],
      },
    ],
  },
  {
    company: '베스텔라랩',
    duration: '2024.07 – 2024.08',
    role: '인턴',
    projects: [
      {
        name: 'Figma 지도 연동 플러그인',
        stack: ['TypeScript', 'React', 'Webpack', 'OpenLayers'],
        tasks: [
          'Figma Plugin API 기반 플러그인 구조 설계 및 개발',
          'Figma 레이어(폴리곤)의 EPSG:3857 ↔ EPSG:4326 좌표계 변환 및 위경도 좌표 추출 구현',
          'OpenLayers 라이브러리로 폴리곤 드래그/리사이즈/회전 등 커스텀 기능 구현',
          'Nominatim API로 지도 내 장소 검색 기능 추가',
          'Figma ↔ Plugin 간 레이어 데이터 Import / Export 기능 개발',
          'MUI(Material UI) 기반 플러그인 UI 설계 및 구현',
        ],
      },
    ],
  },
  {
    company: '이파피루스',
    duration: '2022.04 – 2023.12',
    role: '정규직',
    projects: [
      {
        name: '웹 PDF 뷰어 솔루션',
        stack: ['Angular', 'TypeScript', 'SCSS'],
        tasks: [
          '프론트엔드 기능 개발 및 유지보수',
          'i18n 라이브러리로 다국어(영어, 일본어) 처리',
          '인쇄된 PDF에도 남는 비가시 워터마크(추적코드) 삽입 기능 구현',
          '우클릭 커스텀 컨텍스트 메뉴 개발',
          '다크모드 / 라이트모드 테마 전환 기능 구현',
          'Android TalkBack / iOS VoiceOver로 PDF 내용 TTS 지원',
        ],
      },
    ],
  },
];

export const education = {
  institution: '아주대학교 소프트웨어학과',
  duration: '2020.03 – 2025.02',
};

export const certifications = [
  { title: 'SQLD', issueDate: '2025.12' },
  { title: 'AWS SAA', issueDate: '2025.09' },
  { title: 'OPIc IM2', issueDate: '2024.11' },
  { title: '정보처리기사', issueDate: '2021.11' },
];

/** 주로 쓰는 기술. 갈래 이름과 기술 이름만 둔다. "기술 스택" 답이 이 순서대로 읽는다. */
type SkillCategory = { label: string; skills: { label: string }[] };

export const skillCategories: SkillCategory[] = [
  { label: '프론트엔드', skills: [{ label: 'TypeScript' }, { label: 'React' }, { label: 'Vue.js' }, { label: 'Angular' }, { label: 'Next.js' }] },
  { label: '백엔드 · 데이터베이스', skills: [{ label: 'Spring Boot' }, { label: 'Oracle' }, { label: 'NestJS' }, { label: 'Prisma' }] },
  { label: '인프라 · 운영', skills: [{ label: 'AWS' }, { label: 'Docker' }, { label: 'Nginx' }, { label: 'GitHub Actions' }] },
  { label: 'AI', skills: [{ label: 'OpenAI' }, { label: 'Perplexity' }] },
];
