/**
 * @file components/tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 관광지 목록을 그리드 레이아웃으로 표시하는 컴포넌트입니다.
 * PRD 2.1, design.md 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 관광지 카드 그리드 레이아웃
 * 2. 반응형 디자인 (모바일/태블릿/데스크톱)
 * 3. 빈 목록 처리
 *
 * @dependencies
 * - components/tour-card.tsx - TourCard 컴포넌트
 * - lib/types/tour.ts - TourItem 타입
 * - docs/design.md - 디자인 가이드
 *
 * @see {@link /docs/prd.md#2.1-관광지-목록--지역타입-필터} - PRD 요구사항
 */

'use client';

import type { TourItem } from '@/lib/types/tour';
import { TourCard } from './tour-card';

interface TourListProps {
  tours: TourItem[];
  className?: string;
  searchKeyword?: string; // 검색 키워드 (선택적, 빈 목록 메시지 개선용)
}

/**
 * 관광지 목록 컴포넌트
 * @param tours - TourItem 배열
 * @param className - 추가 CSS 클래스
 * @param searchKeyword - 검색 키워드 (선택적)
 */
export function TourList({ tours, className, searchKeyword }: TourListProps) {
  // 빈 목록 처리
  if (tours.length === 0) {
    return (
      <div className={`text-center py-12 ${className || ''}`}>
        <p className="text-lg text-muted-foreground mb-2">
          {searchKeyword ? `"${searchKeyword}"에 대한 검색 결과가 없습니다` : '관광지가 없습니다'}
        </p>
        <p className="text-sm text-muted-foreground">
          {searchKeyword
            ? '다른 키워드로 검색하거나 필터를 조정해보세요'
            : '다른 지역이나 관광 타입을 선택해보세요'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}
      role="list"
      aria-label="관광지 목록"
    >
      {tours.map((tour) => (
        <div key={tour.contentid} role="listitem">
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
}

