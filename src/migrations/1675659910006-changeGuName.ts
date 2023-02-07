import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675659910006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN GU_NAME TO GU_CODE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE areaLike RENAME COLUMN GU_CODE TO GU_NAME`,
    );
  }
}
