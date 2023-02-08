import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { Timeout, SchedulerRegistry } from '@nestjs/schedule';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CronJob } from 'cron';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
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
    const saveAirData = new CronJob('0 0 */1 * * *', () => {
      this.seoulService.saveSeoulAirData();
    });
    this.schedulerRegistry.addCronJob('save air data', saveAirData);
    saveAirData.start();
  }
}
