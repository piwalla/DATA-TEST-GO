/**
 * @file app/sitemap.ts
 * @description Sitemap 자동 생성
 *
 * Next.js 15 App Router의 Metadata API를 사용하여 sitemap.xml을 자동 생성합니다.
 * 정적 페이지와 제한된 동적 라우트를 포함합니다.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap}
 */

import { MetadataRoute } from 'next';
import { getAreaBasedList } from '@/actions/tour';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 동적 라우트: 제한된 수의 관광지 URL 생성
  // SEO 최적화를 위해 서울 지역 관광지 100개만 포함
  // 빌드 시간과 성능을 고려하여 제한된 수만 포함
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    console.log('[Sitemap] 동적 라우트 생성 시작...');
    
    // 서울 지역(areaCode: "1") 관광지 100개 조회
    const result = await getAreaBasedList('1', undefined, 100, 1);
    
    dynamicRoutes = result.items.map((item) => {
      // modifiedtime을 Date로 변환 (유효성 검사 포함)
      let lastModified: Date;
      if (item.modifiedtime) {
        const date = new Date(item.modifiedtime);
        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
          // 유효하지 않은 날짜면 현재 날짜 사용
          lastModified = new Date();
        } else {
          lastModified = date;
        }
      } else {
        lastModified = new Date();
      }

      return {
        url: `${baseUrl}/places/${item.contentid}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    console.log(`[Sitemap] 동적 라우트 ${dynamicRoutes.length}개 생성 완료`);
  } catch (error) {
    console.error('[Sitemap] 동적 라우트 생성 실패:', error);
    // 에러 발생 시에도 정적 페이지는 반환
  }

  return [...staticRoutes, ...dynamicRoutes];
}

