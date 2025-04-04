import "reflect-metadata"
import { UserRepository } from "../../../ports/userRepository"
import { GetUserByEmailInput } from "../getUserByEmailUseCase"
import { GetUserByEmailUseCase } from "../getUserByEmailUseCase"
import { UserRole } from "../../../../domain/entities/user.entity"
import { User } from "../../../../domain/entities/user.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validGetUserByEmailInput: GetUserByEmailInput = {
  email: "john.doe@example.com",
}

describe("getUserByEmailUseCase", () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase

  beforeEach(() => {
    getUserByEmailUseCase = new GetUserByEmailUseCase(mockUserRepository)
  })

  it("should return a user by email", async () => {
    const user = User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findByEmail.mockResolvedValue(user)

    const result = await getUserByEmailUseCase.execute(validGetUserByEmailInput)

    expect(result).toBeDefined()
    expect(result.id).toBe(user.id)
    expect(result.name).toBe(user.name)
    expect(result.email).toBe(user.email)
    expect(result.role).toBe(user.role)
  })

  it("should throw a AppError if the user is not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)

    await expect(
      getUserByEmailUseCase.execute(validGetUserByEmailInput)
    ).rejects.toThrow(AppError)
  })

  it("should throw a ValidationError if the email is not provided", async () => {
    await expect(
      getUserByEmailUseCase.execute(undefined as unknown as GetUserByEmailInput)
    ).rejects.toThrow(ValidationError)
  })
})
