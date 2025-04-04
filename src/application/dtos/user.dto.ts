import { UserRole } from "../../domain/entities/user.entity"

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface UpdateUserInput {
  id: number
  name?: string
  email?: string
  password?: string
  role?: UserRole
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
