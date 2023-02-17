import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import areaList from '../common/area-list';

import { SeoulAirInfo } from 'src/entities/seoulAirInfo';

import {
  PublicOpenApiService,
  PopulationAdapterService,
  WeatherAdapterService,
  AirQualityAdapterService,
  RoadConditionAdapterService,
  DetailAirQualityAdapterService,
  DatabaseCacheService,
} from './services';

@Injectable()
export class SeoulService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly publicOpenApiService: PublicOpenApiService,
    private readonly populationAdapterService: PopulationAdapterService,
    private readonly weatherAdapterService: WeatherAdapterService,
    private readonly airQualityAdapterService: AirQualityAdapterService,
    private readonly roadConditionAdapterService: RoadConditionAdapterService,
    private readonly detailAirQualityAdapterService: DetailAirQualityAdapterService,
    private readonly databaseCacheService: DatabaseCacheService,
    @InjectRepository(SeoulAirInfo)
    private seoulAirRepository: Repository<SeoulAirInfo>,
  ) {}

  public async saveAreaData() {
    const xmls = await this.publicOpenApiService.getAllAreaData();

    for (const xml of xmls) {
      const population = await this.populationAdapterService.adapt(xml);
      const weather = this.weatherAdapterService.adapt(xml);
      const airQuality = this.airQualityAdapterService.adapt(xml);
      const roadCondition = this.roadConditionAdapterService.adapt(xml);

      const cacheActions = [];

      // 인구 정보 캐싱 (정보 없으면 캐싱 안함)
      if (population) {
        cacheActions.push(
          this.cacheManager.set(
            `POPULATION_${population.areaName}`,
            JSON.stringify(population),
          ),
        );
      }

      // 날씨 정보 캐싱 (정보 없으면 캐싱 안함)
      if (weather) {
        cacheActions.push(
          this.cacheManager.set(
            `WEATHER_${weather.areaName}`,
            JSON.stringify(weather),
          ),
        );
      }

      // 대기 정보 캐싱 (정보 없으면 캐싱 안함)
      if (airQuality) {
        cacheActions.push(
          this.cacheManager.set(
            `AIR_${airQuality.areaName}`,
            JSON.stringify(airQuality),
          ),
        );
      }

      // 도로 정보 캐싱 (정보 없으면 캐싱 안함)
      if (roadCondition) {
        cacheActions.push(
          this.cacheManager.set(
            `ROAD_AVG_${roadCondition.areaName}`,
            JSON.stringify(roadCondition),
          ),
        );
      }

      await Promise.all(cacheActions);
    }
  }

  public async saveSeoulAirData() {
    const xml = await this.publicOpenApiService.getDetailAirQuality();
    const data = this.detailAirQualityAdapterService.adapt(xml);

    for (const datum of data) {
      const guName = datum['guName'];

      // Redis에 저장
      await this.cacheManager.set(
        `AIR_ADDITION_${guName}`,
        JSON.stringify(datum),
      );

      // MySQL에 저장
      await this.seoulAirRepository.save({
        guName: guName,
        cache: JSON.stringify(datum),
      });
    }
  }

  /**
   * 캐시된 데이터 DB에 저장
   */
  public async saveCachedData() {
    for (const area of areaList) {
      const areaName = area['AREA_NM'];

      await Promise.all([
        this.databaseCacheService.saveCachedPopulation(areaName),
        this.databaseCacheService.saveCachedWeather(areaName),
        this.databaseCacheService.saveCachedAirQuality(areaName),
        this.databaseCacheService.saveCachedRoadCondition(areaName),
      ]);
    }
  }
}
