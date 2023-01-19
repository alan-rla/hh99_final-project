import { ApiProperty } from '@nestjs/swagger';

export class PopulationDto {
  // @ApiProperty({
  //   example: '강남 MICE 관광특구',
  //   description: '지역 이름',
  // })
  // readonly AREA_NM: string;

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
    example: '51.7',
    description: '남성 인구 비율(남성)',
  })
  readonly MALE_PPLTN_RATE: number;

  @ApiProperty({
    example: '48.3',
    description: '남성 인구 비율(여성)',
  })
  readonly FEMALE_PPLTN_RATE: number;

  @ApiProperty({
    example: '0.1',
    description: '0~10세 인구 비율',
  })
  readonly PPLTN_RATE_0: number;

  @ApiProperty({
    example: '2.7',
    description: '10대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_10: number;

  @ApiProperty({
    example: '19.5',
    description: '20대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_20: number;

  @ApiProperty({
    example: '25.3',
    description: '30대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_30: number;

  @ApiProperty({
    example: '23.9',
    description: '40대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_40: number;

  @ApiProperty({
    example: '17.6',
    description: '50대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_50: number;

  @ApiProperty({
    example: '7.8',
    description: '60대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_60: number;

  @ApiProperty({
    example: '3.0',
    description: '70대 실시간 인구 비율',
  })
  readonly PPLTN_RATE_70: number;

  @ApiProperty({
    example: '5.9',
    description: '상주 인구 비율',
  })
  readonly RESNT_PPLTN_RATE: number;

  @ApiProperty({
    example: '94.1',
    description: '비상주 인구 비율',
  })
  readonly NON_RESNT_PPLTN_RATE: number;

  @ApiProperty({
    example: 'N',
    description: '대체 데이터 여부',
  })
  readonly REPLACE_YN: string;
  @ApiProperty({
    example: '2023-01-10 20:30',
    description: '실시간 인구 데이터 업데이트 시간',
  })
  readonly PPLTN_TIME: string;
}
