import { RoadsService } from './roads.service';
import { RoadStatusDto, RoadTrafficDto } from './dto/findall-road-response.dto';
export declare class RoadsController {
    private readonly roadsService;
    constructor(roadsService: RoadsService);
    findAllRoads(placeId: string): Promise<RoadTrafficDto>;
    findOne(placeId: string, roadId: number): Promise<RoadStatusDto>;
}
