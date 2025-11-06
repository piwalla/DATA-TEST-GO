/**
 * @file components/tour-detail/detail-intro.tsx
 * @description 관광지 운영 정보 컴포넌트
 *
 * detailIntro2 API로부터 받은 운영 정보를 표시합니다.
 * PRD 2.4.2 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 운영시간/개장시간 표시
 * 2. 휴무일 표시
 * 3. 이용요금 표시 (있는 경우)
 * 4. 주차 가능 여부 표시
 * 5. 문의처 표시
 * 6. 반려동물 동반 가능 여부 표시 (있는 경우)
 *
 * @dependencies
 * - lib/types/tour.ts - TourIntro 타입
 * - lib/utils/tour-utils.ts - HTML 태그 정제 함수
 */

import { Clock, Calendar, DollarSign, Car, Phone, Heart } from 'lucide-react';
import type { TourIntro } from '@/lib/types/tour';

interface DetailIntroProps {
  intro: TourIntro;
}

/**
 * HTML 태그를 줄바꿈으로 변환
 * <br> 태그를 \n으로 변환하여 whitespace-pre-line로 표시
 */
function sanitizeHtmlText(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * 관광지 운영 정보 컴포넌트
 */
export function DetailIntro({ intro }: DetailIntroProps) {
  // 이용요금 필드 확인 (Content Type별로 필드명이 다를 수 있음)
  const usefee = (intro as any).usefee || (intro as any).usefeeleports || (intro as any).expguide || null;

  const hasInfo =
    intro.usetime ||
    intro.restdate ||
    usefee ||
    intro.parking ||
    intro.infocenter ||
    intro.chkpet;

  if (!hasInfo) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">빠른 정보</h2>

      <div className="space-y-4">
        {/* 운영시간 */}
        {intro.usetime && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">운영시간</span>
            </div>
            <p className="text-sm md:text-base whitespace-pre-line">
              {sanitizeHtmlText(intro.usetime)}
            </p>
          </div>
        )}

        {/* 휴무일 */}
        {intro.restdate && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">휴무일</span>
            </div>
            <p className="text-sm md:text-base whitespace-pre-line">
              {sanitizeHtmlText(intro.restdate)}
            </p>
          </div>
        )}

        {/* 이용요금 */}
        {usefee && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">이용요금</span>
            </div>
            <p className="text-sm md:text-base whitespace-pre-line">
              {sanitizeHtmlText(usefee)}
            </p>
          </div>
        )}

        {/* 주차 가능 여부 */}
        {intro.parking && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Car className="h-4 w-4" />
              <span className="font-medium">주차</span>
            </div>
            <p className="text-sm md:text-base">{intro.parking}</p>
          </div>
        )}

        {/* 문의처 */}
        {intro.infocenter && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="font-medium">문의처</span>
            </div>
            <p className="text-sm md:text-base">{intro.infocenter}</p>
          </div>
        )}

        {/* 반려동물 동반 가능 여부 */}
        {intro.chkpet && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="font-medium">반려동물 동반</span>
            </div>
            <p className="text-sm md:text-base">{intro.chkpet}</p>
          </div>
        )}
      </div>
    </div>
  );
}

