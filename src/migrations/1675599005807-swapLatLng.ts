import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675599005807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN LAT TO pending`,
    );
    await queryRunner.query(`ALTER TABLE areaLike RENAME COLUMN LNG TO LAT`);
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN pending TO LNG`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN LNG TO pending`,
    );
    await queryRunner.query(`ALTER TABLE areaLike RENAME COLUMN LAT TO LNG`);
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN pending TO LAT`,
    );
  }
}
