import { ApiProperty } from '@nestjs/swagger';

export class FindAreaWeatherDto {
  @ApiProperty({
    example: '강남역',
    description: '지역 이름',
  })
  readonly AREA_NM: string;

  @ApiProperty({
    example: '2023-02-04 22:22',
    description: '날씨 정보 업데이트 시간',
  })
  readonly WEATHER_TIME: string;

  @ApiProperty({
    example: -0.6,
    description: '기온',
  })
  readonly TEMP: number;

  @ApiProperty({
    example: 1.1,
    description: '체감 기온',
  })
  readonly SENSIBLE_TEMP: number;

  @ApiProperty({
    example: 6,
    description: '최고 기온',
  })
  readonly MAX_TEMP: number;

  @ApiProperty({
    example: -5,
    description: '최저 기온',
  })
  readonly MIN_TEMP: number;

  @ApiProperty({
    example: -47,
    description: '습도',
  })
  readonly HUMIDITY: number;

  @ApiProperty({
    example: 'E',
    description: '바람 방향',
  })
  readonly WIND_DIRCT: string;

  @ApiProperty({
    example: 1,
    description: '풍속 (m/s)',
  })
  readonly WIND_SPD: number;

  @ApiProperty({
    example: 1,
    description: '강수량',
  })
  readonly PRECIPITATION: number;

  @ApiProperty({
    example: '없음',
    description: '날씨 종류 (비/눈/없음)',
  })
  readonly PRECPT_TYPE: string;

  @ApiProperty({
    example: '비 또는 눈 소식이 없어요.',
    description: '날씨 메세지',
  })
  readonly PCP_MSG: string;

  @ApiProperty({
    example: '07:34',
    description: '일출 시간',
  })
  readonly SUNRISE: string;

  @ApiProperty({
    example: '17:59',
    description: '일몰 시간',
  })
  readonly SUNSET: string;

  @ApiProperty({
    example: 0,
    description: '자외선 지수 레벨',
  })
  readonly UV_INDEX_LVL: number;

  @ApiProperty({
    example: '낮음',
    description: '자외선 지수 레벨',
  })
  readonly UV_INDEX: string;

  @ApiProperty({
    example: '햇볕에 민감한 분들은 자외선 차단제를 발라주세요.',
    description: '자외선 지수 메세지',
  })
  readonly UV_MSG: string;

  @ApiProperty({
    example: {
      FCST24HOURS: {
        FCST24HOURS: [
          {
            FCST_DT: 202302042300,
            TEMP: -1,
            PRECIPITATION: '-',
            PRECPT_TYPE: '없음',
            RAIN_CHANCE: 0,
            SKY_STTS: '맑음',
          },
        ],
      },
    },
    description: '일기 예보',
  })
  readonly POP_RECORD: object;
}
