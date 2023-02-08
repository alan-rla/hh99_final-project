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
import { InjectRepository } from '@nestjs/typeorm';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { Repository } from 'typeorm';

@Injectable()
export class SeoulService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(SeoulAirInfo)
    private seoulAirRepository: Repository<SeoulAirInfo>,
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
            time: CURRENT_POP_DATA['PPLTN_TIME'] + ':00',
            // congestion: CURRENT_POP_DATA['AREA_CONGEST_LVL'],
            // population: `${CURRENT_POP_DATA['AREA_PPLTN_MIN']}~${CURRENT_POP_DATA['AREA_PPLTN_MAX']}명`,
            population: CURRENT_POP_DATA['AREA_PPLTN_MAX'],
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

          let forecast = [];
          if (weather['FCST24HOURS']['FCST24HOURS']) {
            for (const data of weather['FCST24HOURS']['FCST24HOURS']) {
              const result = {
                예보시간: data['FCST_DT'].toString().substring(8, 10) + '시',
                기온: data['TEMP'],
                강수량: data['PRECIPITATION'],
                강수형태: data['PRECPT_TYPE'],
                강수확률: data['RAIN_CHANCE'],
                날씨: data['SKY_STTS'],
              };

              forecast.push(result);
            }
          } else {
            forecast = ['점검중'];
          }

          const weatherData = {
            날씨집계시간: weather['WEATHER_TIME'] ?? '점검중',
            기온: weather['TEMP'] ?? '점검중',
            체감기온: weather['SENSIBLE_TEMP'] ?? '점검중',
            최고기온: weather['MAX_TEMP'] ?? '점검중',
            최저기온: weather['MIN_TEMP'] ?? '점검중',
            습도: weather['HUMIDITY'] ?? '점검중',
            풍향: weather['WIND_DIRCT'] ?? '점검중',
            풍속: weather['WIND_SPD'] ?? '점검중',
            강수량: weather['PRECIPITATION'] ?? '점검중',
            강수형태: weather['PRECPT_TYPE'] ?? '점검중',
            강수메세지: weather['PCP_MSG'] ?? '점검중',
            일출: weather['SUNRISE'] ?? '점검중',
            일몰: weather['SUNSET'] ?? '점검중',
            자외선단계: weather['UV_INDEX_LVL'] ?? '점검중',
            자외선지수: weather['UV_INDEX'] ?? '점검중',
            자외선메세지: weather['UV_MSG'] ?? '점검중',
            일기예보: forecast,
          };

          // 날씨 정보
          const areaWeatherData = weatherData;

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

          const cacheList = [
            this.saveAreaPopData(AREA_NM, areaPopData),
            this.saveAvgRoadData(AREA_NM, avgRoadData),
            this.saveAreaWeatherData(AREA_NM, areaWeatherData),
            this.saveAreaAirData(AREA_NM, areaAirData),
          ];
          Promise.all(cacheList);
        }
      } catch (err) {
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
      const guName = data['MSRSTENAME'];
      // API 응답 데이터가 점검중이 아닐 경우에만 데이터 저장
      if (data['NITROGEN'] !== '점검중') {
        const airData = {
          NITROGEN: data['NITROGEN'],
          OZONE: data['OZONE'],
          CARBON: data['CARBON'],
          SULFUROUS: data['SULFUROUS'],
        };
        // Redis에 저장
        await this.cacheManager.set(
          `AIR_ADDITION_${guName}`,
          JSON.stringify(airData),
        );
        // MySQL에 저장
        await this.seoulAirRepository.save({
          guName: guName,
          NITROGEN: data['NITROGEN'],
          OZONE: data['OZONE'],
          CARBON: data['CARBON'],
          SULFUROUS: data['SULFUROUS'],
        });
      }
    }
  }
}
