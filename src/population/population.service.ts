import { Injectable } from '@nestjs/common';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@Injectable()
export class PopulationService {
  create(createPopulationDto: CreatePopulationDto) {
    return 'This action adds a new population';
  }

  findAll() {
    return `This action returns all population`;
  }

  findOne(id: number) {
    return `This action returns a #${id} population`;
  }

  update(id: number, updatePopulationDto: UpdatePopulationDto) {
    return `This action updates a #${id} population`;
  }

  remove(id: number) {
    return `This action removes a #${id} population`;
  }
}
