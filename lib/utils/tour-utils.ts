/**
 * @file lib/utils/tour-utils.ts
 * @description 관광지 데이터 정제 유틸리티 함수
 *
 * 한국관광공사 API 응답 데이터를 프론트엔드에서 사용하기 쉽게 정제하는 함수들입니다.
 * API_TEST_RESULT.md의 주의사항을 반영하여 구현되었습니다.
 *
 * 주요 기능:
 * 1. HTML 태그 정제: `<br>` → `\n` 변환 (overview, usetime, restdate)
 * 2. 홈페이지 URL 추출: HTML 링크에서 URL 추출
 * 3. 선택적 필드 null 체크 헬퍼
 * 4. 좌표 타입 변환: string → number (parseFloat)
 *
 * @dependencies
 * - docs/API_TEST_RESULT.md - API 응답 구조 및 주의사항
 *
 * @see {@link /docs/API_TEST_RESULT.md} - API 테스트 결과 및 주의사항
 */

/**
 * HTML 태그를 정제하여 텍스트로 변환
 * `<br>` 태그는 줄바꿈(`\n`)으로 변환하고, 나머지 HTML 태그는 제거합니다.
 *
 * @param html - HTML 태그가 포함된 문자열
 * @returns 정제된 텍스트 문자열
 *
 * @example
 * ```typescript
 * sanitizeHtml('<p>안녕하세요<br>반갑습니다</p>')
 * // => '안녕하세요\n반갑습니다'
 * ```
 */
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return '';

  return html
    .replace(/<br\s*\/?>/gi, '\n') // <br> 또는 <br/> → 줄바꿈
    .replace(/<[^>]*>/g, '') // 나머지 HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // &nbsp; → 공백
    .replace(/&amp;/g, '&') // &amp; → &
    .replace(/&lt;/g, '<') // &lt; → <
    .replace(/&gt;/g, '>') // &gt; → >
    .replace(/&quot;/g, '"') // &quot; → "
    .replace(/&#39;/g, "'") // &#39; → '
    .trim();
}

/**
 * HTML 링크에서 URL을 추출합니다.
 * 형식: `<a href="..." target="_blank">...</a>`
 *
 * @param htmlLink - HTML 링크 문자열
 * @returns 추출된 URL 또는 null
 *
 * @example
 * ```typescript
 * extractHomepageUrl('<a href="https://example.com" target="_blank">홈페이지</a>')
 * // => 'https://example.com'
 * ```
 */
export function extractHomepageUrl(
  htmlLink: string | undefined | null
): string | null {
  if (!htmlLink) return null;

  // 정규식으로 href 속성 추출
  const match = htmlLink.match(/href=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  // href 속성이 없으면 전체 문자열이 URL일 수 있음
  const trimmed = htmlLink.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

/**
 * 선택적 필드가 존재하는지 확인하고 안전하게 반환합니다.
 *
 * @param value - 확인할 값
 * @param defaultValue - 값이 없을 때 반환할 기본값
 * @returns 값이 있으면 값, 없으면 기본값
 *
 * @example
 * ```typescript
 * safeGet(tourItem.addr2, '상세주소 없음')
 * // => '서울특별시 종로구...' 또는 '상세주소 없음'
 * ```
 */
export function safeGet<T>(
  value: T | undefined | null,
  defaultValue: T
): T {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value;
}

/**
 * 문자열 좌표를 숫자로 변환합니다.
 * 네이버 지도 API는 문자열도 처리 가능하지만, 숫자 연산이 필요한 경우 사용합니다.
 *
 * @param coord - 좌표 문자열 (예: "126.9846616856")
 * @returns 변환된 숫자 또는 null
 *
 * @example
 * ```typescript
 * parseCoordinate('126.9846616856')
 * // => 126.9846616856
 * ```
 */
export function parseCoordinate(
  coord: string | undefined | null
): number | null {
  if (!coord) return null;

  const parsed = parseFloat(coord);
  if (isNaN(parsed)) return null;

  return parsed;
}

/**
 * 좌표 쌍을 숫자로 변환합니다.
 *
 * @param mapx - 경도 문자열
 * @param mapy - 위도 문자열
 * @returns 변환된 좌표 객체 또는 null
 *
 * @example
 * ```typescript
 * parseCoordinates('126.9846616856', '37.5820858828')
 * // => { lng: 126.9846616856, lat: 37.5820858828 }
 * ```
 */
export function parseCoordinates(
  mapx: string | undefined | null,
  mapy: string | undefined | null
): { lng: number; lat: number } | null {
  const lng = parseCoordinate(mapx);
  const lat = parseCoordinate(mapy);

  if (lng === null || lat === null) return null;

  return { lng, lat };
}

/**
 * 관광지 개요를 정제하여 반환합니다.
 * HTML 태그를 제거하고 `<br>` 태그는 줄바꿈으로 변환합니다.
 *
 * @param overview - 개요 문자열 (HTML 태그 포함 가능)
 * @returns 정제된 개요 문자열
 */
export function sanitizeOverview(
  overview: string | undefined | null
): string {
  return sanitizeHtml(overview);
}

/**
 * 운영시간을 정제하여 반환합니다.
 * HTML 태그를 제거하고 `<br>` 태그는 줄바꿈으로 변환합니다.
 *
 * @param usetime - 운영시간 문자열 (HTML 태그 포함 가능)
 * @returns 정제된 운영시간 문자열
 */
export function sanitizeUseTime(
  usetime: string | undefined | null
): string {
  return sanitizeHtml(usetime);
}

/**
 * 휴무일을 정제하여 반환합니다.
 * HTML 태그를 제거하고 `<br>` 태그는 줄바꿈으로 변환합니다.
 *
 * @param restdate - 휴무일 문자열 (HTML 태그 포함 가능)
 * @returns 정제된 휴무일 문자열
 */
export function sanitizeRestDate(
  restdate: string | undefined | null
): string {
  return sanitizeHtml(restdate);
}

/**
 * 전화번호를 정리하여 반환합니다.
 * 공백과 하이픈을 정리하고, tel: 링크 형식으로 변환 가능한 형태로 반환합니다.
 *
 * @param tel - 전화번호 문자열
 * @returns 정리된 전화번호 문자열 또는 null
 */
export function sanitizeTel(tel: string | undefined | null): string | null {
  if (!tel) return null;

  // 공백 제거 및 정리
  return tel.trim().replace(/\s+/g, '');
}

/**
 * 주소를 정리하여 반환합니다.
 * addr1과 addr2를 결합하여 전체 주소를 반환합니다.
 *
 * @param addr1 - 기본 주소
 * @param addr2 - 상세 주소 (선택적)
 * @returns 전체 주소 문자열
 */
export function formatAddress(
  addr1: string | undefined | null,
  addr2?: string | undefined | null
): string {
  const baseAddr = addr1?.trim() || '';
  const detailAddr = addr2?.trim() || '';

  if (!baseAddr) return '주소 정보 없음';

  if (detailAddr) {
    return `${baseAddr} ${detailAddr}`;
  }

  return baseAddr;
}

