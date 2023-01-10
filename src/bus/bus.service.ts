import { map } from 'rxjs';
import removeJsonTextAttribute from 'src/common/functions/xml.value.converter';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';

@Injectable()
export class BusService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(placeId: string) {
    const apiUrl = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/2/${placeId}`;

    try {
      const result = await this.httpService.get(encodeURI(apiUrl)).toPromise();

      const data = convert.xml2json(result.data, {
        compact: true,
        spaces: 4,
        textFn: removeJsonTextAttribute,
      });
      const dataToJson = JSON.parse(data);

      const busData = dataToJson['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS;
      console.log(busData);

      return busData;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  findOne(placeId: string, busId: string) {
    return `This action returns a #${busId} bus`;
  }
}
