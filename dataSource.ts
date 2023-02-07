import { Logo } from './src/entities/Logo';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Users } from './src/entities/Users';
import { Friends } from 'src/entities/Friends';
import { AreaLike } from 'src/entities/AreaLike';
import { Tourist_Spot } from 'src/entities/Tourist_spot';
import { User_Like } from 'src/entities/User_Like';
import { PopPredict } from 'src/entities/PopPredict';

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
  entities: [
    Users,
    Friends,
    AreaLike,
    Tourist_Spot,
    User_Like,
    Logo,
    PopPredict,
  ],
});

export default dataSource;
