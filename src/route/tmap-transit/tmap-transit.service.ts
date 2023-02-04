import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { RequestRoutesParams, RequestRoutesResponse } from './interfaces';

@Injectable()
export class TmapTransitService {
  constructor(private readonly httpService: HttpService) {}

  public async getRoutes(
    params: RequestRoutesParams,
  ): Promise<RequestRoutesResponse> {
    const response = await firstValueFrom(
      this.httpService.post<RequestRoutesResponse>('/routes', params),
    );

    return response.data;
  }
}
