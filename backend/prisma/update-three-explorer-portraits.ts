import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Update three explorers with their Wikipedia image URLs
 */

const explorerPortraits: Record<string, string> = {
  "Peter Fidler": "https://commons.wikimedia.org/wiki/Special:FilePath/Peter_Fidler_statue.jpg?width=400",
  "Thomas Button": "https://commons.wikimedia.org/wiki/Special:FilePath/Thomas_Button.png?width=400",
  "Daniel Williams Harmon": "https://commons.wikimedia.org/wiki/Special:FilePath/DWHarmon_-_Colorized3.jpg?width=400",
};

async function updateExplorerPortraits() {
  console.log("============================================");
  console.log("  Updating Explorer Portraits              ");
  console.log("============================================\n");

  for (const [name, imageUrl] of Object.entries(explorerPortraits)) {
    const explorer = await prisma.explorer.findFirst({
      where: { name },
      select: { id: true, name: true, imageUrl: true }
    });

    if (explorer) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl }
      });
      console.log(`  Updated: ${name}`);
      console.log(`    URL: ${imageUrl}\n`);
    } else {
      console.log(`  NOT FOUND: ${name}\n`);
    }
  }

  console.log("============================================");
  console.log("  Update complete                          ");
  console.log("============================================\n");
}

async function main() {
  try {
    await updateExplorerPortraits();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
