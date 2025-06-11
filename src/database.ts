import { knex as setupKnex, Knex } from 'knex';

export const config: Knex.Config = {
    // sqlite3
    client: 'sqlite3',
    connection: {
        filename: './src/db/app.db',
    },
    useNullAsDefault: true, // Required for SQLite
    migrations: {
        extension: 'js', // Use TypeScript for migrations
        directory: './src/db/migrations', // Your chosen directory for migration files
    }

    // postgres
    // client: 'pg',
    // connection: {
    //     host: 'localhost',
    //     port: 5432,
    //     user: 'emanu',
    //     password: 'mingau',
    //     database: 'gb_software',
    // },
    // migrations: {
    //     directory: './src/db/migrations', // Your chosen directory for migration files
    // },
}

export const knex = setupKnex(config)
