import { Category, CategoryDomainError } from "../category.entity"

describe("Category Entity", () => {
  describe("create", () => {
    it("should create a category", () => {
      const category = Category.create({ name: "Test Category" })
      expect(category).toBeDefined()
      expect(category.id).toBeDefined()
      expect(category.name).toBe("Test Category")
    })

    it("should throw an error if the name is not provided", () => {
      expect(() => Category.create({ name: "" })).toThrow(CategoryDomainError)
    })

    it("should throw an error if the name is less than 3 characters", () => {
      expect(() => Category.create({ name: "Te" })).toThrow(CategoryDomainError)
    })

    it("should throw an error if the name is more than 50 characters", () => {
      expect(() => Category.create({ name: "a".repeat(51) })).toThrow(
        CategoryDomainError
      )
    })
  })

  describe("updateDetails", () => {
    it("should update the name of the category", () => {
      const category = Category.create({ name: "Test Category" })
      category.updateDetails({ name: "Updated Category" })
      expect(category.name).toBe("Updated Category")
    })

    it("should throw an error if the name is not provided", () => {
      const category = Category.create({ name: "Test Category" })
      expect(() => category.updateDetails({ name: "" })).toThrow(
        CategoryDomainError
      )
    })

    it("should throw an error if the name is less than 3 characters", () => {
      const category = Category.create({ name: "Test Category" })
      expect(() => category.updateDetails({ name: "Te" })).toThrow(
        CategoryDomainError
      )
    })

    it("should throw an error if the name is more than 50 characters", () => {
      const category = Category.create({ name: "Test Category" })
      expect(() => category.updateDetails({ name: "a".repeat(51) })).toThrow(
        CategoryDomainError
      )
    })
  })
})
