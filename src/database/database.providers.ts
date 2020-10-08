import { createConnection } from 'typeorm';
import { DEFAULT_CONNECTION } from './constants';

import { getConnections } from './connections';

export const databaseProviders = [
  {
    provide: DEFAULT_CONNECTION,
    useFactory: async () => {
      const config = getConnections().find(i => i.name === DEFAULT_CONNECTION);
      return await createConnection(config);
    },
  },
];
