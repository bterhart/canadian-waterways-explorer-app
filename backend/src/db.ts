// NOTE: "Prisma" is only the name of the query library (@prisma/client). It is NOT a
// database. The one and only database is Turso, reached through the libsql adapter below.
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { env } from "./env";

// Using Turso cloud database

// Create Prisma adapter with Turso config
// This adapter is the actual connection to Turso. Nothing here touches a local file.
const adapter = new PrismaLibSQL({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

// Create Prisma client with adapter
export const db = new PrismaClient({ adapter });
