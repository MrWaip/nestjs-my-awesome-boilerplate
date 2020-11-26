import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRoleAndPermissionsTables1604409757466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permission_codes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'text',
            isNullable: false,
            isUnique: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'nav_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title_i18n',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'description_i18n',
            type: 'int',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['description_i18n'],
            referencedColumnNames: ['id'],
            referencedTableName: 'i18n',
            onDelete: 'SET NULL',
          }),
          new TableForeignKey({
            columnNames: ['title_i18n'],
            referencedColumnNames: ['id'],
            referencedTableName: 'i18n',
            onDelete: 'SET NULL',
          }),
          new TableForeignKey({
            columnNames: ['code_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permission_codes',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['nav_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'navs',
            onDelete: 'CASCADE',
          }),
        ],
        uniques: [{ columnNames: ['nav_id', 'code_id'] }],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'title_i18n',
            type: 'int',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['title_i18n'],
            referencedColumnNames: ['id'],
            referencedTableName: 'i18n',
            onDelete: 'SET NULL',
          }),
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'role_permission',
        columns: [
          {
            name: 'role_id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
          },
          {
            name: 'permission_id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'role_permission_role_id_fk',
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'roles',
            onDelete: 'CASCADE',
          }),

          new TableForeignKey({
            name: 'role_permission_permission_id_fk',
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions',
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permission');
    await queryRunner.dropTable('roles');
    await queryRunner.dropTable('permissions');
    await queryRunner.dropTable('permission_codes');
  }
}
