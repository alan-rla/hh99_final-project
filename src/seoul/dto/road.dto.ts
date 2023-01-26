import { ApiProperty } from '@nestjs/swagger';

class RoadDataDto {
  @ApiProperty({
    example: '여의도',
    description: '지역 이름',
  })
  readonly 'AREA_NM': string;

  @ApiProperty({
    example: '해당 장소로 이동·진입시 시간이 오래 걸릴 수 있어요.',
    description: '전체도로소통평균현황 메세지',
  })
  readonly 'ROAD_MSG': string;

  @ApiProperty({
    example: '정체',
    description: '전체도로소통평균현황',
  })
  readonly 'ROAD_TRAFFIC_IDX': string;

  @ApiProperty({
    example: '2023-01-10 20:05',
    description: '도로소통현황 업데이트 시간',
  })
  readonly 'ROAD_TRFFIC_TIME': string;

  @ApiProperty({
    example: 12,
    description: '전체도로소통평균속도',
  })
  readonly 'ROAD_TRAFFIC_SPD': number;
}

export class FindAllRoadsDto {
  @ApiProperty({
    type: [RoadDataDto],
    description: '50개 지역 도로 정보 요약',
  })
  readonly 'result': object[];
}
class RoadStatusDto {
  @ApiProperty({
    example: 1220003302,
    description: '도로구간 LINK ID',
  })
  readonly 'LINK_ID': number;

  @ApiProperty({
    example: '영동대로',
    description: '도로명',
  })
  readonly 'ROAD_NM': string;

  @ApiProperty({
    example: 1220040300,
    description: '도로노드시작지점 코드',
  })
  readonly 'START_ND_CD': number;

  @ApiProperty({
    example: '삼성역사거리',
    description: '도로노드시작명',
  })
  readonly 'START_ND_NM': string;

  @ApiProperty({
    example: '127.0631551248171434_37.5088875159677215',
    description: '도로노드시작지점좌표',
  })
  readonly 'START_ND_XY': string;

  @ApiProperty({
    example: 1220042500,
    description: '도로노드종료지점 코드',
  })
  readonly 'END_ND_CD': number;

  @ApiProperty({
    example: '아이파크타워',
    description: '도로노드종료명',
  })
  readonly 'END_ND_NM': string;

  @ApiProperty({
    example: '127.0608803393490263_37.5131222727573643',
    description: '도로노드종료지점좌표',
  })
  readonly 'END_ND_XY': string;

  @ApiProperty({
    example: 511,
    description: '도로구간길이',
  })
  readonly 'DIST': number;

  @ApiProperty({
    example: 15,
    description: '도로구간평균속도',
  })
  readonly 'SPD': number;

  @ApiProperty({
    example: '정체',
    description: '도로구간소통지표',
  })
  readonly 'IDX': string;

  @ApiProperty({
    example:
      '127.0608179467803467_37.5131010042639232|127.0630927340002927_37.5088662486585420',
    description: '링크아이디 좌표(보간점)',
  })
  readonly 'XYLIST': string;
}

export class FindRoadsDto {
  @ApiProperty({
    type: [RoadStatusDto],
    description: '1개 지역 도로 상세 정보',
  })
  readonly 'result': object[];
}
