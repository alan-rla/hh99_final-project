import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { KakaoMobilityService } from './kakao-mobility.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://apis-navi.kakaomobility.com',
      headers: {
        Authorization: process.env.KAKAO_MOBILITY_API_KEY,
        'Content-Type': 'application/json',
      },
    }),
  ],
  providers: [KakaoMobilityService],
  exports: [KakaoMobilityService],
})
export class KakaoMobilityModule {}
