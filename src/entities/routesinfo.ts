import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  origin: string;

  @Column('varchar', { name: 'destination' }) // 검색 지역 (도착지명)
  destination: string;

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
}
