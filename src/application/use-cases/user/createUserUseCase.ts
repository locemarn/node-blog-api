import { injectable } from "tsyringe"
import { inject } from "tsyringe"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError.js"
import { User } from "../../../domain/entities/user.entity.js"
import { Role } from "@prisma/client"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { CreateUserInput } from "../../dtos/user.dto.js"
import { IPasswordHasher } from "../../../application/contracts/password-hasher.interface.js"

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository,
    @inject("PasswordHasher")
    private readonly passwordHasher: IPasswordHasher
  ) {}

  /**
   * Executes the user creation logic.
   * @param {CreateUserInput} input - The data required to create the user. Contains username, email, password, and optional role.
   * @returns {Promise<User>} A Promise resolving to the newly created User entity.
   * @throws {ValidationError} If input data is invalid (e.g., empty fields, invalid role, email already exists).
   * @throws {AppError} For unexpected errors during the process.
   */
  async execute({
    username,
    email,
    password,
    role,
  }: CreateUserInput): Promise<User> {
    const trimmedUsername = username?.trim()
    if (!trimmedUsername) throw new ValidationError("Username is required")

    const trimmedEmail = email?.trim()
    if (!trimmedEmail) throw new ValidationError("Email is required")

    const trimmedPassword = password?.trim()
    if (!trimmedPassword) throw new ValidationError("Password is required")

    const targetRole = (role ?? Role.USER) as unknown as Role
    if (!Object.values(Role).includes(targetRole)) {
      throw new ValidationError(`Invalid user role specified: ${role}`)
    }

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email)
      if (existingUser)
        throw new ValidationError("User with this email already exists")

      const hashedPassword = await this.passwordHasher.hash(trimmedPassword)

      const userEntity = User.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashedPassword,
        role: targetRole,
      })

      const newUser = await this.userRepository.save(userEntity)
      return newUser
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        // Re-throw known application-specific errors directly
        throw error
      }
      // console.error("Unexpected error during user creation:", error)
      throw new AppError(
        "An unexpected error occurred while creating the user.",
        500, // Internal Server Error status code
        error instanceof Error ? error : undefined // Include original error as cause
      )
    }
  }
}
