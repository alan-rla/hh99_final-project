import { Users } from 'src/entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AreaLike } from 'src/entities/AreaLike';
import { Repository, DataSource, In } from 'typeorm';
import { User_Like } from 'src/entities/User_Like';
import { Cache } from 'cache-manager';
import { PopPredict } from 'src/entities/PopPredict';
import dayjs from 'dayjs';
import { SeoulAirInfo } from 'src/entities/seoulAirInfo';
import { SeoulWeatherInfo } from 'src/entities/seoulWeatherInfo';
import { SeoulRoadInfo } from 'src/entities/seoulRoadInfo';
import { SeoulPopInfo } from 'src/entities/seoulPopInfo';
import { SeoulPMInfo } from 'src/entities/seoulPMInfo';

@Injectable()
export class AreaService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AreaLike)
    private areaLikeRepository: Repository<AreaLike>,
    @InjectRepository(User_Like)
    private userLikeRepository: Repository<User_Like>,
    @InjectRepository(PopPredict)
    private popPredictRepository: Repository<PopPredict>,
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
    private dataSource: DataSource,
  ) {}

  /**
   * 지역 전체 조회
   */
  public async getAllAreas(): Promise<AreaLike[]> {
    const result = await this.areaLikeRepository.find();

    return result;
  }

  /**
   * 지역 단건 조회 (좋아요 합계, 인구, 날씨, 도로 실시간 데이터 취합)
   */
  public async getArea(areaName: string) {
    const areaLike = await this.getAreaLike(areaName);
    const areaLikeCount = await this.getAreaLikeCount(areaLike.areaLike_id);
    const population = await this.getPopulation(areaName);
    const weather = await this.getWeather(areaName);
    const air = await this.getAirQuality(areaName);
    const road = await this.getRoadCondition(areaName);

    const result = {
      ...areaLike,
      likeCnt: areaLikeCount,
      congestLvl: population['AREA_CONGEST_LVL'],
      weather: weather['강수메세지'],
      air: air['대기환경등급'],
      road: road['ROAD_TRAFFIC_IDX'],
      areaVid: process.env.AREA_VID,
    };

    return result;
  }

  /**
   * 특정 지역 이름으로 지역 정보 조회
   */
  private async getAreaLike(areaName: string): Promise<AreaLike> {
    const areaLike = await this.areaLikeRepository.findOne({
      where: { AREA_NM: areaName },
    });

    if (!areaLike) {
      throw new HttpException('There is no place.', 404);
    }

    return areaLike;
  }

  /**
   * 특정 지역 좋아요 개수 조회
   */
  private async getAreaLikeCount(areaLikeId: number): Promise<number> {
    return this.userLikeRepository.count({
      where: { areaLike_id: areaLikeId },
    });
  }

  /**
   * 특정 지역 인구 데이터 요약 정보 조회 및 캐싱
   */
  private async getPopulation(areaName: string): Promise<any> {
    let popData = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );
    if (!popData) {
      // 캐싱된 데이터가 없으므로 DB에서 조회
      const dbCache = await this.seoulPopRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['cache'],
      });
      popData = JSON.parse(dbCache.cache);

      // 다음번 조회를 위해 Redis 캐싱
      await this.cacheManager.set(`POPULATION_${areaName}`, dbCache.cache);
    }

    return popData;
  }

  /**
   * 특정 지역 날씨 정보 조회 및 캐싱
   */
  private async getWeather(areaName: string): Promise<any> {
    let weather = JSON.parse(
      await this.cacheManager.get(`WEATHER_${areaName}`),
    );
    if (!weather) {
      // 캐싱된 데이터가 없으므로 DB에서 조회
      const dbCache = await this.seoulWeatherRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['cache'],
      });
      weather = JSON.parse(dbCache.cache);

      // 다음번 조회를 위해 Redis 캐싱
      await this.cacheManager.set(`WEATHER_${areaName}`, dbCache.cache);
    }

    return weather;
  }

  /**
   * 특정 지역 대기 환경 정보 조회 및 캐싱
   */
  private async getAirQuality(areaName: string): Promise<any> {
    let air = JSON.parse(await this.cacheManager.get(`AIR_${areaName}`));

    // air가 없는 경우는 도시데이터 API에서 '점검중' 반환 또는 응답값 자체가 없을 때
    if (!air) {
      // 캐싱된 데이터가 없으므로 DB에서 조회
      const dbCache = await this.seoulPMRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['cache'],
      });
      air = JSON.parse(dbCache.cache);

      // 다음번 조회를 위해 Redis 캐싱
      await this.cacheManager.set(`AIR_${areaName}`, dbCache.cache);
    }

    return air;
  }

  /**
   * 특정 지역 도로 상태 정보 조회 및 캐싱
   */
  private async getRoadCondition(areaName: string): Promise<any> {
    let road = JSON.parse(await this.cacheManager.get(`ROAD_AVG_${areaName}`));

    if (!road) {
      // 캐싱된 데이터가 없으므로 DB에서 조회
      const dbCache = await this.seoulRoadRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['cache'],
      });
      road = JSON.parse(dbCache.cache);

      // 다음번 조회를 위해 Redis 캐싱
      await this.cacheManager.set(`AIR_${areaName}`, dbCache.cache);
    }

    return road;
  }

  /**
   * 지역 인구 데이터 조회
   */
  public async getAreaPopulation(areaName: string) {
    const areaLike = await this.getAreaLike(areaName);

    // DB에 저장된 지역에 포함되는 동 이름 호출
    const dong = JSON.parse(areaLike.DONG_CODE);

    const population = await this.getPopulation(areaName);

    // 민수님 요청으로 과거 인구 이력 없이 현재 시각 기준 다음 12시간 내 예상 인구 조회
    population.POP_RECORD = await this.getFuturePopulation(dong, 12);

    const crowdLevel = population.AREA_CONGEST_LVL;
    const crowdLevelImage = this.getCrowdLevelImage(crowdLevel);

    const result = {
      POP_IMG: crowdLevelImage,
      ...population,
    };

    return result;
  }

  /**
   * 미래 n시간 내 예상 인구 정보 조회
   */
  private async getFuturePopulation(dong: any, hours: number) {
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

  private getCrowdLevelImage(crowdLevel: string): string {
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

  /**
   * 지역 날씨 정보 조회
   */
  public async getAreaWeather(areaName: string) {
    const weather = await this.getWeather(areaName);

    // 캐시에도, DB에도 없으면 장소명 틀린것
    if (!weather) {
      throw new HttpException('wrong place name', 404);
    }

    const result = {
      날씨이미지: this.getWeatherImage(weather['강수형태']),
      ...weather,
    };

    return result;
  }

  private getWeatherImage(weather: string): string {
    if (weather === '없음') {
      return process.env.WEATHER_NORMAL;
    } else if (weather === '비') {
      return process.env.WEATHER_RANIY;
    } else {
      return process.env.WEATHER_SNOWY;
    }
  }

  /**
   * 지역 대기환경 조회
   */
  public async getAreaAirQuality(areaName: string) {
    const areaLike = await this.getAreaLike(areaName);

    const airQuality = await this.getAirQuality(areaName);
    const detailAreaAirQuality = await this.getDetailAreaAirQuality(
      areaLike.GU_CODE,
    );

    const result = {
      대기환경이미지: this.getAirQualityLevelImage(airQuality['대기환경등급']),
      ...airQuality,
      ...detailAreaAirQuality,
    };

    return result;
  }

  /**
   * 특정 상세 지역 대기 환경 정보 조회 및 캐싱
   */
  private async getDetailAreaAirQuality(guCode: string): Promise<any> {
    let additionalAirQuality = JSON.parse(
      await this.cacheManager.get(`AIR_ADDITION_${guCode}`),
    );

    // additionalAirQuality가 없는 경우 = 대기환경 API에서 '점검중' 값을 반환해 저장 안한 경우
    if (!additionalAirQuality) {
      // 캐싱된 데이터가 없으므로 DB에서 조회
      const dbCache = await this.seoulAirRepository.findOne({
        where: { guName: guCode },
        select: ['cache'],
      });
      additionalAirQuality = JSON.parse(dbCache.cache);

      // 다음번 조회를 위해 Redis 캐싱
      await this.cacheManager.set(`AIR_ADDITION_${guCode}`, dbCache.cache);
    }

    return additionalAirQuality;
  }

  private getAirQualityLevelImage(airQualityLevel: string): string {
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

  /**
   * 지역 좋아요 기능
   */
  public async likeArea(user: Users, areaName: string) {
    const isArea = await this.areaLikeRepository.findOne({
      where: { AREA_NM: areaName },
    });

    const isAreaLikeUser = await this.userLikeRepository
      .createQueryBuilder('user_like')
      .leftJoinAndSelect('user_like.User', 'users')
      .leftJoinAndSelect('user_like.Area', 'areaLike')
      .where('user_like.User = :user_id', { user_id: user.id })
      .andWhere('user_like.Area = :areaLike_id', {
        areaLike_id: isArea.areaLike_id,
      })
      .getOne();

    if (isAreaLikeUser) {
      throw new BadRequestException('이미 좋아요를 헀습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findUser = await queryRunner.manager.getRepository(Users).findOne({
        where: { id: user.id },
      });

      const findArea = await queryRunner.manager
        .getRepository(AreaLike)
        .findOne({
          where: { AREA_NM: areaName },
        });

      const data = await queryRunner.manager.getRepository(User_Like).save({
        Area: findArea,
        User: findUser,
      });

      await queryRunner.commitTransaction();
      return data;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
