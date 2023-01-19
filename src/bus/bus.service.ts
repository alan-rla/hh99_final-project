import areaList from 'src/common/area-list';
import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import removeJsonTextAttribute from 'src/common/functions/xml.value.converter';
import {
  Injectable,
  HttpException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BusService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveBusData() {
    for (const area of areaList) {
      const url = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/50/${area['AREA_NM']}`;
      const stream = this.httpService.get(encodeURI(url));
      const rawData = await lastValueFrom(stream);

      const data = JSON.parse(
        convert.xml2json(rawData.data, {
          compact: true,
          spaces: 2,
          textFn: removeJsonTextAttribute,
        }),
      )['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS.BUS_STN_STTS;

      const busData = {
        AREA_NM: area['AREA_NM'],
        ...data,
      };

      await this.cacheManager.set(
        `BUS_${area['AREA_NM']}`,
        JSON.stringify(busData),
      );
    }
  }

  async findAll(placeId: PlaceIdRequestDto) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    for (const busData of data) {
      delete busData.BUS_DETAIL;
    }

    return data;
  }

  async findOne(placeId: PlaceIdRequestDto, busId: number) {
    const data = JSON.parse(await this.cacheManager.get(`BUS_${placeId}`));

    if (!data) {
      throw new HttpException('null busData', 404);
    }

    const resultData = data.find((obj: any) => obj.BUS_STN_ID === busId);

    if (!resultData) throw new HttpException('wrong busId', 404);

    return resultData;
  }
}
