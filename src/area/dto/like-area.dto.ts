import { ApiProperty } from '@nestjs/swagger';
export class LikeAreaDto {
  @ApiProperty({
    example: '동대문 관광특구',
    description: '지역 이름',
  })
  readonly AREA_NM: string;
}
