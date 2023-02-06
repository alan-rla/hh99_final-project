import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'hh99_final-project', name: 'logo' })
export class Logo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { name: 'logoImg', length: 255 })
  logoImg: string;
}
