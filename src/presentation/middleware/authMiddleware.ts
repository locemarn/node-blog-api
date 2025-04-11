import { JwtTokenService } from "#/infrastructure/libs/jwt/jwtService.js"
import { Request, Response, NextFunction } from "express"

export class AuthMiddleware {
  private _tokenService: JwtTokenService

  constructor(tokenService: JwtTokenService) {
    this._tokenService = tokenService
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization
    // if (!authHeader) {
    //   res
    //     .status(401)
    //     .json({ error: "Authorization header missing or malformed" })
    //   return
    // }

    if (!authHeader?.startsWith("Bearer ")) {
      // No token provided → allow anonymous access
      return next()
    }

    const token = authHeader.replace("Bearer ", "")

    try {
      const payload = await this._tokenService.verifyToken(token)
      req.user = payload
      next()
    } catch (error) {
      res.status(401).json({ error: "Invalid token" })
      return
    }
  }
}
