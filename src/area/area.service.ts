import { Injectable } from '@nestjs/common';
import areaList from 'src/common/area-list';

@Injectable()
export class AreaService {
  findAllAreas() {
    return { data: areaList };
  }
}
