import "reflect-metadata"
import { NotFoundError } from "../../../../utils/fixtures/errors/NotFoundError.js"
import { AppError } from "../../../../utils/fixtures/errors/AppError.js"
import { UserRepository } from "../../../../domain/repositories/userRepository.js"
import { UpdateUserInput } from "../../../dtos/user.dto.js"
import { IPasswordHasher } from "../../../contracts/password-hasher.interface.js"
import { Role } from "@prisma/client"
import { User } from "../../../../domain/entities/user.entity.js"
import { UpdateUserUseCase } from "../updateUserUseCase.js"
import { jest } from "@jest/globals"
const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validUpdatedUserInput: UpdateUserInput = {
  id: 1,
  username: "John Doe",
  email: "john.doe@example.com",
  password: "$2b$10$someValidBcryptHashStringHere",
  role: "USER",
}

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>
  beforeEach(() => {
    mockPasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    }
    updateUserUseCase = new UpdateUserUseCase(mockUserRepository)
  })

  it("should update a user successfully", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: Role.USER,
    })

    mockPasswordHasher.hash.mockResolvedValue("hashedPassword")

    mockUserRepository.findById.mockResolvedValue(user)
    mockUserRepository.update.mockResolvedValue({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "hashedPassword",
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as User)

    const updatedUser = await updateUserUseCase.execute(validUpdatedUserInput)

    expect(updatedUser.username).toBe(validUpdatedUserInput.username)
    expect(updatedUser.email).toBe(validUpdatedUserInput.email)
    expect(updatedUser.role).toBe(validUpdatedUserInput.role)
    expect(updatedUser.password).not.toBe(validUpdatedUserInput.password)
  })

  it("should update only user username", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: Role.USER,
    })

    mockUserRepository.findById.mockResolvedValue(user)
    mockUserRepository.update.mockResolvedValue({
      id: user.id,
      username: "Jane Doe",
      email: user.email,
      password: user.password,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as User)

    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      username: "Jane Doe",
    })

    console.log("updatedUser", updatedUser)

    expect(updatedUser.username).toBe("Jane Doe")
    expect(updatedUser.email).toBe(user.email)
    expect(updatedUser.role).toBe(user.role)
  })

  it("should update only password", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: Role.USER,
    })

    mockPasswordHasher.hash.mockResolvedValue("hashedPassword")
    mockUserRepository.findById.mockResolvedValue(user)
    mockUserRepository.update.mockResolvedValue({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "hashedPassword",
      role: user.role,
      created_at: user.created_at,
      updated_at: new Date(),
    } as User)

    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      password: "updatedPassword",
    })

    expect(updatedUser.password).toBeDefined()
    expect(updatedUser.password).not.toBe(user.password)
  })

  it("should throw a NotFoundError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)

    await expect(
      updateUserUseCase.execute(validUpdatedUserInput)
    ).rejects.toThrow(NotFoundError)
  })

  it("should throw a AppError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)
    mockUserRepository.update.mockRejectedValue(
      new Error("Failed to update user")
    )

    await expect(
      updateUserUseCase.execute(validUpdatedUserInput)
    ).rejects.toThrow(AppError)
  })

  it("should throw a AppError if update fails", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: Role.USER,
    })

    mockPasswordHasher.hash.mockResolvedValue("hashedPassword")
    mockUserRepository.findById.mockResolvedValue(user)
    mockUserRepository.update.mockRejectedValue(
      new Error("Failed to update user")
    )

    await expect(
      updateUserUseCase.execute(validUpdatedUserInput)
    ).rejects.toThrow(AppError)

    // expect(mockUserRepository.update).toHaveBeenCalledTimes(1)
  })
})
