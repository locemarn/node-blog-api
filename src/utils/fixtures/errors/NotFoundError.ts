/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AppError } from "./AppError.js"
/**
 * Represents an error when a requested resource could not be found.
 * Typically maps to an HTTP 404 Not Found status.
 */
export class NotFoundError extends AppError {
  /**
   * Creates an instance of NotFoundError.
   * @param message - The message indicating what was not found.
   * @param cause - The original error/cause (optional).
   */
  constructor(message: string, cause?: unknown) {
    // Call the AppError constructor with a default status code of 404
    super(message, 404, cause)
    this.name = "NotFoundError" // Set specific name
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
