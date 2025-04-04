import { injectable } from "tsyringe"
import { inject } from "tsyringe"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError"
import { User } from "../../../domain/entities/user.entity"
import { AppError } from "../../../utils/fixtures/errors/AppError"
import { UserRepository } from "../../../domain/repositories/userRepository"
import { CreateUserInput } from "../../dtos/user.dto"
import { IPasswordHasher } from "../../contracts/password-hasher.interface"
import { Role } from "@prisma/client"
import { BcryptPasswordHasher } from "../../../infrastructure/cryptography/bcrypt-password-hasher"

@injectable()
export class CreateUserUseCase {
  private _passwordHasher: IPasswordHasher
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository
  ) {
    this._passwordHasher = new BcryptPasswordHasher()
  }

  /**
   * Executes the user creation logic.
   * @param input - The data required to create the user.
   * @returns A Promise resolving to the newly created User entity.
   * @throws {ValidationError} if input data is invalid (e.g., empty name/email/password).
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(input: CreateUserInput): Promise<User> {
    if (!input.username?.trim()) {
      throw new ValidationError("Username is required")
    }

    if (!input.email?.trim()) {
      throw new ValidationError("Email is required")
    }

    if (!input.password?.trim()) {
      throw new ValidationError("Password is required")
    }

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(input.email)
      if (existingUser) {
        throw new ValidationError("User already exists")
      }

      const hashedPassword = await this._passwordHasher.hash(input.password)

      const validRoles = [Role.ADMIN, Role.USER]
      if (input.role && !validRoles.includes(input.role)) {
        throw new ValidationError("Invalid user role")
      }

      const userEntity = User.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
        role: input.role ?? Role.USER,
      })
      const newUser = await this.userRepository.save(userEntity)
      return newUser
    } catch (error) {
      const err = error as Error
      // console.error("error ---->", err.message)
      throw new AppError(err.message, 500, error)
    }
  }
}
