import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675501611442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE areaLike ADD areaImg varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('areaLike', 'areaImg');
  }
}
