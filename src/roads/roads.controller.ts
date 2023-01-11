import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { RoadsService } from './roads.service';
// import { CreateRoadDto } from './dto/create-road.dto';
// import { UpdateRoadDto } from './dto/update-road.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { RoadStatusDto, RoadTrafficDto } from './dto/findall-road-response.dto';

@ApiTags('ROADS')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('place')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @ApiResponse({
    type: RoadTrafficDto,
    status: 200,
    description: '도로 정보 전체 조회',
  })
  @ApiOperation({ summary: '도로 정보 전체 조회' })
  @Get(':placeId/roads')
  async findAllRoads(@Param('placeId') placeId: string) {
    return this.roadsService.findAllRoads(placeId);
  }

  @ApiResponse({
    type: RoadStatusDto,
    status: 200,
    description: '도로 정보 상세 출력',
  })
  @ApiOperation({ summary: '도로 정보 상세 조회' })
  @Get(':placeId/roads/:roadId')
  findOne(@Param('placeId') placeId: string, @Param('roadId') roadId: number) {
    return this.roadsService.findOneRoad(placeId, +roadId);
  }
}
