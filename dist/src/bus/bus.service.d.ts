import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import { HttpService } from '@nestjs/axios';
export declare class BusService {
    private readonly httpService;
    constructor(httpService: HttpService);
    findAll(placeId: PlaceIdRequestDto): Promise<any>;
    findOne(placeId: PlaceIdRequestDto, busId: number): Promise<any>;
}
