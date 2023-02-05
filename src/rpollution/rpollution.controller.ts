import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { RpollutionService } from './rpollution.service';

@ApiTags('POLLUTION')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('pollution')
export class RpollutionController {
  constructor(private readonly rpollutionService: RpollutionService) {}

  @ApiOperation({ summary: '대기 오염 Redis 저장 API' })
  @ApiResponse({
    status: 200,
    description: '대기 오염 Redis 저장 API',
  })
  @Get()
  async redisSavePollution() {
    return await this.rpollutionService.redisSavePollution();
  }
}
