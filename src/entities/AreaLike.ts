import { Column, Entity, Index, OneToMany } from 'typeorm';
import { User_Like } from './User_Like';

@Index('AREA_NM', ['AREA_NM'], {})
@Entity({ schema: 'hh99_final-project', name: 'areaLike' })
export class AreaLike {
  @Column('int', { name: 'AreaLikeId', primary: true })
  areaLike_id: number;

  @Column('varchar', { name: 'AREA_NM' })
  AREA_NM: string;
  @Column('double', { name: 'LNG' })
  LNG: number;
  @Column('double', { name: 'LAT' })
  LAT: number;
  @Column('int', { name: 'likeCnt' })
  likeCnt: number;

  @OneToMany(() => User_Like, (user_like) => user_like.Area)
  UserLike: User_Like[];
}
