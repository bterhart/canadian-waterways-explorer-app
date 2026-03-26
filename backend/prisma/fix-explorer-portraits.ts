import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Using Turso cloud database
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Script to fix/update Wikipedia/Wikimedia portrait images for explorers
 * Using VERIFIED exact filenames from Wikimedia Commons
 *
 * URL Format: https://commons.wikimedia.org/wiki/Special:FilePath/EXACT_FILENAME?width=400
 */

// Map of explorer names to their VERIFIED Wikipedia portrait filenames
const explorerPortraits: Record<string, string> = {
  // === VERIFIED WORKING URLs ===

  // Vancouver - using verified NPG portrait
  "Captain George Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/Probably%20George%20Vancouver%20from%20NPG.jpg?width=400",

  // Spanish explorers
  "Cayetano Valdés": "https://commons.wikimedia.org/wiki/Special:FilePath/CayetanoVald%C3%A9sYFloresJos%C3%A9Rold%C3%A1nMart%C3%ADnez1847.jpg?width=400",
  "Dionisio Alcalá Galiano": "https://commons.wikimedia.org/wiki/Special:FilePath/Dionisio_Alcal%C3%A1_Galiano.jpg?width=400",
  "Juan Francisco de la Bodega y Quadra": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Francisco_de_la_Bodega_y_Quadra.jpg?width=400",
  "José María Narváez": "https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Maria_Narvaez.jpg?width=400",
  "Juan Pérez": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Jose_Perez_Hernandez.jpg?width=400",
  "Bruno de Heceta (Hezeta)": "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno_de_Heceta.jpg?width=400",

  // Early explorers
  "John Cabot (Giovanni Caboto)": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cabot.jpg?width=400",
  "Vitus Bering": "https://commons.wikimedia.org/wiki/Special:FilePath/Vitus_Bering.jpg?width=400",
  "Leif Erikson": "https://commons.wikimedia.org/wiki/Special:FilePath/Leif_Eriksson_Discovers_America_Christian_Krohg_1893.jpg?width=400",

  // French explorers
  "Jean-François de Galaup, comte de La Pérouse": "https://commons.wikimedia.org/wiki/Special:FilePath/Laperouse.jpg?width=400",
  "Pierre Gaultier de Varennes, Sieur de La Vérendrye": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_de_La_Verendrye_by_Edgar_Samuel_Paxson%2C_1912.jpg?width=400",

  // Metis leaders
  "Louis Riel": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=400",
  "Gabriel Dumont": "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Dumont_(1886-8)_Orlando_Scott_Goff.jpg?width=400",
  "Cuthbert Grant": "https://commons.wikimedia.org/wiki/Special:FilePath/Cuthbert_Grant.jpg?width=400",

  // Indigenous leaders
  "Crowfoot": "https://commons.wikimedia.org/wiki/Special:FilePath/Chief_Crowfoot.jpg?width=400",
  "Big Bear": "https://commons.wikimedia.org/wiki/Special:FilePath/Bigbear-blanket.jpg?width=400",
  "Poundmaker": "https://commons.wikimedia.org/wiki/Special:FilePath/Poundmaker.png?width=400",
  "Chief Peguis": "https://commons.wikimedia.org/wiki/Special:FilePath/Peguis.jpg?width=400",
  "Akaitcho": "https://commons.wikimedia.org/wiki/Special:FilePath/Akaitcho.jpg?width=400",
  "Thanadelthur": "https://commons.wikimedia.org/wiki/Special:FilePath/Thanadelthur_statue.jpg?width=400",
  "Matonabbee": "https://commons.wikimedia.org/wiki/Special:FilePath/Matonabbee.jpg?width=400",
  "Shawnadithit": "https://commons.wikimedia.org/wiki/Special:FilePath/Shanawdithit.jpg?width=400",

  // British explorers
  "Dr. John Rae": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Rae_cropped.jpg?width=400",
  "George Simpson": "https://commons.wikimedia.org/wiki/Special:FilePath/George_Simpson_portrait.jpg?width=400",
  "William Bligh": "https://commons.wikimedia.org/wiki/Special:FilePath/WilliamBligh.jpeg?width=400",
  "Sir Robert McClure": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_McClure.jpg?width=400",
  "Sir William Edward Parry": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_William_Edward_Parry.jpg?width=400",
  "William Baffin": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Baffin.jpg?width=400",
  "John Davis": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Davis_(English_explorer).jpg?width=400",
  "John Palliser": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Palliser.jpg?width=400",
  "Joseph Burr Tyrrell": "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Burr_Tyrrell.jpg?width=400",
  "Vilhjalmur Stefansson": "https://commons.wikimedia.org/wiki/Special:FilePath/Vilhjalmur_Stefansson.jpg?width=400",

  // Russian explorer
  "Aleksei Chirikov": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexei_Chirikov.jpg?width=400",

  // American explorer
  "Robert Gray": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Gray_(sea_captain).jpg?width=400",

  // Fur traders
  "Alexander Henry the Elder": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Henry_the_Elder.jpg?width=400",
  "Antoine Laumet de La Mothe Cadillac": "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine_de_la_Mothe_Cadillac.jpg?width=400",
  "James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/James_Douglas_(governor).jpg?width=400",
  "John McLoughlin": "https://commons.wikimedia.org/wiki/Special:FilePath/John_McLoughlin.jpg?width=400",
  "Medard des Groseilliers": "https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%A9dard_Chouart_des_Groseilliers.jpg?width=400",
  "Pierre Le Moyne d'Iberville": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_Le_Moyne_d%27Iberville.jpg?width=400",
  "Simon McTavish": "https://commons.wikimedia.org/wiki/Special:FilePath/Simon_McTavish.jpg?width=400",
  "William McGillivray": "https://commons.wikimedia.org/wiki/Special:FilePath/William_McGillivray.jpg?width=400",

  // French Canadian pioneers
  "Jean-Baptiste Lagimodiere": "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Baptiste_Lagimodi%C3%A8re.jpg?width=400",
  "Marie-Anne Gaboury": "https://commons.wikimedia.org/wiki/Special:FilePath/Marie-Anne_Gaboury.jpg?width=400",
};

async function fixExplorerPortraits() {
  console.log("============================================");
  console.log("  Fixing Explorer Portrait Images          ");
  console.log("  (Using verified Wikimedia filenames)     ");
  console.log("============================================\n");

  // Get all explorers
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${explorers.length} total explorers\n`);

  let updated = 0;
  let alreadyCorrect = 0;
  let notInList: string[] = [];

  for (const explorer of explorers) {
    const correctUrl = explorerPortraits[explorer.name];

    if (correctUrl) {
      if (explorer.imageUrl !== correctUrl) {
        await prisma.explorer.update({
          where: { id: explorer.id },
          data: { imageUrl: correctUrl }
        });
        console.log(`  ✓ Updated: ${explorer.name}`);
        updated++;
      } else {
        alreadyCorrect++;
      }
    } else if (!explorer.imageUrl) {
      notInList.push(explorer.name);
    }
  }

  console.log(`\n============================================`);
  console.log(`  Results                                  `);
  console.log(`============================================`);
  console.log(`  Updated: ${updated} explorers`);
  console.log(`  Already correct: ${alreadyCorrect} explorers`);
  console.log(`  Not in list (need research): ${notInList.length} explorers`);

  if (notInList.length > 0) {
    console.log(`\n  Explorers still needing portraits:`);
    notInList.forEach(name => console.log(`    - ${name}`));
  }

  console.log(`\n============================================`);
  console.log(`  Portrait Fix Complete!                   `);
  console.log(`============================================`);
}

async function main() {
  try {
    await fixExplorerPortraits();
  } catch (error) {
    console.error("\n❌ Error fixing portraits:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
