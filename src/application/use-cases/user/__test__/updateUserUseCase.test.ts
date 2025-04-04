/* eslint-disable @typescript-eslint/unbound-method */
import "reflect-metadata"
import { User, UserRole } from "../../../../domain/entities/user.entity"
import { UpdateUserUseCase } from "../updateUserUseCase"
import { NotFoundError } from "../../../../utils/fixtures/errors/NotFoundError"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { UserRepository } from "../../../../domain/repositories/userRepository"
import { UpdateUserInput } from "../../../dtos/user.dto"

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

const validUpdatedUserInput: UpdateUserInput = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password",
  role: UserRole.ADMIN,
}

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase

  beforeEach(() => {
    updateUserUseCase = new UpdateUserUseCase(mockUserRepository)
  })

  it("should update a user successfully", async () => {
    const user = User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findById.mockResolvedValue(user)

    const updatedUser = await updateUserUseCase.execute(validUpdatedUserInput)

    expect(updatedUser).toEqual(user)
    expect(updatedUser.name).toBe(validUpdatedUserInput.name)
  })

  it("should update only user name", async () => {
    const user = User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findById.mockResolvedValue(user)

    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      name: "Jane Doe",
    })

    expect(updatedUser.name).toBe("Jane Doe")
    expect(updatedUser.email).toBe(user.email)
    expect(updatedUser.role).toBe(user.role)
  })

  it("should update only email", async () => {
    const user = User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findById.mockResolvedValue(user)

    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      email: "john.doeupdated@example.com",
    })

    expect(updatedUser.email).toBe("john.doeupdated@example.com")
    expect(updatedUser.email).toBe(user.email)
    expect(updatedUser.role).toBe(user.role)
  })

  it("should update only password", async () => {
    const user = User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findById.mockResolvedValue(user)

    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      password: "updatedPassword",
    })

    expect(updatedUser.password).toBe("updatedPassword")
  })

  it("should throw a NotFoundError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)

    await expect(
      updateUserUseCase.execute(validUpdatedUserInput)
    ).rejects.toThrow(NotFoundError)

    expect(mockUserRepository.update).not.toHaveBeenCalled()
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
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
    })

    mockUserRepository.findById.mockResolvedValue(user)
    mockUserRepository.update.mockRejectedValue(
      new Error("Failed to update user")
    )

    await expect(
      updateUserUseCase.execute(validUpdatedUserInput)
    ).rejects.toThrow(AppError)

    expect(mockUserRepository.update).toHaveBeenCalledTimes(1)
  })
})
