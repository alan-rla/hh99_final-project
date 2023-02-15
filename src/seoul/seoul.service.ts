import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import convert from 'xml-js';
import dayjs from 'dayjs';

import areaList from '../common/area-list';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';

import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

import { PopulationDto } from './dto/population.dto';

@Injectable()
export class SeoulService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(SeoulAirInfo)
    private seoulAirRepository: Repository<SeoulAirInfo>,
    @InjectRepository(SeoulWeatherInfo)
    private seoulWeatherRepository: Repository<SeoulWeatherInfo>,
    @InjectRepository(SeoulRoadInfo)
    private seoulRoadRepository: Repository<SeoulRoadInfo>,
    @InjectRepository(SeoulPopInfo)
    private seoulPopRepository: Repository<SeoulPopInfo>,
    @InjectRepository(SeoulPMInfo)
    private seoulPMRepository: Repository<SeoulPMInfo>,
  ) {}

  public async saveAreaData() {
    const data = await this.getAllAreaData();

    for (const datum of data) {
      await this.cacheData(datum);
    }
  }

  public async saveSeoulAirData() {
    const xml = await this.getDetailAirQuality();
    const json = this.convertXmlToJson(xml);
    const rows = json['ListAirQualityByDistrictService']['row'];

    for (const row of rows) {
      const guName = row['MSRSTENAME'];
      const data = this.parseSeoulAirQuality(row);

      if (!data) {
        continue;
      }

      // Redis에 저장
      await this.cacheManager.set(
        `AIR_ADDITION_${guName}`,
        JSON.stringify(data),
      );

      // MySQL에 저장
      await this.seoulAirRepository.save({
        guName: guName,
        cache: JSON.stringify(data),
      });
    }
  }

  private convertXmlToJson(data: string) {
    return JSON.parse(
      convert.xml2json(data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    );
  }

  private parseSeoulAirQuality(row: any) {
    // API 응답 데이터가 점검중이 아닐 경우에만 데이터 저장
    if (row['NITROGEN'] === '점검중') {
      return;
    }

    const airData = {
      NITROGEN: row['NITROGEN'],
      OZONE: row['OZONE'],
      CARBON: row['CARBON'],
      SULFUROUS: row['SULFUROUS'],
    };

    return airData;
  }

  /**
   * 캐시된 데이터 DB에 저장
   */
  public async saveCachedData() {
    for (const area of areaList) {
      const areaName = area['AREA_NM'];

      await Promise.all([
        this.saveCachedPopulation(areaName),
        this.saveCachedWeather(areaName),
        this.saveCachedAirQuality(areaName),
        this.saveCachedRoadCondition(areaName),
      ]);
    }
  }

  private async cacheData(rawData: string) {
    const rawOutput = this.convertXmlToJson(rawData);

    // 도시데이터 API 응답 값 없으면 continue
    if (!rawOutput['SeoulRtd.citydata']['CITYDATA']) {
      return;
    }

    // 0 원본 데이터 선언
    const output = rawOutput['SeoulRtd.citydata']['CITYDATA'];
    // 1.1 저장용 지역 이름 선언
    const areaName = output['AREA_NM'];

    const populationData = output['LIVE_PPLTN_STTS']['LIVE_PPLTN_STTS'];

    // 인구 정보 캐싱 (정보 없으면 캐싱 안함)
    if (populationData) {
      const population = this.parsePopulation(areaName, populationData);

      await this.cacheManager.set(
        `POPULATION_${areaName}`,
        JSON.stringify(population),
      );
    }

    const weatherData = output['WEATHER_STTS']['WEATHER_STTS'];

    // 날씨/대기 정보 캐싱 (정보 없으면 캐싱 안함)
    if (weatherData) {
      const weather = this.parseWeather(weatherData);

      // 날씨 정보 캐싱
      await this.cacheManager.set(
        `WEATHER_${areaName}`,
        JSON.stringify(weather),
      );

      const airQuality = this.parseAirQuality(areaName, weatherData);

      // 대기 정보 캐싱
      if (airQuality) {
        await this.cacheManager.set(
          `AIR_${areaName}`,
          JSON.stringify(airQuality),
        );
      }
    }

    const roadConditionData = output['ROAD_TRAFFIC_STTS']['AVG_ROAD_DATA'];

    // 도로 정보 캐싱 (정보 없으면 캐싱 안함)
    if (roadConditionData) {
      await this.cacheManager.set(
        `ROAD_AVG_${areaName}`,
        JSON.stringify(roadConditionData),
      );
    }
  }

  private async parsePopulation(areaName: string, populationData: any) {
    // 1.2 비교 및 저장용 현재 인구 정보 선언
    // 1.3 도시데이터 API에서 불러온 인구 정보의 시간 선언 (시간 비교 용도)
    const CURRENT_TIME = dayjs(populationData['PPLTN_TIME']);
    // 1.4 과거 인구 이력(POP_RECORD) 저장용 객체 선언
    const CURRENT_POP_RECORD = {
      time: populationData['PPLTN_TIME'] + ':00',
      population: populationData['AREA_PPLTN_MAX'],
    };

    // 1.5 현재 REDIS 저장된 인구 정보 호출 (없으면 PAST_DATA = null)
    const PAST_DATA: PopulationDto = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );
    let POP_RECORD: object[] = [];

    // 2.1 REDIS 저장된 정보 있을 시 시간을 비교해 데이터 업데이트
    if (PAST_DATA) {
      // 2.2 인구 과거 이력 불러오기
      const PAST_POP_RECORD = PAST_DATA['POP_RECORD'];
      POP_RECORD = [...PAST_POP_RECORD];
      // 2.3 저장되어있는 인구 정보 시간 선언
      const PAST_TIME = dayjs(PAST_DATA['PPLTN_TIME']);
      // 2.4 도시데이터에서 불러온 인구 데이터가 REDIS에 저장된 인구 데이터의 다음 시간대일 경우
      // (eg. 호출된 데이터 시간 13시 00분, 저장된 데이터 12시 50분)
      // 인구 이력에 저장시키기 (인구 이력에 현재 인구수도 저장시키기 때문)
      if (CURRENT_TIME.isAfter(PAST_TIME, 'hour')) {
        POP_RECORD.push(CURRENT_POP_RECORD);
      } else {
        // 2.5 현재 인구 데이터 요약본이 같은 시간대면 업데이트 (eg. 12시 40분 vs 12시 50분)
        const lastRecordTime = dayjs(POP_RECORD[POP_RECORD.length - 1]['time']);
        if (CURRENT_TIME.isSame(lastRecordTime, 'hour')) {
          POP_RECORD.pop();
          POP_RECORD.push(CURRENT_POP_RECORD);
        }
      }

      // 2.6 12시간 초과 데이터는 삭제
      if (POP_RECORD.length > 12) {
        POP_RECORD.shift();
      }
    }
    // 2.7저장된 데이터 없으면 REDIS에 현재 인구 요약본 추가
    if (POP_RECORD.length === 0) {
      POP_RECORD.push(CURRENT_POP_RECORD);
    }
    // 2.8 인구 데이터 저장용 객체 선언
    const areaPopData = {
      AREA_NM: areaName,
      AREA_CONGEST_LVL: populationData['AREA_CONGEST_LVL'],
      AREA_CONGEST_MSG: populationData['AREA_CONGEST_MSG'],
      AREA_PPLTN_MIN: populationData['AREA_PPLTN_MIN'],
      AREA_PPLTN_MAX: populationData['AREA_PPLTN_MAX'],
      PPLTN_TIME: populationData['PPLTN_TIME'],
      POP_RECORD: POP_RECORD,
    };

    return areaPopData;
  }

  private parseWeather(weatherData: any) {
    const forecast = [];

    for (const data of weatherData['FCST24HOURS']['FCST24HOURS']) {
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

    const weather = {
      날씨집계시간: weatherData['WEATHER_TIME'],
      기온: weatherData['TEMP'],
      체감기온: weatherData['SENSIBLE_TEMP'],
      최고기온: weatherData['MAX_TEMP'],
      최저기온: weatherData['MIN_TEMP'],
      습도: weatherData['HUMIDITY'],
      풍향: weatherData['WIND_DIRCT'],
      풍속: weatherData['WIND_SPD'],
      강수량: weatherData['PRECIPITATION'],
      강수형태: weatherData['PRECPT_TYPE'],
      강수메세지: weatherData['PCP_MSG'],
      일출: weatherData['SUNRISE'],
      일몰: weatherData['SUNSET'],
      자외선단계: weatherData['UV_INDEX_LVL'],
      자외선지수: weatherData['UV_INDEX'],
      자외선메세지: weatherData['UV_MSG'],
      일기예보: forecast,
    };

    return weather;
  }

  private parseAirQuality(areaName: string, weatherData: any) {
    const {
      PM25_INDEX,
      PM25,
      PM10_INDEX,
      PM10,
      AIR_IDX,
      AIR_IDX_MVL,
      AIR_IDX_MAIN,
      AIR_MSG,
    } = weatherData;

    // 미세먼지 점검중이면 캐싱 안함
    if (PM25_INDEX !== '점검중') {
      return;
    }

    // 미세먼지 정보
    const areaAirData = {
      지역이름: areaName,
      초미세먼지지수: PM25_INDEX,
      초미세먼지: PM25,
      미세먼지지수: PM10_INDEX,
      미세먼지: PM10,
      대기환경등급: AIR_IDX,
      대기환경지수: AIR_IDX_MVL,
      지수결정물질: AIR_IDX_MAIN,
      등급메세지: AIR_MSG,
    };

    return areaAirData;
  }

  private async getAllAreaData(): Promise<string[]> {
    const apiKeys = [
      process.env.API_KEY_1,
      process.env.API_KEY_2,
      process.env.API_KEY_3,
      process.env.API_KEY_4,
      process.env.API_KEY_5,
    ];

    const responses = await Promise.all(
      Array.from({ length: 50 })
        .fill(null)
        .map((_, index) => {
          const apiKey = apiKeys[index % 5]; // 1~5번(0~4 index) 키를 번갈아 가며 사용
          const areaName = areaList[index]['AREA_NM'];

          return `http://openapi.seoul.go.kr:8088/${apiKey}/xml/citydata/1/50/${areaName}`;
        })
        .map(url =>
          lastValueFrom(this.httpService.get<string>(encodeURI(url))),
        ),
    );

    return responses.map(({ data }) => data);
  }

  private async getDetailAirQuality(): Promise<string> {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.AIR_KEY}/xml/ListAirQualityByDistrictService/1/25/`;
    const response = await lastValueFrom(
      this.httpService.get<string>(encodeURI(url)),
    );

    return response.data;
  }

  private async saveCachedPopulation(areaName: string) {
    const cachedPopulation = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );

    if (!cachedPopulation) {
      return;
    }

    await this.seoulPopRepository.save({
      AREA_NM: areaName,
      cache: JSON.stringify(cachedPopulation),
    });
  }

  private async saveCachedWeather(areaName: string) {
    const cachedWeather = JSON.parse(
      await this.cacheManager.get(`WEATHER_${areaName}`),
    );

    if (!cachedWeather) {
      return;
    }

    await this.seoulWeatherRepository.save({
      AREA_NM: areaName,
      cache: JSON.stringify(cachedWeather),
    });
  }

  private async saveCachedAirQuality(areaName: string) {
    const cachedAirQuality = JSON.parse(
      await this.cacheManager.get(`AIR_${areaName}`),
    );

    if (!cachedAirQuality) {
      return;
    }

    await this.seoulPMRepository.save({
      AREA_NM: areaName,
      cache: JSON.stringify(cachedAirQuality),
    });
  }

  private async saveCachedRoadCondition(areaName: string) {
    const cachedRoadCondition = JSON.parse(
      await this.cacheManager.get(`ROAD_AVG_${areaName}`),
    );

    if (!cachedRoadCondition) {
      return;
    }

    await this.seoulRoadRepository.save({
      AREA_NM: areaName,
      cache: JSON.stringify(cachedRoadCondition),
    });
  }
}
