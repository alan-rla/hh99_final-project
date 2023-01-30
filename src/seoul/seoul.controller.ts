import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { Timeout, SchedulerRegistry } from '@nestjs/schedule';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CronJob } from 'cron';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import { PopulationDto } from './dto/population.dto';
import { FindAllRoadsDto, FindRoadsDto } from './dto/road.dto';
import { SeoulService } from './seoul.service';

@ApiTags('SEOUL REAL TIME DATA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('seoul')
export class SeoulController {
  constructor(
    private readonly seoulService: SeoulService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @ApiOperation({ summary: '50개 지역 정보 REDIS 저장' })
  @Timeout(0)
  async saveSeoulData() {
    // 서버 시작할때 도로 데이터 한번 저장
    await this.seoulService.saveSeoulData();

    // 이후 5분마다 한번씩 도로데이터 저장
    const saveData = new CronJob('0 */5 * * * *', () => {
      this.seoulService.saveSeoulData();
    });
    this.schedulerRegistry.addCronJob('save data', saveData);
    saveData.start();
  }

  @ApiOperation({ summary: '1시간마다 인구정보 REDIS 저장' })
  @Timeout(0)
  async savePopPastData() {
    // 서버 시작할때 인구데이터 한번 저장
    await this.seoulService.savePopPastData();

    // 이후 1시간 마다 한번씩 도로데이터 저장
    const savePopData = new CronJob('0 * * * *', () => {
      this.seoulService.savePopPastData();
    });
    this.schedulerRegistry.addCronJob('save pop data', savePopData);
    savePopData.start();
  }

  @ApiResponse({
    type: PopulationDto,
    status: 200,
    description: '인구 정보 전체 조회',
  })
  @ApiOperation({ summary: '인구 정보 전체 조회' })
  @Get('/population')
  async findAllPop() {
    return this.seoulService.findAllPop();
  }
  // 12시간 전 시간대별 인구수 조회
  @ApiResponse({
    type: PopulationDto,
    status: 200,
    description: '12시간 전 인구수 조회 ',
  })
  @ApiOperation({ summary: '인구 정보 전체 조회' })
  @Get(':placeId/population/past')
  async findPastPop(@Param('placeId') placeId: PlaceIdRequestDto) {
    return this.seoulService.findPastPop(placeId);
  }

  @ApiResponse({
    type: FindAllRoadsDto,
    status: 200,
    description: '도로 정보 전체 조회',
  })
  @ApiOperation({ summary: '도로 정보 전체 조회' })
  @Get('/roads')
  async findAllRoads() {
    return this.seoulService.findAllRoads();
  }

  @ApiResponse({
    type: FindRoadsDto,
    status: 200,
    description: '도로 정보 전체 조회',
  })
  @ApiOperation({ summary: '도로 정보 전체 조회' })
  @Get(':placeId/roads')
  async findRoads(@Param('placeId') placeId: PlaceIdRequestDto) {
    return this.seoulService.findRoads(placeId);
  }

  @Get('/:placeId/bus')
  async findAllBuses(@Param('placeId') placeId: PlaceIdRequestDto) {
    return this.seoulService.findAllBuses(placeId);
  }

  @Get('/:placeId/bus/:busId')
  async findBus(
    @Param('placeId') placeId: PlaceIdRequestDto,
    @Param('busId') busId: number,
  ) {
    return this.seoulService.findBus(placeId, +busId);
  }
}
