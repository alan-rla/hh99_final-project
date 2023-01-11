import { PlaceIdRequestDto } from './dto/placeId-request.dto';
import { map } from 'rxjs';
import removeJsonTextAttribute from 'src/common/functions/xml.value.converter';
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';

@Injectable()
export class BusService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(placeId: PlaceIdRequestDto) {
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
    if (!resultData) throw new HttpException('wrong busId', 404);

    return resultData;
  }
}
