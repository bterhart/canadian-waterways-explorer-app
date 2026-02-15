import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function updateTeacher() {
  // Hash the password using bcrypt
  const passwordHash = await bcrypt.hash("Teacher123!", 10);
  
  console.log("Hashed password for Teacher123!");
  
  // Update the teacher record
  await turso.execute({
    sql: "UPDATE Teacher SET passwordHash = ?, status = 'approved' WHERE email = ?",
    args: [passwordHash, "teacher@canadianwaterways.ca"]
  });
  
  console.log("✓ Updated teacher@canadianwaterways.ca with password: Teacher123!");
  
  // Verify
  const teacher = await turso.execute({
    sql: "SELECT id, email, name, status FROM Teacher WHERE email = ?",
    args: ["teacher@canadianwaterways.ca"]
  });
  
  console.log("\nUpdated teacher:");
  console.log(teacher.rows[0]);
}

updateTeacher().catch(console.error);
