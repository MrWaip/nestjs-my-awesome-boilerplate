import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateI18NTables1604407221127 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locales',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            length: '5',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'i18n',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'translations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'i18n_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'locale_id',
            type: 'varchar',
            length: '5',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
          },
        ],
        uniques: [
          {
            name: 'translations_unique_locale_id_and_i18n_id',
            columnNames: ['i18n_id', 'locale_id'],
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'translations_i18n_id_fk',
            columnNames: ['i18n_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'i18n',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),

          new TableForeignKey({
            name: 'translations_localen_id_fk',
            columnNames: ['locale_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'locales',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      }),
    );

    await queryRunner.query(`
        create or replace
        function translate(p_i18n_id int, p_locale_id varchar(5), p_default_result text default null::text) returns text language plpgsql as $function$
        declare
            l_result text;
        
        begin
            select t.value into l_result from translations t
                where t.i18n_id = p_i18n_id and t.locale_id = p_locale_id;
            
            return coalesce(l_result, p_default_result);
        end;
        
        $function$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION save_translation(p_value text, p_locale varchar(5), p_i18n_id int default null)
      RETURNS text
      LANGUAGE plpgsql
      AS 
      $function$
          declare
            l_locale varchar(5);
            l_i18n_id int;
              l_result text;
              l_translation_id int;
          begin
            l_i18n_id := p_i18n_id;
          
            select l.id into l_locale from locales l where l.id  = p_locale;
            
          IF l_locale is null THEN
              RAISE EXCEPTION 'Locale "%" does not exist', p_locale;
            END IF;
            
            if l_i18n_id is not null then
              select t.id into l_translation_id from translations t where t.i18n_id = p_i18n_id and t.locale_id = l_locale;
            else
              insert into i18n (id) values (default) returning id into l_i18n_id;
          end if;
        
          if l_translation_id is not null then
            update translations set value = p_value where id = l_translation_id;
          else
            insert into translations (value, locale_id, i18n_id) values (p_value, l_locale, l_i18n_id)
              returning id into l_translation_id;
          end if;
              
              return l_i18n_id;
          end;
              
      $function$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION "save_translation"(p_value text, p_locale varchar(5), p_i18n_id int default null);`);
    await queryRunner.query(`DROP FUNCTION "translate"(int4,varchar,text);`);
    await queryRunner.dropTable('translations');
    await queryRunner.dropTable('i18n');
    await queryRunner.dropTable('locales');
  }
}
