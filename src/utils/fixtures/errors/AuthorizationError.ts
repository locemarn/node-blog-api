import { AppError } from "./AppError"

/**
 * Represents an error due to insufficient permissions to perform an action.
 * Typically maps to an HTTP 403 Forbidden status.
 */
export class AuthorizationError extends AppError {
  constructor(message = "Permission denied", cause?: unknown) {
    super(message, 403, cause)
    this.name = "AuthorizationError"
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}
