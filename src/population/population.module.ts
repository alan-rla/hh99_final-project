import { Module } from '@nestjs/common';
import { PopulationService } from './population.service';
import { PopulationController } from './population.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PopulationController],
  providers: [PopulationService],
})
export class PopulationModule {}
