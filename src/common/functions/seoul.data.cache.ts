import areaList from '../area-list';

function seoulDataOutput() {
  for (let i = 0; i < areaList.length; i += 5) {
    const url1 = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[i]['AREA_NM']}`;
    // eslint-disable-next-line prettier/prettier
    const url2 = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[i+1]['AREA_NM']}`;
    // eslint-disable-next-line prettier/prettier
    const url3 = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[i+2]['AREA_NM']}`;
    // eslint-disable-next-line prettier/prettier
    const url4 = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[i+3]['AREA_NM']}`;
    // eslint-disable-next-line prettier/prettier
    const url5 = `http://openapi.seoul.go.kr:8088/${process.env.ROAD_API_KEY}/xml/citydata/1/50/${areaList[i+4]['AREA_NM']}`;

    async function parallel() {
      const stream1 = this.httpService.get(encodeURI(url1));
      const stream2 = this.httpService.get(encodeURI(url2));
      const stream3 = this.httpService.get(encodeURI(url3));
      const stream4 = this.httpService.get(encodeURI(url4));
      const stream5 = this.httpService.get(encodeURI(url5));
    }
  }
}
