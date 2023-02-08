import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class migrations1675865812668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'seoulAirInfo',
        columns: [
          {
            name: 'guName',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'NITROGEN',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'OZONE',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'CARBON',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'SULFUROUS',
            type: 'float',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('seoulAirInfo');
  }
}
