// Comprehensive media audit: check every imageUrl, galleryImages, videoUrl
// for all Locations and Waterways in the Turso database.
// Output is JSON to stdout for further processing.
import { db } from "../src/db";

async function main() {
  const locations = await db.location.findMany({
    select: {
      id: true,
      name: true,
      locationType: true,
      imageUrl: true,
      galleryImages: true,
      videoUrl: true,
    },
    orderBy: { name: "asc" },
  });

  const waterways = await db.waterway.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      galleryImages: true,
      videoUrl: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(JSON.stringify({ locations, waterways }, null, 0));
}

main().catch(console.error).finally(() => db.$disconnect());
