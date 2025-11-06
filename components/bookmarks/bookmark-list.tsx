/**
 * @file components/bookmarks/bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 북마크한 관광지 목록을 표시하고 관리하는 컴포넌트입니다.
 * PRD 2.4.5 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 북마크한 관광지 목록 표시
 * 2. 정렬 옵션
 * 3. 일괄 삭제 기능
 *
 * @dependencies
 * - components/tour-list.tsx - 관광지 목록 컴포넌트
 * - lib/api/bookmarks.ts - 북마크 API 함수
 * - @clerk/nextjs - 인증 확인
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourCard } from '@/components/tour-card';
import { removeBookmarks } from '@/lib/api/bookmarks';
import type { TourItem } from '@/lib/types/tour';
import type { SortOption } from '@/components/tour-filters';

interface BookmarkListProps {
  tours: TourItem[];
  sortBy: 'latest' | 'name' | 'area';
  totalCount: number;
}

/**
 * 북마크 목록 컴포넌트
 */
export function BookmarkList({ tours, sortBy: initialSortBy, totalCount }: BookmarkListProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy === 'area' ? 'name' : initialSortBy);

  // 정렬 변경 핸들러
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    // URL 쿼리 파라미터 업데이트
    const params = new URLSearchParams();
    if (newSort !== 'latest') {
      params.set('sort', newSort);
    }
    router.push(`/bookmarks?${params.toString()}`);
  };

  // 체크박스 토글
  const handleToggleSelect = (contentId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId);
    } else {
      newSelected.add(contentId);
    }
    setSelectedIds(newSelected);
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedIds.size === tours.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tours.map((tour) => tour.contentid)));
    }
  };

  // 일괄 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      return;
    }

    if (!confirm(`선택한 ${selectedIds.size}개의 북마크를 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await removeBookmarks(Array.from(selectedIds));
      if (result.success) {
        // 페이지 새로고침하여 목록 업데이트
        router.refresh();
        setSelectedIds(new Set());
      } else {
        alert(result.error || '북마크 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('[BookmarkList] 일괄 삭제 실패:', err);
      alert('북마크 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 빈 목록 처리
  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">북마크한 관광지가 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          관광지 상세페이지에서 북마크를 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 정렬 및 일괄 삭제 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            총 {totalCount.toLocaleString()}개
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 정렬 옵션 (간단한 버튼 형태) */}
          <div className="flex items-center gap-2 border rounded-md p-1">
            <Button
              variant={sortBy === 'latest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('latest')}
            >
              최신순
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('name')}
            >
              이름순
            </Button>
          </div>

          {/* 전체 선택/해제 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="gap-2"
          >
            {selectedIds.size === tours.length ? (
              <>
                <CheckSquare className="h-4 w-4" />
                전체 해제
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                전체 선택
              </>
            )}
          </Button>

          {/* 일괄 삭제 */}
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제 ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* 북마크 목록 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => {
          const isSelected = selectedIds.has(tour.contentid);
          return (
            <div key={tour.contentid} className="relative">
              {/* 체크박스 */}
              <div className="absolute top-2 left-2 z-10">
                <button
                  onClick={() => handleToggleSelect(tour.contentid)}
                  className={`p-2 rounded-md bg-background/80 backdrop-blur-sm border ${
                    isSelected
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                  aria-label={isSelected ? '선택 해제' : '선택'}
                >
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* 관크박스 오버레이 */}
              {isSelected && (
                <div className="absolute inset-0 z-10 bg-primary-blue/10 border-2 border-primary-blue rounded-xl pointer-events-none" />
              )}

              {/* 관광지 카드 */}
              <TourCard tour={tour} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

