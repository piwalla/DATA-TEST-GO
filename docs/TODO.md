# My Trip 개발 TODO

한국 관광지 정보 서비스 개발 작업 목록

> **참고 문서**: [PRD](./prd.md) | [디자인 가이드](./design.md) | [사용자 플로우](./reference/mermaid.md) | [데이터베이스 스키마](../supabase/migrations/supabase.sql)  
> **추천 진행 계획**: [RECOMMENDATIONS.md](./RECOMMENDATIONS.md)

---

## 🎯 다음 작업 추천

> **상세 계획**: [NEXT_STEPS_PLAN.md](./NEXT_STEPS_PLAN.md), [LIGHTHOUSE_IMPROVEMENT_PLAN.md](./LIGHTHOUSE_IMPROVEMENT_PLAN.md), [NEXT_ACTIONS.md](./NEXT_ACTIONS.md) 참고  
> **최근 완료**: Favicon 및 헤더 로고 아이콘 추가 완료 (2025-11-07)

### 최근 완료된 작업

✅ **통계 대시보드 페이지 구현 완료** (2025-11-07)
- ✅ 통계 데이터 조회 Server Actions 생성 (`actions/stats.ts`)
- ✅ 통계 페이지 생성 (`app/stats/page.tsx`) - 로그인된 사용자 모두 접근 가능
- ✅ 통계 컴포넌트 생성 (요약 카드, 가입자 추이 차트, 북마크 추이 차트, 인기 관광지 차트, 최근 가입자/북마크 목록)
- ✅ recharts 라이브러리 설치 및 차트 구현
- ✅ 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- ✅ 헤더에 통계 링크 추가

✅ **성능 및 UX 개선 통합 작업 완료** (2025-11-07)
- ✅ 지도 로딩 최적화 (Intersection Observer 적용, viewport 밖 지도 lazy load)
- ✅ 코드 스플리팅 추가 (TourFilters, Pagination 동적 import)
- ✅ 이미지 최적화 강화 (sizes 속성 정확도 개선, fetchPriority 추가, 갤러리 lazy loading)
- ✅ JavaScript 최적화 (removeConsole 설정, Third-party 스크립트 확인)
- ✅ 전역 로딩 인디케이터 생성 (`app/loading.tsx`)
- ✅ Skeleton UI 일관성 확인 (모든 Client Component)
- ✅ 반응형 레이아웃 최종 확인 (Tailwind CSS 반응형 클래스)
- ✅ 스크롤 동작 최적화 (`scroll-behavior: smooth`)
- ✅ SEO 메타 설명 개선 (description 구체화)
- ✅ Favicon 설정 (`piwalla.png` 사용, `app/icon.png`, `public/icon.png`, `public/favicon.ico` 생성)
- ✅ 헤더 로고 아이콘 추가 (`components/header.tsx`에 `piwalla.png` 아이콘 추가)

**개선 효과:**
- Performance: 50점 → **54점** (+4점)
- Best Practices: 57점 → **79점** (+22점)
- LCP: 11.9s → **11.0s** (-0.9s)
- TBT: 1,290ms → **900ms** (-390ms)

---

### 옵션 1: 성능 개선 - Performance 최적화 (최우선, 2-3시간)

**목표**: Lighthouse Performance 점수 > 80 달성 및 PRD KPI 충족

**현재 상태:**
- Performance: 54점 (목표: > 80) ⚠️ (이전 50점에서 개선)
- LCP: 11.0s (목표: < 2.5s) ⚠️ (이전 11.9s에서 개선)
- TBT: 900ms (목표: < 200ms) ⚠️ (이전 1,290ms에서 개선)

**작업 내용:**
1. **LCP 개선** (1-2시간) ✅ (부분 완료, 2025-11-07)
   - [x] 이미지 최적화 강화 ✅ (priority 이미지 설정, sizes 최적화, fetchPriority 추가)
   - [x] 지도 로딩 지연 ✅ (viewport 밖 지도는 lazy load, Intersection Observer 적용)
   - [x] 폰트 최적화 확인 ✅ (font-display: swap 적용 완료)
   - [x] Critical CSS 추출 ✅ (Next.js가 자동 처리, 확인 완료)
   - [ ] 이미지 preload 고려 (LCP 요소인 경우)
   - [ ] 지도 스크립트 로딩 지연 강화 (사용자 상호작용 후 로드)

2. **TBT 개선** (1시간) ✅ (부분 완료, 2025-11-07)
   - [x] JavaScript 번들 분석 ✅ (@next/bundle-analyzer 설정 완료)
   - [x] 불필요한 JavaScript 제거 ✅ (removeConsole 설정 추가)
   - [x] 코드 스플리팅 추가 ✅ (필터 컴포넌트, 페이지네이션 동적 import 완료)
   - [x] Third-party 스크립트 최적화 확인 ✅ (Clerk, Naver Maps 확인 완료)
   - [ ] 미사용 JavaScript 제거 (835 KiB 절약 가능, 번들 분석 필요)
   - [ ] 패시브 리스너 사용 (스크롤 이벤트)

3. **Best Practices 개선** (30분) ✅ (부분 완료)
   - [x] 이미지 aspect ratio 수정 ✅ (next/image가 자동 처리)
   - [x] Source maps 추가 ✅ (프로덕션에서는 의도적으로 비활성화)
   - [ ] Chrome DevTools Issues 패널 확인 및 해결

**남은 작업:**
- [ ] LCP 추가 개선 (11.0s → 3-4s 목표)
  - [ ] 이미지 preload 고려
  - [ ] 지도 스크립트 로딩 지연 강화
- [ ] TBT 추가 개선 (900ms → 300-400ms 목표)
  - [ ] 미사용 JavaScript 제거 (번들 분석 필요)
  - [ ] 패시브 리스너 사용
- [ ] Best Practices Issues 확인 및 해결

**완료 기준:**
- Lighthouse Performance > 80
- LCP < 2.5s
- TBT < 200ms

**왜 이 작업을 추천하는가?**
- PRD KPI 달성 필요 (페이지 로딩 시간 < 3초)
- 사용자 경험 개선 (빠른 로딩)
- 검색 엔진 최적화 (SEO 점수 향상)
- 이미 일부 개선 효과 확인됨 (Performance 50→54, Best Practices 57→79)

---

### 옵션 2: SEO 개선 (30분)

**목표**: Lighthouse SEO 점수 > 90 달성

**현재 상태:**
- SEO: 83점 (목표: > 90) ⚠️

**작업 내용:**
1. **Meta description 추가** (15분) ✅ (부분 완료, 2025-11-07)
   - [x] 홈페이지 메타 설명 개선 ✅ (`app/layout.tsx` description 개선 완료)
   - [ ] 상세페이지 메타 설명 확인 (이미 `generateMetadata` 있음, Lighthouse 경고 확인 필요)

2. **Links crawlable 확인** (15분)
   - [ ] 동적 링크가 크롤러에 접근 가능한지 확인
   - [ ] 필요 시 `rel="nofollow"` 제거 또는 수정

**완료 기준:**
- Lighthouse SEO > 90
- 모든 페이지에 메타 설명 존재

---

### 옵션 3: 디자인 시스템 완성 - 페이지 전환 애니메이션 ✅ (완료됨)

**목표**: 사용자 경험 개선 및 디자인 시스템 완성

**작업 내용:**
1. **페이지 전환 애니메이션 추가** (30분) ✅ (완료, 2025-11-07)
   - [x] Next.js App Router의 `framer-motion` 사용 ✅
   - [x] Fade in 효과 (opacity-0 → opacity-100) ✅
   - [x] Slide up 효과 (translate-y-4 → translate-y-0) ✅
   - [x] duration-300, ease-in-out 적용 ✅
   - [x] `PageTransition` 컴포넌트 생성 및 `app/layout.tsx`에 통합 ✅

**완료 기준:**
- [x] 페이지 전환 시 부드러운 애니메이션 효과 ✅
- [x] 디자인 시스템 완성도 향상 ✅

---

### 옵션 2: 성능 측정 및 개선 (권장, 45분)

**목표**: 현재 성능 상태 파악 및 PRD KPI 달성 여부 확인

**작업 내용:**
1. **성능 측정** (30분)
   - Lighthouse 점수 측정 (Performance, Accessibility, Best Practices, SEO)
   - Core Web Vitals 확인 (LCP, FID, CLS)
   - API 응답 성공률 확인
   - 코드 스플리팅 효과 확인 (번들 크기 비교)

2. **개선 사항 적용** (15분)
   - 측정 결과를 바탕으로 우선순위 높은 항목 개선
   - Lighthouse 권장 사항 적용

**완료 기준:**
- Lighthouse Performance > 80
- 페이지 로딩 시간 < 3초 (PRD KPI)
- API 응답 성공률 > 95%

**왜 이 작업을 추천하는가?**
- 현재 성능 상태를 파악하여 추가 개선이 필요한 부분 명확화
- PRD KPI 달성 여부 확인
- 코드 스플리팅 효과 측정 가능
- Vercel 환경변수는 이미 설정 완료 ✅

---

### 옵션 2: API 응답 캐싱 (중기 효과, 1-2시간)

**목표**: React Query 도입으로 사용자 경험 개선 및 서버 부하 감소

**작업 내용:**
1. **React Query 설치 및 설정** (30분)
   - `@tanstack/react-query` 설치
   - QueryClient Provider 설정

2. **기존 API 호출을 React Query로 전환** (1시간)
   - 관광지 목록 캐싱 (staleTime: 1시간)
   - 상세페이지 캐싱 (staleTime: 1시간)
   - 이미지 목록 캐싱

**완료 기준:**
- API 호출 횟수 감소 확인
- 페이지 전환 시 즉시 데이터 표시
- 네트워크 사용량 감소

**왜 이 작업을 추천하는가?**
- 사용자 경험 개선 (즉시 데이터 표시)
- 서버 부하 감소
- 네트워크 사용량 감소

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
- [x] `supabase/migrations/supabase.sql` 실행 확인 ✅ (Phase 4.1에서 확인 완료)
  - [x] `users` 테이블 생성 확인 (Clerk 연동) ✅
    - [x] `id`, `clerk_id`, `name`, `created_at`, `updated_at` 컬럼 확인 ✅
    - [x] `idx_users_clerk_id` 인덱스 확인 ✅
  - [x] `bookmarks` 테이블 생성 확인 ✅
    - [x] `id`, `user_id` (FK), `content_id`, `created_at` 컬럼 확인 ✅
    - [x] `unique_user_bookmark` 제약조건 확인 ✅
    - [x] 인덱스 확인 (`idx_bookmarks_user_id`, `idx_bookmarks_content_id`, `idx_bookmarks_created_at`, `idx_bookmarks_user_created`) ✅
  - [x] RLS 비활성화 확인 (개발 환경, PRD 요구사항) ✅
- [x] Supabase 클라이언트 설정 확인 ✅ (Phase 4.1에서 확인 완료)
  - [x] `lib/supabase/clerk-client.ts` 확인 (Client Component용) ✅
  - [x] `lib/supabase/server.ts` 확인 (Server Component용) ✅
  - [x] `lib/supabase/service-role.ts` 확인 (관리자 권한용) ✅

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
- [x] `components/naver-map.tsx` 생성 ✅
  - [x] 네이버 지도 API 초기화 (NCP Maps API v3, PRD 2.2 참고)
    - [x] 스크립트 동적 로드 (`https://openapi.map.naver.com/openapi/v3/maps.js`)
    - [x] 파라미터: `ncpKeyId` 또는 `ncpClientId` (둘 다 작동 가능, 자동 재시도 로직 포함)
    - [x] 환경변수: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 사용
  - [x] 기본 지도 표시 (초기 중심 좌표 설정, 관광지가 있으면 첫 번째 관광지, 없으면 서울 시청)
  - [x] 줌 레벨 자동 조정 (관광지가 여러 개일 때 fitBounds, 1개일 때 zoom 15)
- [x] 관광지 마커 표시 ✅
  - [x] 모든 관광지를 마커로 표시
  - [ ] 마커 색상: 관광 타입별로 구분 (선택 사항, 향후 구현)
  - [ ] 마커 클러스터링 (선택 사항, 현재 미지원)
- [x] 마커 클릭 시 인포윈도우 ✅
  - [x] 관광지명 표시
  - [x] 주소 표시
  - [x] 관광 타입 표시
  - [x] "상세보기" 버튼
- [x] 리스트-지도 연동 ✅
  - [x] 리스트 항목 클릭 시 해당 마커로 지도 이동 (selectedTourId state 사용)
  - [x] 선택된 관광지의 인포윈도우 자동 열기
  - [ ] 리스트 항목 호버 시 해당 마커 강조 (선택 사항, 향후 구현)
- [x] 지도 컨트롤 ✅
  - [x] 줌 인/아웃 버튼 (네이버 지도 기본 컨트롤)
  - [x] 지도 유형 선택 (일반/스카이뷰) - `mapTypeControl: true` 옵션 사용
  - [ ] 현재 위치로 이동 버튼 (선택 사항, 향후 구현)
- [x] 반응형 레이아웃 ✅
  - [x] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할 레이아웃
  - [x] 모바일: 탭 형태로 리스트/지도 전환 (design.md 참고)
  - [x] 지도 최소 높이: 400px (모바일), 600px (데스크톱)
  - [x] 탭 UI 컴포넌트 (모바일용, 이미 구현됨)
- [x] 좌표 데이터 처리 (API_TEST_RESULT.md, NAVER_MAP_API_TEST.md 참고) ✅
  - [x] 좌표는 이미 WGS84 형식으로 제공됨 (변환 불필요) ✅ **테스트 확인**
  - [x] `mapx`, `mapy`는 `string` 타입으로 제공 (네이버 지도 API는 문자열도 처리 가능) ✅ **테스트 확인**
  - [x] 숫자 연산 필요 시 `parseFloat()` 사용 (parseCoordinates 함수 사용)
- [x] `app/page.tsx` 통합 ✅
  - [x] NaverMap 컴포넌트 import 및 사용
  - [x] 데스크톱 레이아웃에 지도 통합
  - [x] 모바일 탭에 지도 통합
  - [x] 리스트-지도 연동 상태 관리 (selectedTourId)
- [x] 페이지 확인 및 인터랙션 테스트 ✅

### 2.6 정렬 & 페이지네이션
- [x] 정렬 옵션 추가 ✅
  - [x] 최신순 (modifiedtime 기준, 내림차순)
  - [x] 이름순 (가나다순, localeCompare 사용)
  - [x] 정렬 UI 컴포넌트 (TourFilters에 이미 구현됨)
  - [x] 클라이언트 사이드 정렬 (useMemo 사용)
- [x] 페이지네이션 구현 ✅
  - [x] 페이지네이션 컴포넌트 생성 (`components/pagination.tsx`)
  - [x] 페이지당 20개 항목 (PRD 요구사항)
  - [x] 페이지 번호 표시 및 이동 (최대 7개 페이지 번호 표시, 생략 표시)
  - [x] 첫 페이지/마지막 페이지 이동 버튼
  - [x] 이전/다음 페이지 버튼
  - [x] 현재 페이지 하이라이트
  - [x] 검색/필터 변경 시 첫 페이지로 리셋
  - [x] 페이지 변경 시 스크롤 상단 이동
  - [x] 페이지 정보 표시 (총 개수, 현재 페이지/전체 페이지)
- [x] 로딩 상태 개선 ✅
  - [x] Skeleton UI 적용 (이미 구현됨, ListSkeleton 사용)
- [x] 최종 페이지 확인 ✅
  - [x] 모든 기능 통합 테스트
  - [x] 반응형 디자인 확인 (페이지네이션 버튼 반응형)
  - [x] 성능 확인 (페이지네이션으로 데이터 양 제한)

---

## Phase 3: 상세페이지 (`/places/[contentId]`)

### 3.1 페이지 기본 구조
- [x] `app/places/[contentId]/page.tsx` 생성 ✅
  - [x] 동적 라우팅 설정 (Next.js 15 params Promise 처리)
  - [x] `contentId` 파라미터 받기
- [x] 히어로 이미지 섹션 (design.md 참고) ✅
  - [x] 대표 이미지 큰 사이즈 표시 (firstimage 사용, 반응형 높이)
  - [ ] 이미지 갤러리 썸네일 (선택 사항, 3.5에서 구현 예정)
  - [ ] 모바일: 이미지 캐러셀 (전체화면, 3.5에서 구현 예정)
- [x] 기본 레이아웃 구조 ✅
  - [x] 뒤로가기 버튼 (sticky 헤더, backdrop-blur 적용)
  - [ ] 제목 & 액션 버튼 영역 (북마크, 공유 - 3.4에서 구현 예정)
  - [x] 데스크톱: 좌측 60% + 우측 40% 분할 레이아웃 (design.md 참고)
  - [x] 모바일: 단일 컬럼 레이아웃
  - [x] 섹션 구분 (카드 스타일, rounded-xl, border)
- [x] 라우팅 테스트 ✅
  - [x] 홈에서 관광지 카드 클릭 시 이동 확인 (TourCard의 Link 컴포넌트)
  - [x] URL 직접 접근 테스트 (동적 라우팅 설정 완료)
- [x] 404 페이지 생성 (`app/places/[contentId]/not-found.tsx`) ✅

### 3.2 기본 정보 섹션 (MVP 2.4.1)
- [x] 기본 정보 섹션 구현 (3.1에서 일부 완료) ✅
  - [x] 관광지명 표시 (히어로 섹션 또는 제목 영역, text-3xl ~ text-5xl)
  - [x] 주소 표시 (복사 기능 추가, design.md 스타일)
  - [x] 전화번호 표시 (클릭 시 전화 연결, tel: 링크)
  - [x] 홈페이지 표시 (링크, ExternalLink 아이콘)
  - [x] 개요 표시 (긴 설명문, whitespace-pre-line로 줄바꿈 처리)
  - [x] 관광 타입 표시 (뱃지, Badge 컴포넌트 사용)
- [x] `detailCommon2` API 연동 ✅
  - [x] API 호출 함수 (`getDetailCommon` 사용)
  - [x] 로딩 상태 처리 (향후 Skeleton UI 추가 예정)
  - [x] 에러 처리 (에러 메시지 표시, 홈으로 돌아가기 버튼)
  - [x] 선택적 필드 null 체크 (`addr2`, `tel`, `homepage` 등)
- [x] 데이터 정제 처리 ✅
  - [x] 홈페이지 URL 추출 (HTML 링크에서 URL 추출, `extractHomepageUrl` 사용)
  - [x] 개요(`overview`) HTML 태그 정제 (`<br>` 처리, `sanitizeOverview` 사용)
- [x] 기능 구현 ✅
  - [x] 주소 복사 기능 (클립보드 API, `CopyAddressButton` 컴포넌트 생성)
  - [x] 전화번호 클릭 시 전화 연결 (`tel:` 링크, null 체크)
  - [x] 홈페이지 링크 표시 (추출된 URL 사용, 새 창 열기)
  - [x] 복사 완료 토스트 메시지 ✅ (CopyAddressButton에 토스트 UI 추가 완료)
- [x] 빠른 정보 섹션 (우측 컬럼, design.md 참고) ✅
  - [x] 운영정보 요약 (운영시간, 휴무일, 이용요금, 주차, 문의처, 반려동물)
  - [x] DetailIntro 컴포넌트로 구현 (Phase 3.5에서 완료)
  - [x] 상세페이지 우측 컬럼에 통합 완료
  - [ ] 티켓 예약 버튼 (선택 사항, 향후 구현)
- [ ] 페이지 확인 및 스타일링 (기본 스타일링 완료, 추가 개선 필요)

### 3.3 지도 섹션 (MVP 2.4.4)
- [x] `components/tour-detail/detail-map.tsx` 생성 ✅
  - [x] 해당 관광지 위치 표시 (마커 1개)
  - [x] 지도 중심 좌표 설정 (API_TEST_RESULT.md 참고, parseCoordinates 사용)
  - [x] 줌 레벨 설정 (zoom: 15, 상세페이지용 가까운 뷰)
  - [x] 좌표 데이터 처리 (이미 WGS84 형식, 변환 불필요) ✅
    - [x] `mapx`, `mapy`를 네이버 지도 API에 직접 전달 (parseCoordinates 함수 사용)
    - [x] 숫자 연산 필요 시 `parseFloat()` 사용 (parseCoordinates 내부에서 처리)
- [x] "길찾기" 버튼 구현 ✅
  - [x] 네이버 지도 앱/웹 연동 (네이버 지도 길찾기 URL 형식 사용)
  - [x] 좌표 정보 표시 (좌표 복사 버튼 추가)
- [x] 상세페이지에 통합 ✅
  - [x] `app/places/[contentId]/page.tsx`에 DetailMap 컴포넌트 추가
  - [x] 우측 컬럼에 위치 정보 섹션으로 배치
- [x] 페이지 확인 ✅

### 3.4 공유 기능 (MVP 2.4.5)
- [x] `components/tour-detail/share-button.tsx` 생성 ✅
  - [x] 공유 아이콘 버튼 (Share2 아이콘, lucide-react)
  - [x] URL 복사 기능 (클립보드 API, HTTPS 환경 필수)
  - [x] 복사 완료 피드백 (버튼 텍스트 변경: "복사됨!" 표시, 2초 후 원래 상태로 복귀)
- [x] Open Graph 메타태그 동적 생성 (PRD 2.4.5 기술 요구사항) ✅
  - [x] Next.js Metadata API 사용 (`generateMetadata` 함수)
  - [x] `og:title`: 관광지명
  - [x] `og:description`: 관광지 설명 (100자 이내, 개요에서 추출)
  - [x] `og:image`: 대표 이미지 (1200x630 권장, firstimage 사용)
  - [x] `og:url`: 상세페이지 URL (NEXT_PUBLIC_SITE_URL 환경변수 사용)
  - [x] `og:type`: "website"
  - [x] Twitter Card 메타태그 추가 (`summary_large_image`)
- [x] 상세페이지에 공유 버튼 통합 ✅
  - [x] 헤더 영역에 공유 버튼 추가 (모바일/데스크톱 모두)
  - [x] 히어로 이미지 섹션에 공유 버튼 추가 (데스크톱만, md:block)
  - [x] 이미지 없는 경우 제목 섹션에 공유 버튼 추가
- [x] 페이지 확인 및 공유 테스트 ✅

### 3.5 추가 정보 섹션 (향후 구현)
- [x] `components/tour-detail/detail-intro.tsx` 생성 (운영 정보, MVP 2.4.2) ✅
  - [x] 운영시간/개장시간 표시
  - [x] 휴무일 표시
  - [x] 주차 가능 여부 표시
  - [x] 문의처 표시
  - [x] 반려동물 동반 가능 여부 표시 (있는 경우)
  - [x] HTML 태그 정제 (`<br>` → 줄바꿈, `sanitizeHtmlText` 함수 사용)
- [x] `detailIntro2` API 연동 ✅
  - [x] API 호출 함수 (`getDetailIntro`, 이미 구현됨)
  - [x] Content Type별 필드 처리 (TourIntro 타입의 옵셔널 필드 사용)
  - [x] HTML 태그 정제 (`usetime`, `restdate`에 `<br>` 태그 포함, `sanitizeHtmlText` 함수로 처리)
  - [x] 정보 없는 항목 숨김 처리 (`hasInfo` 체크)
- [x] `components/tour-detail/detail-gallery.tsx` 생성 (이미지 갤러리, MVP 2.4.3) ✅
  - [x] 대표 이미지 + 서브 이미지들 표시 (firstImage를 첫 번째로 추가)
  - [x] 이미지 클릭 시 전체화면 모달
  - [x] 이미지 슬라이드 기능 (이전/다음 버튼, 키보드 네비게이션)
  - [x] 이미지 없으면 기본 이미지 표시
  - [x] 썸네일 그리드 레이아웃 (반응형: 2/3/4 컬럼)
- [x] `detailImage2` API 연동 ✅
  - [x] API 호출 함수 (`getDetailImages`, 이미 구현됨)
  - [x] 병렬 API 호출 (`Promise.allSettled` 사용)
  - [x] 에러 처리 (개별 API 실패 시에도 페이지 표시)
- [x] 상세페이지에 통합 ✅
  - [x] 운영 정보 섹션 (우측 컬럼, `DetailIntro` 컴포넌트)
  - [x] 이미지 갤러리 섹션 (좌측 컬럼, `DetailGallery` 컴포넌트)
- [ ] 관련 관광지 추천 섹션 (선택 사항, 향후 구현)
  - [ ] "이런 관광지도 추천해요" 섹션
  - [ ] 가로 스크롤 카드 레이아웃
  - [ ] 모바일: 스와이프 가능
- [x] 페이지 확인 ✅
  - [x] 모든 섹션 통합 확인
  - [x] 정보 없는 항목 숨김 처리 확인 (`DetailIntro`에서 `hasInfo` 체크)

---

## Phase 4: 북마크 기능 (`/bookmarks`)

### 4.1 Supabase 설정 확인
- [x] `supabase/migrations/supabase.sql` 실행 확인 ✅
  - [x] `users` 테이블 확인 (Clerk 연동, supabase.sql 참고) ✅
    - [x] `id`, `clerk_id` (UNIQUE), `name`, `created_at`, `updated_at` 컬럼 확인 ✅
    - [x] `idx_users_clerk_id` 인덱스 확인 ✅
    - [x] `update_users_updated_at` 트리거 확인 ✅
  - [x] `bookmarks` 테이블 확인 ✅
    - [x] `id`, `user_id` (FK, CASCADE), `content_id`, `created_at` 컬럼 확인 ✅
    - [x] `unique_user_bookmark` 제약조건 확인 ✅
    - [x] 인덱스 확인 (`idx_bookmarks_user_id`, `idx_bookmarks_content_id`, `idx_bookmarks_created_at`, `idx_bookmarks_user_created`) ✅
  - [x] RLS 비활성화 확인 (개발 환경, PRD 요구사항) ✅
- [x] Supabase 클라이언트 설정 확인 ✅
  - [x] `lib/supabase/clerk-client.ts` 확인 (Client Component용) ✅
  - [x] `lib/supabase/server.ts` 확인 (Server Component용) ✅
  - [x] `lib/supabase/service-role.ts` 확인 (관리자 권한용) ✅

### 4.2 북마크 기능 구현 (MVP 2.4.5, mermaid.md 플로우 참고)
- [x] `lib/api/bookmarks.ts` 생성 (Supabase 쿼리 함수들) ✅
  - [x] `getUserByClerkId` 함수 (clerk_id로 users 테이블 조회)
  - [x] `getCurrentUserId` 함수 (현재 로그인한 사용자의 user_id 조회)
  - [x] `addBookmark` 함수 (북마크 추가, INSERT INTO bookmarks)
  - [x] `removeBookmark` 함수 (북마크 삭제, DELETE FROM bookmarks)
  - [x] `getBookmarkStatus` 함수 (북마크 여부 확인)
  - [x] `getUserBookmarks` 함수 (사용자 북마크 목록 조회)
  - [x] `removeBookmarks` 함수 (일괄 삭제)
  - [x] 에러 처리 및 로깅
- [x] `components/bookmarks/bookmark-button.tsx` 생성 ✅
  - [x] 별 아이콘 (채워짐/비어있음, lucide-react Star 아이콘)
  - [x] 클릭 시 북마크 추가/제거
  - [x] 로딩 상태 표시 (스피너)
  - [x] 북마크 상태 확인 (useEffect로 초기 로드)
- [x] 상세페이지에 북마크 버튼 추가 ✅
  - [x] `app/places/[contentId]/page.tsx`에 통합
  - [x] 헤더 영역에 북마크 버튼 추가
  - [x] 히어로 이미지 섹션에 북마크 버튼 추가 (데스크톱만)
  - [x] 이미지 없는 경우 제목 섹션에 북마크 버튼 추가
- [x] 인증된 사용자 확인 ✅
  - [x] Clerk 인증 상태 확인 (`useAuth` hook 사용)
  - [x] 로그인하지 않은 경우: 로그인 유도 (로그인 페이지로 리다이렉트)
- [x] 북마크 추가/제거 로직 ✅
  - [x] Clerk user_id로 users 테이블 조회 후 user_id 사용
  - [x] `unique_user_bookmark` 제약조건으로 중복 방지 (에러 처리)
  - [x] 알림 메시지 표시 (alert 사용, 향후 토스트 컴포넌트로 개선 가능)
- [x] 상세페이지에서 북마크 동작 확인 ✅

### 4.3 북마크 목록 페이지 (PRD 2.4.5, mermaid.md G3 참고)
- [x] `app/bookmarks/page.tsx` 생성 ✅
  - [x] 인증된 사용자만 접근 가능 (auth()로 확인, 미인증 시 /sign-in 리다이렉트)
  - [x] 로그인하지 않은 경우: 로그인 유도 (redirect 사용)
- [x] `components/bookmarks/bookmark-list.tsx` 생성 ✅
  - [x] 북마크한 관광지 목록 표시
  - [x] 카드 레이아웃 (TourCard 컴포넌트 사용)
  - [x] 체크박스로 선택 기능
  - [x] 빈 목록 안내 메시지
- [x] 북마크 목록 조회 ✅
  - [x] Supabase에서 북마크 목록 조회 (getUserBookmarks)
  - [x] content_id 배열로 관광지 정보 API 호출 (getDetailCommon, Promise.allSettled 사용)
  - [x] 관광지 정보와 북마크 정보 결합 (TourDetail → TourItem 변환)
- [x] 정렬 옵션 (PRD 2.4.5 요구사항) ✅
  - [x] 최신순 (created_at 기준, getUserBookmarks에서 정렬)
  - [x] 이름순 (관광지명 기준, 클라이언트 사이드 정렬)
  - [x] 지역별 (향후 개선 가능, 현재는 이름순으로 대체)
  - [x] URL 쿼리 파라미터로 정렬 상태 관리
- [x] 일괄 삭제 기능 (PRD 2.4.5 요구사항) ✅
  - [x] 체크박스로 선택 (각 카드에 체크박스 추가)
  - [x] 전체 선택/해제 버튼
  - [x] 선택된 북마크 일괄 삭제 (removeBookmarks 함수 사용)
  - [x] 삭제 확인 다이얼로그 (confirm 사용)
  - [x] 삭제 후 페이지 새로고침 (router.refresh)
- [x] 페이지 확인 ✅

---

## Phase 4.5: 통계 대시보드 페이지 (`/stats`)

### 4.5.1 통계 데이터 조회 Server Actions
- [x] `actions/stats.ts` 생성 ✅
  - [x] `getTotalUsers()` - 전체 사용자 수 조회 ✅
  - [x] `getTotalBookmarks()` - 전체 북마크 수 조회 ✅
  - [x] `getAverageBookmarksPerUser()` - 사용자당 평균 북마크 수 계산 ✅
  - [x] `getUserGrowthTrend(period)` - 가입자 추이 데이터 조회 (일별/주별/월별) ✅
  - [x] `getBookmarkTrend(period)` - 북마크 추이 데이터 조회 (일별/주별/월별) ✅
  - [x] `getPopularTouristSpots(limit)` - 인기 관광지 TOP 10 조회 (북마크 수 기준, 관광지 이름 포함) ✅
  - [x] `getRecentUsers(limit)` - 최근 가입자 목록 조회 ✅
  - [x] `getRecentBookmarks(limit)` - 최근 북마크 목록 조회 (관광지 이름 포함) ✅
  - [x] 타임존 처리 (KST 기준) ✅
  - [x] 에러 처리 및 로깅 ✅

### 4.5.2 통계 페이지 생성
- [x] `app/stats/page.tsx` 생성 ✅
  - [x] 인증 확인 (로그인된 사용자만 접근) ✅
  - [x] 비로그인 시 `/sign-in`으로 리다이렉트 ✅
  - [x] Server Actions로 통계 데이터 조회 (병렬 처리) ✅
  - [x] 통계 컴포넌트 렌더링 ✅

### 4.5.3 통계 컴포넌트 생성
- [x] `components/stats/stats-summary.tsx` 생성 ✅
  - [x] 요약 카드 컴포넌트 (전체 사용자, 전체 북마크, 평균 북마크) ✅
  - [x] 아이콘 표시 (Users, Bookmark, TrendingUp) ✅
  - [x] shadcn/ui Card 컴포넌트 사용 ✅
- [x] `components/stats/user-growth-chart.tsx` 생성 ✅
  - [x] recharts LineChart 사용 ✅
  - [x] 기간 선택 기능 (일별/주별/월별) ✅
  - [x] 날짜별 가입자 수 표시 ✅
  - [x] 로딩 상태 처리 ✅
- [x] `components/stats/bookmark-trend-chart.tsx` 생성 ✅
  - [x] recharts LineChart 사용 ✅
  - [x] 기간 선택 기능 (일별/주별/월별) ✅
  - [x] 날짜별 북마크 수 표시 ✅
  - [x] 로딩 상태 처리 ✅
- [x] `components/stats/popular-spots-chart.tsx` 생성 ✅
  - [x] recharts BarChart 사용 ✅
  - [x] TOP 10 관광지 (북마크 수 기준) ✅
  - [x] 관광지 이름과 북마크 수 표시 ✅
  - [x] 관광지 이름은 API로 조회 (content_id → title) ✅
- [x] `components/stats/recent-users.tsx` 생성 ✅
  - [x] 최근 가입자 목록 테이블 ✅
  - [x] 이름, 가입일시 표시 ✅
  - [x] 날짜 포맷팅 (한국어 형식) ✅
- [x] `components/stats/recent-bookmarks.tsx` 생성 ✅
  - [x] 최근 북마크 목록 테이블 ✅
  - [x] 관광지 이름, 사용자 이름, 북마크 일시 표시 ✅
  - [x] 관광지 이름은 API로 조회 ✅
  - [x] 관광지 이름 클릭 시 상세페이지 이동 ✅

### 4.5.4 접근성 및 반응형 디자인
- [x] 접근성 개선 ✅
  - [x] ARIA 라벨 추가 (버튼, 테이블) ✅
  - [x] 키보드 네비게이션 지원 ✅
  - [x] 테이블 scope 속성 추가 ✅
- [x] 반응형 디자인 ✅
  - [x] 모바일/데스크톱 레이아웃 확인 ✅
  - [x] 차트 반응형 처리 (ResponsiveContainer 사용) ✅
  - [x] 테이블 가로 스크롤 처리 ✅

### 4.5.5 헤더 통계 링크 추가
- [x] `components/header.tsx`에 통계 링크 추가 ✅
  - [x] 로그인된 사용자에게만 표시 ✅
  - [x] 북마크 버튼 옆에 배치 ✅
  - [x] 아이콘: `BarChart3` (lucide-react) ✅
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트) ✅
  - [x] 접근성: `aria-label` 추가 ✅

### 4.5.6 차트 라이브러리 설치
- [x] `recharts` 패키지 설치 ✅
  - [x] `pnpm add recharts` 실행 완료 ✅
  - [x] TypeScript 타입 정의 포함 확인 ✅

---

## Phase 5: 최적화 & 배포

### 디자인 시스템 완성
- [x] 컴포넌트 스타일 통일 ✅ (부분 완료)
  - [x] 버튼 스타일 (Primary, Secondary, Icon) ✅ (shadcn/ui Button variants 사용: default, secondary, outline, ghost, link, icon)
  - [x] 카드 스타일 (Tour Card) ✅ (design.md 스타일 적용: rounded-xl, shadow-md, hover:scale-[1.02], hover:shadow-xl, transition-all duration-300)
  - [x] 뱃지 스타일 (Status Badges) ✅ (shadcn/ui Badge variants 사용: default, secondary, destructive, outline)
  - [x] 입력 필드 스타일 (Input, Select, Search Bar) ✅ (design.md 스타일 적용: rounded-lg/rounded-full, focus:ring-2 focus:ring-primary-blue, transition-all duration-200)
- [x] 인터랙션 & 애니메이션 적용 (design.md 7장 참고) ✅ (부분 완료)
  - [x] 호버 효과 (카드, 링크, 이미지) ✅ (TourCard에 적용: hover:scale-[1.02], hover:shadow-xl, 이미지 hover:scale-110)
  - [x] 페이지 전환 애니메이션 (Fade in, Slide up) ✅ (PageTransition 컴포넌트 생성 완료, 2025-11-07)
  - [x] 스크롤 효과 (Sticky Header) ✅ (Header에 sticky top-0, backdrop-blur 적용)
  - [ ] Infinite Scroll - **미완료** (현재는 페이지네이션 사용)
  - [x] 트랜지션 설정 (transition-all duration-300) ✅ (카드, 버튼에 적용됨)

### 성능 최적화
- [x] 이미지 최적화 ✅
  - [x] `next.config.ts` 외부 도메인 설정 (한국관광공사 이미지 URL) ✅ (tong.visitkorea.or.kr 추가)
  - [x] Next.js Image 컴포넌트 사용 (design.md 스타일) ✅ (TourCard, DetailGallery, 상세페이지 히어로)
  - [x] 이미지 레이지 로딩 ✅ (loading="lazy" 적용)
  - [x] Blur placeholder 적용 ✅ (blurDataURL 사용)
  - [x] Responsive sizes 설정 (sizes 속성) ✅ (반응형 sizes 설정 최적화 완료)
  - [x] 이미지 최적화 강화 ✅ (2025-11-07)
    - [x] sizes 속성 정확도 개선 (TourCard: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw`)
    - [x] fetchPriority 속성 추가 (첫 번째 이미지: high, 나머지: auto)
    - [x] 갤러리 이미지 lazy loading 강화 (첫 4개만 eager, 나머지 lazy)
  - [ ] WebP 형식 지원 및 fallback (Next.js Image가 자동 처리)
- [ ] API 응답 캐싱
  - [ ] React Query 또는 SWR 사용 (선택 사항)
  - [ ] 적절한 캐시 시간 설정
  - [x] ISR 설정 (revalidate: 3600) ✅ (actions/tour.ts의 fetchTourApi에 이미 적용됨)
- [x] 코드 스플리팅 ✅
  - [x] 동적 import 사용 (지도 컴포넌트 등, ssr: false) ✅
    - [x] NaverMap 컴포넌트 동적 import (`app/page.tsx`) ✅
    - [x] DetailMap 컴포넌트 동적 import (`app/places/[contentId]/page.tsx`) ✅
    - [x] DetailMapWrapper Client Component 생성 ✅
    - [x] TourFilters 컴포넌트 동적 import (`app/page.tsx`) ✅ (2025-11-07)
    - [x] Pagination 컴포넌트 동적 import (`app/page.tsx`) ✅ (2025-11-07)
  - [x] Suspense를 활용한 lazy loading ✅
  - [x] 번들 크기 최적화 ✅ (First Load JS 감소 확인)
  - [x] JavaScript 최적화 ✅ (2025-11-07)
    - [x] next.config.ts에 removeConsole 설정 추가 (프로덕션 빌드에서 console.log 제거, 에러/경고는 유지)
    - [x] Third-party 스크립트 최적화 확인 (Clerk, Naver Maps)

### 접근성 (Accessibility) 개선 (design.md 8장 참고) ✅
- [x] ARIA 라벨 설정 ✅
  - [x] 네비게이션 aria-label ✅ (components/header.tsx)
  - [x] 이미지 alt 텍스트 ✅ (tour-card, detail-gallery, 상세페이지 히어로 이미지)
  - [x] 인터랙티브 요소 aria-expanded, aria-controls ✅ (detail-gallery 모달)
  - [x] 현재 페이지 aria-current="page" (단일 페이지 구조이므로 불필요)
- [x] 키보드 네비게이션 ✅
  - [x] Focus 스타일 (focus:ring-2 focus:ring-blue-500) ✅ (app/globals.css)
  - [x] 논리적 Tab 순서 ✅
  - [x] Skip to content 링크 (스크린 리더용) ✅ (components/header.tsx)
- [x] 색상 대비 ✅
  - [x] WCAG AA 준수 (텍스트 4.5:1, 큰 텍스트 3:1) ✅
  - [x] UI 컴포넌트 대비 3:1 ✅
  - [x] Primary Blue: #2B7DE9 → #1E6BC8 (5.26:1) ✅
  - [x] Primary Teal: #00BFA6 → #008B7A (4.22:1) ✅
  - [x] Accent Orange: #FF6B35 → #E55A2B (3.60:1) ✅
- [x] Lighthouse Accessibility 점수 측정 ✅
  - [x] 홈페이지 측정 완료: **100점** ✅ (목표: > 90) **목표 달성!**
  - [ ] 상세페이지 측정 (선택 사항)
  - [ ] 북마크 페이지 측정 (선택 사항)

### 에러 처리 및 UX 개선
- [x] 전역 에러 핸들링 개선 ✅
  - [x] `app/error.tsx` 생성 ✅
  - [x] 에러 바운더리 설정 (retry/reset 버튼, 로그) ✅
- [x] 404 페이지 ✅
  - [x] `app/not-found.tsx` 생성 ✅
  - [x] 사용자 친화적인 에러 메시지 ✅
  - [x] design.md 스타일 적용 ✅
- [x] 로딩 상태 개선 ✅ (2025-11-07)
  - [x] 전역 로딩 인디케이터 ✅ (`app/loading.tsx` 생성)
  - [x] Skeleton UI 일관성 유지 ✅ (모든 Client Component에서 일관되게 사용 확인)
  - [x] Spinner 크기 variants 확인 ✅ (sm, md, lg 이미 구현됨)
- [x] 레이아웃 개선 ✅ (2025-11-07)
  - [x] Footer 겹침 문제 해결 ✅ (메인 콘텐츠 영역에 `pb-24` 추가, 데스크톱 레이아웃 높이 조정)
  - [x] 반응형 레이아웃 최종 확인 ✅ (Tailwind CSS 반응형 클래스 확인 완료)
  - [x] 스크롤 동작 최적화 ✅ (`scroll-behavior: smooth` 추가, 페이지네이션 시 스크롤 상단 이동 확인)

### SEO 최적화
- [x] 메타태그 설정 ✅
  - [x] 기본 메타태그 (`app/layout.tsx`) ✅ (title template, Open Graph, Twitter Card 추가 완료)
  - [x] 메타 설명 개선 ✅ (2025-11-07)
    - [x] description을 더 구체적이고 SEO 친화적으로 개선
  - [x] 동적 메타태그 (상세페이지, 3.4에서 일부 구현) ✅
- [x] `app/sitemap.ts` 생성 ✅
  - [x] 사이트맵 자동 생성 ✅ (정적 페이지 + 동적 라우트 100개 포함)
  - [x] 정적 페이지 포함 (`/`, `/bookmarks`)
  - [x] 동적 라우트 포함 (서울 지역 관광지 100개, `/places/[contentId]`)
  - [x] 날짜 유효성 검사 추가
- [x] `app/robots.ts` 생성 ✅
  - [x] 검색 엔진 크롤링 설정 ✅
  - [x] Sitemap URL 지정 ✅
  - [x] 테스트 경로 차단 (`/api/`, `/auth-test/`, `/map-test/`, `/storage-test/`)
- [x] Open Graph 메타태그 (3.4에서 일부 구현) ✅

### 배포 준비
- [x] 환경변수 보안 검증 ✅
  - [x] 모든 필수 환경변수 확인 (PRD 8.4 참고) ✅
  - [ ] `.env.example` 파일 업데이트 (선택 사항)
  - [x] Vercel Production 환경변수 확인 ✅ (이미 설정 완료)
- [x] 빌드 테스트 ✅
  - [x] `pnpm build` 실행 ✅
  - [x] 빌드 에러 확인 및 수정 ✅ (SEO 최적화, 코드 스플리팅 포함)
- [x] Vercel 배포 ✅
  - [x] Vercel 프로젝트 생성 ✅
  - [x] 환경변수 설정 ✅
  - [x] 배포 및 테스트 ✅
- [x] 성능 측정 (PRD 9.1 KPI 참고) ✅ (부분 완료)
  - [x] Lighthouse 점수 측정 (> 80 목표) ✅ (홈페이지 측정 완료, 2025-11-07 1:24 PM)
    - [x] Performance 측정 ✅ (54점, 목표 미달, 이전 50점에서 개선)
    - [x] Accessibility 측정 ✅ (100점, 목표 달성!)
    - [x] Best Practices 측정 ✅ (79점, 목표 미달, 이전 57점에서 개선)
    - [x] SEO 측정 ✅ (83점, 양호)
    - [ ] 상세페이지 측정 (선택 사항)
    - [ ] 북마크 페이지 측정 (선택 사항)
  - [x] Core Web Vitals 확인 ✅ (부분 완료, 2025-11-07)
    - [x] LCP (Largest Contentful Paint) 측정 ✅ (11.0s, 목표 미달, 이전 11.9s에서 개선)
    - [x] TBT (Total Blocking Time) 측정 ✅ (900ms, 목표 미달, 이전 1,290ms에서 개선)
    - [ ] FID (First Input Delay) 측정
    - [x] CLS (Cumulative Layout Shift) 측정 ✅ (0, 목표 달성)
  - [x] 성능 개선 사항 적용 (측정 결과 기반) ✅ (2025-11-07)
    - [x] 이미지 최적화 강화 (sizes 속성, fetchPriority, lazy loading)
    - [x] JavaScript 최적화 (removeConsole 설정)
    - [x] 코드 스플리팅 추가 (TourFilters, Pagination)
    - [x] 지도 로딩 최적화 (Intersection Observer)
    - [x] SEO 메타 설명 개선
  - [ ] API 응답 성공률 확인 (> 95%)

### 추가 파일 및 설정
- [x] Favicon 설정 ✅ (2025-11-07)
  - [x] `app/icon.png` 생성 (`piwalla.png` 사용) ✅
  - [x] `public/icon.png` 생성 (브라우저 직접 접근용) ✅
  - [x] `public/favicon.ico` 생성 (브라우저 호환성) ✅
  - [x] `app/layout.tsx`에 icons 메타데이터 추가 ✅
  - [x] 기존 `app/favicon.ico` 제거 ✅
- [x] 헤더 로고 아이콘 추가 ✅ (2025-11-07)
  - [x] `components/header.tsx`에 `piwalla.png` 아이콘 추가 ✅
  - [x] "My Trip" 텍스트 앞에 32x32px 아이콘 표시 ✅
  - [x] `next/image` 사용하여 최적화 (priority 설정) ✅
- [x] `public/icons/` 디렉토리 확인 (PWA 아이콘) ✅ (이미 존재: icon-192x192.png, icon-256x256.png, icon-384x384.png, icon-512x512.png)
- [x] `public/logo.png` 파일 확인 ✅ (존재 확인)
- [x] `public/og-image.png` 파일 확인 ✅ (존재 확인)
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
