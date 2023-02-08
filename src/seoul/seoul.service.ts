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
import dayjs from 'dayjs';
import { PopulationDto } from './dto/population.dto';

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
          0,
        ),
      ),
    );
  }

  async saveAreaWeatherData(AREA_NM, areaWeatherData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `WEATHER_${AREA_NM}`,
          JSON.stringify(areaWeatherData),
          0,
        ),
      ),
    );
  }

  async saveAreaAirData(AREA_NM, areaWeatherData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(
          `AIR_${AREA_NM}`,
          JSON.stringify(areaWeatherData),
          0,
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
          0,
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
          0,
        ),
      ),
    );
  }

  async saveBusData(AREA_NM, busData) {
    await new Promise(resolve =>
      resolve(
        this.cacheManager.set(`BUS_${AREA_NM}`, JSON.stringify(busData), 0),
      ),
    );
  }

  async dataCache(rawDatas) {
    await Promise.all(rawDatas).then(async rawDatas => {
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

          // 현재 인구 정보
          const CURRENT_POP_DATA = output['LIVE_PPLTN_STTS']['LIVE_PPLTN_STTS'];
          const CURRENT_TIME = dayjs(CURRENT_POP_DATA['PPLTN_TIME']);
          // 요약 정보 저장용(POP_RECORD) 객체
          const CURRENT_POP_RECORD = {
            time: CURRENT_POP_DATA['PPLTN_TIME'],
            congestion: CURRENT_POP_DATA['AREA_CONGEST_LVL'],
            population: `${CURRENT_POP_DATA['AREA_PPLTN_MIN']}~${CURRENT_POP_DATA['AREA_PPLTN_MAX']}명`,
          };

          // 현재 REDIS 저장된 인구 정보 호출 (없으면 PAST_DATA = null)
          const PAST_DATA: PopulationDto = JSON.parse(
            await this.cacheManager.get(`POPULATION_${AREA_NM}`),
          );
          let POP_RECORD: object[] = [];

          if (PAST_DATA) {
            // 인구 과거 이력 불러오기
            const PAST_POP_RECORD = PAST_DATA['POP_RECORD'];
            POP_RECORD = [...PAST_POP_RECORD];
            // 저장되어있는 인구 정보 시간
            const PAST_TIME = dayjs(PAST_DATA['PPLTN_TIME']);

            if (CURRENT_TIME.isAfter(PAST_TIME, 'hour')) {
              POP_RECORD.push(CURRENT_POP_RECORD);
            } else {
              // 현재 인구 데이터 요약본이 같은 시간이면 업데이트
              const lastRecordTime = dayjs(
                POP_RECORD[POP_RECORD.length - 1]['time'],
              );
              if (CURRENT_TIME.isSame(lastRecordTime, 'hour')) {
                POP_RECORD.pop();
                POP_RECORD.push(CURRENT_POP_RECORD);
              }
            }

            // 12시간 초과 데이터는 삭제
            if (POP_RECORD.length > 12) {
              POP_RECORD.shift();
            }
          }

          // 저장된 데이터 없으면 REDIS에 현재 인구 요약본 추가
          if (POP_RECORD.length === 0) {
            POP_RECORD.push(CURRENT_POP_RECORD);
          }

          const areaPopData = {
            AREA_NM: AREA_NM,
            AREA_CONGEST_LVL: CURRENT_POP_DATA['AREA_CONGEST_LVL'],
            AREA_CONGEST_MSG: CURRENT_POP_DATA['AREA_CONGEST_MSG'],
            AREA_PPLTN_MIN: CURRENT_POP_DATA['AREA_PPLTN_MIN'],
            AREA_PPLTN_MAX: CURRENT_POP_DATA['AREA_PPLTN_MAX'],
            PPLTN_TIME: CURRENT_POP_DATA['PPLTN_TIME'],
            POP_RECORD: POP_RECORD,
          };

          const {
            PM25_INDEX,
            PM25,
            PM10_INDEX,
            PM10,
            AIR_IDX,
            AIR_IDX_MVL,
            AIR_IDX_MAIN,
            AIR_MSG,
            ...weather
          } = output['WEATHER_STTS']['WEATHER_STTS'];

          // 날씨 정보
          const areaWeatherData = weather ?? '점검중';

          // 미세먼지 정보
          const areaAirData = {
            지역이름: AREA_NM ?? '점검중',
            초미세먼지지수: PM25_INDEX ?? '점검중',
            초미세먼지: PM25 ?? '점검중',
            미세먼지지수: PM10_INDEX ?? '점검중',
            미세먼지: PM10 ?? '점검중',
            대기환경등급: AIR_IDX ?? '점검중',
            대기환경지수: AIR_IDX_MVL ?? '점검중',
            지수결정물질: AIR_IDX_MAIN ?? '점검중',
            등급메세지: AIR_MSG ?? '점검중',
          };

          // 도로 정보
          const avgRoadData =
            output['ROAD_TRAFFIC_STTS']['AVG_ROAD_DATA'] ?? '점검중';
          // const roadTrafficStts = output['ROAD_TRAFFIC_STTS']['ROAD_TRAFFIC_STTS'] ?? '점검중';

          //   버스 정보 전체
          const busData = output['BUS_STN_STTS']['BUS_STN_STTS'] ?? '점검중';

          const cacheList = [
            this.saveAreaPopData(AREA_NM, areaPopData),
            this.saveAvgRoadData(AREA_NM, avgRoadData),
            this.saveAreaWeatherData(AREA_NM, areaWeatherData),
            this.saveAreaAirData(AREA_NM, areaAirData),
            // 상세 정보 현재 미사용으로 주석 처리
            // this.saveRoadTrafficStts(AREA_NM, roadTrafficStts),
            this.saveBusData(AREA_NM, busData),
          ];
          Promise.all(cacheList);
        }
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          this.dataCache(rawDatas);
        }, 100000);
      }
    });
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

  async saveSeoulAirData() {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.AIR_KEY}/xml/ListAirQualityByDistrictService/1/25/`;
    const stream = this.httpService.get(encodeURI(url));
    const rawData = await lastValueFrom(stream);

    const datas = JSON.parse(
      convert.xml2json(rawData.data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    )['ListAirQualityByDistrictService']['row'];

    for (const data of datas) {
      const GU_CODE = data['MSRSTENAME'];
      const airData = {
        이산화질소: data['NITROGEN'],
        오존농도: data['OZONE'],
        일산화탄소: data['CARBON'],
        아황산가스: data['SULFUROUS'],
      };
      await this.cacheManager.set(
        `AIR_ADDITION_${GU_CODE}`,
        JSON.stringify(airData),
      );
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

  async findAllWeather() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`WEATHER_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    return { result };
  }

  async findAllAir() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`AIR_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    return { result };
  }

  async findOneWeather(placeId: string) {
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

  async findRoads(placeId: string) {
    const result = JSON.parse(
      await this.cacheManager.get(`ROAD_TRAFFIC_${placeId}`),
    );
    if (!result) throw new HttpException('wrong place name', 404);
    else return { result };
  }

  async findAllBuses(placeId: string) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    for (const busData of data) {
      delete busData.BUS_DETAIL;
    }

    return data;
  }

  async findBus(placeId: string, busId: number) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    const resultData = data.find((obj: any) => obj.BUS_STN_ID === busId);

    if (!resultData) throw new HttpException('wrong busId', 404);

    return resultData;
  }
}
