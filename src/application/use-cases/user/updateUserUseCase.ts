import { injectable } from "tsyringe"
import { User } from "../../../domain/entities/user.entity"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError"
import { AppError } from "../../../utils/fixtures/errors/AppError"
import { UserRepository } from "../../../domain/repositories/userRepository"
import { UpdateUserInput } from "../../dtos/user.dto"

@injectable()
export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    user.updateDetails({
      name: input.name ?? user.name,
      email: input.email ?? user.email,
      password: input.password ?? user.password,
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
