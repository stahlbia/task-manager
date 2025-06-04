// knexfile.js

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'emanu',
      password: 'mingau',
      database: 'gb_software',
    },
    migrations: {
      directory: './src/db/migrations', // Your chosen directory for migration files
    },
    // seeds: { // Optional: if you want seed data
    //   directory: './src/db/seeds'
    // }
  },

  // You can add other environments like production, staging, etc.
  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL, // Example for Heroku or similar
  //   migrations: {
  //     directory: './src/db/migrations',
  //   }
  // }
};