import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Final script to fix Wikimedia Commons image URLs
 * Uses VERIFIED filenames that have been tested to return HTTP 200
 */

// All URLs below have been verified to work (return HTTP 200 after redirects)
const VERIFIED_EXPLORER_IMAGES: Record<string, string> = {
  "Samuel de Champlain": "https://commons.wikimedia.org/wiki/Special:FilePath/Champlain%27s_1632_map_of_New_France.jpg?width=400",
  "David Thompson": "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_by_William_Henry_Fisk_(detail).jpg?width=400",
  "Samuel Hearne": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20Project%20Gutenberg%20etext%2020110.jpg?width=400",
  "Alexander Mackenzie": "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Mackenzie_by_Thomas_Lawrence_(c.1800).jpg?width=400",
  "Simon Fraser": "https://commons.wikimedia.org/wiki/Special:FilePath/SimonFraserFurTrader.jpg?width=400",
  "Jacques Cartier": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Cartier_1851-1852.png?width=400",
  "Pierre-Esprit Radisson": "https://commons.wikimedia.org/wiki/Special:FilePath/Radisson_and_Groseilliers.jpg?width=400",
  "Henry Hudson": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Hudson_%28Last_Voyage%29.jpg?width=400",
  "Sir John Franklin": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_John_Franklin_by_Negelen.jpg?width=400",
  "Captain James Cook": "https://commons.wikimedia.org/wiki/Special:FilePath/Captainjamescookportrait.jpg?width=400",
  "Louis Jolliet": "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Jolliet.JPG?width=400",
  "Jacques Marquette": "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Marquette.png?width=400",
  "Roald Amundsen": "https://commons.wikimedia.org/wiki/Special:FilePath/Amundsen_in_fur_skins.jpg?width=400",
  "Martin Frobisher": "https://commons.wikimedia.org/wiki/Special:FilePath/Martin_Frobisher_by_Cornelis_Ketel.jpg?width=400",
  "Etienne Brule": "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%89tienne_Br%C3%BBl%C3%A9.jpg?width=400",
  "Sir George Back": "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_George_Back_by_William_Brockedon.jpg?width=400",
  "Peter Pond": "https://commons.wikimedia.org/wiki/Special:FilePath/PeterPondMap.jpg?width=400",
  "Jean Nicolet": "https://commons.wikimedia.org/wiki/Special:FilePath/Landing_of_Jean_Nicolet.jpg?width=400",
  "Rene-Robert Cavelier, Sieur de La Salle": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Cavelier_de_La_Salle.jpg?width=400",
  "Henry Kelsey": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_Kelsey_Statue_Manitoba_Legislature.JPG?width=400",
  "Anthony Henday": "https://commons.wikimedia.org/wiki/Special:FilePath/Anthony_Henday_House_plaque.JPG?width=400",
};

const VERIFIED_LOCATION_IMAGES: Record<string, string> = {
  // Verified via Wikimedia API search and HTTP 200 test
  "York Factory": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "Fort William": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",
  "Prince of Wales Fort": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Cumberland House": "https://commons.wikimedia.org/wiki/Special:FilePath/Cumberland_House_-_Old_Stone_Powder_Magazine.jpg?width=800",
  "Fort Chipewyan": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Chipewyan,_Alberta.jpg?width=800",
  "Fort Edmonton": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Edmonton_Park.jpg?width=800",
  "Fort Garry": "https://commons.wikimedia.org/wiki/Special:FilePath/Lower_Fort_Garry,_front.jpg?width=800",
  "Lower Fort Garry": "https://commons.wikimedia.org/wiki/Special:FilePath/Lower_Fort_Garry,_front.jpg?width=800",
  "Norway House": "https://commons.wikimedia.org/wiki/Special:FilePath/Norway_House_Cree_Nation.jpg?width=800",
  "Fort Vancouver": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Vancouver_-_stockade_building.jpg?width=800",
  "Fort Langley": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Langley_NHS.JPG?width=800",
  "Grand Portage": "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Portage_National_Monument_Great_Hall.jpg?width=800",
  "Sault Ste. Marie": "https://commons.wikimedia.org/wiki/Special:FilePath/Sault_Ste._Marie_Canal_National_Historic_Site.jpg?width=800",
  "Rocky Mountain House": "https://commons.wikimedia.org/wiki/Special:FilePath/Rocky_Mountain_House_NHS.JPG?width=800",
  "Fort St. James": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_St._James_NHS.jpg?width=800",
  "Moose Factory": "https://commons.wikimedia.org/wiki/Special:FilePath/MooseFactory1.jpg?width=800",
  "Fort Albany": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Albany_First_Nation.jpg?width=800",
  "Fort Churchill": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Quebec City": "https://commons.wikimedia.org/wiki/Special:FilePath/Chateau_Frontenac_02.jpg?width=800",
  "Montreal": "https://commons.wikimedia.org/wiki/Special:FilePath/Place-Jacques-Cartier.jpg?width=800",
  "Tadoussac": "https://commons.wikimedia.org/wiki/Special:FilePath/Tadoussac_QC.jpg?width=800",
  "Fort Gibraltar": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Gibraltar_Festival_du_Voyageur.jpg?width=800",
  "Bloody Falls": "https://commons.wikimedia.org/wiki/Special:FilePath/Bloody_Falls_on_Coppermine_River.jpg?width=800",
  "Methye Portage": "https://commons.wikimedia.org/wiki/Special:FilePath/Methye_Portage.jpg?width=800",
  "Port-Royal": "https://commons.wikimedia.org/wiki/Special:FilePath/Port-Royal_National_Historic_Site.jpg?width=800",
  "Cape Bonavista": "https://commons.wikimedia.org/wiki/Special:FilePath/Cape_Bonavista_Lighthouse.jpg?width=800",
  "Batoche": "https://commons.wikimedia.org/wiki/Special:FilePath/Batoche_church.JPG?width=800",
  "Fort Carlton": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Carlton_Provincial_Historic_Park.jpg?width=800",
  "Fort Battleford": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Battleford_NHS.jpg?width=800",
};

const VERIFIED_FIELD_TRIP_STOP_IMAGES: Record<string, string> = {
  // York Factory trip
  "Ship from England": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "Arriving by Ship": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "Depot Building": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "York Factory": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "York Boat": "https://commons.wikimedia.org/wiki/Special:FilePath/YorkFactoryaerial.jpg?width=800",

  // Fort William trip
  "Great Hall": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",
  "Fort William": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",
  "Canoe Yard": "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageur_canoes_Alouette_Lake.jpg?width=800",
  "Canoe": "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageur_canoes_Alouette_Lake.jpg?width=800",
  "Voyageur": "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageur_canoes_Alouette_Lake.jpg?width=800",

  // L'Anse aux Meadows trip
  "Viking": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "L'Anse aux Meadows": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Norse": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Skr": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Forge": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Boat Repair": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Archaeological": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",

  // Prince of Wales Fort trip
  "Prince of Wales": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Star Fort": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Cannon": "https://commons.wikimedia.org/wiki/Special:FilePath/Churchill_Fort_Prince_of_Wales.jpg?width=800",
  "Samuel Hearne": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20Project%20Gutenberg%20etext%2020110.jpg?width=800",
  "1782 Surrender": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20Project%20Gutenberg%20etext%2020110.jpg?width=800",
  "Churchill": "https://commons.wikimedia.org/wiki/Special:FilePath/Churchill_Fort_Prince_of_Wales.jpg?width=800",
  "Trade Post": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Visiting Today": "https://commons.wikimedia.org/wiki/Special:FilePath/Churchill_Fort_Prince_of_Wales.jpg?width=800",
};

const VERIFIED_FIELD_TRIP_COVERS: Record<string, string> = {
  "York Factory": "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
  "Fort William": "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",
  "L'Anse aux Meadows": "https://commons.wikimedia.org/wiki/Special:FilePath/Authentic_Viking_recreation.jpg?width=800",
  "Prince of Wales": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort,_Churchill,_MB.jpg?width=800",
  "Voyageur": "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageur_canoes_Alouette_Lake.jpg?width=800",
};

async function fixExplorerImages() {
  console.log("\n=== Fixing Explorer Images ===\n");

  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  let updated = 0;
  for (const explorer of explorers) {
    const knownUrl = VERIFIED_EXPLORER_IMAGES[explorer.name];
    if (knownUrl) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl: knownUrl },
      });
      console.log(`  Updated ${explorer.name}`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} explorer images`);
}

async function fixLocationImages() {
  console.log("\n=== Fixing Location Images ===\n");

  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  let updated = 0;
  for (const location of locations) {
    let knownUrl = VERIFIED_LOCATION_IMAGES[location.name];

    // Try partial matches
    if (!knownUrl) {
      const firstName = location.name.split(" ")[0] || "";
      for (const [key, url] of Object.entries(VERIFIED_LOCATION_IMAGES)) {
        if (location.name.includes(key) || (firstName && key.includes(firstName))) {
          knownUrl = url;
          break;
        }
      }
    }

    if (knownUrl) {
      await prisma.location.update({
        where: { id: location.id },
        data: { imageUrl: knownUrl },
      });
      console.log(`  Updated ${location.name}`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} location images`);
}

async function fixFieldTripCovers() {
  console.log("\n=== Fixing Virtual Field Trip Cover Images ===\n");

  const trips = await prisma.virtualFieldTrip.findMany({
    select: { id: true, title: true, coverImageUrl: true },
  });

  let updated = 0;
  for (const trip of trips) {
    let knownUrl: string | null = null;
    for (const [key, url] of Object.entries(VERIFIED_FIELD_TRIP_COVERS)) {
      if (trip.title.toLowerCase().includes(key.toLowerCase())) {
        knownUrl = url;
        break;
      }
    }

    if (knownUrl) {
      await prisma.virtualFieldTrip.update({
        where: { id: trip.id },
        data: { coverImageUrl: knownUrl },
      });
      console.log(`  Updated "${trip.title}"`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} field trip cover images`);
}

async function fixFieldTripStopImages() {
  console.log("\n=== Fixing Field Trip Stop Images ===\n");

  const stops = await prisma.fieldTripStop.findMany({
    select: { id: true, title: true, imageUrl: true },
  });

  let updated = 0;
  for (const stop of stops) {
    let knownUrl: string | null = null;

    // Check field trip stop images
    for (const [key, url] of Object.entries(VERIFIED_FIELD_TRIP_STOP_IMAGES)) {
      if (stop.title.toLowerCase().includes(key.toLowerCase())) {
        knownUrl = url;
        break;
      }
    }

    // Also check location images
    if (!knownUrl) {
      for (const [key, url] of Object.entries(VERIFIED_LOCATION_IMAGES)) {
        if (stop.title.toLowerCase().includes(key.toLowerCase())) {
          knownUrl = url;
          break;
        }
      }
    }

    if (knownUrl) {
      await prisma.fieldTripStop.update({
        where: { id: stop.id },
        data: { imageUrl: knownUrl },
      });
      console.log(`  Updated "${stop.title}"`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} field trip stop images`);
}

async function listSampleUrls() {
  console.log("\n=== Sample Updated URLs ===\n");

  const explorers = await prisma.explorer.findMany({
    where: { imageUrl: { not: null } },
    select: { name: true, imageUrl: true },
    take: 5,
  });
  console.log("Sample Explorers:");
  explorers.forEach((e) => console.log(`  ${e.name}: ${e.imageUrl}`));

  const locations = await prisma.location.findMany({
    where: { imageUrl: { not: null } },
    select: { name: true, imageUrl: true },
    take: 5,
  });
  console.log("\nSample Locations:");
  locations.forEach((l) => console.log(`  ${l.name}: ${l.imageUrl}`));

  const trips = await prisma.virtualFieldTrip.findMany({
    where: { coverImageUrl: { not: null } },
    select: { title: true, coverImageUrl: true },
  });
  console.log("\nField Trip Covers:");
  trips.forEach((t) => console.log(`  ${t.title}: ${t.coverImageUrl}`));
}

async function main() {
  console.log("============================================");
  console.log("  Wikimedia Commons Image URL Fixer        ");
  console.log("  (Final Version - Verified URLs Only)    ");
  console.log("============================================");

  try {
    await fixExplorerImages();
    await fixLocationImages();
    await fixFieldTripCovers();
    await fixFieldTripStopImages();

    console.log("\n============================================");
    console.log("  Image URL Fix Complete!                   ");
    console.log("============================================");

    await listSampleUrls();

  } catch (error) {
    console.error("Error fixing image URLs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
