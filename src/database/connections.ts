import { ConnectionOptions as BaseConnectionOptions } from 'typeorm';
import { DEFAULT_CONNECTION } from './constants';

type ConnectionOptions = BaseConnectionOptions & {
  seeds?: string[];
  factories?: string[];
};

export const getConnections = (): ConnectionOptions[] => [
  {
    name: DEFAULT_CONNECTION,
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
    factories: [__dirname + '/factories/**/*{.ts,.js}'],
    cli: {
      migrationsDir: __dirname + '/migrations/',
    },
    logging: true,
  },
];
