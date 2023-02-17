import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { Users } from 'src/entities/Users';
import { AreaLike } from 'src/entities/AreaLike';
import { User_Like } from 'src/entities/User_Like';

import {
  PopulationService,
  WeatherService,
  AirQualityService,
  RoadConditionService,
} from './services';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(AreaLike)
    private readonly areaLikeRepository: Repository<AreaLike>,
    @InjectRepository(User_Like)
    private readonly userLikeRepository: Repository<User_Like>,
    private readonly populationService: PopulationService,
    private readonly weatherService: WeatherService,
    private readonly airQualityService: AirQualityService,
    private readonly roadConditionService: RoadConditionService,
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

    const population = await this.populationService.get(areaName);
    const weather = await this.weatherService.get(areaName);
    const air = await this.airQualityService.get(areaName);
    const road = await this.roadConditionService.get(areaName);

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
   * 지역 인구 데이터 조회
   */
  public async getAreaPopulation(areaName: string) {
    const areaLike = await this.getAreaLike(areaName);
    const population = await this.populationService.get(areaName);

    // DB에 저장된 지역에 포함되는 동 이름 호출
    const dong = JSON.parse(areaLike.DONG_CODE);

    // 민수님 요청으로 과거 인구 이력 없이 현재 시각 기준 다음 12시간 내 예상 인구 조회
    population.POP_RECORD = await this.populationService.getPredicted(dong, 12);

    const crowdLevel = population.AREA_CONGEST_LVL;
    const crowdLevelImage =
      this.populationService.getCrowdLevelImageUrl(crowdLevel);

    const result = {
      POP_IMG: crowdLevelImage,
      ...population,
    };

    return result;
  }

  /**
   * 지역 날씨 정보 조회
   */
  public async getAreaWeather(areaName: string) {
    const weather = await this.weatherService.get(areaName);

    const result = {
      날씨이미지: this.weatherService.getWeatherImageUrl(weather['강수형태']),
      ...weather,
    };

    return result;
  }

  /**
   * 지역 대기환경 조회
   */
  public async getAreaAirQuality(areaName: string) {
    const areaLike = await this.getAreaLike(areaName);
    const airQuality = await this.airQualityService.get(areaName);
    const detailAreaAirQuality = await this.airQualityService.getDetail(
      areaLike.GU_CODE,
    );

    const result = {
      대기환경이미지: this.airQualityService.getAirQualityLevelImageUrl(
        airQuality['대기환경등급'],
      ),
      ...airQuality,
      ...detailAreaAirQuality,
    };

    return result;
  }

  /**
   * 지역 좋아요 기능
   */
  @Transactional()
  public async likeArea(user: Users, areaName: string) {
    const areaLike = await this.getAreaLike(areaName);
    const userLike = await this.userLikeRepository.findOne({
      where: {
        areaLike_id: areaLike.areaLike_id,
        user_id: user.id,
      },
    });

    if (userLike) {
      throw new BadRequestException('이미 좋아요를 헀습니다.');
    }

    const foundUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    const data = await this.userLikeRepository.save({
      Area: areaLike,
      User: foundUser,
    });

    return data;
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
}
