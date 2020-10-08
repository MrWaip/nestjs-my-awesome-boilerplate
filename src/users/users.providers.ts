import { DEFAULT_CONNECTION } from 'src/database/constants';
import { Connection } from 'typeorm';
import { USER_REPOSITORY } from './constants';
import { User } from './entities/user.entity';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DEFAULT_CONNECTION],
  },
];
