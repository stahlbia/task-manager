import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tasks', (table) => {
    table.uuid('created_by').notNullable()
    table.uuid('assigned_to').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tasks', (table) => {
    table.dropColumn('created_by')
    table.dropColumn('assigned_to')
  })
}
