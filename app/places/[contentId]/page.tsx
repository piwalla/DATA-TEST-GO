/**
 * @file app/places/[contentId]/page.tsx
 * @description 관광지 상세페이지
 *
 * 한국 관광지 정보 서비스의 상세페이지입니다.
 * PRD 2.4 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 관광지 기본 정보 표시 (detailCommon2)
 * 2. 히어로 이미지 섹션
 * 3. 기본 레이아웃 구조 (데스크톱: 60% + 40%, 모바일: 단일 컬럼)
 * 4. 뒤로가기 버튼
 *
 * @dependencies
 * - actions/tour.ts - API 호출 함수들
 * - lib/types/tour.ts - 타입 정의
 * - lib/utils/tour-utils.ts - 데이터 정제 유틸리티
 * - docs/prd.md - 프로젝트 요구사항
 * - docs/design.md - 디자인 가이드
 */

import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getDetailCommon } from '@/actions/tour';
import { sanitizeOverview, extractHomepageUrl, formatAddress } from '@/lib/utils/tour-utils';
import { getContentTypeName } from '@/lib/types/tour';
import { Badge } from '@/components/ui/badge';
import { CopyAddressButton } from '@/components/tour-detail/copy-address-button';
import { DetailMap } from '@/components/tour-detail/detail-map';
import { ShareButton } from '@/components/tour-detail/share-button';
import { DetailIntro } from '@/components/tour-detail/detail-intro';
import { DetailGallery } from '@/components/tour-detail/detail-gallery';
import { getDetailIntro, getDetailImages } from '@/actions/tour';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * 동적 메타데이터 생성 (Open Graph 포함)
 * Next.js 15의 generateMetadata 함수 사용
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { contentId } = await params;

  try {
    const tourDetail = await getDetailCommon(contentId);
    if (!tourDetail) {
      return {
        title: '관광지를 찾을 수 없습니다 - My Trip',
        description: '요청하신 관광지 정보가 존재하지 않습니다.',
      };
    }

    console.log('[generateMetadata] 관광지 정보 조회 완료:', tourDetail.title);

    // 개요를 100자 이내로 제한
    const description = tourDetail.overview
      ? sanitizeOverview(tourDetail.overview).slice(0, 100).replace(/\n/g, ' ') + '...'
      : `${tourDetail.title} - 한국 관광지 정보`;

    // 현재 페이지 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/places/${contentId}`;

    return {
      title: `${tourDetail.title} - My Trip`,
      description,
      openGraph: {
        title: tourDetail.title,
        description,
        url,
        siteName: 'My Trip',
        images: tourDetail.firstimage
          ? [
              {
                url: tourDetail.firstimage,
                width: 1200,
                height: 630,
                alt: tourDetail.title,
              },
            ]
          : [],
        type: 'website',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: tourDetail.title,
        description,
        images: tourDetail.firstimage ? [tourDetail.firstimage] : [],
      },
    };
  } catch (error) {
    console.error('[generateMetadata] 오류:', error);
    return {
      title: '관광지 정보 - My Trip',
      description: '한국 관광지 정보 서비스',
    };
  }
}

/**
 * 관광지 상세페이지
 */
export default async function TourDetailPage({ params }: PageProps) {
  const { contentId } = await params;

  // API 호출
  let tourDetail = null;
  let tourIntro = null;
  let tourImages: any[] = [];
  let error: string | null = null;

  try {
    console.log('[TourDetailPage] 관광지 정보 조회 시작, contentId:', contentId);
    
    // 기본 정보 조회
    tourDetail = await getDetailCommon(contentId);
    
    if (!tourDetail) {
      console.warn('[TourDetailPage] 관광지 정보를 찾을 수 없음, contentId:', contentId);
      notFound();
    }

    console.log('[TourDetailPage] 기본 정보 조회 완료:', tourDetail.title);

    // 운영 정보 조회 (병렬 처리)
    const [introResult, imagesResult] = await Promise.allSettled([
      getDetailIntro(contentId, tourDetail.contenttypeid),
      getDetailImages(contentId),
    ]);

    if (introResult.status === 'fulfilled') {
      tourIntro = introResult.value;
      console.log('[TourDetailPage] 운영 정보 조회 완료');
    } else {
      console.error('[TourDetailPage] 운영 정보 조회 실패:', introResult.reason);
    }

    if (imagesResult.status === 'fulfilled') {
      tourImages = imagesResult.value || [];
      console.log('[TourDetailPage] 이미지 목록 조회 완료:', tourImages.length, '개');
    } else {
      console.error('[TourDetailPage] 이미지 목록 조회 실패:', imagesResult.reason);
    }
  } catch (err) {
    console.error('[TourDetailPage] API 호출 실패:', err);
    error = err instanceof Error ? err.message : '관광지 정보를 불러오는 중 오류가 발생했습니다.';
  }

  // 에러 처리
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-destructive mb-2">오류 발생</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/">
              <Button variant="outline">홈으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tourDetail) {
    notFound();
  }

  // 데이터 정제
  const homepageUrl = tourDetail.homepage ? extractHomepageUrl(tourDetail.homepage) : null;
  const overview = tourDetail.overview ? sanitizeOverview(tourDetail.overview) : null;
  const contentTypeName = getContentTypeName(tourDetail.contenttypeid);
  const fullAddress = formatAddress(tourDetail.addr1, tourDetail.addr2);

  // 현재 페이지 URL 생성 (공유 버튼용)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/places/${contentId}`;

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 영역 (뒤로가기 버튼 + 공유 버튼) */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookmarkButton contentId={contentId} size="sm" />
              <ShareButton url={shareUrl} />
            </div>
          </div>
        </div>
      </div>

      {/* 히어로 이미지 섹션 */}
      {tourDetail.firstimage && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <Image
            src={tourDetail.firstimage}
            alt={tourDetail.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
              <div className="flex-1">
                <Badge className="mb-3">{contentTypeName}</Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {tourDetail.title}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm md:text-base">{fullAddress}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <BookmarkButton contentId={contentId} size="md" />
                <ShareButton url={shareUrl} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-64">
        {/* 이미지가 없는 경우 제목 표시 */}
        {!tourDetail.firstimage && (
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge className="mb-3">{contentTypeName}</Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {tourDetail.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{fullAddress}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookmarkButton contentId={contentId} size="md" />
                <ShareButton url={shareUrl} />
              </div>
            </div>
          </div>
        )}

        {/* 데스크톱: 좌측 60% + 우측 40% 분할 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          {/* 좌측: 기본 정보 섹션 */}
          <div className="space-y-6">
            {/* 기본 정보 카드 */}
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">기본 정보</h2>

              {/* 주소 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">주소</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm md:text-base flex-1">{fullAddress}</p>
                  <CopyAddressButton address={fullAddress} />
                </div>
              </div>

              {/* 전화번호 */}
              {tourDetail.tel && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">전화번호</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={`tel:${tourDetail.tel}`}
                      className="text-sm md:text-base hover:text-primary transition-colors"
                    >
                      {tourDetail.tel}
                    </a>
                    <a href={`tel:${tourDetail.tel}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Phone className="h-4 w-4" />
                        전화
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* 홈페이지 */}
              {homepageUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">홈페이지</span>
                  </div>
                  <a
                    href={homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-primary hover:underline flex items-center gap-2"
                  >
                    {homepageUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* 개요 섹션 */}
            {overview && (
              <div className="bg-card rounded-xl border p-6">
                <h2 className="text-2xl font-semibold mb-4">개요</h2>
                <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                  {overview}
                </p>
              </div>
            )}

            {/* 이미지 갤러리 섹션 */}
            <DetailGallery
              images={tourImages}
              firstImage={tourDetail.firstimage}
              title={tourDetail.title}
            />
          </div>

          {/* 우측: 빠른 정보 섹션 */}
          <div className="space-y-6">
            {/* 빠른 정보 (운영 정보) */}
            {tourIntro && <DetailIntro intro={tourIntro} />}

            {/* 지도 섹션 */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
              <DetailMap tour={tourDetail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

