/**
 * @file components/tour-detail/detail-map.tsx
 * @description 상세페이지용 네이버 지도 컴포넌트
 *
 * 단일 관광지의 위치를 표시하는 지도 컴포넌트입니다.
 * PRD 2.4.4 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 해당 관광지 위치 표시 (마커 1개)
 * 2. 지도 중심 좌표 설정
 * 3. 줌 레벨 설정
 * 4. 길찾기 버튼 (네이버 지도 앱/웹 연동)
 *
 * @dependencies
 * - 네이버 지도 API (NCP Maps API v3)
 * - lib/utils/tour-utils.ts - 좌표 파싱 함수
 * - docs/NAVER_MAP_API_TEST.md - 네이버 지도 API 사용법
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCoordinates } from '@/lib/utils/tour-utils';
import type { TourDetail } from '@/lib/types/tour';

interface DetailMapProps {
  tour: TourDetail;
  className?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

/**
 * 상세페이지용 네이버 지도 컴포넌트
 * 단일 관광지의 위치를 표시합니다.
 */
export function DetailMap({ tour, className }: DetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  /**
   * 네이버 지도 API 스크립트 로드
   */
  const loadNaverMapScript = useCallback(() => {
    if (window.naver && window.naver.maps) {
      setIsMapLoaded(true);
      return;
    }

    if (document.getElementById('naver-map-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'naver-map-script';
    script.async = true;

    const tryLoadScript = (keyParam: string) => {
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?${keyParam}=${clientId}&submodules=panorama,geocoder`;
      script.onload = () => {
        setIsMapLoaded(true);
        setError(null);
      };
      script.onerror = () => {
        console.error(`Failed to load Naver Map script with ${keyParam}.`);
        if (keyParam === 'ncpKeyId') {
          console.log('Retrying with ncpClientId...');
          tryLoadScript('ncpClientId');
        } else {
          setError('네이버 지도 API 스크립트 로드 실패. 키가 올바른지 확인하세요.');
        }
      };
      document.head.appendChild(script);
    };

    if (clientId) {
      tryLoadScript('ncpKeyId');
    } else {
      setError('네이버 지도 API 클라이언트 ID가 설정되지 않았습니다.');
    }
  }, [clientId]);

  useEffect(() => {
    loadNaverMapScript();
  }, [loadNaverMapScript]);

  /**
   * 지도 초기화
   */
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.naver || !window.naver.maps || naverMapInstance.current) {
      return;
    }

    const coords = parseCoordinates(tour.mapx, tour.mapy);
    if (!coords) {
      setError('좌표 정보가 올바르지 않습니다.');
      return;
    }

    const center = new window.naver.maps.LatLng(coords.lat, coords.lng);

    const mapOptions = {
      center: center,
      zoom: 15, // 상세페이지는 줌 레벨 15 (더 가까운 뷰)
      mapTypeControl: true,
      zoomControl: true,
    };

    naverMapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

    // 마커 생성
    markerRef.current = new window.naver.maps.Marker({
      position: center,
      map: naverMapInstance.current,
      title: tour.title,
    });
  }, [tour]);

  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);

  /**
   * 길찾기 버튼 클릭 핸들러
   * 네이버 지도 앱/웹으로 길찾기 페이지를 엽니다.
   */
  const handleDirections = () => {
    const coords = parseCoordinates(tour.mapx, tour.mapy);
    if (!coords) {
      alert('좌표 정보가 올바르지 않습니다.');
      return;
    }

    // 네이버 지도 길찾기 URL 형식: https://map.naver.com/v5/directions/{lat},{lng}
    const directionsUrl = `https://map.naver.com/v5/directions/${coords.lat},${coords.lng}`;
    window.open(directionsUrl, '_blank');
  };

  /**
   * 좌표 복사 버튼 클릭 핸들러
   */
  const handleCopyCoordinates = async () => {
    const coords = parseCoordinates(tour.mapx, tour.mapy);
    if (!coords) {
      alert('좌표 정보가 올바르지 않습니다.');
      return;
    }

    const coordText = `${coords.lat}, ${coords.lng}`;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(coordText);
        alert('좌표가 복사되었습니다.');
      } catch (err) {
        console.error('좌표 복사 실패:', err);
        alert('좌표 복사에 실패했습니다.');
      }
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className} bg-red-50 text-red-800 p-4 rounded-lg`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border"
        aria-label="관광지 위치 지도"
        role="img"
      >
        {!isMapLoaded && (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">지도 로딩 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 영역 */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          onClick={handleDirections}
          className="gap-2"
          variant="default"
        >
          <Navigation className="h-4 w-4" />
          길찾기
        </Button>
        <Button
          onClick={handleCopyCoordinates}
          className="gap-2"
          variant="outline"
        >
          <Copy className="h-4 w-4" />
          좌표 복사
        </Button>
        {tour.addr1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{tour.addr1} {tour.addr2 || ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

