import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  console.log('[NotFound] 404 at root level');
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-card border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">페이지를 찾을 수 없어요</h1>
        <p className="text-muted-foreground text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
        <div className="pt-2">
          <Button asChild>
            <Link href="/">홈으로 가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


