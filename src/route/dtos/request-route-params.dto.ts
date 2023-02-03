import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { RequestRouteParams } from '../types';
import { CoordinateDto } from './coordinate.dto';

export class RequestRouteParamsDto implements RequestRouteParams {
  @Type(() => CoordinateDto)
  @ApiProperty({ description: '출발지 좌표' })
  public origin: CoordinateDto;

  @Type(() => CoordinateDto)
  @ApiProperty({ description: '도착지 좌표' })
  public destination: CoordinateDto;
}
