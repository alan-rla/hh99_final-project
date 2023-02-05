import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

import { Route, RouteType } from '../types';

export class RouteResponseDto implements Route {
  @IsEnum(RouteType)
  @ApiProperty({ enum: RouteType, description: '이동 수단' })
  public type: RouteType;

  @IsNumber()
  @ApiProperty({ description: '총 소요 시간(초)' })
  public duration: number;

  @IsString()
  @ApiProperty({ description: '총 이동 거리(미터)' })
  public distance: number;

  @IsString()
  @ApiProperty({ description: '출발지 이름(도로명, 정류장 등)' })
  public nameOrigin: string;

  @IsString()
  @ApiProperty({ description: '도착지 이름(AREA_NM)' })
  public nameDestination: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '출발지로부터의 경로 이름 또는 노선 이름 배열' })
  public routeNames: string[];
}
