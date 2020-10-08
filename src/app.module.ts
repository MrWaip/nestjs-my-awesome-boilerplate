import { LOCALE_COOKIE, LOCALE_HEADER } from './common/constants';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { CookieResolver, HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { NavModule } from './nav/nav.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    DatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('fallback_locale'),
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
      parser: I18nJsonParser,
      resolvers: [new HeaderResolver([LOCALE_HEADER]), new CookieResolver([LOCALE_COOKIE])],
    }),
    UsersModule,
    TokensModule,
    AuthModule,
    NavModule,
  ],
})
export class AppModule {}
