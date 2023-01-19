import { Controller, Get, Param } from '@nestjs/common';
import { PopulationService } from './population.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PopulationDto } from './dto/findall-population.dto';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@ApiTags('POPULATION')
@Controller('place')
export class PopulationController {
  constructor(
    private readonly populationService: PopulationService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  //50개 지역 캐싱
  @ApiOperation({ summary: '50개 지역 인구데이터 레디스 캐싱' })
  @Timeout(0)
  async saveAll() {
    //서버시작 할때 데이터 캐싱
    await this.populationService.saveAll();

    //이후 5분마다 데이터 업데이트
    const updateData = new CronJob('0 */5 * * *', () => {
      this.populationService.saveAll();
    });
    this.schedulerRegistry.addCronJob('update data', updateData);
    updateData.start();
  }

  //50개 지역 전체 조회
  @ApiResponse({
    type: PopulationDto,
    status: 200,
    description: '인구 정보 조회',
  })
  @ApiOperation({ summary: '인구 정보 전체 조회' })
  @Get('/population')
  async findAll() {
    return await this.populationService.findAll();
  }
  //지역 상세조회
  @Get('/population/:placeId')
  async find(@Param('placeId') placeId: string) {
    console.log('placeId: ', placeId);
    return await this.populationService.find(placeId);
  }
}

// }
