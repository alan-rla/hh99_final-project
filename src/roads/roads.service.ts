import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import convert from 'xml-js';
import { FindAllRoadDto } from './dto/findall-road-response.dto';
import removeJsonTextAttribute from 'src/common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
// import { CreateRoadDto } from './dto/create-road.dto';
// import { UpdateRoadDto } from './dto/update-road.dto';

@Injectable()
export class RoadsService {
  constructor(private readonly httpService: HttpService) {}

  async findAllRoads(placeId: string) {
    const url = `http://openapi.seoul.go.kr:8088/5974544c417364613536734a774c63/xml/citydata/1/50/${placeId}`;
    const rawData = await this.httpService.get(encodeURI(url)).toPromise();

    const data: FindAllRoadDto = JSON.parse(
      convert.xml2json(rawData.data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    );

    if (!data['SeoulRtd.citydata'])
      throw new HttpException('wrong place name', 404);
    else return data['SeoulRtd.citydata']['CITYDATA']['ROAD_TRAFFIC_STTS'];
  }

  findOne(id: number) {
    return `This action returns a #${id} road`;
  }
}
