import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import areaList from '../../common/area-list';

@Injectable()
export class PublicOpenApiService {
  constructor(private readonly httpService: HttpService) {}

  public async getAllAreaData(): Promise<string[]> {
    const apiKeys = [
      process.env.API_KEY_1,
      process.env.API_KEY_2,
      process.env.API_KEY_3,
      process.env.API_KEY_4,
      process.env.API_KEY_5,
    ];

    const responses = await Promise.all(
      Array.from({ length: 50 })
        .fill(null)
        .map((_, index) => {
          const apiKey = apiKeys[index % 5]; // 1~5번(0~4 index) 키를 번갈아 가며 사용
          const areaName = areaList[index]['AREA_NM'];

          return `http://openapi.seoul.go.kr:8088/${apiKey}/xml/citydata/1/50/${areaName}`;
        })
        .map(url =>
          lastValueFrom(this.httpService.get<string>(encodeURI(url))),
        ),
    );

    return responses.map(({ data }) => data);
  }

  public async getDetailAirQuality(): Promise<string> {
    const url = `http://openapi.seoul.go.kr:8088/${process.env.AIR_KEY}/xml/ListAirQualityByDistrictService/1/25/`;
    const response = await lastValueFrom(
      this.httpService.get<string>(encodeURI(url)),
    );

    return response.data;
  }
}
