import { inject, injectable } from "tsyringe"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"
import { UpdateUserInput } from "../../dtos/user.dto.js"
import { IPasswordHasher } from "../../contracts/password-hasher.interface.js"
import { BcryptPasswordHasher } from "../../../infrastructure/cryptography/bcrypt-password-hasher.js"
import { User } from "../../../domain/entities/user.entity.js"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { Role } from "../../../domain/entities/user.entity.js"
@injectable()
export class UpdateUserUseCase {
  private _passwordHasher: IPasswordHasher
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository
  ) {
    this._passwordHasher = new BcryptPasswordHasher()
  }

  async execute(input: UpdateUserInput): Promise<User> {
    const userId = +input.id
    if (!userId) throw new AppError("User ID is required", 400)
    const foundUser = await this.userRepository.findById(input.id)
    if (!foundUser) throw new NotFoundError("User not found")

    const user = User.restore(foundUser)
    if (input.username) {
      const res = user.updateProfile(input.username)
    }

    if (input.password) {
      const hashedPassword = await this._passwordHasher.hash(input.password)
      user.changePassword(hashedPassword)
    }

    if (input.role) {
      user.updateRole(input.role as Role)
    }

    try {
      const updatedUser = await this.userRepository.update(user)
      return updatedUser
    } catch (error) {
      throw new AppError("Failed to update user", 500, error)
    }
  }
}
