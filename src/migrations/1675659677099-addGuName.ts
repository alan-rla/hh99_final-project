import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675659677099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike ADD GU_NAME varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('areaLike', 'GU_NAME');
  }
}
