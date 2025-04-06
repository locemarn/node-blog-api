import { IResolvers } from "@graphql-tools/utils"
import { DateResolver } from "graphql-scalars"
import { PrismaUserRepository } from "../../../infrastructure/database/prisma/repositories/PrismaUserRepository.js"
import { GetUserByIdUseCase } from "../../../application/use-cases/user/getUserByIdUseCase.js"

const userRepository = new PrismaUserRepository()
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

export const userResolvers: IResolvers = {
  Date: DateResolver,

  Query: {
    getUserById: async (_, { id }: { id: number }) => {
      const user = await getUserByIdUseCase.execute(id)
      return user
    },
  },
}
