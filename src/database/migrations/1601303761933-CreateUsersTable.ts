import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsersTable1601303761933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'text',
          },
          {
            name: 'lname',
            type: 'text',
          },
          {
            name: 'fname',
            type: 'text',
          },
          {
            name: 'mname',
            type: 'text',
            isNullable: true,
            default: null,
          },
          {
            name: 'password',
            type: 'text',
          },
          {
            name: 'timezone',
            type: 'text',
          },
          {
            name: 'locale',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: `now()`,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: `now()`,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'uuid',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
            default: null,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'users_deleted_by_fk',
            columnNames: ['deleted_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          }),

          new TableForeignKey({
            name: 'users_created_by_fk',
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
