/**
 * @file components/stats/stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 전체 사용자 수, 전체 북마크 수, 사용자당 평균 북마크 수를
 * 카드 형태로 표시하는 컴포넌트입니다.
 */

import { Users, Bookmark, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsSummaryProps {
  totalUsers: number;
  totalBookmarks: number;
  averageBookmarks: number;
}

export function StatsSummary({
  totalUsers,
  totalBookmarks,
  averageBookmarks,
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 전체 사용자 수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">명</p>
        </CardContent>
      </Card>

      {/* 전체 북마크 수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 북마크</CardTitle>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalBookmarks.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">개</p>
        </CardContent>
      </Card>

      {/* 사용자당 평균 북마크 수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">평균 북마크</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageBookmarks.toLocaleString(undefined, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">개/사용자</p>
        </CardContent>
      </Card>
    </div>
  );
}

