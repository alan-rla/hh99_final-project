import { RequestLanguage } from '../types';

/**
 * 대중교통 API
 *
 * @link https://tmap-public-skopenapi.readme.io/reference/%EB%8C%80%EC%A4%91%EA%B5%90%ED%86%B5-api
 */
export interface RequestRoutesParams {
  /**
   * 출발지 좌표 (경도)
   * - WGS84
   */
  startX: string;

  /**
   * 출발지 좌표 (위도)
   * - WGS84
   */
  startY: string;

  /**
   * 목적지 좌표 (경도)
   * - WGS84
   */
  endX: string;

  /**
   * 목적지 좌표 (위도)
   * - WGS84
   */
  endY: string;

  /**
   * 응답 언어 선택
   * - 국문 : 0(기본값)
   * - 영문 : 1
   */
  lang: RequestLanguage;
}
