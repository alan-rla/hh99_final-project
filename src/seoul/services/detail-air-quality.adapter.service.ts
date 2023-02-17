import { XmlAdapterService } from './xml.adapter.service';

export class DetailAirQualityAdapterService extends XmlAdapterService {
  public adapt(xml: string) {
    const json = this.convertXmlToJson(xml);
    const rows = this.getRows(json);

    return rows
      .filter(row => !this.isInMaintanace(row))
      .map(row => this.adaptRow(row));
  }

  private getRows(json: string) {
    return json['ListAirQualityByDistrictService']['row'];
  }

  private adaptRow(row: any) {
    const airData = {
      guName: row['MSRSTENAME'],
      NITROGEN: row['NITROGEN'],
      OZONE: row['OZONE'],
      CARBON: row['CARBON'],
      SULFUROUS: row['SULFUROUS'],
    };

    return airData;
  }

  private isInMaintanace(row: any) {
    return row['NITROGEN'] === '점검중';
  }
}
