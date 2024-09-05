import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { jua, gowunDodum, dongle, gaegu } from './fonts';

export const metadata: Metadata = {
  title: "Jun's Portfolio",
  description: "이정준의 웹 개발 포트폴리오 사이트입니다.",
  openGraph: {
    type: 'website',
    url: 'https://backbone94.github.io/portfolio/',
    title: "Jun's Portfolio",
    description: "이정준의 웹 개발 포트폴리오 사이트입니다.",
    images: [
      {
        url: 'https://raw.githubusercontent.com/backbone94/portfolio/master/image/%EC%AD%88%EB%8B%88.jpg',
        width: 800,
        height: 600,
        alt: "Jun's Portfolio",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowunDodum.variable} ${dongle.variable} ${gaegu.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
