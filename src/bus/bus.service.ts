import { Injectable } from '@nestjs/common';

@Injectable()
export class BusService {
  findAll() {
    return `This action returns all bus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bus`;
  }
}
