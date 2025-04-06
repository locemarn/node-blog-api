import { injectable } from "tsyringe"
import { User } from "../../../domain/entities/user.entity.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError.js"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError.js"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"

@injectable()
export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Executes the use case to get a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A Promise resolving to the User entity.
   * @throws {NotFoundError} if the user is not found.
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(id: number): Promise<User> {
    if (!id) {
      throw new ValidationError("User ID is required")
    }

    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundError("User not found")
      }
      return user
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError("Failed to get user", 500, error)
      }
      throw new AppError("Failed to get user", 500, new Error("Unknown error")) // Handle non-Error cases
    }
  }
}
