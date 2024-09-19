export const projects = [
  {
    title: 'Music Diary',
    media: [
      { type: 'image', src: '/images/music-diary/list.png', alt: 'list' },
      { type: 'video', src: '/videos/diary_new_delete.mp4', alt: 'diary_new_delete' },
      { type: 'video', src: '/videos/diary_detail.mp4', alt: 'diary_detail' },
      { type: 'video', src: '/videos/sentiment_history.mp4', alt: 'sentiment_history' },
    ],
    features: 'GitHub & Kakao 소셜 로그인, 일기 작성, 음악 추천, 감정 히스토리 분석 등',
    stack: 'React, React Query, Next.js, Tailwind CSS, Prisma, MySQL, Vercel, OpenAI, Naver CLOVA, Youtube',
    github: 'https://github.com/backbone94/music-recommendation',
    description: `Music Diary는 사용자의 감정과 선호도에 맞는 음악을 추천하는 웹 애플리케이션입니다. Next.js를 기반으로 하여, 사용자가 작성한 일기를 분석하고 그에 맞는 음악을 추천하는 기능을 제공합니다.<br><br>웹 개발자로서의 기술 스택을 확장하고자 프론트엔드와 백엔드 모두를 Next.js를 통해 개발하였습니다. 특히, Prisma와 NextAuth.js를 사용하여 JS 코드 상에서 데이터베이스와 소셜 인증에 효율적으로 접근하는 방법을 익혔고, Node.js 환경에서의 비동기 작업 처리(Next.js Server Actions)와, React Query를 통해 클라이언트에서의 상태 관리를 훨씬 쉽게 작업할 수 있다는 점을 느끼게 되었습니다. Next.js에서 자동적으로 SSR, 이미지 캐싱, Code Splitting 등 최적화를 해주고 있었지만, 아무래도 데이터의 실시간 업데이트가 많이 필요하지 않은 소규모 애플리케이션에서는 성능상 큰 체감을 느끼지는 못하였습니다. 하지만 대부분의 정보들이 DOM에 포함된 상태로 클라이언트가 전달 받는 것을 확인해보니 확실히 SEO를 위해서는 Next.js가 필수겠구나라는 생각이 들었습니다.<br><br>Tailwind CSS 유틸리티 클래스를 활용하여 반응형 디자인을 구현한 상태라 <a href="https://github.com/backbone94/music-recommendation-mobile" target="_blank" class="text-blue-500">React Native의 WebView</a>를 사용하면 웹 기반의 앱을 스마트폰의 앱으로 배포할 수 있는 것을 알게 되어 실제로 앱 배포를 하려고 했으나, 구글의 플레이스토어에서 개발자 계정을 심사받는 과정이 생각보다 까다롭다는 사실을 알게되었습니다. 계정 심사를 모두 받은 이후에는 다시 한 번 앱 배포를 시도해보고자 합니다.`,
  },
  {
    title: 'Blog',
    media: [
      { type: 'image', src: '/images/blog/home.png', alt: 'home' },
      { type: 'image', src: '/images/blog/darkmode.gif', alt: 'darkmode' },
      { type: 'image', src: '/images/blog/category.gif', alt: 'category' },
      { type: 'image', src: '/images/blog/folder.gif', alt: 'folder' },
      { type: 'image', src: '/images/blog/post.gif', alt: 'post' },
      { type: 'image', src: '/images/blog/comment.png', alt: 'comment' },
      { type: 'image', src: '/images/blog/profile.png', alt: 'profile' },
      { type: 'image', src: '/images/blog/mobile.gif', alt: 'mobile' },
    ],
    features: '카테고리 및 폴더 생성, 글쓰기 및 댓글 달기, S3 이미지 업로드, 반응형 웹(모바일), 다크모드 등',
    stack: 'React, Redux Saga, Express, MongoDB, AWS EC2 & S3',
    github: 'https://github.com/backbone94/blog',
    description: `Blog는 저의 첫 CRUD 웹사이트 프로젝트입니다. 개발자라면 자신만의 기록 공간이 필수적으로 있어야 한다고 생각했기 때문에 첫 번째 프로젝트로 블로그를 만들어 보았습니다. 리액트로 SPA를 구성하였고 Redux Saga를 통해 서버와의 비동기 통신을 수행하였으며 글쓰기 기능을 위해 텍스트 에디터 중 하나인 CKEditor를 활용하였습니다. 프로필 이미지는 AWS의 S3에 업로드할 수 있게 개발하였고 AWS EC2로 실제 배포 단계까지 밟아보았습니다.<br><br>프론트엔드 개발자가 되는 것이 목표이지만, NodeJs라는 환경에서 백엔드 개발을 경험해볼 수 있었다는 점이 JavaScript의 매력을 새삼 느낄 수 있게 해주었습니다. 아직 미흡한 점이 많아, 코드 리팩토링 및 기능 추가를 통해 추후에는 실제 저의 블로그로 사용할 계획입니다.`,
  },
  {
    title: 'Movie Search',
    media: [
      { type: 'image', src: '/images/movie-search/home_picture.png', alt: 'home_picture' },
      { type: 'image', src: '/images/movie-search/home.gif', alt: 'home' },
      { type: 'image', src: '/images/movie-search/search.gif', alt: 'search' },
      { type: 'image', src: '/images/movie-search/detail_page.gif', alt: 'detail_page' },
      { type: 'image', src: '/images/movie-search/alarm.gif', alt: 'alarm' },
      { type: 'image', src: '/images/movie-search/mail.png', alt: 'mail' },
      { type: 'image', src: '/images/movie-search/profile.gif', alt: 'profile' },
    ],
    features: '영화 검색, 최신 인기작 & 현재 상영작 & 개봉 예정작 조회, 특정 영화의 상세 정보 조회, 한 줄 리뷰 달기(+좋아요 기능), 개봉 예정작 알림 설정, 네이버 블로그 글 Fetch, 유튜브 영상 Fetch, 이메일 인증, 무한스크롤 등',
    stack: 'React, Redux Toolkit, TypeScript(+ Next.Js), Express, MongoDB, AWS S3',
    github: 'https://github.com/backbone94/nextProject',
    description: `Blog 만든 경험을 바탕으로, 제가 좋아하는 영화에 대한 프로젝트를 만들어 보았습니다. 좋아하는 분야에 대한 프로젝트를 진행해서인지 Blog 프로젝트를 진행했을 때보다 훨씬 더 흥미롭게 진행했습니다.<br><br>리액트를 바탕으로 개발하였으며, JavaScript의 타입에 대한 단점을 보완해줄 TypeScript를 활용하였습니다. Redux Toolkit을 통해 서버와의 비동기 통신을 수행하였고 프로필 이미지는 AWS의 S3에 업로드할 수 있게 개발하였습니다. 또한 Next.js의 Pages 폴더 구조를 통해 편리한 페이지 라우팅 기능을 경험할 수 있었습니다. Blog 프로젝트에서 Redux Saga의 난잡함을 느끼고 난 후에 Redux Toolkit의 존재를 알게되었는데, Redux Saga의 코드 양과 복잡성이 Redux Toolkit에서 두배는 더 줄었다고 체감할 수 있었습니다.<br><br>P.S. 현재 해당 프로젝트의 Repository가 제거된 상태인데, 어떤 시기인지는 특정할 수가 없지만 Repository의 이름을 보고 연습용 Repository라고 착각하고 지웠던 것 같습니다... 이를 계기로 이름 짓기의 중요성을 다시 한 번 느끼게 되었습니다.`,
  },
  {
    title: 'RC Car',
    media: [
      { type: 'image', src: '/images/car/car_2.jpg', alt: 'car_2' },
      { type: 'image', src: '/images/car/car_3.jpg', alt: 'car_3' },
      { type: 'video', src: '/videos/car.mp4', alt: 'car' },
      { type: 'video', src: '/videos/auto_car.mp4', alt: 'autoCar' },
    ],
    features: 'App을 통한 RC 카 조종, 자율 주행 등',
    stack: '시스템 프로그래밍, Arduino 회로 조립, Android Studio App 개발',
    github: 'https://github.com/backbone94/arduino',
    description: `본격적으로 웹 개발자가 되기로 마음 먹기 전에 진행한 프로젝트입니다. 웹 개발과는 무관하지만 복잡했던 회로 조립, 학교에서 배우지 않았던 납땜질과 아두이노 시스템 프로그래밍은 개인적으로 값진 경험이었습니다.<br><br> Android Studio를 통해 RC카와 블루투스 통신이 가능한 심플한 App을 개발하였습니다. App을 통해 RC카를 직접 수동 조종할 수도 있고, RC카의 앞 부분에 달린 초음파 센서를 통해 RC카 스스로 운전해 나가는 자율 주행 기능도 추가하였습니다.<br><br>라즈베리 파이가 RAM, GPU 등을 갖추고 있어서 훨씬 복잡한 기능들을 수행할 수 있었지만, 제가 진행하고자 했던 프로젝트는 그보다는 간단한 작업을 수행하는 프로젝트였기 때문에 아두이노를 선택하여 진행하였습니다. 다음에 기회가 된다면 라즈베리 파이에 소형 카메라를 달고서 훨씬 고도화된 자율 주행 기능을 구현해보고 싶은 욕심이 생겼습니다.`,
  },
  {
    title: '살롱 | SSALON',
    media: [
      { type: 'image', src: '/images/ssalon/ticket.png', alt: 'ticket' },
      { type: 'image', src: '/images/ssalon/overview.png', alt: 'overview' },
      { type: 'video', src: '/videos/login.mp4', alt: 'login' },
      { type: 'video', src: '/videos/chat.mp4', alt: 'chat' },
      { type: 'video', src: '/videos/decoration.mp4', alt: 'decoration' },
    ],
    features: '3D 인터랙티브 증표, 모임/카테고리 추천 시스템, 모임 참가자 간 채팅, 모임 참가자 인증 등',
    stack: 'Angular, ThreeJS, Spring, MySQL, Redis, OpenAI, OAuth 2.0',
    github: 'https://github.com/backbone94/ssalon',
    description: `아주대학교 소프트웨어학과 졸업 작품입니다. 프론트엔드 개발자를 목표로 삼고 있었지만, 웹 개발자로서의 시야를 넓히기 위해 이 프로젝트에서는 백엔드 개발을 맡았습니다.<br><br>Spring에 익숙하지 않은 상태에서 프로젝트를 진행하는 것은 도전적인 경험이었지만, CI/CD의 구축과 AWS EC2 인스턴스의 운영에 대해서 학습할 수 있었으며, 프론트엔드와의 협업 과정에서 API 설계의 중요성을 알 수 있는 계기가 되었습니다. 프로젝트 진행 중간에 API에 대한 정리가 필요할 것으로 판단되어 Swagger API 문서를 만들어서 프론트엔드 팀원들이 작업을 좀더 수월하게 할 수 있도록 진행했습니다. 또한 JWT(+Redis ElastiCache)와 OAuth 2.0을 활용한 (카카오, 구글, 네이버) 소셜 로그인 기능 구현을 통해 보안과 인증 처리에 대한 경험을 쌓았으며, WebSocket을 이용한 실시간 채팅 기능 개발을 통해 웹 애플리케이션의 실시간 처리 능력을 향상시켰습니다.<br><br>이전에 프론트엔드(Angular) 개발자로써의 경력을 가진 상태로 프로젝트를 진행했다 보니, 프론트엔드 팀원이 속도가 나지 않는 상황일 때 제가 프론트엔드, 백엔드 개발을 동시에 진행하면서 시간적으로 부족한 부분들을 최대한 메꾸려는 시도를 하였고, 그로 인해 프로젝트에 좀더 많은 기여를 하게 되었습니다.`,
  },
  {
    title: 'Figma to Map Plugin',
    media: [
      { type: 'image', src: '/images/figma-plugin/main.png', alt: 'main' },
      { type: 'video', src: '/videos/import.mp4', alt: 'import' },
      { type: 'video', src: '/videos/export.mp4', alt: 'export' },
      { type: 'image', src: '/images/figma-plugin/json.png', alt: 'json' },
      { type: 'image', src: '/images/figma-plugin/csv.png', alt: 'csv' },
    ],
    features: '지도상에 Figma 컴포넌트 표시, 컴포넌트 드래그/리사이즈/회전, Figma <-> plugin 사이의 Import/Export, 지도 검색 기능 등',
    stack: 'Figma Plugin API, TypeScript, React, Webpack, MUI, OpenLayers',
    github: 'https://github.com/backbone94/figma-lonlat-plugin',
    description: `인턴으로서 참여한 첫 프로젝트입니다. 프로젝트의 목표는 디자이너와 개발자 간의 협업을 지원하는 Figma에서, 특정 컴포넌트를 지도상의 특정 위치에 배치하고, 해당 위치의 위경도 좌표를 기억할 수 있는 프로그램을 개발하는 것이었습니다.<br><br>Figma Plugin API를 사용하여 플러그인의 기본 기능들을 구성하였으며, Figma와 (Webpack + TypeScript + React) 간의 원활한 조화를 위해 이미 번들링 설정이 되어 있는 <a href="https://github.com/hseoy/figma-plugin-react-boilerplate" target="_blank" class="text-blue-500">보일러플레이트</a>를 사용하였습니다. 또한, 지도를 표시하기 위해 초반에는 Leaflet 라이브러리를 사용하였으나, 원하는 기능을 구현하기 위한 커스텀을 제공하고 있지 않아서, 그보다는 훨씬 많은 커스텀 기능을 제공하는 OpenLayers 라이브러리를 선택하여 지도를 구현하였고, Nominatim 라이브러리를 통해 지도 검색 기능을 추가하였으며, React 라이브러리와 상호작용을 잘 수행할 수 있는 MUI 라이브러리를 활용해 UI를 개선했습니다.`,
  },
  {
    title: 'Company Projects',
    media: [
      { type: 'video', src: '/videos/company/right_click.mp4', alt: 'right_click_video' },
      { type: 'image', src: '/images/company/invisible_tracer_desc.png', alt: 'invisible_tracer_desc' },
      { type: 'video', src: '/videos/company/invisible_tracer.mp4', alt: 'invisible_tracer' },
      { type: 'image', src: '/images/company/dark_mode.png', alt: 'dark_mode' },
      { type: 'image', src: '/images/company/light_mode.png', alt: 'light_mode' },
    ],
    features: '우클릭(Context menu) 커스텀 기능, 문서 추적코드 추가, 다크모드',
    stack: 'Angular, SCSS',
    reference: 'https://demo.epapyrus.com/ko/streamdocs',
    description: `
    이전 회사에서 진행했던 프로젝트들을 모아봤습니다. 버그 수정 또는 이슈 해결과 같이 자잘하게 진행했었던 작업들은 제외하고, 제가 핵심적으로 참여했던 프로젝트로는 우클릭 커스텀 기능, 비가시 추적코드 추가, 다크모드 기능이 있습니다.<br><br>
    1. 우클릭 커스텀 기능: 문서에서 마우스 우클릭 시 컨텍스트 메뉴가 나타나며, 관리자 페이지에서 컨텍스트 메뉴에 포함시키고자 하는 기능들을 커스텀하여 나만의 컨텍스트 메뉴를 만들 수 있는 기능을 구현했습니다. 문서에서 자주 쓰는 기능들은 컨텍스트 메뉴에 추가시켜 놓음으로써 사용자 경험을 향상시키고, 더 직관적인 인터페이스를 제공할 수 있었습니다.<br><br>
    
    2. 비가시 추적코드 추가: 문서의 보안 강화를 위한 기술로, PDF 문서에 보이지 않는 워터마크를 삽입하여 문서의 원본 및 열람 정보를 추적할 수 있는 기능을 구현했습니다. 실제 인쇄된 문서에도 적용되는 기술이었으며, 문서를 인쇄한 후 전용 앱을 통해 추적코드의 인식 정확도를 테스트하는 과정을 거치면서 이미지 해상도 및 인쇄와 관련된 DPI 개념을 숙지할 수 있는 계기가 되었습니다.<br><br>
    
    3. 다크모드 기능: 사용자 접근성과 편의성을 높이기 위해 다크모드 기능을 구현했습니다. SCSS를 통해 사용자의 선호에 따라 다크모드와 라이트모드를 전환할 수 있도록 설계하였습니다.<br><br>
  `,
  },
  {
    title: "Jun's Portfolio (Original)",
    media: [
      { type: 'image', src: '/images/portfolio/portfolio.png', alt: 'portfolio' },
    ],
    features: '포트폴리오 사이트',
    stack: 'HTML, CSS, JavaScript',
    github: 'https://github.com/backbone94/portfolio',
    description: `첫 번째 포트폴리오 사이트는 HTML, CSS, JavaScript로 개발되었습니다. 
  이 사이트는 기본적인 웹 개발 기술을 사용하여 간단하고 효과적인 포트폴리오를 만드는 것을 목표로 했습니다. 
  그러나 반응형 디자인이 충분히 구현되지 않아 모바일 환경에서 디자인이 깨지는 문제가 있었습니다. 
  이 과정에서 프레임워크 없이 개발하는 것의 한계를 느끼며, 더 나은 반응형 디자인과 유지보수성을 위해 리뉴얼을 결심하게 되었습니다.`,
  },

  {
    title: "Jun's Portfolio (Next.js)",
    media: [
      { type: 'image', src: '/images/portfolio/portfolio_nextjs.png', alt: 'portfolio_nextjs' },
      { type: 'image', src: '/images/portfolio/portfolio_nextjs_mobile.png', alt: 'portfolio_nextjs_mobile' },
    ],
    features: '포트폴리오 사이트 리뉴얼',
    stack: 'Next.js, Tailwind CSS',
    github: 'https://github.com/backbone94/next-portfolio',
    description: `리뉴얼된 포트폴리오 사이트는 Next.js와 Tailwind CSS를 사용하여 개발되었습니다. 
  이번 리뉴얼에서는 성능 향상과 SEO 최적화는 물론, 반응형 디자인을 개선하여 모바일 환경에서도 디자인이 깨지지 않도록 구현했습니다. 
  Tailwind CSS의 유틸리티 클래스와 Next.js의 정적 사이트 생성(SSG) 및 서버 사이드 렌더링(SSR)을 활용하여 디자인 일관성과 유지보수성을 높였습니다. 
  리뉴얼을 통해 반응형 웹 디자인의 중요성을 이해하게 되었고, 
  사용자 경험을 고려한 웹 개발을 더욱 잘 구현할 수 있게 되었습니다. 이 포트폴리오 페이지는 끊임 없이 발전할 예정입니다.`,
  },
];
