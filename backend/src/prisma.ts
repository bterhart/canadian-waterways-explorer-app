import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Create Prisma adapter with Turso configuration
const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create Prisma client with Turso adapter
const prisma = new PrismaClient({ adapter });

export { prisma };
