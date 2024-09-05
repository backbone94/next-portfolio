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
    description: `Music Diary는 사용자의 감정과 선호도에 맞는 음악을 추천하는 웹 애플리케이션입니다. 이 프로젝트는 Next.js를 기반으로 하여, 사용자가 작성한 일기를 분석하고, 그에 맞는 음악을 추천하는 기능을 제공합니다. 웹 개발자로서의 기술 스택을 확장하고자 이 프로젝트에서는 프론트엔드와 백엔드 모두를 Next.js를 통해 개발하였습니다. 특히, Prisma와 NextAuth.js를 사용하여 데이터베이스와 소셜 인증을 효율적으로 관리하는 방법을 익혔고, 프로젝트를 진행하며, Node.js 환경에서의 비동기 작업 처리와 React Query를 통한 상태 관리의 중요성을 깨닫게 되었습니다.`,
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
    description: `Blog는 저의 첫 CRUD 웹사이트 프로젝트입니다. 개발자라면 자신만의 기록 공간이 필수적으로 있어야 한다고 생각했기 때문에 첫 번째 프로젝트로 블로그를 만들어 보았습니다. 리액트로 SPA를 구성하였고 Redux Saga를 통해 서버와의 비동기 통신을 수행하였으며 글쓰기 기능을 위해 텍스트 에디터 중 하나인 CKEditor를 활용하였습니다. 프로필 이미지는 AWS의 S3에 업로드할 수 있게 개발하였고 AWS EC2로 실제 배포 단계까지 밟아보았습니다. 프론트엔드 개발자가 되는 것이 목표이지만, NodeJs라는 환경에서 백엔드 개발을 경험해볼 수 있었다는 점이 JavaScript의 매력을 새삼 느낄 수 있게 해주었습니다. 아직 미흡한 점이 많아, 코드 리팩토링 및 기능 추가를 통해 추후에는 실제 저의 블로그로 사용할 계획입니다.`,
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
    description: `Blog 만든 경험을 바탕으로, 제가 좋아하는 영화에 대한 프로젝트를 만들어 보았습니다. 좋아하는 분야에 대한 프로젝트를 진행해서인지 Blog 프로젝트를 진행했을 때보다 훨씬 더 흥미롭게 진행했습니다. 리액트를 바탕으로 개발하였으며, JavaScript의 단점을 보완해줄 TypeScript를 활용하였습니다. Redux Toolkit을 통해 서버와의 비동기 통신을 수행하였고 프로필 이미지는 AWS의 S3에 업로드할 수 있게 개발하였습니다. 또한 Next.js의 Pages 폴더를 통해 편리한 라우팅 기능을 경험할 수 있었습니다. Blog 프로젝트에서 Redux Saga의 난잡함을 느끼고 난 후에 Redux Toolkit의 존재를 알게되었는데, Redux Saga의 코드 양과 복잡성이 Redux Toolkit에서 두배는 더 줄었다고 체감할 수 있었습니다.`,
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
    description: `본격적으로 웹 개발자가 되기로 마음 먹기 전에 진행한 프로젝트입니다. 웹 개발과는 무관하지만 복잡했던 회로 조립, 학교에서 배우지 않았던 아두이노 시스템 프로그래밍은 개인적으로 값진 경험이었습니다. Android Studio를 통해 RC카와 블루투스 통신이 가능한 심플한 App을 개발하였습니다. App을 통해 RC카를 직접 수동 조종할 수도 있고, RC카의 앞 부분에 달린 초음파 센서를 통해 RC카 스스로 운전해 나가는 자율 주행 기능도 추가하였습니다.`,
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
    description: `아주대학교 소프트웨어학과 졸업 작품입니다. 저는 프론트엔드 개발자를 목표로 삼고 있었지만, 웹 개발자로서의 시야를 넓히기 위해 이 프로젝트에서는 백엔드 개발을 맡았습니다. Spring에 익숙하지 않은 상태에서 대규모 프로젝트를 진행하는 것은 도전적인 경험이었지만, 이를 통해 CI/CD의 구축과 AWS EC2 인스턴스의 운영에 대해 깊이 있게 학습할 수 있었습니다. JWT와 OAuth 2.0을 활용한 (카카오, 구글, 네이버) 소셜 로그인 기능 구현을 통해 보안과 인증 처리에 대한 경험을 쌓았으며, WebSocket을 이용한 실시간 채팅 기능 개발을 통해 웹 애플리케이션의 실시간 처리 능력을 향상시켰습니다.`,
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
    description: `인턴으로서 참여한 첫 프로젝트입니다. 프로젝트의 목표는 디자이너와 개발자 간의 협업을 지원하는 Figma에서 특정 컴포넌트를 지도상의 특정 위치에 배치하고, 해당 좌표를 기억할 수 있는 프로그램을 개발하는 것이었습니다. Figma Plugin API를 사용하여 플러그인의 기본 기능들을 구성하였으며, Figma와 (Webpack + TypeScript + React) 간의 원활한 조화를 위해 이미 번들링 설정이 되어 있는 보일러플레이트를 사용하였습니다. 또한, 지도를 표시하기 위해 OpenLayers 라이브러리를 사용하였고, Nominatim 라이브러리를 통해 지도 검색 기능을 구현하였으며, MUI 라이브러리를 활용해 UI를 개선했습니다.`,
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
  이러한 리뉴얼을 통해 반응형 웹 디자인의 중요성을 깊이 이해하게 되었고, 
  사용자 경험을 고려한 웹 개발을 더욱 잘 구현할 수 있게 되었습니다.`,
  },
];
