import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
