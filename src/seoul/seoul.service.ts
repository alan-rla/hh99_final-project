import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import convert from 'xml-js';
import areaList from '../common/area-list';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';

@Injectable()
export class SeoulService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getMultipleDatas(urls: string[]) {
    const streams = [];
    for (const url of urls) {
      streams.push(this.httpService.get(encodeURI(url)));
    }

    const rawDatas = [];
    for (const stream of streams) {
      rawDatas.push(
        await new Promise(resolve => resolve(lastValueFrom(stream))),
      );
    }

    return rawDatas;
  }

  async saveAreaPopData(AREA_NM, areaPopData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `POPULATION_${AREA_NM}`,
          JSON.stringify(areaPopData),
        ),
      ),
    );
  }

  async saveAvgRoadData(AREA_NM, avgRoadData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `ROAD_AVG_${AREA_NM}`,
          JSON.stringify(avgRoadData),
        ),
      ),
    );
  }

  async saveRoadTrafficStts(AREA_NM, roadTrafficStts) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `ROAD_TRAFFIC_${AREA_NM}`,
          JSON.stringify(roadTrafficStts),
        ),
      ),
    );
  }

  async saveBusData(AREA_NM, busData) {
    await new Promise(resolve =>
      resolve(this.cacheManager.set(`BUS_${AREA_NM}`, JSON.stringify(busData))),
    );
  }

  async dataCache(rawDatas) {
    await Promise.all(rawDatas).then(rawDatas => {
      for (const rawData of rawDatas) {
        const output = JSON.parse(
          convert.xml2json(rawData.data, {
            compact: true,
            spaces: 2,
            textFn: removeJsonTextAttribute,
          }),
        )['SeoulRtd.citydata']['CITYDATA'];
        // 지역 이름
        const AREA_NM = output['AREA_NM'];
        // 인구 정보
        const areaPopData = {
          AREA_NM: AREA_NM,
          ...output['LIVE_PPLTN_STTS']['LIVE_PPLTN_STTS'],
        };

        // 지역 도로 정보 요약
        const avgRoadData = {
          AREA_NM: AREA_NM,
          ...output['ROAD_TRAFFIC_STTS']['AVG_ROAD_DATA'],
        };

        // 지역 도로 정보 상세
        const roadTrafficStts =
          output['ROAD_TRAFFIC_STTS']['ROAD_TRAFFIC_STTS'];
        //   버스 정보 전체
        const busData = output['BUS_STN_STTS']['BUS_STN_STTS'];

        const cacheList = [
          this.saveAreaPopData(AREA_NM, areaPopData),
          this.saveAvgRoadData(AREA_NM, avgRoadData),
          this.saveRoadTrafficStts(AREA_NM, roadTrafficStts),
          // this.saveBusData(AREA_NM, busData),
        ];
        Promise.all(cacheList);
        console.log(`${AREA_NM} 정보 저장 완료!`);
      }
    });
  }

  async saveSeoulData() {
    for (let i = 0; i < areaList.length; i += 5) {
      const urls = [];
      for (let j = i; j < i + 5; j++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[j]['AREA_NM']}`,
        );
      }
      console.log(urls);
      const rawDatas = await this.getMultipleDatas(urls);
      await this.dataCache(rawDatas).catch(msg => {
        console.log(msg);
        return this.dataCache(rawDatas);
      });
    }
  }
}
