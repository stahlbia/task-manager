/* eslint-disable @typescript-eslint/no-unused-vars */
import { usersTableSim } from '../db/dbSimulator'
import {
  CreateUserInput,
  UpdateUserInput,
  UserSchema,
  UserWithoutSensitiveInfoSchema,
} from '../schemas/user.schema'
import { randomUUID, randomBytes } from 'crypto'
import { genSalt, hash } from 'bcrypt'

export async function createUser(
  data: CreateUserInput,
): Promise<UserWithoutSensitiveInfoSchema> {
  const { name, email, password } = data

  const userExists = usersTableSim.find((user) => user.email === email)
  if (userExists) {
    throw new Error('User already exists')
  }

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

  usersTableSim.push(newUser)

  const { password_hash, password_salt, ...newUserWithoutPassword } = newUser
  return newUserWithoutPassword
}

export async function listUsers(): Promise<UserWithoutSensitiveInfoSchema[]> {
  return usersTableSim
    .filter((u) => !u.is_deleted)
    .map(({ password_hash, password_salt, ...rest }) => rest)
}

export async function getUserById(
  user_id: string,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = findUserById(user_id)

  if (!user) throw new Error('User not found')

  const { password_hash, password_salt, ...userWithoutPassowrd } = user
  return userWithoutPassowrd
}

export async function updateUser(
  user_id: string,
  data: Partial<UpdateUserInput>,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = findUserById(user_id)

  if (!user) throw new Error('User not found')

  if (data.name) user.name = data.name
  if (data.email) user.email = data.email
  if (data.password) {
    const salt = await genSalt()
    user.password_hash = await hash(data.password, salt)
    user.password_salt = salt
  }

  const { password_hash, password_salt, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function deleteUser(
  user_id: string,
): Promise<UserWithoutSensitiveInfoSchema> {
  const user = findUserById(user_id)

  if (!user) throw new Error('User not found')

  user.is_deleted = true

  const { password_hash, password_salt, ...userWithoutPassword } = user
  return userWithoutPassword
}

function findUserById(user_id: string) {
  return usersTableSim.find(
    (user) => user.user_id === user_id && !user.is_deleted,
  )
}
