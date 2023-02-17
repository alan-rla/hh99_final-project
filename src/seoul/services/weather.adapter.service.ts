import { Injectable } from '@nestjs/common';

import { SeoulAdapterService } from './seoul.adapter.service';

@Injectable()
export class WeatherAdapterService extends SeoulAdapterService {
  public adapt(xml: string) {
    const cityData = this.getCityData(xml);

    // 도시데이터 API 응답 값 없으면 return
    if (!cityData) {
      return;
    }

    const weatherData = this.getWeather(cityData);

    const forecast = [];

    for (const data of weatherData['FCST24HOURS']['FCST24HOURS']) {
      const result = {
        예보시간: data['FCST_DT'].toString().substring(8, 10) + '시',
        기온: data['TEMP'],
        강수량: data['PRECIPITATION'],
        강수형태: data['PRECPT_TYPE'],
        강수확률: data['RAIN_CHANCE'],
        날씨: data['SKY_STTS'],
      };

      forecast.push(result);
    }

    const weather = {
      areaName: this.getAreaName(cityData),
      날씨집계시간: weatherData['WEATHER_TIME'],
      기온: weatherData['TEMP'],
      체감기온: weatherData['SENSIBLE_TEMP'],
      최고기온: weatherData['MAX_TEMP'],
      최저기온: weatherData['MIN_TEMP'],
      습도: weatherData['HUMIDITY'],
      풍향: weatherData['WIND_DIRCT'],
      풍속: weatherData['WIND_SPD'],
      강수량: weatherData['PRECIPITATION'],
      강수형태: weatherData['PRECPT_TYPE'],
      강수메세지: weatherData['PCP_MSG'],
      일출: weatherData['SUNRISE'],
      일몰: weatherData['SUNSET'],
      자외선단계: weatherData['UV_INDEX_LVL'],
      자외선지수: weatherData['UV_INDEX'],
      자외선메세지: weatherData['UV_MSG'],
      일기예보: forecast,
    };

    return weather;
  }

  private getWeather(cityData: any) {
    return cityData['WEATHER_STTS']['WEATHER_STTS'];
  }
}
