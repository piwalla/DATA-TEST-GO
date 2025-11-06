/**
 * @file components/pagination.tsx
 * @description 페이지네이션 컴포넌트
 *
 * 관광지 목록 페이지네이션을 위한 컴포넌트입니다.
 * PRD 2.6 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 페이지 번호 표시 및 이동
 * 2. 이전/다음 페이지 버튼
 * 3. 첫 페이지/마지막 페이지 이동
 * 4. 현재 페이지 하이라이트
 *
 * @dependencies
 * - components/ui/button - 버튼 컴포넌트
 */

'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 페이지네이션 컴포넌트
 * @param currentPage - 현재 페이지 번호 (1부터 시작)
 * @param totalPages - 전체 페이지 수
 * @param onPageChange - 페이지 변경 콜백
 * @param className - 추가 CSS 클래스
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // 페이지가 1개 이하면 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  // 표시할 페이지 번호 계산 (최대 7개)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // 전체 페이지가 7개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 페이지 표시
      if (currentPage <= 4) {
        // 앞부분: 1, 2, 3, 4, 5, ..., 마지막
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 뒷부분: 1, ..., 마지막-4, 마지막-3, 마지막-2, 마지막-1, 마지막
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간: 1, ..., 현재-1, 현재, 현재+1, ..., 마지막
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ''}`}>
      {/* 첫 페이지로 이동 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="첫 페이지로 이동"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* 이전 페이지로 이동 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지로 이동"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 페이지 번호 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            aria-label={`${pageNum}페이지로 이동`}
            aria-current={isActive ? 'page' : undefined}
            className={isActive ? 'font-semibold' : ''}
          >
            {pageNum}
          </Button>
        );
      })}

      {/* 다음 페이지로 이동 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지로 이동"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 마지막 페이지로 이동 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="마지막 페이지로 이동"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

