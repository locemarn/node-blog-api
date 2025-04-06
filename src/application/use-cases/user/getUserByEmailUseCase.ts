import { injectable } from "tsyringe"
import { User } from "../../../domain/entities/user.entity.js"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError.js"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { GetUserByEmailInput } from "../../dtos/user.dto.js"

@injectable()
export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Executes the use case to get a user by their email.
   * @param input - The input containing the email of the user to retrieve.
   * @returns A Promise resolving to the User entity.
   * @throws {NotFoundError} if the user is not found.
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(input: GetUserByEmailInput): Promise<User> {
    if (!input?.email) {
      throw new ValidationError("Email is required")
    }

    try {
      const user = await this.userRepository.findByEmail(input.email)

      if (!user) {
        throw new NotFoundError("User not found")
      }

      return user
    } catch (error) {
      throw new AppError("Failed to get user", 500, error)
    }
  }
}
