import { PrismaClient } from "@prisma/client"
import { getPrismaClient } from "../client.js"
import { UserRepository } from "../../../../domain/repositories/userRepository.js"
import { User } from "../../../../domain/entities/user.entity.js"

export class PrismaUserRepository implements UserRepository {
  private _prisma: PrismaClient

  constructor() {
    this._prisma = getPrismaClient()
  }

  async findById(id: number): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { id: +id },
    })
    if (!user) return null
    return user as User
  }

  async save(user: User): Promise<User> {
    try {
      const newUser = await this._prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          password: user.password,
          role: user.role,
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
      return newUser as unknown as User
    } catch (error) {
      console.error("prisma save user error ---->", error)
      throw new Error("Failed to save user")
    }
  }

  async update(user: User): Promise<User> {
    try {
      const updatedUser = await this._prisma.user.update({
        where: { id: user.id },
        data: {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          updated_at: new Date(),
        },
      })
      return updatedUser as unknown as User
    } catch (error) {
      console.error("prisma update user error ---->", error)
      throw new Error("Failed to update user")
    }
  }

  async deleteById(id: number): Promise<User> {
    try {
      return (await this._prisma.user.delete({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      })) as User
    } catch (error) {
      console.error("prisma delete user error ---->", error)
      throw new Error("Failed to delete user")
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { email },
    })
    if (!user) return null
    return user as unknown as User
  }
}

export class InvalidUserRoleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidUserRoleError"
  }
}

// function mapUserRoleToRole(userRole: Role): Role {
//   switch (userRole) {
//     case Role.ADMIN:
//       return Role.ADMIN // Ensure this matches the Role type
//     case Role.USER:
//       return Role.USER // Ensure this matches the Role type
//     default:
//       throw new InvalidUserRoleError("Invalid user role")
//   }
// }
