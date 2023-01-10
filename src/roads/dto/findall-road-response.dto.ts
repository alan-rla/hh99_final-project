class SeoulRtdDto {
  readonly 'CITYDATA': CityDataDto;
}

class CityDataDto {
  readonly 'LIVE_PPLTN_STTS': object;
  readonly 'ROAD_TRAFFIC_STTS': RoadTrafficDto;
  readonly 'SUB_STTS': object;
  readonly 'BUS_STN_STTS': object;
  readonly 'WEATHER_STTS': object;
  readonly 'COVID_19_STTS': object;
}

class RoadTrafficDto {
  readonly 'AVG_ROAD_DATA': object;
  readonly 'ROAD_TRAFFIC_STTS': Array<RoadStatusDto>;
}

class RoadStatusDto {
  readonly 'LINK_ID': string;
  readonly 'ROAD_NM': string;
  readonly 'START_ND_CD': string;
  readonly 'START_ND_NM': string;
  readonly 'START_ND_XY': string;
  readonly 'END_ND_CD': string;
  readonly 'END_ND_NM': string;
  readonly 'END_ND_XY': string;
  readonly 'DIST': string;
  readonly 'SPD': string;
  readonly 'IDX': string;
  readonly 'XYLIST': string;
}

export class FindAllRoadDto {
  readonly 'SeoulRtd.citydata': SeoulRtdDto;
}
