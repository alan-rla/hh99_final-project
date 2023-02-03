import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RequestRouteQuery {
  @IsNumber()
  @ApiProperty({ description: '출발지 위도' })
  /**
   * 출발지 위도
   */
  public originLatitude: number;

  @IsNumber()
  @ApiProperty({ description: '출발지 경도' })
  /**
   * 출발지 경도
   */
  public originLongitude: number;

  @IsNumber()
  @ApiProperty({ description: '도착지 위도' })
  /**
   * 도착지 위도
   */
  public destinationLatitude: number;

  @IsNumber()
  @ApiProperty({ description: '도착지 경도' })
  /**
   * 도착지 경도
   */
  public destinationLongitude: number;
}
