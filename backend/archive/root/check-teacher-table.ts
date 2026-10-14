import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  // Check Teacher table
  const teachers = await turso.execute("SELECT * FROM Teacher");
  console.log("Teachers in database:", teachers.rows.length);
  teachers.rows.forEach(row => {
    console.log("\nTeacher:");
    console.log("  id:", row.id);
    console.log("  email:", row.email);
    console.log("  name:", row.name);
    console.log("  hasPassword:", !!row.password);
  });
  
  // Check AdminUser table for comparison
  const admins = await turso.execute("SELECT * FROM AdminUser");
  console.log("\n\nAdminUsers in database:", admins.rows.length);
  admins.rows.forEach(row => {
    console.log("\nAdminUser:");
    console.log("  id:", row.id);
    console.log("  email:", row.email);
    console.log("  role:", row.role);
    console.log("  hasPassword:", !!row.password);
  });
}

check().catch(console.error);
