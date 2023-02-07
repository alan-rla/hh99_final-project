import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class RequestRouteQuery {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ description: '출발지 위도' })
  /**
   * 출발지 위도
   */
  public originLatitude: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ description: '출발지 경도' })
  /**
   * 출발지 경도
   */
  public originLongitude: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ description: '도착지 위도' })
  /**
   * 도착지 위도
   */
  public destinationLatitude: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ description: '도착지 경도' })
  /**
   * 도착지 경도
   */
  public destinationLongitude: number;
}
