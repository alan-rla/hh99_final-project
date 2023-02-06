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
    user: Users,
  ): Promise<RouteResponseDto[]> {
    const carRoute = await this.carRouteService
      .getRoute(params)
      .catch(() => null);

    const transitRoutes = await this.transitRouteService
      .getRoutes(params)
      .catch(() => []);

    const routes = [...(carRoute ? [carRoute] : []), ...transitRoutes];

    // const routesinfoRepository: RoutesInfo[]=[]
    // for (const route of routes){
    //   let routeEntity
    //   if(route.type === 'car')
    // }
    return routes;
  }
}
