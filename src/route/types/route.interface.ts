import { RouteType } from './route-type.enum';

/**
 * 이동 경로 요약 정보
 */
export interface Route {
  /**
   * 이동 수단
   */
  type: RouteType;

  /**
   * 총 소요 시간(초)
   */
  duration: number;

  /**
   * 총 이동 거리(미터)
   */
  distance: number;

  /**
   * 출발지 이름(도로명, 정류장 등)
   */
  name: string;

  /**
   * 출발지로부터의 노선 이름 배열
   */
  routeNames: string[];
}
