import { Role } from "#/domain/entities/user.entity.js"
export interface CreateUserInput {
  username: string
  email: string
  password: string
  role: Role
}

export interface CreateUserOutput {
  id: number
  username: string
  email: string
  role: Role
  created_at: Date
  updated_at: Date
}

export interface UpdateUserInput {
  id: number
  username?: string
  email?: string
  password?: string
  role?: Role
}

export interface DeleteUserInput {
  id: number
}

export interface GetUserByEmailInput {
  email: string
}

export interface GetUserByIdInput {
  id: number
}
