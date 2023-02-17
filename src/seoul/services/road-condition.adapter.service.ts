import { Injectable } from '@nestjs/common';

import { SeoulAdapterService } from './seoul.adapter.service';

@Injectable()
export class RoadConditionAdapterService extends SeoulAdapterService {
  public adapt(xml: string) {
    const cityData = this.getCityData(xml);

    // 도시데이터 API 응답 값 없으면 return
    if (!cityData) {
      return;
    }

    const areaName = this.getAreaName(cityData);

    const data = {
      areaName,
      ...this.getRoadCondition(cityData),
    };

    return data;
  }

  private getRoadCondition(cityData: any) {
    return cityData['ROAD_TRAFFIC_STTS']['AVG_ROAD_DATA'];
  }
}
