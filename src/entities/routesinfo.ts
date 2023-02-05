import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
@Entity({ schema: 'hh99_final-project', name: 'routesinfo' })
export class RoutesInfo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('enum', { name: 'transportation' }) // 교통 수단 (자동자, 버스, 지하철)
  transportation: string;

  @Column('int', { name: 'duration' }) //소요시간 (초)
  duration: number;

  @Column('int', { name: 'distance' }) //이동거리 (미터)
  distance: number;

  @Column('varchar', { name: 'origin' }) // 출발지 이름 (도로명, 정류장 등)
  nameOrigin: string;

  @Column('varchar', { name: 'destination' }) // 검색 지역 (도착지명)
  nameDestination: string;

  @Column('varchar', { name: 'routeNames' }) //출발지로부터 경로 이름 또는 노선
  routeNames: string;

  @Column('double', { name: 'originCoordiante ' }) //유저의 현재 위치 좌표
  originCoordinate: number;

  @Column('double', { name: 'destinationCoordiante ' }) //도착지 위치 좌표
  destinationCoordinate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, users => users.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  User: Users;
}
