import { LegMode } from '../types';

/**
 * 대중교통 API > Request
 *
 * @link https://tmap-public-skopenapi.readme.io/reference/%EB%8C%80%EC%A4%91%EA%B5%90%ED%86%B5-%EC%83%98%ED%94%8C-%EC%98%88%EC%A0%9C
 */
export interface RequestRoutesResponse {
  metaData: RequestRoutesMetadata;
}

export interface RequestRoutesMetadata {
  plan: RequestRoutesMetadataPlan;
}

export interface RequestRoutesMetadataPlan {
  /**
   * 데이터 상세정보 최상위 노드
   */
  itineraries: RequestRoutesMetadataPlanItinerary[];
}

export interface RequestRoutesMetadataPlanItinerary {
  /**
   * 총 보행자 이동 거리(m)
   */
  walkDistance: number;

  /**
   * 총 이동거리(m)
   */
  totalTime: number;

  /**
   * 금액 최상위 노드
   */
  fare: RequestRoutesMetadataPlanItineraryFare;

  /**
   * 대중교통 정보 최상위 노드
   */
  legs: RequestRoutesMetadataPlanItineraryLeg[];
}

export interface RequestRoutesMetadataPlanItineraryFare {
  /**
   * 금액 상위 노드
   */
  regular: RequestRoutesMetadataPlanItineraryFareRegular;
}

export interface RequestRoutesMetadataPlanItineraryFareRegular {
  /**
   * 대중교통요금
   */
  totalFare: number;

  /**
   * 금액 상위 노드
   */
  currency: RequestRoutesMetadataPlanItineraryFareRegularCurrency;
}

export interface RequestRoutesMetadataPlanItineraryFareRegularCurrency {
  /**
   * 금액 상징(￦)
   */
  symbol: string;

  /**
   * 금액 단위(원)
   */
  currency: string;

  /**
   * 금액 단위 코드(KRW)
   */
  currencyCode: string;
}

export interface RequestRoutesMetadataPlanItineraryLeg {
  /**
   * 이동 수단 종류
   *
   * 1. 도보 - WALK
   *
   * 2. 버스 - BUS
   *
   * 3. 지하철 - SUBWAY
   *
   * 4. 고속/시외버스 - EXPRESSBUS
   *
   * 5. 기차 - TRAIN
   *
   * 6. 항공 - AIRPLANE
   *
   * 7. 해운 - FERRY
   */
  mode: LegMode;

  /**
   * 구간별 소요시간(sec)
   */
  sectionTime: number;

  /**
   * 구간별 이동거리(m)
   */
  distance: number;

  /**
   * 대중교통 노선 명칭
   */
  route?: string;

  /**
   * 구간별 출발정보 최상위 노드
   */
  start: RequestRoutesMetadataPlanItineraryLegCoordinate;

  /**
   * 구간별 도착정보 최상위 노드
   */
  end: RequestRoutesMetadataPlanItineraryLegCoordinate;
}

export interface RequestRoutesMetadataPlanItineraryLegCoordinate {
  /**
   * 출발/도착 정류장 명칭
   */
  name: string;

  /**
   * 출발/도착 좌표(위도)
   *
   * - WGS84
   */
  lat: number;

  /**
   * 출발/도착 좌표(경도)
   *
   * - WGS84
   */
  lon: number;
}
