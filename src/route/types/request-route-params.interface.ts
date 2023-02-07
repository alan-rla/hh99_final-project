import { Coordinate } from './coordinate.type';

export interface RequestRouteParams {
  /**
   * 출발지 좌표
   */
  origin: Coordinate;

  /**
   * 도착지 좌표
   */
  destination: Coordinate;
}
