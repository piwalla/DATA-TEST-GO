# 다음 작업 계획

> **작성일**: 2025-11-07  
> **현재 상태**: 성능 및 UX 개선 통합 작업 완료

---

## 📊 현재 상태 요약

### 최근 완료된 작업 (2025-11-07)

✅ **성능 및 UX 개선 통합 작업 완료**
- 지도 로딩 최적화 (Intersection Observer 적용)
- 코드 스플리팅 추가 (TourFilters, Pagination)
- 이미지 최적화 강화 (sizes, fetchPriority)
- JavaScript 최적화 (removeConsole 설정)
- 전역 로딩 인디케이터 생성
- 스크롤 동작 최적화
- SEO 메타 설명 개선

**개선 효과:**
- Performance: 50점 → **54점** (+4점)
- Best Practices: 57점 → **79점** (+22점)
- LCP: 11.9s → **11.0s** (-0.9s)
- TBT: 1,290ms → **900ms** (-390ms)

### 현재 Lighthouse 점수

| 지표 | 현재 | 목표 | 상태 |
|------|------|------|------|
| Performance | 54점 | > 80 | ⚠️ 개선 필요 |
| Accessibility | 100점 | > 90 | ✅ **목표 달성!** |
| Best Practices | 79점 | > 90 | ⚠️ 개선 필요 |
| SEO | 83점 | > 90 | ⚠️ 개선 필요 |

### Core Web Vitals

| 지표 | 현재 | 목표 | 상태 |
|------|------|------|------|
| LCP | 11.0s | < 2.5s | ⚠️ 개선 필요 |
| TBT | 900ms | < 200ms | ⚠️ 개선 필요 |
| CLS | 0 | < 0.1 | ✅ 목표 달성 |

---

## 🎯 우선순위별 다음 작업

### 최우선 작업 (즉시 진행 권장)

#### 1. LCP 추가 개선 (1-2시간)

**목표**: LCP 11.0s → 3-4s (최종 목표: < 2.5s)

**작업 내용:**
- [ ] 이미지 preload 고려 (LCP 요소인 경우)
  - 첫 번째 카드 이미지 또는 히어로 이미지 preload
  - `<link rel="preload" as="image">` 추가
- [ ] 지도 스크립트 로딩 지연 강화
  - 사용자 상호작용 후 지도 로드 (클릭 또는 스크롤)
  - 지도 스켈레톤 UI 개선

**예상 효과**: LCP 11.0s → 4-5s

---

#### 2. TBT 추가 개선 (1-2시간)

**목표**: TBT 900ms → 300-400ms (최종 목표: < 200ms)

**작업 내용:**
- [ ] 미사용 JavaScript 제거 (835 KiB 절약 가능)
  - 번들 분석 실행 (`pnpm analyze`)
  - 미사용 라이브러리 제거
  - Tree-shaking 확인
- [ ] 패시브 리스너 사용
  - 스크롤 이벤트에 `{ passive: true }` 옵션 추가
  - 터치 이벤트 최적화

**예상 효과**: TBT 900ms → 300-400ms

---

#### 3. Best Practices Issues 확인 (30분)

**작업 내용:**
- [ ] Chrome DevTools Issues 패널 확인
  - 콘솔에서 Issues 탭 열기
  - 발견된 이슈 목록 확인
  - 해결 가능한 이슈 수정

**예상 효과**: Best Practices 79점 → 85-90점

---

### 우선 작업 (1-2일 내)

#### 4. SEO 개선 (30분)

**목표**: SEO 83점 → 90점 이상

**작업 내용:**
- [ ] 상세페이지 메타 설명 확인
  - `generateMetadata` 함수 확인
  - Lighthouse 경고 원인 파악
- [ ] Links crawlable 확인
  - 동적 링크 크롤러 접근성 확인
  - 필요 시 `rel="nofollow"` 제거 또는 수정

**예상 효과**: SEO 83점 → 90점 이상

---

#### 5. API 응답 성공률 확인 (30분)

**작업 내용:**
- [ ] Chrome DevTools Network 탭에서 API 호출 모니터링
- [ ] 성공/실패 횟수 기록
- [ ] 목표: 성공률 > 95%

---

### 일반 작업 (1주일 내)

#### 6. 추가 성능 측정

**작업 내용:**
- [ ] 상세페이지 Lighthouse 측정
- [ ] 북마크 페이지 Lighthouse 측정
- [ ] FID (First Input Delay) 측정

---

#### 7. API 응답 캐싱 (선택 사항, 1-2시간)

**작업 내용:**
- [ ] React Query 또는 SWR 도입
- [ ] 관광지 목록 캐싱 (staleTime: 1시간)
- [ ] 상세페이지 캐싱 (staleTime: 1시간)

**예상 효과**: API 호출 횟수 감소, 사용자 경험 개선

---

## 📋 작업 우선순위 요약

### 즉시 진행 (오늘)
1. ✅ LCP 추가 개선 (이미지 preload, 지도 스크립트 지연)
2. ✅ TBT 추가 개선 (미사용 JavaScript 제거, 패시브 리스너)
3. ✅ Best Practices Issues 확인

### 이번 주 내
4. SEO 개선 (Links crawlable 확인)
5. API 응답 성공률 확인
6. 추가 성능 측정

### 선택 사항
7. API 응답 캐싱 (React Query 도입)

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

## 참고 문서

- [LIGHTHOUSE_IMPROVEMENT_PLAN.md](./LIGHTHOUSE_IMPROVEMENT_PLAN.md) - 상세 개선 계획
- [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) - 성능 측정 결과
- [TODO.md](./TODO.md) - 전체 작업 목록

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-11-07


