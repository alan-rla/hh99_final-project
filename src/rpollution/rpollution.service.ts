import { catchError, map, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RpollutionService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async redisSavePollution() {
    const data = this.httpService
      .get(
        `http://openapi.seoul.go.kr:8088/${process.env.POLLUTION_API_KEY}/json/ListAirQualityByDistrictService/1/25/`,
      )
      .pipe(map(res => res.data?.ListAirQualityByDistrictService.row))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );

    const valueData = await lastValueFrom(data);

    for (const value of valueData) {
      const key = `pollution_${value.MSRSTENAME}`;
      await this.cacheManager.set(key, value);
    }
  }
}
