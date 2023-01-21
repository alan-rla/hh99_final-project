import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Timeout, SchedulerRegistry } from '@nestjs/schedule';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
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

  @ApiOperation({ summary: '50개 지역 버스 요약 정보 REDIS 저장' })
  @Get()
  // @Timeout(0)
  async saveSeoulData() {
    // 서버 시작할때 도로 데이터 한번 저장
    await this.seoulService.saveSeoulData();

    // 이후 5분마다 한번씩 도로데이터 저장
    // const saveData = new CronJob('0 */5 * * * *', () => {
    //   this.seoulService.saveSeoulData();
    // });
    // this.schedulerRegistry.addCronJob('save data', saveData);
    // saveData.start();
  }
}
