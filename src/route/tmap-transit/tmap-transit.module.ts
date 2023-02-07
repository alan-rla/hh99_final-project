import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TmapTransitService } from './tmap-transit.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://apis.openapi.sk.com/transit',
      headers: {
        appKey: process.env.TMAP_API_APP_KEY,
      },
    }),
  ],
  providers: [TmapTransitService],
  exports: [TmapTransitService],
})
export class TmapTransitModule {}
