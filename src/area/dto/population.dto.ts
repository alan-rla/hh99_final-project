import { ApiProperty } from '@nestjs/swagger';

export class FindAreaPopDto {
  @ApiProperty({
    example: '강남역',
    description: '지역 이름',
  })
  readonly AREA_NM: string;

  @ApiProperty({
    example: '여유',
    description: '장소 혼잡도 지표',
  })
  readonly AREA_CONGEST_LVL: string;

  @ApiProperty({
    example:
      '사람이 몰려있을 가능성이 낮고 붐빔은 거의 느껴지지 않아요. 도보 이동이 자유로워요.',
    description: '장소 혼잡도 지표 관련 메세지',
  })
  readonly AREA_CONGEST_MSG: string;

  @ApiProperty({
    example: '16000',
    description: '실시간 인구 지표 최소값',
  })
  readonly AREA_PPLTN_MIN: number;

  @ApiProperty({
    example: '18000',
    description: '실시간 인구 지표 최대값',
  })
  readonly AREA_PPLTN_MAX: number;

  @ApiProperty({
    example: '2023-01-10 20:30',
    description: '실시간 인구 데이터 업데이트 시간',
  })
  readonly PPLTN_TIME: string;

  @ApiProperty({
    example: [
      {
        time: '2023-02-02 15:20',
        congestion: '붐빔',
        population: '34000~36000명',
      },
    ],
    description: '과거 인구 이력',
  })
  readonly POP_RECORD: object[];
}
