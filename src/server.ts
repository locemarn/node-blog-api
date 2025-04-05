import "reflect-metadata"
import express from "express"
import config from "./infrastructure/configs/index.js"
import { PrismaUserRepository } from "./infrastructure/database/prisma/repositories/PrismaUserRepository.js"
import { CreateUserUseCase } from "./application/use-cases/user/createUserUseCase"
import { BcryptPasswordHasher } from "./infrastructure/cryptography/bcrypt-password-hasher"

const app = express()

const port = config.app.port

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  const userRepository = new PrismaUserRepository()
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    new BcryptPasswordHasher()
  )
  const result = await createUserUseCase.execute({
    username: "new test user",
    email: "newtestuser@test.com",
    password: "testsecret",
    role: "ADMIN",
  })
  res.status(200).json(result)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
