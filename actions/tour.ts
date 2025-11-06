/**
 * @file actions/tour.ts
 * @description 한국관광공사 API Server Actions
 *
 * 한국관광공사 OpenAPI를 호출하는 Server Actions입니다.
 * Next.js 15의 Server Actions를 사용하여 서버 사이드에서 API를 호출합니다.
 *
 * 주요 기능:
 * 1. 지역코드 조회 (areaCode2)
 * 2. 지역 기반 관광정보 조회 (areaBasedList2)
 * 3. 키워드 검색 (searchKeyword2)
 * 4. 공통 정보 조회 (detailCommon2)
 * 5. 소개 정보 조회 (detailIntro2)
 * 6. 이미지 목록 조회 (detailImage2)
 *
 * @dependencies
 * - lib/types/tour.ts - 타입 정의
 * - docs/API_TEST_RESULT.md - API 엔드포인트 정보
 *
 * @see {@link /docs/API_TEST_RESULT.md} - API 테스트 결과
 * @see {@link /docs/prd.md#4-api-명세} - API 명세
 */

'use server';

import type {
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  AreaCode,
  TourApiResponse,
} from '@/lib/types/tour';

/**
 * API Base URL
 */
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

/**
 * API 키 가져오기 (환경변수)
 */
function getApiKey(): string {
  const key =
    process.env.NEXT_PUBLIC_TOUR_API_KEY || process.env.TOUR_API_KEY;
  if (!key) {
    throw new Error('TOUR_API_KEY 환경변수가 설정되지 않았습니다.');
  }
  return key;
}

/**
 * 공통 파라미터 생성
 */
function getCommonParams(): Record<string, string> {
  return {
    serviceKey: getApiKey(),
    MobileOS: 'ETC',
    MobileApp: 'MyTrip',
    _type: 'json',
  };
}

/**
 * API 호출 헬퍼 함수
 */
async function fetchTourApi<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<TourApiResponse<T>> {
  const commonParams = getCommonParams();
  const allParams = { ...commonParams, ...params };

  const queryString = new URLSearchParams(
    Object.entries(allParams).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const url = `${BASE_URL}${endpoint}?${queryString}`;

  console.log(`[Tour API] 호출: ${endpoint}`);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const data: TourApiResponse<T> = await response.json();

    // API 응답 코드 확인
    if (data.response.header.resultCode !== '0000') {
      throw new Error(
        `API 오류: ${data.response.header.resultCode} - ${data.response.header.resultMsg}`
      );
    }

    return data;
  } catch (error) {
    console.error(`[Tour API] 에러 (${endpoint}):`, error);
    throw error;
  }
}

/**
 * 지역코드 조회
 * @param numOfRows - 페이지당 항목 수 (기본값: 20)
 * @param pageNo - 페이지 번호 (기본값: 1)
 * @returns 지역코드 목록
 */
export async function getAreaCodes(
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<AreaCode[]> {
  const response = await fetchTourApi<AreaCode>('/areaCode2', {
    numOfRows,
    pageNo,
  });

  const items = response.response.body.items;
  if (Array.isArray(items.item)) {
    return items.item;
  }
  return items.item ? [items.item] : [];
}

/**
 * 지역 기반 관광정보 조회
 * @param areaCode - 지역코드 (예: "1" = 서울)
 * @param contentTypeId - 콘텐츠 타입 ID (예: "12" = 관광지)
 * @param numOfRows - 페이지당 항목 수 (기본값: 20)
 * @param pageNo - 페이지 번호 (기본값: 1)
 * @returns 관광지 목록
 */
export async function getAreaBasedList(
  areaCode: string,
  contentTypeId?: string,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<{ items: TourItem[]; totalCount: number }> {
  const params: Record<string, string | number> = {
    areaCode,
    numOfRows,
    pageNo,
  };

  if (contentTypeId) {
    params.contentTypeId = contentTypeId;
  }

  const response = await fetchTourApi<TourItem>('/areaBasedList2', params);

  const items = response.response.body.items;
  const itemArray = Array.isArray(items.item) ? items.item : items.item ? [items.item] : [];

  return {
    items: itemArray,
    totalCount: items.totalCount,
  };
}

/**
 * 키워드 검색
 * @param keyword - 검색 키워드 (한글 인코딩 자동 처리)
 * @param areaCode - 지역코드 (선택적)
 * @param contentTypeId - 콘텐츠 타입 ID (선택적)
 * @param numOfRows - 페이지당 항목 수 (기본값: 20)
 * @param pageNo - 페이지 번호 (기본값: 1)
 * @returns 검색 결과 목록
 */
export async function searchKeyword(
  keyword: string,
  areaCode?: string,
  contentTypeId?: string,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<{ items: TourItem[]; totalCount: number }> {
  const params: Record<string, string | number> = {
    keyword: encodeURIComponent(keyword), // 한글 인코딩 필수
    numOfRows,
    pageNo,
  };

  if (areaCode) {
    params.areaCode = areaCode;
  }

  if (contentTypeId) {
    params.contentTypeId = contentTypeId;
  }

  const response = await fetchTourApi<TourItem>('/searchKeyword2', params);

  const items = response.response.body.items;
  const itemArray = Array.isArray(items.item) ? items.item : items.item ? [items.item] : [];

  return {
    items: itemArray,
    totalCount: items.totalCount,
  };
}

/**
 * 공통 정보 조회 (상세페이지 기본 정보)
 * @param contentId - 콘텐츠 ID
 * @returns 관광지 상세 정보
 */
export async function getDetailCommon(
  contentId: string
): Promise<TourDetail | null> {
  const response = await fetchTourApi<TourDetail>('/detailCommon2', {
    contentId,
    defaultYN: 'Y',
    overviewYN: 'Y',
    addrinfoYN: 'Y',
    homepageYN: 'Y',
    mapinfoYN: 'Y',
  });

  const items = response.response.body.items;
  const item = Array.isArray(items.item) ? items.item[0] : items.item;

  return item || null;
}

/**
 * 소개 정보 조회 (상세페이지 운영 정보)
 * @param contentId - 콘텐츠 ID
 * @param contentTypeId - 콘텐츠 타입 ID
 * @returns 관광지 운영 정보
 */
export async function getDetailIntro(
  contentId: string,
  contentTypeId: string
): Promise<TourIntro | null> {
  const response = await fetchTourApi<TourIntro>('/detailIntro2', {
    contentId,
    contentTypeId,
  });

  const items = response.response.body.items;
  const item = Array.isArray(items.item) ? items.item[0] : items.item;

  return item || null;
}

/**
 * 이미지 목록 조회 (상세페이지 갤러리)
 * @param contentId - 콘텐츠 ID
 * @returns 이미지 목록
 */
export async function getDetailImages(
  contentId: string
): Promise<TourImage[]> {
  const response = await fetchTourApi<TourImage>('/detailImage2', {
    contentId,
    imageYN: 'Y',
  });

  const items = response.response.body.items;
  if (Array.isArray(items.item)) {
    return items.item;
  }
  return items.item ? [items.item] : [];
}

