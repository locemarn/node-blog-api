import bcrypt from "bcryptjs"
import { IPasswordHasher } from "../../application/contracts/password-hasher.interface.js"

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number

  constructor(saltRounds = 10) {
    // Make salt rounds configurable
    console.info("BcryptPasswordHasher constructor", saltRounds)
    this.saltRounds = saltRounds
  }

  async hash(plain: string): Promise<string> {
    console.info("plain ---->", plain)
    // bcryptjs.genSalt is async, bcryptjs.hash is async
    const salt = await bcrypt.genSalt(this.saltRounds) // genSalt is often optional with hash
    // return bcrypt.hash(plain, salt);
    return bcrypt.hash(plain, salt) // hash can generate salt internally
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }
}
