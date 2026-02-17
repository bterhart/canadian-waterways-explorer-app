import { db } from './src/db';

async function main() {
  // Get all video URLs from Location table
  const locations = await db.location.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true }
  });
  
  console.log(`=== ALL VIDEO URLs FROM LOCATIONS (${locations.length} total) ===\n`);
  
  for (const loc of locations) {
    console.log(`${loc.name}: ${loc.videoUrl}`);
  }
  
  // Get all video URLs from Waterway table
  const waterways = await db.waterway.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true }
  });
  
  console.log(`\n=== ALL VIDEO URLs FROM WATERWAYS (${waterways.length} total) ===\n`);
  
  for (const ww of waterways) {
    console.log(`${ww.name}: ${ww.videoUrl}`);
  }
}

main().catch(console.error);
