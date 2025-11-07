import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // 폰트 최적화: 폰트 로딩 중에도 텍스트 표시
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // 폰트 최적화: 폰트 로딩 중에도 텍스트 표시
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "My Trip - 한국 관광지 정보 서비스",
    template: "%s | My Trip",
  },
  description:
    "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.",
  keywords: ["관광지", "여행", "한국", "지도", "검색", "관광정보", "여행지", "한국여행"],
  // 모바일 반응형 디자인을 위한 viewport 설정
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    type: "website",
    siteName: "My Trip",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Trip Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <PageTransition>{children}</PageTransition>
              <Footer />
            </div>
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
