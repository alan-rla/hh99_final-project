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

    const routes = [...(carRoute ? [carRoute] : []), ...transitRoutes];
    if (routes.length === 0) {
      return [];
    }
    console.log('routes: ', routes);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //return 값을 데이터베이스에 저장시키기 위해 routeNames 배열을 스트링으로 변환시킨다
      const transitRoutesforSave = await this.transitRouteService
        .getRoutes(params)
        .catch(() => []);
      transitRoutesforSave.map(x => ({
        ...x,
        routeNames: JSON.stringify(x.routeNames),
      }));

      console.log('transitRoutesforSave: ', transitRoutesforSave);

      const routesforSave = [
        ...(carRoute ? [carRoute] : []),
        ...transitRoutesforSave,
      ];
      if (routes.length === 0) {
        throw new HttpException(
          '결과값이 없어 데이터베이스에 저장할 수 없음',
          400,
        );
      }

      /*/car type은 CarRoute 테이블에 저장, bus type은 BusRoute 테이블에 저장, subway type은 SubwayRoute 테이블에 저장/*/
      let car_id;
      let bus_id;
      let subway_id;
      if (carRoute) {
        const data = new CarRoute();
        data.car_id = carRoute.car_id;
        data.distance = carRoute.distance;
        data.duration = carRoute.duration;
        data.name = carRoute.name;
        data.routeNames = carRoute.routeNames;

        const savedCarRoute = await queryRunner.manager
          .getRepository(CarRoute)
          .save(data);
        car_id = savedCarRoute.car_id;
      }
      for (const transitRoute of transitRoutesforSave) {
        if (transitRoute.type === RouteType.Bus) {
          const data = new BusRoute();
          data.bus_id = transitRoute.bus_id;
          data.distance = transitRoute.distance;
          data.duration = transitRoute.duration;
          data.name = transitRoute.name;
          data.routeNames = transitRoute.routeNames;

          const savedBusRoute = queryRunner.manager
            .getRepository(BusRoute)
            .save(data);
          bus_id = (await savedBusRoute).bus_id;
        } else if (transitRoute.type === RouteType.Subway) {
          const data = new SubwayRoute();
          data.subway_id = transitRoute.subway_id;
          data.distance = transitRoute.distance;
          data.duration = transitRoute.duration;
          data.name = transitRoute.name;
          data.routeNames = transitRoute.routeNames;

          const savedSubwayRoute = queryRunner.manager
            .getRepository(SubwayRoute)
            .save(data);
          subway_id = (await savedSubwayRoute).subway_id;
        }
      }
      /*각각의 car_id, bus_id, subway_id, user_id 와 origin, destination 좌표는 레퍼런스 테이블인 RoutesInfo 테이블에 저장*/
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
      return routes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
