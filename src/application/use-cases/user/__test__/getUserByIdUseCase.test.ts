import "reflect-metadata"
import { GetUserByIdUseCase } from "../getUserByIdUseCase"
import { User } from "../../../../domain/entities/user.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"
import { UserRepository } from "../../../../domain/repositories/userRepository"
import { GetUserByIdInput } from "../../../dtos/user.dto"

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validGetUserByIdInput: GetUserByIdInput = {
  id: 1,
}

describe("getUserByIdUseCase", () => {
  let getUserByIdUseCase: GetUserByIdUseCase

  beforeEach(() => {
    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository)
  })

  it("should return a user by id", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "USER",
    })

    mockUserRepository.findById.mockResolvedValue(user)

    const result = await getUserByIdUseCase.execute(validGetUserByIdInput.id)

    expect(result).toBeDefined()
    expect(result.id).toBe(user.id)
    expect(result.username).toBe(user.username)
    expect(result.email).toBe(user.email)
    expect(result.role).toBe(user.role)
  })

  it("should throw a AppError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)

    await expect(
      getUserByIdUseCase.execute(validGetUserByIdInput.id)
    ).rejects.toThrow(AppError)
  })

  it("should throw a ValidationError if the user id is not provided", async () => {
    await expect(
      getUserByIdUseCase.execute(undefined as unknown as number)
    ).rejects.toThrow(ValidationError)
  })
})
