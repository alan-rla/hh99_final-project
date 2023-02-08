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
import { Repository, DataSource } from 'typeorm';
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

  //지역 전체 조회
  async findAllAreas() {
    const result = await this.areaLikeRepository.find();
    return result;
  }
  //지역 단건 조회 (좋아요 합계, 인구, 날씨, 도로 실시간 데이터 취합)
  async findOneAreas(areaName: string) {
    try {
      const isArea = await this.areaLikeRepository.findOne({
        where: { AREA_NM: areaName },
      });
      if (!isArea) throw new HttpException('wrong place name', 404);

      const findOneAreaLikeCount = await this.userLikeRepository
        .createQueryBuilder('user_like')
        .leftJoinAndSelect('user_like.Area', 'areaLike')
        .where('user_like.Area = :areaLike_id', {
          areaLike_id: isArea.areaLike_id,
        })
        .getCount();

      // 인구 데이터 요약 호출
      let popData = JSON.parse(
        await this.cacheManager.get(`POPULATION_${areaName}`),
      )['AREA_CONGEST_LVL'];
      if (!popData) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulPopRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        popData = JSON.parse(dbCache.cache)['AREA_CONGEST_LVL'];

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`POPULATION_${areaName}`, dbCache.cache);
      }

      // 날씨 데이터 요약 호출
      let weather = JSON.parse(
        await this.cacheManager.get(`WEATHER_${areaName}`),
      )['강수메세지'];
      if (!weather) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulWeatherRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        weather = JSON.parse(dbCache.cache)['강수메세지'];

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`WEATHER_${areaName}`, dbCache.cache);
      }

      // 대기환경 데이터 요약 호출
      let air = JSON.parse(await this.cacheManager.get(`AIR_${areaName}`))[
        '대기환경등급'
      ];
      if (!air) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulPMRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        air = JSON.parse(dbCache.cache)['대기환경등급'];

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`AIR_${areaName}`, dbCache.cache);
      }

      // 도로 데이터 요약 호출
      let road = JSON.parse(
        await this.cacheManager.get(`ROAD_AVG_${areaName}`),
      )['ROAD_TRAFFIC_IDX'];
      if (!road) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulRoadRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        road = JSON.parse(dbCache.cache)['대기환경등급'];

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`AIR_${areaName}`, dbCache.cache);
      }

      const areaVid = process.env.AREA_VID;

      const result = {
        ...isArea,
        likeCnt: findOneAreaLikeCount,
        congestLvl: popData,
        weather: weather,
        air: air,
        road: road,
        areaVid: areaVid,
      };
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  // 지역 인구 데이터 조회
  async findAreaPop(areaName: string) {
    try {
      // DB에 저장된 지역에 포함되는 동 이름 호출
      const dong_code = await this.areaLikeRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['DONG_CODE'],
      });
      if (!dong_code) throw new HttpException('wrong place name', 404);
      const dong = JSON.parse(dong_code['DONG_CODE']);

      let data = JSON.parse(
        await this.cacheManager.get(`POPULATION_${areaName}`),
      );

      if (!data) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulPopRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        data = JSON.parse(dbCache.cache);

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`POPULATION_${areaName}`, dbCache.cache);
      }

      // 다음 12시간 예상 인구를 찾기위해 현재 시간 호출
      const currentTime = dayjs(data['PPLTN_TIME'].substring(0, 14) + '00:00');

      for (let i = 1; i <= 12; i++) {
        // dayjs 메소드 + 반복문으로 다음 12시간 차례로 생성
        const futureTime = currentTime
          .add(i, 'hour')
          .format('YYYY-MM-DD HH:mm:ss');

        const rawData = await this.popPredictRepository.findOne({
          where: { 시간: futureTime },
          select: dong,
        });

        const pop = Math.ceil(
          Object.values(rawData).reduce((a, b) => a + b, 0),
        );
        data.POP_RECORD.push({ time: futureTime, population: pop });
      }

      const crowdLvl = data['AREA_CONGEST_LVL'];
      let img = '';
      if (crowdLvl === '여유') {
        img = process.env.CROWD_LVL1;
      } else if (crowdLvl === '보통') {
        img = process.env.CROWD_LVL2;
      } else if (crowdLvl === '약간 붐빔') {
        img = process.env.CROWD_LVL3;
      } else {
        img = process.env.CROWD_LVL4;
      }

      const result = {
        POP_IMG: img,
        ...data,
      };

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  //지역 날씨 조회
  async findAreaWeather(areaName: string) {
    try {
      let data = JSON.parse(await this.cacheManager.get(`WEATHER_${areaName}`));

      if (!data) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulWeatherRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        data = JSON.parse(dbCache.cache);

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`WEATHER_${areaName}`, dbCache.cache);
      }
      // 캐시에도, DB에도 없으면 장소명 틀린것
      if (!data) throw new HttpException('wrong place name', 404);

      const weather = data['강수형태'];
      let img = '';
      if (weather === '없음') {
        img = process.env.WEATHER_NORMAL;
      } else if (weather === '비') {
        img = process.env.WEATHER_RANIY;
      } else {
        img = process.env.WEATHER_SNOWY;
      }

      const result = {
        날씨이미지: img,
        ...data,
      };

      return result;
    } catch (err) {
      console.log(err);
    }
  }
  // 지역 대기환경 조회
  async findAreaAir(areaName: string) {
    try {
      const gu_code = await this.areaLikeRepository.findOne({
        where: { AREA_NM: areaName },
        select: ['GU_CODE'],
      });

      if (!gu_code) throw new HttpException('wrong place name', 404);

      let data1 = JSON.parse(await this.cacheManager.get(`AIR_${areaName}`));
      // data1이 없는 경우 = 도시데이터 API에서 '점검중' 반환 또는 응답값 자체가 없을 때
      if (!data1) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulPMRepository.findOne({
          where: { AREA_NM: areaName },
          select: ['cache'],
        });
        data1 = JSON.parse(dbCache.cache);

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(`AIR_${areaName}`, dbCache.cache);
      }

      let data2 = JSON.parse(
        await this.cacheManager.get(`AIR_ADDITION_${gu_code['GU_CODE']}`),
      );
      // data2가 없는 경우 = 대기환경 API에서 '점검중' 값을 반환해 저장 안한 경우
      if (!data2) {
        // 캐싱된 데이터가 없으므로 DB에서 조회
        const dbCache = await this.seoulAirRepository.findOne({
          where: { guName: gu_code['GU_CODE'] },
          select: ['cache'],
        });
        data2 = JSON.parse(dbCache.cache);

        // 다음번 조회를 위해 Redis 캐싱
        await this.cacheManager.set(
          `AIR_ADDITION_${gu_code['GU_CODE']}`,
          dbCache.cache,
        );
      }

      const airLvl = data1['대기환경등급'];
      let img = '';
      if (airLvl === '좋음') {
        img = process.env.AIR_LVL1;
      } else if (airLvl === '보통') {
        img = process.env.AIR_LVL2;
      } else if (airLvl === '나쁨') {
        img = process.env.AIR_LVL3;
      } else if (airLvl === '매우 나쁨') {
        img = process.env.AIR_LVL4;
      }

      const result = {
        대기환경이미지: img,
        ...data1,
        ...data2,
      };

      return result;
    } catch (err) {
      console.log(err);
    }
  }
  // 지역 좋아요 기능
  async likeArea(user: Users, areaName: string) {
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
