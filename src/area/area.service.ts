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
import crowdPicConverter from '../common/functions/pic.converter';

@Injectable()
export class AreaService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AreaLike)
    private areaLikeRepository: Repository<AreaLike>,
    @InjectRepository(User_Like)
    private userLikeRepository: Repository<User_Like>,
    private dataSource: DataSource,
  ) {}

  async findAllAreas() {
    const result = await this.areaLikeRepository.find();
    return result;
  }

  async findOneAreas(areaName: string) {
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
    const popData = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );
    const weather = JSON.parse(
      await this.cacheManager.get(`WEATHER_${areaName}`),
    );
    const road = JSON.parse(
      await this.cacheManager.get(`ROAD_AVG_${areaName}`),
    );

    const result = {
      ...isArea,
      likeCnt: findOneAreaLikeCount,
      congestLvl: popData['AREA_CONGEST_LVL'],
      weather: weather['PCP_MSG'],
      air: weather['AIR_IDX'],
      road: road['ROAD_TRAFFIC_IDX'],
    };
    return result;
  }

  async findAreaPop(areaName: string) {
    const data = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );
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
  }

  async findAreaWeather(areaName: string) {
    const data = JSON.parse(await this.cacheManager.get(`WEATHER_${areaName}`));
    const weather = data['PRECPT_TYPE'];
    let img = '';
    if (weather === '없음') {
      img = process.env.WEATHER_NORMAL;
    } else if (weather === '비') {
      img = process.env.WEATHER_RANIY;
    } else {
      img = process.env.WEATHER_SNOWY;
    }

    const result = {
      WEATHER_IMG: img,
      ...data,
    };

    return result;
  }

  async findAreaAir(areaName: string) {
    const guCode = await this.areaLikeRepository.findOne({
      where: { AREA_NM: areaName },
      select: { GU_CODE: true },
    });
    const data1 = JSON.parse(await this.cacheManager.get(`AIR_${areaName}`));
    const data2 = JSON.parse(
      await this.cacheManager.get(`AIR_ADDITION_${guCode.GU_CODE}`),
    );

    const airLvl = data1['AIR_IDX'];
    let img = '';
    if (airLvl === '좋음') {
      img = process.env.AIR_LVL1;
    } else if (airLvl === '보통') {
      img = process.env.AIR_LVL2;
    } else if (airLvl === '나쁨') {
      img = process.env.AIR_LVL3;
    } else if (airLvl === '매우 나쁨') {
      img = process.env.AIR_LVL4;
    } else {
      img = process.env.AIR_MAINTENANCE;
    }

    const result = {
      AIR_IMG: img,
      ...data1,
      ...data2,
    };

    return result;
  }

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
