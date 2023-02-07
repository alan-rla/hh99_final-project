import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AreaLike } from 'src/entities/AreaLike';
import { Friends } from 'src/entities/Friends';
import { TermsCondition } from '../entities/termscondition';
import { Tourist_Spot } from 'src/entities/Tourist_spot';
import { Users } from 'src/entities/Users';
import { User_Like } from 'src/entities/User_Like';
import { RoutesInfo } from 'src/entities/routesinfo';
import { CarRoute } from 'src/entities/car_route';
import { BusRoute } from 'src/entities/bus_route';
import { SubwayRoute } from 'src/entities/subway_route';
import { Logo } from 'src/entities/Logo';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: false,
      charset: 'utf8_general_ci', // 이모티콘 사용 가능하게 해줌
      synchronize: false, // TODO: 테이블 한번 만든 후 false로 변경해야 함!
      keepConnectionAlive: true, // Hot-reload시 DB 연결 끊기는거 방지
      entities: [
        Users,
        Friends,
        User_Like,
        AreaLike,
        Tourist_Spot,
        TermsCondition,
        RoutesInfo,
        CarRoute,
        BusRoute,
        SubwayRoute,
        Logo,
      ],
      // migrations: ['dist/migrations/*{.ts,.js}'],
    };
  }
}
