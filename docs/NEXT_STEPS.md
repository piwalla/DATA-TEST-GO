# My Trip 향후 진행 계획

> **작성일**: 2025-11-06  
> **기준 문서**: [PROGRESS_REPORT.md](./PROGRESS_REPORT.md), [TODO.md](./TODO.md), [PRD.md](./prd.md)

---

## 📊 현재 상태 요약

### 완료된 작업 (Phase 1-4)
- ✅ **Phase 1**: 기본 구조 & 공통 설정 (100%)
- ✅ **Phase 2**: 홈페이지 - 관광지 목록, 필터, 검색, 지도, 페이지네이션 (100%)
- ✅ **Phase 3**: 상세페이지 - 기본 정보, 지도, 공유, 운영정보, 이미지 갤러리 (100%)
- ✅ **Phase 4**: 북마크 기능 - Supabase 연동, 북마크 목록 페이지 (100%)

### 부분 완료 (Phase 5)
- ✅ 이미지 최적화 (next/image, lazy loading, blur placeholder)
- ✅ 전역 에러 핸들링 (`app/error.tsx`)
- ✅ 404 페이지 (`app/not-found.tsx`)
- ✅ 기본 메타태그 설정 (`app/layout.tsx`)
- ✅ 메타데이터 보강 (metadataBase 추가)
- ✅ Vercel 배포 완료

### 진행률
- **Phase 1-4**: 100% 완료 ✅
- **Phase 5**: 약 40% 완료

---

## 🎯 향후 진행 계획 (우선순위별)

### 🔴 우선순위 1: SEO 최적화 (필수, 30분)

**목표**: 검색 엔진 최적화를 통한 노출 개선

#### 작업 내용
1. **Sitemap 생성** (`app/sitemap.ts`)
   - 정적 페이지 포함 (`/`, `/bookmarks`)
   - 동적 라우트 포함 (`/places/[contentId]`)
   - 선택 사항: 인기 관광지 일부 포함 (API 호출)

2. **Robots.txt 생성** (`app/robots.ts`)
   - 검색 엔진 크롤링 허용 설정
   - Sitemap URL 지정
   - 불필요한 경로 차단 (선택 사항)

**예상 소요 시간**: 30분  
**완료 기준**: `https://your-site.com/sitemap.xml`, `https://your-site.com/robots.txt` 접근 가능

---

### 🟠 우선순위 2: 성능 최적화 (필수, 1-2시간)

**목표**: 페이지 로딩 속도 개선 및 사용자 경험 향상 (PRD KPI: 로딩 시간 < 3초)

#### 2.1 API 응답 캐싱 (1-2시간)
1. **React Query 도입**
   - `@tanstack/react-query` 설치
   - QueryClient Provider 설정 (`app/layout.tsx` 또는 별도 Provider)
   - 캐싱 전략 설정:
     - 관광지 목록: `staleTime: 3600000` (1시간)
     - 상세페이지: `staleTime: 3600000` (1시간)
     - 이미지 목록: `staleTime: 3600000` (1시간)
   - 기존 Server Actions를 React Query hooks로 래핑

2. **ISR 설정 확인**
   - `actions/tour.ts`의 `fetchTourApi`에 `revalidate: 3600` 이미 적용됨 ✅
   - 추가 최적화 필요 시 검토

**예상 소요 시간**: 1-2시간

#### 2.2 코드 스플리팅 (30분)
1. **지도 컴포넌트 동적 import**
   - `components/naver-map.tsx` → `dynamic(() => import(...), { ssr: false })`
   - `components/tour-detail/detail-map.tsx` → 동일하게 처리
   - 초기 번들 크기 감소 효과

2. **Suspense를 활용한 lazy loading**
   - 이미지 갤러리 컴포넌트 lazy loading (선택 사항)

**예상 소요 시간**: 30분

**완료 기준**: 
- Lighthouse Performance 점수 > 80
- 페이지 로딩 시간 < 3초 (PRD KPI)

---

### 🟡 우선순위 3: 접근성 개선 (권장, 2-3시간)

**목표**: WCAG AA 준수 및 모든 사용자 접근성 향상

#### 3.1 ARIA 라벨 설정 (1시간)
- 네비게이션 `aria-label` 추가
- 이미지 `alt` 텍스트 개선 (현재 일부만 적용됨)
- 인터랙티브 요소 `aria-expanded`, `aria-controls` 추가
- 현재 페이지 `aria-current="page"` 추가

#### 3.2 키보드 네비게이션 (1시간)
- Focus 스타일 개선 (`focus:ring-2 focus:ring-blue-500`)
- 논리적 Tab 순서 확인
- Skip to content 링크 추가 (스크린 리더용)

#### 3.3 색상 대비 (30분)
- WCAG AA 준수 확인 (텍스트 4.5:1, 큰 텍스트 3:1)
- UI 컴포넌트 대비 3:1 확인

**예상 소요 시간**: 2-3시간  
**완료 기준**: Lighthouse Accessibility 점수 > 90

---

### 🟢 우선순위 4: UX 개선 (권장, 1-2시간)

**목표**: 사용자 경험 개선 및 일관성 유지

#### 4.1 로딩 상태 개선 (1시간)
- 전역 로딩 인디케이터 (라우트 전환 시)
- Skeleton UI 일관성 유지
- Spinner 크기 variants (sm, md, lg)

#### 4.2 레이아웃 개선 (1시간)
- 반응형 레이아웃 최종 확인 (320px ~ 1920px)
- 스크롤 동작 최적화 (부드러운 스크롤 효과)

**예상 소요 시간**: 1-2시간

---

### 🔵 우선순위 5: 디자인 시스템 완성 (선택, 2-3시간)

**목표**: 일관된 디자인 시스템 구축

#### 5.1 컴포넌트 스타일 통일 (1-2시간)
- 버튼 스타일 variants (Primary, Secondary, Icon)
- 카드 스타일 통일 (Tour Card)
- 뱃지 스타일 통일 (Status Badges)
- 입력 필드 스타일 통일 (Input, Select, Search Bar)

#### 5.2 인터랙션 & 애니메이션 (1시간)
- 호버 효과 개선 (카드, 링크, 이미지)
- 페이지 전환 애니메이션 (Fade in, Slide up)
- 트랜지션 설정 통일 (`transition-all duration-300`)

**예상 소요 시간**: 2-3시간

---

### 🟣 우선순위 6: 배포 최종 확인 (필수, 1시간)

**목표**: 프로덕션 배포 전 최종 검증

#### 6.1 환경변수 보안 검증 (30분)
- 모든 필수 환경변수 확인:
  - `NEXT_PUBLIC_TOUR_API_KEY`
  - `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
  - `NEXT_PUBLIC_SITE_URL` (Vercel 배포 URL)
  - Clerk 환경변수
  - Supabase 환경변수
- `.env.example` 파일 업데이트

#### 6.2 성능 측정 (30분)
- Lighthouse 점수 측정 (> 80 목표)
  - Performance
  - Accessibility
  - Best Practices
  - SEO
- Core Web Vitals 확인
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- API 응답 성공률 확인 (> 95%, PRD KPI)

**예상 소요 시간**: 1시간

---

### ⚪ 우선순위 7: 추가 기능 (선택 사항)

#### 7.1 관련 관광지 추천 섹션 (1-2시간)
- "이런 관광지도 추천해요" 섹션 (상세페이지)
- 가로 스크롤 카드 레이아웃
- 모바일: 스와이프 가능

#### 7.2 지도 기능 개선 (1-2시간)
- 리스트 항목 호버 시 해당 마커 강조
- 관광 타입별 마커 색상 구분
- "현재 위치로" 버튼 추가

#### 7.3 다크 모드 지원 (2-3시간)
- Tailwind dark 모드 설정
- 테마 전환 버튼 (Header에 추가)
- design.md 컬러 팔레트 적용

---

## 📅 권장 진행 순서

### 세션 1 (약 1시간)
1. ✅ **SEO 최적화** (30분)
   - Sitemap 생성
   - Robots.txt 생성

2. ✅ **성능 최적화 - 코드 스플리팅** (30분)
   - 지도 컴포넌트 동적 import

### 세션 2 (약 2-3시간)
1. ✅ **성능 최적화 - API 캐싱** (1-2시간)
   - React Query 도입
   - 캐싱 전략 설정

2. ✅ **배포 최종 확인** (1시간)
   - 환경변수 검증
   - Lighthouse 측정

### 세션 3 (약 2-3시간, 선택)
1. ✅ **접근성 개선** (2-3시간)
   - ARIA 라벨 설정
   - 키보드 네비게이션
   - 색상 대비 확인

### 세션 4 (약 1-2시간, 선택)
1. ✅ **UX 개선** (1-2시간)
   - 로딩 상태 개선
   - 레이아웃 최종 확인

---

## 🎯 최종 목표 (PRD KPI 기준)

### 기능적 지표
- ✅ MVP 4가지 핵심 기능 모두 정상 작동 (목록/지도/검색/상세)
- ✅ API 응답 성공률 > 95%
- ⏳ 페이지 로딩 시간 < 3초 (성능 최적화 후 측정)
- ✅ 북마크 데이터 정확도 > 99%
- ✅ URL 복사 성공률 > 95%

### 기술적 지표
- ⏳ Lighthouse 점수 > 80 (모든 카테고리)
- ⏳ Core Web Vitals 통과
- ⏳ SEO 점수 > 90

---

## 📝 참고 사항

### 다음 세션 시작 전 확인 사항
1. Vercel Production 환경변수 확인
2. 배포된 사이트 동작 확인
3. `.env.example` 파일 업데이트 필요 여부 확인

### 작업 시 주의사항
- **SEO 최적화**: Sitemap에 동적 라우트를 포함할 때 API 호출이 많아질 수 있으므로, 인기 관광지만 선별적으로 포함하는 것을 권장
- **성능 최적화**: React Query 도입 시 기존 Server Actions 구조를 최대한 유지하면서 점진적으로 전환
- **접근성**: 모든 변경사항은 실제 스크린 리더로 테스트 권장

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-11-06


