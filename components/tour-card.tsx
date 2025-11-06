/**
 * @file components/tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 관광지 목록에서 개별 관광지를 표시하는 카드 컴포넌트입니다.
 * PRD 2.1, design.md 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 썸네일 이미지 표시 (기본 이미지 처리, 16:9 비율)
 * 2. 관광지명, 주소, 관광 타입 뱃지 표시
 * 3. 클릭 시 상세페이지 이동
 * 4. design.md 스타일 적용 (호버 효과, rounded-xl, shadow-md)
 *
 * @dependencies
 * - lib/types/tour.ts - TourItem 타입
 * - lib/utils/tour-utils.ts - formatAddress 함수
 * - components/ui/badge.tsx - 뱃지 컴포넌트
 * - docs/design.md - 디자인 가이드
 *
 * @see {@link /docs/prd.md#2.1-관광지-목록--지역타입-필터} - PRD 요구사항
 * @see {@link /docs/design.md} - 디자인 가이드
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { TourItem } from '@/lib/types/tour';
import { getContentTypeName } from '@/lib/types/tour';
import { formatAddress } from '@/lib/utils/tour-utils';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: TourItem;
  onClick?: () => void; // 추가 클릭 핸들러 (리스트-지도 연동용, 선택적)
}

/**
 * 관광지 카드 컴포넌트
 * @param tour - TourItem 객체
 * @param onClick - 추가 클릭 핸들러 (선택적, 리스트-지도 연동용)
 */
export function TourCard({ tour, onClick }: TourCardProps) {
  // 이미지 URL 처리 (firstimage 또는 firstimage2)
  const imageUrl = tour.firstimage || tour.firstimage2;
  const hasImage = !!imageUrl;

  // 주소 포맷팅
  const address = formatAddress(tour.addr1, tour.addr2);

  // 관광 타입 이름
  const contentTypeName = getContentTypeName(tour.contenttypeid);

  return (
    <Link
      href={`/places/${tour.contentid}`}
      className="group block rounded-xl shadow-md overflow-hidden bg-card border border-border hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
      aria-label={`${tour.title} 상세보기`}
      onClick={onClick} // 리스트-지도 연동용 클릭 핸들러
    >
      {/* 이미지 영역 (16:9 비율) */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-blue/20 to-primary-teal/20">
            <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>

      {/* 카드 내용 영역 */}
      <div className="p-4 space-y-3">
        {/* 관광지명 */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary-blue transition-colors">
          {tour.title}
        </h3>

        {/* 주소 */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* 관광 타입 뱃지 */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {contentTypeName}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

