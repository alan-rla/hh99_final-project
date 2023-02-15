import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { In, Repository } from 'typeorm';
import dayjs from 'dayjs';

import { SeoulPopInfo } from '../../entities/seoulPopInfo';
import { PopPredict } from '../../entities/PopPredict';

@Injectable()
export class PopulationService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(SeoulPopInfo)
    private readonly seoulPopRepository: Repository<SeoulPopInfo>,
    @InjectRepository(PopPredict)
    private readonly popPredictRepository: Repository<PopPredict>,
  ) {}

  /**
   * 특정 지역 인구 데이터 요약 정보 조회 및 캐싱
   */
  public async get(areaName: string): Promise<any> {
    const cachedRawPopulation = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );

    if (cachedRawPopulation) {
      return cachedRawPopulation;
    }

    // 캐싱된 데이터가 없으므로 DB에서 조회
    const population = await this.seoulPopRepository.findOne({
      where: { AREA_NM: areaName },
      select: ['cache'],
    });

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!population) {
      throw new HttpException('wrong place name', 404);
    }

    // 다음번 조회를 위해 Redis 캐싱
    await this.cacheManager.set(`POPULATION_${areaName}`, population.cache);

    return JSON.parse(population.cache);
  }

  /**
   * 미래 n시간 내 예상 인구 정보 조회
   */
  public async getPredicted(dong: any, hours: number) {
    const currentTime = dayjs().startOf('hours');
    const nextHours = Array.from({ length: hours })
      .fill(null)
      .map((_, index) =>
        currentTime.add(index, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      );

    const populationPredictations = await this.popPredictRepository.find({
      where: { 시간: In(nextHours) },
      select: dong,
    });

    return populationPredictations.map(populationPredictation => {
      const pop = Math.ceil(
        Object.values(populationPredictation).reduce((a, b) => a + b, 0),
      );

      return { time: populationPredictation.시간, population: pop };
    });
  }

  public getCrowdLevelImageUrl(crowdLevel: string): string {
    if (crowdLevel === '여유') {
      return process.env.CROWD_LVL1;
    } else if (crowdLevel === '보통') {
      return process.env.CROWD_LVL2;
    } else if (crowdLevel === '약간 붐빔') {
      return process.env.CROWD_LVL3;
    } else {
      return process.env.CROWD_LVL4;
    }
  }
}
