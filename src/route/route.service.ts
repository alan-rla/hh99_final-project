import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusRoute } from 'src/entities/bus_route';
import { CarRoute } from 'src/entities/car_route';
import { RoutesInfo } from 'src/entities/routesinfo';
import { SubwayRoute } from 'src/entities/subway_route';
import { Users } from 'src/entities/Users';
import {
  DataSource,
  QueryRunnerAlreadyReleasedError,
  Repository,
} from 'typeorm';

import { RequestRouteParamsDto, RouteResponseDto } from './dtos';
import { CarRouteService, TransitRouteService } from './services';
import { RequestRouteParams, RouteType } from './types';

@Injectable()
export class RouteService {
  constructor(
    private readonly carRouteService: CarRouteService,
    private readonly transitRouteService: TransitRouteService,
    @InjectRepository(RoutesInfo)
    private routesinfoRepository: Repository<RoutesInfo>,
    @InjectRepository(CarRoute)
    private carRouteRepository: Repository<CarRoute>,
    @InjectRepository(BusRoute)
    private busRouteRepository: Repository<BusRoute>,
    @InjectRepository(SubwayRoute)
    private subwayRouteRepository: Repository<SubwayRoute>,
    private dataSource: DataSource,
  ) {}

  public async getRoutes(
    user: Users,
    params: RequestRouteParamsDto,
  ): Promise<RouteResponseDto[]> {
    /*/carRoute= 카카오 api에서 호출한 리턴값 transitRoute= Tmap api 호출 리턴값 
      이 리턴 값들을 합쳐서 getRoute 리턴값으로 반환 한다./*/
    const carRoute = await this.carRouteService
      .getRoute(params)
      .catch(() => null);

    const transitRoutes = await this.transitRouteService
      .getRoutes(params)
      .catch(() => []);
    console.log('params: ', params);

    const routes = [...(carRoute ? [carRoute] : []), ...transitRoutes];
    if (routes.length === 0) {
      return [];
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //자동차 경로 정보 저장하기
      if (carRoute.length === 0) {
        throw new HttpException('저장할 자동차 경로가 없음', 400);
      }
      const saveCarRoute = { ...carRoute };
      saveCarRoute.routeNames = carRoute.routeNames.join(',');
      console.log('saveCarRoute: ', saveCarRoute);
      await queryRunner.manager.getRepository(CarRoute).save(saveCarRoute);

      //대중교통 경로 정보 저장하기
      if (transitRoutes.length === 0) {
        throw new HttpException('대중교통 경로 정보 없음', 400);
      }
      const saveTransitRoute = transitRoutes.map(x => ({
        ...x,
        routeNames: JSON.stringify(x.routeNames),
      }));
      console.log('saveTransitRoute: ', saveTransitRoute);

      for (const transitRoute of saveTransitRoute) {
        if (transitRoute.RouteType === 'Bus') {
          const saveBusRoute = await queryRunner.manager
            .getRepository(BusRoute)
            .save(transitRoute);
        } else if (transitRoute.RouteType === 'Subway') {
          const saveSubwayRoute = await queryRunner.manager
            .getRepository(SubwayRoute)
            .save(transitRoute);
        }
      }
      const saveBusRoute = saveTransitRoute.find(x => x.RouteType === 'Bus');
      const saveSubwayRoute = saveTransitRoute.find(
        x => x.RouteType === 'Subway',
      );
      //검색 경로 좌표 저장하기
      const saveCoordinates = new RoutesInfo();
      saveCoordinates.User.id = user.id;
      saveCoordinates.origin = Number(params.origin);
      saveCoordinates.destination = Number(params.destination);
      saveCoordinates.carRoute ? saveCarRoute.car_id : null;
      saveCoordinates.busRoute ? saveBusRoute.bus_id : null;
      saveCoordinates.subwayRoute ? saveSubwayRoute.subway_id : null;

      const data = await queryRunner.manager
        .getRepository(RoutesInfo)
        .save(saveCoordinates);
      await queryRunner.commitTransaction();
      const result = [];
      result.push(data);

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
