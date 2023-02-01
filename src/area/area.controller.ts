import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Users } from 'src/entities/Users';
import { User } from 'src/common/decorators/user.decorator';
import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { AreaService } from './area.service';
import { FindAllAreaDto, FindOneAreaDto } from './dto/findall-area.dto';
import { LikeAreaDto } from './dto/like-area.dto';

@ApiTags('AREA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOperation({ summary: '도시 50개 지역 이름, 좌표 조회' })
  @ApiResponse({
    type: FindAllAreaDto,
    status: 200,
    description: '도시 50개 지역 이름, 좌표 조회',
  })
  @Get()
  findAllAreas() {
    return this.areaService.findAllAreas();
  }

  @ApiOperation({ summary: '지역 정보 단건 조회' })
  @ApiResponse({
    type: FindOneAreaDto,
    status: 200,
    description: '지역 정보 단건 조회',
  })
  @Get('/:areaName')
  findOneAreas(@Param('areaName') areaName: string) {
    return this.areaService.findOneAreas(areaName);
  }

  @ApiOperation({ summary: '지역 좋아요' })
  @ApiResponse({
    type: LikeAreaDto,
    status: 200,
    description: '지역 좋아요',
  })
  @UseGuards(new LocalAuthGuard())
  @Get('like/:areaName')
  likeArea(@User() user: Users, @Param('areaName') areaName: string) {
    return this.areaService.likeArea(user, areaName);
  }
}
