import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';

import {
  RequestRouteQuery,
  RequestRouteParamsDto,
  RouteResponseDto,
} from './dtos';
import { RouteService } from './route.service';

@Controller('/routes')
@ApiTags('Routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Get('/')
  @ApiOperation({ summary: '이동 경로 요약 정보' })
  @ApiOkResponse({ type: [RouteResponseDto] })
  public async getRoutes(
    @Query() query: RequestRouteQuery,
  ): Promise<RouteResponseDto[]> {
    const params = this.adaptQuery(query);

    return this.routeService.getRoutes(params);
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
