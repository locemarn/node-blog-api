import { User } from "../entities/user.entity.js"

export interface ITokenService {
  generateToken(user: User): Promise<string>
  verifyToken(token: string): Promise<User>
}
