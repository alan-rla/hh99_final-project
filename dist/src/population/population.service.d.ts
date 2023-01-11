import { HttpService } from '@nestjs/axios';
export declare class PopulationService {
    private readonly httpService;
    constructor(httpService: HttpService);
    findAll(placeId: string): Promise<any>;
}
