import dotenv from 'dotenv';
dotenv.config();

import { Test } from '@nestjs/testing';

import { KakaoMobilityModule } from './kakao-mobility.module';
import { KakaoMobilityService } from './kakao-mobility.service';

describe('Kakao Mobility Service', () => {
  let kakaoMobilityService: KakaoMobilityService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [KakaoMobilityModule],
    }).compile();

    kakaoMobilityService = moduleRef.get(KakaoMobilityService);
  });

  test('getDirection', async () => {
    const response = await kakaoMobilityService.getDirection({
      origin: '127.1006814,37.5079608', // 석촌호수
      destination: '126.9882266,37.5511694', // N서울타워
    });

    console.log(JSON.stringify(response, null, 2));
  });
});
