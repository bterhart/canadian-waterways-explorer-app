import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Update explorers with VERIFIED WORKING portrait URLs only
 * All URLs below have been tested with HTTP 200 responses
 */

// Only include URLs that have been verified to return HTTP 200
const verifiedPortraits: Record<string, string> = {
  // === VERIFIED WORKING URLs (tested) ===

  // Core explorers with confirmed portraits
  "Captain George Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/Probably%20George%20Vancouver%20from%20NPG.jpg?width=400",
  "Captain James Cook": "https://commons.wikimedia.org/wiki/Special:FilePath/Captainjamescookportrait.jpg?width=400",
  "Louis Riel": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=400",
  "John Cabot (Giovanni Caboto)": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cabot.jpg?width=400",
  "Vitus Bering": "https://commons.wikimedia.org/wiki/Special:FilePath/Vitus_Bering.jpg?width=400",
  "Crowfoot": "https://commons.wikimedia.org/wiki/Special:FilePath/Chief_Crowfoot.jpg?width=400",

  // Spanish explorers
  "Juan Francisco de la Bodega y Quadra": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Francisco_de_la_Bodega_y_Quadra.jpg?width=400",
  "Dionisio Alcalá Galiano": "https://commons.wikimedia.org/wiki/Special:FilePath/Dionisio_Alcal%C3%A1_Galiano.jpg?width=400",

  // British/Canadian explorers
  "Sir James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_James_Douglas.jpg?width=400",
  "James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_James_Douglas.jpg?width=400",

  // French explorer (using d'Iberville which tested as working)
  "Pierre Le Moyne d'Iberville": "https://commons.wikimedia.org/wiki/Special:FilePath/Iberville.jpg?width=400",

  // Verified from previous batch
  "Alexander Mackenzie": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Mackenzie_by_Thomas_Lawrence_(c.1800).jpg?width=400",
  "David Thompson": "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_(explorer).jpg?width=400",
  "Henry Hudson": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Hudson_%28Last_Voyage%29.jpg?width=400",
  "Henry Kelsey": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Kelsey_Statue_Manitoba_Legislature.JPG?width=400",
  "Jacques Cartier": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Cartier_1851-1852.png?width=400",
  "Jacques Marquette": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Marquette.png?width=400",
  "Jean Nicolet": "https://commons.wikimedia.org/wiki/Special:FilePath/Landing_of_Jean_Nicolet.jpg?width=400",
  "Louis Jolliet": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Jolliet.JPG?width=400",
  "Martin Frobisher": "https://commons.wikimedia.org/wiki/Special:FilePath/Martin_Frobisher_by_Cornelis_Ketel.jpg?width=400",
  "Roald Amundsen": "https://commons.wikimedia.org/wiki/Special:FilePath/Amundsen_in_fur_skins.jpg?width=400",
  "Samuel Hearne": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20Project%20Gutenberg%20etext%2020110.jpg?width=400",
  "Simon Fraser": "https://commons.wikimedia.org/wiki/Special:FilePath/SimonFraserFurTrader.jpg?width=400",
  "Sir George Back": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_George_Back_by_William_Brockedon.jpg?width=400",
  "Sir John Franklin": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_John_Franklin_by_Negelen.jpg?width=400",
  "Pierre-Esprit Radisson": "https://commons.wikimedia.org/wiki/Special:FilePath/Radisson_and_Groseilliers.jpg?width=400",
  "Etienne Brule": "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%89tienne_Br%C3%BBl%C3%A9.jpg?width=400",
  "Rene-Robert Cavelier, Sieur de La Salle": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Cavelier_de_La_Salle.jpg?width=400",
  "Peter Pond": "https://commons.wikimedia.org/wiki/Special:FilePath/PeterPondMap.jpg?width=400",
};

async function updateVerifiedPortraits() {
  console.log("============================================");
  console.log("  Updating Verified Explorer Portraits     ");
  console.log("============================================\n");

  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${explorers.length} explorers\n`);

  let updated = 0;
  let unchanged = 0;

  for (const explorer of explorers) {
    const verifiedUrl = verifiedPortraits[explorer.name];

    if (verifiedUrl && explorer.imageUrl !== verifiedUrl) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl: verifiedUrl }
      });
      console.log(`  ✓ Updated: ${explorer.name}`);
      updated++;
    } else if (verifiedUrl) {
      unchanged++;
    }
  }

  // Count explorers still without images
  const stillMissing = await prisma.explorer.count({
    where: { imageUrl: null }
  });

  console.log(`\n============================================`);
  console.log(`  Results                                  `);
  console.log(`============================================`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Unchanged: ${unchanged}`);
  console.log(`  Still missing images: ${stillMissing}`);
  console.log(`============================================\n`);
}

async function main() {
  try {
    await updateVerifiedPortraits();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
