import "reflect-metadata"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import express, { NextFunction, Request, Response } from "express"
import { readFileSync } from "fs"
import http from "http"
import { userResolvers } from "../../presentation/graphql/resolvers/userResolvers.js"
import { GraphQLError, GraphQLFormattedError } from "graphql"
import config from "../configs/index.js"
import cors from "cors"
import { expressMiddleware } from "@apollo/server/express4"

const isProduction = config.isProd()
const graphqlPrefixRoute = config.route.graphqlPrefix

async function startServer() {
  const app = express()
  const httpServer = http.createServer(app)

  const typeDefs = readFileSync(
    new URL(
      "../../presentation/graphql/schemas/schema.graphql",
      import.meta.url
    ).pathname, // Replaced __dirname with import.meta.url
    "utf-8"
  )

  // Instanciar Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolvers],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (
      formattedError: GraphQLFormattedError,
      error: unknown
    ): GraphQLFormattedError => {
      // 1. Log the full error internally (using console.error or a proper logger)
      // In production, you'd use Winston, Pino, etc.
      console.error("GraphQL Error:", error) // Log the raw error
      // You might want more details from formattedError too
      // console.error("Formatted Error:", formattedError);

      // 2. Check if the error is a GraphQLError to safely access originalError
      if (error instanceof GraphQLError) {
        // Log original error if it exists
        if (error.originalError) {
          console.error("Original Error:", error.originalError)
        }
      }

      // 3. Decide what to send to the client
      if (isProduction) {
        // In production, hide implementation details like stack traces
        // Return a generic message or only specific fields
        return {
          message: formattedError.message, // Keep the original message generally
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: {
            // Only include extensions code if it exists and is safe
            code: formattedError.extensions?.code,
            // DO NOT include stacktrace in production
            // stacktrace: undefined // Explicitly ensure it's not there
          },
        }
      } else {
        // In development, return the default formatted error (which includes stacktrace)
        // Or customize further if needed, but keep stacktrace for debugging
        return {
          ...formattedError,
          message: formattedError.message, // Or customize message
          extensions: {
            ...formattedError.extensions, // Keep existing extensions like code
            // stacktrace: formattedError.extensions?.stacktrace, // Included by default in dev
          },
        }
      }
    },
  })

  // Iniciar o servidor Apollo ANTES de aplicar o middleware
  await server.start()

  // Aplicar Middlewares do Express
  app.use(cors()) // Configurar CORS adequadamente para produção
  app.use(express.json())

  app.use(
    `${graphqlPrefixRoute}`,
    cors<cors.CorsRequest>(),
    expressMiddleware(server) as unknown as express.RequestHandler
  )

  // Rota de Health Check (opcional, mas bom)
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK")
  })

  // check errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).send({ error: true, message: err })
    next(err)
  })

  // Iniciar o servidor HTTP
  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () => {
    console.info(
      `🚀 Server ready at http://localhost:${PORT}${graphqlPrefixRoute}`
    )
  })
}

export default startServer
