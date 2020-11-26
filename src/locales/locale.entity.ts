import { Locales } from '@/config/constants';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'locales' })
export class Locale {
  @PrimaryColumn()
  id: Locales;

  public constructor(init?: Partial<Locale>) {
    Object.assign(this, init);
  }
}
