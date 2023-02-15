import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { SeoulAirInfo } from '../../entities/seoulAirInfo';
import { SeoulPMInfo } from '../../entities/seoulPMInfo';

@Injectable()
export class AirQualityService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(SeoulAirInfo)
    private seoulAirRepository: Repository<SeoulAirInfo>,
    @InjectRepository(SeoulPMInfo)
    private seoulPMRepository: Repository<SeoulPMInfo>,
  ) {}

  /**
   * 특정 지역 대기 환경 정보 조회 및 캐싱
   */
  public async get(areaName: string): Promise<any> {
    const cachedAirQuality = JSON.parse(
      await this.cacheManager.get(`AIR_${areaName}`),
    );

    // air가 없는 경우는 도시데이터 API에서 '점검중' 반환 또는 응답값 자체가 없을 때
    if (cachedAirQuality) {
      return cachedAirQuality;
    }

    // 캐싱된 데이터가 없으므로 DB에서 조회
    const airQuality = await this.seoulPMRepository.findOne({
      where: { AREA_NM: areaName },
      select: ['cache'],
    });

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!airQuality) {
      throw new HttpException('wrong place name', 404);
    }

    // 다음번 조회를 위해 Redis 캐싱
    await this.cacheManager.set(`AIR_${areaName}`, airQuality.cache);

    return JSON.parse(airQuality.cache);
  }

  /**
   * 특정 상세 지역 대기 환경 정보 조회 및 캐싱
   */
  public async getDetail(guCode: string): Promise<any> {
    const cachedAdditionalAirQuality = JSON.parse(
      await this.cacheManager.get(`AIR_ADDITION_${guCode}`),
    );

    // additionalAirQuality가 없는 경우 = 대기환경 API에서 '점검중' 값을 반환해 저장 안한 경우
    if (cachedAdditionalAirQuality) {
      return cachedAdditionalAirQuality;
    }

    // 캐싱된 데이터가 없으므로 DB에서 조회
    const additionalAirQuality = await this.seoulAirRepository.findOne({
      where: { guName: guCode },
      select: ['cache'],
    });

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!additionalAirQuality) {
      throw new HttpException('wrong place name', 404);
    }

    // 다음번 조회를 위해 Redis 캐싱
    await this.cacheManager.set(
      `AIR_ADDITION_${guCode}`,
      additionalAirQuality.cache,
    );

    return JSON.parse(additionalAirQuality.cache);
  }

  public getAirQualityLevelImageUrl(airQualityLevel: string): string {
    if (airQualityLevel === '좋음') {
      return process.env.AIR_LVL1;
    } else if (airQualityLevel === '보통') {
      return process.env.AIR_LVL2;
    } else if (airQualityLevel === '나쁨') {
      return process.env.AIR_LVL3;
    } else if (airQualityLevel === '매우 나쁨') {
      return process.env.AIR_LVL4;
    }
  }
}
