import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class migrations1675881202919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'seoulPopInfo',
        columns: [
          {
            name: 'AREA_NM',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'cache',
            type: 'varchar',
            length: '65535',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'seoulWeatherInfo',
        columns: [
          {
            name: 'AREA_NM',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'cache',
            type: 'varchar',
            length: '65535',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'seoulPMInfo',
        columns: [
          {
            name: 'AREA_NM',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'cache',
            type: 'varchar',
            length: '65535',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'seoulRoadInfo',
        columns: [
          {
            name: 'AREA_NM',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'cache',
            type: 'varchar',
            length: '65535',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('seoulPopInfo');
    await queryRunner.dropTable('seoulWeatherInfo');
    await queryRunner.dropTable('seoulPMInfo');
    await queryRunner.dropTable('seoulRoadInfo');
  }
}
