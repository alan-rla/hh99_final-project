/**
 * 자동차 길찾기 > Response
 *
 * @link https://developers.kakaomobility.com/docs/navi-api/directions/#response
 */
export interface RequestDirectionsResponse<IsSummary = boolean> {
  /**
   * 경로 요청 ID
   */
  trans_id: string;

  /**
   * 경로 정보
   *
   * `alternatives`가 `true`인 경우 한 개 이상의 경로 제공 가능
   */
  routes: RequestDirectionsRoute<IsSummary>[];
}

export interface RequestDirectionsRoute<IsSummary = boolean> {
  /**
   * 경로 탐색 결과 코드
   *
   * @link https://developers.kakaomobility.com/docs/navi-api/reference/#result_code-%EA%B2%BD%EB%A1%9C-%ED%83%90%EC%83%89-%EA%B2%B0%EA%B3%BC-%EC%BD%94%EB%93%9C
   */
  result_code: number;

  /**
   * 경로 탐색 결과 메시지
   */
  result_msg: string;

  /**
   * 경로 요약 정보
   */
  summary: RequestDirectionsRouteSummary;

  /**
   * 구간별 경로 정보
   *
   * 경유지가 존재할 경우 {경유지 수 + 1} 만큼의 섹션(경로 구간) 생성
   * (예: 경유지 수가 2개인 경우 총 3개의 섹션 정보가 생성,
   * section1: 출발지 → 경유지 1
   * section2: 경유지 1 → 경유지 2
   * section3: 경유지 2 → 목적지)
   */
  sections: RequestDirectionsRouteSection<IsSummary>[];
}

export interface RequestDirectionsRouteSummary {
  /**
   * 출발지 정보
   */
  origin: RequestDirectionsRouteSummaryCoordinate;

  /**
   * 목적지 정보
   */
  destination: RequestDirectionsRouteSummaryCoordinate;

  /**
   * 경유지 정보
   */
  waypoints: RequestDirectionsRouteSummaryCoordinate[];

  /**
   * 경로 탐색 우선순위 옵션
   */
  priority: string;

  /**
   * 요금 정보
   */
  fare: RequestDirectionsRouteSummaryFare;

  /**
   * 전체 검색 결과 거리(미터)
   */
  distance: number;

  /**
   * 목적지까지 소요 시간(초)
   */
  duration: number;
}

export interface RequestDirectionsRouteSummaryCoordinate {
  /**
   * 출발지/목적지/경유지 이름
   */
  name: string;

  /**
   * X 좌표
   */
  x: number;

  /**
   * Y 좌표
   */
  y: number;
}

export interface RequestDirectionsRouteSummaryFare {
  /**
   * 택시 요금(원)
   */
  taxi: number;

  /**
   * 택시 요금(원)
   */
  toll: number;
}

export interface RequestDirectionsRouteSection<IsSummary = boolean> {
  /**
   * 섹션 거리(미터)
   */
  distance: number;

  /**
   * 전체 검색 결과 이동 시간(초)
   */
  duration: number;

  /**
   * 도로 정보
   *
   * `summary`가 `false`인 경우에만 제공
   */
  roads: IsSummary extends true
    ? RequestDirectionsRouteSectionRoad[]
    : undefined;
}

export interface RequestDirectionsRouteSectionRoad {
  /**
   * 도로명
   */
  name: string;

  /**
   * 도로 길이(미터)
   */
  distance: number;

  /**
   * 예상 이동 시간(초)
   *
   * 현재 예상 이동 시간 및 실제 이동 시간은 동일한 값으로 설정
   */
  duration: number;

  /**
   * 현재 교통 정보 속도(km/h)
   */
  traffic_speed: number;

  /**
   * 현재 교통 정보 상태
   */
  traffic_state: number;

  /**
   * X, Y 좌표로 구성된 1차원 배열
   *
   * (예: [127.10966790676201, 37.394469584427156, 127.10967141980313, 37.39512739646385] )
   */
  vertexes: number[];
}
