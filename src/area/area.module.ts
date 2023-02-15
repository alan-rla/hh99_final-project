import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from 'src/entities/Users';
import { AreaLike } from 'src/entities/AreaLike';
import { User_Like } from 'src/entities/User_Like';
import { PopPredict } from 'src/entities/PopPredict';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import {
  PopulationService,
  WeatherService,
  AirQualityService,
  RoadConditionService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      AreaLike,
      User_Like,
      PopPredict,
      SeoulAirInfo,
      SeoulWeatherInfo,
      SeoulRoadInfo,
      SeoulPopInfo,
      SeoulPMInfo,
    ]),
  ],
  controllers: [AreaController],
  providers: [
    AreaService,
    PopulationService,
    WeatherService,
    AirQualityService,
    RoadConditionService,
  ],
})
export class AreaModule {}
