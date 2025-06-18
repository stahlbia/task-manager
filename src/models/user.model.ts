/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateUserInput,
  UpdateUserInput,
  UserSchema,
  UserWithoutSensitiveInfoSchema,
} from '../schemas/user.schema'
import { randomUUID } from 'crypto'
import { genSalt, hash } from 'bcrypt'
import { knex } from '../database'

export async function createUser(
  data: CreateUserInput,
): Promise<UserWithoutSensitiveInfoSchema> {
  const { name, email, password } = data

  const userExists = await findUserByEmail(email)
  if (userExists) throw new Error('User already exists')

  const salt = await genSalt()
  const hasedPassword = await hash(password, salt)
  const dateNow = new Date()

  const newUser: UserSchema = {
    user_id: randomUUID(),
    name,
    email,
    password_hash: hasedPassword,
    password_salt: salt,
    is_deleted: false,
    updated_at: dateNow,
    created_at: dateNow,
  }

  await knex('users').insert(newUser)

  const { password_hash, password_salt, ...newUserWithoutPassword } = newUser
  return newUserWithoutPassword
}

export async function listUsers() {
  const users = await knex('users')
    .where('is_deleted', false)
    .select(
      'user_id',
      'name',
      'email',
      'is_deleted',
      'updated_at',
      'created_at',
    )
  const transformedUsers = users.map((row) => ({
    ...row,
    is_deleted: Boolean(row.is_deleted),
    updated_at: new Date(row.updated_at),
    created_at: new Date(row.created_at),
  }))
  return transformedUsers
}

export async function getUserById(
  user_id: string,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = await findUserById(user_id)

  if (!user) throw new Error('User not found')

  const transformedUser = transformUser(user)
  const { password_hash, password_salt, ...userWithoutPassword } =
    transformedUser
  return userWithoutPassword
}

export async function updateUser(
  user_id: string,
  data: Partial<UpdateUserInput>,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = await findUserById(user_id)

  if (!user) throw new Error('User not found')

  if (data.name)
    await knex('users').where('user_id', user_id).update('name', data.name)
  if (data.email)
    await knex('users').where('user_id', user_id).update('email', data.email)
  if (data.password) {
    const salt = await genSalt()
    const hasedPassword = await hash(data.password, salt)
    await knex('users')
      .where('user_id', user_id)
      .update('password_hash', hasedPassword)
      .update('password_salt', salt)
  }
  await knex('users').where('user_id', user_id).update('updated_at', new Date())
  const updatedUser = await knex('users')
    .where('user_id', user_id)
    .select('*')
    .first()

  const transformedUser = transformUser(updatedUser)
  const { password_hash, password_salt, ...userWithoutPassword } =
    transformedUser
  return userWithoutPassword
}

export async function deleteUser(
  user_id: string,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = await findUserById(user_id)

  if (!user) throw new Error('User not found')

  await knex('users').where('user_id', user_id).update('is_deleted', true)
  await knex('users').where('user_id', user_id).update('updated_at', new Date())
  const deletedUser = await knex('users')
    .where('user_id', user_id)
    .select('*')
    .first()

  const transformedUser = transformUser(deletedUser)
  const { password_hash, password_salt, ...userWithoutPassword } =
    transformedUser
  return userWithoutPassword
}

async function findUserById(user_id: string) {
  return await (
    await knex('users')
  ).find((u) => u.user_id === user_id && !u.is_deleted)
}

function transformUser(user: UserSchema) {
  return {
    ...user,
    is_deleted: Boolean(user.is_deleted),
    updated_at: new Date(user.updated_at),
    created_at: new Date(user.created_at),
  }
}

async function findUserByEmail(email: string) {
  return await knex('users').where({ email }).select('*').first()
}

export async function getUserByEmail(email: string): Promise<UserSchema> {
  const user = await findUserByEmail(email)

  if (!user) throw new Error('User not found')

  const transformedUser = transformUser(user)
  return transformedUser
}
