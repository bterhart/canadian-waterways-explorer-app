// Update Fort William to connect to Kaministiquia River as well as Lake Superior
import { db } from './src/db';

const FORT_WILLIAM_ID = 'cmlhbjrr2000vm2mb4xb3au6o';

async function updateFortWilliam() {
  console.log('Checking Fort William current state...');

  // Get current Fort William
  const fortWilliam = await db.location.findUnique({
    where: { id: FORT_WILLIAM_ID },
    include: { waterway: true }
  });

  if (!fortWilliam) {
    console.log('Fort William not found');
    return;
  }

  console.log('Current Fort William:', fortWilliam.name);
  console.log('Current waterway:', fortWilliam.waterway?.name);
  console.log('Current waterwayId:', fortWilliam.waterwayId);

  // Find Kaministiquia River
  const kaministiquia = await db.waterway.findFirst({
    where: { name: { contains: 'Kaministiquia' } }
  });

  console.log('\nKaministiquia River:', kaministiquia ? kaministiquia.name : 'NOT FOUND');
  console.log('Kaministiquia ID:', kaministiquia?.id);

  // Find Lake Superior
  const lakeSuperior = await db.waterway.findFirst({
    where: { name: 'Lake Superior' }
  });

  console.log('\nLake Superior:', lakeSuperior ? lakeSuperior.name : 'NOT FOUND');
  console.log('Lake Superior ID:', lakeSuperior?.id);

  // Note: The current schema only supports ONE waterway per location (waterwayId is a single field)
  // To properly connect to multiple waterways would require a schema change (many-to-many relationship)

  // For now, report the situation
  console.log('\n=== SCHEMA LIMITATION ===');
  console.log('The Location model only has a single waterwayId field.');
  console.log('To connect Fort William to BOTH Lake Superior and Kaministiquia River,');
  console.log('a schema change would be needed (many-to-many relationship).');
  console.log('\nCurrent connection: Fort William -> Lake Superior (correct primary waterway)');
}

updateFortWilliam()
  .catch(console.error)
  .finally(() => db.$disconnect());
