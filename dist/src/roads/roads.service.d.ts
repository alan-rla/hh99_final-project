import { HttpService } from '@nestjs/axios';
export declare class RoadsService {
    private readonly httpService;
    constructor(httpService: HttpService);
    findAllRoads(placeId: string): Promise<import("./dto/findall-road-response.dto").RoadTrafficDto>;
    findOneRoad(placeId: any, roadId: any): Promise<import("./dto/findall-road-response.dto").RoadStatusDto>;
}
