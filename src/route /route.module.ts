import { Module } from '@nestjs/common';

import { KakaoMobilityModule } from './kakao-mobility';
import { TmapTransitModule } from './tmap-transit';

import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { CarRouteService, TransitRouteService } from './services';

@Module({
  imports: [KakaoMobilityModule, TmapTransitModule],
  controllers: [RouteController],
  providers: [RouteService, CarRouteService, TransitRouteService],
  exports: [RouteService],
})
export class RouteModule {}
