/**
 * @file app/map-test/page.tsx
 * @description 네이버 지도 API 테스트 페이지
 *
 * 이 페이지는 네이버 클라우드 플랫폼 Maps API가 정상적으로 작동하는지 테스트합니다.
 * PRD 2.2 요구사항에 맞춰 지도 표시, 마커 표시, 인포윈도우 기능을 테스트합니다.
 *
 * 테스트 항목:
 * 1. 네이버 지도 API 스크립트 로드
 * 2. 기본 지도 표시 (서울 시청 좌표)
 * 3. 관광지 마커 표시 (경복궁 - 한국관광공사 API 테스트 결과 사용)
 * 4. 마커 클릭 시 인포윈도우 표시
 * 5. 좌표 데이터 처리 (WGS84 형식 직접 사용)
 *
 * @dependencies
 * - 네이버 클라우드 플랫폼 Maps API (NCP Maps API v3)
 * - 환경변수: NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
 */

'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

export default function MapTestPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapLoadedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('지도 로딩 중...');

  // 환경변수에서 키 확인
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    // 환경변수 키 확인
    if (!clientId) {
      setError(
        '네이버 지도 API 키가 설정되지 않았습니다.\n\n환경변수 설정 방법:\n1. .env 파일에 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_key 추가\n2. 네이버 클라우드 플랫폼에서 Application 등록 및 키 발급\n3. Web Dynamic Map 서비스 활성화 확인'
      );
      setStatus('키 없음');
      return;
    }

    // 스크립트 로드 확인
    if (mapLoadedRef.current) {
      return;
    }

    // 스크립트가 이미 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      initializeMap();
      return;
    }

    // 스크립트 동적 로드
    setStatus('네이버 지도 스크립트 로딩 중...');
    const script = document.createElement('script');
    
    // PRD 2.2에 따르면 ncpKeyId 사용 (구 ncpClientId 아님)
    // 하지만 실제 문서에서는 ncpClientId도 사용될 수 있으므로 둘 다 시도
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      console.log('✅ 네이버 지도 스크립트 로드 완료');
      setStatus('지도 초기화 중...');
      initializeMap();
    };
    script.onerror = () => {
      // ncpKeyId가 실패하면 ncpClientId로 재시도
      console.log('⚠️ ncpKeyId로 실패, ncpClientId로 재시도...');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
      script.onload = () => {
        console.log('✅ 네이버 지도 스크립트 로드 완료 (ncpClientId 사용)');
        setStatus('지도 초기화 중...');
        initializeMap();
      };
      script.onerror = () => {
        setError('네이버 지도 API 스크립트 로드 실패. 키가 올바른지 확인하세요.');
        setStatus('로드 실패');
      };
    };

    document.head.appendChild(script);

    return () => {
      // cleanup
    };
  }, [clientId]);

  const initializeMap = () => {
    if (!mapRef.current || !window.naver || !window.naver.maps) {
      setError('네이버 지도 API가 로드되지 않았습니다.');
      return;
    }

    try {
      // 서울 시청 좌표 (초기 중심점)
      const seoulCityHall = new window.naver.maps.LatLng(37.5665, 126.9780);

      // 지도 초기화
      const map = new window.naver.maps.Map(mapRef.current, {
        center: seoulCityHall,
        zoom: 13,
        mapTypeControl: true, // 지도 유형 선택 컨트롤
      });

      console.log('✅ 지도 초기화 완료');

      // 경복궁 좌표 (한국관광공사 API 테스트 결과)
      // mapx=126.9767375783, mapy=37.5760836609 (WGS84 형식, 변환 불필요)
      const gyeongbokgung = new window.naver.maps.LatLng(
        parseFloat('37.5760836609'), // 위도 (mapy)
        parseFloat('126.9767375783')  // 경도 (mapx)
      );

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: gyeongbokgung,
        map: map,
        title: '경복궁',
      });

      console.log('✅ 마커 생성 완료');

      // 인포윈도우 생성 (PRD 2.2 요구사항)
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">경복궁</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">서울특별시 종로구 사직로 161</p>
            <button 
              onclick="window.location.href='/places/126508'" 
              style="
                padding: 6px 12px; 
                background: #2B7DE9; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 14px;
              "
            >
              상세보기
            </button>
          </div>
        `,
      });

      // 마커 클릭 시 인포윈도우 표시
      window.naver.maps.Event.addListener(marker, 'click', function () {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });

      console.log('✅ 인포윈도우 설정 완료');

      // 지도 로드 완료
      mapLoadedRef.current = true;
      setStatus('지도 로드 완료 ✅');
    } catch (err: any) {
      console.error('❌ 지도 초기화 에러:', err);
      setError(`지도 초기화 실패: ${err.message}`);
      setStatus('초기화 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            네이버 지도 API 테스트
          </h1>
          <p className="text-gray-600 mb-4">
            PRD 2.2 요구사항에 맞춰 네이버 지도 API 동작을 테스트합니다.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>상태:</strong> {status}
            </p>
            {clientId && (
              <p className="text-xs text-blue-600 mt-2">
                키: {clientId.substring(0, 10)}... (일부만 표시)
              </p>
            )}
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">❌ 에러</h2>
            <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
              {error}
            </pre>
            <div className="mt-4 text-sm text-red-600">
              <p className="font-semibold mb-2">해결 방법:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  <a
                    href="https://www.ncloud.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    네이버 클라우드 플랫폼
                  </a>
                  에서 Application 등록
                </li>
                <li>Web Dynamic Map 서비스 활성화</li>
                <li>Client ID 발급 및 .env 파일에 설정</li>
                <li>
                  <a
                    href="https://api.ncloud-docs.com/docs/ko/application-maps-overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    공식 문서
                  </a>
                  참고
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">테스트 항목</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                네이버 지도 API 스크립트 로드
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                기본 지도 표시 (서울 시청 중심)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                관광지 마커 표시 (경복궁 - WGS84 좌표 직접 사용)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                마커 클릭 시 인포윈도우 표시
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                좌표 데이터 처리 (변환 불필요 확인)
              </li>
            </ul>
          </div>
        )}

        {/* 지도 컨테이너 */}
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-lg border border-gray-300 bg-gray-100"
          style={{ minHeight: '400px' }}
        >
          {!mapLoadedRef.current && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">{status}</p>
              </div>
            </div>
          )}
        </div>

        {/* 테스트 정보 */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">테스트 정보</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>초기 중심:</strong> 서울 시청 (37.5665, 126.9780)
            </p>
            <p>
              <strong>테스트 마커:</strong> 경복궁 (37.5760836609, 126.9767375783)
            </p>
            <p>
              <strong>좌표 형식:</strong> WGS84 (한국관광공사 API에서 직접 사용, 변환 불필요)
            </p>
            <p>
              <strong>API 버전:</strong> Naver Maps JavaScript API v3 (NCP)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

