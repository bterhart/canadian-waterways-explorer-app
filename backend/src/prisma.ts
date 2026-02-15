import { PrismaClient } from "@prisma/client";

// Use local SQLite in development, Turso in production
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production" && process.env.TURSO_DATABASE_URL) {
  // Dynamically import Turso adapter only in production
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  prisma = new PrismaClient({ adapter });
} else {
  // Use local SQLite for development
  prisma = new PrismaClient();
}

export { prisma };
