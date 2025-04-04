// // --- Custom Error ---

import { Role } from "@prisma/client"

import { randomInt } from "node:crypto"

// export class UserDomainError extends Error {
//   constructor(message: string) {
//     super(message)
//     this.name = "UserDomainError"
//   }
// }

export class InvalidUserAttributeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidUserAttributeError"
  }
}

export interface UserProps {
  id?: number
  username: string
  email: string
  password: string
  role: Role
  created_at?: Date
  updated_at?: Date
}

export class User {
  private readonly _id: number
  private _username: string
  private _email: string
  private _password: string
  private _role: Role
  private _created_at: Date
  private _updated_at: Date

  get id(): number {
    return this._id
  }

  get username(): string {
    return this._username
  }

  get email(): string {
    return this._email
  }

  get password(): string {
    return this._password
  }

  get role(): Role {
    return this._role
  }

  get created_at(): Date {
    return new Date(this._created_at.getTime())
  }

  get updated_at(): Date {
    return new Date(this._updated_at.getTime())
  }

  private constructor(props: UserProps) {
    this._id = props.id ?? randomInt(1, 1000)
    this._username = props.username
    this._email = props.email
    this._password = props.password
    this._role = props.role
    const now = new Date()
    this._created_at = props.created_at ?? now
    this._updated_at = props.updated_at ?? now
  }

  // --- Static Factory Method (DDD Aggregate Root Pattern) ---
  // Responsible for validating input and creating a valid User instance.
  public static create(props: {
    username: string
    email: string
    password: string
    role: Role
  }): User {
    this.validateUsername(props.username)
    this.validateEmail(props.email)
    this.validatePassword(props.password)
    this.validateRole(props.role)
    return new User(props)
  }

  // --- Business Methods (Encapsulate State Changes) ---

  /**
   * Updates the user's profile name.
   * @param newUsername The new name for the user. Must not be empty.
   */
  public updateProfile(newUsername: string): void {
    User.validateUsername(newUsername)
    this._username = newUsername
    this.touch()
  }

  /**
   * Changes the user's password hash.
   * The caller is responsible for generating the new hash *before* calling this method.
   * @param newPasswordHash The new, already hashed password. Must not be empty.
   */
  public changePassword(newPasswordHash: string): void {
    User.validatePassword(newPasswordHash) // Validate the new hash format/presence
    this._password = newPasswordHash
    // console.log("this._password", this._password)
    this.touch() // Update the updatedAt timestamp
  }

  /**
   * Updates the user's role.
   * @param newRole The new role for the user. Must be a valid role.
   */
  public updateRole(newRole: Role): void {
    User.validateRole(newRole)
    this._role = newRole
    this.touch()
  }

  // --- Private Helper Methods ---

  /**
   * Updates the `updatedAt` timestamp.
   */
  private touch(): void {
    this._updated_at = new Date()
  }

  // --- Static Validation Helpers (can be reused by methods) ---
  private static validateUsername(username: string): void {
    if (!username || username.trim().length < 2) {
      throw new InvalidUserAttributeError(
        "Username must be at least 2 characters long."
      )
    }
    // Add other name constraints if needed (e.g., max length, allowed characters)
  }

  private static validateEmail(email: string): void {
    if (!email) {
      throw new InvalidUserAttributeError("User email cannot be empty.")
    }
    // Basic email format check (consider a more robust library for production)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new InvalidUserAttributeError(`Invalid email format: ${email}`)
    }
  }

  private static validatePassword(passwordHash: string): void {
    if (!passwordHash) {
      throw new InvalidUserAttributeError("Password hash cannot be empty.")
    }
    // You might add checks for specific hash formats if applicable (e.g., starts with '$2b$')
    // but often just checking for presence is sufficient at the entity level.
  }

  private static validateRole(role: Role): void {
    if (!role) {
      throw new InvalidUserAttributeError("User role cannot be empty.")
    }
    const validRoles = [Role.ADMIN, Role.USER]
    if (!validRoles.includes(role)) {
      throw new InvalidUserAttributeError("Invalid user role.")
    }
  }
}
