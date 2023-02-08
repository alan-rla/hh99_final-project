import { Column, Entity, Index } from 'typeorm';

@Index('guName', ['guName'], {})
@Entity({ schema: 'hh99_final-project', name: 'seoulAirInfo' })
export class SeoulAirInfo {
  @Column('varchar', { name: 'guName', primary: true })
  guName: string;

  @Column('varchar', { name: 'cache', length: 'MAX' })
  cache: string;
}
