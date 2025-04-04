import "reflect-metadata"
import { User } from "../../../../domain/entities/user.entity"
import { UserRepository } from "../../../../domain/repositories/userRepository"
import { CreateUserInput } from "../../../dtos/user.dto"
import { CreateUserUseCase } from "../createUserUseCase"
// import BcryptPasswordHasher from "../../../infrastructure/cryptography/bcrypt-password-hasher"

const mockHash = jest.fn()
jest.mock(
  "../../../../infrastructure/cryptography/bcrypt-password-hasher",
  () => {
    return {
      BcryptPasswordHasher: jest.fn().mockImplementation(() => {
        // The instance created by `new BcryptPasswordHasher()` inside the use case
        // will have this shape.
        return {
          hash: mockHash, // Provide the mock function for the 'hash' method
          compare: jest.fn(), // Add compare if it exists and might be called (though not in this use case)
        }
      }),
    }
  }
)

const mockUserRepository: jest.Mocked<UserRepository> = {
  findByEmail: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validInput: CreateUserInput = {
  username: "Test User",
  email: "test@example.com",
  password: "password123",
  role: "USER",
}

const hashedPassword = "hashed_password_from_mock"

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    createUserUseCase = new CreateUserUseCase(mockUserRepository)
  })

  // --- Test Cases ---
  it("should create a new user", async () => {
    // Arrange
    const input = { ...validInput }
    const expectedCreateUserId = 1
    const now = new Date()

    mockUserRepository.findByEmail.mockResolvedValue(null) // User does not exist
    mockHash.mockResolvedValue(hashedPassword) // Returns password hashed

    mockUserRepository.save.mockImplementation((user: User) => {
      return Promise.resolve({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        id: expectedCreateUserId,
        created_at: now,
        updated_at: now,
      } as User)
    })

    // Act
    const sut = await createUserUseCase.execute(input)

    expect(sut).toBeDefined()
    expect(sut.id).toBe(expectedCreateUserId)
    expect(sut.username).toBe(input.username)
    expect(sut.email).toBe(input.email)
    expect(sut.role).toBe(input.role)
    expect(sut.created_at).toBe(now)
    expect(sut.updated_at).toBe(now)
    expect(sut.password).toBe(hashedPassword)
    expect(mockHash).toHaveBeenCalledWith(input.password)
  })

  it("should create an user if 'USER' role as default, if role is not provider", async () => {
    // Arrange
    const input = { ...validInput, role: null } as unknown as CreateUserInput

    // Act
    const sut = await createUserUseCase.execute(input)

    // Assert
    expect(sut).toBeDefined()
    expect(sut.role).toBe("USER")
  })

  it("should throw an error if the user already exists", async () => {
    // Arrange
    const input = { ...validInput }
    const existingUser = { ...validInput, id: 1 } as User
    mockUserRepository.findByEmail.mockResolvedValue(existingUser)

    // Act & Assert
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "User already exists"
    )
  })

  it("should throw an error if the user is not valid", async () => {
    // Arrange
    const input = { ...validInput, username: "" }

    // Act & Assert
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Username is required"
    )
  })

  it("should throw an error if the email is not valid", async () => {
    // Arrange
    const input = { ...validInput, email: "" }

    // Act & Assert
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Email is required"
    )
  })

  it("should throw an error if the password is not valid", async () => {
    // Arrange
    const input = { ...validInput, password: "" }

    // Act & Assert
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Password is required"
    )
  })

  it("should throw an error if the role is not valid", async () => {
    // Arrange
    const input = {
      email: "valid_email@example.com",
      password: "valid_password",
      username: "valid_username",
      role: "INVALID_ROLE",
    } as unknown as CreateUserInput

    mockUserRepository.findByEmail.mockResolvedValue(null) // User does not exist
    mockHash.mockResolvedValue(hashedPassword)

    // Act & Assert
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Invalid user role"
    )
  })
})
