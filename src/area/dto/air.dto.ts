import { ApiProperty } from '@nestjs/swagger';

export class FindAreaAirDto {
  @ApiProperty({
    example: '강남역',
    description: '지역 이름',
  })
  readonly AREA_NM: string;

  @ApiProperty({
    example: '보통',
    description: '미세먼지 지표 (PM25)',
  })
  readonly PM25_INDEX: string;

  @ApiProperty({
    example: 31,
    description: '미세먼지 농도 (㎍/㎥)',
  })
  readonly PM25: number;

  @ApiProperty({
    example: '보통',
    description: '초미세먼지 지표 (PM10)',
  })
  readonly PM10_INDEX: string;

  @ApiProperty({
    example: 46,
    description: '초미세먼지 농도 (㎍/㎥)',
  })
  readonly PM10: number;

  @ApiProperty({
    example: '보통',
    description: '통합 대기 환경 등급',
  })
  readonly AIR_IDX: string;

  @ApiProperty({
    example: 74,
    description: '통합 대기 환경 지수',
  })
  readonly AIR_IDX_MVL: number;

  @ApiProperty({
    example: 'PM-2.5',
    description: '통합 대기 환경 지수 결정물질',
  })
  readonly AIR_IDX_MAIN: number;

  @ApiProperty({
    example: '호흡기가 예민하신 분들은 몸상태 유의하며 활동해주세요.',
    description: '통합 대기 환경 등급 메세지',
  })
  readonly AIR_MSG: number;
}
