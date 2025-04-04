import { Role } from "@prisma/client"

export interface CreateUserInput {
  username: string
  email: string
  password: string
  role: Role
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
