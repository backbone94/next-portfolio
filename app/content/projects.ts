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
    summary: '기존 상담과 게시글을 옮기고 해외 예약을 직접 받도록 개편한 병원 홈페이지',
    highlight: '기존 데이터를 옮기고 배포 절차를 네 차례 검증한 뒤, 11월 18일 새 홈페이지를 열었습니다.',
    role: '백엔드 개발, 데이터 이관, AWS 운영 환경 구축과 도메인 전환',
    tags: ['실무', 'Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/bgneye-jamsil/overview.png',
        alt: '밝은눈안과 잠실점 홈페이지 첫 화면',
      },
    ],
    features: '온라인 상담, 해외 예약, 다국어 페이지, 관리자 화면, 접수 확인 메일',
    stack: 'Next.js, React, NestJS, Prisma, PostgreSQL, Nginx, Docker Compose, GitHub Actions, AWS Lightsail',
    reference: 'https://www.bgneye.com/',
    duration: '2026.09–2026.11',
    teamSize: '5명',
    contribution: '약 60% (백엔드 개발, 기존 데이터 이관, 관리자 페이지 개선, 해외 예약 연동, AWS 운영 환경 구축과 도메인 전환)',
    description: `PHP로 운영하던 밝은눈안과 잠실점 홈페이지를 개편했습니다. 저는 <strong>백엔드와 관리자 기능을 개발하고, 데이터 이관부터 AWS 운영 환경 구축과 오픈까지</strong> 맡았습니다.
    <h3>회원, 상담, 게시글과 첨부 파일 이관</h3>
    기존 데이터를 새 DB 구조에 맞춰 옮기는 스크립트를 작성했습니다. 이관 뒤에는 두 DB의 건수를 비교하고, 게시글에 연결된 첨부 파일이 실제로 존재하는지 확인했습니다. 상담 처리 상태와 담당자 메모도 옮겨 새 관리자 화면에서 기존 상담을 이어서 처리할 수 있게 했습니다.
    <h3>홈페이지에서 해외 예약 접수</h3>
    외부 서비스가 받던 해외 예약을 홈페이지에서 직접 받도록 옮겼습니다. 기존 문진 항목을 신청서에 옮기고, 직원이 관리자 화면의 온라인 예약 목록에서 접수 내역을 확인할 수 있게 했습니다. 신청이 들어오면 예약자와 병원 양쪽에 확인 메일을 보냅니다.
    <h3>AWS 운영 환경과 배포 구성</h3>
    AWS Lightsail에 스테이징 환경과 운영 서버 두 대를 구성했습니다. 로드밸런서 뒤의 각 서버는 Docker Compose로 홈페이지, 관리자 화면, API를 실행하고, Nginx가 요청을 각 서비스로 보냅니다. 어느 서버에 접속해도 같은 데이터를 읽을 수 있도록 관리형 PostgreSQL과 비공개 스토리지 버킷을 공유하게 했습니다.<br><br>
    GitHub Actions로 <strong>블루/그린 배포</strong>를 구성했습니다. 운영 서버를 한 대씩 업데이트하고, 각 서버에서 새 컨테이너의 헬스체크가 통과하면 Nginx가 요청을 새 컨테이너로 보냅니다.
    <h3>오픈을 앞두고 네 차례 리허설</h3>
    AWS 운영 환경에서 배포와 이관 절차를 네 차례 검증했습니다. DNS 관리를 아이네임즈에서 Lightsail로 옮기고, 로드밸런서에 HTTPS 인증서를 연결했습니다. 전환 전 DB와 서버의 스냅샷을 남기는 순서와 문제가 생겼을 때 DNS를 되돌리는 절차도 정리했습니다. 기존 링크가 새 주소로 이어지도록 리다이렉트를 설정했고, 오픈 뒤에는 404 로그를 확인해 빠진 주소를 추가했습니다.`,
  },
  {
    title: '더원서울안과 홈페이지 리뉴얼',
    slug: 'the1seoul',
    summary: '회원 인증, 관리자 화면, 서버 이전, 검색 설정을 개선한 병원 홈페이지',
    highlight: '회원 인증을 개편하고, 운영 중이던 DB와 첨부 파일을 AWS의 새 서버로 옮겼습니다.',
    // 아래 둘은 저장소 커밋에서 뽑았다. 참여 기간(2026.07.21—08.01) 커밋 169건 중
    // 72건으로 기여자 중 1위였고, 그 43%를 40%로 내려 적었다. 커밋 수가 곧 기여는
    // 아니므로 본인 확인 후 고칠 것.
    role: '백엔드 개발과 운영 환경 구축',
    teamSize: '8명',
    contribution: '40% (소셜 로그인, 사용자 화면과 API 연결, 기존 DB와 첨부 파일 이관, SSL 인증서 발급, AWS 인프라 구축, SEO 강화)',
    tags: ['실무', 'Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS'],
    media: [
      {
        type: 'image',
        src: '/images/the1seoul/overview.jpg',
        alt: '더원서울안과 홈페이지 첫 화면',
      },
    ],
    featured: true,
    features: '온라인 예약, 소셜 로그인, 통합 검색, 병원 소식과 공지사항, 의료진 소개',
    stack: 'Next.js, React, NestJS, Prisma, PostgreSQL, Nginx, Docker, GitHub Actions, AWS Lightsail',
    reference: 'https://the1seoul.com',
    duration: '2026.07–2026.08',
    description: `와커스에 입사해 처음 맡은 홈페이지 리뉴얼입니다. <a href="https://the1seoul.com" target="_blank">the1seoul.com</a>에서 운영 중이며, 저는 <strong>API 연동, 회원 인증, 운영 서버 이관</strong>을 맡았습니다.
    <h3>화면에 실제 운영 데이터 연결</h3>
    화면에 직접 적어 둔 값을 팀원이 개발한 백엔드 API로 대체했습니다. 병원 담당자가 의료진 소개, 학술발표, 유튜브, 메인 팝업을 관리자 화면에서 직접 수정할 수 있도록 연결했습니다.
    <h3>회원가입부터 비밀번호 재설정까지</h3>
    회원가입, 로그인, 계정 찾기, 마이페이지, 회원 탈퇴를 구현하고 네이버와 카카오 소셜 로그인을 연동했습니다. 기존 비밀번호 찾기는 메일에서 임시 비밀번호를 확인하고, 그 비밀번호로 로그인한 뒤 다시 변경해야 했습니다. <strong>본인 확인이 끝나면 바로 새 비밀번호를 정하도록</strong> 바꿨습니다.
    <h3>인증, 접근 권한, 파일 업로드 보완</h3>
    로그인 오류 문구에서 아이디가 등록돼 있는지 드러나던 문제를 고치고, 반복 로그인 시도에 횟수 제한을 뒀습니다. 관리자 화면과 게시판 대시보드에서는 접근 권한을 확인하던 범위를 보완했습니다. 큰 파일의 처리를 기다리는 동안 화면에 응답이 없던 문제에는 업로드 크기 제한을 적용했습니다.
    <h3>계정 찾기에 음성 캡차 추가</h3>
    화면에 표시된 문자를 읽기 어려운 사용자도 계정을 찾을 수 있도록 <strong>캡차에 음성 듣기 기능</strong>을 추가했습니다. 이파피루스에서 PDF 뷰어에 모바일 스크린 리더를 연동했던 경험을 활용했습니다.
    <h3>운영 중인 사이트를 새 서버로 이전</h3>
    Nginx, 사용자 화면과 관리자 화면, 백엔드, Redis를 각각 컨테이너로 띄웠습니다. Docker Compose로 전용 브리지 네트워크를 만들고, Nginx가 컨테이너 이름으로 각 서비스에 요청을 보내도록 구성했습니다. 새 컨테이너도 같은 네트워크에 연결해 블루/그린 방식으로 무중단 배포할 수 있게 했습니다. 단일 서버 규모에 맞춰 AWS Lightsail을 선택했습니다.<br><br>
    게시판 글과 팝업 이미지가 새 사이트에서도 열리도록 기존 DB와 컨테이너 볼륨의 업로드 파일을 함께 옮겼습니다. Let's Encrypt에서 인증서를 발급받고 자동 갱신 스크립트를 작성했습니다. 방문자가 HTTPS 경고를 보지 않도록 인증서를 먼저 준비한 뒤 도메인을 전환했습니다.
    <h3>검색엔진과 운영자가 쓰는 SEO 설정 정리</h3>
    검색엔진이 병원 정보, 진료 페이지의 탐색 경로, 질환 정보를 구분할 수 있게 <strong>구조화 데이터(JSON-LD)</strong>를 추가했습니다. 개별 의료진의 검수 여부를 확인할 수 없었던 질환 정보에는 병원을 저작 주체로 표시했습니다.<br><br>
    두 화면에 나뉘어 있던 SEO 설정을 한곳에 모으고 실제로 반영되지 않던 입력란을 걷어냈습니다. 그 과정에서 일본어와 중국어 설정의 언어 코드가 사이트와 달라 저장한 내용이 반영되지 않던 문제도 고쳤습니다.`,
  },
  {
    title: '슬기로운 아이티센 생활 | 셔틀 서비스',
    slug: 'shuttle',
    summary: '셔틀 위치를 실시간으로 확인하고 QR로 탑승하는 사내 모바일 웹앱',
    highlight: '프론트엔드를 혼자 맡았습니다. 신입 교육 11개 팀 중 유일하게 본사가 상용화를 검토했습니다.',
    role: '프론트엔드 단독 (5인 팀)',
    tags: ['실무', 'React', 'Spring Boot', 'WebSocket', 'AI/LLM', 'PWA'],
    featured: true,
    media: [
      { type: 'image', src: '/images/shuttle/overview.jpg', alt: '셔틀 서비스 홈, 실시간 위치 지도, QR 탑승 인증 화면' },
      { type: 'video', src: '/videos/shuttle.mp4', alt: '셔틀을 예약하고 QR로 탑승을 인증하는 영상' },
    ],
    features: '셔틀 실시간 위치, QR 탑승 인증, 공지, 시간표 관리, 1:1 문의, AI 챗봇',
    stack: 'React, Spring Boot, PostgreSQL, WebSocket, Perplexity, GitHub Actions, AWS EC2, S3',
    github: 'https://github.com/1hajo/Seur-A-Saeng',
    duration: '2025.05–2025.06',
    teamSize: '5명 (프론트엔드 1명, 백엔드 4명)',
    contribution: '40% (프론트엔드 단독 개발, 사용 흐름과 화면 설계)',
    description: `아이티센 신입 교육에서 출퇴근 셔틀을 기다리는 임직원을 위해 만든 서비스입니다. 위치를 알기 어려워 대기가 길어지고 외부인의 무단 탑승을 막기도 어려워, 실시간 위치 조회와 QR 탑승 인증을 중심으로 설계했습니다. 공지와 문의 기능도 함께 넣었습니다.
    <h3>지도에서 셔틀 위치와 혼잡도 확인</h3>
    다섯 명 중 프론트엔드를 혼자 맡아 화면을 설계하고 구현했습니다. 이용자는 지도에서 노선을 고르고 셔틀 위치와 혼잡도를 확인할 수 있습니다. WebSocket으로 받은 위치를 지도에 반영하고, 갱신되는 위치를 따라가기 쉽도록 화면 상태와 렌더링 방식을 다듬었습니다.
    <h3>시간표를 말로 묻는 챗봇</h3>
    Perplexity API를 셔틀 시간표에 연결했습니다. 이용자는 가장 먼저 탈 수 있는 셔틀, 정류장 위치, 소요 시간을 문장으로 물어볼 수 있습니다. 회사와 계열사 정보도 검색하도록 구성했습니다.
    <h3>모바일에서 앱처럼 열기</h3>
    휴대폰으로 이용하는 상황을 고려해 PWA를 제안하고 적용했습니다. 앱 스토어를 거치지 않고 홈 화면에 추가할 수 있도록 설치 안내도 설계했습니다.
    <h3>프론트엔드를 혼자 맡으며 내린 선택</h3>
    Cursor로 반복 코드 작성과 화면 구조를 잡는 시간을 줄여 일정을 맞췄습니다. Runway로 본사 마스코트 애니메이션을 만들어 화면에 넣었습니다. 신입 교육에서 진행한 11개 팀의 프로젝트 중 <strong>이 서비스만 본사 상용화 검토 단계</strong>에 올랐습니다.`,
  },
  {
    title: 'Figma to Map Plugin',
    slug: 'figma-to-map',
    summary: 'Figma 도형을 지도에 배치하고 위도와 경도를 내보내는 플러그인',
    highlight: '지도 위 도형의 위치와 모양을 편집하고, 변환한 좌표를 JSON이나 CSV로 내보내도록 구현했습니다.',
    role: '단독 개발 (인턴)',
    tags: ['실무', 'TypeScript', 'React', 'OpenLayers'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/figma-plugin/main.png',
        alt: '서울시청 일대 지도에 주차장 도면을 돌려 배치한 화면. 위쪽에는 파일 불러오기, 좌표 다운로드, Figma로 보내기, 위치 검색 기능이 있다.',
      },
      { type: 'video', src: '/videos/figma-plugin/import.mp4', alt: 'Figma 레이어를 플러그인으로 불러와 지도에 배치하는 영상' },
      { type: 'video', src: '/videos/figma-plugin/export.mp4', alt: '지도에서 편집한 레이어를 Figma로 다시 보내는 영상' },
      {
        type: 'image',
        src: '/images/figma-plugin/json.png',
        alt: 'JSON 미리보기. 레이어 ID, 이름, 위치, 크기, 도형의 위도와 경도, SVG 데이터가 들어 있다.',
      },
      { type: 'image', src: '/images/figma-plugin/csv.png', alt: '레이어의 위도와 경도를 담은 CSV 미리보기' },
    ],
    features: 'Figma 레이어 불러오기, 도형 이동과 크기 조절, 도형 회전, 레이어 내보내기, 주소 검색',
    stack: 'Figma Plugin API, TypeScript, React, Webpack, MUI, OpenLayers',
    github: '',
    duration: '2024.07.09–2024.08.21',
    teamSize: '1명',
    contribution: '100%',
    description: `베스텔라랩 인턴 때 혼자 개발한 Figma 플러그인입니다. Figma 레이어를 지도에 올려 위치와 모양을 맞춘 뒤, <strong>도형의 위도와 경도를 파일로 저장</strong>할 수 있습니다.
    <h3>플러그인 개발 환경 구성</h3>
    Figma Plugin API <a href="https://www.figma.com/plugin-docs/" target="_blank" class="text-blue-500">공식 문서</a>를 참고해 기본 구조를 만들었습니다. 화면 요소를 재사용하기 위해 React를, 타입을 검사하기 위해 TypeScript를 선택했습니다. Figma 플러그인용 Webpack 설정이 포함된 <a href="https://github.com/hseoy/figma-plugin-react-boilerplate" target="_blank" class="text-blue-500">보일러플레이트</a>로 개발을 시작하고, MUI로 화면 요소의 스타일을 맞췄습니다.
    <h3>도형 편집을 위해 OpenLayers로 전환</h3>
    처음 쓴 Leaflet으로는 지도 위 도형을 옮기고 돌리거나 크기를 바꾸는 데 제약이 있었습니다. 사수와 상의해 OpenLayers로 바꾼 뒤 필요한 편집 기능을 구현했습니다. 지도를 끌어 원하는 위치를 찾는 수고를 줄이려고 OpenStreetMap 기반의 Nominatim을 연결해 주소 검색을 추가했습니다.
    <h3>지도 좌표를 위도와 경도로 변환</h3>
    초기에는 지도에서 편집한 도형의 좌표가 내보낸 파일과 맞지 않았습니다. OpenLayers가 내부에서 쓰는 <strong>EPSG:3857(Web Mercator)</strong>과 위도와 경도를 나타내는 <strong>EPSG:4326(WGS84)</strong>의 차이를 공부해 변환 오류를 해결했습니다.`,
  },
  {
    title: 'Music Diary',
    slug: 'music-diary',
    summary: '일기에 담긴 감정을 정리하고 그날의 내용에 어울리는 음악을 추천하는 웹앱',
    highlight: '자주 나온 단어를 세던 방식에서 일기의 맥락을 읽어 음악을 추천하는 방식으로 바꿨습니다.',
    role: '단독 개발',
    tags: ['사이드', 'Next.js', 'React', 'AI/LLM', 'Prisma'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/music-diary/list.png',
        alt: '제목과 본문 일부가 보이는 일기 목록. 위쪽에 일기 쓰기와 감정 기록을 여는 버튼이 있다.',
      },
      { type: 'video', src: '/videos/diary_new_delete.mp4', alt: '일기를 새로 쓰고 삭제하는 영상' },
      { type: 'video', src: '/videos/diary_detail.mp4', alt: '일기 상세 화면에서 감정 분석 결과와 추천 음악을 보여주는 영상' },
      { type: 'video', src: '/videos/sentiment_history.mp4', alt: '기간별 감정 변화를 그래프로 확인하는 영상' },
    ],
    features: 'GitHub와 카카오 로그인, 일기 쓰기, 음악 추천, 기간별 감정 기록',
    stack: 'React, React Query, Next.js, Tailwind CSS, Prisma, MySQL, Vercel, OpenAI, Naver CLOVA, Youtube',
    github: 'https://github.com/backbone94/music-recommendation',
    duration: '2024.08.21–2024.09.05',
    teamSize: '1명',
    contribution: '100%',
    description: `일기를 쓰면 그날의 내용에 어울리는 곡을 추천하고, 여러 날에 걸친 감정 기록을 정리해 주는 웹앱입니다. 기획부터 개발까지 혼자 맡았습니다.
    <h3>서버와 화면을 Next.js로 개발</h3>
    서버에서 화면을 렌더링하고, 백엔드 서버를 따로 두지 않고도 서버 기능을 작성할 수 있어 Next.js를 선택했습니다. 이미지 최적화도 같은 프레임워크에서 해결할 수 있었습니다. Prisma로 MySQL에 접근하고 NextAuth.js로 소셜 로그인을 연결했습니다. 서버 작업에는 Server Actions를, 화면의 최신 데이터를 가져오는 데는 React Query를 사용했습니다.
    <h3>단어 빈도보다 일기의 맥락으로 추천</h3>
    Naver CLOVA로 감정을 분석했지만 결과는 긍정, 부정, 중립 세 가지였습니다. 일기에 자주 나오는 단어에 가중치를 주고 비슷한 가사의 곡을 찾았더니, 글 전체의 분위기와 어울리지 않는 추천이 나왔습니다. 이후 <strong>OpenAI API로 일기의 맥락을 읽어 곡을 추천하고, 약 일주일 치 일기를 정리</strong>하도록 바꿨습니다. 일주일 치를 정리하는 데 호출당 0.15달러가 넘게 들어, 당시 구현으로는 상용화하기 어렵다고 판단했습니다.
    <h3>모바일 앱 배포 시도</h3>
    Tailwind CSS로 작은 화면에서도 읽을 수 있게 만든 웹앱을 <a href="https://github.com/backbone94/music-recommendation-mobile" target="_blank" class="text-blue-500">React Native WebView</a>로 감싸 앱 배포를 시도했습니다. Google Play 개발자 계정 심사 단계에서 멈췄고, 심사를 마치면 다시 배포를 시도해 보고 싶습니다.`,
  },
  {
    title: '살롱 | SSALON',
    slug: 'ssalon',
    summary: '모임에 참여한 기억을 3D 증표로 꾸며 간직하거나 공유하는 앱',
    highlight: '졸업작품에서 백엔드와 AWS 운영을 맡아 로그인, 실시간 채팅, 증표 이미지 생성을 구현했습니다.',
    role: '백엔드 주도 (5인 팀)',
    tags: ['졸업작품', 'Angular', 'Spring Boot', 'Three.js', 'AWS', 'AI/LLM'],
    featured: true,
    media: [
      {
        type: 'image',
        src: '/images/ssalon/ticket.png',
        alt: '왼쪽에 구글, 카카오, 네이버 로그인 버튼이 있고 오른쪽에는 스티커를 붙인 검은 3D 모임 증표가 있다.',
      },
      {
        type: 'image',
        src: '/images/ssalon/overview.png',
        alt: '시스템 구성도. 사용자, 모임 개최자, 광고주, 관리자가 Angular 사용자 페이지와 React 관리자 페이지로 나뉘어 접속하고, AWS Route53, ELB, EC2 위의 서버가 MySQL, Redis, MongoDB Atlas와 OpenAI 임베딩, 카카오 로그인, 결제 API에 연결된다',
      },
      { type: 'video', src: '/videos/login.mp4', alt: '소셜 계정으로 로그인하는 영상' },
      { type: 'video', src: '/videos/chat.mp4', alt: '모임 참가자끼리 실시간으로 대화하는 영상' },
      { type: 'video', src: '/videos/decoration.mp4', alt: '모임 증표에 스티커를 붙여 꾸미는 영상' },
    ],
    features: '3D 증표 꾸미기, 모임과 카테고리 추천, 참가자 채팅, 참가 인증',
    stack: 'Angular, ThreeJS, Spring, MySQL, Redis, OpenAI, OAuth 2.0',
    github: 'https://github.com/backbone94/ssalon',
    duration: '2024.03–2024.06',
    teamSize: '5명 (프론트엔드 2명, 백엔드 3명)',
    contribution: '60% (백엔드 개발, AWS 클라우드 환경 구축, 채팅 기능, AI 이미지 생성 API, 프론트엔드 보조)',
    description: `아주대학교 소프트웨어학과 졸업작품입니다. 한 번 열린 모임에 참여한 사람도 그날을 기억할 수 있도록, <strong>3D 증표를 만들어 꾸미고 공유</strong>하는 앱을 개발했습니다.
    <h3>백엔드를 맡아 인증 설계</h3>
    프론트엔드 실무 경험을 바탕으로 서버 개발까지 배우고 싶어 백엔드를 맡았습니다. 팀원이 익숙하고 학습 자료가 충분한 Spring을 선택했고, 초기 설정에는 Spring Boot를 활용했습니다. OAuth 2.0으로 카카오 등 소셜 로그인을 연동했습니다. API 인증에는 JWT를 쓰고, 만료된 토큰을 갱신하는 데 필요한 리프레시 토큰은 AWS ElastiCache의 Redis에 저장했습니다.
    <h3>배포 자동화와 테스트에서 배운 점</h3>
    GitHub Actions로 CI/CD를 구성하고 AWS EC2, RDS, ElastiCache를 직접 운영했습니다. 처음에는 모의 객체를 사용한 테스트를 작성해 배포 전에 실행하려 했습니다. 테스트 작성에 시간이 걸려 일정 안에 구현을 끝내는 쪽을 선택했고, 배포 전에 더 많이 검증하지 못한 점이 아쉬웠습니다.
    <h3>팀원이 함께 보는 API 문서</h3>
    API 사용법이 말로 전달되는 과정에서 내용이 달라져 프론트엔드 연동이 막힌 적이 있습니다. 백엔드 팀원들과 상의해 <strong>Swagger로 API 문서</strong>를 만들었고, 프론트엔드 팀원이 문서를 보며 직접 연동할 수 있게 했습니다.
    <h3>실시간 채팅과 증표 이미지 생성</h3>
    WebSocket으로 참가자 간 실시간 채팅을 구현했습니다. 익숙한 HTTP 요청에 비해 오류 메시지에 정보가 적어 원인을 찾는 데 시간이 걸렸습니다. 프로젝트 막바지에는 OpenAI DALL-E 3 API를 연결해, 모임의 성격을 입력하면 그에 어울리는 증표 이미지를 만들도록 했습니다. 프론트엔드 작업이 밀릴 때는 Angular 경험을 살려 화면 구현도 도왔습니다.`,
  },
  {
    title: '웹 PDF 뷰어 솔루션',
    slug: 'pdf-viewer',
    summary: '브라우저에서 PDF를 열고 편집할 수 있는 상용 문서 뷰어',
    highlight: '인쇄물에도 남는 비가시 추적코드를 구현하고, 모바일 스크린 리더가 PDF를 읽도록 개선했습니다.',
    role: '기능 개발 전담',
    tags: ['실무', 'Angular', 'SCSS', '웹접근성'],
    // 메인은 최근작 위주로 좁게 간다. 이 프로젝트는 /projects 목록에서 만난다.
    featured: false,
    media: [
      { type: 'video', src: '/videos/company/right_click.mp4', alt: 'PDF 뷰어에서 우클릭해 지정한 기능이 담긴 메뉴를 여는 영상' },
      {
        type: 'image',
        src: '/images/company/invisible_tracer_desc.png',
        alt: '왼쪽은 글 위에 워터마크가 겹친 문서다. 오른쪽 문서에는 코드가 보이지 않지만 촬영하면 열람 시각, 파일명, 열람자를 확인할 수 있다.',
      },
      { type: 'video', src: '/videos/company/invisible_tracer.mp4', alt: '문서에 삽입된 비가시 추적코드를 스마트폰으로 스캔해 열람 정보를 확인하는 영상' },
      {
        type: 'image',
        src: '/images/company/dark_mode.png',
        alt: 'PDF 뷰어의 왼쪽 메뉴에서 다크 모드를 선택해 도구 모음이 어두워진 화면',
      },
      { type: 'image', src: '/images/company/light_mode.png', alt: '라이트 모드로 표시한 PDF 뷰어' },
    ],
    features: '우클릭 메뉴 설정, 비가시 추적코드, 다크 모드, 모바일 스크린 리더',
    stack: 'Angular, SCSS',
    reference: 'https://demo.epapyrus.com/ko/streamdocs',
    duration: '2022.04.13–2023.12.15',
    teamSize: '2명 (기능 구현 1명, 관리자 페이지 담당 1명)',
    contribution: '90% (관리자 페이지를 제외한 모든 기능 구현)',
    description: `이파피루스에서 브라우저로 PDF를 편집하는 상용 뷰어의 <strong>프론트엔드 기능 개발과 유지보수</strong>를 맡았습니다. 아래 기능은 공개 데모에서 확인할 수 있습니다.
    <h3>자주 쓰는 기능을 우클릭 메뉴에 표시</h3>
    문서에서 우클릭하면 필요한 기능을 바로 실행할 수 있도록 메뉴를 구현했습니다. 관리자 화면에서 메뉴에 표시할 항목을 고를 수 있게 연결했습니다.
    <h3>인쇄물에도 남는 비가시 추적코드</h3>
    화면에서 보이지 않는 워터마크를 PDF에 삽입해 원본과 열람 정보를 추적하도록 구현했습니다. 실제 종이에 인쇄하고 전용 앱으로 스캔해 코드 인식 정확도를 확인했습니다. 이 과정에서 이미지 해상도와 인쇄 DPI를 다뤘습니다.
    <h3>다크 모드와 모바일 스크린 리더</h3>
    SCSS로 라이트 모드와 다크 모드의 전환을 구현했습니다. Android TalkBack과 iOS VoiceOver가 PDF 내용을 읽을 수 있도록 모바일 스크린 리더도 지원했습니다.`,
  },
  {
    title: 'Movie Search',
    slug: 'movie-search',
    summary: '영화를 검색하고 한 줄 리뷰를 쓰거나 개봉 소식을 메일로 받는 웹앱',
    highlight: 'Redux Saga 대신 Redux Toolkit을 써 보니 비동기 처리 코드가 이전보다 훨씬 간결해졌습니다.',
    role: '단독 개발',
    tags: ['사이드', 'React', 'Redux', 'TypeScript', 'Express'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/movie-search/home_picture.png',
        alt: 'MovieTalk 홈 화면. 가운데 영화 검색창이 있고 아래로 인기작, 현재 상영작, 개봉 예정작 포스터가 세 줄로 나열되어 있다',
      },
      { type: 'animation', src: '/images/movie-search/home.mp4', alt: '홈에서 인기작과 상영작 목록을 아래로 계속 내려 보는 화면' },
      { type: 'animation', src: '/images/movie-search/search.mp4', alt: '영화 제목을 입력하고 검색 결과를 확인하는 화면' },
      { type: 'animation', src: '/images/movie-search/detail_page.mp4', alt: '영화 상세 화면에서 정보와 한 줄 리뷰를 확인하고 좋아요를 누르는 모습' },
      { type: 'animation', src: '/images/movie-search/alarm.mp4', alt: '개봉 예정작에 알림을 설정하는 화면' },
      { type: 'image', src: '/images/movie-search/mail.png', alt: '개봉 알림으로 발송된 안내 메일' },
      { type: 'animation', src: '/images/movie-search/profile.mp4', alt: '프로필 이미지를 올려 계정 정보를 수정하는 화면' },
    ],
    features: '영화 검색, 인기작과 상영작 조회, 개봉 예정작 조회, 한 줄 리뷰와 좋아요, 개봉 알림 메일, 네이버 블로그 글과 유튜브 영상 연동, 이메일 인증, 무한 스크롤',
    stack: 'React, Redux Toolkit, TypeScript, (Next.js), Express, MongoDB, AWS S3',
    github: 'https://github.com/backbone94/nextProject',
    duration: '2022.03.15–2022.03.31',
    teamSize: '1명',
    contribution: '100%',
    description: `블로그를 만든 뒤, 평소 좋아하던 영화로 두 번째 웹 프로젝트를 만들었습니다. 인기작과 상영작을 둘러보고, 한 줄 리뷰를 남기거나 개봉 예정작의 알림을 메일로 받을 수 있게 했습니다.
    <h3>기술 선택과 비동기 코드 정리</h3>
    반복되는 화면 요소는 React 컴포넌트로 만들고, JavaScript 코드의 타입을 확인할 수 있도록 TypeScript를 썼습니다. 프로필 이미지는 AWS S3에 저장했습니다. Next.js도 시험해 보면서 폴더 구조로 페이지 주소를 만드는 파일 기반 라우팅을 익혔습니다.<br><br>
    이전 블로그에서는 API를 한 번 호출하는 데도 Redux Saga 코드가 길어졌습니다. 이번에는 Redux Toolkit으로 비동기 요청을 처리했고, 체감상 비슷한 작업에 필요한 코드가 절반 정도로 줄었습니다.
    <h3>저장소를 지우고 나서 배운 점</h3>
    작업한 원본 저장소는 남아 있지 않습니다. 이름만 보고 연습용 저장소라고 착각해 지운 것으로 기억합니다. 나중에 봐도 용도가 드러나는 이름이 필요하다는 걸 배웠습니다.`,
  },
  {
    title: 'Blog',
    slug: 'blog',
    summary: '카테고리, 댓글, 다크 모드를 구현한 첫 블로그',
    highlight: '처음으로 React 싱글 페이지 앱을 만들고 AWS EC2에 직접 배포했습니다.',
    role: '단독 개발',
    tags: ['사이드', 'React', 'Redux', 'Express', 'AWS'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/blog/home.png',
        alt: '블로그 홈 화면. 상단에 Home, Language, Framework 카테고리와 검색, 프로필이 있고 본문에서 유튜브 영상을 볼 수 있다.',
      },
      { type: 'animation', src: '/images/blog/darkmode.mp4', alt: '오른쪽 위 버튼으로 다크 모드와 라이트 모드를 바꾸는 화면' },
      { type: 'animation', src: '/images/blog/category.mp4', alt: '새 카테고리를 추가하고 상단 메뉴에 반영되는 화면' },
      { type: 'animation', src: '/images/blog/folder.mp4', alt: '카테고리 아래에 폴더를 만들어 글을 분류하는 화면' },
      { type: 'animation', src: '/images/blog/post.mp4', alt: 'CKEditor로 글을 작성해 발행하는 화면' },
      { type: 'image', src: '/images/blog/comment.png', alt: '글 하단에 달린 댓글 목록' },
      { type: 'image', src: '/images/blog/profile.png', alt: 'S3에 업로드한 이미지로 프로필을 설정한 화면' },
      { type: 'animation', src: '/images/blog/mobile.mp4', alt: '좁은 화면에서 메뉴와 본문 배치가 바뀌는 모습' },
    ],
    features: '카테고리와 폴더, 글쓰기와 댓글, S3 이미지 업로드, 모바일 화면, 다크 모드',
    stack: 'React, Redux Saga, Express, MongoDB, AWS EC2 & S3',
    github: 'https://github.com/backbone94/blog',
    duration: '2022.02.11–2022.03.14',
    teamSize: '1명',
    contribution: '100%',
    description: `개발하면서 배운 것을 기록할 공간이 필요해 첫 CRUD 프로젝트로 블로그를 만들었습니다. 글을 카테고리와 폴더에 나누고 댓글을 달 수 있으며, 휴대폰 화면과 다크 모드도 지원합니다.
    <h3>첫 React 앱을 직접 배포</h3>
    React로 싱글 페이지 앱을 만들고 Redux Saga로 서버 요청을 처리했습니다. 글쓰기 화면에는 CKEditor를 붙였습니다. Express와 MongoDB로 글과 댓글을 관리하고, 프로필 이미지는 AWS S3에 저장했습니다. 완성한 앱을 AWS EC2에 직접 배포했습니다.
    <h3>프로젝트 규모에 맞는 도구가 필요했던 이유</h3>
    Redux Saga의 제너레이터 함수가 익숙하지 않았고, 비슷한 요청마다 코드가 반복됐습니다. 이 정도 규모에서는 도구를 익히고 관리하는 비용이 컸지만, 브라우저가 서버에 요청하고 응답을 받아 화면을 갱신하는 과정을 이해하는 데는 도움이 됐습니다. Node.js로 서버를 만들어 본 경험을 살려, 나중에는 이 코드를 정리하고 기능을 더해 제 블로그로 써 보고 싶습니다.`,
  },
  {
    title: 'RC Car',
    slug: 'rc-car',
    summary: '휴대폰으로 조종하고 초음파 센서로 장애물을 피하는 아두이노 RC카',
    highlight: '회로와 차체를 조립하고, 블루투스 조종과 장애물 회피를 구현했습니다.',
    role: '단독 개발',
    tags: ['기타', 'Arduino', 'Android'],
    featured: false,
    media: [
      {
        type: 'image',
        src: '/images/car/car_2.jpg',
        alt: '조립을 마친 아두이노 RC카. 나무 섀시에 노란 바퀴 네 개와 아두이노 보드, 건전지 팩, 배선이 얹혀 있다',
      },
      { type: 'image', src: '/images/car/car_3.jpg', alt: '조립을 마친 RC카의 다른 각도' },
      { type: 'video', src: '/videos/car.mp4', alt: '휴대폰 앱으로 RC카의 방향을 조종하는 영상' },
      { type: 'video', src: '/videos/auto_car.mp4', alt: '초음파 센서로 장애물을 피하며 스스로 주행하는 영상' },
    ],
    features: '블루투스 원격 조종, 초음파 센서를 이용한 장애물 회피',
    stack: '시스템 프로그래밍, Arduino 회로 조립, Android Studio App 개발',
    github: 'https://github.com/backbone94/arduino',
    duration: '2022.02–2022.03',
    teamSize: '1명',
    contribution: '100%',
    description: `웹 개발로 진로를 정하기 전에 만든 아두이노 RC카입니다. 직접 납땜하고 회로를 조립하면서, 작성한 코드가 실제 차량을 움직이는 과정을 처음 경험했습니다.
    <h3>휴대폰 조종과 장애물 회피 구현</h3>
    Android Studio로 블루투스 조종 앱을 만들었습니다. 휴대폰에서 보낸 명령에 따라 RC카가 움직이고, 자율 주행 모드에서는 차체 앞의 초음파 센서로 장애물을 감지해 돌아갑니다.
    <h3>아두이노를 선택한 이유</h3>
    센서 값을 읽고 모터를 제어하는 데는 아두이노로 충분했습니다. 이후에 이 작업을 확장한다면 라즈베리 파이에 카메라를 달아, 거리 센서로는 구분하기 어려운 상황을 다뤄 보고 싶습니다.`,
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
