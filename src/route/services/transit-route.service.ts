import { Injectable } from '@nestjs/common';

import { RequestRouteParamsDto, RouteResponseDto } from '../dtos';
import { RouteType } from '../types/route-type.enum';
import { plainToClass } from 'class-transformer';
import {
  LegMode,
  RequestLanguage,
  RequestRoutesMetadataPlanItinerary,
  RequestRoutesResponse,
  TmapTransitService,
} from '../tmap-transit';

@Injectable()
export class TransitRouteService {
  constructor(private readonly tmapTransitService: TmapTransitService) {}

  public async getRoutes(
    params: RequestRouteParamsDto,
  ): Promise<RouteResponseDto[]> {
    const routes = await this.tmapTransitService.getRoutes({
      startX: String(params.origin.latitude),
      startY: String(params.origin.longitude),
      endX: String(params.destination.latitude),
      endY: String(params.destination.longitude),
      lang: RequestLanguage.Korean,
    });

    const routeResponses = this.getItineraries(routes).reduce<
      RouteResponseDto[]
    >((routeResponses, itinerary) => {
      // 도보 제외 첫 번째 교통수단 탐색
      const firstTransit = itinerary.legs.find(
        leg => leg.mode !== LegMode.Walk,
      );

      const existsRoute = routeResponses.find(
        ({ name }) => name === firstTransit.start.name,
      );

      // 출발지가 같은 경로가 이미 있다면 노선만 추가함
      if (existsRoute) {
        const isDuplicatedRouteName = existsRoute.routeNames.includes(
          firstTransit.route,
        );

        // 같은 출발지의 같은 노선은 추가하지 않음
        if (!isDuplicatedRouteName) {
          existsRoute.routeNames.push(firstTransit.route);
        }

        return routeResponses;
      }

      // 최초로 찾은 경로의 거리/시간만 사용
      const route: RouteResponseDto = {
        type: this.convertLegMode(firstTransit.mode),
        name: firstTransit.start.name,
        duration: itinerary.totalTime,
        distance: itinerary.legs
          .map(({ distance }) => distance)
          .reduce((sum, distance) => sum + distance, 0),
        routeNames: firstTransit.route ? [firstTransit.route] : [],
      };

      return [...routeResponses, plainToClass(RouteResponseDto, route)];
    }, []);

    return routeResponses;
  }

  /**
   * - 사용자의 위치로부터 가장 가까운 대중교통 출발지 우선
   *   - 첫 번째 이동이 도보가 아니거나
   *   - 도보로 가장 가까운
   * - 총 이동 시간이 가장 짧은 경로 우선
   */
  private getItineraries(
    routes: RequestRoutesResponse,
  ): RequestRoutesMetadataPlanItinerary[] {
    return routes.metaData.plan.itineraries.sort((a, b) => {
      const shouldWalking =
        a.legs.at(0).mode === LegMode.Walk &&
        b.legs.at(0).mode !== LegMode.Walk;

      if (shouldWalking) {
        return 1;
      }

      const lowerDistance = a.legs.at(0).distance < b.legs.at(0).distance;

      if (lowerDistance) {
        return -1;
      }

      const lowerDuration = a.totalTime < b.totalTime;

      if (lowerDuration) {
        return -1;
      }

      return 0;
    });
  }

  private convertLegMode(legMode: LegMode): RouteType | null {
    switch (legMode) {
      case LegMode.Bus:
        return RouteType.Bus;
      case LegMode.Subway:
        return RouteType.Subway;
      default:
        return null;
    }
  }
}
