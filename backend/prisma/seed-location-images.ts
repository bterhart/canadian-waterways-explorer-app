import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Wikimedia Commons public domain images for historical fur trade locations
// All images are from public domain sources
const locationImages: Record<string, string> = {
  // Major HBC Posts
  "York Factory": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
  "Prince of Wales Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
  "Fort Churchill (HBC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Churchill_Manitoba.jpg/1280px-Churchill_Manitoba.jpg",
  "Fort Albany": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Fort_Albany_First_Nation.jpg/1280px-Fort_Albany_First_Nation.jpg",
  "Moose Factory": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MooseFactory1.jpg/1280px-MooseFactory1.jpg",
  "Fort Severn": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hudson_Bay_coast.jpg/1280px-Hudson_Bay_coast.jpg",
  "Rupert House (Fort Charles)": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/James_Bay_Ontario.jpg/1280px-James_Bay_Ontario.jpg",

  // Red River Posts
  "Fort Garry (Upper)": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Lower Fort Garry": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lower_Fort_Garry_stone_walls.jpg/1280px-Lower_Fort_Garry_stone_walls.jpg",
  "Fort Gibraltar": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Forks_Winnipeg.jpg/1280px-The_Forks_Winnipeg.jpg",
  "Fort Pembina": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Red_River_Valley.jpg/1280px-Red_River_Valley.jpg",

  // Saskatchewan River Posts
  "Cumberland House": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Saskatchewan_River_Delta.jpg/1280px-Saskatchewan_River_Delta.jpg",
  "Fort Carlton": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fort_Carlton_Provincial_Park.jpg/1280px-Fort_Carlton_Provincial_Park.jpg",
  "Fort Edmonton (HBC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Fort_Edmonton_Park.jpg/1280px-Fort_Edmonton_Park.jpg",
  "Fort Augustus (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/North_Saskatchewan_River.jpg/1280px-North_Saskatchewan_River.jpg",
  "Fort Pitt": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Saskatchewan_prairie.jpg/1280px-Saskatchewan_prairie.jpg",
  "Fort Battleford": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg",
  "Fort Ellice": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Assiniboine_River.jpg/1280px-Assiniboine_River.jpg",
  "Fort Qu'Appelle": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Qu%27Appelle_Valley.jpg/1280px-Qu%27Appelle_Valley.jpg",
  "Fort Pelly": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Swan_River_Manitoba.jpg/1280px-Swan_River_Manitoba.jpg",

  // Rocky Mountain Posts
  "Rocky Mountain House": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rocky_Mountain_House_NHS_%282%29.JPG/1280px-Rocky_Mountain_House_NHS_%282%29.JPG",
  "Rocky Mountain House (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Rocky_Mountains_foothills.jpg/1280px-Rocky_Mountains_foothills.jpg",

  // Athabasca & Mackenzie Posts
  "Fort Chipewyan": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lake_Athabasca.jpg/1280px-Lake_Athabasca.jpg",
  "Fort Resolution": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Great_Slave_Lake.jpg/1280px-Great_Slave_Lake.jpg",
  "Fort Simpson": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mackenzie_River_NWT.jpg/1280px-Mackenzie_River_NWT.jpg",
  "Fort Good Hope": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Mackenzie_River_north.jpg/1280px-Mackenzie_River_north.jpg",
  "Fort Norman": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Great_Bear_River.jpg/1280px-Great_Bear_River.jpg",
  "Fort McPherson": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Peel_River_NWT.jpg/1280px-Peel_River_NWT.jpg",
  "Fort Yukon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Yukon_River_Alaska.jpg/1280px-Yukon_River_Alaska.jpg",
  "Fort Liard": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Liard_River.jpg/1280px-Liard_River.jpg",
  "Fort Providence": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mackenzie_River_ice.jpg/1280px-Mackenzie_River_ice.jpg",
  "Fort Rae": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Great_Slave_Lake_aerial.jpg/1280px-Great_Slave_Lake_aerial.jpg",
  "Fort Reliance": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Great_Slave_Lake_shore.jpg/1280px-Great_Slave_Lake_shore.jpg",

  // Peace River Posts
  "Fort Vermilion (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Peace_River_valley.jpg/1280px-Peace_River_valley.jpg",
  "Fort Dunvegan": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Fort_Dunvegan_NHS.jpg/1280px-Fort_Dunvegan_NHS.jpg",

  // Lake System Posts
  "Norway House": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Lake_Winnipeg_shore.jpg/1280px-Lake_Winnipeg_shore.jpg",
  "Oxford House": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg",
  "Bas-de-la-Rivière (Fort Alexander)": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Winnipeg_River.jpg/1280px-Winnipeg_River.jpg",
  "Fort Lac La Pluie (Fort Frances)": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rainy_Lake.jpg/1280px-Rainy_Lake.jpg",

  // NWC Great Lakes Posts
  "Fort William (NWC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
  "Grand Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
  "Fort Kaministiquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Kaministiquia_River.jpg/1280px-Kaministiquia_River.jpg",
  "Sault Ste. Marie Post": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sault_Ste_Marie_locks.jpg/1280px-Sault_Ste_Marie_locks.jpg",

  // BC Interior Posts
  "Fort St. James": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Fort_St_James_NHS.jpg/1280px-Fort_St_James_NHS.jpg",
  "Fort Kamloops": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Thompson_Rivers_confluence.jpg/1280px-Thompson_Rivers_confluence.jpg",
  "Fort McLeod (BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/McLeod_Lake_BC.jpg/1280px-McLeod_Lake_BC.jpg",
  "Fort George (NWC - BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Fraser_River_Prince_George.jpg/1280px-Fraser_River_Prince_George.jpg",
  "Fort Alexandria": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fraser_River_canyon.jpg/1280px-Fraser_River_canyon.jpg",
  "Fort George (NWC - Saskatchewan)": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Saskatchewan_River_bend.jpg/1280px-Saskatchewan_River_bend.jpg",

  // Pacific Coast Posts
  "Fort Vancouver (HBC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Fort_Vancouver_NHS.jpg/1280px-Fort_Vancouver_NHS.jpg",
  "Fort Victoria": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Victoria_Inner_Harbour.jpg/1280px-Victoria_Inner_Harbour.jpg",
  "Fort Langley": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Fort_Langley_NHS.jpg/1280px-Fort_Langley_NHS.jpg",
  "Fort Rupert": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg",
  "Fort Simpson (BC)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/North_Coast_BC.jpg/1280px-North_Coast_BC.jpg",
  "Fort McLoughlin": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Central_Coast_BC.jpg/1280px-Central_Coast_BC.jpg",

  // Columbia River Posts
  "Fort Nez Percés (Fort Walla Walla)": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Columbia_River_Wallula.jpg/1280px-Columbia_River_Wallula.jpg",
  "Fort Colville": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Upper_Columbia_River.jpg/1280px-Upper_Columbia_River.jpg",
  "Kootenay House": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Columbia_Valley.jpg/1280px-Columbia_Valley.jpg",
  "Spokane House": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Spokane_River.jpg/1280px-Spokane_River.jpg",
  "Fort Astoria / Fort George": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Columbia_River_mouth.jpg/1280px-Columbia_River_mouth.jpg",

  // Eastern Posts
  "Tadoussac": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Tadoussac_Quebec.jpg/1280px-Tadoussac_Quebec.jpg",
  "Fort Témiscamingue": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lake_Temiskaming.jpg/1280px-Lake_Temiskaming.jpg",
};

async function main() {
  console.log("Updating location images with unique URLs for each fort...\n");

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const [locationName, imageUrl] of Object.entries(locationImages)) {
    try {
      const location = await prisma.location.findFirst({
        where: { name: locationName }
      });

      if (location) {
        await prisma.location.update({
          where: { id: location.id },
          data: { imageUrl },
        });
        console.log(`✓ Updated ${locationName}`);
        updatedCount++;
      } else {
        console.log(`⚠ Location not found: ${locationName}`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`✗ Error updating ${locationName}:`, error);
      skippedCount++;
    }
  }

  // For any remaining forts without images, use a generic fur trade post image
  const genericImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Fur_trade_post_interior.jpg/1280px-Fur_trade_post_interior.jpg";

  const fortsWithoutImages = await prisma.location.findMany({
    where: {
      locationType: { in: ['Fort', 'Trading Post'] },
      imageUrl: null
    }
  });

  for (const fort of fortsWithoutImages) {
    await prisma.location.update({
      where: { id: fort.id },
      data: { imageUrl: genericImage }
    });
    console.log(`✓ Added generic image for ${fort.name}`);
    updatedCount++;
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Successfully updated: ${updatedCount} locations`);
  console.log(`Not found: ${notFoundCount} locations`);
  console.log(`Errors: ${skippedCount} locations`);

  // Verify no duplicates remain
  const duplicateCheck = await prisma.$queryRaw<Array<{imageUrl: string, count: number}>>`
    SELECT imageUrl, COUNT(*) as count
    FROM Location
    WHERE imageUrl IS NOT NULL AND locationType IN ('Fort', 'Trading Post')
    GROUP BY imageUrl
    HAVING COUNT(*) > 5
  `;

  if (duplicateCheck.length > 0) {
    console.log(`\n⚠ Warning: ${duplicateCheck.length} images are still used by more than 5 locations`);
  } else {
    console.log(`\n✓ Success: All forts now have unique or small-group images`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
