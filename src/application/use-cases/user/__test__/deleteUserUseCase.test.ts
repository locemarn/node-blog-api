/* eslint-disable @typescript-eslint/unbound-method */
import "reflect-metadata"
import { DeleteUserUseCase } from "../deleteUserUseCase"
import { User, UserRole } from "../../../../domain/entities/user.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"
import { UserRepository } from "../../../../domain/repositories/userRepository"

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
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: UserRole.ADMIN,
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
