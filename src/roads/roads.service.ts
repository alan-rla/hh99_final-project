import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import convert from 'xml-js';
import { FindAllRoadDto } from './dto/findall-road-response.dto';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
// import { CreateRoadDto } from './dto/create-road.dto';
// import { UpdateRoadDto } from './dto/update-road.dto';

@Injectable()
export class RoadsService {
  constructor(private readonly httpService: HttpService) {}

  async findAllRoads(placeId: string) {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${placeId}`;
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

  async findOneRoad(placeId, roadId) {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${placeId}`;
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

    const arr =
      data['SeoulRtd.citydata']['CITYDATA']['ROAD_TRAFFIC_STTS'][
        'ROAD_TRAFFIC_STTS'
      ];
    const result = arr.find(obj => obj['LINK_ID'] === roadId);

    if (!result) throw new HttpException('wrong road id', 404);
    else return result;
  }
}
