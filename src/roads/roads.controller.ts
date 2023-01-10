import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoadsService } from './roads.service';
// import { CreateRoadDto } from './dto/create-road.dto';
// import { UpdateRoadDto } from './dto/update-road.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ROADS')
@Controller('place')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Get(':placeId/roads')
  async findAllRoads(@Param('placeId') placeId: string) {
    return this.roadsService.findAllRoads(placeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {}
}
