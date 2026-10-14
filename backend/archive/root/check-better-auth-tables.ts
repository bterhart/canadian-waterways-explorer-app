import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  
  // Look for Better Auth tables (usually start with lowercase or have 'session', 'account', etc.)
  console.log("All tables:");
  tables.rows.forEach(row => console.log("  -", row.name));
  
  // Try checking if there's a user or account table (Better Auth standard)
  try {
    const schema = await turso.execute("PRAGMA table_info(Teacher)");
    console.log("\nTeacher table schema:");
    schema.rows.forEach(row => console.log("  ", row));
  } catch (e) {
    console.log("Could not read Teacher schema");
  }
}

check().catch(console.error);
