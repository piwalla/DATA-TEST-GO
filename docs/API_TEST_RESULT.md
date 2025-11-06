# 한국관광공사 OpenAPI 테스트 결과

## 테스트 날짜
2025-01-27

## 📋 PRD 기반 확인 완료 요약

### ✅ PRD에서 요구하는 모든 API 정상 작동 확인
**PRD 4.1 사용 API 목록** (6개 API 모두 테스트 완료):
1. ✅ `/areaCode2` - 지역코드 조회 (지역 필터 생성용)
2. ✅ `/areaBasedList2` - 지역 기반 관광정보 조회 (관광지 목록용)
3. ✅ `/searchKeyword2` - 키워드 검색 (검색 기능용)
4. ✅ `/detailCommon2` - 공통정보 조회 (상세페이지 기본정보용)
5. ✅ `/detailIntro2` - 소개정보 조회 (상세페이지 운영정보용)
6. ✅ `/detailImage2` - 이미지 목록 조회 (상세페이지 갤러리용)

### ✅ PRD 데이터 구조와 실제 응답 일치 확인
- **PRD 5.1 TourItem**: 모든 필수 필드 제공 확인
- **PRD 5.2 TourDetail**: 모든 필수 필드 제공 확인 (일부 선택 필드 제외)
- **PRD 5.3 TourIntro**: 주요 필드 제공 확인 (Content Type별 차이 있음)

### ✅ PRD 요구사항 충족 확인
- Base URL: `https://apis.data.go.kr/B551011/KorService2` ✅
- 공통 파라미터: `serviceKey`, `MobileOS`, `MobileApp`, `_type` ✅
- Content Type ID: 12, 14, 15, 25, 28, 32, 38, 39 지원 ✅
- 좌표 데이터: WGS84 형식으로 바로 사용 가능 ✅

## 서비스 정보

### 기본 정보
- **서비스명**: 한국관광공사_국문 관광정보 서비스_GW
- **제공기관**: 한국관광공사 (문화체육관광부 - 관광)
- **연락처**: 디지털인프라팀 (033-738-3874)
- **라이선스**: 이용허락범위 제한 없음
- **서비스 생성일**: 2022-06-24
- **최종 수정일**: 2025-07-25
- **공식 문서**: [data.go.kr 공공데이터포털](https://www.data.go.kr/data/15101578/openapi.do)
- **상세 안내**: [한국관광공사 OpenAPI 안내](https://api.visitkorea.or.kr/#/cmsNoticeDetail?no=207)

### 제공 데이터
- **총 데이터 건수**: 약 26만 건
- **제공 데이터 종류**: 15종
  1. 지역코드정보
  2. 서비스분류코드정보
  3. 법정동코드정보
  4. 분류체계코드정보
  5. 지역기반관광정보
  6. 위치기반관광정보
  7. 키워드검색
  8. 행사정보
  9. 숙박정보
  10. 공통정보
  11. 소개정보
  12. 반복정보
  13. 이미지정보
  14. 관광정보 동기화 목록정보
  15. 반려동물 동반여행정보

### 데이터 소스
- **출처**: Visitkorea (www.visitkorea.or.kr) - 국내 최대 관광정보 포털
- **제공 방식**: 실시간 제공 (OpenAPI)
- **저작권**: 저작권 등에 구애 없이 자유롭게 활용 가능한 정보만 선별 제공

### 키워드
여행, 지역관광, 한국관광, 관광지, 반려동물친화관광, 한류산업, 미식여행, 웰니스치유

### 이미지 사용 규칙 ⚠️
**중요**: 제공되는 데이터 중 사진 자료의 경우 다음 규칙을 준수해야 합니다:
- ❌ **금지 사항**:
  - 피사체에 대한 명예훼손 및 인격권 침해 등 일반 정서에 반하는 용도의 사용
  - 기업 CI, BI로의 이용
- ✅ **허용 사항**:
  - 공공누리 1유형, 3유형 이미지 제공
  - 저작권 등에 구애 없이 자유롭게 활용 가능

### 지원 매체
- 모바일 앱
- 웹서비스
- 태블릿
- 홍보물
- 잡지
- 기타 다양한 매체

## API 키 상태
✅ **정상 작동 확인**

## 테스트 결과

### 1. 지역코드 조회 API (`/areaCode2`)
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 결과**: 서울, 인천, 대전, 대구, 광주 등 17개 지역 코드 정상 조회
- **응답 예시**:
```json
{
  "response": {
    "header": {
      "resultCode": "0000",
      "resultMsg": "OK"
    },
    "body": {
      "items": {
        "item": [
          {
            "rnum": 1,
            "code": "1",
            "name": "서울"
          }
        ]
      },
      "totalCount": 17
    }
  }
}
```

### 2. 지역기반 관광정보 조회 API (`/areaBasedList2`)
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 파라미터**: `areaCode=1` (서울), `contentTypeId=12` (관광지)
- **테스트 결과**: 서울 지역 관광지 797개 조회 성공
- **응답 데이터 구조**: 
  - `contentid`, `title`, `addr1`, `addr2`
  - `mapx`, `mapy` (좌표)
  - `firstimage`, `firstimage2` (이미지 URL)
  - `contenttypeid`, `areacode`, `sigungucode`
  - `createdtime`, `modifiedtime`

### 3. 키워드 검색 API (`/searchKeyword2`)
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 키워드**: "경복궁"
- **테스트 결과**: 14개 검색 결과 정상 조회
- **응답 데이터**: 검색 결과의 `title`, `contentid` 정상 반환

### 4. 공통정보 조회 API (`/detailCommon2`) - 상세페이지용
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 contentId**: `126508` (경복궁)
- **테스트 결과**: 상세정보 정상 조회
- **PRD 요구 필드 확인** (PRD 5.2 참고):
  - ✅ `contentid`, `contenttypeid`, `title`, `addr1`
  - ✅ `zipcode`, `homepage`, `overview`
  - ✅ `firstimage`, `firstimage2`, `mapx`, `mapy`
  - ⚠️ `addr2` (상세주소): 일부 관광지에만 존재
  - ⚠️ `tel` (전화번호): 일부 관광지에만 존재
- **응답 데이터 예시**:
  - 제목: "경복궁"
  - 주소: "서울특별시 종로구 사직로 161"
  - 개요: 긴 설명문 제공 (overview)
  - 좌표: `mapx=126.9767375783`, `mapy=37.5760836609` (WGS84 형식)

### 5. 소개정보 조회 API (`/detailIntro2`) - 상세페이지 운영정보용
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 contentId**: `126508` (경복궁), `contentTypeId=12` (관광지)
- **테스트 결과**: 운영정보 정상 조회
- **PRD 요구 필드 확인** (PRD 5.3 참고):
  - ✅ `contentid`, `contenttypeid`
  - ✅ `usetime` (이용시간/운영시간)
  - ✅ `restdate` (휴무일)
  - ✅ `infocenter` (문의처)
  - ✅ `parking` (주차 가능 여부)
  - ⚠️ `chkpet` (반려동물 동반): 관광지 타입(12)에서는 제공되지 않을 수 있음
- **응답 데이터 예시**:
  - 운영시간: "[1월~2월] 09:00~17:00 (입장마감 16:00)<br>[3월~5월] 09:00..."
  - 휴무일: "매주 화요일 <br>※ 단, 정기휴일이 공휴일 및 대체공휴일과 겹칠 경우에는 개방하며..."
  - 주차: "가능 (승용차 240대 / 버스 50대)"
- **주의사항**: 
  - Content Type ID에 따라 제공되는 필드가 다름
  - 관광지(12), 문화시설(14), 음식점(39) 등 타입별로 다른 필드 제공

### 6. 이미지 목록 조회 API (`/detailImage2`) - 상세페이지 갤러리용
- **상태**: ✅ 정상 작동
- **결과 코드**: `0000` (OK)
- **테스트 contentId**: `126508` (경복궁)
- **테스트 결과**: 이미지 목록 정상 조회 (6개 이미지)
- **응답 데이터 구조**:
  - `originimgurl`: 원본 이미지 URL
  - `smallimageurl`: 썸네일 이미지 URL
  - `imgname`: 이미지 이름
- **이미지 URL 형식**: `http://tong.visitkorea.or.kr/cms/resource/...`

## API 엔드포인트 정보

### Base URL
```
https://apis.data.go.kr/B551011/KorService2
```

### 공통 파라미터
- `serviceKey`: aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a ✅
- `MobileOS`: "ETC"
- `MobileApp`: "MyTrip"
- `_type`: "json"
- `numOfRows`: 10-20 (목록 조회 시)
- `pageNo`: 1, 2, 3... (페이지네이션)

## 확인된 사항

### ✅ 정상 작동
1. API 키 인증 정상
2. 지역코드 조회 정상 (`/areaCode2`)
3. 관광지 목록 조회 정상 (`/areaBasedList2`)
4. 키워드 검색 정상 (`/searchKeyword2`)
5. 공통정보 조회 정상 (`/detailCommon2`)
6. 소개정보 조회 정상 (`/detailIntro2`)
7. 이미지 목록 조회 정상 (`/detailImage2`)
8. JSON 응답 형식 정상
9. 한글 키워드 검색 정상 (URL 인코딩 필요)

### ⚠️ 주의사항
1. **좌표 변환**: ✅ **확인 완료** - API에서 받은 `mapx`, `mapy`는 이미 WGS84 좌표계로 제공됨
   - 테스트 결과: `mapx=126.9846616856`, `mapy=37.5820858828` (소수점 형식)
   - 타입: `string` (숫자로 변환 필요 시 `parseFloat()` 사용)
   - **결론**: PRD에서 언급한 KATEC 좌표계 변환(`10000000`으로 나누기)은 **불필요**
   - 네이버 지도 API에 바로 사용 가능한 형식

2. **이미지 URL**: 
   - `http://tong.visitkorea.or.kr/cms/resource/...` 형식
   - HTTPS 설정 필요 여부 확인 필요

3. **한글 처리**: 
   - URL에 한글 파라미터 사용 시 `encodeURIComponent()` 필수

## PRD 요구사항 대비 데이터 확인 결과

### ✅ PRD 요구 필드 대부분 제공됨
- **목록 API (`areaBasedList2`)**: PRD 5.1의 모든 필드 제공
  - `contentid`, `title`, `addr1`, `addr2`, `areacode`, `contenttypeid`
  - `mapx`, `mapy`, `firstimage`, `firstimage2`, `tel`, `cat1`, `cat2`, `cat3`, `modifiedtime`
- **상세정보 API (`detailCommon2`)**: PRD 5.2의 필드 제공
  - 필수 필드: `contentid`, `title`, `addr1`, `overview`, `mapx`, `mapy`
  - 선택 필드: `addr2`, `zipcode`, `tel`, `homepage` (일부 관광지에만 존재)
- **소개정보 API (`detailIntro2`)**: PRD 5.3의 필드 제공
  - `usetime`, `restdate`, `infocenter`, `parking` 제공
  - `chkpet`은 Content Type에 따라 제공 여부 다름

### ⚠️ 주의사항 및 구현 시 고려사항
1. **선택적 필드**: `addr2`, `tel` 등은 일부 관광지에만 존재
   - 프론트엔드에서 null/undefined 체크 필수
   - 옵셔널 체이닝(`?.`) 또는 조건부 렌더링 사용

2. **Content Type별 차이**: `detailIntro2`는 `contentTypeId`에 따라 다른 필드 제공
   - 관광지(12), 문화시설(14), 음식점(39) 등 타입별로 필드 구조 다름
   - 타입별 분기 처리 또는 유니온 타입 사용 권장

3. **HTML 태그 포함**: `overview`, `usetime`, `restdate` 등에 `<br>` 태그 포함
   - 프론트엔드에서 HTML 파싱 또는 정제 필요
   - `dangerouslySetInnerHTML` 사용 또는 HTML 태그 제거 후 `<br>` → `\n` 변환

4. **홈페이지 URL**: HTML 링크 형식으로 제공됨
   - 형식: `<a href="..." target="_blank">...</a>`
   - URL 추출 로직 필요 (정규식 또는 HTML 파싱)

5. **추가 필드**: 실제 응답에는 PRD에 없는 추가 필드도 포함
   - `createdtime`, `cpyrhtDivCd`, `mlevel`, `sigungucode`, `zipcode`
   - `lDongRegnCd`, `lDongSignguCd`, `lclsSystm1`, `lclsSystm2`, `lclsSystm3` (법정동코드 관련)
   - 향후 확장 가능성 고려하여 타입 정의 시 유연하게 설계

6. **좌표 데이터 타입**: `mapx`, `mapy`는 `string` 타입으로 제공
   - 숫자 연산 필요 시 `parseFloat()` 또는 `Number()` 사용
   - 네이버 지도 API는 문자열도 정상 처리

## 다음 단계

1. ✅ API 클라이언트 구현 (`lib/api/tour-api.ts`)
2. ✅ 타입 정의 (`lib/types/tour.ts`)
3. ✅ 실제 데이터 구조 확인 완료
4. ✅ 상세페이지 API 테스트 완료
5. ⏳ HTML 태그 정제 로직 구현 (overview, usetime 등)
6. ⏳ Content Type별 필드 처리 로직 구현
7. ⏳ 홈페이지 URL 추출 로직 구현

## 참고 문서

### 공식 문서
- [한국관광공사 OpenAPI 안내](https://api.visitkorea.or.kr/#/cmsNoticeDetail?no=207)
- [data.go.kr 공공데이터포털](https://www.data.go.kr/data/15101578/openapi.do)
- [신규 상세기능 안내 (법정동코드, 신분류코드)](https://api.visitkorea.or.kr/#/cmsNoticeDetail?no=207)

### 프로젝트 내 문서
- `docs/openapi.json` - 서비스 메타데이터 (JSON-LD 형식)
- `docs/prd.md` - 프로젝트 요구사항 문서
- `docs/TODO.md` - 개발 작업 목록

### 연락처
- **제공기관**: 한국관광공사
- **담당부서**: 디지털인프라팀
- **전화번호**: 033-738-3874
- **문의사항**: API 사용 관련 문의는 위 연락처로 문의 가능

