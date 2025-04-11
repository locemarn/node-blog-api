import { userResolver } from "./userResolvers.js"

export const resolvers = {
  Query: { ...userResolver.Query },
  Mutation: { ...userResolver.Mutation },
}
