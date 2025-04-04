import { randomInt } from "node:crypto"

// --- Custom Error ---
export class CategoryDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CategoryDomainError"
  }
}

export interface CategoryProps {
  id: number
  name: string
}

export class Category {
  private _id: number
  private _name: string

  constructor(props: CategoryProps) {
    this._id = props.id
    this._name = props.name
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  private static validateName(name: string): void {
    if (!name) {
      throw new CategoryDomainError("Name is required")
    }

    if (name.length < 3) {
      throw new CategoryDomainError("Name must be at least 3 characters long")
    }

    if (name.length > 50) {
      throw new CategoryDomainError("Name must be less than 50 characters long")
    }
  }

  public static create(props: Omit<CategoryProps, "id">): Category {
    Category.validateName(props.name)

    const category = new Category({
      ...props,
      id: Number(randomInt(1, 1000)),
      name: props.name,
    })

    return category
  }

  updateDetails(props: Pick<CategoryProps, "name">) {
    Category.validateName(props.name)

    this._name = props.name
  }
}
