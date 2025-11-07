/**
 * @file components/tour-detail/detail-map-wrapper.tsx
 * @description DetailMap 컴포넌트를 동적 import로 래핑하는 Client Component
 *
 * Server Component에서 ssr: false를 사용할 수 없으므로,
 * 별도의 Client Component로 분리하여 코드 스플리팅을 구현합니다.
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { TourDetail } from '@/lib/types/tour';

// 지도 컴포넌트 동적 import (코드 스플리팅)
// ssr: false로 설정하여 서버 사이드 렌더링 제외 (네이버 지도 API는 클라이언트 전용)
const DetailMap = dynamic(
  () => import('@/components/tour-detail/detail-map').then((mod) => ({ default: mod.DetailMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

interface DetailMapWrapperProps {
  tour: TourDetail;
  className?: string;
}

/**
 * DetailMap을 동적 import로 래핑하는 컴포넌트
 */
export function DetailMapWrapper({ tour, className }: DetailMapWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
          </div>
        </div>
      }
    >
      <DetailMap tour={tour} className={className} />
    </Suspense>
  );
}


