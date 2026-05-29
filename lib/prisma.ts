import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  sqlite?: Database.Database;
};

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const databasePath = databaseUrl.startsWith("file:")
  ? databaseUrl.slice("file:".length)
  : databaseUrl;

const sqlite = globalForPrisma.sqlite ?? new Database(databasePath);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSQLite3(sqlite),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.sqlite = sqlite;
}

