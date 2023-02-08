import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675658203833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE bus_route (
            bus_id integer NOT NULL,
            duration integer NOT NULL,
            distance integer NOT NULL,
            name varchar(255) NOT NULL,
            routeNames varchar(255) NOT NULL,
            PRIMARY KEY (bus_id)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE bus_route`);
  }
}
