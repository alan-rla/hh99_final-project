import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { Users } from 'src/entities/Users';
import { User } from 'src/common/decorators/user.decorator';

import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';

import { FindAllAreaDto, FindOneAreaDto } from './dto/findall-area.dto';
import { LikeAreaDto } from './dto/like-area.dto';
import { FindAreaPopDto } from './dto/population.dto';
import { FindAreaWeatherDto } from './dto/weather.dto';
import { FindAreaAirDto } from './dto/air.dto';

import { AreaService } from './area.service';

@ApiTags('AREA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOperation({ summary: '도시 50개 지역 이름, 좌표 조회' })
  @ApiOkResponse({
    type: FindAllAreaDto,
    description: '도시 50개 지역 이름, 좌표 조회',
  })
  @Get()
  getAllAreas() {
    return this.areaService.getAllAreas();
  }

  @ApiOperation({ summary: '지역 정보 단건 조회' })
  @ApiOkResponse({
    type: FindOneAreaDto,
    description: '지역 정보 단건 조회',
  })
  @Get('/:areaName')
  getArea(@Param('areaName') areaName: string) {
    return this.areaService.getArea(areaName);
  }

  @ApiOperation({ summary: '지역 인구 정보 단건 조회' })
  @ApiOkResponse({
    type: FindAreaPopDto,
    description: '지역 인구 정보 단건 조회',
  })
  @Get('/:areaName/population')
  getAreaPopulation(@Param('areaName') areaName: string) {
    return this.areaService.getAreaPopulation(areaName);
  }

  @ApiOperation({ summary: '지역 날씨 정보 단건 조회' })
  @ApiOkResponse({
    type: FindAreaWeatherDto,
    description: '지역 날씨 정보 단건 조회',
  })
  @Get('/:areaName/weather')
  getAreaWeather(@Param('areaName') areaName: string) {
    return this.areaService.getAreaWeather(areaName);
  }

  @ApiOperation({ summary: '지역 대기환경 정보 단건 조회' })
  @ApiOkResponse({
    type: FindAreaAirDto,
    description: '지역 대기환경 정보 단건 조회',
  })
  @Get('/:areaName/air')
  getAreaAirQuality(@Param('areaName') areaName: string) {
    return this.areaService.getAreaAirQuality(areaName);
  }

  @ApiOperation({ summary: '지역 좋아요' })
  @ApiOkResponse({
    type: LikeAreaDto,
    description: '지역 좋아요',
  })
  @UseGuards(LoggedInGuard)
  @Get('like/:areaName')
  likeArea(@User() user: Users, @Param('areaName') areaName: string) {
    return this.areaService.likeArea(user, areaName);
  }
}
