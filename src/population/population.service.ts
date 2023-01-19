import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
import { PopulationDto } from './dto/findall-population.dto';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
// import { CreatePopulationDto } from './dto/create-population.dto';
// import { UpdatePopulationDto } from './dto/update-population.dto';

@Injectable()
export class PopulationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async find(placeId: string) {
    const test = JSON.parse(await this.cacheManager.get('test'));
    if (test) {
      const popData = test['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;
      return popData;
    }
    const url = `http://openapi.seoul.go.kr:8088/${process.env.POP_API_KEY}/xml/citydata/1/5/${placeId}`;
    const stream = this.httpService.get(encodeURI(url));
    const rawData = await lastValueFrom(stream);
    const data: PopulationDto = JSON.parse(
      convert.xml2json(rawData.data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    );

    await this.cacheManager.set('test', JSON.stringify(data));
    // const test = JSON.parse(await this.cacheManager.get('test'));
    // console.log(test);
    // return test

    if (!data['SeoulRtd.citydata'])
      throw new HttpException('wrong place name', 404);
    else return data['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;
  }
}
