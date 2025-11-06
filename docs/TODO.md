# My Trip 개발 TODO

한국 관광지 정보 서비스 개발 작업 목록

## Phase 1: 기본 구조 & 공통 설정

### 프로젝트 셋업
- [ ] 프로젝트 초기 설정 확인 (Next.js 15, TypeScript, Tailwind CSS v4)
- [ ] 환경 변수 설정 (`.env` 파일)
  - [ ] `NEXT_PUBLIC_TOUR_API_KEY` (한국관광공사 API 키)
  - [ ] `TOUR_API_KEY` (서버 사이드용, 필요시)
  - [ ] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (네이버 지도 클라이언트 ID)
  - [ ] Clerk 환경 변수 확인
  - [ ] Supabase 환경 변수 확인

### API 클라이언트 구현
- [ ] `app/api/tour/route.ts` 생성 (한국관광공사 API 호출)
  - [ ] `areaCode2` API 연동 (지역코드 조회)
  - [ ] `areaBasedList2` API 연동 (지역 기반 관광정보 조회)
  - [ ] `searchKeyword2` API 연동 (키워드 검색)
  - [ ] `detailCommon2` API 연동 (공통 정보 조회)
  - [ ] `detailIntro2` API 연동 (소개 정보 조회)
  - [ ] `detailImage2` API 연동 (이미지 목록 조회)
  - [ ] 에러 처리 및 로깅 추가

### 타입 정의
- [ ] `lib/types/tour.ts` 생성
  - [ ] `TourItem` 인터페이스 (목록용)
  - [ ] `TourDetail` 인터페이스 (상세정보용)
  - [ ] `TourIntro` 인터페이스 (운영정보용)
  - [ ] API 응답 타입 정의
- [ ] `lib/types/festival.ts` 생성 (필요시)

### 디자인 시스템 설정
- [ ] `app/globals.css` 업데이트 (Tailwind CSS v4 설정)
  - [ ] 컬러 팔레트 설정 (Primary Blue, Teal, Accent Orange)
  - [ ] Neutral Colors 설정 (Background, Surface, Text, Border)
  - [ ] Semantic Colors 설정 (Success, Warning, Error, Info)
- [ ] 폰트 설정
  - [ ] Pretendard, Noto Sans KR (한글) 설정
  - [ ] Inter, Helvetica Neue (영문) 설정
  - [ ] 폰트 크기 시스템 (Display, H1-H3, Body, Small, Tiny)
- [ ] 간격 시스템 설정 (Tailwind spacing scale)
- [ ] 반응형 브레이크포인트 설정 확인

### 레이아웃 및 공통 컴포넌트
- [ ] `components/header.tsx` 생성
  - [ ] 로고 (My Trip)
  - [ ] 검색창 (헤더 통합)
  - [ ] 로그인/회원가입 버튼 (Clerk)
  - [ ] Sticky 헤더 (스크롤 시 shadow 표시)
  - [ ] 반응형 디자인 (모바일: 햄버거 메뉴)
- [ ] `components/footer.tsx` 생성
  - [ ] 저작권 정보
  - [ ] About, Contact 링크
  - [ ] 한국관광공사 API 제공 표시
- [ ] `app/layout.tsx` 업데이트
  - [ ] ClerkProvider 설정 확인
  - [ ] SyncUserProvider 설정 확인
  - [ ] 메타데이터 설정
  - [ ] Header, Footer 통합
- [ ] 공통 컴포넌트 생성
  - [ ] `components/ui/loading.tsx` (로딩 스피너 - design.md 스타일 적용)
  - [ ] `components/ui/error.tsx` (에러 메시지)
  - [ ] `components/ui/skeleton.tsx` (스켈레톤 UI - animate-pulse)
  - [ ] `components/ui/toast.tsx` (토스트 메시지, shadcn/ui)
  - [ ] `components/ui/badge.tsx` (뱃지 컴포넌트 - design.md 스타일)
  - [ ] `components/ui/button.tsx` (버튼 컴포넌트 - Primary, Secondary, Icon 스타일)

### Supabase 데이터베이스 설정
- [ ] `supabase/migrations/supabase.sql` 실행 확인
  - [ ] `users` 테이블 생성 확인
  - [ ] `bookmarks` 테이블 생성 확인
  - [ ] 인덱스 생성 확인
  - [ ] RLS 비활성화 확인

---

## Phase 2: 홈페이지 (`/`) - 관광지 목록

### 2.1 페이지 기본 구조
- [ ] `app/page.tsx` 생성 (빈 레이아웃)
- [ ] 히어로 섹션 (선택 사항, design.md 참고)
  - [ ] 큰 검색창 + 필터 버튼
  - [ ] "한국의 아름다운 관광지를 탐험하세요" 문구
- [ ] 기본 UI 구조 확인
  - [ ] 헤더 (Header 컴포넌트 사용)
  - [ ] 메인 영역 (목록 + 지도)
  - [ ] 푸터 (Footer 컴포넌트 사용)
- [ ] 반응형 레이아웃 기본 구조
  - [ ] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할
  - [ ] 모바일: 탭 형태로 리스트/지도 전환

### 2.2 관광지 목록 기능 (MVP 2.1)
- [ ] `components/tour-card.tsx` 생성
  - [ ] 썸네일 이미지 표시 (기본 이미지 처리, 16:9 비율)
  - [ ] 관광지명 표시
  - [ ] 주소 표시
  - [ ] 관광 타입 뱃지 표시 (Badge 컴포넌트 사용)
  - [ ] 간단한 개요 표시 (1-2줄)
  - [ ] 클릭 시 상세페이지 이동
  - [ ] design.md 스타일 적용
    - [ ] 카드 호버 효과 (hover:scale-[1.02], hover:shadow-xl)
    - [ ] rounded-xl, shadow-md
    - [ ] 이미지 호버 효과 (hover:scale-110, overflow-hidden)
- [ ] `components/tour-list.tsx` 생성
  - [ ] 하드코딩 데이터로 테스트
  - [ ] 카드 그리드 레이아웃
  - [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] API 연동하여 실제 데이터 표시
  - [ ] `areaBasedList2` API 호출
  - [ ] 로딩 상태 표시 (Skeleton UI - design.md 스타일)
  - [ ] 에러 처리
- [ ] 페이지 확인 및 스타일링 조정

### 2.3 필터 기능 추가
- [ ] `components/tour-filters.tsx` 생성
  - [ ] 지역 필터 UI (시/도 선택)
  - [ ] 관광 타입 필터 UI (12, 14, 15, 25, 28, 32, 38, 39)
  - [ ] "전체" 옵션 제공
  - [ ] 필터 초기화 버튼
  - [ ] 정렬 옵션 UI (최신순, 이름순)
  - [ ] 지도보기 토글 버튼
  - [ ] Sticky 필터 영역 (스크롤 시 상단 고정)
  - [ ] design.md 스타일 적용 (Input/Select 스타일)
- [ ] 필터 동작 연결 (상태 관리)
  - [ ] React 상태 관리 (useState 또는 상태 관리 라이브러리)
  - [ ] URL 쿼리 파라미터 연동 (선택 사항)
- [ ] 필터링된 결과 표시
  - [ ] API 호출 시 필터 파라미터 전달
  - [ ] 필터 변경 시 목록 새로고침
- [ ] 페이지 확인 및 UX 개선

### 2.4 검색 기능 추가 (MVP 2.3)
- [ ] `components/tour-search.tsx` 생성
  - [ ] 검색창 UI (헤더 또는 상단 고정)
  - [ ] 검색 아이콘 표시 (좌측 또는 우측)
  - [ ] 검색 버튼 또는 엔터 키 처리
  - [ ] 자동완성 기능 (선택 사항)
  - [ ] design.md 스타일 적용 (Large search bar: rounded-full, shadow-lg)
- [ ] 검색 API 연동 (`searchKeyword2`)
  - [ ] 키워드 검색 실행
  - [ ] 검색 결과 개수 표시
  - [ ] 결과 없음 시 안내 메시지
- [ ] 검색 결과 표시
  - [ ] 목록 형태로 표시 (2.2와 동일한 카드 레이아웃)
  - [ ] 지도에 마커로 표시 (2.5와 연동)
- [ ] 검색 + 필터 조합 동작
  - [ ] 키워드 + 지역 필터
  - [ ] 키워드 + 관광 타입 필터
  - [ ] 모든 필터 동시 적용 가능
- [ ] 페이지 확인 및 UX 개선

### 2.5 지도 연동 (MVP 2.2)
- [ ] `components/naver-map.tsx` 생성
  - [ ] 네이버 지도 API 초기화 (NCP Maps API v3)
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
  - [ ] 지도 유형 선택 (일반/스카이뷰)
  - [ ] 현재 위치로 이동 버튼 (선택 사항)
- [ ] 반응형 레이아웃
  - [ ] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할 레이아웃
  - [ ] 모바일: 탭 형태로 리스트/지도 전환 (design.md 참고)
  - [ ] 지도 최소 높이: 400px (모바일), 600px (데스크톱)
  - [ ] 탭 UI 컴포넌트 (모바일용)
- [ ] 좌표 변환 처리
  - [ ] KATEC 좌표계 변환 (`mapx`, `mapy` → `10000000`으로 나누기)
- [ ] 페이지 확인 및 인터랙션 테스트

### 2.6 정렬 & 페이지네이션
- [ ] 정렬 옵션 추가
  - [ ] 최신순 (modifiedtime 기준)
  - [ ] 이름순 (가나다순)
  - [ ] 정렬 UI 컴포넌트
- [ ] 페이지네이션 구현
  - [ ] 페이지네이션 또는 무한 스크롤 선택
  - [ ] 페이지당 10-20개 항목
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
  - [ ] 데스크톱: 좌측 60% + 우측 40% 분할 레이아웃
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
- [ ] 기능 구현
  - [ ] 주소 복사 기능 (클립보드 API)
  - [ ] 전화번호 클릭 시 전화 연결 (`tel:` 링크)
  - [ ] 복사 완료 토스트 메시지
- [ ] 페이지 확인 및 스타일링

### 3.3 지도 섹션 (MVP 2.4.4)
- [ ] `components/tour-detail/detail-map.tsx` 생성
  - [ ] 해당 관광지 위치 표시 (마커 1개)
  - [ ] 지도 중심 좌표 설정
  - [ ] 줌 레벨 설정
- [ ] "길찾기" 버튼 구현
  - [ ] 네이버 지도 앱/웹 연동
  - [ ] 좌표 정보 표시 (선택 사항)
- [ ] 페이지 확인

### 3.4 공유 기능 (MVP 2.4.5)
- [ ] `components/tour-detail/share-button.tsx` 생성
  - [ ] 공유 아이콘 버튼 (Share/Link 아이콘)
  - [ ] URL 복사 기능 (클립보드 API)
  - [ ] 복사 완료 토스트 메시지
- [ ] Open Graph 메타태그 동적 생성
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
- [ ] `components/tour-detail/detail-intro.tsx` 생성 (운영 정보)
  - [ ] 운영시간/개장시간 표시
  - [ ] 휴무일 표시
  - [ ] 이용요금 표시
  - [ ] 주차 가능 여부 표시
  - [ ] 수용인원 표시
  - [ ] 체험 프로그램 표시 (있는 경우)
  - [ ] 유모차/반려동물 동반 가능 여부 표시
- [ ] `detailIntro2` API 연동
  - [ ] API 호출 함수
  - [ ] 타입별 필드 처리
- [ ] `components/tour-detail/detail-gallery.tsx` 생성 (이미지 갤러리)
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

## Phase 4: 북마크 페이지 (`/bookmarks`)

### 4.1 Supabase 설정
- [ ] `supabase/migrations/supabase.sql` 실행 확인
  - [ ] `users` 테이블 확인 (Clerk 연동)
  - [ ] `bookmarks` 테이블 확인
  - [ ] 인덱스 확인 (`user_id`, `content_id`, `created_at`)
  - [ ] RLS 비활성화 확인 (개발 환경)
- [ ] Supabase 클라이언트 설정 확인
  - [ ] `lib/supabase/clerk-client.ts` 확인
  - [ ] `lib/supabase/server.ts` 확인
  - [ ] `lib/supabase/service-role.ts` 확인

### 4.2 북마크 기능 구현
- [ ] `components/bookmarks/bookmark-button.tsx` 생성
  - [ ] 별 아이콘 (채워짐/비어있음)
  - [ ] 클릭 시 북마크 추가/제거
  - [ ] 로딩 상태 표시
  - [ ] 북마크 개수 표시 (선택 사항)
- [ ] 상세페이지에 북마크 버튼 추가
  - [ ] `app/places/[contentId]/page.tsx`에 통합
  - [ ] 북마크 상태 확인 (현재 사용자의 북마크 여부)
- [ ] Supabase DB 연동
  - [ ] 북마크 추가 함수 (`INSERT INTO bookmarks`)
  - [ ] 북마크 삭제 함수 (`DELETE FROM bookmarks`)
  - [ ] 북마크 조회 함수 (`SELECT FROM bookmarks WHERE user_id = ...`)
  - [ ] Clerk user_id로 users 테이블 조회 후 user_id 사용
- [ ] 인증된 사용자 확인
  - [ ] Clerk 인증 상태 확인
  - [ ] 로그인하지 않은 경우: 로그인 유도 또는 localStorage 임시 저장
- [ ] 로그인하지 않은 경우 처리
  - [ ] localStorage 임시 저장 (선택 사항)
  - [ ] 로그인 후 Supabase 동기화
- [ ] 상세페이지에서 북마크 동작 확인
  - [ ] 북마크 추가 테스트
  - [ ] 북마크 삭제 테스트
  - [ ] 토스트 메시지 확인

### 4.3 북마크 목록 페이지
- [ ] `app/bookmarks/page.tsx` 생성
  - [ ] 인증된 사용자만 접근 가능
  - [ ] 로그인하지 않은 경우: 로그인 유도
- [ ] `components/bookmarks/bookmark-list.tsx` 생성
  - [ ] 북마크한 관광지 목록 표시
  - [ ] 카드 레이아웃 (2.2와 동일한 tour-card 사용)
  - [ ] 로딩 상태 표시
  - [ ] 빈 목록 안내 메시지
- [ ] 북마크 목록 조회
  - [ ] Supabase에서 북마크 목록 조회
  - [ ] content_id 배열로 관광지 정보 API 호출
  - [ ] 관광지 정보와 북마크 정보 결합
- [ ] 정렬 옵션
  - [ ] 최신순 (created_at 기준)
  - [ ] 이름순 (관광지명 기준, API 조인)
  - [ ] 지역별 (지역코드 기준, API 조인)
- [ ] 일괄 삭제 기능
  - [ ] 체크박스로 선택
  - [ ] 선택된 북마크 일괄 삭제
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
- [ ] 인터랙션 & 애니메이션 적용
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

### 접근성 (Accessibility) 개선
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
  - [ ] 동적 메타태그 (상세페이지)
- [ ] `app/sitemap.ts` 생성
  - [ ] 사이트맵 자동 생성
- [ ] `app/robots.ts` 생성
  - [ ] 검색 엔진 크롤링 설정
- [ ] Open Graph 메타태그 (3.4에서 일부 구현)

### 배포 준비
- [ ] 환경변수 보안 검증
  - [ ] 모든 필수 환경변수 확인
  - [ ] `.env.example` 파일 업데이트
- [ ] 빌드 테스트
  - [ ] `pnpm build` 실행
  - [ ] 빌드 에러 확인 및 수정
- [ ] Vercel 배포
  - [ ] Vercel 프로젝트 생성
  - [ ] 환경변수 설정
  - [ ] 배포 및 테스트
- [ ] 성능 측정
  - [ ] Lighthouse 점수 측정 (> 80 목표)
  - [ ] Core Web Vitals 확인
  - [ ] 성능 개선 사항 적용

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
