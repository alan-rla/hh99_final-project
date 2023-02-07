import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  RequestDirectionsParams,
  RequestDirectionsResponse,
} from './directions/interfaces';

@Injectable()
export class KakaoMobilityService {
  constructor(private readonly httpService: HttpService) {}

  public async getDirection(
    params: RequestDirectionsParams,
  ): Promise<RequestDirectionsResponse> {
    const response = await firstValueFrom(
      this.httpService.get<RequestDirectionsResponse>('/v1/directions', {
        params,
      }),
    );

    return response.data;
  }
}
