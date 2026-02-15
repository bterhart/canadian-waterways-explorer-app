import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  // List all tables
  const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables in database:");
  tables.rows.forEach(row => console.log("  -", row.name));
  
  // Check for auth-related tables
  const authTables = tables.rows.filter(row => 
    (row.name as string).toLowerCase().includes('user') || 
    (row.name as string).toLowerCase().includes('account') ||
    (row.name as string).toLowerCase().includes('auth')
  );
  
  console.log("\nAuth-related tables:");
  authTables.forEach(row => console.log("  -", row.name));
}

check().catch(console.error);
