import { Module } from '@nestjs/common';
import { SeoulService } from './seoul.service';
import { SeoulController } from './seoul.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

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
  providers: [SeoulService],
})
export class SeoulModule {}
