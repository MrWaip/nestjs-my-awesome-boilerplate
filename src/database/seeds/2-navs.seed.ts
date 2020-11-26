import { saveTranslatableEnities } from '@/common/functions/save-translatable.function';
import { Locales } from '@/config/constants';
import { Nav } from '@/nav/nav.entity';
import { Connection } from 'typeorm';
import { Seeder } from 'typeorm-seeding';
import { Translatable } from '../types';

export default class NavsSeed implements Seeder {
  public async run(_, connection: Connection): Promise<void> {
    const data: Translatable<Nav>[] = [
      {
        workplace: 'users',
        icon: 'mdi-settings',
        order: 1,
        translations: {
          title_i18n: [
            [Locales.RU, 'Пользователи'],
            [Locales.EN, 'Users'],
          ],
        },
      },
    ];

    await saveTranslatableEnities(data, connection.getRepository(Nav));
  }
}
