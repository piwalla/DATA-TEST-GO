/**
 * @file app/places/[contentId]/not-found.tsx
 * @description 관광지 상세페이지 404 에러 페이지
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">관광지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            요청하신 관광지 정보가 존재하지 않거나 삭제되었습니다.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

