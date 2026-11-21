/**
 * animation은 원래 GIF였던 화면 녹화다. 같은 내용을 mp4로 담으면 34MB가 1MB가
 * 되는데(search.gif 하나가 11.6MB였다), 클릭해야 재생되는 video로 두면 짧은
 * UI 시연을 보려고 한 번씩 눌러야 한다. 파일은 영상이되 GIF처럼 알아서 도는
 * 종류를 따로 둔다.
 */
export type MediaItem = {
  type: 'image' | 'video' | 'animation';
  src: string;
  alt: string;
};

export type Project = {
  /** 카드·상세 페이지 제목 */
  title: string;
  /** /projects/[slug] 경로에 쓰이는 식별자 */
  slug: string;
  /** 질문에서 프로젝트를 부르는 이름 */
  aliases?: string[];
  /** 카드에 노출되는 한 줄 소개 */
  summary: string;
  /** 카드에 노출되는 핵심 성과 한 줄 */
  highlight: string;
  /** 팀 내 역할 */
  role: string;
  /** 필터에 쓰이는 태그. 첫 번째는 유형(실무/사이드/졸업작품/기타) */
  tags: string[];
  /** 랜딩의 대표 프로젝트로 노출할지 여부 */
  featured: boolean;
  media: MediaItem[];
  features: string;
  stack: string;
  duration: string;
  teamSize: string;
  contribution: string;
  github?: string;
  reference?: string;
  description: string;
};

export const projects: Project[] = [
  {
    title: '밝은눈안과 잠실점 홈페이지 리뉴얼',
    slug: 'bgneye-jamsil',
    aliases: ['밝은눈', '잠실', 'BGN 잠실', 'BGN Jamsil'],
    summary: '기존 상담 기록과 해외 예약 업무를 함께 옮긴 잠실점 홈페이지 개편',
    highlight: '기존 상담 기록과 사진을 옮겼고, 해외 예약은 병원 관리자 화면에서 바로 볼 수 있게 했습니다.',
    role: '백엔드 개발, 데이터 이관 및 운영 전환',
    tags: ['실무', 'Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/bgneye-jamsil/overview.png',
        alt: '상단 메뉴와 지구 그래픽이 보이는 밝은눈안과 잠실점 홈페이지 첫 화면',
      },
    ],
    features: '온라인 상담·예약, 이벤트 신청, 다국어 홈페이지, 관리자 접수 관리, 접수 확인 메일',
    stack: 'Next.js, React, NestJS, Prisma, PostgreSQL, Nginx, Docker, GitHub Actions, AWS',
    reference: 'https://www.bgneye.com/',
    duration: '2026.09–2026.11',
    teamSize: '',
    contribution: '약 60% (백엔드 개발, 레거시 데이터 이관, 관리자 접수 개선, 해외 예약 연동, 운영 전환)',
    description: `<p>와커스에서 밝은눈안과 잠실점의 PHP 홈페이지를 개편했습니다. 저는 백엔드와 관리자 기능을 맡았고, 병원에서 기존 상담 기록을 계속 열어보고 새 예약도 받을 수 있도록 운영 전환까지 함께했습니다.</p>
    <h3>글은 옮겨졌는데 사진이 안 보였습니다</h3>
    <p>회원과 상담 기록, 게시글을 새 DB로 옮기는 스크립트를 만들었습니다. 이관 후 사진이 빠진 글을 보니, DB에는 업로드할 때의 파일명이 적혀 있고 서버에는 다른 이름으로 저장된 경우가 있었습니다. 서버의 저장 이름을 찾아 글과 다시 연결했습니다. 상담은 내용뿐 아니라 처리 상태와 담당자 메모도 옮겼습니다. 그래야 관리자에서 어디까지 답변했는지 알 수 있으니까요.</p>
    <h3>병원에서 상담과 예약을 받는 화면</h3>
    <p>상담 목록에서 접수 언어나 희망 날짜로 문의를 찾고, 같은 연락처로 다시 들어온 문의도 볼 수 있게 했습니다. 두 사람이 같은 상담을 수정하다 한쪽의 변경이 덮어써지는 경우도 막았습니다. 이벤트 신청 목록에는 기간 필터를 추가하고, 골라 둔 신청만 엑셀로 받을 수 있게 했습니다.</p>
    <p>해외 예약은 외부 서비스에서 따로 받던 일이었습니다. 기존 문진 항목을 사이트 신청서로 가져오고, 신청 내용이 관리자 온라인 예약 목록에 들어오도록 연결했습니다. 접수되면 신청자와 병원에 메일이 갑니다. 병원은 희망 일시와 문진 내용을 확인한 뒤 예약을 확정할 수 있습니다.</p>
    <h3>도메인을 넘긴 뒤에도 남은 일</h3>
    <p>AWS 운영 환경에서 이관과 배포를 네 차례 연습했습니다. 도메인을 넘기기 전에 할 일과 넘긴 직후 확인할 항목은 따로 적어뒀습니다. 11월 18일에 새 사이트를 연 뒤에는 404 로그를 살폈습니다. 예전 그룹 사이트 시절 주소로 들어온 기록이 남아 있어서, 해당 주소에서 새 페이지로 이어지도록 규칙을 추가했습니다.</p>`,
  },
  {
    title: '더원서울안과 홈페이지 리뉴얼',
    slug: 'the1seoul',
    summary: '회원 인증과 검색 설정을 손보고 운영 서버를 옮긴 안과 홈페이지 개편',
    highlight: '회원 기능을 새 화면에 연결하고, 운영 중인 사이트의 DB와 첨부 파일을 새 서버로 옮겼습니다.',
    // 아래 둘은 저장소 커밋에서 뽑았다. 참여 기간(2026.07.21—08.01) 커밋 169건 중
    // 72건으로 기여자 중 1위였고, 그 43%를 40%로 내려 적었다. 커밋 수가 곧 기여는
    // 아니므로 본인 확인 후 고칠 것.
    role: '백엔드 개발 및 인프라 구축',
    teamSize: '8명',
    contribution: '40% (소셜 로그인, 프론트엔드 ↔ 백엔드 API 연결, 레거시 → 리뉴얼 파일/DB 이관, SSL 인증서 발급, AWS 인프라 구축, SEO 강화)',
    tags: ['실무', 'Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS'],
    media: [
      {
        type: 'image',
        src: '/images/the1seoul/overview.jpg',
        alt: '더원서울안과 홈페이지 메인 화면. 상단 진료과 내비게이션과 "서울대학교 병원, 교수들이 만든 더원서울안과" 문구',
      },
    ],
    featured: true,
    features:
      '병원 예약 접수, 소셜 로그인, 통합 검색, 병원소식, 공지사항 등의 게시판, 의료진 소개',
    stack: 'Next.js, React, NestJS, Prisma, PostgreSQL, Nginx, Docker, GitHub Actions, AWS Lightsail',
    reference: 'https://the1seoul.com',
    duration: '2026.07–2026.08',
    description: `<p>와커스에 합류해서 처음 맡은 홈페이지 리뉴얼입니다. 제가 들어갔을 때는 화면에 코드로 넣어둔 값이 표시되고 있었습니다. 팀원이 만들어 둔 API를 화면에 연결해 실제 데이터를 불러오도록 했고, 회원 인증과 서버 이관도 맡았습니다. 지금은 <a href="https://the1seoul.com" target="_blank" rel="noopener noreferrer">the1seoul.com</a>에서 운영 중입니다.</p>
    <h3>비밀번호를 찾으려고 메일함을 오가던 절차</h3>
    <p>회원가입부터 탈퇴까지의 계정 기능과 네이버·카카오 로그인을 맡았습니다. 비밀번호를 잊으면 임시 비밀번호를 메일로 받아 다시 로그인한 뒤 비밀번호를 바꿔야 했습니다. 본인 확인이 끝나면 곧바로 새 비밀번호를 정할 수 있게 바꿨습니다.</p>
    <p>아이디나 비밀번호를 찾을 때 화면에 나온 숫자를 읽는 캡차가 있었습니다. 안과 홈페이지에서 숫자를 읽기 어려운 분도 계정을 찾을 수 있도록 음성 듣기 버튼을 넣었습니다. 예전에 PDF 뷰어를 스크린리더로 읽을 수 있게 손본 경험이 여기서 도움이 됐습니다.</p>
    <p>로그인 시도에는 횟수 제한을 두고, 관리자와 게시판 관리 화면의 접근 권한도 보완했습니다. 응답 없이 오래 걸리던 파일 업로드에는 크기 제한을 걸었습니다.</p>
    <h3>글과 사진을 새 서버에서 열어보기</h3>
    <p>게시판 글은 DB에, 그 글에 붙은 사진과 팝업 이미지는 별도 파일로 저장돼 있었습니다. 파일도 함께 옮겨야 기존 글과 이미지가 새 사이트에서 같이 열립니다. DB는 새 DB로, 업로드 파일은 새 Docker 볼륨으로 옮겼습니다. 도메인을 넘기기 전에 Let's Encrypt 인증서를 준비했고, 갱신도 자동으로 돌도록 스크립트를 만들었습니다.</p>
    <p>서버 한 대에서 운영하는 규모라 AWS Lightsail을 골랐습니다. Nginx와 사용자·관리자 화면, 백엔드, Redis를 Docker Compose로 묶었습니다. 새 버전을 띄워도 Nginx에서 같은 네트워크로 연결할 수 있어서, 이 구성 위에 블루그린 배포를 붙였습니다.</p>
    <h3>입력해도 반영되지 않던 검색 설정</h3>
    <p>병원 정보와 진료 페이지, 질환 글에 구조화 데이터(JSON-LD)를 추가했습니다. 개별 의료진이 검수했다는 근거가 없는 글은 병원을 작성 주체로 표시했습니다.</p>
    <p>두 화면에 흩어져 있던 검색 설정도 한곳에 모았습니다. 정리하다 보니 관리자에서 일본어와 중국어 설정을 저장해도 실제 페이지에 반영되지 않는 경우가 있었습니다. 관리자와 사이트에서 쓰는 언어 코드가 달라서, 두 쪽이 같은 값을 쓰도록 고쳤습니다.</p>`,
  },
  {
    title: '슬기로운 아이티센 생활 | 셔틀 서비스',
    slug: 'shuttle',
    summary: '셔틀이 지금 어디쯤인지 확인하고 QR로 탑승하는 사내 모바일 서비스',
    highlight: '신입 교육 11개 팀 가운데 유일하게 본사 상용화 검토까지 갔습니다.',
    role: '프론트엔드 단독 (5인 팀)',
    tags: ['실무', 'React', 'Spring Boot', 'WebSocket', 'AI/LLM', 'PWA'],
    featured: true,
    media: [
      { type: 'image', src: '/images/shuttle/overview.jpg', alt: '홈 화면, 실시간 셔틀 위치 지도, QR 탑승 인증 화면' },
      { type: 'video', src: '/videos/shuttle.mp4', alt: '셔틀버스 예약부터 QR 탑승 인증까지 이어지는 사용 흐름 데모 영상' },
    ],
    features: '실시간 셔틀 위치 조회, QR 기반 탑승 인증, 실시간 공지, 셔틀 시간표 관리, 1:1 문의, AI 챗봇 기능',
    stack: 'React, Spring Boot, PostgreSQL, WebSocket, Perplexity, GitHub Actions, AWS EC2, S3',
    github: 'https://github.com/1hajo/Seur-A-Saeng',
    duration: '2025.05–2025.06',
    teamSize: '5명 (프론트엔드 1명, 백엔드 4명)',
    contribution: '40% (프론트엔드 단독 개발, UI/UX 설계 및 구현)',
    description: `ITCEN의 사내 신입 교육 과정에서 임직원의 출퇴근 불편을 풀어 보려고 만든 <strong>셔틀버스 관리 서비스</strong>입니다.<h3>어떤 문제가 있었나</h3>
    기존 셔틀 운영에서는 실시간 위치를 확인하기 어려워 대기 시간이 길어졌고, 외부인의 무단 탑승도 통제하기 어려웠습니다. 그래서 <strong>실시간 위치 조회, QR 기반 인증, 공지 및 문의 기능</strong>을 중심으로 서비스를 설계했습니다.<h3>맡은 일</h3>
    저는 팀 내 <strong>유일한 프론트엔드 개발자</strong>로 참여해 UI/UX 설계와 전체 화면 구현을 담당했습니다. 특히 지도 기반의 실시간 셔틀 위치 표시, 노선 선택 인터페이스, 혼잡도 시각화 등 사용자가 정보를 직관적으로 이해하도록 인터페이스를 구성했습니다.<br><br>
    실시간 위치는 WebSocket으로 받은 데이터를 클라이언트에서 지도에 반영하는 방식으로 구현했습니다. 계속 갱신되는 데이터가 자연스럽게 보이도록 상태 관리와 렌더링 흐름을 다듬었습니다.<h3>AI 챗봇으로 시간표를 물어보게</h3>
    사용자 편의를 위해 <strong>Perplexity API로 AI 챗봇</strong>을 붙였습니다. 셔틀 시간표 데이터와 연동해 가장 빨리 탈 수 있는 셔틀, 정류장 위치, 소요 시간을 자연어로 물어보게 했고 회사와 계열사 정보 검색도 함께 넣었습니다.<h3>혼자서 프론트를 감당한 방법</h3>
    백엔드 개발자들과 협업하는 구조에서 프론트엔드를 혼자 맡아야 했기 때문에 <strong>Cursor AI를 적극적으로</strong> 썼습니다. 반복적인 코드 작성과 구조 설계에 드는 시간을 줄여, 인력이 한쪽으로 기운 상황에서도 일정을 밀리지 않고 끝냈습니다.<br><br>
    서비스가 친근해 보이도록 <strong>Runway AI로 본사 마스코트 캐릭터 애니메이션</strong>을 만들어 넣었습니다. 기능만 있는 서비스에 감성적인 요소를 더하고 싶었습니다.<h3>PWA를 제안해 적용하기까지</h3>
    실제 사용 환경이 모바일 중심이라 <strong>PWA 도입을 제안하고 적용</strong>했습니다. 별도 설치 없이 홈 화면에 추가해 앱처럼 쓰도록 구현하고, 인앱 설치를 유도하는 UI도 설계했습니다.<h3>남은 것</h3>
    이 프로젝트는 신입 교육 과정에서 진행된 11개 프로젝트 중 <strong>유일하게 본사 상용화 검토 단계까지 갔습니다</strong>. 실사용을 고려한 설계와 완성도를 인정받은 경험이었습니다. 실시간 데이터를 다루는 UI 설계, 사용자 경험 중심의 개발, AI 도구로 생산성을 끌어올리는 방법을 여기서 익혔습니다.`
  },
  {
    title: 'Figma to Map Plugin',
    slug: 'figma-to-map',
    summary: 'Figma에서 그린 도형을 지도 위에 올려놓고 위경도를 뽑아내는 플러그인',
    highlight: '지도와 관련된 프로젝트로써, EPSG:3857/4326 등 좌표 변환의 개념을 알게 되었습니다.',
    role: '단독 개발 (인턴)',
    tags: ['실무', 'TypeScript', 'React', 'OpenLayers'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/figma-plugin/main.png',
        alt: '플러그인 메인 화면. 서울시청 일대 지도 위에 주차장 도면 레이어가 회전된 채 얹혀 있고, 상단에 파일 업로드·JSON 다운로드·위경도 좌표 다운로드·피그마로 보내기 버튼과 위치 검색창',
      },
      { type: 'video', src: '/videos/figma-plugin/import.mp4', alt: 'Figma 레이어를 플러그인으로 불러와 지도 위에 배치하는 과정 영상' },
      { type: 'video', src: '/videos/figma-plugin/export.mp4', alt: '지도에서 편집한 레이어를 다시 Figma로 내보내는 과정 영상' },
      {
        type: 'image',
        src: '/images/figma-plugin/json.png',
        alt: '내보낸 JSON 결과. 레이어 id·이름·위치·크기와 위경도 POLYGON 좌표, SVG 문자열이 담겨 있다',
      },
      { type: 'image', src: '/images/figma-plugin/csv.png', alt: '레이어별 위경도 좌표를 정리해 내보낸 CSV 결과' },
    ],
    features: '지도상에 Figma 컴포넌트 표시, 컴포넌트 드래그/리사이즈/회전, Figma <-> plugin 사이의 Import/Export, 지도 검색 기능 등',
    stack: 'Figma Plugin API, TypeScript, React, Webpack, MUI, OpenLayers',
    github: '',
    duration: '2024.07.09–2024.08.21',
    teamSize: '1명',
    contribution: '100%',
    description: `인턴으로서 참여한 첫 프로젝트입니다. 프로젝트의 목표는 Figma의 특정 레이어를 지도상의 원하는 위치에 배치하고, 해당 위치의 위경도 좌표를 저장할 수 있는 <strong>Figma 플러그인</strong>을 개발하는 것이었습니다.<h3>React와 TypeScript를 얹기까지</h3>
Figma 플러그인의 기본 뼈대는 Figma Plugin API의 <a href="https://www.figma.com/plugin-docs/" target="_blank" class="text-blue-500">공식 문서</a>를 참고해 구성하였고, 코드 유지보수성 때문에 React를, 타입 안전성 때문에 TypeScript를 도입하였습니다.<br><br>
다만 Figma 플러그인 환경에서 React와 TypeScript를 함께 쓰려면 Webpack 번들러의 복잡한 설정이 필요했습니다. 그래서 <strong>Figma + Webpack + TypeScript + React</strong> 조합이 미리 구성된 <a href="https://github.com/hseoy/figma-plugin-react-boilerplate" target="_blank" class="text-blue-500">보일러플레이트</a>를 가져다 써서 환경 설정 없이 개발에 집중하였습니다.<br>
UI는 구글의 Material Design 가이드라인을 따르는 <strong>MUI(Material UI)</strong>로 React 컴포넌트와 일관된 스타일로 구성하였습니다.<h3>Leaflet에서 OpenLayers로 바꾼 이유</h3>
지도 구현에는 초기에 Leaflet을 사용하였으나 Polygon 드래그·회전·리사이즈 등 커스텀 인터랙션에 한계가 있었습니다. 사수와 논의해 커스텀 기능을 더 많이 지원하는 <strong>OpenLayers</strong>로 교체하였고, 필요한 인터랙션을 모두 구현하였습니다.<br>
지도를 직접 드래그하며 원하는 지역을 찾는 방식은 비효율적이라고 판단해, OpenStreetMap 기반의 지오코딩 API인 <strong>Nominatim</strong>을 연동해 주소 검색 기능을 추가하였습니다.<h3>좌표계에서 막혔던 지점</h3>
이 플러그인의 핵심인 위경도 좌표 변환을 구현하면서, OpenLayers가 내부적으로 쓰는 <strong>EPSG:3857(Web Mercator)</strong> 좌표계와 위경도 표현에 쓰이는 <strong>EPSG:4326(WGS84)</strong> 좌표계의 차이를 처음에는 몰라 변환 오류를 겪었습니다. 이를 계기로 두 좌표계의 개념과 변환 방식을 직접 공부해 해결하였습니다.<br>
지도 라이브러리와 좌표계라는 생소한 개념을 실무에서 직접 부딪히며 익힌 프로젝트였습니다.`,
  },
  {
    title: 'Music Diary',
    slug: 'music-diary',
    summary: '그날 쓴 일기를 읽고 어울리는 음악을 골라 주는 서비스',
    highlight: '단순 일기 어플이 아닌, 사용자의 감정을 분석해주는 기능에 집중하였습니다.',
    role: '단독 개발',
    tags: ['사이드', 'Next.js', 'React', 'AI/LLM', 'Prisma'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/music-diary/list.png',
        alt: '일기 목록 화면. 제목과 본문 미리보기가 카드로 쌓여 있고 상단에 일기 쓰기·감정 히스토리 버튼',
      },
      { type: 'video', src: '/videos/diary_new_delete.mp4', alt: '일기를 새로 쓰고 삭제하는 과정 영상' },
      { type: 'video', src: '/videos/diary_detail.mp4', alt: '일기 상세 화면에서 감정 분석 결과와 추천 음악을 보여주는 영상' },
      { type: 'video', src: '/videos/sentiment_history.mp4', alt: '기간별 감정 변화를 그래프로 정리해 보여주는 감정 히스토리 영상' },
    ],
    features: 'GitHub & Kakao 소셜 로그인, 일기 작성, 음악 추천, 감정 히스토리 분석 등',
    stack: 'React, React Query, Next.js, Tailwind CSS, Prisma, MySQL, Vercel, OpenAI, Naver CLOVA, Youtube',
    github: 'https://github.com/backbone94/music-recommendation',
    duration: '2024.08.21–2024.09.05',
    teamSize: '1명',
    contribution: '100%',
    description: `Music Diary는 사용자의 감정과 선호도에 맞는 음악을 추천하는 웹 애플리케이션입니다. Next.js로 만들었고, 사용자가 쓴 일기를 분석해 어울리는 음악을 추천하고 감정 히스토리를 정리해 줍니다.<h3>Next.js를 고른 이유</h3>
    웹 개발자로서 쓸 수 있는 기술 스택을 넓히고 싶었고, <strong>SSR로 SEO를 챙기면서</strong> 백엔드 서버를 따로 두지 않아도 된다는 점, 이미지를 비롯한 각종 최적화를 좋은 개발자 경험(DX)과 함께 얻는다는 점이 컸습니다.<br>
    데이터 저장에는 ORM 중 하나인 Prisma를 써서 JS 코드에서 MySQL 데이터베이스에 쉽고 효율적으로 접근하였고, NextAuth.js로 <strong>소셜 로그인</strong>을 아주 간편하게 구현하였습니다.<br>
    비동기 작업에는 Next.js의 새 기능인 Server Actions를 써 봤고, 최신 데이터를 자동으로 받아 오는 <strong>React Query</strong> 덕분에 클라이언트의 다이나믹한 상태를 훨씬 쉽게 다룬다는 것도 알게 되었습니다.<h3>감정 분석에서 막혔던 부분</h3>
    일기 내용에서 감정을 분석하려고 <strong>Naver CLOVA API</strong>를 썼지만, 이 API는 감정을 긍정·부정·중립 세 단계로만 나눴습니다. 그래서 일기에 자주 나오는 단어에 가중치를 준 뒤 나열해, 그 내용과 비슷한 가사의 음악을 추천하는 방식을 시도했습니다. 하지만 단어 개수만으로 고르다 보니 뜬금없는 음악이 나왔습니다. 비용이 들더라도 <strong>OpenAI의 API</strong>가 가장 적합하겠다 싶어, OpenAI API로 음악 추천과 <strong>약 일주일 치 일기를 장문으로 정리해 주는 기능</strong>을 추가하였습니다. 첨언하자면 일주일 치 일기는 생각보다 글자가 많아 한 번 호출에 0.15달러 넘게 나갔고, 그걸 보고 이 어플리케이션은 상업성이 없다고 판단했습니다.<h3>앱으로 내보내려던 시도</h3>
    Tailwind CSS 유틸리티 클래스로 <strong>반응형 디자인</strong>을 이미 맞춰 둔 상태라, <a href="https://github.com/backbone94/music-recommendation-mobile" target="_blank" class="text-blue-500">React Native의 WebView</a>를 쓰면 웹을 그대로 스마트폰 앱으로 배포할 수 있다는 걸 알게 되어 실제로 시도했습니다. 그런데 구글 플레이스토어의 개발자 계정 심사가 생각보다 까다로웠습니다. 심사를 마치면 다시 한 번 앱 배포를 시도해 보려고 합니다.
    `,
  },
  {
    title: '살롱 | SSALON',
    slug: 'ssalon',
    summary: '한 번 모이고 끝나는 일회성 모임을 3D 증표로 남겨 두는 서비스',
    highlight: '프론트엔드 실무 경력이 있었음에도 백엔드 개발을 도전하게 된 프로젝트입니다.',
    role: '백엔드 주도 (5인 팀)',
    tags: ['졸업작품', 'Angular', 'Spring Boot', 'Three.js', 'AWS', 'AI/LLM'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/ssalon/ticket.png',
        alt: '왼쪽은 Google·Kakao·Naver 로그인 화면, 오른쪽은 스티커로 꾸민 검은 모임 증표를 3D로 기울여 보여주는 화면',
      },
      {
        type: 'image',
        src: '/images/ssalon/overview.png',
        alt: '시스템 구성도. 사용자·모임 개최자·광고주·관리자가 Angular 사용자 페이지와 React 관리자 페이지로 나뉘어 접속하고, AWS Route53·ELB·EC2 위의 서버가 MySQL·Redis·MongoDB Atlas와 OpenAI 임베딩·카카오 로그인·결제 API에 연결된다',
      },
      { type: 'video', src: '/videos/login.mp4', alt: '소셜 계정으로 로그인해 서비스에 진입하는 과정 영상' },
      { type: 'video', src: '/videos/chat.mp4', alt: '모임 참가자끼리 실시간으로 대화하는 채팅 기능 영상' },
      { type: 'video', src: '/videos/decoration.mp4', alt: '모임 증표에 스티커를 붙여 직접 꾸미는 과정 영상' },
    ],
    features: '3D 인터랙티브 증표, 모임/카테고리 추천 시스템, 모임 참가자 간 채팅, 모임 참가자 인증 등',
    stack: 'Angular, ThreeJS, Spring, MySQL, Redis, OpenAI, OAuth 2.0',
    github: 'https://github.com/backbone94/ssalon',
    duration: '2024.03–2024.06',
    teamSize: '5명 (프론트엔드 2명, 백엔드 3명)',
    contribution: '60% (백엔드 개발, AWS 클라우드 환경 구축, 채팅 기능, AI 이미지 생성 API, 프론트엔드 보조)',
    description: `<strong>아주대학교 소프트웨어학과 졸업 작품</strong>입니다. 일회성 모임을 위한 어플리케이션으로, 자신이 참여한 모임을 기념하는 "증표"를 만들어 간직하거나 직접 꾸며 친구들과 공유합니다.<h3>백엔드를 맡은 이유</h3>
    저는 프론트엔드 개발자를 목표로 삼고 있었지만, 웹 개발자로서 시야를 넓히려고 이 프로젝트에서는 <strong>백엔드 개발</strong>을 맡았습니다.<br>
    백엔드는 <strong>Spring</strong>을 썼습니다. 다른 백엔드 팀원들에게 가장 익숙한 스택이었고, Spring을 처음 접하는 저로서는 공부할 자료가 가장 많은 스택 중 하나라고 생각했으며, 복잡한 초기 설정을 자동화해 주는 Spring Boot가 있었기 때문입니다.<br>
    사용자가 쉽게 들어오려면 카카오 같은 <strong>소셜 로그인</strong>이 필수라고 판단해 기능을 추가했는데, 권한 부여(Authorization)의 업계 표준 프로토콜이 OAuth 2.0으로 자리 잡고 있어 OAuth 2.0으로 구현하였습니다.<br>
    클라이언트가 백엔드 API를 부를 때의 인증에는, 서버에 세션 저장소를 따로 둘 필요가 없는 <strong>JWT 방식</strong>을 도입하였습니다. JWT의 보안 허점을 조금이라도 메우려고 AWS의 인메모리 캐싱 서비스인 <strong>ElastiCache(Redis)</strong>에 JWT 만료를 대비한 <strong>Refresh Token</strong>을 따로 저장했습니다.<h3>클라우드 환경을 직접 운영하며</h3>
    Spring에 익숙하지 않은 채로 프로젝트를 진행하는 건 도전이었지만, GitHub Actions로 CI/CD를 구축하고 AWS의 EC2 인스턴스, RDS, ElastiCache 같은 <strong>클라우드 환경을 직접 운영</strong>해 본 시간이었습니다.<h3>테스트 코드를 포기했던 일</h3>
    GitHub Actions를 구축하면서, Mock 라이브러리로 쓴 <strong>테스트 코드</strong>로 배포 전 안정성을 높이는 CI를 초반에 계속 시도했습니다. 그런데 테스트 코드 작성에 시간이 꽤 들어 진척이 더뎠고 교수님의 압박이 있었습니다. 결국 아쉽지만 테스트 코드는 쓰지 않는 쪽으로 진행했고, 그 부분이 지금도 아쉽습니다.<h3>API 문서로 협업 문제를 풀다</h3>
    프론트엔드 팀원과 협업하면서, 백엔드가 API를 만들어 놔도 프론트엔드 쪽에 정보가 왜곡된 채 전달돼 API를 제대로 쓰지 못하는 문제가 있었습니다. 이걸 풀고 소통을 매끄럽게 하려면 <strong>API 문서</strong>가 있어야겠다고 생각해, 백엔드 팀원들과 협의한 뒤 Swagger로 문서를 만들어 프론트엔드 팀원들이 더 수월하게 작업하도록 했습니다. 열심히 만든 API를 문서로서 보기 좋게 정리하고, 팀원들이 그걸 잘 쓰는 모습을 보니 뿌듯했습니다.<h3>채팅과 AI 이미지 생성</h3>
    실시간 채팅은 <strong>WebSocket 프로토콜</strong>로 개발했는데, 익숙한 HTTP 통신과 달리 오류 메시지가 구체적으로 나오지 않아 디버깅에 애를 먹었습니다.<br>
    그리고 기획 단계에서 언급만 됐던 <strong>Open AI API 이미지 생성 기능</strong>은 시간이 촉박해 생략하려 했지만, 최신 AI 기술을 꼭 써 보고 싶은 욕심에 프로젝트 마지막쯤 OpenAI Dall-E 3 API로 붙였습니다. 모임의 성격을 프롬프트로 넣으면 그에 어울리는 증표 이미지가 나옵니다.<h3>프론트와 백엔드를 오가며</h3>
    이전에 프론트엔드(Angular) 개발자로서 일한 경력이 있다 보니, 프론트엔드 팀원이 속도가 나지 않을 때 제가 <strong>프론트엔드와 백엔드를 동시에 진행</strong>하며 부족한 부분을 메우려 했고, 그만큼 프로젝트에 더 많이 기여했습니다.`,
  },
  {
    title: '웹 PDF 뷰어 솔루션',
    slug: 'pdf-viewer',
    summary: '브라우저에서의 실시간 전자문서(PDF) 뷰어 솔루션',
    highlight: '프론트엔드로써 첫 실무 경력을 쌓았습니다.',
    role: '기능 개발 전담',
    tags: ['실무', 'Angular', 'SCSS', '웹접근성'],
    // 메인은 최근작 위주로 좁게 간다. 이 프로젝트는 /projects 목록에서 만난다.
    featured: false,
    media: [
      { type: 'video', src: '/videos/company/right_click.mp4', alt: 'PDF 뷰어에서 우클릭했을 때 뜨는 커스텀 컨텍스트 메뉴 동작 영상' },
      {
        type: 'image',
        src: '/images/company/invisible_tracer_desc.png',
        alt: '비가시 추적코드 설명 도식. 왼쪽 기존 워터마크는 문서 내용과 겹쳐 읽기 불편한 반면, 오른쪽 비가시 추적코드는 화면에 보이지 않으면서도 촬영 시 열람 일시·파일명·열람자를 확인할 수 있다',
      },
      { type: 'video', src: '/videos/company/invisible_tracer.mp4', alt: '문서에 삽입된 비가시 추적코드를 스마트폰으로 스캔해 열람 정보를 확인하는 영상' },
      {
        type: 'image',
        src: '/images/company/dark_mode.png',
        alt: '다크모드로 전환한 PDF 뷰어. 좌측 메뉴의 화면 테마에서 다크가 선택되어 있고 툴바가 어두운 색으로 바뀌어 있다',
      },
      { type: 'image', src: '/images/company/light_mode.png', alt: '라이트모드 상태의 PDF 뷰어 화면' },
    ],
    features: '우클릭(Context menu) 커스텀 기능, 문서 추적코드 추가, 다크모드, 모바일 스크린 리더',
    stack: 'Angular, SCSS',
    reference: 'https://demo.epapyrus.com/ko/streamdocs',
    duration: '2022.04.13–2023.12.15',
    teamSize: '2명 (기능 구현 1명, 관리자 페이지 담당 1명)',
    contribution: '90% (관리자 페이지를 제외한 모든 기능 구현)',
    description: `
    데모 버전으로 공개된, 이전 회사에서 진행한 프로젝트들을 모아 봤습니다. PDF를 웹에서 실시간으로 수정하는 뷰어 솔루션의 프론트엔드 기능 개발과 유지보수를 맡았습니다. 버그 수정이나 이슈 해결처럼 자잘한 작업은 빼고, 핵심적으로 참여한 것은 <strong>우클릭 커스텀 기능, 비가시 추적코드 추가, 다크모드 기능, 모바일 스크린 리더</strong>입니다.<h3>1. 우클릭 커스텀 기능</h3>
    문서에서 마우스 우클릭을 하면 컨텍스트 메뉴가 나타나고, 관리자 페이지에서 넣고 싶은 기능을 골라 <strong>나만의 컨텍스트 메뉴</strong>를 만들도록 구현했습니다. 자주 쓰는 기능을 메뉴에 올려 두니 손이 덜 가고 인터페이스도 더 직관적이 됐습니다.<h3>2. 비가시 추적코드</h3>
    문서 보안을 위해 PDF에 <strong>보이지 않는 워터마크를 삽입</strong>해 원본과 열람 정보를 추적하는 기능을 구현했습니다. 실제 인쇄된 문서에도 남는 기술이라, 문서를 인쇄한 뒤 전용 앱으로 추적코드의 인식 정확도를 테스트했고 그 과정에서 이미지 해상도와 인쇄 DPI 개념을 익혔습니다.<h3>3. 다크모드</h3>
    접근성과 편의를 생각해 다크모드를 구현했습니다. SCSS로 사용자의 선호에 따라 <strong>다크모드와 라이트모드를 전환</strong>하도록 설계하였습니다.<h3>4. 모바일 스크린 리더</h3>
    안드로이드의 TalkBack, IOS의 VoiceOver 모바일 스크린 리더가 PDF의 내용을 읽을 수 있도록 <strong>웹 접근성(Web Accessibility)</strong>을 향상시켰습니다.`,
  },
  {
    title: 'Movie Search',
    slug: 'movie-search',
    summary: '영화를 찾아보고 한 줄 리뷰를 남기고 개봉 알림도 받는 사이트',
    highlight: 'Redux Saga의 장황함에 지쳐 Redux Toolkit으로 옮겼더니 코드가 절반으로 줄었습니다.',
    role: '단독 개발',
    tags: ['사이드', 'React', 'Redux', 'TypeScript', 'Express'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/movie-search/home_picture.png',
        alt: 'MovieTalk 홈 화면. 가운데 영화 검색창이 있고 아래로 인기작·현재 상영작·개봉 예정작 포스터가 세 줄로 나열되어 있다',
      },
      { type: 'animation', src: '/images/movie-search/home.mp4', alt: '홈에서 인기작·상영작 목록을 무한스크롤로 넘겨 보는 화면' },
      { type: 'animation', src: '/images/movie-search/search.mp4', alt: '영화 제목을 입력해 검색 결과를 받아오는 화면' },
      { type: 'animation', src: '/images/movie-search/detail_page.mp4', alt: '영화 상세 화면에서 정보와 한 줄 리뷰를 확인하고 좋아요를 누르는 모습' },
      { type: 'animation', src: '/images/movie-search/alarm.mp4', alt: '개봉 예정작에 알림을 설정하는 화면' },
      { type: 'image', src: '/images/movie-search/mail.png', alt: '개봉 알림으로 발송된 안내 메일' },
      { type: 'animation', src: '/images/movie-search/profile.mp4', alt: '프로필 이미지를 올려 계정 정보를 수정하는 화면' },
    ],
    features: '영화 검색, 최신 인기작 & 현재 상영작 & 개봉 예정작 조회, 특정 영화의 상세 정보 조회, 한 줄 리뷰 달기(+좋아요 기능), 개봉 예정작 알림 설정, 네이버 블로그 글 Fetch, 유튜브 영상 Fetch, 이메일 인증, 무한스크롤 등',
    stack: 'React, Redux Toolkit, TypeScript, (Next.js), Express, MongoDB, AWS S3',
    github: 'https://github.com/backbone94/nextProject',
    duration: '2022.03.15–2022.03.31',
    teamSize: '1명',
    contribution: '100%',
    description: `Blog를 만든 경험을 살려, 제가 좋아하는 영화로 프로젝트를 만들어 봤습니다. 좋아하는 분야를 다뤄서인지 Blog 때보다 훨씬 재미있게 했습니다.<h3>기술 선택</h3>
    컴포넌트를 재사용해 유지보수를 쉽게 하려고 <strong>React</strong>로 개발했고, JavaScript의 타입 문제를 메워 줄 <strong>TypeScript</strong>를 얹었습니다. 서버와의 비동기 통신은 <strong>Redux Toolkit</strong>으로 처리했고 프로필 이미지는 <strong>AWS의 S3</strong>에 올리도록 만들었습니다.<br><br>
    이 프로젝트에서는 Next.js를 왜 쓰는지도 모른 채 무작정 써 봤지만, 폴더 구조만으로 되는 편리한 <strong>페이지 라우팅</strong>만큼은 눈에 띄었습니다.<h3>Redux Saga에서 Toolkit으로</h3>
    Blog 프로젝트에서 Redux Saga의 난잡함을 겪은 뒤 Redux Toolkit을 알게 되었는데, Saga의 장황한 코드와 복잡성이 Toolkit에서는 두 배는 줄었다고 체감했습니다.<h3>저장소를 날린 이야기</h3>
    P.S. 지금 이 프로젝트의 Repository는 사라진 상태입니다. 언제였는지는 특정할 수 없지만 이름만 보고 연습용이라고 착각해 지웠던 것 같습니다. 이름 짓기가 왜 중요한지 그때 다시 느꼈습니다.`,
  },
  {
    title: 'Blog',
    slug: 'blog',
    summary: '카테고리와 댓글, 다크모드까지 붙여 본 첫 CRUD 웹사이트',
    highlight: '처음으로 React SPA를 만들고 EC2에 직접 배포까지 해봤습니다.',
    role: '단독 개발',
    tags: ['사이드', 'React', 'Redux', 'Express', 'AWS'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/blog/home.png',
        alt: '블로그 홈 화면. 상단에 Home·Language·Framework 카테고리와 검색·프로필이 있고 본문에 유튜브 영상이 embed되어 있다',
      },
      { type: 'animation', src: '/images/blog/darkmode.mp4', alt: '우측 상단 아이콘으로 다크모드와 라이트모드를 전환하는 화면' },
      { type: 'animation', src: '/images/blog/category.mp4', alt: '새 카테고리를 추가하고 상단 메뉴에 반영되는 화면' },
      { type: 'animation', src: '/images/blog/folder.mp4', alt: '카테고리 아래에 폴더를 만들어 글을 분류하는 화면' },
      { type: 'animation', src: '/images/blog/post.mp4', alt: 'CKEditor로 글을 작성해 발행하는 화면' },
      { type: 'image', src: '/images/blog/comment.png', alt: '글 하단에 달린 댓글 목록' },
      { type: 'image', src: '/images/blog/profile.png', alt: 'S3에 업로드한 이미지로 프로필을 설정한 화면' },
      { type: 'animation', src: '/images/blog/mobile.mp4', alt: '같은 블로그를 모바일 폭에서 열어 반응형으로 배치가 바뀌는 화면' },
    ],
    features: '카테고리 및 폴더 생성, 글쓰기 및 댓글 달기, S3 이미지 업로드, 반응형 웹(모바일), 다크모드 등',
    stack: 'React, Redux Saga, Express, MongoDB, AWS EC2 & S3',
    github: 'https://github.com/backbone94/blog',
    duration: '2022.02.11–2022.03.14',
    teamSize: '1명',
    contribution: '100%',
    description: `Blog는 저의 첫 CRUD 웹사이트 프로젝트입니다. 개발자라면 자신만의 기록 공간이 필수적으로 있어야 한다고 생각했기 때문에 첫 번째 프로젝트로 블로그를 만들어 보았습니다.<h3>무엇으로 만들었나</h3>
    여기서 첫 <strong>React</strong> SPA 사이트를 만들었고, 서버와의 비동기 통신에는 <strong>Redux Saga</strong>를 썼습니다. 글쓰기는 텍스트 에디터 중 하나인 CKEditor로 구현하였습니다. 프로필 이미지는 <strong>AWS의 S3</strong>에 올리도록 만들었고 <strong>AWS EC2 인스턴스</strong>로 실제 배포 단계까지 밟아 봤습니다.<h3>Redux Saga에서 겪은 좌절</h3>
    Redux Saga는 <strong>러닝커브</strong>를 각오하고 시작했지만, 개발하는 내내 반복되고 장황한 코드 패턴과 생소한 generator 함수에 좌절했던 기억이 있습니다. 지금 돌아보면 이 정도 규모에 Redux Saga를 쓴 것 자체가 비효율이었지만, 덕분에 <strong>비동기 통신</strong> 개념은 확실히 잡았습니다.<h3>JS의 매력</h3>
    프론트엔드 개발자가 목표였지만, Node.js 환경에서 백엔드를 다뤄 보니 JavaScript의 매력을 새삼 느꼈습니다.<br>
    아직 미흡한 점이 많아, 나중에 실제 제 블로그로 쓸 수 있도록 코드를 리팩토링하고 기능을 더할 생각입니다.`,
  },
  {
    title: 'RC Car',
    slug: 'rc-car',
    summary: '휴대폰으로 조종하고 초음파 센서로 자율주행을 하는 아두이노 RC카',
    highlight: '웹 개발자로 진로를 정하기 전에 납땜과 회로, 그리고 프로그래밍을 처음으로 하게 된 계기의 프로젝트입니다.',
    role: '단독 개발',
    tags: ['기타', 'Arduino', 'Android'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/car/car_2.jpg',
        alt: '조립을 마친 아두이노 RC카. 나무 섀시에 노란 바퀴 네 개와 아두이노 보드, 건전지 팩, 배선이 얹혀 있다',
      },
      { type: 'image', src: '/images/car/car_3.jpg', alt: '같은 RC카를 다른 각도에서 찍은 사진' },
      { type: 'video', src: '/videos/car.mp4', alt: '휴대폰 앱으로 RC카의 방향을 조종하는 영상' },
      { type: 'video', src: '/videos/auto_car.mp4', alt: '초음파 센서로 장애물을 피하며 스스로 주행하는 영상' },
    ],
    features: '앱으로 RC 카 조종, 자율 주행 등',
    stack: '시스템 프로그래밍, Arduino 회로 조립, Android Studio App 개발',
    github: 'https://github.com/backbone94/arduino',
    duration: '2022.02–2022.03',
    teamSize: '1명',
    contribution: '100%',
    description: `본격적으로 웹 개발자가 되기로 결정하기 전에 진행한 프로젝트입니다. 웹 개발과는 무관하지만 복잡했던 회로 조립, 학교에서 배우지 않았던 납땜질과 아두이노 시스템 프로그래밍은 개인적으로 값진 경험이었습니다.<h3>앱으로 조종하고 혼자 달리게</h3>
    Android Studio로 RC카와 <strong>블루투스 통신</strong>을 하는 안드로이드 앱을 개발하였습니다. 앱으로 RC카를 직접 조종할 수도 있고, 앞부분에 달린 <strong>초음파 센서</strong>로 스스로 달리는 <strong>자율 주행 기능</strong>도 넣었습니다.<h3>아두이노를 고른 이유</h3>
    라즈베리 파이는 RAM과 GPU를 갖춰 훨씬 복잡한 일을 할 수 있지만, 제가 하려던 건 그보다 간단한 작업이라 아두이노를 골랐습니다. 다음에 기회가 되면 라즈베리 파이에 소형 카메라를 달아 더 고도화된 자율 주행을 만들어 보고 싶습니다.`,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/**
 * "○○ 프로젝트는 {소개}입니다" 문장에 넣을 소개. 소개가 "…리뉴얼 프로젝트"처럼 끝나면
 * "프로젝트는 … 프로젝트입니다"로 겹치므로 끝의 "프로젝트"를 뗀다.
 */
export function summaryPhrase(project: Project) {
  return project.summary.replace(/\s*프로젝트$/, '');
}

/** 각 프로젝트 tags 배열의 첫 항목으로 쓰이는 유형. "프로젝트 전부" 답이 이 순서로 건수를 센다. */
export const PROJECT_TYPES = ['실무', '졸업작품', '사이드', '기타'] as const;

/**
 * 스킬 하나가 실제로 등장하는 프로젝트를 찾는다. tags뿐 아니라 stack
 * 자유텍스트("nginx, Docker, GitHub Actions")도 뒤진다 — Docker·nginx·
 * GitHub Actions·OpenAI·Perplexity는 tags 배열에 없고 stack에만 있어서다.
 * 단어 경계(\b)로 끊어야 "Java"가 "JavaScript"에 오탐하지 않는다.
 */
export function getProjectsForSkill(skill: string) {
  const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return projects.filter(
    (project) => pattern.test(project.tags.join(' ')) || pattern.test(project.stack)
  );
}
