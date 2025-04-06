import { inject, injectable } from "tsyringe"
import { AppError } from "../../../utils/fixtures/errors/AppError.js"
import { UpdateUserInput } from "../../dtos/user.dto.js"
import { IPasswordHasher } from "../../contracts/password-hasher.interface.js"
import { BcryptPasswordHasher } from "../../../infrastructure/cryptography/bcrypt-password-hasher.js"
import { User } from "../../../domain/entities/user.entity.js"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError.js"
import type { UserRepository } from "../../../domain/repositories/userRepository.js"
import { Role } from "@prisma/client"
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
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    if (input.username) {
      user.updateProfile(input.username)
    }

    if (input.password) {
      // console.log("input.password", input.password)
      const hashedPassword = await this._passwordHasher.hash(input.password)
      // console.log("hashedPassword", hashedPassword)
      user.changePassword(hashedPassword)
    }

    if (input.role) {
      user.updateRole(input.role as Role)
    }

    try {
      const updatedUser = await this.userRepository.update(user)
      // console.log("updatedUser", updatedUser)
      return updatedUser
    } catch (error) {
      throw new AppError("Failed to update user", 500, error)
    }
  }
}
