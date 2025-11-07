/**
 * @file app/loading.tsx
 * @description 전역 로딩 인디케이터
 *
 * Next.js App Router의 loading.tsx 파일입니다.
 * 라우트 전환 시 자동으로 표시되는 로딩 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 라우트 전환 시 자동 표시
 * 2. Loading 컴포넌트 활용
 * 3. design.md 스타일 준수
 *
 * @dependencies
 * - components/ui/loading.tsx - Loading 컴포넌트
 * - docs/design.md - 디자인 가이드
 */

import { Loading } from '@/components/ui/loading';

export default function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading size="lg" text="페이지 로딩 중..." />
    </div>
  );
}


