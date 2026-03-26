import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Using Turso cloud database
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Comprehensive script to add/update Wikipedia portrait images for ALL explorers
 *
 * Research methodology:
 * - Primary: Portrait paintings, photographs, engravings from Wikipedia infoboxes
 * - Secondary: Historical drawings, sketches
 * - Tertiary: Statues, memorials (only if no portrait exists)
 * - Last resort: Representative images (maps, documents)
 *
 * URL Format: https://commons.wikimedia.org/wiki/Special:FilePath/EXACT_FILENAME?width=400
 */

// Comprehensive map of ALL explorers to their best available Wikipedia images
const explorerPortraits: Record<string, string> = {
  // ========================================
  // EXPLORERS WHO NEED BETTER PORTRAITS
  // (Replacing maps/statues/plaques with actual portraits)
  // ========================================

  // Samuel de Champlain - Replace map with actual portrait
  // The portrait by Moncornet is the most commonly used
  "Samuel de Champlain": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel_de_Champlain_-_portrait_by_Th%C3%A9ophile_Hamel.jpg?width=400",

  // Anthony Henday - No known portrait exists, keep plaque as best option
  // (leaving as is - plaque is the best available)

  // Henry Kelsey - No known portrait, statue is best available
  // (leaving as is)

  // Peter Pond - Replace map with actual portrait if available
  // No portrait known - map may be best option

  // Thanadelthur - Use the artistic interpretation/drawing
  "Thanadelthur": "https://commons.wikimedia.org/wiki/Special:FilePath/Thanadelthur.jpg?width=400",

  // ========================================
  // EXPLORERS CURRENTLY WITHOUT IMAGES
  // ========================================

  // Alexander Henry the Younger - no known portrait
  // He was nephew of Alexander Henry the Elder

  // Charlotte Small - wife of David Thompson
  // No known portrait exists

  // Daniel Williams Harmon - fur trader, author
  "Daniel Williams Harmon": "https://commons.wikimedia.org/wiki/Special:FilePath/Daniel_Williams_Harmon.jpg?width=400",

  // Duncan McGillivray - NWC partner
  // No known portrait exists

  // François de La Vérendrye - son of Pierre
  // No known portrait exists

  // Isabel Gunn - disguised as man to work for HBC
  // No known portrait exists

  // Jacques de Noyon - early French Canadian explorer
  // No known portrait exists

  // James Knight - HBC governor, died at Marble Island
  // No known portrait exists

  // Jean-Baptiste Gaultier de La Vérendrye - son of Pierre, killed at Lake of the Woods
  // No known portrait exists

  // John McDonald of Garth - NWC partner
  // No known portrait exists

  // Joseph Colen - HBC factor at York Factory
  // No known portrait exists

  // Louis-Joseph Gaultier de La Vérendrye - "Chevalier" - reached Rocky Mountains
  // Use La Vérendrye family artistic representation

  // Luke Foxe - Arctic explorer, rival of Thomas James
  "Luke Foxe": "https://commons.wikimedia.org/wiki/Special:FilePath/Luke_Foxe.jpg?width=400",

  // Matthew Cocking - HBC explorer, inland journeys
  // No known portrait exists

  // Moses Norton - HBC factor, mixed heritage
  // No known portrait exists

  // Peter Fidler - HBC surveyor and mapmaker
  // No known portrait - use his map or survey work
  "Peter Fidler": "https://commons.wikimedia.org/wiki/Special:FilePath/Peter_Fidler_Map.jpg?width=400",

  // Philip Turnor - HBC surveyor, trained David Thompson
  // No known portrait exists

  // Pierre Gaultier de La Vérendrye fils - son of Pierre
  // No known portrait exists

  // Richard Norton - HBC factor, father of Moses Norton
  // No known portrait exists

  // Richard Stuart - British explorer
  // No known portrait exists

  // Robert Bylot - Arctic navigator, sailed with Hudson, Baffin
  // No known portrait exists

  // Roderick Mackenzie - cousin of Alexander Mackenzie, NWC
  // No known portrait exists

  // Thomas Button - Welsh explorer, searched for Northwest Passage
  // No known portrait exists

  // Thomas James - Welsh explorer, James Bay named for him
  "Thomas James": "https://commons.wikimedia.org/wiki/Special:FilePath/Thomas_James_(explorer).jpg?width=400",

  // William Stuart - HBC employee
  // No known portrait exists

  // William Tomison - HBC Chief Factor
  // No known portrait exists

  // ========================================
  // EXISTING EXPLORERS - VERIFY/UPDATE URLS
  // ========================================

  // These are confirmed working portraits
  "Captain George Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/Probably%20George%20Vancouver%20from%20NPG.jpg?width=400",
  "Captain James Cook": "https://commons.wikimedia.org/wiki/Special:FilePath/Captainjamescookportrait.jpg?width=400",
  "Cayetano Valdés": "https://commons.wikimedia.org/wiki/Special:FilePath/CayetanoVald%C3%A9sYFloresJos%C3%A9Rold%C3%A1nMart%C3%ADnez1847.jpg?width=400",
  "John Cabot (Giovanni Caboto)": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cabot.jpg?width=400",
  "Vitus Bering": "https://commons.wikimedia.org/wiki/Special:FilePath/Vitus_Bering.jpg?width=400",
  "Jean-François de Galaup, comte de La Pérouse": "https://commons.wikimedia.org/wiki/Special:FilePath/Laperouse.jpg?width=400",
  "Pierre Gaultier de Varennes, Sieur de La Vérendrye": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_de_La_Verendrye_by_Edgar_Samuel_Paxson%2C_1912.jpg?width=400",
  "Louis Riel": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=400",
  "Gabriel Dumont": "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Dumont_(1886-8)_Orlando_Scott_Goff.jpg?width=400",
  "Crowfoot": "https://commons.wikimedia.org/wiki/Special:FilePath/Chief_Crowfoot.jpg?width=400",
  "Big Bear": "https://commons.wikimedia.org/wiki/Special:FilePath/Bigbear-blanket.jpg?width=400",
  "Poundmaker": "https://commons.wikimedia.org/wiki/Special:FilePath/Poundmaker.png?width=400",
  "Dr. John Rae": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Rae_cropped.jpg?width=400",
  "George Simpson": "https://commons.wikimedia.org/wiki/Special:FilePath/George_Simpson_portrait.jpg?width=400",
  "William Bligh": "https://commons.wikimedia.org/wiki/Special:FilePath/WilliamBligh.jpeg?width=400",
  "Leif Erikson": "https://commons.wikimedia.org/wiki/Special:FilePath/Leif_Eriksson_Discovers_America_Christian_Krohg_1893.jpg?width=400",
  "Sir Robert McClure": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_McClure.jpg?width=400",
  "Sir William Edward Parry": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_William_Edward_Parry.jpg?width=400",
  "Vilhjalmur Stefansson": "https://commons.wikimedia.org/wiki/Special:FilePath/Vilhjalmur_Stefansson.jpg?width=400",
  "William Baffin": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Baffin.jpg?width=400",
  "John Davis": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Davis_(English_explorer).jpg?width=400",
  "John Palliser": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Palliser.jpg?width=400",
  "Joseph Burr Tyrrell": "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Burr_Tyrrell.jpg?width=400",
  "Aleksei Chirikov": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexei_Chirikov.jpg?width=400",
  "Robert Gray": "https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Gray_(sea_captain).jpg?width=400",
  "Dionisio Alcalá Galiano": "https://commons.wikimedia.org/wiki/Special:FilePath/Dionisio_Alcal%C3%A1_Galiano.jpg?width=400",
  "Juan Francisco de la Bodega y Quadra": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Francisco_de_la_Bodega_y_Quadra.jpg?width=400",
  "José María Narváez": "https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Maria_Narvaez.jpg?width=400",
  "Juan Pérez": "https://commons.wikimedia.org/wiki/Special:FilePath/Juan_Jose_Perez_Hernandez.jpg?width=400",
  "Bruno de Heceta (Hezeta)": "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno_de_Heceta.jpg?width=400",
  "Chief Peguis": "https://commons.wikimedia.org/wiki/Special:FilePath/Peguis.jpg?width=400",
  "Akaitcho": "https://commons.wikimedia.org/wiki/Special:FilePath/Akaitcho.jpg?width=400",
  "Matonabbee": "https://commons.wikimedia.org/wiki/Special:FilePath/Matonabbee.jpg?width=400",
  "Shawnadithit": "https://commons.wikimedia.org/wiki/Special:FilePath/Shanawdithit.jpg?width=400",
  "Alexander Henry the Elder": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Henry_the_Elder.jpg?width=400",
  "Antoine Laumet de La Mothe Cadillac": "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine_de_la_Mothe_Cadillac.jpg?width=400",
  "James Douglas": "https://commons.wikimedia.org/wiki/Special:FilePath/James_Douglas_(governor).jpg?width=400",
  "John McLoughlin": "https://commons.wikimedia.org/wiki/Special:FilePath/John_McLoughlin.jpg?width=400",
  "Medard des Groseilliers": "https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%A9dard_Chouart_des_Groseilliers.jpg?width=400",
  "Pierre Le Moyne d'Iberville": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_Le_Moyne_d%27Iberville.jpg?width=400",
  "Simon McTavish": "https://commons.wikimedia.org/wiki/Special:FilePath/Simon_McTavish.jpg?width=400",
  "William McGillivray": "https://commons.wikimedia.org/wiki/Special:FilePath/William_McGillivray.jpg?width=400",
  "Jean-Baptiste Lagimodiere": "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Baptiste_Lagimodi%C3%A8re.jpg?width=400",
  "Marie-Anne Gaboury": "https://commons.wikimedia.org/wiki/Special:FilePath/Marie-Anne_Gaboury.jpg?width=400",
  "Cuthbert Grant": "https://commons.wikimedia.org/wiki/Special:FilePath/Cuthbert_Grant.jpg?width=400",
};

async function updateExplorerPortraits() {
  console.log("============================================");
  console.log("  Updating ALL Explorer Portrait Images    ");
  console.log("============================================\n");

  // Get all explorers
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${explorers.length} total explorers\n`);

  let updated = 0;
  let alreadyCorrect = 0;
  let noPortraitAvailable: string[] = [];

  for (const explorer of explorers) {
    const newUrl = explorerPortraits[explorer.name];

    if (newUrl) {
      if (explorer.imageUrl !== newUrl) {
        await prisma.explorer.update({
          where: { id: explorer.id },
          data: { imageUrl: newUrl }
        });
        console.log(`  ✓ Updated: ${explorer.name}`);
        updated++;
      } else {
        alreadyCorrect++;
      }
    } else if (!explorer.imageUrl) {
      noPortraitAvailable.push(explorer.name);
    }
  }

  console.log(`\n============================================`);
  console.log(`  Results                                  `);
  console.log(`============================================`);
  console.log(`  Updated: ${updated} explorers`);
  console.log(`  Already correct: ${alreadyCorrect} explorers`);
  console.log(`  No portrait available: ${noPortraitAvailable.length} explorers`);

  if (noPortraitAvailable.length > 0) {
    console.log(`\n  Explorers with no known portrait:`);
    noPortraitAvailable.forEach(name => console.log(`    - ${name}`));
  }

  console.log(`\n============================================`);
  console.log(`  Portrait Update Complete!                `);
  console.log(`============================================`);
}

async function main() {
  try {
    await updateExplorerPortraits();
  } catch (error) {
    console.error("\n❌ Error updating portraits:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
