// Migration script to move Marble Island from Waterway to Location
// Marble Island is a historic site in Hudson Bay, not a waterway

import { db } from './src/db';

const MARBLE_ISLAND_WATERWAY_ID = 'cml_marble_island';
const HUDSON_BAY_WATERWAY_ID = 'cmlhaslrt001cm2zh9tknhhbe';

async function migrateMarbleIsland() {
  console.log('Starting Marble Island migration...');

  // 1. Get current Marble Island waterway record
  const marbleWaterway = await db.waterway.findUnique({
    where: { id: MARBLE_ISLAND_WATERWAY_ID }
  });

  if (!marbleWaterway) {
    console.log('Marble Island not found in Waterway table');
    return;
  }

  console.log('Found Marble Island in Waterway table:', marbleWaterway);

  // 2. Check if Location already exists with same ID
  const existingLocation = await db.location.findUnique({
    where: { id: MARBLE_ISLAND_WATERWAY_ID }
  });

  if (existingLocation) {
    console.log('Marble Island already exists in Location table');
    return;
  }

  // 3. Create new Location record with SAME ID to preserve study guide data mapping
  const newLocation = await db.location.create({
    data: {
      id: MARBLE_ISLAND_WATERWAY_ID, // CRITICAL: Keep same ID for study guide data
      name: 'Marble Island',
      indigenousName: marbleWaterway.indigenousName,
      indigenousLanguage: marbleWaterway.indigenousLanguage,
      description: marbleWaterway.description || 'Marble Island is an island in Hudson Bay known for its historical significance as a whaling station and the site of the tragic 1719 Knight expedition where all crew members perished.',
      latitude: marbleWaterway.latitude,
      longitude: marbleWaterway.longitude,
      locationType: 'historic_site',
      historicalNotes: marbleWaterway.historicalSignificance,
      imageUrl: marbleWaterway.imageUrl,
      galleryImages: marbleWaterway.galleryImages,
      videoUrl: marbleWaterway.videoUrl,
      waterwayId: HUDSON_BAY_WATERWAY_ID, // Connect to Hudson Bay
    }
  });

  console.log('Created Location record:', newLocation);

  // 4. Delete old Waterway record
  await db.waterway.delete({
    where: { id: MARBLE_ISLAND_WATERWAY_ID }
  });

  console.log('Deleted Waterway record');
  console.log('Migration complete!');
}

migrateMarbleIsland()
  .catch(console.error)
  .finally(() => db.$disconnect());
