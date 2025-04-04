import { injectable } from "tsyringe"
import { User, UserRole } from "../../../domain/entities/user.entity"
import { NotFoundError } from "../../../utils/fixtures/errors/NotFoundError"
import { UserRepository } from "../../ports/userRepository"
import { AppError } from "../../../utils/fixtures/errors/AppError"

export interface UpdateUserInput {
  id: number
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

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
