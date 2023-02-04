import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourist_Spot } from 'src/entities/Tourist_spot';
import { Repository } from 'typeorm';

@Injectable()
export class TourismService {
  constructor(
    @InjectRepository(Tourist_Spot)
    private tourist_SpotRepository: Repository<Tourist_Spot>,
  ) {}

  async findOneStateTourism(STATE_NM) {
    try {
      const data = await this.tourist_SpotRepository.find({
        where: { STATE_NM },
      });

      if (data.length === 0) {
        throw new BadRequestException('지역구 이름을 올바르게 입력하세요');
      }

      return data;
    } catch (err) {
      throw err;
    }
  }
}
