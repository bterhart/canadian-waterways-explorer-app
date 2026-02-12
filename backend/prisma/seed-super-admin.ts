import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function main() {
  console.log("🔐 Seeding Super-Admin...");

  // Create initial super-admin user
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: "superadmin@waterways.edu" },
    update: {},
    create: {
      email: "superadmin@waterways.edu",
      name: "Super Administrator",
      organization: "Canadian Waterways Education",
      passwordHash: await hashPassword("SecurePassword123!"),
      role: "super_admin",
      status: "approved",
      canCreateGlobalContent: true,
      approvedAt: new Date(),
    },
  });

  console.log("✅ Created super-admin:", superAdmin.email);

  // Mark all existing educational content as core and global
  console.log("🔒 Marking existing content as core...");

  // Update lesson plans
  const lessonPlansUpdate = await prisma.lessonPlan.updateMany({
    where: {
      createdById: null, // Only update seeded content
    },
    data: {
      isCore: true,
      visibility: "global",
    },
  });
  console.log(`✅ Updated ${lessonPlansUpdate.count} lesson plans as core content`);

  // Update field trips
  const fieldTripsUpdate = await prisma.virtualFieldTrip.updateMany({
    where: {
      createdById: null,
    },
    data: {
      isCore: true,
      visibility: "global",
    },
  });
  console.log(`✅ Updated ${fieldTripsUpdate.count} field trips as core content`);

  // Update documents
  const documentsUpdate = await prisma.primarySourceDocument.updateMany({
    where: {
      createdById: null,
    },
    data: {
      isCore: true,
      visibility: "global",
    },
  });
  console.log(`✅ Updated ${documentsUpdate.count} documents as core content`);

  // Update printables
  const printablesUpdate = await prisma.printableResource.updateMany({
    where: {
      createdById: null,
    },
    data: {
      isCore: true,
      visibility: "global",
    },
  });
  console.log(`✅ Updated ${printablesUpdate.count} printables as core content`);

  console.log("🎉 Super-admin seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding super-admin:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
