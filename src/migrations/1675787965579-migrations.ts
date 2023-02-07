import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675787965579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike ADD imgSource varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike DROP COLUMN imgSource`);
  }
}
