import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { SITE_URL } from './content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jun's Portfolio",
    template: "%s · Jun's Portfolio",
  },
  description:
    '고객과 제품, 그리고 피드백',
  /*
    루트를 canonical로 못박는다. 같은 내용이 www·vercel.app 주소로도 열려
    있어 중복 문서로 잡힐 여지가 있다. 하위 페이지는 각자 alternates로 덮는다.
  */
  alternates: {
    canonical: '/',
  },
  /*
    openGraph·twitter에 title/description을 다시 적지 않는다. 여기서 못박으면
    하위 페이지가 openGraph만 덮었을 때 twitter 쪽은 이 값에 그대로 묶여,
    프로젝트 상세를 X에 공유해도 카드 제목이 "Jun's Portfolio"로 나간다.
    비워 두면 각 페이지의 title·description이 그대로 따라온다.
  */
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: "Jun's Portfolio",
  },
  twitter: {
    card: 'summary_large_image',
  },
};

/**
 * 방향 계약. 빌드 산출물에 살아남아야 감사가 가능하므로 body의 첫 자식으로
 * 실제 HTML 주석을 심는다. React는 JSX로 주석을 렌더하지 않아 이 방식이 필요하다.
 */
const DIRECTION_CONTRACT = `<!--
IMPECCABLE DIRECTION CONTRACT · seed 77233364
THESIS: 이 포트폴리오는 읽는 문서가 아니라 제품 릴리스 피드다. 프로젝트마다 실제 화면이 먼저 오고 설명이 뒤따른다. 가운데 정렬 히어로와 3열 카드 그리드라는 카테고리 기본형을 거부한다.
OWN-WORLD: 블루블랙이 아닌 웜 그래파이트 다크(#131210)와 단일 앰버(#FFB224). 글로우와 유리 효과는 전면 금지. 채도는 오직 프로젝트 스크린샷이 낸다. Wanted Sans Variable 단일 패밀리로 무게(450~860) 대비만으로 위계를 만든다.
STORY: 방문자는 첫 화면에서 실제 만든 화면을 보고, 측정된 개선 세 건으로 신뢰를 얻고, 관심 프로젝트를 눌러 깊이 읽고, 이력서를 받거나 연락한다.
FIRST VIEWPORT: 좌측에 이름과 측정 지표, 우측에 실제 프로젝트 화면이 큰 스케일로. 기본 행동(프로젝트 보기)은 접힘 위에 둔다.
FORM: 사용자가 핀한 "모던 프로덕트" 세계. 롤은 grounded index 7을 배정했으나 핀이 롤을 이긴다.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

/** 첫 페인트 전에 테마를 확정해 깜빡임을 막는다. 기본값은 다크. */
const THEME_SCRIPT = `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light')}}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-accent-ink"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
