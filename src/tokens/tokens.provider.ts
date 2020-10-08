import { DEFAULT_CONNECTION } from 'src/database/constants';
import { Connection } from 'typeorm';
import { TOKENS_REPOSITORY } from './constants';
import { Token } from './enities/token.entity';

export const tokensProviders = [
  {
    provide: TOKENS_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(Token),
    inject: [DEFAULT_CONNECTION],
  },
];
