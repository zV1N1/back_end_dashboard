import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { config } from 'dotenv';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions,
      {
        database: process.env.NODE_ENV === 'test'
          ? './__tests__/database.sqlite'
          : defaultOptions.database,
      }),
  );
};
