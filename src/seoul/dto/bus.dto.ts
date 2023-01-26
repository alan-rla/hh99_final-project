import { ApiProperty } from '@nestjs/swagger';

export class BusDataDto {
  @ApiProperty({
    example: '122000111',
    description: '정류소ID',
  })
  readonly 'BUS_STN_ID': number;

  @ApiProperty({
    example: '23214',
    description: '정류소 고유번호',
  })
  readonly 'BUS_ARD_ID': number;

  @ApiProperty({
    example: '선릉역.선정릉정문',
    description: '정류소명',
  })
  readonly 'BUS_STN_NM': string;

  @ApiProperty({
    example: 127.0485232,
    description: '정류소 X 좌표(경도)',
  })
  readonly 'BUS_STN_X': number;

  @ApiProperty({
    example: 37.50580675,
    description: '정류소 Y 좌표(위도)',
  })
  readonly 'BUS_STN_Y': number;
}
