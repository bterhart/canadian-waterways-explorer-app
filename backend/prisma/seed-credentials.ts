import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test credentials...");

  // 1. Create Teacher account
  // Teachers use Bun.password.hash() which uses argon2
  const teacherPasswordHash = await Bun.password.hash("Teacher123!");

  const existingTeacher = await prisma.teacher.findUnique({
    where: { email: "teacher@waterways.edu" },
  });

  if (existingTeacher) {
    // Update existing teacher's password
    await prisma.teacher.update({
      where: { email: "teacher@waterways.edu" },
      data: {
        passwordHash: teacherPasswordHash,
        name: "Test Teacher",
        schoolName: "Waterways Elementary",
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
    console.log("Updated existing teacher: teacher@waterways.edu");
  } else {
    await prisma.teacher.create({
      data: {
        email: "teacher@waterways.edu",
        name: "Test Teacher",
        passwordHash: teacherPasswordHash,
        schoolName: "Waterways Elementary",
        failedLoginAttempts: 0,
      },
    });
    console.log("Created teacher: teacher@waterways.edu");
  }

  // 2. Create Admin account (moderator role)
  // Admins use bcryptjs
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: "admin@waterways.edu" },
  });

  if (existingAdmin) {
    await prisma.adminUser.update({
      where: { email: "admin@waterways.edu" },
      data: {
        passwordHash: adminPasswordHash,
        name: "Admin User",
        role: "moderator",
        status: "approved",
        canCreateGlobalContent: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
    console.log("Updated existing admin: admin@waterways.edu");
  } else {
    await prisma.adminUser.create({
      data: {
        email: "admin@waterways.edu",
        name: "Admin User",
        passwordHash: adminPasswordHash,
        role: "moderator",
        status: "approved",
        canCreateGlobalContent: true,
        failedLoginAttempts: 0,
      },
    });
    console.log("Created admin: admin@waterways.edu");
  }

  // 3. Create Super-Admin account
  const superAdminPasswordHash = await bcrypt.hash("SuperAdmin123!", 10);

  const existingSuperAdmin = await prisma.adminUser.findUnique({
    where: { email: "superadmin@waterways.edu" },
  });

  if (existingSuperAdmin) {
    await prisma.adminUser.update({
      where: { email: "superadmin@waterways.edu" },
      data: {
        passwordHash: superAdminPasswordHash,
        name: "Super Admin",
        role: "super_admin",
        status: "approved",
        canCreateGlobalContent: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
    console.log("Updated existing super-admin: superadmin@waterways.edu");
  } else {
    await prisma.adminUser.create({
      data: {
        email: "superadmin@waterways.edu",
        name: "Super Admin",
        passwordHash: superAdminPasswordHash,
        role: "super_admin",
        status: "approved",
        canCreateGlobalContent: true,
        failedLoginAttempts: 0,
      },
    });
    console.log("Created super-admin: superadmin@waterways.edu");
  }

  console.log("\n=== Test Credentials Created ===");
  console.log("\nTeacher Account:");
  console.log("  Email: teacher@waterways.edu");
  console.log("  Password: Teacher123!");
  console.log("  Name: Test Teacher");
  console.log("  School: Waterways Elementary");

  console.log("\nAdmin Account (Moderator):");
  console.log("  Email: admin@waterways.edu");
  console.log("  Password: Admin123!");
  console.log("  Name: Admin User");
  console.log("  Role: moderator");
  console.log("  Status: approved");

  console.log("\nSuper-Admin Account:");
  console.log("  Email: superadmin@waterways.edu");
  console.log("  Password: SuperAdmin123!");
  console.log("  Name: Super Admin");
  console.log("  Role: super_admin");
  console.log("  Status: approved");

  console.log("\n================================");
}

main()
  .catch((e) => {
    console.error("Error seeding credentials:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
