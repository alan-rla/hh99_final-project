import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675657677993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE routesinfo (
            id integer primary key,
            origin integer NOT NULL,
            destination integer NOT NULL,
            car_id integer,
            bus_id integer,
            subway_id integer,
            user_id integer NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT now(),
            updatedAt TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT FK_9a0d0e48e62eb1b2374fc8f3857 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT FK_3bb0f2ab7ffa25b8f611e2570b5 FOREIGN KEY (car_id) REFERENCES car_route(car_id) ON DELETE SET NULL ON UPDATE CASCADE,
            CONSTRAINT FK_54a8ef2aa8894e472471ad84e61 FOREIGN KEY (bus_id) REFERENCES bus_route(bus_id) ON DELETE SET NULL ON UPDATE CASCADE,
            CONSTRAINT FK_f0cfc5d5cbec57c2999f5b5c090 FOREIGN KEY (subway_id) REFERENCES subway_route(subway_id) ON DELETE SET NULL ON UPDATE CASCADE
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE routesinfo`);
  }
}
