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
        name: '밝은눈안과 잠실점 홈페이지 리뉴얼',
        stack: ['Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS'],
        tasks: [
          '기존 회원, 상담, 게시글과 첨부 파일을 옮기는 스크립트를 작성하고 이관 결과를 대조했습니다.',
          '관리자 상담과 이벤트 접수에 언어와 기간 필터, 재문의 확인, 동시 수정 방지, 선택 항목 엑셀 내보내기를 추가했습니다.',
          '해외 예약을 홈페이지에서 받아 관리자 목록에 저장하고, 신청자와 병원에 확인 메일을 보내도록 했습니다.',
          '운영 배포를 리허설하고 오픈 절차를 정리했습니다. 도메인 전환 뒤 404 로그를 확인해 빠진 주소를 추가로 연결했습니다.',
        ],
      },
      {
        name: '더원서울안과 홈페이지 리뉴얼',
        stack: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL'],
        tasks: [
          '사용자 화면과 관리자 화면을 백엔드 API에 연결했습니다.',
          '회원가입, 로그인, 계정 찾기를 구현하고 네이버와 카카오 로그인을 연동했습니다.',
          '등록된 아이디가 드러나던 로그인 오류를 고치고, 로그인 시도 제한과 관리자 접근 권한을 보완했습니다.',
          '병원 담당자가 의료진 소개, 학술발표, 유튜브, 메인 팝업을 관리자 화면에서 직접 수정하도록 연결했습니다.',
          '화면의 문자를 읽기 어려운 사용자도 계정을 찾을 수 있게 캡차에 음성 듣기 기능을 추가했습니다.',
          'DB와 업로드 파일을 새 서버로 옮기고, 인증서 발급과 자동 갱신을 구성한 뒤 도메인을 전환했습니다.',
          '검색엔진에 병원 정보를 전달하도록 구조화 데이터(JSON-LD)를 추가하고, 관리자 SEO 설정 화면을 정리했습니다.',
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
          '모바일 SSO 인증이 실패하는 원인을 분석해 AD 연동 로그인을 안정화했습니다.',
          '같은 날짜가 동시에 선택되는 문제를 synchronized로 제어해 중복 처리를 막았습니다.',
          '약 8,000명에게 메일을 보낼 때 요청 시간이 초과되는 원인을 찾아 해결했습니다.',
          'Vue CLI(Webpack)를 Vite로 바꿔 빌드 시간을 20초에서 5초로 줄였습니다.',
          '질문이 등록되면 Samsung Knox API로 관리자에게 메일을 보내도록 구현했습니다.',
          '운영 중 발생한 장애와 사용자 문의에 대응했습니다.',
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
          'Figma Plugin API를 바탕으로 플러그인을 설계하고 개발했습니다.',
          'Figma 도형의 지도 좌표를 EPSG:3857에서 EPSG:4326으로 변환해 위도와 경도를 구했습니다.',
          'OpenLayers로 지도 위 도형을 옮기거나 돌리고 크기를 조절할 수 있게 했습니다.',
          'Nominatim API를 연결해 지도에서 장소를 찾을 수 있게 했습니다.',
          'Figma와 플러그인 사이에서 레이어를 주고받을 수 있게 했습니다.',
          'MUI(Material UI)로 플러그인 화면을 설계하고 구현했습니다.',
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
          'PDF 뷰어의 프론트엔드 기능을 개발하고 유지보수했습니다.',
          'i18n 라이브러리를 사용해 영어와 일본어를 지원했습니다.',
          'PDF를 종이에 인쇄해도 남는 비가시 워터마크를 구현했습니다.',
          '관리자가 항목을 고를 수 있는 우클릭 메뉴를 개발했습니다.',
          '다크 모드와 라이트 모드를 전환하는 기능을 구현했습니다.',
          'Android TalkBack과 iOS VoiceOver로 PDF 내용을 읽을 수 있게 했습니다.',
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
  { label: '백엔드와 데이터베이스', skills: [{ label: 'Spring Boot' }, { label: 'Oracle' }, { label: 'NestJS' }, { label: 'Prisma' }] },
  { label: '인프라와 운영', skills: [{ label: 'AWS' }, { label: 'Docker' }, { label: 'Nginx' }, { label: 'GitHub Actions' }] },
  { label: 'AI', skills: [{ label: 'OpenAI' }, { label: 'Perplexity' }] },
];
