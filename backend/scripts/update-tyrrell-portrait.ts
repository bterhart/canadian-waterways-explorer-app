import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

const TYRRELL_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/JBTyrrell.png/400px-JBTyrrell.png";

async function updateTyrrellPortrait() {
  console.log("============================================");
  console.log("  Checking Joseph Burr Tyrrell Portrait    ");
  console.log("============================================\n");

  // Find Joseph Burr Tyrrell
  const tyrrell = await prisma.explorer.findFirst({
    where: {
      name: {
        contains: "Tyrrell"
      }
    },
    select: { id: true, name: true, imageUrl: true }
  });

  if (!tyrrell) {
    console.log("Joseph Burr Tyrrell not found in the database.");
    return;
  }

  console.log(`Found explorer: ${tyrrell.name}`);
  console.log(`Current imageUrl: ${tyrrell.imageUrl || "(not set)"}`);

  if (tyrrell.imageUrl === TYRRELL_IMAGE_URL) {
    console.log("\nImage URL is already correct. No update needed.");
    return;
  }

  // Update the imageUrl
  await prisma.explorer.update({
    where: { id: tyrrell.id },
    data: { imageUrl: TYRRELL_IMAGE_URL }
  });

  console.log(`\nUpdated imageUrl to: ${TYRRELL_IMAGE_URL}`);
  console.log("Update complete!");
}

async function main() {
  try {
    await updateTyrrellPortrait();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
