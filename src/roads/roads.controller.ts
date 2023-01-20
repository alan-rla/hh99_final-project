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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { FindAllRoadDto, FindRoadsDto } from './dto/findall-road-response.dto';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@ApiTags('ROADS')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('place')
export class RoadsController {
  constructor(
    private readonly roadsService: RoadsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @ApiOperation({ summary: '50개 지역 도로 요약 정보 REDIS 저장' })
  @Timeout(0)
  async saveRoadData() {
    // 서버 시작할때 도로 데이터 한번 저장
    await this.roadsService.saveRoadData();

    // 이후 5분마다 한번씩 도로데이터 저장
    const saveData = new CronJob('0 */5 * * * *', () => {
      this.roadsService.saveRoadData();
    });
    this.schedulerRegistry.addCronJob('save data', saveData);
    saveData.start();
  }

  @ApiResponse({
    type: FindAllRoadDto,
    status: 200,
    description: '도로 정보 전체 조회',
  })
  @ApiOperation({ summary: '도로 정보 전체 조회' })
  @Get('/roads')
  async findAllRoads() {
    return this.roadsService.findAllRoads();
  }

  @ApiResponse({
    type: FindRoadsDto,
    status: 200,
    description: '도로 정보 상세 출력',
  })
  @ApiOperation({ summary: '도로 정보 상세 조회' })
  @Get(':placeId/roads')
  findRoads(@Param('placeId') placeId: string) {
    return this.roadsService.findRoads(placeId);
  }
}
