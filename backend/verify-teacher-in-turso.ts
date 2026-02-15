import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function verify() {
  console.log("Connecting to Turso at:", process.env.TURSO_DATABASE_URL);
  
  const teacher = await turso.execute({
    sql: "SELECT id, email, name, passwordHash, status FROM Teacher WHERE email = ?",
    args: ["teacher@canadianwaterways.ca"]
  });
  
  if (teacher.rows.length === 0) {
    console.log("\n❌ Teacher not found in Turso database!");
  } else {
    const row = teacher.rows[0];
    console.log("\n✓ Teacher found in Turso:");
    console.log("  ID:", row.id);
    console.log("  Email:", row.email);
    console.log("  Name:", row.name);
    console.log("  Status:", row.status);
    console.log("  Has passwordHash:", !!row.passwordHash);
    console.log("  Password hash starts with:", row.passwordHash?.toString().substring(0, 20));
    
    // Test password verification
    const testPassword = "Teacher123!";
    const isValid = await Bun.password.verify(testPassword, row.passwordHash as string);
    console.log("\n  Password verification test:");
    console.log("    Testing password:", testPassword);
    console.log("    Result:", isValid ? "✓ VALID" : "❌ INVALID");
  }
}

verify().catch(console.error);
