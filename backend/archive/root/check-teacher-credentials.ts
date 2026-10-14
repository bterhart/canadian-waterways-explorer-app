import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  // Check existing teacher user
  const teacher = await turso.execute({
    sql: "SELECT id, email, role FROM User WHERE email = ?",
    args: ["teacher@canadianwaterways.ca"]
  });
  
  console.log("Teacher user exists:", teacher.rows.length > 0);
  if (teacher.rows.length > 0) {
    console.log("Teacher:", teacher.rows[0]);
  }
  
  // Check admin users for comparison
  const admin = await turso.execute({
    sql: "SELECT id, email, role FROM User WHERE email IN (?, ?)",
    args: ["admin@canadianwaterways.ca", "superadmin@canadianwaterways.ca"]
  });
  
  console.log("\nAdmin users:");
  admin.rows.forEach(row => console.log(row));
}

check().catch(console.error);
