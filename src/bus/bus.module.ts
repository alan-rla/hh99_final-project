import { Users } from './../entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), HttpModule],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
