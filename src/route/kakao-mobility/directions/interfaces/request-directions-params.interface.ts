/**
 * 자동차 길찾기 > Request
 *
 * @link https://developers.kakaomobility.com/docs/navi-api/directions/#request
 */
export interface RequestDirectionsParams {
  /**
   * 출발지
   *
   * 다음 중 하나의 형식으로 요청:
   * ${X좌표},${Y좌표},name=${출발지명} 또는
   * ${X좌표},${Y좌표}
   * (예: "127.111202,37.394912,name=판교역" 또는 "127.111202,37.394912")
   */
  origin: string;

  /**
   * 목적지
   *
   * 다음 중 하나의 형식으로 요청:
   * ${X좌표},${Y좌표},name=${목적지명} 또는
   * ${X좌표},${Y좌표}
   * (예: "127.111202,37.394912,name=판교역" 또는 "127.111202,37.394912")
   */
  destination: string;
}
