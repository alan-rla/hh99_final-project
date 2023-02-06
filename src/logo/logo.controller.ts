import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogoService } from './logo.service';
import { Controller, UseInterceptors, Get } from '@nestjs/common';

@ApiTags('LOGO')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('logo')
export class LogoController {
  constructor(private readonly logoService: LogoService) {}

  @ApiOperation({ summary: '로고 API' })
  @ApiResponse({
    status: 200,
    description: '로고 API',
  })
  @Get()
  findLogo() {
    return this.logoService.findLogo();
  }
}
