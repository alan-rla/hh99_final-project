import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { Timeout, SchedulerRegistry } from '@nestjs/schedule';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CronJob } from 'cron';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
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
    const saveData = new CronJob('0 */10 * * * *', () => {
      this.seoulService.saveSeoulData();
    });
    this.schedulerRegistry.addCronJob('save data', saveData);
    saveData.start();
  }

  @ApiOperation({ summary: '25개 행정구 대기환경 REDIS 저장' })
  @Timeout(0)
  async saveSeoulAirData() {
    // 서버 시작할때 도로 데이터 한번 저장
    await this.seoulService.saveSeoulAirData();

    // 이후 5분마다 한번씩 도로데이터 저장
    const saveAirData = new CronJob('0 * */1 * * *', () => {
      this.seoulService.saveSeoulAirData();
    });
    this.schedulerRegistry.addCronJob('save air data', saveAirData);
    saveAirData.start();
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

  @ApiParam({
    name: 'placeId',
    required: true,
    description: '장소 이름',
    example: '여의도',
  })
  @ApiResponse({
    type: FindRoadsDto,
    status: 200,
    description: '도로 정보 전체 조회',
  })
  @ApiOperation({ summary: '도로 정보 전체 조회' })
  @Get(':placeId/roads')
  async findRoads(@Param('placeId') placeId: string) {
    return this.seoulService.findRoads(placeId);
  }

  @ApiParam({
    name: 'placeId',
    required: true,
    description: '장소 이름',
    example: '여의도',
  })
  @Get('/:placeId/bus')
  async findAllBuses(@Param('placeId') placeId: string) {
    return this.seoulService.findAllBuses(placeId);
  }

  @ApiParam({
    name: 'placeId',
    required: true,
    description: '장소 이름',
    example: '여의도',
  })
  @ApiParam({
    name: 'busId',
    required: true,
    description: '버스 정거장 이름',
    example: 118000007,
  })
  @Get('/:placeId/bus/:busId')
  async findBus(
    @Param('placeId') placeId: string,
    @Param('busId') busId: number,
  ) {
    return this.seoulService.findBus(placeId, +busId);
  }

  @ApiResponse({
    status: 200,
    description: '날씨 정보 전체 조회',
  })
  @ApiOperation({ summary: '날씨 정보 전체 조회' })
  @Get('/weather')
  async findAllWeather() {
    return this.seoulService.findAllWeather();
  }

  @Get('/air')
  async findAllAir() {
    return this.seoulService.findAllAir();
  }

  @ApiParam({
    name: 'placeId',
    required: true,
    description: '장소 이름',
    example: '여의도',
  })
  @ApiResponse({
    status: 200,
    description: '지역 날씨 정보 조회',
  })
  @ApiOperation({ summary: '지역 날씨 정보 조회' })
  @Get('/:placeId/weather')
  async findOneWeather(@Param('placeId') placeId: string) {
    return this.seoulService.findOneWeather(placeId);
  }
}
