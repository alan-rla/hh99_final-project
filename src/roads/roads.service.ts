import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import convert from 'xml-js';
import { FindAllRoadDto } from './dto/findall-road-response.dto';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import areaList from '../common/area-list';

@Injectable()
export class RoadsService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveRoadData() {
    for (const area of areaList) {
      const url = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${area['AREA_NM']}`;
      const stream = this.httpService.get(encodeURI(url));
      const rawData = await lastValueFrom(stream);

      const data: FindAllRoadDto = JSON.parse(
        convert.xml2json(rawData.data, {
          compact: true,
          spaces: 2,
          textFn: removeJsonTextAttribute,
        }),
      )['SeoulRtd.citydata']['CITYDATA']['ROAD_TRAFFIC_STTS'];

      const avgRoadData = {
        ...data['AVG_ROAD_DATA'],
        AREA_NM: area['AREA_NM'],
      };
      const roadTrafficStts = data['ROAD_TRAFFIC_STTS'];

      await this.cacheManager.set(
        `ROAD_AVG_${area['AREA_NM']}`,
        JSON.stringify(avgRoadData),
      );

      await this.cacheManager.set(
        `ROAD_TRAFFIC_${area['AREA_NM']}`,
        JSON.stringify(roadTrafficStts),
      );
    }
  }

  async findAllRoads() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`ROAD_AVG_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    return result;
  }

  async findRoads(placeId: string) {
    const result = JSON.parse(
      await this.cacheManager.get(`ROAD_TRAFFIC_${placeId}`),
    );
    return result;
  }
}
