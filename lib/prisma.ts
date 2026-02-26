import "server-only"; // KUNCI UTAMA: Biar logic database gak bocor ke browser
import { PrismaClient } from "@prisma/client"; // ✅ Pake jalan resmi biar Vercel kenal
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Pake Pool buat manage antrian koneksi ke Neon mang
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});
const adapter = new PrismaPg(pool);

// Generator PrismaClient dengan adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Log biar pas ngerjain tugas kuliah bisa mantau error
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;