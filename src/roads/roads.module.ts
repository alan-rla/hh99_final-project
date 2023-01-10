import { Module } from '@nestjs/common';
import { RoadsService } from './roads.service';
import { RoadsController } from './roads.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RoadsController],
  providers: [RoadsService],
})
export class RoadsModule {}
