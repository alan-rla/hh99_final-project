import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tourist_Spot } from 'src/entities/Tourist_spot';
import { ToursimController } from './tourist_spot.controller';
import { TourismService } from './tourist_spot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tourist_Spot])],
  controllers: [ToursimController],
  providers: [TourismService],
})
export class TouristSpotModule {}
