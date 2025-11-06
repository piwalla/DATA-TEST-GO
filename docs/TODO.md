# My Trip 개발 TODO

한국 관광지 정보 서비스 개발 작업 목록

> **참고 문서**: [PRD](./prd.md) | [디자인 가이드](./design.md) | [사용자 플로우](./reference/mermaid.md) | [데이터베이스 스키마](../supabase/migrations/supabase.sql)

---

## Phase 1: 기본 구조 & 공통 설정

### 프로젝트 셋업
- [ ] 프로젝트 초기 설정 확인 (Next.js 15, TypeScript, Tailwind CSS v4)
- [ ] 환경 변수 설정 (`.env` 파일)
  - [ ] `NEXT_PUBLIC_TOUR_API_KEY` (한국관광공사 API 키)
  - [ ] `TOUR_API_KEY` (서버 사이드용, 필요시)
  - [x] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (네이버 지도 클라이언트 ID, NCP Maps API v3) ✅ **테스트 완료** (NAVER_MAP_API_TEST.md, /map-test 페이지 참고)
  - [ ] Clerk 환경 변수 확인 (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
  - [ ] Supabase 환경 변수 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

### API 클라이언트 구현
- [x] `actions/tour.ts` 생성 (한국관광공사 API 호출 함수들, Server Actions 방식) ✅
  - [x] Base URL 설정: `https://apis.data.go.kr/B551011/KorService2`
  - [x] 공통 파라미터 함수 (`MobileOS: "ETC"`, `MobileApp: "MyTrip"`, `_type: "json"`)
  - [x] `getAreaCodes()` - areaCode2 API 연동 (지역코드 조회)
  - [x] `getAreaBasedList()` - areaBasedList2 API 연동 (지역 기반 관광정보 조회)
  - [x] `searchKeyword()` - searchKeyword2 API 연동 (키워드 검색, 한글 인코딩 처리 `encodeURIComponent()`)
  - [x] `getDetailCommon()` - detailCommon2 API 연동 (공통 정보 조회)
  - [x] `getDetailIntro()` - detailIntro2 API 연동 (소개 정보 조회, Content Type별 필드 처리)
  - [x] `getDetailImages()` - detailImage2 API 연동 (이미지 목록 조회)
  - [x] 에러 처리 및 로깅 추가
  - [x] API 응답 타입 정의 (lib/types/tour.ts 사용)
- [x] 데이터 정제 유틸리티 함수 생성 (`lib/utils/tour-utils.ts`) ✅
  - [x] HTML 태그 정제 함수 (`sanitizeHtml`, `<br>` → `\n` 변환)
    - [x] `overview`, `usetime`, `restdate` 등에서 HTML 태그 제거/변환
    - [x] `sanitizeOverview()`, `sanitizeUseTime()`, `sanitizeRestDate()` 전용 함수
  - [x] 홈페이지 URL 추출 함수 (`extractHomepageUrl`)
    - [x] `<a href="..." target="_blank">...</a>` 형식에서 URL 추출
    - [x] 정규식 사용
  - [x] 선택적 필드 null 체크 헬퍼 함수 (`safeGet`)
  - [x] 좌표 데이터 타입 변환 (`parseCoordinate`, `parseCoordinates`, `string` → `number`)
- [x] Server Actions 방식 선택 및 구현 ✅
  - [x] Server Actions 우선 사용 (`actions/` 디렉토리)
  - [x] `actions/tour.ts` 생성 완료

### 타입 정의
- [x] `lib/types/tour.ts` 생성 ✅
  - [x] `TourItem` 인터페이스 (목록용, PRD 5.1 + API_TEST_RESULT.md 참고)
    - [x] 필수 필드: `addr1`, `areacode`, `contentid`, `contenttypeid`, `title`, `mapx`, `mapy`, `modifiedtime`
    - [x] 선택 필드: `addr2?`, `tel?`, `firstimage?`, `firstimage2?` (null 체크 필요)
    - [x] 카테고리: `cat1?`, `cat2?`, `cat3?`
    - [x] 추가 필드: `createdtime?`, `sigungucode?`, `zipcode?`, `mlevel?`, `cpyrhtDivCd?`
    - [x] 좌표 타입: `mapx: string`, `mapy: string` (WGS84 형식, 변환 불필요)
  - [x] `TourDetail` 인터페이스 (상세정보용, PRD 5.2 + API_TEST_RESULT.md 참고)
    - [x] 필수 필드: `contentid`, `contenttypeid`, `title`, `addr1`, `overview`, `mapx`, `mapy`
    - [x] 선택 필드: `addr2?`, `zipcode?`, `tel?`, `homepage?` (일부 관광지에만 존재)
    - [x] 이미지: `firstimage?`, `firstimage2?`
    - [x] 홈페이지: HTML 링크 형식으로 제공됨 (URL 추출 필요)
    - [x] 개요: HTML 태그 포함 (`<br>` 등, 정제 필요)
  - [x] `TourIntro` 인터페이스 (운영정보용, PRD 5.3 + API_TEST_RESULT.md 참고)
    - [x] 필수 필드: `contentid`, `contenttypeid`
    - [x] 공통 필드: `usetime?`, `restdate?`, `infocenter?`, `parking?` (HTML 태그 포함)
    - [x] 선택 필드: `chkpet?` (Content Type별로 제공 여부 다름)
    - [x] Content Type별 필드 차이 처리 (인덱스 시그니처 사용)
  - [x] `TourImage` 인터페이스 (이미지 목록용, API_TEST_RESULT.md 참고)
    - [x] `originimgurl`: 원본 이미지 URL
    - [x] `smallimageurl`: 썸네일 이미지 URL
    - [x] `imgname`: 이미지 이름
  - [x] API 응답 타입 정의 (Response wrapper 포함)
    - [x] `TourApiResponse<T>` 제네릭 타입
    - [x] `TourApiHeader`, `TourApiBodySingle<T>`, `TourApiBodyMultiple<T>`
    - [x] `response.header.resultCode`, `response.header.resultMsg`
    - [x] `response.body.items.item` 또는 `response.body.items.item[]`
    - [x] `response.body.totalCount`, `response.body.numOfRows`, `response.body.pageNo`
  - [x] Content Type ID 상수 정의 (12, 14, 15, 25, 28, 32, 38, 39)
    - [x] `CONTENT_TYPE` 객체 (as const)
    - [x] `getContentTypeName()` 함수 (Content Type ID → 이름 매핑)
    - [x] `CONTENT_TYPE_OPTIONS` 배열 (필터 옵션용)

### 디자인 시스템 설정
- [x] `app/globals.css` 업데이트 (Tailwind CSS v4 설정) ✅
  - [x] 컬러 팔레트 설정 (design.md 6장 참고)
    - [x] Primary Blue: `#2B7DE9` (--color-primary-blue)
    - [x] Primary Teal: `#00BFA6` (--color-primary-teal)
    - [x] Accent Orange: `#FF6B35` (--color-accent-orange)
  - [x] Semantic Colors 설정 (Success, Warning, Error, Info)
    - [x] Success: `#28A745` (--color-success)
    - [x] Warning: `#FFC107` (--color-warning)
    - [x] Error: `#DC3545` (--color-error)
    - [x] Info: `#17A2B8` (--color-info)
- [x] 폰트 설정 ✅
  - [x] Pretendard, Noto Sans KR (한글) 설정 (body에 font-family 추가)
  - [x] Inter, Helvetica Neue (영문) 설정 (body에 font-family 추가)
  - [x] 폰트 크기 시스템 (Display, H1-H3 유틸리티 클래스 추가)
    - [x] `.text-display` (text-5xl), `.text-h1` (text-4xl), `.text-h2` (text-3xl), `.text-h3` (text-2xl)
- [x] 반응형 브레이크포인트 설정 확인 (Tailwind 기본값 사용: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px) ✅

### 레이아웃 및 공통 컴포넌트
- [x] `components/header.tsx` 생성 (design.md 참고) ✅
  - [x] 로고 (My Trip)
  - [x] 검색창 (헤더 통합, design.md 스타일, 향후 기능 구현 예정)
  - [x] 로그인/회원가입 버튼 (Clerk)
  - [x] Sticky 헤더 (스크롤 시 shadow 표시, backdrop-blur-md)
  - [x] 반응형 디자인 (모바일: 햄버거 메뉴)
- [x] `components/footer.tsx` 생성 ✅
  - [x] 저작권 정보
  - [x] About, Contact 링크
  - [x] 한국관광공사 API 제공 표시
- [x] `app/layout.tsx` 업데이트 ✅
  - [x] ClerkProvider 설정 확인
  - [x] SyncUserProvider 설정 확인 (mermaid.md Auth 플로우 참고)
  - [x] 메타데이터 설정 (My Trip 서비스 정보)
  - [x] Header, Footer 통합
- [x] 공통 컴포넌트 생성 ✅
  - [x] `components/ui/loading.tsx` (로딩 스피너 - design.md 스타일 적용, size variants)
  - [x] `components/ui/error.tsx` (에러 메시지, 재시도 버튼 포함)
  - [x] `components/ui/skeleton.tsx` (스켈레톤 UI - animate-pulse, CardSkeleton, ListSkeleton 포함)
  - [x] `components/ui/badge.tsx` (뱃지 컴포넌트 - shadcn/ui 설치 완료)
  - [x] `components/ui/button.tsx` (기존 shadcn/ui 버튼 사용, variants 지원)
  - [ ] `components/ui/toast.tsx` (토스트 메시지, shadcn/ui - 향후 필요 시 설치)

### Supabase 데이터베이스 설정
- [ ] `supabase/migrations/supabase.sql` 실행 확인
  - [ ] `users` 테이블 생성 확인 (Clerk 연동)
    - [ ] `id`, `clerk_id`, `name`, `created_at`, `updated_at` 컬럼 확인
    - [ ] `idx_users_clerk_id` 인덱스 확인
  - [ ] `bookmarks` 테이블 생성 확인
    - [ ] `id`, `user_id` (FK), `content_id`, `created_at` 컬럼 확인
    - [ ] `unique_user_bookmark` 제약조건 확인
    - [ ] 인덱스 확인 (`idx_bookmarks_user_id`, `idx_bookmarks_content_id`, `idx_bookmarks_created_at`, `idx_bookmarks_user_created`)
  - [ ] RLS 비활성화 확인 (개발 환경, PRD 요구사항)
- [ ] Supabase 클라이언트 설정 확인
  - [ ] `lib/supabase/clerk-client.ts` 확인 (Client Component용)
  - [ ] `lib/supabase/server.ts` 확인 (Server Component용)
  - [ ] `lib/supabase/service-role.ts` 확인 (관리자 권한용)

---

## Phase 2: 홈페이지 (`/`) - 관광지 목록

### 2.1 페이지 기본 구조
- [x] `app/page.tsx` 생성 (My Trip 홈페이지) ✅
- [x] 히어로 섹션 (선택 사항, design.md 참고) ✅
  - [x] 큰 검색창 + 필터 버튼 (플레이스홀더, 향후 기능 구현)
  - [x] "한국의 아름다운 관광지를 탐험하세요" 문구
  - [x] 그라데이션 배경 (design.md 스타일)
- [x] 기본 UI 구조 확인 ✅
  - [x] 헤더 (Header 컴포넌트 사용, layout.tsx에서 통합)
  - [x] 메인 영역 (목록 + 지도 플레이스홀더)
  - [x] 푸터 (Footer 컴포넌트 사용, layout.tsx에서 통합)
- [x] 반응형 레이아웃 기본 구조 ✅
  - [x] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할 (lg:grid-cols-2)
  - [x] 모바일: 탭 형태로 리스트/지도 전환 (useState로 탭 상태 관리)
  - [x] 접근성: aria-label 추가

### 2.2 관광지 목록 기능 (MVP 2.1)
- [x] `components/tour-card.tsx` 생성 ✅
  - [x] 썸네일 이미지 표시 (기본 이미지 처리, 16:9 비율, 그라데이션 배경)
  - [x] 관광지명 표시
  - [x] 주소 표시 (formatAddress 사용)
  - [x] 관광 타입 뱃지 표시 (Badge 컴포넌트 사용, getContentTypeName 함수)
  - [x] 클릭 시 상세페이지 이동 (`/places/[contentId]`)
  - [x] design.md 스타일 적용
    - [x] 카드 호버 효과 (hover:scale-[1.02], hover:shadow-xl)
    - [x] rounded-xl, shadow-md
    - [x] 이미지 호버 효과 (hover:scale-110, overflow-hidden)
- [x] `components/tour-list.tsx` 생성 ✅
  - [x] 카드 그리드 레이아웃 (반응형: 1열/2열/3열)
  - [x] 반응형 디자인 (모바일/태블릿/데스크톱)
  - [x] 빈 목록 처리
- [x] API 연동하여 실제 데이터 표시 ✅
  - [x] `getAreaBasedList()` API 호출 (서울, 관광지 타입, 20개)
  - [x] 로딩 상태 표시 (ListSkeleton UI)
  - [x] 에러 처리 (Error 컴포넌트, 재시도 버튼)
  - [x] `app/page.tsx`에 통합 (데스크톱/모바일 모두)
- [x] 페이지 확인 및 스타일링 조정 ✅

### 2.3 필터 기능 추가
- [x] `components/tour-filters.tsx` 생성 ✅
  - [x] 지역 필터 UI (시/도 선택)
    - [x] `getAreaCodes()` API로 지역 목록 조회
    - [x] "전체" 옵션 제공 (빈 문자열)
  - [x] 관광 타입 필터 UI (12, 14, 15, 25, 28, 32, 38, 39)
    - [x] `CONTENT_TYPE_OPTIONS` 사용, Content Type ID → 이름 매핑
    - [x] "전체" 옵션 제공 (빈 문자열)
  - [x] 필터 초기화 버튼 (활성 필터가 있을 때만 표시)
  - [x] 정렬 옵션 UI (최신순, 이름순)
  - [x] Sticky 필터 영역 (스크롤 시 상단 고정, top-16)
  - [x] design.md 스타일 적용 (Input/Select 스타일, 반응형)
- [x] 필터 동작 연결 (상태 관리) ✅
  - [x] React 상태 관리 (useState로 FilterState 관리)
  - [x] 필터 변경 시 `onFiltersChange` 콜백 호출
- [x] 필터링된 결과 표시 ✅
  - [x] API 호출 시 필터 파라미터 전달 (`getAreaBasedList`)
  - [x] 필터 변경 시 목록 새로고침 (useEffect 의존성 배열)
  - [x] 정렬 기능 구현 (useMemo로 최신순/이름순 정렬)
- [x] `app/page.tsx` 통합 ✅
  - [x] 필터 컴포넌트 추가 (히어로 섹션 아래)
  - [x] 필터 상태와 목록 상태 연동
  - [x] 정렬된 목록 표시 (`sortedTours`)
- [x] 페이지 확인 및 UX 개선 ✅

### 2.4 검색 기능 추가 (MVP 2.3)
- [x] 검색창 UI 구현 ✅
  - [x] 히어로 섹션의 검색창 활성화
  - [x] 검색 아이콘 표시 (좌측)
  - [x] 검색어 지우기 버튼 (검색어가 있을 때만 표시)
  - [x] 엔터 키 처리 (form onSubmit)
  - [x] design.md 스타일 적용 (Large search bar: rounded-full, shadow-lg)
- [x] 검색 API 연동 (`searchKeyword2`) ✅
  - [x] 키워드 검색 실행 (`searchKeywordApi` 함수 사용)
  - [x] 검색 결과 개수 표시 (totalCount)
  - [x] 결과 없음 시 안내 메시지 (TourList 컴포넌트 개선)
- [x] 검색 결과 표시 ✅
  - [x] 목록 형태로 표시 (2.2와 동일한 카드 레이아웃)
  - [x] 검색 키워드 표시 ("검색어" 검색 결과)
  - [x] 지도에 마커로 표시 (2.5에서 구현 예정)
- [x] 검색 + 필터 조합 동작 ✅
  - [x] 키워드 + 지역 필터 (searchKeywordApi에 areaCode 파라미터 전달)
  - [x] 키워드 + 관광 타입 필터 (searchKeywordApi에 contentTypeId 파라미터 전달)
  - [x] 모든 필터 동시 적용 가능
  - [x] 검색 모드/필터 모드 자동 전환 (키워드 유무에 따라)
- [x] `app/page.tsx` 통합 ✅
  - [x] 검색 상태 추가 (`searchKeyword` state)
  - [x] 검색 키워드 변경 시 API 재호출 (useEffect 의존성)
  - [x] 검색 결과 개수 표시
- [x] 페이지 확인 및 UX 개선 ✅

### 2.5 지도 연동 (MVP 2.2)
- [x] 네이버 지도 API 기본 기능 테스트 완료 ✅ (테스트 페이지: `/map-test`, NAVER_MAP_API_TEST.md 참고)
  - [x] 네이버 지도 API 스크립트 로드 확인
  - [x] 기본 지도 표시 확인
  - [x] 마커 표시 확인
  - [x] 인포윈도우 표시 확인
  - [x] 좌표 데이터 처리 확인 (WGS84 직접 사용)
- [ ] `components/naver-map.tsx` 생성
  - [ ] 네이버 지도 API 초기화 (NCP Maps API v3, PRD 2.2 참고)
    - [ ] 스크립트 동적 로드 (`https://openapi.map.naver.com/openapi/v3/maps.js`)
    - [ ] 파라미터: `ncpKeyId` 또는 `ncpClientId` (둘 다 작동 가능, 자동 재시도 로직 포함)
    - [ ] 동적 import 사용 (ssr: false)
    - [ ] 환경변수: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 사용
  - [ ] 기본 지도 표시 (초기 중심 좌표 설정)
  - [ ] 줌 레벨 자동 조정
- [ ] 관광지 마커 표시
  - [ ] 모든 관광지를 마커로 표시
  - [ ] 마커 색상: 관광 타입별로 구분 (선택 사항)
  - [ ] 마커 클러스터링 (선택 사항, 현재 미지원)
- [ ] 마커 클릭 시 인포윈도우
  - [ ] 관광지명 표시
  - [ ] 간단한 설명 표시
  - [ ] "상세보기" 버튼
- [ ] 리스트-지도 연동
  - [ ] 리스트 항목 클릭 시 해당 마커로 지도 이동
  - [ ] 리스트 항목 호버 시 해당 마커 강조 (선택 사항)
- [ ] 지도 컨트롤
  - [ ] 줌 인/아웃 버튼
  - [ ] 지도 유형 선택 (일반/스카이뷰) - `mapTypeControl: true` 옵션 사용
  - [ ] 현재 위치로 이동 버튼 (선택 사항)
- [ ] 반응형 레이아웃
  - [ ] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할 레이아웃
  - [ ] 모바일: 탭 형태로 리스트/지도 전환 (design.md 참고)
  - [ ] 지도 최소 높이: 400px (모바일), 600px (데스크톱)
  - [ ] 탭 UI 컴포넌트 (모바일용)
- [ ] 좌표 데이터 처리 (API_TEST_RESULT.md, NAVER_MAP_API_TEST.md 참고)
  - [x] 좌표는 이미 WGS84 형식으로 제공됨 (변환 불필요) ✅ **테스트 확인**
  - [x] `mapx`, `mapy`는 `string` 타입으로 제공 (네이버 지도 API는 문자열도 처리 가능) ✅ **테스트 확인**
  - [ ] 숫자 연산 필요 시 `parseFloat()` 사용
- [ ] 페이지 확인 및 인터랙션 테스트

### 2.6 정렬 & 페이지네이션
- [ ] 정렬 옵션 추가
  - [ ] 최신순 (modifiedtime 기준)
  - [ ] 이름순 (가나다순)
  - [ ] 정렬 UI 컴포넌트
- [ ] 페이지네이션 구현
  - [ ] 페이지네이션 또는 무한 스크롤 선택
  - [ ] 페이지당 10-20개 항목 (PRD 요구사항)
  - [ ] 페이지 번호 표시 및 이동
- [ ] 로딩 상태 개선
  - [ ] Skeleton UI 적용
  - [ ] 스크롤 시 로딩 인디케이터
- [ ] 최종 페이지 확인
  - [ ] 모든 기능 통합 테스트
  - [ ] 반응형 디자인 확인
  - [ ] 성능 확인

---

## Phase 3: 상세페이지 (`/places/[contentId]`)

### 3.1 페이지 기본 구조
- [ ] `app/places/[contentId]/page.tsx` 생성
  - [ ] 동적 라우팅 설정
  - [ ] `contentId` 파라미터 받기
- [ ] 히어로 이미지 섹션 (design.md 참고)
  - [ ] 대표 이미지 큰 사이즈 표시
  - [ ] 이미지 갤러리 썸네일 (선택 사항)
  - [ ] 모바일: 이미지 캐러셀 (전체화면)
- [ ] 기본 레이아웃 구조
  - [ ] 뒤로가기 버튼 (헤더)
  - [ ] 제목 & 액션 버튼 영역 (북마크, 공유)
  - [ ] 데스크톱: 좌측 60% + 우측 40% 분할 레이아웃 (design.md 참고)
  - [ ] 모바일: 단일 컬럼 레이아웃
  - [ ] 섹션 구분 (카드 또는 구분선)
- [ ] 라우팅 테스트
  - [ ] 홈에서 관광지 카드 클릭 시 이동 확인
  - [ ] URL 직접 접근 테스트

### 3.2 기본 정보 섹션 (MVP 2.4.1)
- [ ] `components/tour-detail/detail-info.tsx` 생성
  - [ ] 관광지명 표시 (대제목, text-4xl)
  - [ ] 주소 표시 (복사 기능 추가, design.md 스타일)
  - [ ] 전화번호 표시 (클릭 시 전화 연결, tel: 링크)
  - [ ] 홈페이지 표시 (링크)
  - [ ] 개요 표시 (긴 설명문, 더보기 기능)
  - [ ] 관광 타입 및 카테고리 표시 (뱃지)
- [ ] 빠른 정보 섹션 (우측 컬럼, design.md 참고)
  - [ ] 운영정보 요약 (운영시간, 입장료, 주차, 반려동물)
  - [ ] 티켓 예약 버튼 (선택 사항)
- [ ] `detailCommon2` API 연동
  - [ ] API 호출 함수
  - [ ] 로딩 상태 처리
  - [ ] 에러 처리
  - [ ] 선택적 필드 null 체크 (`addr2`, `tel`, `homepage` 등)
- [ ] 데이터 정제 처리
  - [ ] 홈페이지 URL 추출 (HTML 링크에서 URL 추출)
  - [ ] 개요(`overview`) HTML 태그 정제 (`<br>` 처리)
- [ ] 기능 구현
  - [ ] 주소 복사 기능 (클립보드 API, HTTPS 환경 필수)
  - [ ] 전화번호 클릭 시 전화 연결 (`tel:` 링크, null 체크)
  - [ ] 홈페이지 링크 표시 (추출된 URL 사용)
  - [ ] 복사 완료 토스트 메시지
- [ ] 페이지 확인 및 스타일링

### 3.3 지도 섹션 (MVP 2.4.4)
- [ ] `components/tour-detail/detail-map.tsx` 생성
  - [ ] 해당 관광지 위치 표시 (마커 1개)
  - [ ] 지도 중심 좌표 설정 (API_TEST_RESULT.md 참고)
  - [ ] 줌 레벨 설정
  - [ ] 좌표 데이터 처리 (이미 WGS84 형식, 변환 불필요)
    - [ ] `mapx`, `mapy`를 네이버 지도 API에 직접 전달
    - [ ] 숫자 연산 필요 시 `parseFloat()` 사용
- [ ] "길찾기" 버튼 구현
  - [ ] 네이버 지도 앱/웹 연동
  - [ ] 좌표 정보 표시 (선택 사항)
- [ ] 페이지 확인

### 3.4 공유 기능 (MVP 2.4.5)
- [ ] `components/tour-detail/share-button.tsx` 생성
  - [ ] 공유 아이콘 버튼 (Share/Link 아이콘)
  - [ ] URL 복사 기능 (클립보드 API, HTTPS 환경 필수)
  - [ ] 복사 완료 토스트 메시지
- [ ] Open Graph 메타태그 동적 생성 (PRD 2.4.5 기술 요구사항)
  - [ ] Next.js Metadata API 사용
  - [ ] `og:title`: 관광지명
  - [ ] `og:description`: 관광지 설명 (100자 이내)
  - [ ] `og:image`: 대표 이미지 (1200x630 권장)
  - [ ] `og:url`: 상세페이지 URL
  - [ ] `og:type`: "website"
- [ ] 페이지 확인 및 공유 테스트
  - [ ] URL 복사 테스트
  - [ ] SNS 공유 테스트 (선택 사항)

### 3.5 추가 정보 섹션 (향후 구현)
- [ ] `components/tour-detail/detail-intro.tsx` 생성 (운영 정보, MVP 2.4.2)
  - [ ] 운영시간/개장시간 표시
  - [ ] 휴무일 표시
  - [ ] 이용요금 표시
  - [ ] 주차 가능 여부 표시
  - [ ] 수용인원 표시
  - [ ] 체험 프로그램 표시 (있는 경우)
  - [ ] 유모차/반려동물 동반 가능 여부 표시
- [ ] `detailIntro2` API 연동
  - [ ] API 호출 함수
  - [ ] Content Type별 필드 처리 (contentTypeId에 따라 다른 필드)
    - [ ] 관광지(12): `usetime`, `restdate`, `infocenter`, `parking` 제공
    - [ ] 문화시설(14), 음식점(39) 등 타입별 필드 구조 다름
    - [ ] 타입 가드 또는 유니온 타입 사용
  - [ ] HTML 태그 정제 (`usetime`, `restdate`에 `<br>` 태그 포함)
- [ ] `components/tour-detail/detail-gallery.tsx` 생성 (이미지 갤러리, MVP 2.4.3)
  - [ ] 대표 이미지 + 서브 이미지들 표시
  - [ ] 이미지 클릭 시 전체화면 모달
  - [ ] 이미지 슬라이드 기능 (swiper 또는 캐러셀)
  - [ ] 이미지 없으면 기본 이미지 표시
  - [ ] design.md 스타일 적용 (이미지 호버 효과, 캐러셀 UI)
- [ ] 관련 관광지 추천 섹션 (선택 사항, design.md 참고)
  - [ ] "이런 관광지도 추천해요" 섹션
  - [ ] 가로 스크롤 카드 레이아웃
  - [ ] 모바일: 스와이프 가능
- [ ] `detailImage2` API 연동
  - [ ] API 호출 함수
  - [ ] 이미지 최적화 처리
- [ ] 페이지 확인
  - [ ] 모든 섹션 통합 확인
  - [ ] 정보 없는 항목 숨김 처리 확인

---

## Phase 4: 북마크 기능 (`/bookmarks`)

### 4.1 Supabase 설정 확인
- [ ] `supabase/migrations/supabase.sql` 실행 확인
  - [ ] `users` 테이블 확인 (Clerk 연동, supabase.sql 참고)
    - [ ] `id`, `clerk_id` (UNIQUE), `name`, `created_at`, `updated_at` 컬럼 확인
    - [ ] `idx_users_clerk_id` 인덱스 확인
    - [ ] `update_users_updated_at` 트리거 확인
  - [ ] `bookmarks` 테이블 확인
    - [ ] `id`, `user_id` (FK, CASCADE), `content_id`, `created_at` 컬럼 확인
    - [ ] `unique_user_bookmark` 제약조건 확인
    - [ ] 인덱스 확인 (`idx_bookmarks_user_id`, `idx_bookmarks_content_id`, `idx_bookmarks_created_at`, `idx_bookmarks_user_created`)
  - [ ] RLS 비활성화 확인 (개발 환경, PRD 요구사항)
- [ ] Supabase 클라이언트 설정 확인
  - [ ] `lib/supabase/clerk-client.ts` 확인 (Client Component용)
  - [ ] `lib/supabase/server.ts` 확인 (Server Component용)
  - [ ] `lib/supabase/service-role.ts` 확인 (관리자 권한용)

### 4.2 북마크 기능 구현 (MVP 2.4.5, mermaid.md 플로우 참고)
- [ ] `lib/api/supabase-api.ts` 생성 (Supabase 쿼리 함수들)
  - [ ] `getUserByClerkId` 함수 (clerk_id로 users 테이블 조회)
  - [ ] `addBookmark` 함수 (북마크 추가, INSERT INTO bookmarks)
  - [ ] `removeBookmark` 함수 (북마크 삭제, DELETE FROM bookmarks)
  - [ ] `getBookmarkStatus` 함수 (북마크 여부 확인)
  - [ ] `getUserBookmarks` 함수 (사용자 북마크 목록 조회)
  - [ ] 에러 처리 및 로깅
- [ ] `components/bookmarks/bookmark-button.tsx` 생성
  - [ ] 별 아이콘 (채워짐/비어있음, lucide-react)
  - [ ] 클릭 시 북마크 추가/제거
  - [ ] 로딩 상태 표시
  - [ ] 북마크 개수 표시 (선택 사항)
- [ ] 상세페이지에 북마크 버튼 추가
  - [ ] `app/places/[contentId]/page.tsx`에 통합
  - [ ] 북마크 상태 확인 (현재 사용자의 북마크 여부)
- [ ] 인증된 사용자 확인 (mermaid.md Auth 플로우 참고)
  - [ ] Clerk 인증 상태 확인
  - [ ] 로그인하지 않은 경우: 로그인 유도 (Clerk 로그인 페이지로 리다이렉트)
  - [ ] 로그인 후 사용자 동기화 확인 (SyncUserProvider)
- [ ] 로그인하지 않은 경우 처리 (PRD 2.4.5 요구사항)
  - [ ] localStorage 임시 저장 (선택 사항)
  - [ ] 로그인 후 Supabase 동기화 (localStorage → Supabase)
- [ ] 북마크 추가/제거 로직
  - [ ] Clerk user_id로 users 테이블 조회 후 user_id 사용
  - [ ] `unique_user_bookmark` 제약조건으로 중복 방지
  - [ ] 토스트 메시지 표시 (추가/제거 성공)
- [ ] 상세페이지에서 북마크 동작 확인
  - [ ] 북마크 추가 테스트
  - [ ] 북마크 삭제 테스트
  - [ ] 토스트 메시지 확인
  - [ ] 로그인하지 않은 경우 처리 확인

### 4.3 북마크 목록 페이지 (PRD 2.4.5, mermaid.md G3 참고)
- [ ] `app/bookmarks/page.tsx` 생성
  - [ ] 인증된 사용자만 접근 가능
  - [ ] 로그인하지 않은 경우: 로그인 유도
- [ ] `components/bookmarks/bookmark-list.tsx` 생성
  - [ ] 북마크한 관광지 목록 표시
  - [ ] 카드 레이아웃 (2.2와 동일한 tour-card 사용)
  - [ ] 로딩 상태 표시
  - [ ] 빈 목록 안내 메시지 (design.md Empty State 참고)
- [ ] 북마크 목록 조회
  - [ ] Supabase에서 북마크 목록 조회 (getUserBookmarks)
  - [ ] content_id 배열로 관광지 정보 API 호출 (detailCommon2 또는 areaBasedList2)
  - [ ] 관광지 정보와 북마크 정보 결합
- [ ] 정렬 옵션 (PRD 2.4.5 요구사항)
  - [ ] 최신순 (created_at 기준, supabase.sql 인덱스 활용)
  - [ ] 이름순 (관광지명 기준, API 조인)
  - [ ] 지역별 (지역코드 기준, API 조인)
- [ ] 일괄 삭제 기능 (PRD 2.4.5 요구사항)
  - [ ] 체크박스로 선택
  - [ ] 선택된 북마크 일괄 삭제 (DELETE WHERE user_id = ... AND content_id IN (...))
  - [ ] 삭제 확인 다이얼로그
- [ ] 페이지 확인
  - [ ] 목록 표시 확인
  - [ ] 정렬 기능 확인
  - [ ] 일괄 삭제 기능 확인
  - [ ] 카드 클릭 시 상세페이지 이동 확인

---

## Phase 5: 최적화 & 배포

### 디자인 시스템 완성
- [ ] 컴포넌트 스타일 통일
  - [ ] 버튼 스타일 (Primary, Secondary, Icon) - design.md 적용
  - [ ] 카드 스타일 (Tour Card) - design.md 적용
  - [ ] 뱃지 스타일 (Status Badges) - design.md 적용
  - [ ] 입력 필드 스타일 (Input, Select, Search Bar) - design.md 적용
- [ ] 인터랙션 & 애니메이션 적용 (design.md 7장 참고)
  - [ ] 호버 효과 (카드, 링크, 이미지) - design.md 스타일
  - [ ] 페이지 전환 애니메이션 (Fade in, Slide up)
  - [ ] 스크롤 효과 (Sticky Header, Infinite Scroll)
  - [ ] 트랜지션 설정 (transition-all duration-300)

### 성능 최적화
- [ ] 이미지 최적화
  - [ ] `next.config.ts` 외부 도메인 설정 (한국관광공사 이미지 URL)
  - [ ] Next.js Image 컴포넌트 사용 (design.md 스타일)
  - [ ] 이미지 레이지 로딩
  - [ ] WebP 형식 지원 및 fallback
  - [ ] Blur placeholder 또는 Skeleton UI
  - [ ] Responsive sizes 설정 (sizes 속성)
- [ ] API 응답 캐싱
  - [ ] React Query 또는 SWR 사용 (선택 사항)
  - [ ] 적절한 캐시 시간 설정
  - [ ] ISR 설정 (revalidate: 3600)
- [ ] 코드 스플리팅
  - [ ] 동적 import 사용 (지도 컴포넌트 등, ssr: false)
  - [ ] Suspense를 활용한 lazy loading
  - [ ] 번들 크기 최적화

### 접근성 (Accessibility) 개선 (design.md 8장 참고)
- [ ] ARIA 라벨 설정
  - [ ] 네비게이션 aria-label
  - [ ] 이미지 alt 텍스트
  - [ ] 인터랙티브 요소 aria-expanded, aria-controls
  - [ ] 현재 페이지 aria-current="page"
- [ ] 키보드 네비게이션
  - [ ] Focus 스타일 (focus:ring-2 focus:ring-blue-500)
  - [ ] 논리적 Tab 순서
  - [ ] Skip to content 링크 (스크린 리더용)
- [ ] 색상 대비
  - [ ] WCAG AA 준수 (텍스트 4.5:1, 큰 텍스트 3:1)
  - [ ] UI 컴포넌트 대비 3:1

### 에러 처리 및 UX 개선
- [ ] 전역 에러 핸들링 개선
  - [ ] `app/error.tsx` 생성
  - [ ] 에러 바운더리 설정
- [ ] 404 페이지
  - [ ] `app/not-found.tsx` 생성
  - [ ] 사용자 친화적인 에러 메시지
  - [ ] design.md 스타일 적용
- [ ] 로딩 상태 개선
  - [ ] 전역 로딩 인디케이터
  - [ ] Skeleton UI 일관성 유지 (design.md 스타일)
  - [ ] Spinner 크기 variants (sm, md, lg)

### SEO 최적화
- [ ] 메타태그 설정
  - [ ] 기본 메타태그 (`app/layout.tsx`)
  - [ ] 동적 메타태그 (상세페이지, 3.4에서 일부 구현)
- [ ] `app/sitemap.ts` 생성
  - [ ] 사이트맵 자동 생성
- [ ] `app/robots.ts` 생성
  - [ ] 검색 엔진 크롤링 설정
- [ ] Open Graph 메타태그 (3.4에서 일부 구현)

### 배포 준비
- [ ] 환경변수 보안 검증
  - [ ] 모든 필수 환경변수 확인 (PRD 8.4 참고)
  - [ ] `.env.example` 파일 업데이트
- [ ] 빌드 테스트
  - [ ] `pnpm build` 실행
  - [ ] 빌드 에러 확인 및 수정
- [ ] Vercel 배포
  - [ ] Vercel 프로젝트 생성
  - [ ] 환경변수 설정
  - [ ] 배포 및 테스트
- [ ] 성능 측정 (PRD 9.1 KPI 참고)
  - [ ] Lighthouse 점수 측정 (> 80 목표)
  - [ ] Core Web Vitals 확인
  - [ ] 성능 개선 사항 적용
  - [ ] API 응답 성공률 확인 (> 95%)

### 추가 파일 및 설정
- [ ] `app/favicon.ico` 파일 확인
- [ ] `public/icons/` 디렉토리 확인 (PWA 아이콘)
- [ ] `public/logo.png` 파일 확인
- [ ] `public/og-image.png` 파일 확인
- [ ] `app/manifest.ts` 생성 (PWA, 선택 사항)
- [ ] 다크 모드 지원 (선택 사항)
  - [ ] Tailwind dark 모드 설정
  - [ ] 테마 전환 버튼 (Header에 추가)
  - [ ] design.md 컬러 팔레트 적용

---

## 참고 문서

- [PRD 문서](./prd.md) - 전체 프로젝트 요구사항
- [디자인 문서](./design.md) - 페이지 레이아웃 및 디자인 시스템
- [Mermaid 다이어그램](./reference/mermaid.md) - 사용자 플로우
- [Supabase 마이그레이션](../supabase/migrations/supabase.sql) - 데이터베이스 스키마
- [한국관광공사 API 테스트 결과](./API_TEST_RESULT.md) - API 테스트 결과 및 데이터 구조 확인
- [네이버 지도 API 테스트 결과](./NAVER_MAP_API_TEST.md) - 네이버 지도 API 확인 결과 및 사용 방법

---

## 개발 팁

### 네이버 지도 API 사용 시 주의사항
- **✅ 테스트 완료**: `/map-test` 페이지에서 기본 기능 확인 완료 (NAVER_MAP_API_TEST.md 참고)
- NCP Maps API v3 사용 (구 Maps API 아님)
- **파라미터명**: `ncpKeyId` 또는 `ncpClientId` 둘 다 작동 가능
  - PRD에서는 `ncpKeyId` 명시, 실제 문서에서는 `ncpClientId` 예시도 있음
  - 구현 시 자동 재시도 로직 포함 권장 (ncpKeyId 실패 시 ncpClientId로 재시도)
  - 스크립트 URL: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
- **좌표 변환 불필요**: ✅ **테스트 확인** - API에서 받은 `mapx`, `mapy`는 이미 WGS84 형식 (API_TEST_RESULT.md 참고)
  - 형식: `mapx=126.9846616856`, `mapy=37.5820858828` (소수점, string 타입)
  - 네이버 지도 API에 바로 사용 가능 (문자열 또는 숫자 둘 다 가능)
  - 숫자 연산 필요 시 `parseFloat()` 사용
  - 예시: `new naver.maps.LatLng(parseFloat(mapy), parseFloat(mapx))`
- **지도 초기화**: `new naver.maps.Map(container, { center, zoom, mapTypeControl: true })`
- **마커 생성**: `new naver.maps.Marker({ position, map, title })`
- **인포윈도우**: `new naver.maps.InfoWindow({ content })` + `infoWindow.open(map, marker)`
- 클러스터링 모듈은 현재 미지원 (일반 마커 사용)
- **환경변수**: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (클라이언트 사이드 노출 가능)

### 북마크 기능 구현 시 주의사항
- Clerk user_id로 users 테이블 조회 후 user_id 사용
- `unique_user_bookmark` 제약조건으로 중복 방지
- 로그인하지 않은 경우: 로그인 유도 또는 localStorage 임시 저장
- SyncUserProvider가 자동으로 Clerk 사용자를 Supabase에 동기화

### API 호출 시 주의사항
- 공공 API Rate Limit 확인 필요
- API 응답 시간 고려 (캐싱 전략 필요)
- 일부 관광지는 이미지/정보 누락 가능 (기본 이미지 처리)
- **한글 처리**: URL 파라미터에 한글 사용 시 `encodeURIComponent()` 필수
- **선택적 필드**: `addr2`, `tel`, `homepage` 등은 null 체크 필수
- **HTML 태그 정제**: `overview`, `usetime`, `restdate` 등에 HTML 태그 포함
- **홈페이지 URL**: HTML 링크 형식으로 제공되므로 URL 추출 로직 필요
- **Content Type별 차이**: `detailIntro2`는 타입별로 다른 필드 제공
- **좌표 데이터**: `mapx`, `mapy`는 `string` 타입, WGS84 형식 (변환 불필요)
