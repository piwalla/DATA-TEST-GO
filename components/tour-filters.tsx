/**
 * @file components/tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 지역, 관광 타입, 정렬 옵션을 선택할 수 있는 필터 컴포넌트입니다.
 * PRD 2.1, design.md 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 지역 필터 (시/도 선택)
 * 2. 관광 타입 필터 (Content Type ID 선택)
 * 3. 정렬 옵션 (최신순, 이름순)
 * 4. 필터 초기화 버튼
 * 5. Sticky 필터 영역 (스크롤 시 상단 고정)
 *
 * @dependencies
 * - actions/tour.ts - getAreaCodes API
 * - lib/types/tour.ts - AreaCode, CONTENT_TYPE_OPTIONS
 * - components/ui/button.tsx - 버튼 컴포넌트
 * - docs/design.md - 디자인 가이드
 *
 * @see {@link /docs/prd.md#2.1-관광지-목록--지역타입-필터} - PRD 요구사항
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin, Filter, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { AreaCode } from '@/lib/types/tour';
import { CONTENT_TYPE_OPTIONS } from '@/lib/types/tour';
import { getAreaCodes } from '@/actions/tour';

export type SortOption = 'latest' | 'name';

export interface FilterState {
  areaCode: string; // '' = 전체
  contentTypeId: string; // '' = 전체
  sortBy: SortOption;
}

interface TourFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

/**
 * 관광지 필터 컴포넌트
 * @param filters - 현재 필터 상태
 * @param onFiltersChange - 필터 변경 콜백
 * @param className - 추가 CSS 클래스
 */
export function TourFilters({
  filters,
  onFiltersChange,
  className,
}: TourFiltersProps) {
  // 지역 목록 상태
  const [areaCodes, setAreaCodes] = useState<AreaCode[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  // 지역 목록 로드
  useEffect(() => {
    async function loadAreaCodes() {
      try {
        setIsLoadingAreas(true);
        console.log('[TourFilters] 지역 목록 로드 시작...');
        const data = await getAreaCodes(50, 1); // 최대 50개 지역
        console.log('[TourFilters] 지역 목록 로드 완료:', data.length, '개');
        setAreaCodes(data);
      } catch (err) {
        console.error('[TourFilters] 지역 목록 로드 실패:', err);
      } finally {
        setIsLoadingAreas(false);
      }
    }

    loadAreaCodes();
  }, []);

  // 필터 변경 핸들러
  const handleAreaChange = (areaCode: string) => {
    onFiltersChange({ ...filters, areaCode });
  };

  const handleContentTypeChange = (contentTypeId: string) => {
    onFiltersChange({ ...filters, contentTypeId });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  // 필터 초기화
  const handleReset = () => {
    onFiltersChange({
      areaCode: '',
      contentTypeId: '',
      sortBy: 'latest',
    });
  };

  // 필터가 적용되었는지 확인
  const hasActiveFilters =
    filters.areaCode !== '' || filters.contentTypeId !== '';

  return (
    <div
      className={`sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4 ${className || ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* 필터 제목 */}
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Filter className="h-5 w-5" />
            <span>필터</span>
          </div>

          {/* 지역 필터 */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="area-filter" className="sr-only">
              지역 선택
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="area-filter"
                value={filters.areaCode}
                onChange={(e) => handleAreaChange(e.target.value)}
                disabled={isLoadingAreas}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="지역 선택"
              >
                <option value="">전체 지역</option>
                {areaCodes.map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 관광 타입 필터 */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="content-type-filter" className="sr-only">
              관광 타입 선택
            </Label>
            <select
              id="content-type-filter"
              value={filters.contentTypeId}
              onChange={(e) => handleContentTypeChange(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              aria-label="관광 타입 선택"
            >
              <option value="">전체 타입</option>
              {CONTENT_TYPE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 옵션 */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="sort-filter" className="sr-only">
              정렬 선택
            </Label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="sort-filter"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                aria-label="정렬 선택"
              >
                <option value="latest">최신순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
              aria-label="필터 초기화"
            >
              <X className="h-4 w-4" />
              초기화
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

