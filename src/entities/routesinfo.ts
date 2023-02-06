import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class RoutesInfo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('enum', { name: 'transportation' })
  transportation: string;

  @Column('int', { name: 'duration' })
  duration: number;

  @Column('int', { name: 'distance' })
  distance: number;

  @Column('varchar', { name: 'origin' })
  origin: string;

  @Column('varchar', { name: 'routeNames' })
  routeNames: string;

  @Column('double', { name: 'originCoordiante ' })
  originCoordinate: number;

  @Column('double', { name: 'destinationCoordiante ' })
  destinationCoordinate: number;
}
