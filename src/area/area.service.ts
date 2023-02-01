import { Users } from 'src/entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AreaLike } from 'src/entities/AreaLike';
import { Repository, DataSource } from 'typeorm';
import { User_Like } from 'src/entities/User_Like';

@Injectable()
export class AreaService {
  constructor(
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
    const findOneAreaLikeCount = await this.userLikeRepository
      .createQueryBuilder('user_like')
      .leftJoinAndSelect('user_like.Area', 'areaLike')
      .where('user_like.Area = :areaLike_id', {
        areaLike_id: isArea.areaLike_id,
      })
      .getCount();

    isArea.likeCnt = findOneAreaLikeCount;
    return isArea;
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
