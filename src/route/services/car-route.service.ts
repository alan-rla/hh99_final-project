import { Injectable } from '@nestjs/common';

import {
  KakaoMobilityService,
  RequestDirectionsResponse,
  RequestDirectionsRoute,
  RequestDirectionsRouteSummary,
} from '../kakao-mobility';

import { RequestRouteParamsDto, RouteResponseDto } from '../dtos';
import { RouteType } from '../types';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CarRouteService {
  constructor(private readonly kakaoMobilityService: KakaoMobilityService) {}

  public async getRoute(
    params: RequestRouteParamsDto,
  ): Promise<RouteResponseDto> {
    const direction = await this.kakaoMobilityService.getDirection({
      origin: `${params.origin.latitude},${params.origin.longitude}`,
      destination: `${params.destination.latitude},${params.destination.longitude}`,
    });

    const route = this.getKakaoRoute(direction);
    const summary = this.getSummary(route);
    const roadNames = this.getRoadNames(route);

    const routeResponse: RouteResponseDto = {
      type: RouteType.Car,
      duration: summary.duration,
      distance: summary.distance,
      name: roadNames.at(0),
      routeNames: roadNames,
    };

    return plainToClass(RouteResponseDto, routeResponse);
  }

  private getKakaoRoute(
    direction: RequestDirectionsResponse<boolean>,
  ): RequestDirectionsRoute<boolean> {
    const route = direction.routes.at(0);

    if (!route) {
      throw new Error('There is no route.');
    }

    return route;
  }

  private getSummary(
    route: RequestDirectionsRoute<boolean>,
  ): RequestDirectionsRouteSummary {
    return route.summary;
  }

  private getRoadNames(route: RequestDirectionsRoute<boolean>): string[] {
    const roadNames = route.sections
      .map(({ roads }) => roads)
      .flat()
      .map(road => road.name)
      .filter(roadName => roadName && roadName.length > 0);

    if (roadNames.length <= 0) {
      throw new Error('There is any road name.');
    }

    return [...new Set(roadNames)];
  }
}
