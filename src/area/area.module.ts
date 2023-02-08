import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaLike } from 'src/entities/AreaLike';
import { User_Like } from 'src/entities/User_Like';
import { PopPredict } from 'src/entities/PopPredict';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

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
  providers: [AreaService],
})
export class AreaModule {}
