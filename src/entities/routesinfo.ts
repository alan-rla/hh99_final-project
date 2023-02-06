import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusRoute } from './bus_route';
import { CarRoute } from './car_route';
import { SubwayRoute } from './subway_route';
import { Users } from './Users';

@Entity({ schema: 'hh99_final-project', name: 'routesinfo' })
export class RoutesInfo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @Column('int', { name: 'origin' })
  origin: number;
  @Column('int', { name: 'destination' })
  destination: number;

  @OneToOne(type => CarRoute, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'car_id' })
  carRoute: CarRoute;

  @OneToOne(type => BusRoute, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'bus_id', referencedColumnName: 'bus_id' })
  busRoute: BusRoute;

  @OneToOne(type => SubwayRoute, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'subway_id', referencedColumnName: 'subway_id' })
  subwayRoute: SubwayRoute;

  // @ManyToOne(() => Users, users => users.routesInfo, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({
  //   name: 'user_id',
  //   referencedColumnName: 'id',
  // })
  User: Users;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
