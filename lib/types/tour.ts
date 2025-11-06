/**
 * @file lib/types/tour.ts
 * @description 한국관광공사 API 타입 정의
 *
 * 이 파일은 한국관광공사 OpenAPI의 응답 데이터 구조를 TypeScript 타입으로 정의합니다.
 * API_TEST_RESULT.md의 실제 테스트 결과와 PRD 5장의 데이터 구조를 기반으로 작성되었습니다.
 *
 * 주요 타입:
 * - TourItem: 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 * - TourDetail: 관광지 상세 정보 (detailCommon2 응답)
 * - TourIntro: 관광지 운영 정보 (detailIntro2 응답, Content Type별 차이)
 * - TourImage: 관광지 이미지 정보 (detailImage2 응답)
 * - TourApiResponse: API 응답 래퍼 타입
 *
 * @dependencies
 * - docs/API_TEST_RESULT.md - 실제 API 응답 구조
 * - docs/prd.md 5장 - 데이터 구조 명세
 *
 * @see {@link /docs/API_TEST_RESULT.md} - API 테스트 결과 및 주의사항
 * @see {@link /docs/prd.md#5-데이터-구조} - PRD 데이터 구조 명세
 */

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 * @see PRD 5.1, API_TEST_RESULT.md
 */
export interface TourItem {
  // 필수 필드
  addr1: string; // 주소
  areacode: string; // 지역코드
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  mapx: string; // 경도 (WGS84 형식, string 타입)
  mapy: string; // 위도 (WGS84 형식, string 타입)
  modifiedtime: string; // 수정일

  // 선택 필드 (일부 관광지에만 존재)
  addr2?: string; // 상세주소
  tel?: string; // 전화번호
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2

  // 카테고리
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류

  // 추가 필드 (API 응답에 포함되나 PRD에는 명시되지 않음)
  createdtime?: string; // 생성일
  sigungucode?: string; // 시군구코드
  zipcode?: string; // 우편번호
  mlevel?: string; // 지도레벨
  cpyrhtDivCd?: string; // 저작권 구분 코드
  // 법정동코드 관련 (향후 확장 가능)
  lDongRegnCd?: string;
  lDongSignguCd?: string;
  lclsSystm1?: string;
  lclsSystm2?: string;
  lclsSystm3?: string;
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 * @see PRD 5.2, API_TEST_RESULT.md
 */
export interface TourDetail {
  // 필수 필드
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  overview?: string; // 개요 (긴 설명, HTML 태그 포함 가능)
  mapx: string; // 경도 (WGS84 형식, string 타입)
  mapy: string; // 위도 (WGS84 형식, string 타입)

  // 선택 필드 (일부 관광지에만 존재)
  addr2?: string; // 상세주소
  zipcode?: string; // 우편번호
  tel?: string; // 전화번호
  homepage?: string; // 홈페이지 (HTML 링크 형식: <a href="..." target="_blank">...</a>)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2

  // 추가 필드
  createdtime?: string;
  modifiedtime?: string;
  sigungucode?: string;
  mlevel?: string;
  cpyrhtDivCd?: string;
}

/**
 * 관광지 운영 정보 (detailIntro2 응답)
 * Content Type ID에 따라 제공되는 필드가 다름
 * @see PRD 5.3, API_TEST_RESULT.md
 */
export interface TourIntro {
  // 필수 필드
  contentid: string;
  contenttypeid: string;

  // 공통 필드 (대부분의 Content Type에서 제공)
  usetime?: string; // 이용시간/운영시간 (HTML 태그 포함 가능, <br> 태그)
  restdate?: string; // 휴무일 (HTML 태그 포함 가능, <br> 태그)
  infocenter?: string; // 문의처
  parking?: string; // 주차 가능 여부

  // Content Type별 차이 (관광지(12)에서는 제공되지 않을 수 있음)
  chkpet?: string; // 반려동물 동반 가능 여부

  // 기타 타입별 필드 (향후 확장 가능)
  // 관광지(12), 문화시설(14), 음식점(39) 등 타입별로 다른 필드 제공
  [key: string]: string | undefined;
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 * @see API_TEST_RESULT.md
 */
export interface TourImage {
  originimgurl: string; // 원본 이미지 URL
  smallimageurl: string; // 썸네일 이미지 URL
  imgname: string; // 이미지 이름
}

/**
 * 지역 코드 정보 (areaCode2 응답)
 */
export interface AreaCode {
  rnum: number; // 순번
  code: string; // 지역코드
  name: string; // 지역명
}

/**
 * API 응답 헤더
 */
export interface TourApiHeader {
  resultCode: string; // 결과 코드 ("0000" = 성공)
  resultMsg: string; // 결과 메시지
}

/**
 * API 응답 바디 (단일 항목)
 */
export interface TourApiBodySingle<T> {
  items: {
    item: T; // 단일 항목
  };
  totalCount: number; // 전체 개수
  numOfRows: number; // 페이지당 항목 수
  pageNo: number; // 현재 페이지 번호
}

/**
 * API 응답 바디 (다중 항목)
 */
export interface TourApiBodyMultiple<T> {
  items: {
    item: T[]; // 항목 배열
  };
  totalCount: number; // 전체 개수
  numOfRows: number; // 페이지당 항목 수
  pageNo: number; // 현재 페이지 번호
}

/**
 * API 응답 래퍼 타입 (제네릭)
 * @template T - 응답 데이터 타입 (TourItem, TourDetail, TourIntro 등)
 */
export interface TourApiResponse<T> {
  response: {
    header: TourApiHeader;
    body: TourApiBodyMultiple<T> | TourApiBodySingle<T>;
  };
}

/**
 * Content Type ID 상수
 * @see PRD 4.4
 */
export const CONTENT_TYPE = {
  TOURIST_SPOT: '12', // 관광지
  CULTURAL_FACILITY: '14', // 문화시설
  FESTIVAL: '15', // 축제/행사
  TRAVEL_COURSE: '25', // 여행코스
  SPORTS: '28', // 레포츠
  ACCOMMODATION: '32', // 숙박
  SHOPPING: '38', // 쇼핑
  RESTAURANT: '39', // 음식점
} as const;

/**
 * Content Type ID 타입
 */
export type ContentTypeId = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

/**
 * Content Type ID → 이름 매핑
 * @param contentTypeId - Content Type ID
 * @returns Content Type 이름
 */
export function getContentTypeName(contentTypeId: string): string {
  const mapping: Record<string, string> = {
    [CONTENT_TYPE.TOURIST_SPOT]: '관광지',
    [CONTENT_TYPE.CULTURAL_FACILITY]: '문화시설',
    [CONTENT_TYPE.FESTIVAL]: '축제/행사',
    [CONTENT_TYPE.TRAVEL_COURSE]: '여행코스',
    [CONTENT_TYPE.SPORTS]: '레포츠',
    [CONTENT_TYPE.ACCOMMODATION]: '숙박',
    [CONTENT_TYPE.SHOPPING]: '쇼핑',
    [CONTENT_TYPE.RESTAURANT]: '음식점',
  };

  return mapping[contentTypeId] || '기타';
}

/**
 * Content Type ID 배열 (필터 옵션용)
 */
export const CONTENT_TYPE_OPTIONS = Object.entries(CONTENT_TYPE).map(
  ([key, value]) => ({
    id: value,
    name: getContentTypeName(value),
    key,
  })
);

