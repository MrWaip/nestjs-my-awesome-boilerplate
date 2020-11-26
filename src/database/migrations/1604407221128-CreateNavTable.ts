import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNavTable1604407221128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'navs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order',
            type: 'integer',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'workplace',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'visible',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
            unsigned: true,
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
          new TableForeignKey({
            columnNames: ['parent_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'navs',
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('navs');
  }
}
