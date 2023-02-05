import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tourist_Spot } from '../entities/Tourist_spot';
import { TourismService } from './tourist_spot.service';

class MockToursimRepository {
  mydb = [
    {
      STATE_NM: '마포구',
      Name: '한강시민공원 망원지구(망원한강공원)',
      zipcode: '4005',
      address: '서울특별시 마포구 마포나루길 467',
      LAT: 37.55239893,
      LNG: 126.8999036,
      UNESCO: '',
      contact: '',
      info_activity: '',
      info_age: '',
      max_ppl: '',
      open_season: '',
      open_hours: '00:00~24:00',
      parking: '주차가능',
      stroller_rental: '없음',
      pets_allowed: '가능',
      creditcard_allowed: '',
      details:
        '이용가능시설:[체육시설] 축구장, 농구장, 배구장, 테니스장, 배드민턴장, 어린이야구장, 게이트볼장, 다목적운동장, 체력단련장, 수상훈련장(스카우트연맹)<br />\n [기타시설] 낚시터ㆍ자전거도로, 자전거대여소, 수영장, 유람선선착장<br />\n [편의시설] 매점, 음수대, 그늘막, 자전거보관소, 그늘막 \n 입 장 료:무료\n 화장실:있음',
      id: '1',
    },
  ];

  findOneStateTourism(STATE_NM) {
    const param = this.mydb.filter(x => x.STATE_NM === STATE_NM);
    if (param.length === 0) return [];
  }

  find() {
    return this.mydb;
  }
}
type MockTourismRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('Tourismervice', () => {
  let service: TourismService;
  let tourismRepository: MockTourismRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourismService,
        {
          provide: getRepositoryToken(Tourist_Spot),
          useClass: MockToursimRepository,
        },
      ],
    }).compile();

    service = module.get<TourismService>(TourismService);
    module.get(getRepositoryToken(Tourist_Spot));
  });

  describe('findOneStateTourism', () => {
    it('파라미터 지역구가 올바른 형태인지 검증하기', async () => {
      const STATE_NM = '강남구';
      try {
        await service.findOneStateTourism(STATE_NM);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('지역구의 관광지 정보 불러오기 ', async () => {
      const STATE_NM = '마포구';
      const myResultData = {
        STATE_NM: '마포구',
        Name: '한강시민공원 망원지구(망원한강공원)',
        zipcode: '4005',
        address: '서울특별시 마포구 마포나루길 467',
        LAT: 37.55239893,
        LNG: 126.8999036,
        UNESCO: '',
        contact: '',
        info_activity: '',
        info_age: '',
        max_ppl: '',
        open_season: '',
        open_hours: '00:00~24:00',
        parking: '주차가능',
        stroller_rental: '없음',
        pets_allowed: '가능',
        creditcard_allowed: '',
        details:
          '이용가능시설:[체육시설] 축구장, 농구장, 배구장, 테니스장, 배드민턴장, 어린이야구장, 게이트볼장, 다목적운동장, 체력단련장, 수상훈련장(스카우트연맹)<br />\n [기타시설] 낚시터ㆍ자전거도로, 자전거대여소, 수영장, 유람선선착장<br />\n [편의시설] 매점, 음수대, 그늘막, 자전거보관소, 그늘막 \n 입 장 료:무료\n 화장실:있음',
        id: '1',
      };

      const data = await service.findOneStateTourism(STATE_NM);
      expect(data).toStrictEqual([myResultData]);
    });
  });
});
