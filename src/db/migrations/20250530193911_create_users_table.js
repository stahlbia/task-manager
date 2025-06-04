/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Log to indicate which migration is running
  console.log('Running migration: create_users_table');
  return knex.schema.createTable('users', function(table) {
    // user_id: string, required, uuid, unique
    table.uuid('user_id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // name: string
    table.string('name');

    // email: string, required, unique
    table.string('email').notNullable().unique();

    // password_hash: string, required
    table.string('password_hash').notNullable();

    // password_salt: string, required
    table.string('password_salt').notNullable();

    // created_at: timestamp, required
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    // updated_at: timestamp, required
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  })
  .then(() => console.log('Table "users" created successfully.'))
  .catch((error) => console.error('Error creating "users" table:', error));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Log to indicate which migration is being rolled back
  console.log('Rolling back migration: create_users_table');
  return knex.schema.dropTableIfExists('users')
    .then(() => console.log('Table "users" dropped successfully.'))
    .catch((error) => console.error('Error dropping "users" table:', error));
};