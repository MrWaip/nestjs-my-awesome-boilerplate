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
            isUnique: true,
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

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION get_user_fullname(p_user_id uuid)
        RETURNS text
        LANGUAGE plpgsql
      AS 
      $function$
          declare
              l_result text;
          begin
            
          IF p_user_id is null THEN
              return null;
            END IF;
            
              select  u.lname || ' ' || u.fname || ' ' || coalesce(u.mname, '') into l_result from users u
                  where u.id = p_user_id::uuid;
              
              return coalesce(l_result, null);
          end;
              
      $function$;   
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
