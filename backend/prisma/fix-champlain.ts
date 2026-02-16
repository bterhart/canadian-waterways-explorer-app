import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating Samuel de Champlain portrait...\n");

  // The Ronjat portrait - verified working
  const champlainPortrait = "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel_de_Champlain_by_Ronjat.jpg?width=400";

  const result = await prisma.explorer.updateMany({
    where: { name: "Samuel de Champlain" },
    data: { imageUrl: champlainPortrait }
  });

  console.log(`Updated ${result.count} record(s)`);
  console.log(`New URL: ${champlainPortrait}`);

  await prisma.$disconnect();
}

main();
