import { Module } from '@nestjs/common';
import { SeoulService } from './seoul.service';
import { SeoulController } from './seoul.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SeoulController],
  providers: [SeoulService],
})
export class SeoulModule {}
