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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { AreaService } from './area.service';
import { FindAllAreaDto } from './dto/findall-area.dto';

@ApiTags('AREA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiResponse({
    type: FindAllAreaDto,
    status: 200,
    description: '도시 50개 지역 이름, 좌표 조회',
  })
  @Get()
  findAllAreas() {
    return this.areaService.findAllAreas();
  }
}
