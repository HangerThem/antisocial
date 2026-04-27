import { PrismaClient } from "@/prisma/generated/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const createPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_FILE })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as typeof globalThis & {
  __prisma?: PrismaClient
}

export const prisma = globalForPrisma.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma
}
