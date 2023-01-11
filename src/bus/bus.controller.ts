import { Controller, Get, Param } from '@nestjs/common';
import { BusService } from './bus.service';

@Controller('place')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Get('/:placeId/bus')
  findAll(@Param('placeId') placeId: string) {
    return this.busService.findAll(placeId);
  }

  @Get('/:placeId/bus/:busId')
  findOne(@Param('placeId') placeId: string, @Param('busId') busId: number) {
    return this.busService.findOne(placeId, +busId);
  }
}
