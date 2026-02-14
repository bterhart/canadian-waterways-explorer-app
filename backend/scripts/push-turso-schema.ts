import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function pushSchema() {
  const sqlPath = "/tmp/turso_schema.sql";
  console.log("Reading schema SQL from:", sqlPath);

  if (!existsSync(sqlPath)) {
    console.error("SQL file not found at:", sqlPath);
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, "utf-8");
  console.log("SQL file length:", sql.length, "characters");

  // Parse SQL statements - split by semicolon followed by optional whitespace and newline
  const rawStatements = sql.split(/;[\s]*\n/);
  console.log("Raw split count:", rawStatements.length);

  const statements: string[] = [];
  for (const s of rawStatements) {
    const trimmed = s.trim();
    // Skip empty or comment-only lines
    if (trimmed.length > 0 && !trimmed.match(/^--.*$/)) {
      // Remove leading comments but keep the actual SQL
      const sqlPart = trimmed.replace(/^--[^\n]*\n/gm, "").trim();
      if (sqlPart.length > 0) {
        statements.push(sqlPart);
      }
    }
  }

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    try {
      await turso.execute(stmt);
      successCount++;
      // Extract table/index name for cleaner output
      const match = stmt.match(/(?:TABLE|INDEX)\s+"?(\w+)"?/i);
      const name = match ? match[1] : `statement ${i + 1}`;
      console.log(`✓ Created: ${name}`);
    } catch (error: any) {
      // Ignore "table already exists" errors
      if (error.message?.includes("already exists")) {
        skipCount++;
        const match = stmt.match(/(?:TABLE|INDEX)\s+"?(\w+)"?/i);
        const name = match ? match[1] : `statement ${i + 1}`;
        console.log(`⊘ Skipped (exists): ${name}`);
      } else {
        errorCount++;
        console.error(`✗ Failed: ${error.message}`);
        console.error("  Statement preview:", stmt.substring(0, 80) + "...");
      }
    }
  }

  console.log(`\n✅ Schema push complete!`);
  console.log(`   Created: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
}

pushSchema().catch(console.error);
