# 네이버 클라우드 플랫폼 Maps API 확인 결과

## 테스트 날짜
2025-01-27

## 📋 서비스 정보

### 기본 정보
- **서비스명**: 네이버 클라우드 플랫폼 Maps API
- **제공기관**: 네이버 클라우드 플랫폼 (NAVER Cloud Corp.)
- **공식 문서**: [네이버 클라우드 플랫폼 Maps 개요](https://api.ncloud-docs.com/docs/ko/application-maps-overview)
- **사용 가이드**: [Maps 사용 가이드](https://guide.ncloud-docs.com/docs/ko/application-maps-overview)

### 제공 기능
네이버 클라우드 플랫폼 Maps API는 위치 기반 서비스를 구축할 수 있도록 다양한 기능을 제공합니다:

1. **Dynamic Map** (Web Dynamic Map, Mobile Dynamic Map)
   - 인터랙티브 지도 이미지 생성
   - 마커, 정보창, 경로 표시 등 동적 기능
   - **PRD 2.2에서 사용 예정**: 관광지 목록 + 지도 연동

2. **Static Map**
   - 정적 지도 이미지 생성
   - RESTful API 형태

3. **Geocoding**
   - 주소를 좌표로 변환
   - RESTful API 형태

4. **Reverse Geocoding**
   - 좌표를 주소로 변환
   - RESTful API 형태

5. **Directions 5/15**
   - 경로 탐색 (경유지 최대 5개 또는 15개)
   - RESTful API 형태

### 요금 정보
- **무료 할당량**: 월 10,000,000건 (PRD 8.2 참고)
- **신용카드 등록**: 필수 (PRD 8.2 참고)

---

## 🔧 기술 요구사항 (PRD 기준)

### PRD 2.2 기술 요구사항
- **API 버전**: Naver Maps JavaScript API v3 (NCP)
- **플랫폼**: 네이버 클라우드 플랫폼(NCP) Maps API 사용
- **URL 파라미터**: `ncpKeyId` (구 `ncpClientId` 아님) ⚠️
- **클러스터링 모듈**: 현재 미지원 (일반 마커 사용)
- **좌표 데이터**: `mapx` (경도), `mapy` (위도)
  - **중요**: 한국관광공사 API 테스트 결과, 좌표는 이미 **WGS84 형식**으로 제공됨 (변환 불필요)
  - 형식 예시: `mapx=126.9846616856`, `mapy=37.5820858828` (소수점, string 타입)

### 좌표 처리 방법
- **PRD 원문**: "KATEC 좌표계, 정수형으로 저장 → `10000000`으로 나누어 변환"
- **실제 테스트 결과**: ❌ **변환 불필요**
  - API에서 받은 좌표는 이미 WGS84 형식 (소수점)
  - 네이버 지도 API에 바로 사용 가능
  - 숫자 연산 필요 시 `parseFloat()` 또는 `Number()` 사용

---

## 📝 API 사용 방법

### 1. 네이버 클라우드 플랫폼 설정

#### Application 등록
1. [네이버 클라우드 플랫폼](https://www.ncloud.com/) 가입
2. 콘솔에서 **Application Services** > **Maps** > **이용 신청**
3. 약관 동의 후 **Application 등록**
4. 애플리케이션 이름 입력
5. **사용할 API 선택**: **Web Dynamic Map** 필수 선택 ⚠️
   - 선택하지 않으면 429 (Quota Exceed) 오류 발생
6. 서비스 환경 등록: 웹 서비스 URL 입력
   - 로컬 테스트: `http://localhost:포트번호`

#### 인증 정보 발급
- 애플리케이션 등록 완료 후 **API 관리** > **인증 정보**에서 확인
- **Client ID**: `x-ncp-apigw-api-key-id` (RESTful API용)
- **Client Secret**: `x-ncp-apigw-api-key` (RESTful API용)
- **JavaScript SDK용 Key ID**: `ncpKeyId` 또는 `ncpClientId` (문서 확인 필요)

### 2. JavaScript SDK 사용 (PRD 2.2 기준)

#### 스크립트 로드
```html
<!-- PRD 2.2에 따르면 ncpKeyId 사용 (구 ncpClientId 아님) -->
<script type="text/javascript" 
        src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_KEY_ID">
</script>
```

**⚠️ 주의사항**:
- PRD에서는 `ncpKeyId`를 사용한다고 명시되어 있으나, 실제 문서에서는 `ncpClientId`를 사용하는 예시도 있음
- 실제 구현 시 네이버 클라우드 플랫폼 콘솔에서 발급받은 정확한 파라미터명 확인 필요
- 최신 문서 확인 필요: [네이버 지도 API 공식 문서](https://naver.github.io/naver-openapi-guide/apilist.html)

#### 기본 지도 초기화
```javascript
// 지도를 표시할 div 요소
<div id="map" style="width:100%;height:400px;"></div>

<script>
  // 지도 초기화
  var mapOptions = {
    center: new naver.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
    zoom: 10
  };

  var map = new naver.maps.Map('map', mapOptions);
</script>
```

#### 마커 추가 (PRD 2.2 요구사항)
```javascript
// 관광지 좌표 (이미 WGS84 형식)
var tourLocation = new naver.maps.LatLng(
  parseFloat(tourItem.mapy), // 위도
  parseFloat(tourItem.mapx)  // 경도
);

// 마커 생성
var marker = new naver.maps.Marker({
  position: tourLocation,
  map: map
});

// 인포윈도우 (PRD 2.2 요구사항)
var infoWindow = new naver.maps.InfoWindow({
  content: `
    <div>
      <h3>${tourItem.title}</h3>
      <p>${tourItem.addr1}</p>
      <button onclick="goToDetail(${tourItem.contentid})">상세보기</button>
    </div>
  `
});

// 마커 클릭 시 인포윈도우 표시
naver.maps.Event.addListener(marker, 'click', function() {
  infoWindow.open(map, marker);
});
```

### 3. RESTful API 사용 (선택 사항)

#### 요청 헤더
```
x-ncp-apigw-api-key-id: YOUR_CLIENT_ID
x-ncp-apigw-api-key: YOUR_CLIENT_SECRET
```

#### API 엔드포인트
- Static Map: `https://maps.apigw.ntruss.com/map-static/v2`
- Geocoding: `https://maps.apigw.ntruss.com/map-geocode/v2`
- Reverse Geocoding: `https://maps.apigw.ntruss.com/map-reversegeocode/v2`
- Directions 5: `https://maps.apigw.ntruss.com/map-direction/v1`
- Directions 15: `https://maps.apigw.ntruss.com/map-direction-15/v1`

---

## ✅ PRD 요구사항 대비 확인 사항

### PRD 2.2 네이버 지도 연동 요구사항

#### ✅ 확인 완료
1. **API 버전**: Naver Maps JavaScript API v3 (NCP) ✅
2. **좌표 형식**: WGS84 (변환 불필요) ✅
   - 한국관광공사 API 테스트 결과 확인 (API_TEST_RESULT.md 참고)
3. **기본 지도 표시**: 가능 ✅
4. **마커 표시**: 가능 ✅
5. **인포윈도우**: 가능 ✅
6. **지도-리스트 연동**: 구현 가능 ✅

#### ⚠️ 확인 필요
1. **URL 파라미터**: `ncpKeyId` vs `ncpClientId`
   - PRD에서는 `ncpKeyId` 명시
   - 실제 문서에서는 `ncpClientId` 예시도 있음
   - **실제 구현 시 네이버 클라우드 플랫폼 콘솔에서 확인 필요**

2. **클러스터링 모듈**: PRD에서 미지원으로 명시
   - 일반 마커 사용으로 대체

3. **환경변수 설정**: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
   - 실제 키 발급 후 테스트 필요

### PRD 2.4.4 상세페이지 지도 섹션 요구사항

#### ✅ 확인 완료
1. **단일 마커 표시**: 가능 ✅
2. **길찾기 버튼**: 네이버 지도 앱/웹 연동 가능 ✅
   - URL 스킴: `nmap://route?dlat=위도&dlng=경도&dname=목적지명`
   - 또는: `https://map.naver.com/v5/directions/목적지명`

---

## 🚨 주의사항 및 제약사항

### 인증 및 설정
1. **Application 등록 필수**
   - Web Dynamic Map 서비스 활성화 필수
   - 서비스 환경(URL) 등록 필수

2. **API 선택 확인**
   - Application 등록 시 사용할 API 선택 필수
   - 선택하지 않으면 429 (Quota Exceed) 오류 발생

3. **신용카드 등록 필수** (PRD 8.2)
   - 무료 사용량 사용을 위해서도 등록 필요

### 사용량 제한
- **월 무료 할당량**: 10,000,000건 (PRD 8.2)
- **초과 시**: 요금 부과
- 사용량 모니터링 필요

### 좌표 데이터 처리
- **중요**: 한국관광공사 API에서 받은 `mapx`, `mapy`는 이미 WGS84 형식
- **변환 불필요**: PRD에서 언급한 KATEC 좌표계 변환(`10000000`으로 나누기)은 **불필요**
- 타입: `string` (숫자 연산 필요 시 `parseFloat()` 사용)

### 클러스터링
- **현재 미지원**: PRD에서 명시
- 많은 마커 표시 시 성능 고려 필요
- 대안: 줌 레벨에 따른 마커 필터링

### 보안
- **Client ID**: 클라이언트 사이드 노출 가능 (NEXT_PUBLIC_ 접두사)
- **Client Secret**: 서버 사이드에서만 사용 (RESTful API용)

---

## 📋 실제 테스트 현황

### ✅ 문서 기반 확인 완료
- [x] 서비스 정보 확인
- [x] API 사용 방법 확인
- [x] PRD 요구사항 대비 확인
- [x] 좌표 형식 확인 (한국관광공사 API 테스트 결과 반영)

### ⏳ 실제 API 테스트 필요
- [ ] 네이버 클라우드 플랫폼 Application 등록
- [ ] Client ID/Key 발급
- [ ] 환경변수 설정 (`NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)
- [ ] JavaScript SDK 로드 테스트
- [ ] 기본 지도 표시 테스트
- [ ] 마커 표시 테스트
- [ ] 인포윈도우 테스트
- [ ] 좌표 데이터 연동 테스트 (한국관광공사 API 좌표 사용)

### 테스트 시 확인 사항
1. **파라미터명 확인**: `ncpKeyId` vs `ncpClientId` 실제 작동 확인
2. **좌표 형식 확인**: WGS84 좌표 직접 사용 가능 여부 확인
3. **성능 테스트**: 많은 마커 표시 시 성능 확인
4. **반응형 레이아웃**: 데스크톱/모바일 분할 레이아웃 테스트

---

## 🔗 참고 문서

### 공식 문서
- [네이버 클라우드 플랫폼 Maps 개요](https://api.ncloud-docs.com/docs/ko/application-maps-overview)
- [Maps 사용 가이드](https://guide.ncloud-docs.com/docs/ko/application-maps-overview)
- [네이버 지도 API 공식 문서](https://naver.github.io/naver-openapi-guide/apilist.html)
- [Naver Maps JavaScript API v3 (NCP) 문서](https://navermaps.github.io/maps.js.ncp/docs/) (PRD 12 참고)

### 프로젝트 내 문서
- `docs/prd.md` - 프로젝트 요구사항 문서 (2.2, 2.4.4, 8.2 참고)
- `docs/API_TEST_RESULT.md` - 한국관광공사 API 테스트 결과 (좌표 형식 확인)
- `docs/TODO.md` - 개발 작업 목록 (Phase 2.5, 3.3 참고)

### 연락처
- **네이버 클라우드 플랫폼 고객지원**: 1544-5876
- **문의**: [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/)에서 문의 가능

---

## 다음 단계

1. ⏳ 네이버 클라우드 플랫폼 Application 등록
2. ⏳ Client ID/Key 발급 및 환경변수 설정
3. ✅ JavaScript SDK 로드 방법 확인
4. ✅ 좌표 데이터 처리 방법 확인 (WGS84 직접 사용)
5. ⏳ 실제 지도 표시 테스트
6. ⏳ 마커 표시 테스트
7. ⏳ PRD 요구사항 대비 구현

---

**주의**: 이 문서는 네이버 클라우드 플랫폼 Maps API 공식 문서를 기반으로 작성되었습니다. 실제 구현 시 최신 공식 문서를 참고하고, Application 등록 후 실제 테스트를 통해 검증하시기 바랍니다.

