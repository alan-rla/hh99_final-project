# 경로 탐색 API

## Sample

`Request`

```bash
curl --location --request GET 'http://localhost:30183/routes?originLatitude=37.6134436427887&originLongitude=126.926493082645&destinationLatitude=37.5004198786564&destinationLongitude=127.126936754911'
```

`Response`

```json
[
  {
    "type": "car",
    "duration": 2968,
    "distance": 33657,
    "name": "통일로71길",
    "routeNames": [
      "통일로71길",
      "진흥로",
      "평창문화로",
      "정릉로",
      "내부순환로",
      "동부간선도로(성수장암간)",
      "강변북로",
      "동부간선도로(청담장지간)",
      "양재대로",
      "송파대로",
      "중대로"
    ]
  },
  {
    "type": "bus",
    "name": "동명여고.천주교불광동성당",
    "duration": 4674,
    "distance": 28276,
    "routeNames": ["간선:741"]
  },
  {
    "type": "subway",
    "name": "불광",
    "duration": 5946,
    "distance": 38272,
    "routeNames": ["수도권6호선"]
  }
]
```

## Diagram

```mermaid
classDiagram
  class RouteController {
    + getRoutes(RequestRouteQuery query) Array~RouteResponseDto~

    - adaptQuery(RequestRouteQuery query) RequestRouteParamsDto
  }
  RouteController ..> RouteService : 자동차/대중교통 경로 모두 요청

  class RouteService {
    + getRoutes(RequestRouteParamsDto params) Array~RouteResponseDto~
  }
  note for RouteService "자동차/대중교통 경로를 각각 요청 후 하나의 인터페이스로 병합"
  RouteService ..> CarRouteService : 자동차 경로 요청
  RouteService ..> TransitRouteService : 대중교통 경로 요청

  class CarRouteService {
    + getRoute(RequestRouteParamsDto params) RouteResponseDto

    - getKakaoRoute()
    - getSummary()
    - getRoadNames()
  }
  note for CarRouteService "자동차 경로 API 추상화"
  CarRouteService ..> KakaoMobilityService : 카카오모빌리티 API로 자동차 경로 요청

  class TransitRouteService {
    + getRoutes(RequestRouteParamsDto params) Array~RouteResponseDto~

    - getItineraries()
  }
  note for TransitRouteService "대중교통 경로 API 추상화"
  TransitRouteService ..> TmapTransitService : 티맵 대중교통 API로 대중교통 경로 요청

  class KakaoMobilityService {
    + getDirection() RequestDirectionsResponse
  }
  note for KakaoMobilityService "외부(카카오모빌리티) API로 HTTP 요청"

  class TmapTransitService {
    + getRoutes() RequestRoutesResponse
  }
  note for TmapTransitService "외부(티맵) API로 HTTP 요청"

```
