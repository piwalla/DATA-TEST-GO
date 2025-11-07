/**
 * @file actions/stats.ts
 * @description 통계 데이터 조회 Server Actions
 *
 * 통계 대시보드 페이지에서 사용할 통계 데이터를 조회하는 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 전체 사용자 수 조회
 * 2. 전체 북마크 수 조회
 * 3. 사용자당 평균 북마크 수 계산
 * 4. 가입자 추이 데이터 조회 (일별/주별/월별)
 * 5. 북마크 추이 데이터 조회 (일별/주별/월별)
 * 6. 인기 관광지 TOP 10 조회 (북마크 수 기준)
 * 7. 최근 가입자 목록 조회
 * 8. 최근 북마크 목록 조회
 *
 * @dependencies
 * - lib/supabase/server.ts - Server Component용 Supabase 클라이언트
 * - actions/tour.ts - 관광지 정보 API (관광지 이름 조회용)
 *
 * @see {@link /app/stats/page.tsx} - 통계 대시보드 페이지
 */

'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';

/**
 * 전체 사용자 수 조회
 * @returns 전체 사용자 수
 */
export async function getTotalUsers(): Promise<number> {
  try {
    const supabase = createClerkSupabaseClient();
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[getTotalUsers] Supabase 에러:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('[getTotalUsers] 예외 발생:', err);
    return 0;
  }
}

/**
 * 전체 북마크 수 조회
 * @returns 전체 북마크 수
 */
export async function getTotalBookmarks(): Promise<number> {
  try {
    const supabase = createClerkSupabaseClient();
    const { count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[getTotalBookmarks] Supabase 에러:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('[getTotalBookmarks] 예외 발생:', err);
    return 0;
  }
}

/**
 * 사용자당 평균 북마크 수 계산
 * @returns 사용자당 평균 북마크 수 (소수점 둘째 자리까지)
 */
export async function getAverageBookmarksPerUser(): Promise<number> {
  try {
    const totalUsers = await getTotalUsers();
    const totalBookmarks = await getTotalBookmarks();

    if (totalUsers === 0) {
      return 0;
    }

    return Math.round((totalBookmarks / totalUsers) * 100) / 100;
  } catch (err) {
    console.error('[getAverageBookmarksPerUser] 예외 발생:', err);
    return 0;
  }
}

/**
 * 가입자 추이 데이터 타입
 */
export interface UserGrowthData {
  date: string; // YYYY-MM-DD 형식
  count: number; // 해당 날짜의 가입자 수
}

/**
 * 날짜를 한국 시간대로 변환하여 포맷팅
 */
function formatDateToKST(date: Date, period: 'day' | 'week' | 'month'): string {
  // UTC를 KST로 변환 (+9시간)
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  
  if (period === 'day') {
    return kstDate.toISOString().split('T')[0]; // YYYY-MM-DD
  } else if (period === 'week') {
    // 주의 시작일 (월요일) 계산
    const day = kstDate.getUTCDay();
    const diff = kstDate.getUTCDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
    const monday = new Date(kstDate.setUTCDate(diff));
    return monday.toISOString().split('T')[0];
  } else {
    // 월별: YYYY-MM 형식
    const year = kstDate.getUTCFullYear();
    const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

/**
 * 가입자 추이 데이터 조회
 * @param period - 기간 ('day' | 'week' | 'month')
 * @returns 가입자 추이 데이터 배열
 */
export async function getUserGrowthTrend(
  period: 'day' | 'week' | 'month' = 'day'
): Promise<UserGrowthData[]> {
  try {
    const supabase = createClerkSupabaseClient();
    
    // 기간에 따라 조회 범위 결정
    let daysBack = 30;
    if (period === 'week') {
      daysBack = 12 * 7; // 12주
    } else if (period === 'month') {
      daysBack = 12 * 30; // 12개월
    }

    // 모든 사용자 데이터 조회 (created_at 포함)
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[getUserGrowthTrend] Supabase 에러:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 날짜별로 그룹화
    const grouped: Record<string, number> = {};
    
    data.forEach((user) => {
      const date = formatDateToKST(new Date(user.created_at), period);
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // 배열로 변환 및 정렬
    const result: UserGrowthData[] = Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  } catch (err) {
    console.error('[getUserGrowthTrend] 예외 발생:', err);
    return [];
  }
}

/**
 * 북마크 추이 데이터 타입
 */
export interface BookmarkTrendData {
  date: string; // YYYY-MM-DD 형식
  count: number; // 해당 날짜의 북마크 수
}

/**
 * 북마크 추이 데이터 조회
 * @param period - 기간 ('day' | 'week' | 'month')
 * @returns 북마크 추이 데이터 배열
 */
export async function getBookmarkTrend(
  period: 'day' | 'week' | 'month' = 'day'
): Promise<BookmarkTrendData[]> {
  try {
    const supabase = createClerkSupabaseClient();
    
    // 기간에 따라 조회 범위 결정
    let daysBack = 30;
    if (period === 'week') {
      daysBack = 12 * 7; // 12주
    } else if (period === 'month') {
      daysBack = 12 * 30; // 12개월
    }

    // 모든 북마크 데이터 조회 (created_at 포함)
    const { data, error } = await supabase
      .from('bookmarks')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[getBookmarkTrend] Supabase 에러:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 날짜별로 그룹화
    const grouped: Record<string, number> = {};
    
    data.forEach((bookmark) => {
      const date = formatDateToKST(new Date(bookmark.created_at), period);
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // 배열로 변환 및 정렬
    const result: BookmarkTrendData[] = Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  } catch (err) {
    console.error('[getBookmarkTrend] 예외 발생:', err);
    return [];
  }
}

/**
 * 인기 관광지 데이터 타입
 */
export interface PopularSpot {
  content_id: string;
  title: string; // API로 조회
  bookmark_count: number;
}

/**
 * 인기 관광지 TOP 10 조회 (북마크 수 기준)
 * @param limit - 조회할 개수 (기본값: 10)
 * @returns 인기 관광지 배열
 */
export async function getPopularTouristSpots(
  limit: number = 10
): Promise<PopularSpot[]> {
  try {
    const supabase = createClerkSupabaseClient();

    // 북마크 수가 많은 관광지 TOP 10 조회
    const { data, error } = await supabase
      .from('bookmarks')
      .select('content_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getPopularTouristSpots] Supabase 에러:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // content_id별로 그룹화하여 북마크 수 계산
    const grouped: Record<string, number> = {};
    data.forEach((bookmark) => {
      grouped[bookmark.content_id] = (grouped[bookmark.content_id] || 0) + 1;
    });

    // 북마크 수 기준으로 정렬
    const sorted = Object.entries(grouped)
      .map(([content_id, bookmark_count]) => ({
        content_id,
        bookmark_count,
      }))
      .sort((a, b) => b.bookmark_count - a.bookmark_count)
      .slice(0, limit);

    // 관광지 이름 조회 (병렬 처리)
    const { getDetailCommon } = await import('@/actions/tour');
    const spotsWithTitle: PopularSpot[] = [];

    await Promise.allSettled(
      sorted.map(async (spot) => {
        try {
          const detail = await getDetailCommon(spot.content_id);
          if (detail) {
            spotsWithTitle.push({
              content_id: spot.content_id,
              title: detail.title,
              bookmark_count: spot.bookmark_count,
            });
          }
        } catch (err) {
          console.error(
            `[getPopularTouristSpots] 관광지 정보 조회 실패 (contentId: ${spot.content_id}):`,
            err
          );
          // 이름 조회 실패 시 content_id만 표시
          spotsWithTitle.push({
            content_id: spot.content_id,
            title: `관광지 ${spot.content_id}`,
            bookmark_count: spot.bookmark_count,
          });
        }
      })
    );

    // 북마크 수 기준으로 다시 정렬 (API 호출 순서 보장)
    return spotsWithTitle.sort(
      (a, b) => b.bookmark_count - a.bookmark_count
    );
  } catch (err) {
    console.error('[getPopularTouristSpots] 예외 발생:', err);
    return [];
  }
}

/**
 * 최근 가입자 데이터 타입
 */
export interface RecentUser {
  name: string;
  created_at: string;
}

/**
 * 최근 가입자 목록 조회
 * @param limit - 조회할 개수 (기본값: 10)
 * @returns 최근 가입자 배열
 */
export async function getRecentUsers(
  limit: number = 10
): Promise<RecentUser[]> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .select('name, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getRecentUsers] Supabase 에러:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((user) => ({
      name: user.name,
      created_at: user.created_at,
    }));
  } catch (err) {
    console.error('[getRecentUsers] 예외 발생:', err);
    return [];
  }
}

/**
 * 최근 북마크 데이터 타입
 */
export interface RecentBookmark {
  content_id: string;
  title: string; // API로 조회
  user_name: string;
  created_at: string;
}

/**
 * 최근 북마크 목록 조회
 * @param limit - 조회할 개수 (기본값: 10)
 * @returns 최근 북마크 배열
 */
export async function getRecentBookmarks(
  limit: number = 10
): Promise<RecentBookmark[]> {
  try {
    const supabase = createClerkSupabaseClient();

    // 북마크와 사용자 정보 조인
    const { data, error } = await supabase
      .from('bookmarks')
      .select('content_id, created_at, users(name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getRecentBookmarks] Supabase 에러:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 관광지 이름 조회 (병렬 처리)
    const { getDetailCommon } = await import('@/actions/tour');
    const bookmarksWithTitle: RecentBookmark[] = [];

    await Promise.allSettled(
      data.map(async (bookmark) => {
        try {
          const detail = await getDetailCommon(bookmark.content_id);
          // users는 배열이거나 단일 객체일 수 있음
          const users = bookmark.users as { name: string } | { name: string }[] | null;
          const user = Array.isArray(users) ? users[0] : users;
          
          bookmarksWithTitle.push({
            content_id: bookmark.content_id,
            title: detail?.title || `관광지 ${bookmark.content_id}`,
            user_name: user?.name || '알 수 없음',
            created_at: bookmark.created_at,
          });
        } catch (err) {
          console.error(
            `[getRecentBookmarks] 관광지 정보 조회 실패 (contentId: ${bookmark.content_id}):`,
            err
          );
          const users = bookmark.users as { name: string } | { name: string }[] | null;
          const user = Array.isArray(users) ? users[0] : users;
          bookmarksWithTitle.push({
            content_id: bookmark.content_id,
            title: `관광지 ${bookmark.content_id}`,
            user_name: user?.name || '알 수 없음',
            created_at: bookmark.created_at,
          });
        }
      })
    );

    // 생성일시 기준으로 정렬 (최신순)
    return bookmarksWithTitle.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err) {
    console.error('[getRecentBookmarks] 예외 발생:', err);
    return [];
  }
}

