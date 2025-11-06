/**
 * @file app/page.tsx
 * @description My Trip 홈페이지
 *
 * 한국 관광지 정보 서비스의 메인 페이지입니다.
 * PRD 2.1, 2.2, 2.3 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 히어로 섹션 (검색창 + 필터 버튼)
 * 2. 관광지 목록 (좌측 또는 상단)
 * 3. 네이버 지도 (우측 또는 하단)
 * 4. 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
 *
 * @dependencies
 * - components/header - 헤더 컴포넌트 (layout.tsx에서 통합)
 * - components/footer - 푸터 컴포넌트 (layout.tsx에서 통합)
 * - docs/prd.md - 프로젝트 요구사항
 * - docs/design.md - 디자인 가이드
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Map, List } from 'lucide-react';
import type { TourItem } from '@/lib/types/tour';
import { getAreaBasedList, searchKeyword as searchKeywordApi } from '@/actions/tour';
import { TourList } from '@/components/tour-list';
import { TourFilters, type FilterState } from '@/components/tour-filters';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Error } from '@/components/ui/error';
import { NaverMap } from '@/components/naver-map';
import { Pagination } from '@/components/pagination';

export default function Home() {
  // 모바일: 리스트/지도 탭 전환 상태
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // 리스트-지도 연동: 선택된 관광지 ID
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // 검색 키워드

  // 필터 상태
  const [filters, setFilters] = useState<FilterState>({
    areaCode: '1', // 기본값: 서울 (전체는 '')
    contentTypeId: '12', // 기본값: 관광지 (전체는 '')
    sortBy: 'latest',
  });

  // 관광지 목록 상태
  const [tours, setTours] = useState<TourItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20; // 페이지당 항목 수

  // 검색 또는 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, filters.areaCode, filters.contentTypeId]);

  // 검색, 필터, 페이지 변경 시 관광지 목록 로드
  useEffect(() => {
    async function loadTours() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('[Home] 관광지 목록 로드 시작...', { searchKeyword, filters, currentPage });
        
        // 필터 파라미터 설정
        // 빈 문자열('')이면 전체를 의미하므로 undefined로 변환
        const areaCode = filters.areaCode === '' ? undefined : filters.areaCode || '1';
        const contentTypeId = filters.contentTypeId === '' ? undefined : filters.contentTypeId;
        
        let result;
        
        // 검색 키워드가 있으면 검색 API 사용, 없으면 필터 API 사용
        if (searchKeyword.trim()) {
          console.log('[Home] 검색 모드:', searchKeyword, '페이지:', currentPage);
          result = await searchKeywordApi(
            searchKeyword.trim(),
            areaCode,
            contentTypeId,
            itemsPerPage,
            currentPage
          );
        } else {
          console.log('[Home] 필터 모드, 페이지:', currentPage);
          result = await getAreaBasedList(
            areaCode,
            contentTypeId,
            itemsPerPage,
            currentPage
          );
        }

        console.log('[Home] 관광지 목록 로드 완료:', result.items.length, '개 (전체:', result.totalCount, '개)');
        setTours(result.items);
        setTotalCount(result.totalCount || result.items.length); // totalCount가 없으면 items.length 사용
      } catch (err) {
        console.error('[Home] 관광지 목록 로드 실패:', err);
        let errorMessage = '관광지 목록을 불러오는 중 오류가 발생했습니다.';
        if (err instanceof Error) {
          errorMessage = (err as Error).message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String((err as { message: unknown }).message);
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, filters.areaCode, filters.contentTypeId, currentPage]); // 검색 키워드, 필터, 페이지 변경 시 재호출

  // 정렬된 관광지 목록 (클라이언트 사이드 정렬)
  // API에서 받은 데이터를 클라이언트에서 정렬
  // 참고: API에서 정렬 옵션을 지원하지 않으므로 클라이언트 사이드 정렬 사용
  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    
    if (filters.sortBy === 'latest') {
      // 최신순 (modifiedtime 기준, 내림차순)
      sorted.sort((a, b) => {
        const timeA = new Date(a.modifiedtime).getTime();
        const timeB = new Date(b.modifiedtime).getTime();
        return timeB - timeA;
      });
    } else if (filters.sortBy === 'name') {
      // 이름순 (가나다순)
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }
    
    return sorted;
  }, [tours, filters.sortBy]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 섹션 (선택 사항, design.md 참고) */}
      <section className="bg-gradient-to-br from-primary-blue/10 via-primary-teal/10 to-accent-orange/10 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              한국의 아름다운 관광지를 탐험하세요
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              전국 관광지 정보를 한눈에 확인하고, 지도에서 위치를 찾아보세요
            </p>
            
            {/* 큰 검색창 */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // 검색 실행 (useEffect가 자동으로 처리)
                }}
                className="relative flex-1"
              >
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="관광지명, 지역, 키워드로 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full h-14 rounded-full border border-input bg-background pl-12 pr-14 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 shadow-lg"
                  aria-label="관광지 검색"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="검색어 지우기"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 필터 영역 */}
      <TourFilters filters={filters} onFiltersChange={setFilters} />

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-64">
        {/* 모바일: 탭 전환 버튼 */}
        <div className="lg:hidden mb-6 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="목록 보기"
          >
            <List className="inline-block mr-2 h-4 w-4" />
            목록
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'map'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="지도 보기"
          >
            <Map className="inline-block mr-2 h-4 w-4" />
            지도
          </button>
        </div>

        {/* 데스크톱: 리스트 + 지도 분할 레이아웃 */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          {/* 좌측: 관광지 목록 영역 (50%) */}
          <div className="overflow-y-auto pr-4 max-h-[calc(2.5*(100vh-500px))]">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {searchKeyword ? `"${searchKeyword}" 검색 결과` : '관광지 목록'}
                </h2>
                {!isLoading && !error && totalCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    총 {totalCount.toLocaleString()}개
                  </span>
                )}
              </div>
              {isLoading ? (
                <ListSkeleton count={6} />
              ) : error ? (
                <Error
                  message={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    // 재시도 로직은 useEffect가 자동으로 처리
                    window.location.reload();
                  }}
                />
              ) : (
                <>
                  <TourList
                    tours={sortedTours}
                    searchKeyword={searchKeyword || undefined}
                    onTourClick={(tour) => {
                      // 리스트-지도 연동: 선택된 관광지로 지도 이동
                      setSelectedTourId(tour.contentid);
                    }}
                  />
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 우측: 네이버 지도 영역 (50%) */}
          <div className="border rounded-lg overflow-hidden bg-muted h-[calc(2.5*(100vh-500px))]">
            <NaverMap
              tours={sortedTours}
              selectedTourId={selectedTourId}
              onMarkerClick={(tour) => {
                // 마커 클릭 시 선택 상태 업데이트 (선택적)
                setSelectedTourId(tour.contentid);
              }}
              className="h-full"
            />
          </div>
        </div>

        {/* 모바일: 탭별 콘텐츠 표시 */}
        <div className="lg:hidden">
          {/* 목록 탭 */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {searchKeyword ? `"${searchKeyword}" 검색 결과` : '관광지 목록'}
                </h2>
                {!isLoading && !error && totalCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    총 {totalCount.toLocaleString()}개
                    {totalPages > 1 && (
                      <span className="ml-2">
                        (페이지 {currentPage} / {totalPages})
                      </span>
                    )}
                  </span>
                )}
              </div>
              {isLoading ? (
                <ListSkeleton count={6} />
              ) : error ? (
                <Error
                  message={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    // 재시도 로직은 useEffect가 자동으로 처리
                    window.location.reload();
                  }}
                />
              ) : (
                <>
                  <TourList tours={sortedTours} searchKeyword={searchKeyword || undefined} />
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 지도 탭 */}
          {activeTab === 'map' && (
            <div className="border rounded-lg overflow-hidden bg-muted min-h-[400px]">
              <NaverMap
                tours={sortedTours}
                selectedTourId={selectedTourId}
                onMarkerClick={(tour) => {
                  // 마커 클릭 시 선택 상태 업데이트 (선택적)
                  setSelectedTourId(tour.contentid);
                }}
                className="min-h-[400px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
