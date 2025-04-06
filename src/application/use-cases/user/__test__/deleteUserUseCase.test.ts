/* eslint-disable @typescript-eslint/unbound-method */
import "reflect-metadata"
import { Role } from "@prisma/client"
import { User } from "../../../../domain/entities/user.entity.js"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError.js"
import { UserRepository } from "../../../../domain/repositories/userRepository.js"
import { AppError } from "../../../../utils/fixtures/errors/AppError.js"
import { DeleteUserUseCase } from "../deleteUserUseCase.js"
import { jest } from "@jest/globals"
const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase

  beforeEach(() => {
    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository)
  })

  it("should delete a user successfully", async () => {
    const user = User.create({
      username: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: Role.USER,
    })

    mockUserRepository.findById.mockResolvedValue(user)

    await deleteUserUseCase.execute({ id: user.id })

    expect(mockUserRepository.deleteById).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.deleteById).toHaveBeenCalledWith(user.id)
  })

  it("should throw a ValidationError if the user id is not provided", async () => {
    await expect(
      deleteUserUseCase.execute({ id: undefined as unknown as number })
    ).rejects.toThrow(ValidationError)
  })

  it("should throw a AppError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)

    await expect(deleteUserUseCase.execute({ id: 1 })).rejects.toThrow(AppError)
  })

  it("should throw a AppError if the user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null)

    await expect(deleteUserUseCase.execute({ id: 1 })).rejects.toThrow(AppError)
  })
})
