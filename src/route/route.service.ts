import { Injectable } from '@nestjs/common';

import { RequestRouteParamsDto, RouteResponseDto } from './dtos';
import { CarRouteService, TransitRouteService } from './services';

@Injectable()
export class RouteService {
  constructor(
    private readonly carRouteService: CarRouteService,
    private readonly transitRouteService: TransitRouteService,
  ) {}

  public async getRoutes(
    params: RequestRouteParamsDto,
  ): Promise<RouteResponseDto[]> {
    const carRoute = await this.carRouteService
      .getRoute(params)
      .catch(() => null);

    const transitRoutes = await this.transitRouteService
      .getRoutes(params)
      .catch(() => []);

    return [...(carRoute ? [carRoute] : []), ...transitRoutes];
  }
}
