import { db } from './src/db';

async function main() {
  const location = await db.location.findFirst({
    where: { name: 'Fort William' },
    select: { 
      id: true, 
      name: true, 
      description: true, 
      historicalNotes: true,
      locationType: true,
      videoUrl: true
    }
  });
  
  console.log('=== FORT WILLIAM DETAILS ===');
  console.log(JSON.stringify(location, null, 2));
}

main().catch(console.error);
