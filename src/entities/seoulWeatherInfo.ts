import { Column, Entity, Index } from 'typeorm';

@Index('AREA_NM', ['AREA_NM'], {})
@Entity({ schema: 'hh99_final-project', name: 'seoulWeatherInfo' })
export class SeoulWeatherInfo {
  @Column('varchar', { name: 'AREA_NM', primary: true })
  AREA_NM: string;

  @Column('varchar', { name: 'cache', length: 'MAX' })
  cache: string;
}
