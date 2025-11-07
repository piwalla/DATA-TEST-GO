/**
 * @file components/home-client.tsx
 * @description 홈페이지 클라이언트 컴포넌트
 *
 * 홈페이지의 클라이언트 사이드 로직을 담당하는 컴포넌트입니다.
 * app/page.tsx가 Server Component로 변경되면서 분리되었습니다.
 */

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Map, List } from 'lucide-react';
import type { TourItem } from '@/lib/types/tour';
import { getAreaBasedList, searchKeyword as searchKeywordApi } from '@/actions/tour';
import { TourList } from '@/components/tour-list';
import type { FilterState } from '@/components/tour-filters';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Error } from '@/components/ui/error';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 지도 컴포넌트 동적 import (코드 스플리팅)
const NaverMap = dynamic(
  () => import('@/components/naver-map').then((mod) => ({ default: mod.NaverMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

// 필터 컴포넌트 동적 import (코드 스플리팅)
const TourFilters = dynamic(
  () => import('@/components/tour-filters').then((mod) => ({ default: mod.TourFilters })),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-lg w-full"></div>
          <div className="h-10 bg-muted rounded-lg w-full"></div>
        </div>
      </div>
    ),
  }
);

// 페이지네이션 컴포넌트 동적 import (코드 스플리팅)
const Pagination = dynamic(
  () => import('@/components/pagination').then((mod) => ({ default: mod.Pagination })),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-4">
        <div className="animate-pulse h-10 w-64 bg-muted rounded-lg"></div>
      </div>
    ),
  }
);

export function HomeClient() {
  // 모바일: 리스트/지도 탭 전환 상태
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // 리스트-지도 연동: 선택된 관광지 ID
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  // 데스크톱 지도 lazy load를 위한 ref 및 상태
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 필터 상태
  const [filters, setFilters] = useState<FilterState>({
    areaCode: '1',
    contentTypeId: '12',
    sortBy: 'latest',
  });

  // 관광지 목록 상태
  const [tours, setTours] = useState<TourItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // 검색 또는 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, filters.areaCode, filters.contentTypeId]);

  // 데스크톱: 지도가 viewport에 들어올 때만 로드 (Intersection Observer)
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      return;
    }

    const mapContainer = mapContainerRef.current;
    if (!mapContainer) {
      return;
    }

    const rect = mapContainer.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadMap(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(mapContainer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 검색, 필터, 페이지 변경 시 관광지 목록 로드
  useEffect(() => {
    async function loadTours() {
      try {
        setIsLoading(true);
        setError(null);
        
        const areaCode = filters.areaCode === '' ? undefined : filters.areaCode || '1';
        const contentTypeId = filters.contentTypeId === '' ? undefined : filters.contentTypeId;
        
        let result;
        
        if (searchKeyword.trim()) {
          result = await searchKeywordApi(
            searchKeyword.trim(),
            areaCode,
            contentTypeId,
            itemsPerPage,
            currentPage
          );
        } else {
          result = await getAreaBasedList(
            areaCode,
            contentTypeId,
            itemsPerPage,
            currentPage
          );
        }

        setTours(result.items);
        setTotalCount(result.totalCount || result.items.length);
      } catch (err: unknown) {
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
  }, [searchKeyword, filters.areaCode, filters.contentTypeId, currentPage]);

  // 정렬된 관광지 목록
  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    
    if (filters.sortBy === 'latest') {
      sorted.sort((a, b) => {
        const timeA = new Date(a.modifiedtime).getTime();
        const timeB = new Date(b.modifiedtime).getTime();
        return timeB - timeA;
      });
    } else if (filters.sortBy === 'name') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }
    
    return sorted;
  }, [tours, filters.sortBy]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-blue/10 via-primary-teal/10 to-accent-orange/10 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              한국의 아름다운 관광지를 탐험하세요
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              전국 관광지 정보를 한눈에 확인하고, 지도에서 위치를 찾아보세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
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

      <TourFilters filters={filters} onFiltersChange={setFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-64">
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

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
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
                    window.location.reload();
                  }}
                />
              ) : (
                <>
                  <TourList
                    tours={sortedTours}
                    searchKeyword={searchKeyword || undefined}
                    onTourClick={(tour) => {
                      setSelectedTourId(tour.contentid);
                    }}
                  />
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

          <div
            ref={mapContainerRef}
            className="border rounded-lg overflow-hidden bg-muted h-[calc(2.5*(100vh-500px))]"
          >
            {shouldLoadMap ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full bg-muted">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
                    </div>
                  </div>
                }
              >
                <NaverMap
                  tours={sortedTours}
                  selectedTourId={selectedTourId}
                  onMarkerClick={(tour) => {
                    setSelectedTourId(tour.contentid);
                  }}
                  className="h-full"
                />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <div className="text-center">
                  <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">지도를 보려면 스크롤하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden">
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
                    window.location.reload();
                  }}
                />
              ) : (
                <>
                  <TourList tours={sortedTours} searchKeyword={searchKeyword || undefined} />
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

          {activeTab === 'map' && (
            <div className="border rounded-lg overflow-hidden bg-muted min-h-[400px]">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full bg-muted min-h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
                    </div>
                  </div>
                }
              >
                <NaverMap
                  tours={sortedTours}
                  selectedTourId={selectedTourId}
                  onMarkerClick={(tour) => {
                    setSelectedTourId(tour.contentid);
                  }}
                  className="min-h-[400px]"
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

