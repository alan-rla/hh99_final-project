import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { SeoulWeatherInfo } from '../../entities/seoulWeatherInfo';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(SeoulWeatherInfo)
    private readonly seoulWeatherRepository: Repository<SeoulWeatherInfo>,
  ) {}

  /**
   * 특정 지역 날씨 정보 조회 및 캐싱
   */
  public async get(areaName: string): Promise<any> {
    const cachedWeather = JSON.parse(
      await this.cacheManager.get(`WEATHER_${areaName}`),
    );

    if (cachedWeather) {
      return cachedWeather;
    }

    // 캐싱된 데이터가 없으므로 DB에서 조회
    const weather = await this.seoulWeatherRepository.findOne({
      where: { AREA_NM: areaName },
      select: ['cache'],
    });

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!weather) {
      throw new HttpException('wrong place name', 404);
    }

    // 다음번 조회를 위해 Redis 캐싱
    await this.cacheManager.set(`WEATHER_${areaName}`, weather.cache);

    return JSON.parse(weather.cache);
  }

  public getWeatherImageUrl(weather: string): string {
    if (weather === '없음') {
      return process.env.WEATHER_NORMAL;
    } else if (weather === '비') {
      return process.env.WEATHER_RANIY;
    } else {
      return process.env.WEATHER_SNOWY;
    }
  }
}
