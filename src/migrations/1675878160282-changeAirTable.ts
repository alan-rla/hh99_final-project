import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1675878160282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE seoulAirInfo DROP COLUMN NITROGEN`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo DROP COLUMN OZONE`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo DROP COLUMN CARBON`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo DROP COLUMN SULFUROUS`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE seoulAirInfo ADD NITROGEN float`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo ADD OZONE float`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo ADD CARBON float`);
    await queryRunner.query(`ALTER TABLE seoulAirInfo ADD SULFUROUS float`);
  }
}
