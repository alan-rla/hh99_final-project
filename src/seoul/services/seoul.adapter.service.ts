import { XmlAdapterService } from './xml.adapter.service';

export abstract class SeoulAdapterService extends XmlAdapterService {
  protected getCityData(xml: string) {
    return this.convertXmlToJson(xml)['SeoulRtd.citydata']['CITYDATA'];
  }

  protected getAreaName(cityData: any): string {
    return cityData['AREA_NM'];
  }
}
