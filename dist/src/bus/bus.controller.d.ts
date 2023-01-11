import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import { BusService } from './bus.service';
export declare class BusController {
    private readonly busService;
    constructor(busService: BusService);
    findAll(placeId: PlaceIdRequestDto): Promise<any>;
    findOne(placeId: PlaceIdRequestDto, busId: number): Promise<any>;
}
