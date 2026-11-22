import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HideOnAskHome from './components/HideOnAskHome';
import VisitBeacon from './components/VisitBeacon';
import { SITE_URL } from './content/site';
import { THEME_SCRIPT } from './lib/theme';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jun's Portfolio",
  description: '이정준의 프로젝트와 맡은 역할을 둘러보고, 작업 중 궁금한 점은 Jun에게 물어보세요.',
  /*
    루트를 canonical로 못박는다. 같은 내용이 www·vercel.app 주소로도 열려
    있어 중복 문서로 잡힐 여지가 있다. 하위 페이지는 각자 alternates로 덮는다.
  */
  alternates: {
    canonical: '/',
  },
  // 프로젝트와 공유된 질문의 카드 제목은 각 페이지의 Open Graph 설정에서 정한다.
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
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
        <VisitBeacon />
      </body>
    </html>
  );
}
