flowchart TD
  Start(("서비스 시작\n(접속/홈)"))
  
  subgraph G1 ["홈(관광지 목록/필터/검색)"]
    A1["목록•필터\n- 지역/타입 보기\n- API: /areaCode2,\n  /areaBasedList2"]
    A2["키워드 검색\n- API: /searchKeyword2"]
    A3["네이버 지도 마커 표시\n- 지도/리스트 연동"]
    A4["관광지 카드 클릭"]
    A5["(북마크 버튼) - 즐겨찾기"]
  end
  
  subgraph Auth ["사용자 인증(Clerk)"]
    L1["로그인/회원가입\n(Clerk 연동)"]
    L2["사용자 생성/동기화\n(Postgres users 테이블)"]
  end

  subgraph G2 ["상세페이지 /places/[contentId]"]
    D1["기본정보: 상세 API 조회\n- /detailCommon2"]
    D2["운영정보: 소개 API 조회\n- /detailIntro2"]
    D3["갤러리: 이미지 API 조회\n- /detailImage2"]
    D4["지도: 해당 관광지 위치/길찾기"]
    D5["공유(URL 복사)\n- Open Graph 메타 생성"]
    D6["북마크 버튼(추가/제거)\n- Supabase 북마크 테이블"]
    D7["뒤로가기 or 홈이동"]
  end

  subgraph G3 ["북마크 목록/관리"]
    B1["/bookmarks: 내 북마크 조회"]
    B2["정렬/일괄삭제"]
  end

  subgraph Backend ["DB (Supabase)"]
    DB1["users\n- uuid\n- clerk_id"]
    DB2["bookmarks\n- user_id FKEY\n- content_id\n- unique"]
  end

  Start -->|"접속"| A1
  A1 -->|"필터/정렬"| A1
  A1 -->|"키워드 검색"| A2
  A2 -->|"검색 결과"| A1
  A1 -->|"관광지 표시"| A3
  A3 -->|"지도-목록 연동"| A4
  A1 -->|"카드 선택"| A4
  A4 -->|"상세 페이지"| D1
  A1 -->|"북마크"| A5
  A2 -->|"북마크"| A5
  A5 -->|"클릭시(비로그인)"| L1
  A5 -->|"클릭시(로그인됨)"| D6

  L1 -->|"인증완료/회원정보동기화"| L2
  L2 -->|"DB 반영"| DB1
  L2 -->|"홈으로 돌아감"| A1

  D1 --> D2 --> D3 --> D4
  D1 -->|"공유/복사"| D5
  D1 -->|"북마크 추가/제거"| D6
  D1 -->|"뒤로가기/홈"| D7
  D6 -->|"북마크 테이블"| DB2
  D6 -->|"북마크 목록 페이지"| B1

  B1 -->|"정렬/삭제"| B2
  B1 -->|"관광지 카드를 클릭"| D1

  DB1 -.->|"user_id FKEY"| DB2
  DB2 -.->|"북마크참조"| B1