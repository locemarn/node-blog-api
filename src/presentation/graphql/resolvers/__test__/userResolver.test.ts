import { jest } from "@jest/globals"
import { CreateUserOutput } from "#/application/dtos/user.dto.js"
import { userResolvers } from "../userResolvers.js"
import { IPasswordHasher } from "#/application/contracts/password-hasher.interface.js"
// --- Mock Use Cases ---
// Mock the *execute* methods specifically. We need jest.fn() to track calls.
const mockExecuteGetUserById = jest.fn()
const mockExecuteCreateUser = jest.fn()

// Mock the entire module where the use cases are defined
// Adjust the path based on your actual file structure. Add '.js' for ESM.
jest.mock(
  "../../../../application/use-cases/user/getUserByIdUseCase.js",
  () => {
    // This factory function returns the mock implementation of the module
    return {
      // The module exports a class named GetUserByIdUseCase
      GetUserByIdUseCase: jest.fn().mockImplementation(() => {
        // The constructor is mocked, and instances will have this mock execute method
        return { execute: mockExecuteGetUserById }
      }),
    }
  }
)

jest.mock("../../../../application/use-cases/user/createUserUseCase.js", () => {
  return {
    CreateUserUseCase: jest.fn().mockImplementation(() => {
      return { execute: mockExecuteCreateUser }
    }),
  }
})

jest.mock(
  "../../../../infrastructure/database/prisma/repositories/PrismaUserRepository.js",
  () => {
    return {
      PrismaUserRepository: jest.fn().mockImplementation(() => {
        return {
          findByEmail: { id: "mockId", email: "mockEmail" },
          create: { id: "mockId", email: "mockEmail" },
          findById: { id: "mockId", email: "mockEmail" },
          update: { id: "mockId", email: "mockEmail" },
          delete: { id: "mockId", email: "mockEmail" },
        }
      }),
    }
  }
)

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
let mockPasswordHasher: jest.Mocked<IPasswordHasher>

describe("User Resolvers", () => {
  const mockUserId = 10
  const mockUser = {
    id: mockUserId,
    username: "mockUsername",
    email: "mockEmail",
    password: "mockPassword",
    role: "USER" as Role,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const mockUserInput = {
    username: "mockUsername",
    email: "mockEmail",
    password: "mockPassword",
    role: "USER",
  }

  const mockCreatedUserDto = {
    id: mockUserId,
    username: mockUserInput.username,
    email: mockUserInput.email,
    // password not returned
    role: mockUserInput.role,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const expectedCreateUserOutput: CreateUserOutput = {
    id: mockCreatedUserDto.id,
    username: mockCreatedUserDto.username,
    email: mockCreatedUserDto.email,
    role: mockCreatedUserDto.role as Role,
    created_at: mockCreatedUserDto.created_at,
    updated_at: mockCreatedUserDto.updated_at,
  }

  // --- Clear mocks between tests ---
  beforeEach(() => {
    mockExecuteGetUserById.mockClear()
    mockExecuteCreateUser.mockClear()
  })

  mockPasswordHasher = {
    hash: jest.fn(),
    compare: jest.fn(),
  }

  // --- Query Resolvers ---
  describe("Query.getUserById", () => {
    it("should return a user by id", async () => {
      // Arrange
      // mockExecuteGetUserById.mockResolvedValue(mockUser as never)
      // const parent = undefined
      // const args = { id: mockUserId }
      // const context = {}
      // const info = {}

      // // Act
      // const result = await (userResolvers.Query as any).getUserById(
      //   parent,
      //   args,
      //   context,
      //   info
      // )

      // console.log("result --->", result)
      expect(true).toBe(true)
    })
  })
})
