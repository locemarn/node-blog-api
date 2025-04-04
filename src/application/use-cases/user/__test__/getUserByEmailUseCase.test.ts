import "reflect-metadata"
import { GetUserByEmailUseCase } from "../getUserByEmailUseCase"
import { User } from "../../../../domain/entities/user.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"
import { UserRepository } from "../../../../domain/repositories/userRepository"
import { GetUserByEmailInput } from "../../../dtos/user.dto"

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
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "USER",
    })

    mockUserRepository.findByEmail.mockResolvedValue(user)

    const result = await getUserByEmailUseCase.execute(validGetUserByEmailInput)

    expect(result).toBeDefined()
    expect(result.id).toBe(user.id)
    expect(result.username).toBe(user.username)
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
