# 다음 단계 진행 계획

> **작성일**: 2025-11-07  
> **현재 상태**: 접근성 개선 완료 (100점), 성능 개선 필요

---

## 📊 현재 상태 요약

### 완료된 작업 ✅

1. **접근성 개선 완료**
   - Lighthouse Accessibility: **100점** (목표: > 90) ✅
   - ARIA 라벨 설정 완료
   - 키보드 네비게이션 개선 완료
   - 색상 대비 WCAG AA 준수 완료

2. **성능 측정 완료**
   - Lighthouse 점수 측정 (홈페이지)
   - Core Web Vitals 부분 측정

3. **디자인 시스템**
   - 페이지 전환 애니메이션 완료
   - 코드 스플리팅 완료

### 개선이 필요한 항목 ⚠️

1. **Performance: 50점** (목표: > 80)
   - LCP: 11.9s (목표: < 2.5s) ⚠️
   - TBT: 1,290ms (목표: < 200ms) ⚠️
   - FCP: 1.3s ✅
   - CLS: 0 ✅

2. **Best Practices: 57점** (목표: > 90)
   - 이미지 aspect ratio 문제
   - Source maps 누락

3. **SEO: 83점** (목표: > 90)
   - Meta description 누락
   - Links not crawlable

---

## 🎯 추천 작업 순서

### 1단계: 성능 개선 (최우선, 2-3시간)

**목표**: Lighthouse Performance > 80, LCP < 2.5s, TBT < 200ms

#### 1.1 LCP 개선 (1-2시간)

**문제점**: LCP가 11.9초로 매우 느림 (목표: < 2.5s)

**개선 방안:**

1. **이미지 최적화 강화**
   - [ ] 히어로 이미지에 `priority` 속성 추가
   - [ ] `sizes` 속성 최적화 (실제 표시 크기에 맞게)
   - [ ] 이미지 preload 고려 (LCP 요소인 경우)

2. **지도 로딩 최적화**
   - [ ] 지도가 viewport 밖에 있을 때 lazy load (이미 적용됨, 확인 필요)
   - [ ] 지도 초기화 지연 (사용자 상호작용 후 로드)
   - [ ] 지도 스켈레톤 UI 추가

3. **폰트 최적화 확인**
   - [x] `font-display: swap` 적용 완료 ✅
   - [ ] 폰트 preload 고려 (필요 시)

4. **Critical CSS 추출**
   - [ ] Above-the-fold CSS 최적화
   - [ ] Tailwind CSS purge 확인

**예상 효과**: LCP 11.9s → 3-4s (목표: < 2.5s)

#### 1.2 TBT 개선 (1시간)

**문제점**: TBT가 1,290ms로 매우 높음 (목표: < 200ms)

**개선 방안:**

1. **JavaScript 최적화**
   - [ ] 번들 분석 (`@next/bundle-analyzer` 사용)
   - [ ] 불필요한 JavaScript 제거
   - [ ] Third-party 스크립트 최적화 (Clerk, Naver Maps)

2. **코드 스플리팅 추가**
   - [ ] 필터 컴포넌트 동적 import
   - [ ] 페이지네이션 컴포넌트 동적 import
   - [ ] 이미지 갤러리 컴포넌트 동적 import

3. **메인 스레드 블로킹 최소화**
   - [ ] 긴 작업을 작은 청크로 분할
   - [ ] `requestIdleCallback` 활용
   - [ ] Web Workers 고려 (필요 시)

**예상 효과**: TBT 1,290ms → 300-400ms (목표: < 200ms)

#### 1.3 Best Practices 개선 (30분)

**문제점**: Best Practices 57점 (목표: > 90)

**개선 방안:**

1. **이미지 aspect ratio 수정**
   - [ ] `next/image`의 `width`와 `height` 명시
   - [ ] 또는 `aspect-ratio` CSS 속성 사용

2. **Source maps 추가** (개발 환경)
   - [ ] `next.config.ts`에 source maps 설정 추가
   - [ ] 프로덕션에서는 비활성화

**예상 효과**: Best Practices 57점 → 70-80점

---

### 2단계: SEO 개선 (30분)

**목표**: Lighthouse SEO > 90

#### 2.1 Meta description 추가 (15분)

**작업 내용:**
- [ ] 홈페이지 메타 설명 추가 (`app/page.tsx` 또는 `app/layout.tsx`)
- [ ] 상세페이지 메타 설명 확인 (이미 `generateMetadata` 있음)

#### 2.2 Links crawlable 확인 (15분)

**작업 내용:**
- [ ] 동적 링크가 크롤러에 접근 가능한지 확인
- [ ] 필요 시 `rel="nofollow"` 제거 또는 수정

**예상 효과**: SEO 83점 → 90점 이상

---

### 3단계: 추가 측정 및 검증 (1시간)

#### 3.1 다른 페이지 측정 (30분)

- [ ] 상세페이지 Lighthouse 측정
- [ ] 북마크 페이지 Lighthouse 측정

#### 3.2 API 응답 성공률 확인 (30분)

- [ ] Network 탭에서 주요 API 호출 모니터링
- [ ] 성공률 계산 (목표: > 95%)

---

## 📋 작업 체크리스트

### 성능 개선
- [ ] LCP 개선
  - [ ] 히어로 이미지 priority 설정
  - [ ] sizes 속성 최적화
  - [ ] 지도 로딩 최적화
- [ ] TBT 개선
  - [ ] 번들 분석 및 최적화
  - [ ] 코드 스플리팅 추가
  - [ ] Third-party 스크립트 최적화
- [ ] Best Practices 개선
  - [ ] 이미지 aspect ratio 수정
  - [ ] Source maps 추가

### SEO 개선
- [ ] Meta description 추가
- [ ] Links crawlable 확인

### 검증
- [ ] 상세페이지 Lighthouse 측정
- [ ] 북마크 페이지 Lighthouse 측정
- [ ] API 응답 성공률 확인

---

## 🎯 목표 달성 기준

### PRD KPI 달성 목표
- ✅ **Accessibility 점수 > 90**: 100점 달성!
- ⚠️ **페이지 로딩 시간 < 3초**: LCP 11.9s로 목표 미달 → 개선 필요
- ⚠️ **Lighthouse 점수 > 80**: Performance 50점으로 목표 미달 → 개선 필요
- ⏳ **API 응답 성공률 > 95%**: 측정 필요

### Lighthouse 목표
- ⚠️ **Performance > 80**: 현재 50점
- ✅ **Accessibility > 90**: 현재 100점
- ⚠️ **Best Practices > 90**: 현재 57점
- ⚠️ **SEO > 90**: 현재 83점

---

## 📝 참고 문서

- [성능 측정 결과](./PERFORMANCE_REPORT.md)
- [접근성 개선 결과](./ACCESSIBILITY_REPORT.md)
- [Lighthouse 측정 가이드](./LIGHTHOUSE_MEASUREMENT_GUIDE.md)
- [TODO 목록](./TODO.md)

---

**다음 작업**: 성능 개선 (1단계)부터 시작하는 것을 권장합니다.


