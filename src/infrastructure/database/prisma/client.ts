import { PrismaClient } from "@prisma/client"

// Singleton pattern para evitar múltiplas instâncias
let prisma: PrismaClient

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      // log: ['query', 'info', 'warn', 'error'], // Opcional: Habilitar logs
    })
  }
  return prisma
}

export default getPrismaClient()
