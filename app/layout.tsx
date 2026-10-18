import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HideOnAskHome from './components/HideOnAskHome';
import { SITE_URL } from './content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /*
    탭 제목은 어느 페이지든 "Jun's Portfolio" 하나로 둔다. template에 %s가 없어서
    하위 페이지가 title을 정해도 탭에는 이 값만 나온다. 공유 카드 제목은 각
    페이지의 openGraph.title이 따로 맡는다.
  */
  title: {
    default: "Jun's Portfolio",
    template: "Jun's Portfolio",
  },
  description: '이정준의 경력과 프로젝트를 검색창에 물어보세요. 모든 답은 실제 기록을 근거로 합니다.',
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-accent-ink"
        >
          본문으로 건너뛰기
        </a>
        <HideOnAskHome>
          <Header />
        </HideOnAskHome>
        <main id="main">{children}</main>
        <HideOnAskHome>
          <Footer />
          <ScrollToTop />
        </HideOnAskHome>
        {/*
          방문 여부를 알 수단이 하나도 없었다. 쿠키를 쓰지 않고 개인을 식별하지도
          않아 동의 배너 없이 둘 수 있다. 개발 중에는 아무것도 보내지 않는다.
        */}
        <Analytics />
      </body>
    </html>
  );
}
