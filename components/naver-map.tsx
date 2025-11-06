/**
 * @file components/naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 관광지 목록을 네이버 지도에 마커로 표시하는 컴포넌트입니다.
 * PRD 2.2, design.md 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 네이버 지도 API 초기화 (NCP Maps API v3)
 * 2. 관광지 마커 표시
 * 3. 마커 클릭 시 인포윈도우
 * 4. 리스트-지도 연동 (외부에서 제어 가능)
 *
 * @dependencies
 * - 네이버 클라우드 플랫폼 Maps API (NCP Maps API v3)
 * - 환경변수: NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
 * - lib/types/tour.ts - TourItem 타입
 * - docs/NAVER_MAP_API_TEST.md - 네이버 지도 API 테스트 결과
 *
 * @see {@link /docs/prd.md#2.2-네이버-지도-연동} - PRD 요구사항
 * @see {@link /app/map-test/page.tsx} - 테스트 페이지 참고
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { TourItem } from '@/lib/types/tour';
import { parseCoordinates } from '@/lib/utils/tour-utils';
import { formatAddress } from '@/lib/utils/tour-utils';
import { getContentTypeName } from '@/lib/types/tour';

declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapProps {
  tours: TourItem[];
  selectedTourId?: string | null; // 리스트에서 선택된 관광지 ID
  onMarkerClick?: (tour: TourItem) => void; // 마커 클릭 콜백 (선택적)
  className?: string;
}

/**
 * 네이버 지도 컴포넌트
 * @param tours - 표시할 관광지 목록
 * @param selectedTourId - 현재 선택된 관광지 ID (리스트-지도 연동용)
 * @param onMarkerClick - 마커 클릭 콜백 (선택적)
 * @param className - 추가 CSS 클래스
 */
export function NaverMap({
  tours,
  selectedTourId,
  onMarkerClick,
  className,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const scriptLoadedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 환경변수에서 키 확인
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  // 네이버 지도 API 스크립트 로드
  useEffect(() => {
    if (scriptLoadedRef.current) {
      return;
    }

    if (!clientId) {
      setError('네이버 지도 API 키가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // 스크립트가 이미 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      scriptLoadedRef.current = true;
      initializeMap();
      return;
    }

    // 스크립트 동적 로드
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      console.log('[NaverMap] ✅ 네이버 지도 스크립트 로드 완료');
      scriptLoadedRef.current = true;
      initializeMap();
    };

    script.onerror = () => {
      // ncpKeyId가 실패하면 ncpClientId로 재시도
      console.log('[NaverMap] ⚠️ ncpKeyId로 실패, ncpClientId로 재시도...');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
      script.onload = () => {
        console.log('[NaverMap] ✅ 네이버 지도 스크립트 로드 완료 (ncpClientId 사용)');
        scriptLoadedRef.current = true;
        initializeMap();
      };
      script.onerror = () => {
        console.error('[NaverMap] ❌ 네이버 지도 API 스크립트 로드 실패');
        setError('네이버 지도 API 스크립트 로드 실패. 키가 올바른지 확인하세요.');
        setIsLoading(false);
      };
    };

    document.head.appendChild(script);

    return () => {
      // cleanup: 스크립트는 제거하지 않음 (다른 컴포넌트에서도 사용 가능)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // 지도 초기화
  const initializeMap = () => {
    if (!mapRef.current || !window.naver || !window.naver.maps) {
      setError('네이버 지도 API가 로드되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 초기 중심 좌표 설정 (관광지가 있으면 첫 번째 관광지, 없으면 서울 시청)
      let initialCenter: { lat: number; lng: number };
      const initialZoom = 13;

      if (tours.length > 0) {
        const firstTour = tours[0];
        const coords = parseCoordinates(firstTour.mapx, firstTour.mapy);
        if (coords) {
          initialCenter = { lat: coords.lat, lng: coords.lng };
        } else {
          initialCenter = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
        }
      } else {
        initialCenter = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
      }

      // 지도 초기화
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        mapTypeControl: true, // 지도 유형 선택 컨트롤
      });

      mapInstanceRef.current = map;
      console.log('[NaverMap] ✅ 지도 초기화 완료');

      // 마커 표시
      updateMarkers(map, tours);

      setIsLoading(false);
    } catch (err: any) {
      console.error('[NaverMap] ❌ 지도 초기화 에러:', err);
      setError(`지도 초기화 실패: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 마커 업데이트 (관광지 목록 변경 시)
  const updateMarkers = (map: any, tourList: TourItem[]) => {
    // 기존 마커 및 인포윈도우 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    if (tourList.length === 0) {
      return;
    }

    // 모든 관광지를 마커로 표시
    const bounds = new window.naver.maps.LatLngBounds();

    tourList.forEach((tour) => {
      const coords = parseCoordinates(tour.mapx, tour.mapy);
      if (!coords) {
        console.warn(`[NaverMap] 좌표 파싱 실패: ${tour.title}`, tour.mapx, tour.mapy);
        return;
      }

      const position = new window.naver.maps.LatLng(coords.lat, coords.lng);
      bounds.extend(position);

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: position,
        map: map,
        title: tour.title,
      });

      // 인포윈도우 생성
      const address = formatAddress(tour.addr1, tour.addr2);
      const contentTypeName = getContentTypeName(tour.contenttypeid);

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${tour.title}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${address}</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">${contentTypeName}</p>
            <button 
              onclick="window.location.href='/places/${tour.contentid}'" 
              style="
                padding: 6px 12px; 
                background: #2B7DE9; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 14px;
                width: 100%;
              "
            >
              상세보기
            </button>
          </div>
        `,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        // 다른 인포윈도우 닫기
        infoWindowsRef.current.forEach((iw) => {
          if (iw !== infoWindow) {
            iw.close();
          }
        });

        // 현재 인포윈도우 토글
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }

        // 콜백 호출
        if (onMarkerClick) {
          onMarkerClick(tour);
        }
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (tourList.length > 1) {
      map.fitBounds(bounds);
    } else if (tourList.length === 1) {
      // 마커가 1개일 때는 줌 레벨 조정
      map.setZoom(15);
    }

    console.log(`[NaverMap] ✅ 마커 ${markersRef.current.length}개 표시 완료`);
  };

  // 관광지 목록 변경 시 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !window.naver.maps) {
      return;
    }

    updateMarkers(mapInstanceRef.current, tours);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tours]);

  // 선택된 관광지로 지도 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTourId || !window.naver || !window.naver.maps) {
      return;
    }

    const selectedTour = tours.find((tour) => tour.contentid === selectedTourId);
    if (!selectedTour) {
      return;
    }

    const coords = parseCoordinates(selectedTour.mapx, selectedTour.mapy);
    if (!coords) {
      return;
    }

    const position = new window.naver.maps.LatLng(coords.lat, coords.lng);
    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setZoom(16);

    // 해당 마커의 인포윈도우 열기
    const markerIndex = tours.findIndex((tour) => tour.contentid === selectedTourId);
    if (markerIndex >= 0 && infoWindowsRef.current[markerIndex]) {
      // 다른 인포윈도우 닫기
      infoWindowsRef.current.forEach((iw) => iw.close());
      // 선택된 마커의 인포윈도우 열기
      infoWindowsRef.current[markerIndex].open(
        mapInstanceRef.current,
        markersRef.current[markerIndex]
      );
    }

    console.log(`[NaverMap] ✅ 선택된 관광지로 이동: ${selectedTour.title}`);
  }, [selectedTourId, tours]);

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 bg-muted rounded-lg ${className || ''}`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">지도를 불러올 수 없습니다</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg border border-border bg-muted"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}

