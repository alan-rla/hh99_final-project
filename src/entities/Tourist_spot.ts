import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ schema: 'hh99_final-project', name: 'tourist_spot2' })
export class Tourist_Spot{
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('text',{name:'STATE_NM'})
    STATE_NM: string

    @Column('text',{name:'Name'})
    Name: string

    @Column('int',{name:'zipcode'})
    zipcode: number

    @Column('text',{name:'address'})
    address: string

    @Column('double', { name: 'LNG' })
    LNG: number;

    @Column('double', { name: 'LAT' })
    LAT: number;

    @Column('text',{name:'UNESCO'})
    UNESCO: string

    @Column('text',{name:'contact'})
    contact: string

    @Column('text',{name:'activity_info'})
    activity_info: string

    @Column('text',{name:'activity_age'})
    activity_age: string

    @Column('text',{name:'max_ppl'})
    max_ppl: string

    @Column('text',{name:'open_season'})
    open_season: string

    @Column('text',{name:'open_hour'})
    open_hour: string

    @Column('text',{name:'parking'})
    parking: string

    @Column('text',{name:'stroller_rental'})
    stroller_rental: string

    @Column('text',{name:'pets_allowed'})
    pets_allowed: string

    @Column('text',{name:'creditcard_allowed'})
    creditcard_allowed: string

    @Column('text',{name:'details'})
    details: string


}


