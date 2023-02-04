import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import {
  RequestRouteQuery,
  RequestRouteParamsDto,
  RouteResponseDto,
} from './dtos';

@Controller('/routes')
@ApiTags('Routes')
export class RouteController {
  @Get('/')
  @ApiOperation({ summary: '이동 경로 요약 정보' })
  @ApiOkResponse({ type: [RouteResponseDto] })
  public getCarRoute(@Query() query: RequestRouteQuery): RouteResponseDto[] {
    return [];
  }

  private adaptQuery(query: RequestRouteQuery): RequestRouteParamsDto {
    const plain: RequestRouteParamsDto = {
      origin: {
        latitude: query.originLatitude,
        longitude: query.originLongitude,
      },
      destination: {
        latitude: query.destinationLatitude,
        longitude: query.destinationLongitude,
      },
    };

    return plainToClass(RequestRouteParamsDto, plain);
  }
}
