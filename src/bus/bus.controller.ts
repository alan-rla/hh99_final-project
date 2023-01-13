import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BusService } from './bus.service';

@ApiTags('BUS')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('place')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @ApiOperation({
    summary: '장소이름/bus',
    description: '버스 정보 전체 조회',
  })
  @ApiCreatedResponse({
    description: '선릉역 주변 전체 버스정류장 Response',
    schema: {
      example: {
        BUS_STN_ID: 122000111,
        BUS_ARS_ID: 23214,
        BUS_STN_NM: '선릉역.선정릉정문',
        BUS_STN_X: 127.0485232,
        BUS_STN_Y: 37.50580675,
        BUS_DETAIL: {
          BUS_DETAIL: [{}, {}, {}],
        },
      },
    },
  })
  @ApiParam({
    name: 'placeId',
    required: true,
    description: '장소 이름',
  })
  @Get('/:placeId/bus')
  findAll(@Param('placeId') placeId: PlaceIdRequestDto) {
    return this.busService.findAll(placeId);
  }

  @ApiOperation({
    summary: '장소이름/bus/정류소ID',
    description: '버스 정보 단건 조회',
  })
  @ApiCreatedResponse({
    description: '선릉역 주변 전체 정류소ID Response',
    schema: {
      example: {
        BUS_STN_ID: 122000111,
        BUS_ARS_ID: 23214,
        BUS_STN_NM: '선릉역.선정릉정문',
        BUS_STN_X: 127.0485232,
        BUS_STN_Y: 37.50580675,
        BUS_DETAIL: {
          BUS_DETAIL: [{}, {}, {}],
        },
      },
    },
  })
  @ApiParam({
    name: 'busId',
    required: true,
    description: '정류소ID',
    example: 122000111,
  })
  @Get('/:placeId/bus/:busId')
  findOne(
    @Param('placeId') placeId: PlaceIdRequestDto,
    @Param('busId') busId: number,
  ) {
    return this.busService.findOne(placeId, +busId);
  }
}
