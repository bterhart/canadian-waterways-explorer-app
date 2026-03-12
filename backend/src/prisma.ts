import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  throw new Error(
    "TURSO_DATABASE_URL is not set. This app requires a Turso database. " +
    "Set TURSO_DATABASE_URL to your Turso database URL (e.g. libsql://your-db.turso.io)."
  );
}

// Create Prisma adapter with Turso configuration
const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: tursoToken,
});

// Create Prisma client with Turso adapter — never uses local SQLite
const prisma = new PrismaClient({ adapter });

export { prisma };
