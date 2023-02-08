import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoutesInfo } from './routesinfo';
@Entity({ schema: 'hh99_final-project', name: 'subway_route' })
export class SubwayRoute {
  @PrimaryGeneratedColumn({ type: 'int' })
  subway_id: number;
  @Column('int', { name: 'duration' }) //소요시간 (초)
  duration: number;

  @Column('int', { name: 'distance' }) //이동거리 (미터)
  distance: number;

  @Column('varchar', { name: 'name' }) // 출발지 이름 (도로명, 정류장 등)
  name: string;

  @Column('varchar', { name: 'routeNames' }) //출발지로부터 경로 이름 또는 노선
  routeNames: string;

  // @OneToOne(type => RoutesInfo)
  // @JoinColumn({
  //   name: 'route_id',
  //   referencedColumnName: 'id',
  // })
  // route_id: RoutesInfo;
}
