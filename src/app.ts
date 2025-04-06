import startServer from "./infrastructure/http/server.js"

const app = async () => {
  try {
    await startServer()
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

app()
