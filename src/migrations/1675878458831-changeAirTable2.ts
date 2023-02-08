import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675878458831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE seoulAirInfo ADD cache varchar(65535)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE seoulAirInfo DROP COLUMN cache`);
  }
}
