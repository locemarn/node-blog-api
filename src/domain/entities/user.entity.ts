// --- Custom Error ---

import { randomInt } from "node:crypto"

export class UserDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserDomainError"
  }
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface UserProps {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Clock {
  now(): Date
}

const systemClock: Clock = {
  now: () => new Date(),
}

export class User {
  private _id: number
  private _name: string
  private _email: string
  private _password: string
  private _role: UserRole
  private _createdAt: Date
  private _updatedAt: Date

  private static clock: Clock = systemClock

  private constructor(props: UserProps) {
    this._id = props.id
    this._name = props.name
    this._email = props.email
    this._password = props.password
    this._role = props.role
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // --- Getters for Encapsulation ---
  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get email(): string {
    return this._email
  }
  get password(): string {
    return this._password
  }
  get role(): UserRole {
    return this._role
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }

  // --- Validation logic ---
  private static validateName(name: string) {
    if (!name?.trim().length) {
      throw new UserDomainError("Name is required")
    }
  }

  private static validateEmail(email: string) {
    if (!email?.trim().length) {
      throw new UserDomainError("Email is required")
    }

    if (!User.validateEmailRegex(email)) {
      throw new UserDomainError("Invalid email format")
    }
  }

  private static validateEmailRegex(email: string) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(
      String(email).toLowerCase()
    )
  }

  private static validatePassword(password: string) {
    if (!password?.trim().length) {
      throw new UserDomainError("Password is required")
    }
  }

  public static create(
    props: Omit<UserProps, "id" | "createdAt" | "updatedAt">
  ): User {
    User.validateName(props.name)
    User.validateEmail(props.email)
    User.validatePassword(props.password)

    const now = User.clock.now()

    const user = new User({
      ...props,
      id: Number(randomInt(1, 1000)),
      role: UserRole.USER,
      createdAt: now,
      updatedAt: now,
    })

    return user
  }

  updateDetails(props: Pick<UserProps, "name" | "email" | "password">) {
    User.validateName(props.name)
    User.validateEmail(props.email)
    User.validatePassword(props.password)

    this._name = props.name
    this._email = props.email
    this._password = props.password
    this._updatedAt = User.clock.now()
  }

  adminRole(): void {
    if (this._role === UserRole.ADMIN) {
      throw new UserDomainError("User is already an admin")
    }
    this._role = UserRole.ADMIN
    this._updatedAt = User.clock.now()
  }

  userRole(): void {
    if (this._role === UserRole.USER) {
      throw new UserDomainError("User is already a user")
    }
    this._role = UserRole.USER
    this._updatedAt = User.clock.now()
  }

  // --- Domain Methods ---
  public static setClock(clock: Clock): void {
    User.clock = clock
  }
}
