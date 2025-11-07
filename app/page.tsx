/**
 * @file app/page.tsx
 * @description My Trip 홈페이지
 *
 * 한국 관광지 정보 서비스의 메인 페이지입니다.
 * PRD 2.1, 2.2, 2.3 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 히어로 섹션 (검색창 + 필터 버튼)
 * 2. 관광지 목록 (좌측 또는 상단)
 * 3. 네이버 지도 (우측 또는 하단)
 * 4. 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
 *
 * @dependencies
 * - components/home-client.tsx - 클라이언트 사이드 로직
 * - docs/prd.md - 프로젝트 요구사항
 * - docs/design.md - 디자인 가이드
 */

import type { Metadata } from 'next';
import { HomeClient } from '@/components/home-client';

export const metadata: Metadata = {
  title: 'My Trip - 한국 관광지 정보 서비스',
  description:
    '한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.',
  keywords: ['관광지', '여행', '한국', '지도', '검색', '관광정보', '여행지', '한국여행'],
  openGraph: {
    title: 'My Trip - 한국 관광지 정보 서비스',
    description:
      '한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.',
    type: 'website',
    siteName: 'My Trip',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Trip - 한국 관광지 정보 서비스',
    description:
      '한국관광공사 공공 API를 활용한 전국 관광지 정보 검색 및 지도 서비스. 지역별, 타입별 필터링과 네이버 지도 연동으로 원하는 관광지를 쉽게 찾아보세요.',
  },
};

export default function Home() {
  return <HomeClient />;
}
