import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusRoute } from 'src/entities/bus_route';
import { CarRoute } from 'src/entities/car_route';
import { RoutesInfo } from 'src/entities/routesinfo';
import { SubwayRoute } from 'src/entities/subway_route';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /*/carRoute= 카카오 api에서 호출한 리턴값 transitRoute= Tmap api 호출 리턴값 
      이 리턴 값들을 합쳐서 getRoute 리턴값으로 반환 한다./*/
      const carRoute = await this.carRouteService
        .getRoute(params)
        .catch(() => null);
      console.log('carRoute: ', carRoute);
      JSON.stringify(carRoute?.routeNames);

      const transitRoutes = await this.transitRouteService
        .getRoutes(params)
        .catch(() => []);
      JSON.stringify(transitRoutes.map(x => x.routeNames));
      console.log('transitRoutes: ', transitRoutes);

      const routes = [...(carRoute ? [carRoute] : []), ...transitRoutes];
      if (routes.length === 0) {
        return [];
      }
      console.log('routes: ', routes);
      const stringifiedRoutes = routes.map(route => {
        return {
          ...route,
          routeNames: JSON.stringify(route.routeNames),
        };
      });
      // 결과 값이 모두 없으면 데이터베이스에 저장할수 없게 예외 처리
      if (stringifiedRoutes.length === 0) {
        throw new HttpException(
          '결과값이 없어 데이터베이스에 저장할 수 없음',
          400,
        );
      }
      /*/car type은 CarRoute 테이블에 저장, bus type은 BusRoute 테이블에 저장, subway type은 SubwayRoute 테이블에 저장
      각각의 car_id, bus_id, subway_id, user_id 와 origin, destination 좌표는 레퍼런스 테이블인 RoutesInfo 테이블에 저장/*/
      let car_id;
      let bus_id;
      let subway_id;
      if (carRoute) {
        const data = new CarRoute();
        data.car_id = stringifiedRoutes[0].car_id;
        data.distance = stringifiedRoutes[0].distance;
        data.duration = stringifiedRoutes[0].duration;
        data.name = stringifiedRoutes[0].name;
        data.routeNames = stringifiedRoutes[0].routeNames;

        const savedCarRoute = await queryRunner.manager
          .getRepository(CarRoute)
          .save(data);
        car_id = savedCarRoute.car_id;
      }
      for (const transitRoute of transitRoutes) {
        if (transitRoute.type === RouteType.Bus) {
          const data = new BusRoute();
          data.bus_id = stringifiedRoutes[1].bus_id;
          data.distance = stringifiedRoutes[1].distance;
          data.duration = stringifiedRoutes[1].duration;
          data.name = stringifiedRoutes[1].name;
          data.routeNames = stringifiedRoutes[1].routeNames;

          const savedBusRoute = queryRunner.manager
            .getRepository(BusRoute)
            .save(data);
          bus_id = (await savedBusRoute).bus_id;
        } else if (transitRoute.type === RouteType.Subway) {
          const data = new SubwayRoute();
          data.subway_id = stringifiedRoutes[2].subway_id;
          data.distance = stringifiedRoutes[2].distance;
          data.duration = stringifiedRoutes[2].duration;
          data.name = stringifiedRoutes[2].name;
          data.routeNames = stringifiedRoutes[2].routeNames;

          const savedSubwayRoute = queryRunner.manager
            .getRepository(SubwayRoute)
            .save(data);
          subway_id = (await savedSubwayRoute).subway_id;
        }
      }
      const data = new RoutesInfo();
      data.User.id = user.id;
      data.carRoute.car_id = car_id;
      data.busRoute.bus_id = bus_id;
      data.subwayRoute.subway_id = subway_id;
      data.origin = Number(params.origin);
      data.destination = Number(params.destination);

      const saveRoutesInfo = queryRunner.manager
        .getRepository(RoutesInfo)
        .save(data);

      await queryRunner.commitTransaction();
      return stringifiedRoutes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
