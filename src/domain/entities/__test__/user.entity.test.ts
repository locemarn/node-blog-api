import { User } from "../user.entity.js"
import { Role } from "../user.entity.js"
describe("User Entity", () => {
  // --- Test Data ---
  const validProps = {
    username: "test",
    email: "test@test.com",
    password: "$2b$10$someValidBcryptHashStringHere",
    role: Role.USER,
  }

  describe("create", () => {
    it("should create a user instance with valid props", () => {
      const user = User.create(validProps)

      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.username).toBe(validProps.username)
      expect(user.email).toBe(validProps.email)
      expect(user.role).toBe(validProps.role)
      expect(user.created_at).toBeDefined()
      expect(user.updated_at).toBeDefined()
      expect(user.created_at).toEqual(user.updated_at)
      expect(user.created_at).toEqual(user.updated_at)
      expect(user.password).toBe(validProps.password)
    })

    it("should throw an error if the username is not provided", () => {
      expect(() => User.create({ ...validProps, username: "" })).toThrow(
        "Username must be at least 2 characters long."
      )
      expect(() =>
        User.create({ ...validProps, username: null as unknown as string })
      ).toThrow("Username must be at least 2 characters long.")
    })

    it("should throw an error if the email is not provided", () => {
      expect(() => User.create({ ...validProps, email: "" })).toThrow(
        "User email cannot be empty."
      )
      expect(() =>
        User.create({ ...validProps, email: null as unknown as string })
      ).toThrow("User email cannot be empty.")
    })

    it("should throw an error if the email is not valid", () => {
      expect(() =>
        User.create({ ...validProps, email: "invalid-email" })
      ).toThrow("Invalid email format: invalid-email")
      expect(() =>
        User.create({ ...validProps, email: null as unknown as string })
      ).toThrow("User email cannot be empty.")
    })

    it("should throw an error if the password is not provided", () => {
      expect(() => User.create({ ...validProps, password: "" })).toThrow(
        "Password hash cannot be empty."
      )
      expect(() =>
        User.create({ ...validProps, password: null as unknown as string })
      ).toThrow("Password hash cannot be empty.")
    })

    it("should throw an error if the role is not provided", () => {
      expect(() =>
        User.create({ ...validProps, role: null as unknown as Role })
      ).toThrow("User role cannot be empty.")

      expect(() =>
        User.create({ ...validProps, role: "" as unknown as Role })
      ).toThrow("User role cannot be empty.")

      expect(() =>
        User.create({ ...validProps, role: "INVALID_ROLE" as unknown as Role })
      ).toThrow("Invalid user role.")
    })
  })

  describe("updateProfile", () => {
    it("should update the user's profile name", () => {
      const user = User.create(validProps)
      user.updateProfile("newUsername")
      expect(user.username).toBe("newUsername")
    })

    it("should throw an error if the new username is not provided", () => {
      const user = User.create(validProps)
      expect(() => user.updateProfile("")).toThrow(
        "Username must be at least 2 characters long."
      )
    })
  })

  describe("changePassword", () => {
    it("should change the user's password", () => {
      const user = User.create(validProps)
      user.changePassword("newPassword")
      expect(user.password).toBe("newPassword")
    })

    it("should throw an error if the new password is not provided", () => {
      const user = User.create(validProps)
      expect(() => user.changePassword("")).toThrow(
        "Password hash cannot be empty."
      )
    })
  })

  describe("updateRole", () => {
    it("should update the user's role", () => {
      const user = User.create(validProps)
      user.updateRole(Role.ADMIN)
      expect(user.role).toBe(Role.ADMIN)
    })

    it("should throw an error if the new role is not provided", () => {
      const user = User.create(validProps)
      expect(() => user.updateRole("" as unknown as Role)).toThrow(
        "User role cannot be empty."
      )
    })

    it("should throw an error if the new role is not valid", () => {
      const user = User.create(validProps)
      expect(() => user.updateRole("INVALID_ROLE" as unknown as Role)).toThrow(
        "Invalid user role."
      )
    })
  })
})
