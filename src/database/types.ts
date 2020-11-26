import { Locales } from '@/config/constants';
import { DeepPartial } from 'typeorm';
export type Translation = [Locales, string];

export type Translatable<T extends any> = DeepPartial<T> & {
  translations: {
    [key: string]: Translation[];
  };
};
