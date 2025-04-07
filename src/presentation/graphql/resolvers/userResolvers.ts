import { IResolvers } from "@graphql-tools/utils"
import { DateResolver } from "graphql-scalars"
import { PrismaUserRepository } from "../../../infrastructure/database/prisma/repositories/PrismaUserRepository.js"
import { GetUserByIdUseCase } from "../../../application/use-cases/user/getUserByIdUseCase.js"
import {
  CreateUserInput,
  CreateUserOutput,
} from "#/application/dtos/user.dto.js"
import { CreateUserUseCase } from "#/application/use-cases/user/createUserUseCase.js"
import { BcryptPasswordHasher } from "#/infrastructure/cryptography/bcrypt-password-hasher.js"

const userRepository = new PrismaUserRepository()
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const passwordHasher = new BcryptPasswordHasher()
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)

export const userResolvers: IResolvers = {
  Date: DateResolver,

  Query: {
    getUserById: async (_, { id }: { id: number }) => {
      const user = await getUserByIdUseCase.execute(id)
      return user
    },
  },
  Mutation: {
    createUser: async (
      _,
      { input }: { input: CreateUserInput }
    ): Promise<CreateUserOutput> => {
      try {
        const userDto = await createUserUseCase.execute({
          username: input.username,
          email: input.email,
          password: input.password,
          role: input.role,
        })
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
  },
}
