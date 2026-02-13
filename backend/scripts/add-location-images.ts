/**
 * Script to add Wikimedia Commons images to all locations without images
 *
 * Run with: bun run scripts/add-location-images.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping of location names (or partial names) to Wikimedia Commons image URLs
const locationImageMap: Record<string, string> = {
  // User-provided verified images
  "Fort Albany": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Fort_Albany_First_Nation.jpg/1280px-Fort_Albany_First_Nation.jpg",
  "Fort Churchill": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fort_Prince_of_Wales_1.jpg/1280px-Fort_Prince_of_Wales_1.jpg",
  "Cumberland House": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Cumberland_House_-_Old_Stone_Powder_Magazine.jpg/1280px-Cumberland_House_-_Old_Stone_Powder_Magazine.jpg",
  "Fort Chipewyan": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Fort_Chipewyan_Alberta.jpg/1280px-Fort_Chipewyan_Alberta.jpg",
  "Fort Edmonton": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fort_Edmonton_Park_-_panoramio.jpg/1280px-Fort_Edmonton_Park_-_panoramio.jpg",
  "Norway House": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Norway_House_Indian_Residential_School.jpg/1280px-Norway_House_Indian_Residential_School.jpg",
  "Grand Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
  "Fort Langley": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Fort_Langley_NHS_%282%29.JPG/1280px-Fort_Langley_NHS_%282%29.JPG",
  "Fort Vancouver": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fort_Vancouver_National_Historic_Site.jpg/1280px-Fort_Vancouver_National_Historic_Site.jpg",
  "Sault Ste. Marie": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sault_Ste._Marie_Canal_National_Historic_Site.jpg/1280px-Sault_Ste._Marie_Canal_National_Historic_Site.jpg",
  "L'Anse aux Meadows": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/L%27Anse_aux_Meadows%2C_recreated_long_house.jpg/1280px-L%27Anse_aux_Meadows%2C_recreated_long_house.jpg",
  "Bloody Falls": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bloody_Falls_on_Coppermine_River.jpg/1280px-Bloody_Falls_on_Coppermine_River.jpg",

  // Additional Fort images
  "Fort Alexandria": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fort_Alexandria_plaque.jpg/800px-Fort_Alexandria_plaque.jpg",
  "Fort Astoria": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Fort_Astoria_1813.jpg/800px-Fort_Astoria_1813.jpg",
  "Fort Augustus": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Fort_Augustus_1875.jpg/800px-Fort_Augustus_1875.jpg",
  "Fort Battleford": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg",
  "Fort Carlton": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Fort_Carlton_Provincial_Historic_Park.jpg/1280px-Fort_Carlton_Provincial_Historic_Park.jpg",
  "Fort Colville": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Fort_Colville_1860.jpg/800px-Fort_Colville_1860.jpg",
  "Fort Dunvegan": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Fort_Dunvegan_Rectory.jpg/1280px-Fort_Dunvegan_Rectory.jpg",
  "Fort Ellice": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fort_Ellice_1858.jpg/800px-Fort_Ellice_1858.jpg",
  "Fort George": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Fort_George_%28Fort_Astoria%29.jpg/800px-Fort_George_%28Fort_Astoria%29.jpg",
  "Fort Gibraltar": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Fort_Gibraltar_Festival_du_Voyageur.jpg/1280px-Fort_Gibraltar_Festival_du_Voyageur.jpg",
  "Fort Good Hope": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Fort_Good_Hope_Church.jpg/800px-Fort_Good_Hope_Church.jpg",
  "Fort Kaministiquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
  "Fort Kamloops": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Fort_Kamloops_1864.jpg/800px-Fort_Kamloops_1864.jpg",
  "Fort Lac La Pluie": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Fort_Frances_Ontario_aerial.jpg/1280px-Fort_Frances_Ontario_aerial.jpg",
  "Fort Frances": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Fort_Frances_Ontario_aerial.jpg/1280px-Fort_Frances_Ontario_aerial.jpg",
  "Fort Liard": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Fort_Liard_Northwest_Territories.jpg/800px-Fort_Liard_Northwest_Territories.jpg",
  "Fort McLeod": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Fort_Macleod_Alberta.jpg/1280px-Fort_Macleod_Alberta.jpg",
  "Fort McLoughlin": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Bella_Bella_BC.jpg/1280px-Bella_Bella_BC.jpg",
  "Fort McPherson": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Fort_McPherson_2012.jpg/1280px-Fort_McPherson_2012.jpg",
  "Fort Nez Percés": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Fort_Walla_Walla_1855.jpg/800px-Fort_Walla_Walla_1855.jpg",
  "Fort Walla Walla": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Fort_Walla_Walla_1855.jpg/800px-Fort_Walla_Walla_1855.jpg",
  "Fort Norman": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tulita_Northwest_Territories.jpg/800px-Tulita_Northwest_Territories.jpg",
  "Fort Pelly": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fort_Pelly_Saskatchewan.jpg/800px-Fort_Pelly_Saskatchewan.jpg",
  "Fort Pembina": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Pembina_North_Dakota.jpg/1280px-Pembina_North_Dakota.jpg",
  "Fort Pitt": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Fort_Pitt_Saskatchewan.jpg/1280px-Fort_Pitt_Saskatchewan.jpg",
  "Fort Providence": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Fort_Providence_Northwest_Territories.jpg/800px-Fort_Providence_Northwest_Territories.jpg",
  "Fort Qu'Appelle": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Fort_Qu%27Appelle_Saskatchewan.jpg/1280px-Fort_Qu%27Appelle_Saskatchewan.jpg",
  "Fort Rae": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Behchoko_Northwest_Territories.jpg/800px-Behchoko_Northwest_Territories.jpg",
  "Fort Reliance": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Fort_Reliance_Yukon.jpg/800px-Fort_Reliance_Yukon.jpg",
  "Fort Resolution": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Fort_Resolution_Northwest_Territories.jpg/1280px-Fort_Resolution_Northwest_Territories.jpg",
  "Fort Rupert": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Fort_Rupert_British_Columbia.jpg/800px-Fort_Rupert_British_Columbia.jpg",
  "Fort San Miguel": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "Fort Severn": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Fort_Severn_Ontario.jpg/800px-Fort_Severn_Ontario.jpg",
  "Fort Simpson": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Fort_Simpson_NWT.jpg/1280px-Fort_Simpson_NWT.jpg",
  "Fort St. Charles": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fort_St._Charles_Minnesota.jpg/800px-Fort_St._Charles_Minnesota.jpg",
  "Fort St. James": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Fort_St_James_NHS.jpg/1280px-Fort_St_James_NHS.jpg",
  "Fort Témiscamingue": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Fort_Temiscamingue.jpg/800px-Fort_Temiscamingue.jpg",
  "Fort Vermilion": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fort_Vermilion_Alberta.jpg/800px-Fort_Vermilion_Alberta.jpg",
  "Fort Victoria": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Fort_Victoria_1859.jpg/1280px-Fort_Victoria_1859.jpg",
  "Fort Yukon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fort_Yukon_Alaska.jpg/1280px-Fort_Yukon_Alaska.jpg",
  "Bas-de-la-Rivière": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fort_Alexander_Manitoba.jpg/800px-Fort_Alexander_Manitoba.jpg",
  "Fort Alexander": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fort_Alexander_Manitoba.jpg/800px-Fort_Alexander_Manitoba.jpg",
  "Rupert House": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Waskaganish_Quebec.jpg/800px-Waskaganish_Quebec.jpg",

  // Trading Posts
  "Tadoussac": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tadoussac_Quebec.jpg/1280px-Tadoussac_Quebec.jpg",
  "Oxford House": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Oxford_House_Manitoba.jpg/800px-Oxford_House_Manitoba.jpg",
  "Kootenay House": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/David_Thompson_Invermere.jpg/800px-David_Thompson_Invermere.jpg",
  "Spokane House": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Spokane_House_State_Park.jpg/1280px-Spokane_House_State_Park.jpg",
  "Sault Ste. Marie Post": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sault_Ste._Marie_Canal_National_Historic_Site.jpg/1280px-Sault_Ste._Marie_Canal_National_Historic_Site.jpg",

  // Settlements
  "Batoche": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Batoche_church.JPG/1280px-Batoche_church.JPG",
  "Montreal": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Place-Jacques-Cartier.jpg/1280px-Place-Jacques-Cartier.jpg",
  "Quebec City": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Chateau_Frontenac_02.jpg/1280px-Chateau_Frontenac_02.jpg",
  "Port-Royal": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Port_Royal_Habitation.jpg/1280px-Port_Royal_Habitation.jpg",
  "Red Bay": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Red_Bay_Labrador.jpg/1280px-Red_Bay_Labrador.jpg",

  // Cultural Sites
  "Bligh Island": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "Nootka Sound": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "Cape Bonavista": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cape_Bonavista_Lighthouse.jpg/1280px-Cape_Bonavista_Lighthouse.jpg",
  "Cartier's Cross": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jacques_Cartier_Gaspe.jpg/800px-Jacques_Cartier_Gaspe.jpg",
  "Gaspé": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jacques_Cartier_Gaspe.jpg/800px-Jacques_Cartier_Gaspe.jpg",
  "Columbia River Mouth": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Columbia_River_mouth.jpg/1280px-Columbia_River_mouth.jpg",
  "Chinook Point": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Columbia_River_mouth.jpg/1280px-Columbia_River_mouth.jpg",
  "Desolation Sound": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Desolation_Sound_British_Columbia.jpg/1280px-Desolation_Sound_British_Columbia.jpg",
  "Friendly Cove": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nootka_Sound.jpg/1280px-Nootka_Sound.jpg",
  "La Pérouse Memorial": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lituya_Bay_Alaska.jpg/1280px-Lituya_Bay_Alaska.jpg",
  "Lituya Bay": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lituya_Bay_Alaska.jpg/1280px-Lituya_Bay_Alaska.jpg",
  "Point Grey": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Point_Grey_Vancouver.jpg/1280px-Point_Grey_Vancouver.jpg",
  "Spanish Banks": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Spanish_Banks_Beach_Vancouver.jpg/1280px-Spanish_Banks_Beach_Vancouver.jpg",
  "Massacre Island": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Lake_of_the_Woods.jpg/1280px-Lake_of_the_Woods.jpg",

  // Portages - using appropriate wilderness/water images
  "Chaudière Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Chaudiere_Falls_Ottawa.jpg/1280px-Chaudiere_Falls_Ottawa.jpg",
  "Echimamish Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Echimamish_River.jpg/800px-Echimamish_River.jpg",
  "French Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Boundary_Waters_Canoe_Area.jpg/1280px-Boundary_Waters_Canoe_Area.jpg",
  "Frog Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Churchill_River_Saskatchewan.jpg/1280px-Churchill_River_Saskatchewan.jpg",
  "Grande Décharge": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Saguenay_River_Quebec.jpg/1280px-Saguenay_River_Quebec.jpg",
  "Great Dog Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
  "Hauteur des Terres": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Height_of_Land_Portage.jpg/800px-Height_of_Land_Portage.jpg",
  "La Vase Portages": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/La_Vase_Portages_North_Bay.jpg/800px-La_Vase_Portages_North_Bay.jpg",
  "Long Sault Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Long_Sault_Rapids.jpg/1280px-Long_Sault_Rapids.jpg",
  "Methye Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Methye_Portage.jpg/1280px-Methye_Portage.jpg",
  "Rat Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Lake_of_the_Woods.jpg/1280px-Lake_of_the_Woods.jpg",
  "Slave Falls Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Winnipeg_River.jpg/1280px-Winnipeg_River.jpg",
  "The Pas Portage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/The_Pas_Manitoba.jpg/1280px-The_Pas_Manitoba.jpg",
};

// Function to find the best matching image URL for a location name
function findImageUrl(locationName: string): string | null {
  // First try exact match
  if (locationImageMap[locationName]) {
    return locationImageMap[locationName];
  }

  // Try partial match - check if location name contains any key
  for (const [key, url] of Object.entries(locationImageMap)) {
    if (locationName.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }

  // Try partial match - check if any key contains location name
  for (const [key, url] of Object.entries(locationImageMap)) {
    if (key.toLowerCase().includes(locationName.toLowerCase())) {
      return url;
    }
  }

  return null;
}

async function main() {
  console.log("=".repeat(60));
  console.log("Add Location Images Script");
  console.log("=".repeat(60));
  console.log("");

  // Find all locations without images
  const locationsWithoutImages = await prisma.location.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" },
      ],
    },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${locationsWithoutImages.length} locations without images.\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  const skippedLocations: string[] = [];

  for (const location of locationsWithoutImages) {
    const imageUrl = findImageUrl(location.name);

    if (imageUrl) {
      console.log(`Updating: ${location.name}`);
      console.log(`  Type: ${location.locationType}`);
      console.log(`  Image: ${imageUrl.substring(0, 80)}...`);

      await prisma.location.update({
        where: { id: location.id },
        data: { imageUrl },
      });

      updatedCount++;
      console.log(`  -> Updated successfully\n`);
    } else {
      console.log(`Skipped: ${location.name} (${location.locationType}) - No matching image found`);
      skippedCount++;
      skippedLocations.push(`${location.name} (${location.locationType})`);
    }
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log(`Total locations processed: ${locationsWithoutImages.length}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Skipped (no matching image): ${skippedCount}`);

  if (skippedLocations.length > 0) {
    console.log("\nLocations that still need images:");
    for (const loc of skippedLocations) {
      console.log(`  - ${loc}`);
    }
  }

  // Verify final state
  const remainingWithoutImages = await prisma.location.count({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" },
      ],
    },
  });

  const totalWithImages = await prisma.location.count({
    where: {
      imageUrl: { not: null },
      NOT: { imageUrl: "" },
    },
  });

  console.log(`\nFinal state:`);
  console.log(`  Locations with images: ${totalWithImages}`);
  console.log(`  Locations without images: ${remainingWithoutImages}`);
  console.log("");
  console.log("=".repeat(60));
  console.log("Script completed!");
  console.log("=".repeat(60));
}

main()
  .catch((error) => {
    console.error("Error running script:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
