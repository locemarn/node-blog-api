// import express, { NextFunction, Request, Response } from "express"

// import cors from "cors"
// import http from "http"
// import { readFileSync } from "fs"
// import path from "path"
// import { expressMiddleware } from "@apollo/server/express4"
// import { ApolloServer } from "@apollo/server"
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
// import { userResolvers } from "#/presentation/graphql/resolvers/userResolvers"
// const app = express()
// const httpServer = http.createServer(app)

// const typeDefs = readFileSync(
//   path.join(__dirname, "../../presentation/graphql/schemas/schema.graphql"),
//   "utf-8"
// )

// const server = new ApolloServer({
//   typeDefs,
//   resolvers: [userResolvers],
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   formatError: (error) => {
//     console.error("Apollo Server formatError", error)
//     return error
//   },
// })

// await server.start()

// // app.use(cors())
// // app.use(expresson())

// app.use(
//   "/graphql",
//   cors<cors.CorsRequest>(),
//   expresson(),
//   expressMiddleware(server) as unknown as express.RequestHandler
// )

// // Rota de Health Check (opcional, mas bom)
// app.get(
//   "/health",
//   (err: Error, req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).send("OK")
//     next(err)
//   }
// )
