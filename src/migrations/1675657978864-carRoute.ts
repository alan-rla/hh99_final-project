import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675657978864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE car_route (
            car_id integer NOT NULL,
            duration integer NOT NULL,
            distance integer NOT NULL,
            name varchar(255) NOT NULL,
            routeNames varchar(255) NOT NULL,
            PRIMARY KEY (car_id)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE car_route`);
  }
}
