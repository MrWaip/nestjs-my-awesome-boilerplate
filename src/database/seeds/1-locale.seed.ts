import { Locales } from '@/config/constants';
import { Locale } from '@/locales/locale.entity';
import { Connection } from 'typeorm';
import { Seeder } from 'typeorm-seeding';

export default class LocaleSeed implements Seeder {
  public async run(_, connection: Connection): Promise<void> {
    const locales: Locale[] = [new Locale({ id: Locales.RU }), new Locale({ id: Locales.EN })];
    await connection.getRepository(Locale).save(locales);
  }
}
