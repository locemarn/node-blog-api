import { inject, injectable } from "tsyringe"
import { User } from "../../../domain/entities/user.entity"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError"
import { AppError } from "../../../utils/fixtures/errors/AppError"
import { UserRepository } from "../../../domain/repositories/userRepository"
import { UpdateUserInput } from "../../dtos/user.dto"
import { IPasswordHasher } from "../../contracts/password-hasher.interface"
@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository,
    @inject("IPasswordHasher")
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    user.updateDetails({
      name: input.name ?? user.name,
      email: input.email ?? user.email,
      password: input.password
        ? await this.passwordHasher.hash(input?.password)
        : user.password,
      role: input.role ?? user.role,
    })

    try {
      await this.userRepository.update(user)
    } catch (error) {
      throw new AppError("Failed to update user", 500, error)
    }

    return user
  }
}
