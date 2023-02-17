import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';

import { PopulationDto } from '../dto/population.dto';
import { SeoulAdapterService } from './seoul.adapter.service';

@Injectable()
export class PopulationAdapterService extends SeoulAdapterService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  public async adapt(xml: any) {
    const cityData = this.getCityData(xml);

    // 도시데이터 API 응답 값 없으면 return
    if (!cityData) {
      return;
    }

    const areaName = this.getAreaName(cityData);
    const populationData = this.getPopulation(cityData);

    // 1.2 비교 및 저장용 현재 인구 정보 선언
    // 1.3 도시데이터 API에서 불러온 인구 정보의 시간 선언 (시간 비교 용도)
    const CURRENT_TIME = dayjs(populationData['PPLTN_TIME']);
    // 1.4 과거 인구 이력(POP_RECORD) 저장용 객체 선언
    const CURRENT_POP_RECORD = {
      time: populationData['PPLTN_TIME'] + ':00',
      population: populationData['AREA_PPLTN_MAX'],
    };

    // 1.5 현재 REDIS 저장된 인구 정보 호출 (없으면 PAST_DATA = null)
    const PAST_DATA: PopulationDto = JSON.parse(
      await this.cacheManager.get(`POPULATION_${areaName}`),
    );
    let POP_RECORD: object[] = [];

    // 2.1 REDIS 저장된 정보 있을 시 시간을 비교해 데이터 업데이트
    if (PAST_DATA) {
      // 2.2 인구 과거 이력 불러오기
      const PAST_POP_RECORD = PAST_DATA['POP_RECORD'];
      POP_RECORD = [...PAST_POP_RECORD];
      // 2.3 저장되어있는 인구 정보 시간 선언
      const PAST_TIME = dayjs(PAST_DATA['PPLTN_TIME']);
      // 2.4 도시데이터에서 불러온 인구 데이터가 REDIS에 저장된 인구 데이터의 다음 시간대일 경우
      // (eg. 호출된 데이터 시간 13시 00분, 저장된 데이터 12시 50분)
      // 인구 이력에 저장시키기 (인구 이력에 현재 인구수도 저장시키기 때문)
      if (CURRENT_TIME.isAfter(PAST_TIME, 'hour')) {
        POP_RECORD.push(CURRENT_POP_RECORD);
      } else {
        // 2.5 현재 인구 데이터 요약본이 같은 시간대면 업데이트 (eg. 12시 40분 vs 12시 50분)
        const lastRecordTime = dayjs(POP_RECORD[POP_RECORD.length - 1]['time']);
        if (CURRENT_TIME.isSame(lastRecordTime, 'hour')) {
          POP_RECORD.pop();
          POP_RECORD.push(CURRENT_POP_RECORD);
        }
      }

      // 2.6 12시간 초과 데이터는 삭제
      if (POP_RECORD.length > 12) {
        POP_RECORD.shift();
      }
    }
    // 2.7저장된 데이터 없으면 REDIS에 현재 인구 요약본 추가
    if (POP_RECORD.length === 0) {
      POP_RECORD.push(CURRENT_POP_RECORD);
    }
    // 2.8 인구 데이터 저장용 객체 선언
    const areaPopData = {
      areaName,
      AREA_NM: areaName,
      AREA_CONGEST_LVL: populationData['AREA_CONGEST_LVL'],
      AREA_CONGEST_MSG: populationData['AREA_CONGEST_MSG'],
      AREA_PPLTN_MIN: populationData['AREA_PPLTN_MIN'],
      AREA_PPLTN_MAX: populationData['AREA_PPLTN_MAX'],
      PPLTN_TIME: populationData['PPLTN_TIME'],
      POP_RECORD: POP_RECORD,
    };

    return areaPopData;
  }

  private getPopulation(cityData: any) {
    return cityData['LIVE_PPLTN_STTS']['LIVE_PPLTN_STTS'];
  }
}
