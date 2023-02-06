import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Friends } from './Friends';
import { RoutesInfo } from './routesinfo';
import { TermsCondition } from './termscondition';
import { User_Like } from './User_Like';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'hh99_final-project', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('varchar', { name: 'profileImg', length: 255 })
  profileImg: string;

  @OneToMany(() => Friends, friends => friends.User)
  Friend1: Friends[];

  @OneToMany(() => Friends, friends => friends.Friend)
  Friend2: Friends[];

  @OneToMany(() => User_Like, user_like => user_like.User)
  UserLike: User_Like[];

  // @OneToMany(() => RoutesInfo, routesInfo => routesInfo.User)
  // routesInfo: RoutesInfo[];
}
