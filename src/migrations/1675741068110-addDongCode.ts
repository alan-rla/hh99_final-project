import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675741068110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike ADD DONG_CODE varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike DROP COLUMN DONG_CODE`);
  }
}
