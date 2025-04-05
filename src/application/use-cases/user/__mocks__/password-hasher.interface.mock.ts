import type { IPasswordHasher } from "../../../contracts/password-hasher.interface"
import { jest } from "@jest/globals"

export const mockPasswordHasher: jest.Mocked<IPasswordHasher> = {
  hash: jest
    .fn()
    .mockResolvedValue("hashedPassword" as never) as jest.MockedFunction<
    IPasswordHasher["hash"]
  >, // Mock implementation for hash
  compare: jest.fn().mockResolvedValue(true as never) as jest.MockedFunction<
    IPasswordHasher["compare"]
  >, // Mock implementation for compare
}
