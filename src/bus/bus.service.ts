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

@Injectable()
export class BusService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(placeId: PlaceIdRequestDto) {
    const apiUrl = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/2/${placeId}`;

    const result = await this.httpService.get(encodeURI(apiUrl)).toPromise();

    const data = convert.xml2json(result.data, {
      compact: true,
      spaces: 4,
      textFn: removeJsonTextAttribute,
    });
    const dataToJson = JSON.parse(data);
    await this.cacheManager.set('test', JSON.stringify(dataToJson));
    const test = JSON.parse(await this.cacheManager.get('test'));
    console.log(test);

    if (!dataToJson['SeoulRtd.citydata'])
      throw new HttpException('wrong place name', 404);

    const busData =
      dataToJson['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS.BUS_STN_STTS;

    for (const data of busData) {
      delete data.BUS_DETAIL;
    }

    return busData;
  }

  async findOne(placeId: PlaceIdRequestDto, busId: number) {
    const apiUrl = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/2/${placeId}`;

    const result = await this.httpService.get(encodeURI(apiUrl)).toPromise();

    const data = convert.xml2json(result.data, {
      compact: true,
      spaces: 4,
      textFn: removeJsonTextAttribute,
    });
    const dataToJson = JSON.parse(data);

    if (!dataToJson['SeoulRtd.citydata'])
      throw new HttpException('wrong place name', 404);

    const busData =
      dataToJson['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS.BUS_STN_STTS;

    const resultData = busData.find((obj: any) => obj.BUS_STN_ID === busId);

    const test = JSON.parse(await this.cacheManager.get('test'));
    console.log(test);

    if (!resultData) throw new HttpException('wrong busId', 404);

    return resultData;
  }
}
