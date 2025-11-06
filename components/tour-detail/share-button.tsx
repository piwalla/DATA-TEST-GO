/**
 * @file components/tour-detail/share-button.tsx
 * @description 공유 버튼 컴포넌트
 *
 * 관광지 상세페이지 URL을 복사하는 공유 버튼입니다.
 * PRD 2.4.5 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. URL 복사 기능 (클립보드 API)
 * 2. 복사 완료 피드백 (버튼 텍스트 변경)
 *
 * @dependencies
 * - lucide-react - Share 아이콘
 * - components/ui/button - 버튼 컴포넌트
 */

'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  url: string;
  title?: string;
  className?: string;
}

/**
 * 공유 버튼 컴포넌트
 * URL을 클립보드에 복사합니다.
 */
export function ShareButton({ url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      alert('이 브라우저에서는 URL 복사 기능을 사용할 수 없습니다.');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // 2초 후 원래 상태로 복귀
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
      alert('URL 복사에 실패했습니다.');
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          복사됨!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          공유
        </>
      )}
    </Button>
  );
}

