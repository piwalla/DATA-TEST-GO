import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      // 한국관광공사 이미지 도메인
      { hostname: "tong.visitkorea.or.kr", protocol: "http" },
      { hostname: "tong.visitkorea.or.kr", protocol: "https" },
    ],
  },
};

export default nextConfig;
