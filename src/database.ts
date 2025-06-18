import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  // sqlite3
  client: 'sqlite3',
  connection: {
    filename: './src/db/app.db',
  },
  useNullAsDefault: true, // Required for SQLite
  migrations: {
    extension: 'ts', // Use TypeScript for migrations
    directory: './src/db/migrations', // Your chosen directory for migration files
  },
}

export const knex = setupKnex(config)
