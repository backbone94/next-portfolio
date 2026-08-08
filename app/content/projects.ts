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
    title: '더원서울안과 홈페이지 리뉴얼',
    slug: 'the1seoul',
    summary: '안과 홈페이지의 SEO 강화를 위한 리뉴얼 프로젝트',
    highlight: '서버 이관을 처음으로 경험하게 된 값진 프로젝트였습니다.',
    // 아래 둘은 저장소 커밋에서 뽑았다. 참여 기간(2026.07.21—08.01) 커밋 169건 중
    // 72건으로 기여자 중 1위였고, 그 43%를 40%로 내려 적었다. 커밋 수가 곧 기여는
    // 아니므로 본인 확인 후 고칠 것.
    role: '백엔드 개발 및 인프라 구축',
    teamSize: '8명',
    contribution: '40% (소셜 로그인, 프론트엔드 ↔ 백엔드 API 연결, 레거시 → 리뉴얼 파일/DB 이관, SSL 인증서 발급, AWS 인프라 구축)',
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
    duration: '2026.07—2026.08',
    description: `와커스에 이직 후 처음으로 맡은 <strong>홈페이지 전면 리뉴얼 프로젝트</strong>입니다. 지금 <a href="https://the1seoul.com" target="_blank">the1seoul.com</a>에서 운영 중이며, 아래는 그중 제가 맡은 부분입니다.<h3>백엔드 API를 프론트엔드와 연동</h3>
    제가 프로젝트에 투입되기 전에는 사이트에서 보이고 있던 모든 값들이 코드상에 하드코딩되어 있었습니다. 하드코딩을 모두 걷어내고, 팀원이 이미 구현해두었던 <strong>백엔드 API를 프론트엔드와 연동하였습니다.</strong><br>
    <h3>회원 인증을 처음부터 끝까지</h3>
    회원가입 · 로그인 · 아이디/비밀번호 찾기 · 마이페이지 · 회원탈퇴에 이르는 <strong>인증 흐름 전반을 맡았고</strong> 네이버와 카카오 소셜 로그인까지 구현하였습니다.<br><br>
    비밀번호 찾기는 원래 임시 비밀번호를 메일로 보내는 방식이었습니다. 하지만 사용자 입장에서 임시 비밀번호를 메일함에서 확인하고, 다시 사이트로 돌아와 로그인 후 비밀번호를 변경해야 한다는 번거로움이 있었습니다. <strong>사용자 경험은 사이트 개발에 있어서 무엇보다 가장 중요한 부분이라고 생각합니다.</strong> 따라서 본인 확인 후 비밀번호를 즉시 재설정하는 방식으로 바꿔 임시 비밀번호에 의한 비밀번호 찾기 과정의 번거로운 구간을 없앴습니다.<h3>공개된 사이트라서 더 신경 쓴 것</h3>
    병원 홈페이지는 누구나 들어올 수 있고 데이터에는 환자의 정보들이 섞여 있습니다. 기능을 붙이면서 허술해 보이는 부분들을 견고히 하기 위해 노력하였습니다.<br><br>
    기존에는 존재하지 않는 아이디로 로그인 시도를 할 때, "존재하지 않는 아이디입니다."와 같이 경고 문구가 보이고 있었습니다. 이와 같은 문구는 <strong>공격자의 아이디 무차별 대입</strong>으로, 어떤 아이디가 존재하거나 존재하지 않는지 알아낼 수 있는 보안상의 허점이었습니다. 따라서 로그인 시도에는 횟수 제한을 걸어 무차별 대입을 어렵게 했습니다. 또한 관리자 화면과 게시판 대시보드에서 <strong>접근 제어가 아예 빠진 경로</strong>들을 찾아서 아무나 접근하지 못하도록 보안에 신경을 썼습니다. 또한 파일을 업로드할 수 있는 기능이 존재하였는데, 파일의 크기가 어떻든 항상 업로드가 가능했던 문제가 있었습니다. 이는 파일이 업로드되는 동안 사용자에게 아무런 응답이 가지 않는 문제의 원인이었습니다. 따라서 <strong>파일의 업로드 크기를 제한</strong>하여 사용자 경험을 개선하였습니다.<h3>캡차를 활용한 웹 접근성 향상</h3>
    아이디 · 비밀번호 찾기에는 캡차가 있는데, 눈으로 읽어야만 통과할 수 있었습니다. 하지만 안과 홈페이지에서 시력이 나쁜 사람이 계정을 못 찾는 상황이 될 수 있어 캡차의 <strong>음성 듣기</strong> 기능을 추가하여 접근성을 향상시켰습니다.<br><br>
    이전 회사인 이파피루스에서 PDF 뷰어에 스크린리더 대응을 넣었던 웹 접근성 향상 경험이 여기서 다시 쓰였습니다. 접근성은 기능을 다 만든 뒤 덧붙이는 부가 기능이 아니라, 사용자 모두를 위해서 꼭 필요한 부분이라고 생각합니다.<h3>옛 서버에서 새 서버로 옮기기</h3>
    리뉴얼은 코드를 새로 쓰는 것으로 끝나지 않았으며 실제로 운영 중인 사이트의 <strong>인프라를 옮기는 일</strong>까지 맡았습니다.<br><br>
    새 서버는 Nginx · 프론트엔드(사용자 · 관리자 화면) · 백엔드 · Redis를 각각 컨테이너로 분리하고, <strong>Docker Compose</strong>로 정의한 전용 브리지 네트워크에 묶어 Nginx가 컨테이너 이름으로 각 서비스에 라우팅하도록 리버스 프록시를 구성했습니다. 블루-그린 배포로 새 컨테이너를 띄울 때도 같은 네트워크에 붙이기만 하면 됐고, 이 구조 위에서 <strong>무중단 배포</strong>도 자연스럽게 붙일 수 있었습니다. Kubernetes와 같은 인프라를 선택하기엔 리뉴얼 프로젝트의 스케일이 단일 서버에 머물렀기 때문에 <strong>오버엔지니어링을 피하기 위해</strong> AWS의 Lightsail 서비스를 선택하였습니다.<br><br>
    게시판 글과 팝업 이미지는 레거시 서버에 쌓여 있었습니다. 업로드 파일 또한 레거시 서버의 컨테이너 볼륨에 존재하고 있었던 상태라 그 파일들을 레거시 서버에 그대로 두면 리뉴얼 홈페이지에서는 글은 보이는데 이미지만 찾지 못하는 상황이었습니다. 레거시 서버의 데이터와 실제 파일들을 새 서버의 DB와 도커 볼륨으로 옮기는 <strong>DB/파일 이관</strong> 과정까지 담당하였습니다.<br><br>
    SSL 인증서는 <strong>Let's Encrypt 인증 기관</strong>을 통해 발급받은 뒤 만료 전에 스스로 갱신되도록 스크립트를 만들어 두었습니다. SSL 인증서 발급 과정은 작업의 순서가 중요하였습니다. 인증서를 미리 준비해 두지 않고 도메인부터 넘기면 그 사이 방문자는 HTTPS에 대한 보안 경고 화면을 보게 됩니다. DB/파일 이관, 그리고 SSL 인증서 작업에서 <strong>되돌리기 어려운 일일수록 먼저 확인하고 진행해야 한다는 점을 배웠습니다.</strong><h3>검색 결과에 병원을 정확히 알리기</h3>
    검색엔진은 페이지를 읽어도 어디가 병원 이름이고 어디가 주소인지 스스로 알지 못합니다. 병원 정보 · 진료 페이지 탐색경로 · 질환 정보 콘텐츠에 <strong>구조화 데이터(JSON-LD)</strong>를 붙여 이를 명시하였습니다.<br><br>
    질환 정보 페이지에는 저자 표시가 필요했는데, 개별 의료진이 건별로 검수했다는 근거가 없는 상태에서 "OOO 원장 감수"처럼 특정인을 지목하면 허위 표시가 됩니다. 대신 <strong>병원이라는 기관 단위</strong>로 저작 주체를 명시하여 사실과 다른 신호를 보내지 않도록 하였습니다.<br><br>
    관리자가 이 정보를 직접 다루는 SEO 설정 화면도 정비하였습니다. 화면 두 개에 걸쳐 있던 SEO 관련 설정을 한 곳으로 모으고, 실제로는 적용되지 않던 입력칸(코드가 참조하지 않거나 보안 위험이 있어 백엔드가 의도적으로 무시하던 값)을 걷어냈습니다. 정리 도중 <strong>일본어·중국어 SEO 설정이 실제 사이트가 쓰는 언어 코드와 달라</strong> 등록해도 반영되지 않던 버그도 함께 발견하여 수정하였습니다.`,
  },
  {
    title: '슬기로운 아이티센 생활 | 셔틀 서비스',
    slug: 'shuttle',
    summary: '셔틀이 지금 어디쯤인지 확인하고 QR로 탑승하는 사내 모바일 서비스',
    highlight: '신입 교육 11개 팀 가운데 유일하게 본사 상용화 검토까지 갔습니다',
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
    duration: '2025.05—2025.06',
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
    highlight: '좌표 변환이 자꾸 어긋나길래 EPSG:3857과 4326의 차이를 공부해 직접 풀었습니다',
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
    duration: '2024.07.09—2024.08.21',
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
    summary: '그날 쓴 일기를 읽고 어울리는 음악을 골라 주는 웹 서비스',
    highlight: 'CLOVA로는 감정이 세 단계밖에 안 나와 OpenAI로 갈아탔고, 호출당 0.15달러라 상업화는 어렵다고 봤습니다',
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
    duration: '2024.08.21—2024.09.05',
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
    summary: '한 번 모이고 끝나는 모임을 3D 증표로 남겨 두는 서비스',
    highlight: '프론트엔드만 하던 사람이 백엔드를 맡아 JWT와 Redis Refresh Token으로 인증을 설계했습니다',
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
    duration: '2024.03—2024.06',
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
    summary: '이파피루스의 상용 웹 PDF 뷰어입니다. 비가시 워터마크와 다크모드, 스크린리더 대응을 맡았습니다',
    highlight: '인쇄해도 남는 눈에 안 보이는 추적코드를 만들면서 DPI와 해상도를 제대로 익혔습니다',
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
    duration: '2022.04.13—2023.12.15',
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
    title: "Jun's Portfolio (Original)",
    slug: 'portfolio-original',
    summary: 'HTML/CSS/JS만으로 만든 첫 포트폴리오 사이트',
    highlight: '모바일에서 디자인이 깨지는 걸 보고 프레임워크가 왜 필요한지 알게 됐습니다',
    role: '단독 개발',
    tags: ['사이드', 'HTML/CSS/JS'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/portfolio/portfolio.png',
        alt: '첫 포트폴리오 사이트의 SKILL 섹션. HTML·CSS·JavaScript·TypeScript·NodeJs·React·Redux·MongoDB 아이콘이 두 줄로 놓여 있다',
      },
    ],
    features: '포트폴리오 사이트',
    stack: 'HTML, CSS, JavaScript',
    github: 'https://github.com/backbone94/portfolio',
    duration: '2022.03.13—2022.03.31',
    teamSize: '1명',
    contribution: '100%',
    description: `저의 첫 번째 <strong>포트폴리오 사이트</strong> 프로젝트입니다.<h3>왜 리뉴얼하게 됐나</h3>
    간단하고 심플한 포트폴리오를 만드는 게 목표였기 때문에 기본적인 웹 기술인 <strong>HTML, CSS, JavaScript</strong>만으로 만들었습니다.<br>
    그러나 반응형 디자인이 충분하지 않아 <strong>모바일 환경에서 디자인이 깨지는 문제</strong>가 있었습니다. 프레임워크 없이 개발하는 것의 한계를 여기서 느꼈고, 반응형과 유지보수를 생각해 리뉴얼을 결심했습니다.`,
  },
  {
    title: "Jun's Portfolio (Next.js)",
    slug: 'portfolio-nextjs',
    summary: '지금 보고 계신 이 사이트. Next.js와 Tailwind로 리뉴얼했습니다',
    highlight: '반응형과 SEO를 생각해 App Router로 다시 만들었습니다',
    role: '단독 개발',
    tags: ['사이드', 'Next.js', 'Tailwind'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/portfolio/portfolio_nextjs.png',
        alt: '리뉴얼한 포트폴리오의 SKILL 섹션. 기술 아이콘이 카드 그리드로 놓이고 아래에 각 기술로 무엇을 할 수 있는지 설명이 붙어 있다',
      },
      {
        type: 'image',
        src: '/images/portfolio/portfolio_nextjs_mobile.png',
        alt: '같은 화면의 모바일 레이아웃. 좁은 폭에 맞춰 카드가 다시 배치된 모습',
      },
    ],
    features: '포트폴리오 사이트 리뉴얼',
    stack: 'Next.js, Tailwind CSS',
    github: 'https://github.com/backbone94/next-portfolio',
    duration: '2024.09.05—',
    teamSize: '1명',
    contribution: '100%',
    description: `첫 번째 포트폴리오 사이트를 새롭게 개편한 <strong>리뉴얼 포트폴리오</strong> 프로젝트입니다.<h3>Next.js를 고른 이유</h3>
    리뉴얼한 사이트는 간단한 페이지라 특별한 프레임워크가 필요하지는 않았지만, 앞으로의 확장과 유지보수, SEO 최적화를 생각하면 <strong>Next.js</strong>가 낫겠다고 판단하였습니다.<br>
    컴포넌트 스타일을 손쉽게 손볼 수 있는 Tailwind CSS로 첫 포트폴리오에서 문제였던 <strong>반응형 디자인</strong>을 해결해, 모바일에서도 깨지지 않는 일관된 화면으로 만들었습니다.<br>
    Next.js로 개발한 만큼 배포는 <strong>Vercel</strong>로 간단히 끝냈습니다.<h3>남은 것</h3>
    이번 리뉴얼에서 반응형 웹 디자인이 왜 중요한지 몸으로 알았고, 사용자 경험을 고려한 개발이 어떤 것인지도 감을 잡았습니다. 이 포트폴리오는 새로운 정보와 프로젝트로 계속 채워 나갈 생각입니다.`,
  },
  {
    title: 'Movie Search',
    slug: 'movie-search',
    summary: '영화를 찾아보고 한 줄 리뷰를 남기고 개봉 알림도 받는 사이트',
    highlight: 'Redux Saga의 장황함에 지쳐 Redux Toolkit으로 옮겼더니 코드가 절반으로 줄었습니다',
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
    duration: '2022.03.15—2022.03.31',
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
    highlight: '처음으로 React SPA를 만들고 EC2에 직접 배포까지 해봤습니다',
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
    duration: '2022.02.11—2022.03.14',
    teamSize: '1명',
    contribution: '100%',
    description: `Blog는 저의 첫 CRUD 웹사이트 프로젝트입니다. 개발자라면 자신만의 기록 공간이 필수적으로 있어야 한다고 생각했기 때문에 첫 번째 프로젝트로 블로그를 만들어 보았습니다.<h3>무엇으로 만들었나</h3>
    여기서 첫 <strong>React</strong> SPA 사이트를 만들었고, 서버와의 비동기 통신에는 <strong>Redux Saga</strong>를 썼습니다. 글쓰기는 텍스트 에디터 중 하나인 CKEditor로 구현하였습니다. 프로필 이미지는 <strong>AWS의 S3</strong>에 올리도록 만들었고 <strong>AWS EC2 인스턴스</strong>로 실제 배포 단계까지 밟아 봤습니다.<h3>Redux Saga에서 겪은 좌절</h3>
    Redux Saga는 <strong>러닝커브</strong>를 각오하고 시작했지만, 개발하는 내내 반복되고 장황한 코드 패턴과 생소한 generator 함수에 좌절했던 기억이 있습니다. 지금 돌아보면 이 정도 규모에 Redux Saga를 쓴 것 자체가 비효율이었지만, 덕분에 <strong>비동기 통신</strong> 개념은 확실히 잡았습니다.<h3>백엔드를 처음 만져 보고</h3>
    프론트엔드 개발자가 목표였지만, Node.js 환경에서 백엔드를 다뤄 보니 JavaScript의 매력을 새삼 느꼈습니다.<br>
    아직 미흡한 점이 많아, 나중에 실제 제 블로그로 쓸 수 있도록 코드를 리팩토링하고 기능을 더할 생각입니다.`,
  },
  {
    title: 'RC Car',
    slug: 'rc-car',
    summary: '휴대폰으로 조종하고 초음파 센서로 혼자 달리는 아두이노 RC카',
    highlight: '웹으로 방향을 정하기 전에 납땜과 회로를 직접 만져 본 프로젝트입니다',
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
    duration: '2022.02—2022.03',
    teamSize: '1명',
    contribution: '100%',
    description: `본격적으로 웹 개발자가 되기로 결정하기 전에 진행한 프로젝트입니다. 웹 개발과는 무관하지만 복잡했던 회로 조립, 학교에서 배우지 않았던 납땜질과 아두이노 시스템 프로그래밍은 개인적으로 값진 경험이었습니다.<h3>앱으로 조종하고 혼자 달리게</h3>
    Android Studio로 RC카와 <strong>블루투스 통신</strong>을 하는 안드로이드 앱을 개발하였습니다. 앱으로 RC카를 직접 조종할 수도 있고, 앞부분에 달린 <strong>초음파 센서</strong>로 스스로 달리는 <strong>자율 주행 기능</strong>도 넣었습니다.<h3>아두이노를 고른 이유</h3>
    라즈베리 파이는 RAM과 GPU를 갖춰 훨씬 복잡한 일을 할 수 있지만, 제가 하려던 건 그보다 간단한 작업이라 아두이노를 골랐습니다. 다음에 기회가 되면 라즈베리 파이에 소형 카메라를 달아 더 고도화된 자율 주행을 만들어 보고 싶습니다.`,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** 각 프로젝트 tags 배열의 첫 항목으로 쓰이는 유형. 필터에서 항상 먼저 노출된다. */
export const PROJECT_TYPES = ['실무', '졸업작품', '사이드', '기타'] as const;

/**
 * 필터 칩 목록. 유형을 먼저 놓고, 기술 태그는 2개 이상의 프로젝트에
 * 등장하는 것만 남긴다. 하나짜리 태그까지 모두 노출하면 칩이 26개가 되어
 * 필터가 오히려 훑기 어려워지기 때문이다.
 */
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

export function getFilterTags() {
  const counts = new Map<string, number>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  const types = PROJECT_TYPES.filter((type) => counts.has(type));
  const techTags = Array.from(counts.entries())
    .filter(([tag, count]) => count >= 2 && !PROJECT_TYPES.includes(tag as never))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);

  return [...types, ...techTags];
}
