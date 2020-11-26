import { parseEnvInt } from '@/common/functions/parseInt';
import { TypeOrmModuleOptions as BaseModuleOptions, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DEFAULT_CONNECTION } from './constants';

type TypeOrmModuleOptions = BaseModuleOptions & {
  seeds?: string[];
  factories?: string[];
};

export const getDefaultConnectionConfig = (): TypeOrmModuleOptions => ({
  name: DEFAULT_CONNECTION,
  type: 'postgres',
  host: process.env.DEFAULT_DB_HOST,
  port: parseEnvInt(process.env.DEFAULT_DB_PORT, 5432),
  database: process.env.DEFAULT_DB_NAME,
  username: process.env.DEFAULT_DB_USERNAME,
  password: process.env.DEFAULT_DB_PASSWORD,
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  seeds: [__dirname + '/../database/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/../database/factories/**/*{.ts,.js}'],
  cli: { migrationsDir: __dirname + '/../database/migrations/' },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: true,
});

export const defaultTypeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: getDefaultConnectionConfig,
};
