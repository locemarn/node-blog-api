/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AppError } from "./AppError.js"

/**
 * Represents an error due to invalid input data provided by the client.
 * Typically maps to an HTTP 400 Bad Request status.
 */
export class ValidationError extends AppError {
  /**
   * Creates an instance of ValidationError.
   * @param message - The specific validation error message.
   * @param cause - The original error/cause (optional).
   */
  constructor(message: string, cause?: unknown) {
    // Call the AppError constructor with a default status code of 400
    super(message, 400, cause)
    this.name = "ValidationError" // Set specific name
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
