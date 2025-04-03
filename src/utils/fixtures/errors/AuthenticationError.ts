import { AppError } from "./AppError"

/**
 * Represents an error when authentication is required but missing or invalid.
 * Typically maps to an HTTP 401 Unauthorized status.
 */
export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", cause?: unknown) {
    // Removed type annotation
    super(message, 401, cause)
    this.name = "AuthenticationError"
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}
