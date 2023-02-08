import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaLike } from 'src/entities/AreaLike';
import { User_Like } from 'src/entities/User_Like';
import { PopPredict } from 'src/entities/PopPredict';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      AreaLike,
      User_Like,
      PopPredict,
      SeoulAirInfo,
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
