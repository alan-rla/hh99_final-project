import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

import { SeoulController } from './seoul.controller';
import { SeoulService } from './seoul.service';
import {
  PublicOpenApiService,
  PopulationAdapterService,
  WeatherAdapterService,
  AirQualityAdapterService,
  RoadConditionAdapterService,
  DetailAirQualityAdapterService,
  DatabaseCacheService,
} from './services';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      SeoulAirInfo,
      SeoulWeatherInfo,
      SeoulRoadInfo,
      SeoulPopInfo,
      SeoulPMInfo,
    ]),
  ],
  controllers: [SeoulController],
  providers: [
    SeoulService,
    PublicOpenApiService,
    PopulationAdapterService,
    WeatherAdapterService,
    AirQualityAdapterService,
    RoadConditionAdapterService,
    DetailAirQualityAdapterService,
    DatabaseCacheService,
  ],
})
export class SeoulModule {}
