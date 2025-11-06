/**
 * @file components/tour-detail/copy-address-button.tsx
 * @description 주소 복사 버튼 컴포넌트
 *
 * 클립보드 API를 사용하여 주소를 복사하는 클라이언트 컴포넌트입니다.
 */

'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CopyAddressButtonProps {
  address: string;
}

export function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(address);
        console.log('[CopyAddressButton] 주소 복사 완료');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('[CopyAddressButton] 주소 복사 실패:', err);
        alert('주소 복사에 실패했습니다.');
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-2 shrink-0"
        aria-live="polite"
        aria-label={copied ? '주소가 복사되었습니다' : '주소 복사'}
      >
        <Copy className="h-4 w-4" />
        {copied ? '복사됨!' : '복사'}
      </Button>

      {copied && (
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1.5 text-xs text-white shadow-md whitespace-nowrap min-w-[200px] text-center"
          role="status"
          aria-live="polite"
        >
          주소가 복사되었습니다
        </div>
      )}
    </div>
  );
}

