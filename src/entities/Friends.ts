import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'hh99_final-project', name: 'friends' })
export class Friends {
  @Column('int', { name: 'UserId', primary: true })
  UserId: number;

  @Column('int', { name: 'FriendId', primary: true })
  FriendId: number;

  @ManyToOne(() => Users, users => users.Friend1, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(() => Users, users => users.Friend2, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'FriendId', referencedColumnName: 'id' }])
  Friend: Users;
}
