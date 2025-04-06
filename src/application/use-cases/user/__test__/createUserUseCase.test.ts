import "reflect-metadata"
import { UserRepository } from "../../../../domain/repositories/userRepository.js"
import { IPasswordHasher } from "../../../contracts/password-hasher.interface.js"
import { CreateUserInput } from "../../../dtos/user.dto.js"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError.js"
import { AppError } from "../../../../utils/fixtures/errors/AppError.js"
import { Role } from "@prisma/client"
import { User } from "../../../../domain/entities/user.entity.js"
import { CreateUserUseCase } from "../createUserUseCase.js"
import { jest } from "@jest/globals"
let mockUserRepository: jest.Mocked<UserRepository>
let mockPasswordHasher: jest.Mocked<IPasswordHasher>
let createUserUseCase: CreateUserUseCase

// --- Test Setup ---
beforeEach(() => {
  // Create new mock functions for each test
  mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(), // Add other methods as needed
    save: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
  }

  mockPasswordHasher = {
    hash: jest.fn(),
    compare: jest.fn(),
  }

  // Manually instantiate the Use Case with the MOCKS
  // We do NOT use tsyringe.resolve here for unit testing isolation
  createUserUseCase = new CreateUserUseCase(
    mockUserRepository,
    mockPasswordHasher
  )

  // Mock the static User.create method - IMPORTANT for checking entity creation logic
  // We spy on it to ensure it's called correctly, but let the original logic run
  // unless we need to mock its internal behavior specifically.
  jest.spyOn(User, "create")
})

// --- Clear Mocks After Each Test ---
afterEach(() => {
  jest.restoreAllMocks() // Restores original implementations (incl. User.create spy)
  jest.clearAllMocks() // Clears call counts etc.
})

// --- Test Suite ---
describe("CreateUserUseCase", () => {
  const validInput: CreateUserInput = {
    username: "testUser", // Include spaces to test trimming
    email: "test@example.com",
    password: "password123",
    role: "USER",
  }

  const createdUser = User.create({
    username: "testUser",
    email: "test@example.com",
    password: "hashed_password",
    role: Role.USER,
  })

  it("should successfully create a new user with valid input and default role", async () => {
    // Arrange
    const expectedHashedPassword = "expectedHashedPassword"
    const expectedUser = createdUser

    mockUserRepository.findByEmail.mockResolvedValue(null)
    mockPasswordHasher.hash.mockResolvedValue(expectedHashedPassword)
    mockUserRepository.save.mockResolvedValue({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      password: expectedHashedPassword,
      role: createdUser.role,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    } as User)

    // Act
    const sut = await createUserUseCase.execute(validInput)

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      validInput.email
    )
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validInput.password)
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: Role.USER,
      })
    )
    expect(sut.role).toEqual(Role.USER)
    expect(sut.id).toBe(createdUser.id)
  })

  // --- Validation Error Tests ---

  test.each([
    [{ ...validInput, username: "" }, "Username is required"],
    [{ ...validInput, username: "  " }, "Username is required"],
    [{ ...validInput, email: "" }, "Email is required"],
    [{ ...validInput, email: "  " }, "Email is required"],
    [{ ...validInput, password: "" }, "Password is required"],
    [{ ...validInput, password: "  " }, "Password is required"],
  ])(
    "should throw ValidationError if required field '%s' is missing or empty",
    async (invalidInput, expectedErrorMsg) => {
      // Arrange - No mock setup needed as validation fails early

      // Act & Assert
      await expect(
        createUserUseCase.execute(invalidInput as CreateUserInput)
      ).rejects.toThrow(ValidationError)
      await expect(
        createUserUseCase.execute(invalidInput as CreateUserInput)
      ).rejects.toThrow(expectedErrorMsg)

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled()
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
    }
  )

  it("should throw ValidationError if the provided role is invalid", async () => {
    // Arrange
    const invalidInput = {
      ...validInput,
      role: "INVALID_ROLE" as any, // Force an invalid role type
    }

    // Act & Assert
    await expect(createUserUseCase.execute(invalidInput)).rejects.toThrow(
      ValidationError
    )
    await expect(createUserUseCase.execute(invalidInput)).rejects.toThrow(
      `Invalid user role specified: ${invalidInput.role}`
    )

    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled() // Should fail before repo check
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  it("should throw ValidationError if user with the email already exists", async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(createdUser) // Simulate existing user

    // Act & Assert
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      ValidationError
    )
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      "User with this email already exists"
    )

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2)
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      "test@example.com"
    )
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  // --- Error Handling Tests ---

  it("should throw AppError if password hashing fails", async () => {
    // Arrange
    const hashingError = new Error("Hashing failed")
    mockUserRepository.findByEmail.mockResolvedValue(null) // User not found
    mockPasswordHasher.hash.mockRejectedValue(hashingError) // Simulate hashing error

    // Act & Assert
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      AppError
    )
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      "An unexpected error occurred while creating the user."
    )

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2)
    expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(2)
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  it("should throw AppError if repository findByEmail fails", async () => {
    // Arrange
    const repoError = new Error("Database connection error")
    mockUserRepository.findByEmail.mockRejectedValue(repoError) // Simulate findByEmail error

    // Act & Assert
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      AppError
    )
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      "An unexpected error occurred while creating the user."
    )

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2)
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  it("should throw AppError if repository save fails", async () => {
    // Arrange
    const repoError = new Error("Failed to save user")
    mockUserRepository.findByEmail.mockResolvedValue(null)
    mockPasswordHasher.hash.mockResolvedValue("hashed_password")
    mockUserRepository.save.mockRejectedValue(repoError) // Simulate save error

    // Act & Assert
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      AppError
    )
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      "An unexpected error occurred while creating the user."
    )

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2)
    expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(2)
    expect(User.create).toHaveBeenCalledTimes(2)
    expect(mockUserRepository.save).toHaveBeenCalledTimes(2)
  })

  it("should re-throw AppError if caught during execution", async () => {
    // Arrange
    const specificAppError = new AppError("Specific DB issue", 409)
    mockUserRepository.findByEmail.mockRejectedValue(specificAppError)

    // Act & Assert
    // We expect the *original* AppError to be thrown, not the generic one
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      AppError
    )
    await expect(createUserUseCase.execute(validInput)).rejects.toThrow(
      specificAppError.message
    )
    // Optionally check the status code if needed:
    await expect(createUserUseCase.execute(validInput)).rejects.toHaveProperty(
      "statusCode",
      409
    )
  })
})
