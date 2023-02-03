import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { TourismService } from './tourist_spot.service';

@ApiTags('SEOUL TOURISM DATA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('tourism')
export class ToursimController {
  constructor(private readonly tourismService: TourismService) {}

  @ApiOperation({ summary: '구단위 관광정보 조회' })
  @ApiResponse({
    status: 200,
    description: '구단위 관광정보 조회',
  })
  @Get('/:STATE_NM')
  async findOneStateTourism(@Param('STATE_NM') STATE_NM: string) {
    return await this.tourismService.findOneStateTourism(STATE_NM);
  }
}
