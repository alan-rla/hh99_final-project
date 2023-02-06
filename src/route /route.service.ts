import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutesInfo } from 'src/entities/routesinfo';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';

import { RequestRouteParamsDto, RouteResponseDto } from './dtos';
import { CarRouteService, TransitRouteService } from './services';

@Injectable()
export class RouteService {
  constructor(
    private readonly carRouteService: CarRouteService,
    private readonly transitRouteService: TransitRouteService,
    @InjectRepository(RoutesInfo) routesinfoRepository: Repository<RoutesInfo>,
    private dataSource: DataSource,
  ) {}

  public async getRoutes(
    params: RequestRouteParamsDto,
  ): Promise<RouteResponseDto[]> {
    const carRoute = await this.carRouteService
      .getRoute(params)
      .catch(() => null);
    console.log('carRoute: ', carRoute);
    JSON.stringify(carRoute?.routeNames);

    const transitRoutes = await this.transitRouteService
      .getRoutes(params)
      .catch(() => []);
    JSON.stringify(transitRoutes.map(x => x.routeNames));
    console.log('transitRoutes: ', transitRoutes);

    const routes = [...(carRoute ? [carRoute] : []), ...transitRoutes];
    console.log('routes: ', routes);
    const stringifiedRoutes = routes.map(route => {
      return {
        ...route,
        routeNames: JSON.stringify(route.routeNames),
      };
    });
    return stringifiedRoutes;
  }
}
