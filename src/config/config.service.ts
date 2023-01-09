import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';

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
      logging: true,
      charset: 'utf8_general_ci', // 이모티콘 사용 가능하게 해줌
      synchronize: true, // TODO: 테이블 한번 만든 후 false로 변경해야 함!
      keepConnectionAlive: true, // Hot-reload시 DB 연결 끊기는거 방지
      entities: [Users],
    };
  }
}
