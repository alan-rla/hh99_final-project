import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesInfo } from 'src/entities/routesinfo';

import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutesInfo])],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
