import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddRoleIdToUser1604984338897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
        name: 'users_role_id_fk',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'users_role_id_fk');
    await queryRunner.dropColumn('users', 'role_id');
  }
}
