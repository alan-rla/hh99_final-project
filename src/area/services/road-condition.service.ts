import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { SeoulRoadInfo } from '../../entities/seoulRoadInfo';

@Injectable()
export class RoadConditionService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(SeoulRoadInfo)
    private readonly seoulRoadRepository: Repository<SeoulRoadInfo>,
  ) {}

  /**
   * 특정 지역 도로 상태 정보 조회 및 캐싱
   */
  public async get(areaName: string): Promise<any> {
    const cachedRoad = JSON.parse(
      await this.cacheManager.get(`ROAD_AVG_${areaName}`),
    );

    if (cachedRoad) {
      return cachedRoad;
    }

    // 캐싱된 데이터가 없으므로 DB에서 조회
    const road = await this.seoulRoadRepository.findOne({
      where: { AREA_NM: areaName },
      select: ['cache'],
    });

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!road) {
      throw new HttpException('wrong place name', 404);
    }

    // 다음번 조회를 위해 Redis 캐싱
    await this.cacheManager.set(`ROAD_AVG_${areaName}`, road.cache);

    return JSON.parse(road.cache);
  }
}
