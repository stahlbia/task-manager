import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table
      .boolean('is_deleted')
      .defaultTo(false)
      .notNullable()
      .after('password_salt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('is_deleted')
  })
}
