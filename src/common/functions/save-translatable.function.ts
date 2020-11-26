import { Translatable, Translation } from '@/database/types';
import { Connection, Repository } from 'typeorm';

export const saveTranslatableEnities = async <T>(enities: Translatable<T>[], repository: Repository<T>) => {
  const promises: Promise<any>[] = [];

  for (const entity of enities) {
    for (const translation_key in entity.translations) {
      const translation = entity.translations[translation_key];

      const promise = new Promise(resolve => {
        if (translation.length === 0) {
          repository.save([entity]).then(resolve);
          return;
        }

        const first = translation.splice(0, 1);

        saveTranslation(repository.manager.connection, first[0], null).then(i18n_id => {
          const promises: Promise<any>[] = [];
          for (const trans of translation) {
            promises.push(saveTranslation(repository.manager.connection, trans, i18n_id));
          }

          entity[translation_key] = i18n_id;
          promises.push(repository.save([entity]));

          Promise.all(promises).then(resolve);
        });
      });

      promises.push(promise);
    }
  }

  await Promise.all(promises);
};

const saveTranslationSql = `select save_translation($1, $2, $3) as i18n_id`;

export const saveTranslation = (
  connection: Connection,
  [locale, value]: Translation,
  i18n_id: number | null = null,
): Promise<number> => {
  return connection.query(saveTranslationSql, [value, locale, i18n_id]).then(([{ i18n_id }]) => i18n_id);
};
