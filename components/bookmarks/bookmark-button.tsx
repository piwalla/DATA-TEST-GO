/**
 * @file components/bookmarks/bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 관광지를 북마크하거나 북마크를 해제하는 버튼입니다.
 * PRD 2.4.5 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 별 아이콘 (채워짐/비어있음)
 * 2. 클릭 시 북마크 추가/제거
 * 3. 로딩 상태 표시
 * 4. 인증되지 않은 사용자 처리
 *
 * @dependencies
 * - lib/api/bookmarks.ts - 북마크 API 함수
 * - @clerk/nextjs - 인증 상태 확인
 * - lucide-react - Star 아이콘
 * - components/ui/button - 버튼 컴포넌트
 */

'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { addBookmark, removeBookmark, getBookmarkStatus } from '@/lib/api/bookmarks';

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 북마크 버튼 컴포넌트
 * @param contentId - 관광지 contentId
 * @param className - 추가 CSS 클래스
 * @param size - 버튼 크기
 */
export function BookmarkButton({ contentId, className, size = 'md' }: BookmarkButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    async function checkBookmarkStatus() {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const status = await getBookmarkStatus(contentId);
        setIsBookmarked(status);
      } catch (err) {
        console.error('[BookmarkButton] 북마크 상태 확인 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkBookmarkStatus();
  }, [contentId, isSignedIn]);

  // 북마크 토글 핸들러
  const handleToggle = async () => {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setIsToggling(true);

    try {
      if (isBookmarked) {
        // 북마크 제거
        const result = await removeBookmark(contentId);
        if (result.success) {
          setIsBookmarked(false);
        } else {
          console.error('[BookmarkButton] 북마크 제거 실패:', result.error);
          alert(result.error || '북마크 제거에 실패했습니다.');
        }
      } else {
        // 북마크 추가
        const result = await addBookmark(contentId);
        if (result.success) {
          setIsBookmarked(true);
        } else {
          console.error('[BookmarkButton] 북마크 추가 실패:', result.error);
          alert(result.error || '북마크 추가에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('[BookmarkButton] 북마크 토글 실패:', err);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setIsToggling(false);
    }
  };

  // 버튼 크기 스타일
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading || isToggling}
      className={`${sizeClasses[size]} ${className || ''}`}
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
      title={isBookmarked ? '북마크 해제' : '북마크 추가'}
    >
      {isLoading || isToggling ? (
        <div className={`${iconSizes[size]} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      ) : (
        <Star
          className={iconSizes[size]}
          fill={isBookmarked ? 'currentColor' : 'none'}
          strokeWidth={isBookmarked ? 0 : 1.5}
        />
      )}
    </Button>
  );
}

