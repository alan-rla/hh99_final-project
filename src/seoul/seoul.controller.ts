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
    // 서버 시작할때 서울 도시데이터 한번 저장
    await this.seoulService.saveSeoulData();

    // 이후 5분마다 한번씩 도시데이터 저장
    const saveData = new CronJob('0 */5 * * * *', () => {
      this.seoulService.saveSeoulData();
    });
    this.schedulerRegistry.addCronJob('save data', saveData);
    saveData.start();
  }

  @ApiOperation({ summary: '25개 행정구 대기환경 REDIS 저장' })
  @Timeout(0)
  async saveSeoulAirData() {
    // 서버 시작할때 대기환경 데이터 한번 저장
    await this.seoulService.saveSeoulAirData();

    // 이후 1시간마다 한번씩 대기환경 데이터 저장
    const saveAirData = new CronJob('0 0 */1 * * *', () => {
      this.seoulService.saveSeoulAirData();
    });
    this.schedulerRegistry.addCronJob('save air data', saveAirData);
    saveAirData.start();
  }

  @ApiOperation({ summary: '캐싱된 모든 데이터 DB에 15분 간격으로 백업' })
  @Timeout(0)
  async backupCacheData() {
    // 15분마다 캐싱된 데이터 전부 DB 저장 or 업데이트
    const backupCacheData = new CronJob('0 */15 * * * *', () => {
      this.seoulService.backupCacheData();
    });
    this.schedulerRegistry.addCronJob('back up data', backupCacheData);
    backupCacheData.start();
  }
}
