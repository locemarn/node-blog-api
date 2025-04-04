import "reflect-metadata"
import express from "express"

const app = express()

const port = process.env.PORT ?? 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
