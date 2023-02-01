import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675162804004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD profileImg varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('users', 'profileImg');
  }
}
