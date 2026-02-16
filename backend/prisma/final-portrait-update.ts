import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Final comprehensive portrait update
 * Uses Wikipedia Commons Special:FilePath format
 *
 * For explorers without known portraits, using:
 * - Historical engravings/drawings
 * - Statues/memorials
 * - Related imagery (maps, ships)
 */

const allPortraits: Record<string, string> = {
  // ========================================
  // EXPLORERS WITH VERIFIED PORTRAITS
  // ========================================

  // Primary explorers - confirmed working
  "Captain George Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/Probably%20George%20Vancouver%20from%20NPG.jpg?width=400",
  "Captain James Cook": "https://commons.wikimedia.org/wiki/Special:FilePath/Captainjamescookportrait.jpg?width=400",
  "Louis Riel": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=400",
  "John Cabot (Giovanni Caboto)": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cabot.jpg?width=400",
  "Vitus Bering": "https://commons.wikimedia.org/wiki/Special:FilePath/Vitus_Bering.jpg?width=400",
  "Crowfoot": "https://commons.wikimedia.org/wiki/Special:FilePath/Chief_Crowfoot.jpg?width=400",
  "Big Bear": "https://commons.wikimedia.org/wiki/Special:FilePath/Bigbear-blanket.jpg?width=400",
  "Poundmaker": "https://commons.wikimedia.org/wiki/Special:FilePath/Poundmaker.png?width=400",

  // Spanish explorers
  "Cayetano Valdés": "https://commons.wikimedia.org/wiki/Special:FilePath/CayetanoVald%C3%A9sYFloresJos%C3%A9Rold%C3%A1nMart%C3%ADnez1847.jpg?width=400",
  "Juan Francisco de la Bodega y Quadra": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Francisco_de_la_Bodega_y_Quadra.jpg?width=400",
  "Dionisio Alcalá Galiano": "https://commons.wikimedia.org/wiki/Special:FilePath/Dionisio_Alcal%C3%A1_Galiano.jpg?width=400",
  "Bruno de Heceta (Hezeta)": "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno_de_Heceta.jpg?width=400",
  "José María Narváez": "https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Maria_Narvaez.jpg?width=400",
  "Juan Pérez": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Jose_Perez_Hernandez.jpg?width=400",

  // French explorers
  "Jean-François de Galaup, comte de La Pérouse": "https://commons.wikimedia.org/wiki/Special:FilePath/Laperouse.jpg?width=400",
  "Pierre Gaultier de Varennes, Sieur de La Vérendrye": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_de_La_Verendrye_by_Edgar_Samuel_Paxson%2C_1912.jpg?width=400",
  "Jacques Cartier": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Cartier_1851-1852.png?width=400",
  "Jacques Marquette": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Marquette.png?width=400",
  "Jean Nicolet": "https://commons.wikimedia.org/wiki/Special:FilePath/Landing_of_Jean_Nicolet.jpg?width=400",
  "Louis Jolliet": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Jolliet.JPG?width=400",
  "Etienne Brule": "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%89tienne_Br%C3%BBl%C3%A9.jpg?width=400",
  "Rene-Robert Cavelier, Sieur de La Salle": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Cavelier_de_La_Salle.jpg?width=400",
  "Pierre-Esprit Radisson": "https://commons.wikimedia.org/wiki/Special:FilePath/Radisson_and_Groseilliers.jpg?width=400",
  "Medard des Groseilliers": "https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%A9dard_Chouart_des_Groseilliers.jpg?width=400",
  "Pierre Le Moyne d'Iberville": "https://commons.wikimedia.org/wiki/Special:FilePath/Iberville.jpg?width=400",
  "Antoine Laumet de La Mothe Cadillac": "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine_de_la_Mothe_Cadillac.jpg?width=400",

  // British/Scottish explorers
  "Alexander Mackenzie": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Mackenzie_by_Thomas_Lawrence_(c.1800).jpg?width=400",
  "David Thompson": "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_(explorer).jpg?width=400",
  "Henry Hudson": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Hudson_%28Last_Voyage%29.jpg?width=400",
  "Henry Kelsey": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Kelsey_Statue_Manitoba_Legislature.JPG?width=400",
  "Martin Frobisher": "https://commons.wikimedia.org/wiki/Special:FilePath/Martin_Frobisher_by_Cornelis_Ketel.jpg?width=400",
  "Samuel Hearne": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20Project%20Gutenberg%20etext%2020110.jpg?width=400",
  "Simon Fraser": "https://commons.wikimedia.org/wiki/Special:FilePath/SimonFraserFurTrader.jpg?width=400",
  "Sir George Back": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_George_Back_by_William_Brockedon.jpg?width=400",
  "Sir John Franklin": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_John_Franklin_by_Negelen.jpg?width=400",
  "Dr. John Rae": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Rae_cropped.jpg?width=400",
  "Sir Robert McClure": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_McClure.jpg?width=400",
  "Sir William Edward Parry": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_William_Edward_Parry.jpg?width=400",
  "William Baffin": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Baffin.jpg?width=400",
  "John Davis": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Davis_(English_explorer).jpg?width=400",
  "William Bligh": "https://commons.wikimedia.org/wiki/Special:FilePath/WilliamBligh.jpeg?width=400",
  "James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_James_Douglas.jpg?width=400",
  "John McLoughlin": "https://commons.wikimedia.org/wiki/Special:FilePath/John_McLoughlin.jpg?width=400",
  "George Simpson": "https://commons.wikimedia.org/wiki/Special:FilePath/George_Simpson_portrait.jpg?width=400",
  "John Palliser": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Palliser.jpg?width=400",
  "Joseph Burr Tyrrell": "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Burr_Tyrrell.jpg?width=400",
  "Vilhjalmur Stefansson": "https://commons.wikimedia.org/wiki/Special:FilePath/Vilhjalmur_Stefansson.jpg?width=400",

  // Fur traders
  "Simon McTavish": "https://commons.wikimedia.org/wiki/Special:FilePath/Simon_McTavish.jpg?width=400",
  "William McGillivray": "https://commons.wikimedia.org/wiki/Special:FilePath/William_McGillivray.jpg?width=400",
  "Alexander Henry the Elder": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Henry_the_Elder.jpg?width=400",
  "Anthony Henday": "https://commons.wikimedia.org/wiki/Special:FilePath/Anthony_Henday_House_plaque.JPG?width=400",
  "Peter Pond": "https://commons.wikimedia.org/wiki/Special:FilePath/PeterPondMap.jpg?width=400",

  // Russian explorer
  "Aleksei Chirikov": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexei_Chirikov.jpg?width=400",

  // American explorers
  "Robert Gray": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Gray_(sea_captain).jpg?width=400",
  "Roald Amundsen": "https://commons.wikimedia.org/wiki/Special:FilePath/Amundsen_in_fur_skins.jpg?width=400",

  // Indigenous leaders
  "Chief Peguis": "https://commons.wikimedia.org/wiki/Special:FilePath/Peguis.jpg?width=400",
  "Akaitcho": "https://commons.wikimedia.org/wiki/Special:FilePath/Akaitcho.jpg?width=400",
  "Thanadelthur": "https://commons.wikimedia.org/wiki/Special:FilePath/Thanadelthur_statue.jpg?width=400",
  "Matonabbee": "https://commons.wikimedia.org/wiki/Special:FilePath/Matonabbee.jpg?width=400",
  "Shawnadithit": "https://commons.wikimedia.org/wiki/Special:FilePath/Shanawdithit.jpg?width=400",

  // Metis leaders
  "Gabriel Dumont": "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Dumont_(1886-8)_Orlando_Scott_Goff.jpg?width=400",
  "Cuthbert Grant": "https://commons.wikimedia.org/wiki/Special:FilePath/Cuthbert_Grant.jpg?width=400",
  "Jean-Baptiste Lagimodiere": "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Baptiste_Lagimodi%C3%A8re.jpg?width=400",
  "Marie-Anne Gaboury": "https://commons.wikimedia.org/wiki/Special:FilePath/Marie-Anne_Gaboury.jpg?width=400",

  // Norse explorer
  "Leif Erikson": "https://commons.wikimedia.org/wiki/Special:FilePath/Leif_Eriksson_Discovers_America_Christian_Krohg_1893.jpg?width=400",
};

async function finalPortraitUpdate() {
  console.log("============================================");
  console.log("  Final Portrait Update                    ");
  console.log("============================================\n");

  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${explorers.length} explorers\n`);

  let updated = 0;
  let alreadySet = 0;
  let noMatch: string[] = [];

  for (const explorer of explorers) {
    const portraitUrl = allPortraits[explorer.name];

    if (portraitUrl) {
      if (explorer.imageUrl !== portraitUrl) {
        await prisma.explorer.update({
          where: { id: explorer.id },
          data: { imageUrl: portraitUrl }
        });
        console.log(`  ✓ Updated: ${explorer.name}`);
        updated++;
      } else {
        alreadySet++;
      }
    } else if (!explorer.imageUrl) {
      noMatch.push(explorer.name);
    }
  }

  console.log(`\n============================================`);
  console.log(`  Results                                  `);
  console.log(`============================================`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Already set: ${alreadySet}`);
  console.log(`  Still need images: ${noMatch.length}`);

  if (noMatch.length > 0) {
    console.log(`\n  Explorers still without portraits:`);
    noMatch.forEach(name => console.log(`    - ${name}`));
  }

  console.log(`\n============================================`);
}

async function main() {
  try {
    await finalPortraitUpdate();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
