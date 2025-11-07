/**
 * @file app/stats/page.tsx
 * @description 통계 대시보드 페이지
 *
 * 로그인된 사용자 모두가 접근 가능한 통계 대시보드 페이지입니다.
 * 현재 수집 가능한 데이터(사용자 수, 북마크 통계)를 기반으로
 * 차트와 그래프를 포함한 시각화 대시보드를 제공합니다.
 *
 * 주요 기능:
 * 1. 인증 확인 (로그인된 사용자만 접근)
 * 2. 통계 데이터 조회 (Server Actions)
 * 3. 통계 컴포넌트 렌더링
 *
 * @dependencies
 * - actions/stats.ts - 통계 데이터 조회 Server Actions
 * - components/stats/ - 통계 컴포넌트들
 * - @clerk/nextjs - 인증 확인
 */

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import {
  getTotalUsers,
  getTotalBookmarks,
  getAverageBookmarksPerUser,
  getUserGrowthTrend,
  getBookmarkTrend,
  getPopularTouristSpots,
  getRecentUsers,
  getRecentBookmarks,
} from '@/actions/stats';
import { StatsSummary } from '@/components/stats/stats-summary';
import { UserGrowthChart } from '@/components/stats/user-growth-chart';
import { BookmarkTrendChart } from '@/components/stats/bookmark-trend-chart';
import { PopularSpotsChart } from '@/components/stats/popular-spots-chart';
import { RecentUsers } from '@/components/stats/recent-users';
import { RecentBookmarks } from '@/components/stats/recent-bookmarks';

/**
 * 통계 대시보드 페이지
 */
export default async function StatsPage() {
  // 인증 확인
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // 통계 데이터 조회 (병렬 처리)
  const [
    totalUsers,
    totalBookmarks,
    averageBookmarks,
    userGrowthDay,
    bookmarkTrendDay,
    popularSpots,
    recentUsers,
    recentBookmarks,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalBookmarks(),
    getAverageBookmarksPerUser(),
    getUserGrowthTrend('day'),
    getBookmarkTrend('day'),
    getPopularTouristSpots(10),
    getRecentUsers(10),
    getRecentBookmarks(10),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-64">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">통계 대시보드</h1>
          <p className="text-muted-foreground">
            서비스 사용 현황과 통계를 확인할 수 있습니다.
          </p>
        </div>

        {/* 요약 카드 */}
        <StatsSummary
          totalUsers={totalUsers}
          totalBookmarks={totalBookmarks}
          averageBookmarks={averageBookmarks}
        />

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 가입자 추이 차트 */}
          <div className="lg:col-span-2">
            <UserGrowthChart initialData={userGrowthDay} />
          </div>

          {/* 북마크 추이 차트 */}
          <div className="lg:col-span-2">
            <BookmarkTrendChart initialData={bookmarkTrendDay} />
          </div>

          {/* 인기 관광지 차트 */}
          <div className="lg:col-span-2">
            <PopularSpotsChart spots={popularSpots} />
          </div>
        </div>

        {/* 목록 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 최근 가입자 목록 */}
          <RecentUsers users={recentUsers} />

          {/* 최근 북마크 목록 */}
          <RecentBookmarks bookmarks={recentBookmarks} />
        </div>
      </div>
    </div>
  );
}

