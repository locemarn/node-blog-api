import jwt from "jsonwebtoken"
import { ITokenService } from "#/domain/repositories/ITokenRepository.js"
import { User } from "#/domain/entities/user.entity.js"

import config from "#/infrastructure/configs/index.js"

export class JwtTokenService implements ITokenService {
  private readonly secret: string
  private readonly expiresIn: number

  constructor(secret: string, expiresIn: number = 259200000) {
    this.secret = secret
    this.expiresIn = expiresIn
  }

  /**
   * Generates a JWT token for the given user.
   * @param {User} user - The user for whom the token is generated.
   * @returns {Promise<string>} The generated JWT token.
   */
  async generateToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    return await jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    })
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = await jwt.verify(token, this.secret)
      return payload as User
    } catch (error) {
      const err = error as Error
      console.error("Error verifying token:", err)
      throw new Error(err.message || "Failed to verify token")
    }
  }
}
