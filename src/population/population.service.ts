import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
import { PopulationDto } from './dto/findall-population.dto';
import { Cache } from 'cache-manager';
// import { CreatePopulationDto } from './dto/create-population.dto';
// import { UpdatePopulationDto } from './dto/update-population.dto';

@Injectable()
export class PopulationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(placeId: string) {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.POP_API_KEY}/xml/citydata/1/5/${placeId}`;

    const rawData = await this.httpService.get(encodeURI(url)).toPromise();
    const data: PopulationDto = JSON.parse(
      convert.xml2json(rawData.data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    );

    await this.cacheManager.set('test', JSON.stringify(data));
    const test = JSON.parse(await this.cacheManager.get('test'));
    console.log(test);
    // return test

    if (!data['SeoulRtd.citydata'])
      throw new HttpException('wrong place name', 404);
    else return data['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;
  }
}

// findOne(id: number) {
//   return `This action returns a #${id} population`;
// }

// create(createPopulationDto: CreatePopulationDto) {
//   return 'This action adds a new population';
// }
// update(id: number, updatePopulationDto: UpdatePopulationDto) {
//   return `This action updates a #${id} population`;
// }

// remove(id: number) {
//   return `This action removes a #${id} population`;
// }
