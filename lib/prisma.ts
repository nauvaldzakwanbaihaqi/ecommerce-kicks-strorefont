import "server-only"; // KUNCI UTAMA: Biar logic database gak bocor ke browser mang
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Pake Pool buat manage antrian koneksi ke Neon mang
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
})
const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  // Tambahin log biar pas lu ngerjain tugas kuliah/UTS bisa liat query-nya di terminal
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

// Temporary ID (nanti kita ganti pake session NextAuth mang)
export const USER_ID = "user-123";

// Export types untuk reuse
export type { PrismaClient }
