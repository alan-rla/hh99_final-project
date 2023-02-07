import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { Coordinate } from '../types';

export class CoordinateDto implements Coordinate {
  @IsNumber()
  @ApiProperty({ description: '위도' })
  public latitude: number;

  @IsNumber()
  @ApiProperty({ description: '경도' })
  public longitude: number;
}
