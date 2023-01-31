import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AreaLike } from './AreaLike';
import { Users } from './Users';

@Entity({ schema: 'hh99_final-project', name: 'user_like' })
export class User_Like {
  @Column('int', { name: 'user_like_id', primary: true })
  user_like_id: number;

  @ManyToOne(() => AreaLike, (arealike) => arealike.UserLike, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'areaLike_id',
      referencedColumnName: 'areaLike_id',
    },
  ])
  Area: AreaLike;

  @ManyToOne(() => Users, (users) => users.UserLike, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'id',
      referencedColumnName: 'id',
    },
  ])
  User: Users;
}
