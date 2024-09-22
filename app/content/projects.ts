export const projects = [
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
    duration: '2022.02 ~ 2022.03',
    teamSize: '1명',
    contribution: '100%',
    description: `본격적으로 웹 개발자가 되기로 결정하기 전에 진행한 프로젝트입니다. 웹 개발과는 무관하지만 복잡했던 회로 조립, 학교에서 배우지 않았던 납땜질과 아두이노 시스템 프로그래밍은 개인적으로 값진 경험이었습니다.<br><br>
    Android Studio를 통해 RC카와 <strong>블루투스 통신</strong>이 가능한 안드로이드 앱을 개발하였습니다. App을 통해 RC카를 직접 수동 조종할 수도 있고, RC카의 앞 부분에 달린 <strong>초음파 센서</strong>를 통해 RC카 스스로 운전해 나가는 <strong>자율 주행 기능</strong>도 추가하였습니다.<br><br>
    라즈베리 파이가 RAM, GPU 등을 갖추고 있어서 훨씬 복잡한 기능들을 수행할 수 있었지만, 제가 진행하고자 했던 프로젝트는 그보다는 간단한 작업을 수행하는 프로젝트였기 때문에 아두이노를 선택하여 진행하였습니다. 다음에 기회가 된다면 라즈베리 파이에 소형 카메라를 달고서 훨씬 고도화된 자율 주행 기능을 구현해보고 싶은 욕심이 생겼습니다.`,
  },
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
    duration: '2024.08.21 ~ 2024.09.05',
    teamSize: '1명',
    contribution: '100%',
    description: `Music Diary는 사용자의 감정과 선호도에 맞는 음악을 추천하는 웹 애플리케이션입니다. Next.js를 기반으로 하여, 사용자가 작성한 일기를 분석하고 그에 맞는 음악을 추천하는 기능 및 감정 히스토리를 정리해주는 기능을 제공합니다.<br><br>
    Next.js 기술을 채택한 이유는, 웹 개발자로서 사용할 수 있는 기술 스택을 확장하고, <strong>SSR을 통한 SEO 최적화</strong> 및 백엔드 서버를 따로 구축하지 않아도 된다는 장점, 그리고 이미지를 포함한 각종 최적화를, 뛰어난 개발자 경험(DX)과 함께 제공하기 때문입니다.<br>
    데이터 저장을 위해서는 ORM 중 하나인 Prisma를 사용하여 JS 코드 상에서 MySQL 데이터베이스에 쉽고 효율적으로 접근하였으며, NextAuth.js를 사용하여 <strong>소셜 로그인</strong>을 매우 간편하게 구현할 수 있었습니다.<br>
    또한 비동기 작업 처리를 위해 Next.js의 새로운 기능인 Server Actions를 사용해보았으며, 최신 데이터를 자동적으로 받아 오는 <strong>React Query</strong>를 통해 클라이언트의 다이나믹한 상태를 훨씬 쉽게 작업할 수 있다는 것을 알게 되었습니다.<br><br>
    사용자가 작성한 일기 내용으로부터 감정을 분석하기 위해서 <strong>Naver CLOVA API</strong>를 사용했지만 해당 API는 감정을 (긍정, 부정, 중립) 이렇게 세 단계로만 분석해주는 한계가 있었습니다. 그래서 일기 내용에서 가장 많이 등장하는 단어들에게 가중치 부여한 후 나열해서, 관련된 내용의 가사를 가지는 음악을 추천하는 방식을 시도해보았으나, 단순히 등장하는 단어의 개수로 음악을 추천받기에는 뜬금 없는 음악을 추천해주고 있었습니다. 비용이 들긴 하지만 어쩔 수 없이 일기 내용과 관련된 음악을 추천받기에는 <strong>OpenAI의 API</strong>를 사용하는 것이 가장 적합할 것 같다는 생각이 들어서 OpenAI API를 사용하여 음악 추천 및 <strong>약 일주일 간의 일기 내용을 장문으로 정리해주는 기능</strong>을 추가하였습니다. 첨언하자면, 일주일 간의 일기 내용은 생각보다 많은 문자를 포함하고 있어서, 한 번의 API 호출로 0.15달러 이상이 소비되는 것을 보고, 이 어플리케이션은 상업적인 한계점을 가지고 있다고 생각하였습니다.<br><br>
    또한 Tailwind CSS 유틸리티 클래스를 활용하여 <strong>반응형 디자인</strong>을 구현한 상태라서, <a href="https://github.com/backbone94/music-recommendation-mobile" target="_blank" class="text-blue-500">React Native의 WebView</a>를 사용하면 웹 기반의 앱을 스마트폰의 앱으로 배포할 수 있는 것을 알게 되어 실제로 앱 배포를 하려고 했으나, 구글의 플레이스토어에서 개발자 계정을 심사받는 과정이 생각보다 까다롭다는 사실을 알게되었습니다. 계정 심사를 모두 받은 이후에는 다시 한 번 앱 배포를 시도해보고자 합니다.
    `,
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
    duration: '2024.03 ~ 2024.06',
    teamSize: '5명 (프론트엔드 2명, 백엔드 3명)',
    contribution: '60% (백엔드 개발, AWS 클라우드 환경 구축, 채팅 기능, AI 이미지 생성 API, 프론트엔드 보조)',
    description: `<strong>아주대학교 소프트웨어학과 졸업 작품</strong>입니다. 기본적으로는 일회성 모임을 위한 어플리케이션이며, 자신이 참여한 모임을 기념하기 위한 "증표"를 생성하여 간직하거나, 개인적으로 증표를 커스텀하여 친구들과 공유할 수 있도록 해주는 기능을 제공합니다.<br><br>
    저는 프론트엔드 개발자를 목표로 삼고 있었지만, 웹 개발자로서의 시야를 넓히기 위해 이 프로젝트에서는 <strong>백엔드 개발</strong>을 맡았습니다.<br>
    백엔드 개발은 <strong>Spring</strong>를 사용하였는데, Spring을 선택한 이유는, 일단 다른 백엔드 팀원들한테 가장 사용하기 익숙한 기술 스택이었고, Spring을 처음 접해보는 저로써는 학습을 위한 데이터가 가장 많은 기술 스택 중의 하나라고 생각이 들었으며, 복잡하고 어려운 Spring의 여러 초기 설정들을 자동화 해주는 Spring Boot가 있었기 때문입니다.<br>
    사용자의 쉬운 접근을 위해서는 카카오와 같은 <strong>소셜 로그인</strong>은 필수 선택이라고 판단하여 소셜 로그인 기능을 추가하였는데, 권한 부여(Authorization)를 위한 업계 표준 프로토콜로 OAuth 2.0이 자리잡고 있었기 때문에 OAuth 2.0을 통해 소셜 로그인을 구현하였습니다.<br>
    또한 클라이언트에서의 백엔드 API 호출 시 클라이언트 인증을 위해, 서버에 세션 저장소를 따로 둘 필요가 없는 <strong>JWT 방식</strong>을 도입하였습니다. JWT 방식의 보안 허점을 조금이라도 더 보완하고자 AWS의 인메모리 캐싱 서비스인 <strong>ElastiCache(Redis)</strong>에, JWT가 만료됐을 때를 대비한 <strong>Refresh Token</strong>을 따로 저장하는 방식을 사용하여 보안성을 향상시켰습니다.<br><br>
    Spring에 익숙하지 않은 상태에서 프로젝트를 진행하는 것은 도전적인 경험이었지만, GitHub Actions를 통한 CI/CD의 구축과, AWS의 EC2 인스턴스, RDS, ElastiCache와 같은 <strong>클라우드 환경의 운영</strong>을 직접 경험할 수 있었던 소중한 시간들이었습니다.<br><br>
    GitHub Actions를 구축하면서, Mock 라이브러리로 작성된 <strong>테스트 코드</strong>를 통해 배포 전 코드의 안정성을 높이기 위한 CI를 프로젝트 초반에는 계속 시도하였으나, 생각보다 테스트 코드 작성에 꽤 많은 시간이 드는 바람에 프로젝트의 진척도가 더뎠고, 그로 인해 교수님의 압박이 있었습니다. 따라서 아쉽지만 테스트 코드는 작성하지 않는 방향으로 진행을 했었는데, 테스트 코드 작성을 하지 못한 부분은 꽤 아쉬운 부분으로 남게 되었습니다.<br><br>
    프론트엔드 팀원과의 협업 과정에서, 백엔드 측에서 API를 만들었다고 해도 프론트엔드 팀원이 해당 API에 대한 정보가 왜곡된 채로 적절한 API 사용을 하지 못하는 문제가 있었습니다. 이러한 문제를 해결하고, 프론트엔드 팀원과의 원활한 소통을 위해서는 <strong>API 문서</strong>를 작성하는 것이 좋을 것 같다고 생각하여 백엔드 팀원들과 협의 후 Swagger를 사용하여 API 문서를 만들어서 프론트엔드 팀원들이 작업을 좀더 수월하게 진행할 수 있도록 했습니다. 열심히 만든 API를 문서로써 보기 좋게 정리하여 프론트엔드 팀원들이 API 문서를 효율적으로 사용하는 모습이 뿌듯하였습니다.<br><br>
    실시간 채팅 기능 개발은 <strong>WebSocket 프로토콜</strong>을 활용하였는데, 익숙했던 HTTP 통신과 달리 디버깅 과정에서 오류 메시지가 구체적으로 나오지 않는 바람에 디버깅에 생각보다 애를 먹었습니다.<br>
    그리고 기획 단계에서 언급만 됐었던, <strong>Open AI API를 통한 이미지 생성 기능</strong>을, 촉박한 시간으로 인해 생략하려고 했었지만 최신 AI 기술을 꼭 적용해보고 싶었던 개인적인 욕심에, 프로젝트 마지막쯤에 OpenAI Dall-E 3 API를 사용하여, 모임의 성격을 프롬프트로 요청하면 모임과 관련된 증표 이미지를 생성해주는 기능을 추가하였습니다.<br><br>
    이전에 프론트엔드(Angular) 개발자로써의 경력을 가진 상태로 프로젝트를 진행했다 보니, 프론트엔드 팀원이 속도가 나지 않는 상황일 때 제가 <strong>프론트엔드, 백엔드 개발을 동시에 진행</strong>하면서 시간적으로 부족한 부분들을 최대한 메꾸려는 시도를 하였고, 그로 인해 프로젝트에 좀더 많은 기여를 하게 되었습니다.`,
  },
  {
    title: "Jun's Portfolio (Original)",
    media: [
      { type: 'image', src: '/images/portfolio/portfolio.png', alt: 'portfolio' },
    ],
    features: '포트폴리오 사이트',
    stack: 'HTML, CSS, JavaScript',
    github: 'https://github.com/backbone94/portfolio',
    duration: '2022.03.13 ~ 2022.03.31',
    teamSize: '1명',
    contribution: '100%',
    description: `저의 첫 번째 <strong>포트폴리오 사이트</strong> 프로젝트입니다.<br><br>
    해당 사이트는 간단하고 심플한 포트폴리오 사이트를 만드는 것을 목표로 했기 때문에 기본적인 웹 기술인 <strong>HTML, CSS, JavaScript</strong>를 사용하여 개발되었습니다.<br>
    그러나 반응형 디자인이 충분히 구현되지 않아 <strong>모바일 환경에서 디자인이 깨지는 문제</strong>가 있었습니다. 이 과정에서 프레임워크 없이 개발하는 것의 한계를 느끼며, 더 나은 반응형 디자인과 유지보수성을 위해 리뉴얼을 결심하게 되었습니다.`,
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
    duration: '2024.09.05 ~',
    teamSize: '1명',
    contribution: '100%',
    description: `첫 번째 포트폴리오 사이트를 새롭게 개편한 <strong>리뉴얼 포트폴리오</strong> 프로젝트입니다.<br><br>
    리뉴얼된 포트폴리오 사이트는 간단한 페이지라서 특별한 프레임워크를 사용할 필요는 없었지만, 추후의 확장 가능성, 유지보수성, 그리고 SEO 최적화를 고려했을 때 <strong>Next.js</strong>로 개발하는 것이 좋을 것 같다고 판단하였습니다.<br>
    컴포넌트의 스타일 커스터마이징을 손쉽게 할 수 있는 Tailwind CSS를 통해서 첫 번째 포트폴리오 프로젝트에서 문제가 되었던 <strong>반응형 디자인</strong>을 구현하여, 모바일 환경에서도 디자인이 깨지지 않는 일관된 디자인으로 개발하였습니다.<br>
    Next.js로 개발한 만큼 배포는 <strong>Vercel</strong>을 통해 손쉽게 진행할 수 있었습니다.<br><br>
    이번 리뉴얼을 통해 반응형 웹 디자인의 중요성을 이해하게 되었고, 사용자 경험을 고려한 웹 개발을 더욱 잘 구현할 수 있게 되었습니다. 이 포트폴리오 페이지는 새로운 정보와 프로젝트들로 계속해서 채워질 예정입니다.`,
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
    duration: '2022.02.11 ~ 2022.03.14',
    teamSize: '1명',
    contribution: '100%',
    description: `Blog는 저의 첫 CRUD 웹사이트 프로젝트입니다. 개발자라면 자신만의 기록 공간이 필수적으로 있어야 한다고 생각했기 때문에 첫 번째 프로젝트로 블로그를 만들어 보았습니다.<br><br>
    이 프로젝트를 통해 첫 <strong>React</strong> SPA 사이트를 구성하였고, 서버와의 비동기 통신을 수행하기 위해 <strong>Redux Saga</strong>를 활용하였습니다. 또한 텍스트 에디터 중 하나인 CKEditor를 활용하여 글쓰기 기능을 구현하였습니다. 프로필 이미지는 <strong>AWS의 S3</strong>에 업로드할 수 있게 개발하였고 <strong>AWS EC2 인스턴스</strong>를 활용하여 실제 배포 단계까지 밟아보았습니다.<br><br>
    Redux Saga를 처음 학습할 때에도 <strong>러닝커브</strong>에 대한 각오를 하고 학습을 시작하였지만, 개발하는 과정 속에서 반복되고 장황한 코드 패턴과, 생소한 generator 함수에 좌절했던 기억이 있습니다. 지금 생각해보면, 소규모로 진행했던 프로젝트였던 것만큼 Redux Saga를 쓴다는 사실이 비효율적인 방식이었다는 생각이 들지만, 이 프로젝트를 통해서 <strong>비동기 통신</strong>에 대한 개념을 정립할 수 있었습니다.<br><br>
    프론트엔드 개발자가 되는 것이 목표이지만, Node.js라는 환경에서 백엔드 개발을 경험해볼 수 있었다는 점이 JavaScript의 매력을 새삼 느낄 수 있게 해주었습니다.<br>
    아직 미흡한 점이 많아, 추후에 실제 저의 블로그로 사용할 수 있도록 코드 리팩토링 및 기능 추가를 할 예정입니다.`,
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
    stack: 'React, Redux Toolkit, TypeScript, (Next.js), Express, MongoDB, AWS S3',
    github: 'https://github.com/backbone94/nextProject',
    duration: '2022.03.15 ~ 2022.03.31',
    teamSize: '1명',
    contribution: '100%',
    description: `Blog 만든 경험을 바탕으로, 제가 좋아하는 영화에 대한 프로젝트를 만들어 보았습니다. 좋아하는 분야에 대한 프로젝트를 진행해서인지 Blog 프로젝트를 진행했을 때보다 훨씬 더 흥미롭게 진행했습니다.<br><br>
    컴포넌트의 재사용을 통한 코드 유지보수성을 위해 <strong>React</strong>를 바탕으로 개발하였으며, JavaScript의 타입에 대한 단점을 보완해줄 <strong>TypeScript</strong>를 활용하였습니다. <strong>Redux Toolkit</strong>을 통해 서버와의 비동기 통신을 수행하였고 프로필 이미지는 <strong>AWS의 S3</strong>에 업로드할 수 있게 개발하였습니다.<br><br>
    이 프로젝트에서는 Next.js의 사용 목적을 알지 못한 채로 무작정 사용해본 프로젝트였으나, Next.js의 폴더 구조를 통한 편리한 <strong>페이지 라우팅 기능</strong>만큼은 눈에 띄는 경험이었습니다.<br>
    Blog 프로젝트에서 Redux Saga의 난잡함을 느끼고 난 후에 Redux Toolkit의 존재를 알게되었는데, Redux Saga의 장황한 코드와 복잡성이 Redux Toolkit에서 두배는 더 줄었다고 체감할 수 있었습니다.<br><br>
    P.S. 현재 해당 프로젝트의 Repository가 제거된 상태인데, 어떤 시기인지는 특정할 수 없지만 Repository의 이름을 보고, 연습용 Repository라고 착각하고 지웠던 것 같습니다. 이를 계기로 이름 짓기의 중요성을 다시 한 번 느끼게 되었습니다.`,
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
    features: '우클릭(Context menu) 커스텀 기능, 문서 추적코드 추가, 다크모드, 모바일 스크린 리더',
    stack: 'Angular, SCSS',
    reference: 'https://demo.epapyrus.com/ko/streamdocs',
    duration: '2022.04.13 ~ 2023.12.15',
    teamSize: '2명 (기능 구현 1명, 관리자 페이지 담당 1명)',
    contribution: '90% (관리자 페이지를 제외한 모든 기능 구현)',
    description: `
    데모 버전으로 공개되어 있는, 이전 회사에서 진행했었던 프로젝트들을 모아봤습니다. PDF를 웹 상에서 실시간으로 수정할 수 있는 뷰어 솔루션의 프론트엔드 기능 개발 및 유지보수 업무를 맡았습니다. 버그 수정 또는 이슈 해결과 같이 자잘하게 진행했었던 작업들은 제외하고, 제가 핵심적으로 참여했던 프로젝트로는 <strong>우클릭 커스텀 기능, 비가시 추적코드 추가, 다크모드 기능, 모바일 스크린 리더</strong> 등이 있습니다.<br><br>
    1. 우클릭 커스텀 기능: 문서에서 마우스 우클릭 시 컨텍스트 메뉴가 나타나며, 관리자 페이지에서 컨텍스트 메뉴에 포함시키고자 하는 기능들을 커스텀하여 <strong>나만의 컨텍스트 메뉴</strong>를 만들 수 있는 기능을 구현했습니다. 문서에서 자주 쓰는 기능들은 컨텍스트 메뉴에 추가시켜 놓음으로써 사용자 경험을 향상시키고, 더 직관적인 인터페이스를 제공할 수 있었습니다.<br><br>
    
    2. 비가시 추적코드 추가: 문서의 보안 강화를 위한 기술로, PDF 문서에 <strong>보이지 않는 워터마크를 삽입</strong>하여 문서의 원본 및 열람 정보를 추적할 수 있는 기능을 구현했습니다. 실제 인쇄된 문서에도 적용되는 기술이었으며, 문서를 인쇄한 후 전용 앱을 통해 추적코드의 인식 정확도를 테스트하는 과정을 거치면서 이미지 해상도 및 인쇄와 관련된 DPI 개념을 숙지할 수 있는 계기가 되었습니다.<br><br>
    
    3. 다크모드 기능: 사용자 접근성과 편의성을 높이기 위해 다크모드 기능을 구현했습니다. SCSS를 통해 사용자의 선호에 따라 <strong>다크모드와 라이트모드를 전환</strong>할 수 있도록 설계하였습니다.<br><br>
    
    4. 모바일 스크린 리더: 안드로이드의 TalkBack, IOS의 VoiceOver 모바일 스크린 리더가 PDF의 내용을 읽을 수 있도록 <strong>웹 접근성(Web Accessibility)</strong>을 향상시켰습니다.`,
  },
  {
    title: 'Figma to Map Plugin',
    media: [
      { type: 'image', src: '/images/figma-plugin/main.png', alt: 'main' },
    ],
    features: '지도상에 Figma 컴포넌트 표시, 컴포넌트 드래그/리사이즈/회전, Figma <-> plugin 사이의 Import/Export, 지도 검색 기능 등',
    stack: 'Figma Plugin API, TypeScript, React, Webpack, MUI, OpenLayers',
    github: '',
    duration: '2024.07.09 ~ 2024.08.21',
    teamSize: '1명',
    contribution: '100%',
    description: `<strong>대표 이미지는 보안을 위해 블러처리하였습니다.</strong><br><br>
    인턴으로서 참여한 첫 프로젝트입니다. 프로젝트의 목표는 Figma의 특정 레이어를 지도상의 특정 위치에 배치하고, 해당 위치의 위경도 좌표를 기억할 수 있는 <strong>Figma 플러그인</strong>을 개발하는 것이었습니다.<br><br>
    Figma 플러그인의 기본 뼈대는 Figma Plugin API의 <a href="https://www.figma.com/plugin-docs/" target="_blank" class="text-blue-500">공식 문서</a>를 참고하여 구성하였으며, 코드 유지보수성을 향상시키고, 바닐라 JavaScript보다 훨씬 더 빨리 작업 속도를 낼 수 있는 React를, 그리고 타입 체크를 통해 더욱 안정적인 개발 진행을 위한 TypeScript를 선택하였습니다.<br><br>
    하지만 React를 TypeScript와 사용하기 위해서는 Webpack과 같은 번들러의 복잡한 설정이 필요하였습니다. 이런 상황에서 좀 더 효율적인 Figma 플러그인 개발을 위한 방법을 검색해보다가, <strong>Figma와 (Webpack + TypeScript + React) 간의 원활한 조화</strong>를 위해 이미 개발되어 있던 <a href="https://github.com/hseoy/figma-plugin-react-boilerplate" target="_blank" class="text-blue-500">보일러플레이트</a>를 발견하게 되었습니다. 이 보일러플레이트를 사용하여, 따로 번거로운 설정 없이 React와 TypeScript 스펙을 Figma 플러그인 개발에 사용할 수 있어서 편리한 작업을 할 수 있었습니다.<br>
    UI 라이브러리는, 구글의 Material Design 가이드라인을 바탕으로 만들어진 <strong>MUI(Material UI)</strong> 라이브러리를 활용하여 React의 컴포넌트와 잘 어우러지도록 UI를 개선하였습니다.<br><br>
    Figma 플러그인 위에 지도를 표시하기 위해, 초반에는 Leaflet 라이브러리를 사용하여 개발 진행을 하고 있었으나, Leaflet 라이브러리는, 지도 위에 Polygon을 그리는 기능과, Polygon의 모양 변형, 드래그, 리사이즈 등의 기능을 구현하기 위한 커스텀을 제공하지 않는 고도화된 지도 라이브러리가 아니었기에, 사수분과의 상담를 통해 Leaflet 라이브러리보다 더 다양한 커스텀 기능을 제공하는 <strong>OpenLayers 라이브러리</strong>로 대체하는 방식으로 수정하여 지도 구현을 하였습니다.<br>
    또한 Polygon을 지도의 특정 위치에 배치시켜야 할 때, 지도를 직접 드래그 하면서 그 지역을 찾으려고 하는 게 매우 비효율적이다라는 생각을 하게 되었고, 지도 검색 기능을 <strong>Nominatim 라이브러리</strong>를 사용하여 추가하였습니다.<br><br>
    이 플러그인의 핵심 기능인, Polygon의 위경도 좌표 변환을 위해서는 좌표계에 대한 개념을 알아야 했는데, OpenLayers 라이브러리가 사용하고 있는 <strong>EPSG:3857 좌표계</strong>와, 위경도 좌표를 나타내는 데에 사용되는 <strong>EPSG:4326 좌표계</strong>와 같은 생소한 개념들을 알지 못한 채로 작업을 진행해서 중간에 좌표 변환이 제대로 이뤄지지 않는 바람에 조금 힘들었던 경험을 하였습니다.<br>
    지도 라이브러리의 첫 사용과, 좌표계에 대한 새로운 개념을 공부할 수 있었던 뜻깊은 프로젝트였습니다.`,
  },
];
