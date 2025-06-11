import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('comments', (table) => {
    table.uuid('comment_id').primary()
    table.string('content').notNullable()
    table.uuid('task_id').notNullable()
    table.uuid('user_id').notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('comments')
}

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function(knex) {
//   // Log to indicate which migration is running
//   console.log('Running migration: create_comments_table');
//   return knex.schema.createTable('comments', function(table) {
//     // comment_id: string, required, uuid, unique
//     table.uuid('comment_id').primary().defaultTo(knex.raw('gen_random_uuid()'));

//     // content: string, required
//     table.text('content').notNullable(); // Using text for potentially longer comments

//     // task_id: string, uuid, required, FK from tasks_table
//     table.uuid('task_id').notNullable();
//     table.foreign('task_id').references('task_id').inTable('tasks').onDelete('CASCADE');

//     // user_id: string, uuid, required, FK from users_table
//     table.uuid('user_id').notNullable();
//     table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE'); // Or SET NULL if you want comments to remain if the user is deleted but their ID is cleared.

//     // created_at: timestamp, required
//     table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

//     // updated_at: timestamp, required
//     table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
//   })
//   .then(() => console.log('Table "comments" created successfully.'))
//   .catch((error) => console.error('Error creating "comments" table:', error));
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function(knex) {
//   // Log to indicate which migration is being rolled back
//   console.log('Rolling back migration: create_comments_table');
//   return knex.schema.dropTableIfExists('comments')
//     .then(() => console.log('Table "comments" dropped successfully.'))
//     .catch((error) => console.error('Error dropping "comments" table:', error));
// };
