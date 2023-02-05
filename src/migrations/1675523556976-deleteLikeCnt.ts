import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675523556976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike DROP COLUMN likeCnt`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE areaLike ADD likeCnt int`);
  }
}
