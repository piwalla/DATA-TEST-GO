/**
 * @file components/tour-detail/detail-gallery.tsx
 * @description 관광지 이미지 갤러리 컴포넌트
 *
 * detailImage2 API로부터 받은 이미지 목록을 갤러리 형태로 표시합니다.
 * PRD 2.4.3 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 대표 이미지 + 서브 이미지들 표시
 * 2. 이미지 클릭 시 전체화면 모달
 * 3. 이미지 슬라이드 기능 (간단한 캐러셀)
 * 4. 이미지 없으면 기본 이미지 표시
 *
 * @dependencies
 * - lib/types/tour.ts - TourImage 타입
 * - components/ui/dialog - 모달 컴포넌트
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TourImage } from '@/lib/types/tour';

interface DetailGalleryProps {
  images: TourImage[];
  firstImage?: string; // detailCommon2의 firstimage (대표 이미지)
  title?: string; // 관광지명 (alt 텍스트용)
}

/**
 * 관광지 이미지 갤러리 컴포넌트
 */
export function DetailGallery({ images, firstImage, title }: DetailGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 대표 이미지를 첫 번째로 추가
  const allImages: Array<{ url: string; thumbnail?: string; name?: string }> = [];
  if (firstImage) {
    allImages.push({
      url: firstImage,
      thumbnail: firstImage,
      name: title || '대표 이미지',
    });
  }

  // detailImage2 이미지 추가
  images.forEach((img) => {
    // 대표 이미지와 중복되지 않는 경우만 추가
    if (img.originimgurl !== firstImage) {
      allImages.push({
        url: img.originimgurl,
        thumbnail: img.smallimageurl,
        name: img.imgname,
      });
    }
  });

  if (allImages.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-2xl font-semibold mb-4">이미지 갤러리</h2>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-sm text-muted-foreground">이미지가 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + allImages.length) % allImages.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % allImages.length);
    }
  };

  return (
    <>
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-2xl font-semibold mb-4">이미지 갤러리</h2>

        {/* 썸네일 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={img.thumbnail || img.url}
                alt={img.name || `${title || '관광지'} 갤러리 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={index < 4 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                fetchPriority={index < 4 ? 'high' : 'auto'}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* 전체화면 모달 */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={handleClose}
              aria-label="갤러리 닫기"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* 이전 버튼 */}
            {allImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* 모달 제목 (스크린 리더용) */}
            <h2 id="gallery-modal-title" className="sr-only">
              {title || '관광지'} 이미지 갤러리 ({selectedIndex + 1} / {allImages.length})
            </h2>

            {/* 이미지 */}
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={allImages[selectedIndex].url}
                alt={allImages[selectedIndex].name || `${title || '관광지'} 갤러리 이미지`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* 다음 버튼 */}
            {allImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* 이미지 인덱스 표시 */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

