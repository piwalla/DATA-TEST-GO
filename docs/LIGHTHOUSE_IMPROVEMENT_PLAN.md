# Lighthouse 성능 개선 계획

> **작성일**: 2025-11-07  
> **현재 점수**: Performance 54점, Best Practices 79점, SEO 83점  
> **목표**: Performance > 80점, Best Practices > 90점, SEO > 90점

---

## 📊 현재 상태 분석

### Performance: 54점 (목표: > 80)

#### 주요 지표
- **LCP**: 11.0s ⚠️ (목표: < 2.5s) - **최우선 개선 필요**
- **TBT**: 900ms ⚠️ (목표: < 200ms) - **우선 개선 필요**
- **FCP**: 1.3s ✅ (목표: < 1.8s)
- **CLS**: 0 ✅ (목표: < 0.1)
- **SI**: 2.2s ✅

#### 주요 문제점
1. **LCP가 11.0초로 매우 높음**
   - 이미지 최적화 필요 (118 KiB 절약 가능)
   - 오프스크린 이미지 지연 로딩 필요 (19 KiB 절약 가능)
   - 지도 로딩 최적화 필요

2. **TBT가 900ms로 높음**
   - JavaScript 실행 시간: 3.3초
   - 메인 스레드 작업: 5.1초
   - 미사용 JavaScript 제거 필요 (835 KiB 절약 가능)
   - JavaScript 압축 필요 (332 KiB 절약 가능)

3. **기타 진단 항목**
   - CSS 압축 필요 (11 KiB 절약 가능)
   - 미사용 CSS 제거 필요 (18 KiB 절약 가능)
   - 레거시 JavaScript 제거 필요 (16 KiB 절약 가능)
   - 패시브 리스너 사용 필요 (스크롤 성능 개선)

### Best Practices: 79점 (목표: > 90)

#### 주요 문제점
1. **Third-party cookies**: 7개 쿠키 발견
   - Clerk 인증 관련 (필수)
   - Naver Maps API 관련 (필수)
   - 개선 불가 (필수 기능)

2. **Source maps 누락**
   - 프로덕션에서는 의도적으로 비활성화 (보안 및 성능)
   - 개선 불가 (의도적 설정)

3. **Issues logged**
   - Chrome DevTools Issues 패널 확인 필요

### SEO: 83점 (목표: > 90)

#### 주요 문제점
1. **Meta description 누락**
   - 홈페이지 전용 메타데이터 추가 필요

2. **Links not crawlable**
   - 동적 링크의 크롤러 접근성 확인 필요

---

## 🎯 개선 계획

### 1단계: LCP 개선 (최우선, 2-3시간)

**목표**: LCP 11.0s → 3-4s (최종 목표: < 2.5s)

#### 1.1 이미지 최적화 강화
- **파일**: `components/tour-card.tsx`, `app/page.tsx`
- **작업**:
  - [ ] 첫 번째 카드 이미지에 `priority` 속성 확인 (이미 적용됨)
  - [ ] `sizes` 속성 최적화 (실제 표시 크기에 맞게)
  - [ ] 오프스크린 이미지 지연 로딩 강화
  - [ ] 이미지 preload 고려 (LCP 요소인 경우)

#### 1.2 지도 로딩 최적화 강화
- **파일**: `app/page.tsx`, `components/naver-map.tsx`
- **작업**:
  - [ ] 모바일에서 지도 탭이 비활성화된 경우 지도 로딩 완전 차단 (이미 구현됨)
  - [ ] 데스크톱에서 지도가 viewport 밖에 있을 때 lazy load 확인 (이미 구현됨)
  - [ ] 지도 스크립트 로딩 지연 (사용자 상호작용 후 로드)

#### 1.3 폰트 최적화
- **파일**: `app/layout.tsx`
- **작업**:
  - [x] `font-display: swap` 적용 완료 ✅
  - [ ] 폰트 preload 고려 (필요 시)

**예상 효과**: LCP 11.0s → 4-5s

---

### 2단계: TBT 개선 (우선, 2-3시간)

**목표**: TBT 900ms → 300-400ms (최종 목표: < 200ms)

#### 2.1 JavaScript 최적화
- **파일**: `next.config.ts`, 전체 프로젝트
- **작업**:
  - [ ] JavaScript 압축 확인 (Next.js가 자동 처리하지만 확인 필요)
  - [ ] 미사용 JavaScript 제거 (835 KiB 절약 가능)
  - [ ] 코드 스플리팅 강화 (이미 일부 적용됨)
  - [ ] 레거시 JavaScript 제거 (16 KiB 절약 가능)

#### 2.2 메인 스레드 최적화
- **파일**: 전체 프로포넌트
- **작업**:
  - [ ] 긴 작업을 작은 청크로 분할
  - [ ] `requestIdleCallback` 활용
  - [ ] Web Workers 고려 (필요 시)

#### 2.3 Third-party 스크립트 최적화
- **파일**: `app/layout.tsx`, `components/naver-map.tsx`
- **작업**:
  - [ ] Clerk 스크립트 로딩 최적화 확인
  - [ ] Naver Maps API 스크립트 로딩 최적화 확인
  - [ ] 패시브 리스너 사용 (스크롤 이벤트)

**예상 효과**: TBT 900ms → 300-400ms

---

### 3단계: Best Practices 개선 (30분)

**목표**: Best Practices 79점 → 85-90점

#### 3.1 Issues 확인
- **작업**:
  - [ ] Chrome DevTools Issues 패널 확인
  - [ ] 발견된 이슈 해결

**예상 효과**: Best Practices 79점 → 85-90점

---

### 4단계: SEO 개선 (30분)

**목표**: SEO 83점 → 90점 이상

#### 4.1 Meta description 추가
- **파일**: `app/page.tsx`
- **작업**:
  - [ ] 홈페이지 전용 `generateMetadata` 함수 추가
  - [ ] 메타 설명 최적화

#### 4.2 Links crawlable 확인
- **파일**: 전체 프로젝트
- **작업**:
  - [ ] 동적 링크의 크롤러 접근성 확인
  - [ ] 필요 시 `rel="nofollow"` 제거 또는 수정

**예상 효과**: SEO 83점 → 90점 이상

---

## 📋 우선순위별 작업 목록

### 최우선 (즉시 진행)
1. ✅ 이미지 최적화 강화 (LCP 개선)
2. ✅ JavaScript 최적화 (TBT 개선)
3. ✅ SEO 메타 설명 추가

### 우선 (1-2일 내)
4. 지도 로딩 최적화 강화
5. 메인 스레드 최적화
6. Best Practices Issues 확인

### 일반 (1주일 내)
7. 폰트 preload 고려
8. Web Workers 고려
9. 추가 성능 측정 및 최적화

---

## 📊 예상 개선 효과

### Performance
- **현재**: 54점
- **1단계 후**: 60-65점 (LCP 개선)
- **2단계 후**: 70-75점 (TBT 개선)
- **최종 목표**: 80점 이상

### Best Practices
- **현재**: 79점
- **개선 후**: 85-90점

### SEO
- **현재**: 83점
- **개선 후**: 90점 이상

---

## 참고 자료

- [Lighthouse 성능 점수 계산기](https://web.dev/performance-scoring/)
- [LCP 최적화 가이드](https://web.dev/lcp/)
- [TBT 최적화 가이드](https://web.dev/tbt/)
- [Next.js 성능 최적화](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-11-07


