import { injectable } from "tsyringe"
import { inject } from "tsyringe"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError"
import { User, UserRole } from "../../../domain/entities/user.entity"
import { AppError } from "../../../utils/fixtures/errors/AppError"
import { UserRepository } from "../../../domain/repositories/userRepository"
import { CreateUserInput } from "../../dtos/user.dto"
import { IPasswordHasher } from "../../contracts/password-hasher.interface"
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository,
    @inject("IPasswordHasher")
    private passwordHasher: IPasswordHasher
  ) {}

  /**
   * Executes the user creation logic.
   * @param input - The data required to create the user.
   * @returns A Promise resolving to the newly created User entity.
   * @throws {ValidationError} if input data is invalid (e.g., empty name/email/password).
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(input: CreateUserInput): Promise<User> {
    // 1. --- Input Validation ---
    // Basic validation (non-empty fields). More complex validation might use a dedicated library/service.
    if (!input.name?.trim()) {
      throw new ValidationError("Name is required")
    }

    if (!input.email?.trim()) {
      throw new ValidationError("Email is required")
    }

    console.log("Input", input)
    if (!input.password?.trim()) {
      throw new ValidationError("Password is required")
    }

    const hashedPassword = await this.passwordHasher.hash(input.password)
    // 2. --- Domain Logic ---
    // Create the user entity
    const user = User.create({
      ...input,
      password: hashedPassword,
      role: input.role ?? UserRole.USER,
    })

    // 3. --- Persistence ---
    // Save the user entity to the database
    try {
      await this.userRepository.save(user)
    } catch (error) {
      throw new AppError(
        "Failed to save the user due to a persistence issue.",
        500,
        error
      )
    }

    return user
  }
}
