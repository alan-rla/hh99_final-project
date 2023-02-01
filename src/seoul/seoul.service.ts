import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import convert from 'xml-js';
import areaList from '../common/area-list';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { PlaceIdRequestDto } from './dto/placeId-request.dto';

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
  // 인구 시간대 정보 cache set
  async saveAreaPopPastData(AREA_NM: string, areaPopPastData: any[]) {
    let currentData: object[] = [];
    const cacheKey = `POPULATION_Past_${AREA_NM}`;
    const cacheValue: string | undefined = await this.cacheManager.get(
      cacheKey,
    );
    if (cacheValue) {
      // append new data to existing value
      currentData = JSON.parse(cacheValue);
      currentData = [currentData, areaPopPastData];

      await this.cacheManager.set(cacheKey, JSON.stringify(currentData));
    } else {
      // save data for the first time
      await this.cacheManager.set(cacheKey, JSON.stringify(areaPopPastData));
    }
  }

  async saveAreaWeatherData(AREA_NM, areaWeatherData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `WEATHER_${AREA_NM}`,
          JSON.stringify(areaWeatherData),
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
  //인구 시간대 정보 캐싱
  async dataPopCache(rawDatas) {
    const unixTime = Date.now();
    const date = new Date(unixTime);
    const time = date.toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedDate = `${date
      .toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })
      .replace(/\//g, '-')}-${time}`;
    console.log(formattedDate);

    await Promise.all(rawDatas).then(rawDatas => {
      try {
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
          const areaPopPastData = {
            AREA_NM: AREA_NM,
            ...output['LIVE_PPLTN_STTS']['LIVE_PPLTN_STTS'],
            CACHE_TIME: formattedDate,
          };

          const cacheList = [
            this.saveAreaPopPastData(AREA_NM, areaPopPastData),
          ];
          Promise.all(cacheList);
          console.log(`${AREA_NM} 시간대 정보 저장 완료!`);
        }
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          this.dataPopCache(rawDatas);
        }, 10000);
      }
    });
  }
  async dataCache(rawDatas) {
    await Promise.all(rawDatas).then(rawDatas => {
      try {
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

          // 날씨 정보
          const areaWeatherData = {
            AREA_NM: AREA_NM,
            ...output['WEATHER_STTS']['WEATHER_STTS'],
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
          let busData = {};
          if (output['BUS_STN_STTS']['BUS_STN_STTS']) {
            busData = output['BUS_STN_STTS']['BUS_STN_STTS'];
          }

          const cacheList = [
            this.saveAreaPopData(AREA_NM, areaPopData),
            this.saveAvgRoadData(AREA_NM, avgRoadData),
            this.saveAreaWeatherData(AREA_NM, areaWeatherData),
            this.saveRoadTrafficStts(AREA_NM, roadTrafficStts),
            this.saveBusData(AREA_NM, busData),
          ];
          Promise.all(cacheList);
        }
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          this.dataCache(rawDatas);
        }, 10000);
      }
    });
  }
  //인구 시간대별 정보 호출, 캐시 저장
  async savePopPastData() {
    for (let i = 0; i < areaList.length; i += 25) {
      const urls = [];
      for (let j = i; j < i + 5; j++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_1}/xml/citydata/1/50/${areaList[j]['AREA_NM']}`,
        );
      }
      for (let k = i + 5; k < i + 10; k++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_2}/xml/citydata/1/50/${areaList[k]['AREA_NM']}`,
        );
      }
      for (let l = i + 10; l < i + 15; l++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_3}/xml/citydata/1/50/${areaList[l]['AREA_NM']}`,
        );
      }
      for (let m = i + 15; m < i + 20; m++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_4}/xml/citydata/1/50/${areaList[m]['AREA_NM']}`,
        );
      }
      for (let n = i + 20; n < i + 25; n++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_5}/xml/citydata/1/50/${areaList[n]['AREA_NM']}`,
        );
      }
      console.log('url', urls);

      const rawDatas = await this.getMultipleDatas(urls);

      await this.dataPopCache(rawDatas);
    }
  }

  async saveSeoulData() {
    for (let i = 0; i < areaList.length; i += 25) {
      const urls = [];
      for (let j = i; j < i + 5; j++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_1}/xml/citydata/1/50/${areaList[j]['AREA_NM']}`,
        );
      }
      for (let k = i + 5; k < i + 10; k++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_2}/xml/citydata/1/50/${areaList[k]['AREA_NM']}`,
        );
      }
      for (let l = i + 10; l < i + 15; l++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_3}/xml/citydata/1/50/${areaList[l]['AREA_NM']}`,
        );
      }
      for (let m = i + 15; m < i + 20; m++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_4}/xml/citydata/1/50/${areaList[m]['AREA_NM']}`,
        );
      }
      for (let n = i + 20; n < i + 25; n++) {
        urls.push(
          `http://openapi.seoul.go.kr:8088/${process.env.API_KEY_5}/xml/citydata/1/50/${areaList[n]['AREA_NM']}`,
        );
      }
      const rawDatas = await this.getMultipleDatas(urls);
      await this.dataCache(rawDatas);
    }
  }

  async findAllPop() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`POPULATION_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    return result;
  }
  // 12시간 전 인구수 조회
  async findPastPop(placeId: PlaceIdRequestDto) {
    const result: object[] = [];
    const now = Date.now();

    const cacheKey = `POPULATION_Past_${placeId}`;
    const cacheValue = JSON.parse(await this.cacheManager.get(cacheKey));

    return cacheValue;
  }

  async findAllWeather() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`WEATHER_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    console.log('------result------', result);
    return { result };
  }

  async findOneWeather(placeId: PlaceIdRequestDto) {
    const result = JSON.parse(
      await this.cacheManager.get(`WEATHER_${placeId}`),
    );
    if (!result) throw new HttpException('wrong place name', 404);
    else return { result };
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

  async findRoads(placeId: PlaceIdRequestDto) {
    const result = JSON.parse(
      await this.cacheManager.get(`ROAD_TRAFFIC_${placeId}`),
    );
    if (!result) throw new HttpException('wrong place name', 404);
    else return { result };
  }

  async findAllBuses(placeId: PlaceIdRequestDto) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    for (const busData of data) {
      delete busData.BUS_DETAIL;
    }

    return data;
  }

  async findBus(placeId: PlaceIdRequestDto, busId: number) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    const resultData = data.find((obj: any) => obj.BUS_STN_ID === busId);

    if (!resultData) throw new HttpException('wrong busId', 404);

    return resultData;
  }
}
