import { Controller, OnModuleInit, UseInterceptors } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';

import { SeoulService } from './seoul.service';

@ApiTags('SEOUL REAL TIME DATA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('seoul')
export class SeoulController implements OnModuleInit {
  constructor(private readonly seoulService: SeoulService) {}

  public onModuleInit() {
    // 서버 시작할때 서울 도시데이터 한번 저장
    this.saveSeoulData();

    // 서버 시작할때 대기환경 데이터 한번 저장
    this.saveSeoulAirData();
  }

  @ApiOperation({ summary: '50개 지역 정보 REDIS 저장' })
  @Cron('0 */5 * * * *')
  public saveSeoulData() {
    this.seoulService.saveAreaData();
  }

  @ApiOperation({ summary: '25개 행정구 대기환경 REDIS 저장' })
  @Cron('0 0 */1 * * *')
  public saveSeoulAirData() {
    this.seoulService.saveSeoulAirData();
  }

  @ApiOperation({ summary: '캐싱된 모든 데이터 DB에 15분 간격으로 백업' })
  @Cron('0 */15 * * * *')
  public backupCacheData() {
    // 15분마다 캐싱된 데이터 전부 DB 저장
    this.seoulService.saveCachedData();
  }
}
