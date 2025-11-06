import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Trip - 한국 관광지 정보 서비스",
    template: "%s | My Trip",
  },
  description:
    "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스",
  keywords: ["관광지", "여행", "한국", "지도", "검색"],
  openGraph: {
    type: "website",
    siteName: "My Trip",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스",
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
      "한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스",
    images: ["/og-image.png"],
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
              <main className="flex-1 pb-64">{children}</main>
              <Footer />
            </div>
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
