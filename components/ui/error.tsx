/**
 * @file components/ui/error.tsx
 * @description 에러 메시지 컴포넌트
 *
 * 에러 발생 시 표시할 에러 메시지 컴포넌트입니다.
 */

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  message: string;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function Error({ message, className, onRetry, retryText = '재시도' }: ErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/10 p-6',
        className
      )}
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">오류가 발생했습니다</p>
      </div>
      <p className="text-sm text-muted-foreground text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-primary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-blue/90"
        >
          {retryText}
        </button>
      )}
    </div>
  );
}

