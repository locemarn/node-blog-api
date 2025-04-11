import { injectable } from "tsyringe"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { DeleteUserInput } from "../../dtos/user.dto.js"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError.js"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"
import { User } from "#/domain/entities/user.entity.js"
@injectable()
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Executes the use case to delete a user by their ID.
   * @param input - The input containing the ID of the user to delete.
   * @returns A Promise resolving to the User entity.
   * @throws {NotFoundError} if the user is not found.
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(input: DeleteUserInput): Promise<User | null> {
    if (!input || !input.id) {
      throw new ValidationError("User ID is required")
    }

    try {
      const user = await this.userRepository.findById(input.id)
      if (!user) throw new NotFoundError("User not found")

      return await this.userRepository.deleteById(input.id)
    } catch (error) {
      throw new AppError("Failed to delete user", 500, error)
    }
  }
}
