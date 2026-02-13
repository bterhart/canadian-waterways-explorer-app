import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Wikimedia Commons public domain images for key historical locations
const locationImages: Record<string, string> = {
  // York Factory - Major HBC trading post on Hudson Bay
  "York Factory":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",

  // Fort William - Key NWC depot at the head of Lake Superior
  "Fort William":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
  "Fort William (NWC)":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",

  // Prince of Wales Fort - HBC stone fortress on Hudson Bay
  "Prince of Wales Fort":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",

  // Fort Garry - Major HBC post at the confluence of the Red and Assiniboine rivers
  "Fort Garry":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Fort Garry (Upper)":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Upper Fort Garry":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Lower Fort Garry":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",

  // Rocky Mountain House - Trading post near the Rocky Mountains
  "Rocky Mountain House":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rocky_Mountain_House_NHS_%282%29.JPG/1280px-Rocky_Mountain_House_NHS_%282%29.JPG",
  "Rocky Mountain House (NWC)":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rocky_Mountain_House_NHS_%282%29.JPG/1280px-Rocky_Mountain_House_NHS_%282%29.JPG",

  // Moose Factory - One of the oldest English settlements in Ontario
  "Moose Factory":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MooseFactory1.jpg/1280px-MooseFactory1.jpg",
};

async function main() {
  console.log("Seeding location images...");

  let updatedCount = 0;
  let skippedCount = 0;

  for (const [locationName, imageUrl] of Object.entries(locationImages)) {
    try {
      const result = await prisma.location.updateMany({
        where: { name: locationName },
        data: { imageUrl },
      });

      if (result.count > 0) {
        console.log(`Updated ${locationName} with image URL`);
        updatedCount += result.count;
      } else {
        console.log(`Location not found: ${locationName}`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error updating ${locationName}:`, error);
    }
  }

  console.log(`\nLocation images seeded successfully!`);
  console.log(`Updated: ${updatedCount} locations`);
  console.log(`Skipped: ${skippedCount} locations (not found)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
