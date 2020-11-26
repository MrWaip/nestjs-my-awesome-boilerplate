import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { I18nModule } from 'nestjs-i18n';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultTypeOrmConfig } from '@/config/typeorm.config';
import { i18nConfig } from './config/i18n.config';

import { RefreshSessionsModule } from './refresh-sessions/refresh-sessions.module';
import { NavModule } from './nav/nav.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { LocalesModule } from './locales/locales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRootAsync(defaultTypeOrmConfig),
    I18nModule.forRootAsync(i18nConfig),
    UsersModule,
    RefreshSessionsModule,
    AuthModule,
    NavModule,
    RolesModule,
    LocalesModule,
  ],
})
export class AppModule {}
