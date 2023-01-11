import { PopulationService } from './population.service';
export declare class PopulationController {
    private readonly populationService;
    constructor(populationService: PopulationService);
    findAll(placeId: string): Promise<any>;
}
