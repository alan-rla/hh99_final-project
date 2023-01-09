import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Users } from './src/entities/Users';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  charset: 'utf8_general_ci',
  synchronize: false,
  migrations: [__dirname + '/src/migrations/*.ts'],
  entities: [Users],
});

export default dataSource;
