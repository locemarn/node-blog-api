import type { UserRepository } from "../../../../domain/repositories/userRepository.js"
import type { User } from "../../../../domain/entities/user.entity.js"
import { jest } from "@jest/globals" // Use Jest's global object

export const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
  findByEmail: jest.fn(),
}
