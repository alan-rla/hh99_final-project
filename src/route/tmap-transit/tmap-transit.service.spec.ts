import dotenv from 'dotenv';
dotenv.config();

import { Test } from '@nestjs/testing';

import { TmapTransitModule } from './tmap-transit.module';
import { TmapTransitService } from './tmap-transit.service';
import { RequestLanguage } from './types';

describe('Tmap Transit Service', () => {
  let tmapTransitService: TmapTransitService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TmapTransitModule],
    }).compile();

    tmapTransitService = moduleRef.get(TmapTransitService);
  });

  test('getRoutes', async () => {
    const response = await tmapTransitService.getRoutes({
      startX: '127.1006814', // 석촌호수
      startY: '37.5079608', // 석촌호수
      endX: '126.9882266', // N서울타워
      endY: '37.5511694', // N서울타워
      lang: RequestLanguage.Korean,
    });

    console.log(JSON.stringify(response, null, 2));
  });
});
