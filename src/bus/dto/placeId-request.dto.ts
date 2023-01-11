import { ApiProperty } from '@nestjs/swagger';

export class PlaceIdRequestDto {
  @ApiProperty({
    example: '선릉역',
    description: '장소 이름',
    required: true,
  })
  readonly placeId: string;
}
