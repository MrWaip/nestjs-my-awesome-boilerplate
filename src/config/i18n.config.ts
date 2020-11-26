import { LOCALE_COOKIE, LOCALE_HEADER } from '@/common/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieResolver, HeaderResolver, I18nAsyncOptions, I18nJsonParser } from 'nestjs-i18n';
import * as path from 'path';
import { FALLBACK_LOCALE } from './constants';

export const i18nConfig: I18nAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    fallbackLanguage: configService.get<string>('fallback_locale', FALLBACK_LOCALE),
    parserOptions: {
      path: path.join(__dirname, '../i18n/locales/'),
    },
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
  parser: I18nJsonParser,
  resolvers: [new HeaderResolver([LOCALE_HEADER]), new CookieResolver([LOCALE_COOKIE])],
};
