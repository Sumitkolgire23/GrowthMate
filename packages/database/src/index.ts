import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL

  // Production: use Turso / libSQL cloud database
  if (databaseUrl && databaseUrl.startsWith('libsql://')) {
    const authToken = process.env.DATABASE_AUTH_TOKEN

    const libsql = createClient({
      url: databaseUrl,
      authToken,
    })

    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter } as any)
  }

  // Local development: fall back to plain SQLite
  return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { PrismaClient }
