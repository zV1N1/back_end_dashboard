export default {
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: false,
  migrations: [
    './src/database/migrations/*.ts',
  ],
  entities: [
    './src/models/*.ts',
  ],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};
