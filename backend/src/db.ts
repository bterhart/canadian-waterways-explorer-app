import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { env } from "./env";

// Using Turso cloud database

// Create Prisma adapter with Turso config
const adapter = new PrismaLibSQL({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

// Create Prisma client with adapter
export const db = new PrismaClient({ adapter });
