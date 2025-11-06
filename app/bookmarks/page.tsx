/**
 * @file app/bookmarks/page.tsx
 * @description 북마크 목록 페이지
 *
 * 사용자가 북마크한 관광지 목록을 표시하는 페이지입니다.
 * PRD 2.4.5 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 인증된 사용자만 접근 가능
 * 2. 북마크한 관광지 목록 표시
 * 3. 정렬 옵션 (최신순, 이름순, 지역별)
 * 4. 일괄 삭제 기능
 *
 * @dependencies
 * - lib/api/bookmarks.ts - 북마크 API 함수
 * - actions/tour.ts - 관광지 정보 API
 * - components/bookmarks/bookmark-list.tsx - 북마크 목록 컴포넌트
 * - @clerk/nextjs - 인증 확인
 */

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getUserBookmarks } from '@/lib/api/bookmarks';
import { getDetailCommon } from '@/actions/tour';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
import type { TourItem } from '@/lib/types/tour';

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

/**
 * 북마크 목록 페이지
 */
export default async function BookmarksPage({ searchParams }: PageProps) {
  // 인증 확인
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // 정렬 옵션 (기본값: 최신순)
  const { sort } = await searchParams;
  const sortBy = (sort === 'name' || sort === 'area' ? sort : 'latest') as 'latest' | 'name' | 'area';

  // 북마크 목록 조회
  const contentIds = await getUserBookmarks(sortBy);

  // 관광지 정보 조회 (병렬 처리)
  const tourItems: TourItem[] = [];
  const errors: string[] = [];

  await Promise.allSettled(
    contentIds.map(async (contentId) => {
      try {
        const detail = await getDetailCommon(contentId);
        if (detail) {
          // TourDetail을 TourItem으로 변환
          const tourItem: TourItem = {
            contentid: detail.contentid,
            contenttypeid: detail.contenttypeid,
            title: detail.title,
            addr1: detail.addr1,
            addr2: detail.addr2,
            areacode: '', // detailCommon2에는 areacode가 없으므로 빈 문자열
            mapx: detail.mapx,
            mapy: detail.mapy,
            modifiedtime: detail.modifiedtime || new Date().toISOString(),
            tel: detail.tel,
            firstimage: detail.firstimage,
            firstimage2: detail.firstimage2,
          };
          tourItems.push(tourItem);
        }
      } catch (err) {
        console.error(`[BookmarksPage] 관광지 정보 조회 실패 (contentId: ${contentId}):`, err);
        errors.push(contentId);
      }
    })
  );

  // 정렬 처리 (애플리케이션 레벨)
  const sortedItems = [...tourItems];
  if (sortBy === 'name') {
    sortedItems.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  } else if (sortBy === 'area') {
    // 지역별 정렬은 areacode가 필요하지만 detailCommon2에는 없으므로
    // 일단 이름순으로 정렬 (향후 개선 가능)
    sortedItems.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  }
  // 'latest'는 이미 getUserBookmarks에서 정렬됨

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-64">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">내 북마크</h1>
          <p className="text-muted-foreground">
            저장한 관광지를 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <BookmarkList
          tours={sortedItems}
          sortBy={sortBy}
          totalCount={contentIds.length}
        />
      </div>
    </div>
  );
}

