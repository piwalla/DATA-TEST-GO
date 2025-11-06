'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.group('[App Error Boundary]');
    console.error('[Error] message:', error?.message);
    if (error?.digest) console.log('[Error] digest:', error.digest);
    console.groupEnd();
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-card border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">문제가 발생했어요</h1>
        <p className="text-muted-foreground text-sm">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침을 해보세요.
        </p>
        {error?.message && (
          <p className="text-xs text-muted-foreground break-words">
            오류 메시지: {error.message}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()}>다시 시도</Button>
          <Button variant="outline" onClick={() => location.reload()}>새로고침</Button>
        </div>
      </div>
    </div>
  );
}


