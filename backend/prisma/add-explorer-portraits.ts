import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Using Turso cloud database
const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Script to add Wikipedia/Wikimedia portrait images to explorers
 *
 * URL Format: https://commons.wikimedia.org/wiki/Special:FilePath/FILENAME?width=400
 * This format properly redirects to the actual image and works correctly.
 */

// Map of explorer names to their Wikipedia portrait filenames
const explorerPortraits: Record<string, string> = {
  // From research - confirmed portraits
  "Captain George Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/George_Vancouver.jpg?width=400",
  "Cayetano Valdés": "https://commons.wikimedia.org/wiki/Special:FilePath/Cayetano_Vald%C3%A9s.jpg?width=400",
  "John Cabot (Giovanni Caboto)": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cabot.jpg?width=400",
  "Vitus Bering": "https://commons.wikimedia.org/wiki/Special:FilePath/Vitus_Bering.jpg?width=400",
  "Jean-François de Galaup, comte de La Pérouse": "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Fran%C3%A7ois_de_Galaup.jpg?width=400",
  "Pierre Gaultier de Varennes, Sieur de La Vérendrye": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_Gaultier_de_Varennes%2C_sieur_de_La_V%C3%A9rendrye.jpg?width=400",
  "Louis Riel": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=400",
  "Gabriel Dumont": "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Dumont.jpg?width=400",
  "Crowfoot": "https://commons.wikimedia.org/wiki/Special:FilePath/Chief_Crowfoot.jpg?width=400",
  "Big Bear": "https://commons.wikimedia.org/wiki/Special:FilePath/Big_Bear_(Cree_leader).jpg?width=400",
  "Poundmaker": "https://commons.wikimedia.org/wiki/Special:FilePath/Poundmaker.jpg?width=400",
  "Dr. John Rae": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Rae_(explorer).jpg?width=400",
  "George Simpson": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_George_Simpson.jpg?width=400",
  "William Bligh": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Bligh.jpg?width=400",

  // Additional explorers with known portraits
  "Leif Erikson": "https://commons.wikimedia.org/wiki/Special:FilePath/Leif_Erikson.jpg?width=400",
  "Vilhjalmur Stefansson": "https://commons.wikimedia.org/wiki/Special:FilePath/Vilhjalmur_Stefansson.jpg?width=400",
  "Sir Robert McClure": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_McClure.jpg?width=400",
  "Sir William Edward Parry": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_William_Edward_Parry.jpg?width=400",
  "William Baffin": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Baffin.jpg?width=400",
  "Dionisio Alcalá Galiano": "https://commons.wikimedia.org/wiki/Special:FilePath/Dionisio_Alcal%C3%A1_Galiano.jpg?width=400",
  "Juan Francisco de la Bodega y Quadra": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Francisco_de_la_Bodega_y_Quadra.jpg?width=400",
  "José María Narváez": "https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Maria_Narvaez.jpg?width=400",
  "Joseph Burr Tyrrell": "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Burr_Tyrrell.jpg?width=400",
  "Robert Gray": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Gray_(sea_captain).jpg?width=400",
  "Aleksei Chirikov": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexei_Chirikov.jpg?width=400",
  "John Davis": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Davis_(English_explorer).jpg?width=400",
  "Bruno de Heceta (Hezeta)": "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno_de_Heceta.jpg?width=400",
  "Juan Pérez": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_P%C3%A9rez_(explorer).jpg?width=400",

  // Indigenous leaders
  "Chief Peguis": "https://commons.wikimedia.org/wiki/Special:FilePath/Peguis.jpg?width=400",
  "Akaitcho": "https://commons.wikimedia.org/wiki/Special:FilePath/Akaitcho.jpg?width=400",
  "Thanadelthur": "https://commons.wikimedia.org/wiki/Special:FilePath/Thanadelthur.jpg?width=400",
  "Matonabbee": "https://commons.wikimedia.org/wiki/Special:FilePath/Matonabbee.jpg?width=400",

  // Fur traders and explorers
  "Alexander Henry the Elder": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Henry_(fur_trader_born_1739).jpg?width=400",
  "Antoine Laumet de La Mothe Cadillac": "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine_de_la_Mothe_Cadillac.jpg?width=400",
  "James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/James_Douglas_(governor).jpg?width=400",
  "John McLoughlin": "https://commons.wikimedia.org/wiki/Special:FilePath/John_McLoughlin.jpg?width=400",
  "John Palliser": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Palliser.jpg?width=400",
  "Medard des Groseilliers": "https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%A9dard_Chouart_des_Groseilliers.jpg?width=400",
  "Pierre Le Moyne d'Iberville": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_Le_Moyne_d%27Iberville.jpg?width=400",
  "Rene-Robert Cavelier, Sieur de La Salle": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Cavelier_de_La_Salle.jpg?width=400",
  "Cuthbert Grant": "https://commons.wikimedia.org/wiki/Special:FilePath/Cuthbert_Grant.jpg?width=400",
  "Simon McTavish": "https://commons.wikimedia.org/wiki/Special:FilePath/Simon_McTavish.jpg?width=400",
  "William McGillivray": "https://commons.wikimedia.org/wiki/Special:FilePath/William_McGillivray.jpg?width=400",
  "Jean-Baptiste Lagimodiere": "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Baptiste_Lagimodi%C3%A8re.jpg?width=400",
  "Marie-Anne Gaboury": "https://commons.wikimedia.org/wiki/Special:FilePath/Marie-Anne_Gaboury.jpg?width=400",
};

async function addExplorerPortraits() {
  console.log("============================================");
  console.log("  Adding Explorer Portrait Images          ");
  console.log("============================================\n");

  // Get all explorers without images
  const explorers = await prisma.explorer.findMany({
    where: {
      imageUrl: null
    },
    select: { id: true, name: true }
  });

  console.log(`Found ${explorers.length} explorers without portraits\n`);

  let updated = 0;
  let notFound: string[] = [];

  for (const explorer of explorers) {
    const portraitUrl = explorerPortraits[explorer.name];

    if (portraitUrl) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl: portraitUrl }
      });
      console.log(`  ✓ ${explorer.name}`);
      console.log(`    URL: ${portraitUrl.substring(0, 70)}...`);
      updated++;
    } else {
      notFound.push(explorer.name);
    }
  }

  console.log(`\n============================================`);
  console.log(`  Results                                  `);
  console.log(`============================================`);
  console.log(`  Updated: ${updated} explorers`);
  console.log(`  Not found: ${notFound.length} explorers`);

  if (notFound.length > 0) {
    console.log(`\n  Explorers still needing portraits:`);
    notFound.forEach(name => console.log(`    - ${name}`));
  }

  console.log(`\n============================================`);
  console.log(`  Portrait Update Complete!                `);
  console.log(`============================================`);
}

async function main() {
  try {
    await addExplorerPortraits();
  } catch (error) {
    console.error("\n❌ Error adding portraits:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
