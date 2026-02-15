import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fix() {
  // Hash the password using Bun's built-in password hashing (same as registration)
  const passwordHash = await Bun.password.hash("Teacher123!");
  
  console.log("Hashed password with Bun.password.hash");
  
  // Update the teacher record
  await turso.execute({
    sql: "UPDATE Teacher SET passwordHash = ?, status = 'approved' WHERE email = ?",
    args: [passwordHash, "teacher@canadianwaterways.ca"]
  });
  
  console.log("✓ Updated teacher@canadianwaterways.ca");
  console.log("  Email: teacher@canadianwaterways.ca");
  console.log("  Password: Teacher123!");
  console.log("  Status: approved");
  
  // Verify it was updated
  const teacher = await turso.execute({
    sql: "SELECT id, email, name, status FROM Teacher WHERE email = ?",
    args: ["teacher@canadianwaterways.ca"]
  });
  
  console.log("\nVerified teacher record:");
  console.log(teacher.rows[0]);
}

fix().catch(console.error);
