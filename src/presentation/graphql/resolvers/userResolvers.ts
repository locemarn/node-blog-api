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
import { JwtTokenService } from "#/infrastructure/libs/jwt/jwtService.js"
import config from "#/infrastructure/configs/index.js"
import { RoleGuard } from "../guards/RoleGuard.js"

const userRepository = new PrismaUserRepository()
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const passwordHasher = new BcryptPasswordHasher()
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
const {
  jwt: { secret, expiresIn },
} = config
const jwtTokenService = new JwtTokenService(secret, +expiresIn)

const adminOnly = new RoleGuard("ADMIN")

export const userResolver: IResolvers = {
  Date: DateResolver,

  Query: {
    getUserById: adminOnly.handle(async (_, { id }: { id: number }) => {
      const user = await getUserByIdUseCase.execute(id)
      return user
    }),
    getUserByEmail: adminOnly.handle(
      async (_, { email }: { email: string }) => {
        const user = await getUserByEmailUseCase.execute(email)
        return user
      }
    ),
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
    deleteUser: adminOnly.handle(async (_, { id }: { id: number }) => {
      try {
        const deletedUser = await deleteUserUseCase.execute({ id: +id })
        return deletedUser
      } catch (error) {
        const err = error as Error
        // console.error("Error deleting user:", error)
        throw new Error(err.message || "Failed to delete user")
      }
    }),
    updateUser: adminOnly.handle(
      async (__dirname, { input }: { input: UpdateUserInput }) => {
        try {
          const updatedUser = await updateUserUseCase.execute(input)
          return updatedUser
        } catch (error) {
          const err = error as Error
          // console.error("Error updating user:", error)
          throw new Error(err.message || "Failed to update user")
        }
      }
    ),
    login: async (
      _,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: CreateUserOutput }> => {
      const user = await getUserByEmailUseCase.execute(email)
      if (!user) throw new Error("User not found")

      const isPasswordValid = await passwordHasher.compare(
        password,
        user.password
      )
      if (!isPasswordValid) throw new Error("Invalid password")

      const token = await jwtTokenService.generateToken(user)
      return { token, user }
    },
  },
}
