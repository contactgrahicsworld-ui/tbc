import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Connection URL resolution order:
 *   1. POSTGRES_PRISMA_URL — pooled connection tuned for Prisma
 *                             (Vercel Marketplace Neon: pgbouncer=true)
 *   2. POSTGRES_URL        — generic pooled Postgres URL (Neon / Supabase /
 *                             Vercel Postgres / local Postgres)
 *   3. DATABASE_URL        — fallback, only if it is a postgres:// URL
 *                             (guards against stray sqlite file:// URLs
 *                              injected into the environment)
 */
function resolveDatasourceUrl(): string | undefined {
  if (process.env.POSTGRES_PRISMA_URL) return process.env.POSTGRES_PRISMA_URL
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL
  if (process.env.DATABASE_URL?.startsWith('postgres')) return process.env.DATABASE_URL
  return undefined // let Prisma fall back to the schema's env("POSTGRES_URL")
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatasourceUrl(),
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
