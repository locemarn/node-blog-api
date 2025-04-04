import { Clock, User, UserDomainError, UserRole } from "../user.entity"

class MockClock implements Clock {
  private _currentTime: Date

  constructor(initialTime: Date = new Date("2025-01-01T10:00:00.000Z")) {
    this._currentTime = initialTime
  }

  now(): Date {
    return this._currentTime
  }

  tick(ms: number): void {
    this._currentTime = new Date(this._currentTime.getTime() + ms)
  }

  setTime(date: Date): void {
    this._currentTime = date
  }
}

describe("User Entity", () => {
  let mockClock: MockClock
  const validCreateProps = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "$password1234",
    role: UserRole.USER,
  }

  beforeEach(() => {
    mockClock = new MockClock()
    User.setClock(mockClock)
  })

  // --- testing Creation ---
  describe("User.Creation factory method", () => {
    it("should create a user with valid props", () => {
      const user = User.create(validCreateProps)

      expect(user).toBeInstanceOf(User)
      expect(user.id).toBeDefined()
      expect(user.name).toBe(validCreateProps.name)
      expect(user.email).toBe(validCreateProps.email)
      expect(user.role).toBe(validCreateProps.role)
      expect(user.createdAt).toBeDefined()
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeDefined()
      expect(user.updatedAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBe(user.createdAt)
    })

    it("should throw an UserDomainError if name is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        name: "     ",
      }

      expect(() => User.create(invalidCreateProps)).toThrow(UserDomainError)
    })

    it("should throw an UserDomainError if email is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        email: "     ",
      }

      expect(() => User.create(invalidCreateProps)).toThrow(UserDomainError)
    })

    it("should throw an UserDomainError if password is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        password: "     ",
      }

      expect(() => User.create(invalidCreateProps)).toThrow(UserDomainError)
    })

    it("should set a defaulet value to user role if value is missing", () => {
      const user = User.create({
        ...validCreateProps,
        role: undefined as unknown as UserRole,
      })

      expect(user.role).toBe(UserRole.USER)
    })

    it("should throw an UserDomainError if validateEmailRegex fail", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        email: "invalid-email",
      }

      expect(() => User.create(invalidCreateProps)).toThrow(UserDomainError)
    })
  })

  describe("User.updateDetails method", () => {
    it("should update user details with valid props", () => {
      const user = User.create(validCreateProps)
      const initialUpdatedAt = user.updatedAt
      const updatedName = "Jane Doe Updated"
      const updatedEmail = "jane.doe.updated@example.com"
      const updatedPassword = "!newpassword123updated"

      mockClock.tick(10000)

      user.updateDetails({
        name: updatedName,
        email: updatedEmail,
        password: updatedPassword,
        role: user.role,
      })

      expect(user.name).toBe(updatedName)
      expect(user.email).toBe(updatedEmail)
      expect(user.password).toBe(updatedPassword)
      expect(user.updatedAt).not.toBe(initialUpdatedAt)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it("should throw an UserDomainError if name is missing", () => {
      const user = User.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        name: "",
      }

      expect(() => user.updateDetails(invalidUpdateProps)).toThrow(
        UserDomainError
      )
    })

    it("should throw an UserDomainError if email is missing", () => {
      const user = User.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        email: "",
      }

      expect(() => user.updateDetails(invalidUpdateProps)).toThrow(
        UserDomainError
      )
    })

    it("should throw an UserDomainError if password is missing", () => {
      const user = User.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        password: "",
      }

      expect(() => user.updateDetails(invalidUpdateProps)).toThrow(
        UserDomainError
      )
    })
  })

  describe("User.adminRole method", () => {
    it("should set the user role to ADMIN", () => {
      const user = User.create(validCreateProps)
      user.adminRole()
      expect(user.role).toBe(UserRole.ADMIN)
    })

    it("should throw an UserDomainError if user is already an admin", () => {
      const user = User.create(validCreateProps)
      user.adminRole()
      expect(() => user.adminRole()).toThrow(UserDomainError)
    })
  })

  describe("User.userRole method", () => {
    it("should set the user role to USER", () => {
      const user = User.create(validCreateProps)
      user.adminRole()
      user.userRole()
      expect(user.role).toBe(UserRole.USER)
    })

    it("should throw an UserDomainError if user is already a user", () => {
      const user = User.create(validCreateProps)
      expect(() => user.userRole()).toThrow(UserDomainError)
    })
  })
})
