import "reflect-metadata"
import { UserRepository } from "../../../../domain/repositories/userRepository"
import { CreateUserUseCase } from "../createUserUseCase"
import { IPasswordHasher } from "../../../contracts/password-hasher.interface"
import { CreateUserInput } from "../../../dtos/user.dto"
import { UserRole } from "../../../../domain/entities/user.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validCreateUserInput: CreateUserInput = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234$",
  role: UserRole.ADMIN,
}

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase
  const mockPasswordHasher: jest.Mocked<IPasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(), // Include compare if it's in your interface
  }

  beforeEach(() => {
    jest.clearAllMocks()
    createUserUseCase = new CreateUserUseCase(
      mockUserRepository,
      mockPasswordHasher
    )
  })

  describe("execute", () => {
    it("should create and save a user successfully", async () => {
      // Arrange
      const input: CreateUserInput = {
        ...validCreateUserInput,
      }

      mockPasswordHasher.hash.mockResolvedValue("hashedPassword")

      // Act
      const result = await createUserUseCase.execute(input)
      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(input.name)
    })

    it("should throw a ValidationError if name is empty", async () => {
      const input: CreateUserInput = {
        ...validCreateUserInput,
        name: "",
      }

      await expect(createUserUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if email is empty", async () => {
      const input: CreateUserInput = {
        ...validCreateUserInput,
        email: "",
      }

      await expect(createUserUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if password is empty", async () => {
      const input: CreateUserInput = {
        ...validCreateUserInput,
        password: "",
      }

      await expect(createUserUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should returns a user with the default role if role is not provided", async () => {
      const input: CreateUserInput = {
        ...validCreateUserInput,
        role: undefined,
      }

      mockPasswordHasher.hash.mockResolvedValue("hashedPassword")

      const result = await createUserUseCase.execute(input)

      expect(result).toBeDefined()
      expect(result.role).toBe(UserRole.USER)
    })

    it("should throw an AppError if the user is not saved", async () => {
      const input: CreateUserInput = {
        ...validCreateUserInput,
      }

      mockPasswordHasher.hash.mockResolvedValue("hashedPassword")

      mockUserRepository.save.mockRejectedValue(new Error("Failed to save"))

      await expect(createUserUseCase.execute(input)).rejects.toThrow(AppError)
    })
  })
})
