export declare class FindAllRoadDto {
    readonly 'SeoulRtd.citydata': SeoulRtdDto;
}
export declare class SeoulRtdDto {
    readonly 'CITYDATA': CityDataDto;
}
export declare class CityDataDto {
    readonly 'LIVE_PPLTN_STTS': object;
    readonly 'ROAD_TRAFFIC_STTS': RoadTrafficDto;
    readonly 'SUB_STTS': object;
    readonly 'BUS_STN_STTS': object;
    readonly 'WEATHER_STTS': object;
    readonly 'COVID_19_STTS': object;
}
export declare class RoadTrafficDto {
    readonly 'AVG_ROAD_DATA': RoadDataDto;
    readonly 'ROAD_TRAFFIC_STTS': Array<RoadStatusDto>;
}
export declare class RoadDataDto {
    readonly 'ROAD_MSG': string;
    readonly 'ROAD_TRAFFIC_IDX': string;
    readonly 'ROAD_TRFFIC_TIME': string;
    readonly 'ROAD_TRAFFIC_SPD': number;
}
export declare class RoadStatusDto {
    readonly 'LINK_ID': number;
    readonly 'ROAD_NM': string;
    readonly 'START_ND_CD': number;
    readonly 'START_ND_NM': string;
    readonly 'START_ND_XY': string;
    readonly 'END_ND_CD': number;
    readonly 'END_ND_NM': string;
    readonly 'END_ND_XY': string;
    readonly 'DIST': number;
    readonly 'SPD': number;
    readonly 'IDX': string;
    readonly 'XYLIST': string;
}
