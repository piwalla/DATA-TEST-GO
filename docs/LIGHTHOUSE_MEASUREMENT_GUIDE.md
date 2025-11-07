# Lighthouse Accessibility 측정 가이드

> **목표**: Lighthouse Accessibility 점수 > 90 달성

---

## 측정 방법

### 1. Chrome DevTools Lighthouse 실행

1. **Chrome 브라우저에서 페이지 열기**
   - 로컬: `http://localhost:3000`
   - 프로덕션: Vercel 배포 URL

2. **Chrome DevTools 열기**
   - `F12` 키 누르기
   - 또는 마우스 오른쪽 버튼 클릭 → "검사" 선택

3. **Lighthouse 탭 선택**
   - DevTools 상단의 "Lighthouse" 탭 클릭

4. **카테고리 선택**
   - "Accessibility" 체크박스 선택
   - (선택 사항) Performance, Best Practices, SEO도 함께 측정 가능

5. **분석 실행**
   - "Generate report" 버튼 클릭
   - 분석 완료까지 대기 (약 30초~1분)

6. **결과 확인**
   - Accessibility 점수 확인 (목표: > 90)
   - 문제점 목록 확인
   - 각 문제점의 설명 및 해결 방법 확인

---

## 측정할 페이지

다음 페이지들을 각각 측정하세요:

1. **홈페이지** (`/`)
   - 메인 관광지 목록 페이지
   - 필터, 검색, 지도 포함

2. **상세페이지** (`/places/[contentId]`)
   - 대표 관광지 1-2개 선택하여 측정
   - 예: `/places/264570` (서울 관광지)

3. **북마크 페이지** (`/bookmarks`)
   - 로그인 후 접근 가능
   - 북마크 목록 표시

---

## 측정 결과 기록

### 홈페이지 (`/`)

**측정일**: 2025-11-07 12:57 PM GMT+9  
**측정 환경**: Moto G Power (모바일), Slow 4G, Chromium 142.0.0.0

| 지표 | 점수 | 상태 |
|------|------|------|
| Performance | 50 | ⚠️ 개선 필요 |
| **Accessibility** | **100** | ✅ **목표 달성!** |
| Best Practices | 57 | ⚠️ 개선 필요 |
| SEO | 83 | ✅ 양호 |

#### Performance 지표
- **FCP (First Contentful Paint)**: 1.3s
- **LCP (Largest Contentful Paint)**: 11.9s ⚠️ (목표: < 2.5s)
- **TBT (Total Blocking Time)**: 1,290ms ⚠️ (목표: < 200ms)
- **CLS (Cumulative Layout Shift)**: 0 ✅ (목표: < 0.1)
- **SI (Speed Index)**: 2.1s

#### Accessibility 결과 ✅
- **점수**: 100/100 (목표: > 90) ✅
- **자동 감지 항목**: 모두 통과 (27개)
- **수동 확인 항목**: 10개 (추가 검토 권장)
- **주요 개선 사항**:
  - ARIA 라벨 설정 완료
  - 키보드 네비게이션 개선 완료
  - 색상 대비 WCAG AA 준수 완료
  - Skip to content 링크 추가 완료

#### Best Practices 문제점
- HTTPS 미사용 (28개 insecure requests) ⚠️
- Third-party cookies 사용 (14개) ⚠️
- 이미지 aspect ratio 문제 ⚠️
- Source maps 누락

#### SEO 개선 사항
- Meta description 누락 ⚠️
- Links not crawlable ⚠️

---

### 상세페이지 (`/places/[contentId]`)

| 지표 | 점수 | 상태 |
|------|------|------|
| Accessibility | ⏳ 측정 필요 | - |

**주요 문제점:**
- ⏳ 측정 후 기록

**개선 사항:**
- ⏳ 측정 후 기록

---

### 북마크 페이지 (`/bookmarks`)

| 지표 | 점수 | 상태 |
|------|------|------|
| Accessibility | ⏳ 측정 필요 | - |

**주요 문제점:**
- ⏳ 측정 후 기록

**개선 사항:**
- ⏳ 측정 후 기록

---

## 색상 대비 확인 ✅

### 자동 계산 결과 (개선 완료)

다음 색상 조합이 WCAG AA 기준을 충족합니다:

1. **White Text on Primary Blue (#1E6BC8)** ✅
   - 현재 대비: 5.26:1
   - 필요 대비: 4.5:1
   - 상태: ✅ 통과 (개선 전: 4.03:1)

2. **Primary Teal (#008B7A) on White** ✅
   - 현재 대비: 4.22:1
   - 필요 대비: 3.0:1
   - 상태: ✅ 통과 (개선 전: 2.33:1)

3. **Accent Orange (#E55A2B) on White** ✅
   - 현재 대비: 3.60:1
   - 필요 대비: 3.0:1
   - 상태: ✅ 통과 (개선 전: 2.84:1)

### 개선 완료

모든 주요 색상 조합이 WCAG AA 기준을 충족하도록 개선되었습니다:
- Primary Blue: #2B7DE9 → #1E6BC8
- Primary Teal: #00BFA6 → #008B7A
- Accent Orange: #FF6B35 → #E55A2B

Lighthouse에서 추가 색상 대비 문제가 발견되면 개별적으로 수정하세요.

---

## 참고 자료

- [Lighthouse 문서](https://developer.chrome.com/docs/lighthouse/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

