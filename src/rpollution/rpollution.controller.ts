import { CronJob } from 'cron';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { RpollutionService } from './rpollution.service';

@ApiTags('POLLUTION')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('pollution')
export class RpollutionController {
  constructor(
    private readonly rpollutionService: RpollutionService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @ApiOperation({ summary: '대기 오염 Redis 저장 API' })
  @ApiResponse({
    status: 200,
    description: '대기 오염 Redis 저장 API',
  })
  @Timeout(0)
  @Get()
  async redisSavePollution() {
    await this.rpollutionService.redisSavePollution();

    const redisSaveData = new CronJob('0 */1 * * *', () => {
      this.rpollutionService.redisSavePollution();
    });

    this.schedulerRegistry.addCronJob('redisPollution', redisSaveData);
    redisSaveData.start();
  }
}
