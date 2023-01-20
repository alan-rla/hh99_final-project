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

      const output: FindAllRoadDto = JSON.parse(
        convert.xml2json(rawData.data, {
          compact: true,
          spaces: 2,
          textFn: removeJsonTextAttribute,
        }),
      );

      let avgRoadData: object;
      let roadTrafficStts: object;
      if (!output['SeoulRtd.citydata']) {
        avgRoadData = {
          에러: '서울시 실시간 도시데이터 API에 재요청 중입니다.',
        };
        roadTrafficStts = {
          에러: '서울시 실시간 도시데이터 API에 재요청 중입니다.',
        };
      } else {
        const data =
          output['SeoulRtd.citydata']['CITYDATA']['ROAD_TRAFFIC_STTS'];
        avgRoadData = {
          AREA_NM: area['AREA_NM'],
          ...data['AVG_ROAD_DATA'],
        };
        roadTrafficStts = data['ROAD_TRAFFIC_STTS'];
      }

      await this.cacheManager.set(
        `ROAD_AVG_${area['AREA_NM']}`,
        JSON.stringify(avgRoadData),
      );

      await this.cacheManager.set(
        `ROAD_TRAFFIC_${area['AREA_NM']}`,
        JSON.stringify(roadTrafficStts),
      );
      console.log(`${area['AREA_NM']} 정보 저장 완료!`);
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
    return { result };
  }

  async findRoads(placeId: string) {
    const result = JSON.parse(
      await this.cacheManager.get(`ROAD_TRAFFIC_${placeId}`),
    );
    if (!result) throw new HttpException('wrong place name', 404);
    else return { result };
  }
}
