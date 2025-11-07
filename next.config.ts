import type { NextConfig } from "next";

// 번들 분석 설정
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      // 한국관광공사 이미지 도메인
      { hostname: "tong.visitkorea.or.kr", protocol: "http" },
      { hostname: "tong.visitkorea.or.kr", protocol: "https" },
    ],
  },
  // 개발 환경에서 source maps 생성 (Best Practices 개선)
  productionBrowserSourceMaps: false, // 프로덕션에서는 비활성화 (보안 및 성능)
  // 개발 환경에서는 기본적으로 source maps가 생성됨
  
  // JavaScript 최적화 설정
  compiler: {
    // 프로덕션 빌드에서 console.log 제거 (에러와 경고는 유지)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // 에러와 경고는 유지
    } : false,
  },
};

export default withBundleAnalyzer(nextConfig);
