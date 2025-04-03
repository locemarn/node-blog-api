export class AppError extends Error {
  public readonly statusCode: number
  public readonly cause?: unknown // Can be Error or other types

  constructor(message: string, statusCode: number = 500, cause?: unknown) {
    // Call the native Error constructor with only the message
    super(message)

    // Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype)

    // Set the error name to the class name for better identification
    this.name = this.constructor.name

    // Store the custom properties
    this.statusCode = statusCode
    this.cause = cause // Store the cause if provided

    // Capture stack trace, excluding the constructor call
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
