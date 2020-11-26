import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRefreshSissionsTable1602600895832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_sessions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'refresh_token',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: `now()`,
          },
          {
            name: 'expires_in',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'ip',
            type: 'text',
          },
          {
            name: 'fingerprint',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_sessions', true);
  }
}
