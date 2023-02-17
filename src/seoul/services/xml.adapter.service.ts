import convert from 'xml-js';

import removeJsonTextAttribute from '../../common/functions/xml.value.converter';

export abstract class XmlAdapterService {
  public abstract adapt(...args: unknown[]);

  protected convertXmlToJson(data: string) {
    return JSON.parse(
      convert.xml2json(data, {
        compact: true,
        spaces: 2,
        textFn: removeJsonTextAttribute,
      }),
    );
  }
}
