import { IResolvers } from "@graphql-tools/utils"
import { DateResolver } from "graphql-scalars"
import { PrismaUserRepository } from "../../../infrastructure/database/prisma/repositories/PrismaUserRepository.js"
import { GetUserByIdUseCase } from "../../../application/use-cases/user/getUserByIdUseCase.js"
import {
  CreateUserInput,
  CreateUserOutput,
  UpdateUserInput,
} from "#/application/dtos/user.dto.js"
import { CreateUserUseCase } from "#/application/use-cases/user/createUserUseCase.js"
import { BcryptPasswordHasher } from "#/infrastructure/cryptography/bcrypt-password-hasher.js"
import { DeleteUserUseCase } from "#/application/use-cases/user/deleteUserUseCase.js"
import { UpdateUserUseCase } from "#/application/use-cases/user/updateUserUseCase.js"
import { GetUserByEmailUseCase } from "#/application/use-cases/user/getUserByEmailUseCase.js"

const userRepository = new PrismaUserRepository()
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const passwordHasher = new BcryptPasswordHasher()
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)

export const userResolver: IResolvers = {
  Date: DateResolver,

  Query: {
    getUserById: async (_, { id }: { id: number }) => {
      const user = await getUserByIdUseCase.execute(id)
      return user
    },
    getUserByEmail: async (_, { email }: { email: string }) => {
      const user = await getUserByEmailUseCase.execute(email)
      return user
    },
  },
  Mutation: {
    createUser: async (
      _,
      { input }: { input: CreateUserInput }
    ): Promise<CreateUserOutput> => {
      console.log("input", input)
      try {
        const userDto = await createUserUseCase.execute({
          username: input.username,
          email: input.email,
          password: input.password,
          role: input.role,
        })
        console.log("userDto", userDto)
        return {
          id: userDto.id,
          username: userDto.username,
          email: userDto.email,
          role: userDto.role,
          created_at: userDto.created_at,
          updated_at: userDto.updated_at,
        } as CreateUserOutput
      } catch (error) {
        const err = error as Error
        // Tratar erros específicos e lançar erros GraphQL apropriados
        console.error("Error creating user:", error)
        throw new Error(err.message || "Failed to create user")
      }
    },
    deleteUser: async (_, { id }: { id: number }) => {
      try {
        const deletedUser = await deleteUserUseCase.execute({ id })
        return deletedUser
      } catch (error) {
        const err = error as Error
        // console.error("Error deleting user:", error)
        throw new Error(err.message || "Failed to delete user")
      }
    },
    updateUser: async (__dirname, { input }: { input: UpdateUserInput }) => {
      try {
        const updatedUser = await updateUserUseCase.execute(input)
        return updatedUser
      } catch (error) {
        const err = error as Error
        // console.error("Error updating user:", error)
        throw new Error(err.message || "Failed to update user")
      }
    },
  },
}

export const resolvers = {
  Query: { ...userResolver.Query },
  Mutation: { ...userResolver.Mutation },
}
