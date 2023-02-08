import { Column, Entity, Index } from 'typeorm';

@Index('guName', ['guName'], {})
@Entity({ schema: 'hh99_final-project', name: 'seoulAirInfo' })
export class SeoulAirInfo {
  @Column('varchar', { name: 'guName', primary: true })
  guName: string;

  @Column('float', { name: 'NITROGEN' })
  NITROGEN: number;

  @Column('float', { name: 'OZONE' })
  OZONE: number;

  @Column('float', { name: 'CARBON' })
  CARBON: number;

  @Column('float', { name: 'SULFUROUS' })
  SULFUROUS: number;
}
