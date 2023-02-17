import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { SeoulPMInfo } from 'src/entities/seoulPMInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';

@Injectable()
export class DatabaseCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(SeoulWeatherInfo)
    private seoulWeatherRepository: Repository<SeoulWeatherInfo>,
    @InjectRepository(SeoulRoadInfo)
    private seoulRoadRepository: Repository<SeoulRoadInfo>,
    @InjectRepository(SeoulPopInfo)
    private seoulPopRepository: Repository<SeoulPopInfo>,
    @InjectRepository(SeoulPMInfo)
    private seoulPMRepository: Repository<SeoulPMInfo>,
  ) {}

  public async saveCachedPopulation(areaName: string) {
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

  public async saveCachedWeather(areaName: string) {
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

  public async saveCachedAirQuality(areaName: string) {
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

  public async saveCachedRoadCondition(areaName: string) {
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
