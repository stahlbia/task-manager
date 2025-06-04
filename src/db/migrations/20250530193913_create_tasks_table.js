/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Log to indicate which migration is running
  console.log('Running migration: create_tasks_table');
  return knex.schema.createTable('tasks', function(table) {
    // task_id: string, required, uuid, unique
    table.uuid('task_id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // title: string, required
    table.string('title').notNullable();

    // description: string
    table.text('description'); // Using text for potentially longer descriptions

    // status: string, required
    table.string('status').notNullable();

    // created_by: string, uuid, required, FK from users_table
    table.uuid('created_by').notNullable();
    table.foreign('created_by').references('user_id').inTable('users').onDelete('CASCADE'); // onDelete('CASCADE') means if a user is deleted, their tasks are also deleted. Adjust if needed (e.g., SET NULL if created_by can be null).

    // assigned_to: string, uuid, required, FK from users_table
    // Making assigned_to nullable as per typical task management systems (a task might not be assigned initially, or assignment might be optional)
    // If it's strictly required, change .nullable() to .notNullable()
    table.uuid('assigned_to').nullable();
    table.foreign('assigned_to').references('user_id').inTable('users').onDelete('SET NULL'); // onDelete('SET NULL') means if the assigned user is deleted, the task's assigned_to becomes NULL.

    // created_at: timestamp, required
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    // updated_at: timestamp, required
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  })
  .then(() => console.log('Table "tasks" created successfully.'))
  .catch((error) => console.error('Error creating "tasks" table:', error));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Log to indicate which migration is being rolled back
  console.log('Rolling back migration: create_tasks_table');
  return knex.schema.dropTableIfExists('tasks')
    .then(() => console.log('Table "tasks" dropped successfully.'))
    .catch((error) => console.error('Error dropping "tasks" table:', error));
};