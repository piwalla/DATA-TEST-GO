/**
 * @file app/robots.ts
 * @description Robots.txt 자동 생성
 *
 * Next.js 15 App Router의 Metadata API를 사용하여 robots.txt를 자동 생성합니다.
 * 검색 엔진 크롤링 설정과 sitemap URL을 지정합니다.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots}
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth-test/',
        '/map-test/',
        '/storage-test/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


