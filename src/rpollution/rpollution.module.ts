import { HttpModule } from '@nestjs/axios';
import { RpollutionController } from './rpollution.controller';
import { Module } from '@nestjs/common';
import { RpollutionService } from './rpollution.service';

@Module({
  imports: [HttpModule],
  controllers: [RpollutionController],
  providers: [RpollutionService],
})
export class RpollutionModule {}
