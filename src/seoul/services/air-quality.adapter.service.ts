import { Injectable } from '@nestjs/common';

import { SeoulAdapterService } from './seoul.adapter.service';

@Injectable()
export class AirQualityAdapterService extends SeoulAdapterService {
  public adapt(xml: string) {
    const cityData = this.getCityData(xml);

    // 도시데이터 API 응답 값 없으면 return
    if (!cityData) {
      return;
    }

    const areaName = this.getAreaName(cityData);
    const weatherData = this.getWeather(cityData);

    const {
      PM25_INDEX,
      PM25,
      PM10_INDEX,
      PM10,
      AIR_IDX,
      AIR_IDX_MVL,
      AIR_IDX_MAIN,
      AIR_MSG,
    } = weatherData;

    // 미세먼지 점검중이면 캐싱 안함
    if (PM25_INDEX !== '점검중') {
      return;
    }

    // 미세먼지 정보
    const areaAirData = {
      areaName,
      지역이름: areaName,
      초미세먼지지수: PM25_INDEX,
      초미세먼지: PM25,
      미세먼지지수: PM10_INDEX,
      미세먼지: PM10,
      대기환경등급: AIR_IDX,
      대기환경지수: AIR_IDX_MVL,
      지수결정물질: AIR_IDX_MAIN,
      등급메세지: AIR_MSG,
    };

    return areaAirData;
  }

  private getWeather(cityData: any) {
    return cityData['WEATHER_STTS']['WEATHER_STTS'];
  }
}
