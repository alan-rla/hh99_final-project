import { Module } from '@nestjs/common';
import { SeoulService } from './seoul.service';
import { SeoulController } from './seoul.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SeoulAirInfo])],
  controllers: [SeoulController],
  providers: [SeoulService],
})
export class SeoulModule {}
