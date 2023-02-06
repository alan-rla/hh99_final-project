import { Module } from '@nestjs/common';

import { KakaoMobilityModule } from './kakao-mobility';
import { TmapTransitModule } from './tmap-transit';

import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { CarRouteService, TransitRouteService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesInfo } from 'src/entities/routesinfo';
import { BusRoute } from 'src/entities/bus_route';
import { CarRoute } from 'src/entities/car_route';
import { SubwayRoute } from 'src/entities/subway_route';
import { Users } from 'src/entities/Users';
import { RouteType } from './types';

@Module({
  imports: [
    KakaoMobilityModule,
    TmapTransitModule,
    TypeOrmModule.forFeature([
      RoutesInfo,
      BusRoute,
      CarRoute,
      SubwayRoute,
      Users,
    ]),
  ],
  controllers: [RouteController],
  providers: [RouteService, CarRouteService, TransitRouteService],
  exports: [RouteService],
})
export class RouteModule {}
