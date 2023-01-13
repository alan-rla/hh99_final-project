import { ApiProperty } from '@nestjs/swagger';

export class FindAllAreaDto {
  @ApiProperty({
    example: [
      {
        AREA_NM: '강남 MICE 관광특구',
        LNG: 37.512219809865414,
        LAT: 127.05898584858284,
      },
    ],
  })
  readonly data: Array<AreaInfoDto>;
}

class AreaInfoDto {
  @ApiProperty({
    example: '동대문 관광특구',
    description: '지역 이름',
  })
  readonly AREA_NM: string;

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
}
