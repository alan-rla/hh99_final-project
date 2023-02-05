import { ApiProperty } from '@nestjs/swagger';

export class FindAllAreaDto {
  @ApiProperty({
    example: '강남역',
    description: '지역 이름',
  })
  readonly AREA_NM: string;

  @ApiProperty({
    example: '16000',
    description: '실시간 인구 지표 최소값',
  })
  readonly AREA_PPLTN_MIN: number;

  @ApiProperty({
    example: 37.56708699414618,
    description: '경도',
  })
  readonly LNG: number;

  @ApiProperty({
    example: 127.01004569827248,
    description: '위도',
  })
  readonly LAT: number;

  @ApiProperty({
    example:
      'https://claudia-static.s3.ap-northeast-2.amazonaws.com/static/mapping-area/1.svg',
    description: '지역 사진',
  })
  readonly areaImg: number;
}

export class FindOneAreaDto extends FindAllAreaDto {
  @ApiProperty({
    example: 0,
    description: '지역 좋아요 수',
  })
  readonly likeCnt: number;

  @ApiProperty({
    example: '보통',
    description: '붐비는 정도',
  })
  readonly congestLvl: string;

  @ApiProperty({
    example: '비 또는 눈 소식이 없어요.',
    description: '날씨',
  })
  readonly weather: string;

  @ApiProperty({
    example: '보통',
    description: '대기환경',
  })
  readonly air: string;

  @ApiProperty({
    example: '서행',
    description: '도로 상황',
  })
  readonly road: string;
}
