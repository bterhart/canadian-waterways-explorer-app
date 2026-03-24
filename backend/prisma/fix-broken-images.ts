// Fix broken Google Places API image URLs by replacing with Wikimedia Commons URLs
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) throw new Error("TURSO_DATABASE_URL not set");

const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
const prisma = new PrismaClient({ adapter });

// Comprehensive mapping of location names to Wikimedia Commons public domain images
const locationImages: Record<string, string> = {
  // Hudson Bay Coastal Posts
  "York Factory": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
  "Prince of Wales Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
  "Fort Churchill (HBC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Churchill_Manitoba.jpg/1280px-Churchill_Manitoba.jpg",
  "Fort Severn": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hudson_Bay_coast.jpg/1280px-Hudson_Bay_coast.jpg",
  "Rupert House (Fort Charles)": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/James_Bay_Ontario.jpg/1280px-James_Bay_Ontario.jpg",
  "Moose Factory": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MooseFactory1.jpg/1280px-MooseFactory1.jpg",
  "Marble Island": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hudson_Bay_coast.jpg/1280px-Hudson_Bay_coast.jpg",

  // Red River / Fort Garry Posts
  "Fort Garry (Upper)": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Upper Fort Garry": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Fort Garry": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Lower Fort Garry": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lower_Fort_Garry_stone_walls.jpg/1280px-Lower_Fort_Garry_stone_walls.jpg",
  "Fort Pembina": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Red_River_Valley.jpg/1280px-Red_River_Valley.jpg",

  // Saskatchewan River Posts
  "Fort Carlton": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fort_Carlton_Provincial_Park.jpg/1280px-Fort_Carlton_Provincial_Park.jpg",
  "Fort Augustus (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/North_Saskatchewan_River.jpg/1280px-North_Saskatchewan_River.jpg",
  "Fort Pitt": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Saskatchewan_prairie.jpg/1280px-Saskatchewan_prairie.jpg",
  "Fort Battleford": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg",
  "Fort Ellice": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Assiniboine_River.jpg/1280px-Assiniboine_River.jpg",
  "Fort George (NWC - Saskatchewan)": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Saskatchewan_River_bend.jpg/1280px-Saskatchewan_River_bend.jpg",

  // Rocky Mountain Posts
  "Rocky Mountain House": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rocky_Mountain_House_NHS_%282%29.JPG/1280px-Rocky_Mountain_House_NHS_%282%29.JPG",
  "Rocky Mountain House (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Rocky_Mountains_foothills.jpg/1280px-Rocky_Mountains_foothills.jpg",
  "Kootenay House": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Columbia_Valley.jpg/1280px-Columbia_Valley.jpg",

  // Athabasca & Mackenzie Posts
  "Fort Norman": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Great_Bear_River.jpg/1280px-Great_Bear_River.jpg",
  "Fort Simpson": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mackenzie_River_NWT.jpg/1280px-Mackenzie_River_NWT.jpg",
  "Fort Providence": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mackenzie_River_ice.jpg/1280px-Mackenzie_River_ice.jpg",
  "Fort Rae": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Great_Slave_Lake_aerial.jpg/1280px-Great_Slave_Lake_aerial.jpg",
  "Fort Reliance": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Great_Slave_Lake_shore.jpg/1280px-Great_Slave_Lake_shore.jpg",
  "Fort Vermilion (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Peace_River_valley.jpg/1280px-Peace_River_valley.jpg",
  "Fort Dunvegan": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Fort_Dunvegan_NHS.jpg/1280px-Fort_Dunvegan_NHS.jpg",

  // Lake System Posts
  "Norway House": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Lake_Winnipeg_shore.jpg/1280px-Lake_Winnipeg_shore.jpg",
  "Bas-de-la-Rivière (Fort Alexander)": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Winnipeg_River.jpg/1280px-Winnipeg_River.jpg",
  "Sault Ste. Marie Post": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sault_Ste_Marie_locks.jpg/1280px-Sault_Ste_Marie_locks.jpg",

  // BC Interior Posts
  "Fort St. James": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Fort_St_James_NHS.jpg/1280px-Fort_St_James_NHS.jpg",
  "Fort Kamloops": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Thompson_Rivers_confluence.jpg/1280px-Thompson_Rivers_confluence.jpg",
  "Fort McLeod (BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/McLeod_Lake_BC.jpg/1280px-McLeod_Lake_BC.jpg",
  "Fort George (NWC - BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Fraser_River_Prince_George.jpg/1280px-Fraser_River_Prince_George.jpg",
  "Fort Alexandria": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fraser_River_canyon.jpg/1280px-Fraser_River_canyon.jpg",
  "Fort McLoughlin": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Central_Coast_BC.jpg/1280px-Central_Coast_BC.jpg",

  // Pacific Coast Posts
  "Fort Rupert": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg",
  "Fort Simpson (BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/North_Coast_BC.jpg/1280px-North_Coast_BC.jpg",
  "Spokane House": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Spokane_River.jpg/1280px-Spokane_River.jpg",
  "Fort Nez Percés (Fort Walla Walla)": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Columbia_River_Wallula.jpg/1280px-Columbia_River_Wallula.jpg",

  // Eastern / Historical Sites
  "Batoche": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Batoche_National_Historic_Site.jpg/1280px-Batoche_National_Historic_Site.jpg",
  "Quebec City": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Old_Quebec_City.jpg/1280px-Old_Quebec_City.jpg",
  "Montreal": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Montreal_harbour_1878.jpg/1280px-Montreal_harbour_1878.jpg",
  "Port-Royal (Habitation)": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Port_Royal_habitation.jpg/1280px-Port_Royal_habitation.jpg",
  "Red Bay Basque Whaling Station": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Red_Bay_Labrador.jpg/1280px-Red_Bay_Labrador.jpg",
  "Fort St. Charles": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Lake_of_the_Woods.jpg/1280px-Lake_of_the_Woods.jpg",

  // Pacific Contact Sites
  "Bligh Island (Nootka Sound)": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "Friendly Cove Landing (Cook's Landing)": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "Point Grey (Vancouver Meeting Point)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Point_Grey_BC.jpg/1280px-Point_Grey_BC.jpg",
  "Spanish Banks Beach": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Point_Grey_BC.jpg/1280px-Point_Grey_BC.jpg",

  // Portage Routes
  "Frog Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Saskatchewan_River_Delta.jpg/1280px-Saskatchewan_River_Delta.jpg",
  "French Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg",
  "Great Dog Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg",
  "La Vase Portages": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Kaministiquia_River.jpg/1280px-Kaministiquia_River.jpg",
  "Long Sault Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Winnipeg_River.jpg/1280px-Winnipeg_River.jpg",
  "Rat Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rainy_Lake.jpg/1280px-Rainy_Lake.jpg",
  "Slave Falls Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg",
  "The Pas Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Swan_River_Manitoba.jpg/1280px-Swan_River_Manitoba.jpg",
};

// Generic fallback for any location type not specifically mapped
const genericImages: Record<string, string> = {
  "Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lower_Fort_Garry_stone_walls.jpg/1280px-Lower_Fort_Garry_stone_walls.jpg",
  "Trading Post": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
  "Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg",
  "Settlement": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Old_Quebec_City.jpg/1280px-Old_Quebec_City.jpg",
  "Cultural Site": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Batoche_National_Historic_Site.jpg/1280px-Batoche_National_Historic_Site.jpg",
};

async function main() {
  console.log("Fixing broken Google Places image URLs...\n");

  // Find all locations with Google Places URLs
  const brokenLocations = await prisma.location.findMany({
    where: {
      imageUrl: {
        contains: "maps.googleapis.com"
      }
    },
    select: { id: true, name: true, locationType: true, imageUrl: true }
  });

  console.log(`Found ${brokenLocations.length} locations with broken Google Places URLs\n`);

  let fixed = 0;
  let usedFallback = 0;
  let failed = 0;

  for (const location of brokenLocations) {
    const wikimediaUrl = locationImages[location.name];

    if (wikimediaUrl) {
      await prisma.location.update({
        where: { id: location.id },
        data: { imageUrl: wikimediaUrl }
      });
      console.log(`✓ Fixed: ${location.name}`);
      fixed++;
    } else {
      // Use type-based fallback
      const fallbackUrl = genericImages[location.locationType];
      if (fallbackUrl) {
        await prisma.location.update({
          where: { id: location.id },
          data: { imageUrl: fallbackUrl }
        });
        console.log(`~ Fallback (${location.locationType}): ${location.name}`);
        usedFallback++;
      } else {
        console.log(`✗ No image found for: ${location.name} (${location.locationType})`);
        failed++;
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Fixed with specific image: ${fixed}`);
  console.log(`Fixed with fallback image: ${usedFallback}`);
  console.log(`Could not fix: ${failed}`);

  // Verify results
  const remaining = await prisma.location.count({
    where: { imageUrl: { contains: "maps.googleapis.com" } }
  });
  console.log(`\nRemaining Google Places URLs: ${remaining}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
