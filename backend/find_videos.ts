import { db } from './src/db';

async function main() {
  // Check Location table for video URLs
  const locations = await db.location.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true, galleryImages: true }
  });
  
  console.log(`=== LOCATIONS WITH VIDEO URLs ===`);
  console.log(`Found ${locations.length} locations with videoUrl\n`);
  
  for (const loc of locations) {
    console.log(`Location: ${loc.name}`);
    console.log(`  ID: ${loc.id}`);
    console.log(`  videoUrl: ${loc.videoUrl}`);
    if (loc.galleryImages) {
      console.log(`  galleryImages: ${loc.galleryImages}`);
    }
    console.log('');
  }
  
  // Check Waterway table for video URLs
  const waterways = await db.waterway.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true, galleryImages: true }
  });
  
  console.log(`\n=== WATERWAYS WITH VIDEO URLs ===`);
  console.log(`Found ${waterways.length} waterways with videoUrl\n`);
  
  for (const ww of waterways) {
    console.log(`Waterway: ${ww.name}`);
    console.log(`  ID: ${ww.id}`);
    console.log(`  videoUrl: ${ww.videoUrl}`);
    if (ww.galleryImages) {
      console.log(`  galleryImages: ${ww.galleryImages}`);
    }
    console.log('');
  }
  
  // Also check galleryImages for embedded videos
  console.log(`\n=== CHECKING ALL GALLERY IMAGES FOR VIDEO CONTENT ===\n`);
  
  const allLocations = await db.location.findMany({
    where: {
      galleryImages: { not: null }
    },
    select: { id: true, name: true, galleryImages: true }
  });
  
  for (const loc of allLocations) {
    if (loc.galleryImages) {
      try {
        const gallery = JSON.parse(loc.galleryImages as string);
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          if (item.type === 'video' || item.videoUrl || 
              (item.url && (item.url.includes('youtube') || item.url.includes('youtu.be') || item.url.includes('vimeo')))) {
            console.log(`Location: ${loc.name} (${loc.id})`);
            console.log(`  Gallery item ${i}:`, JSON.stringify(item, null, 2));
            console.log('');
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
  
  const allWaterways = await db.waterway.findMany({
    where: {
      galleryImages: { not: null }
    },
    select: { id: true, name: true, galleryImages: true }
  });
  
  for (const ww of allWaterways) {
    if (ww.galleryImages) {
      try {
        const gallery = JSON.parse(ww.galleryImages as string);
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          if (item.type === 'video' || item.videoUrl || 
              (item.url && (item.url.includes('youtube') || item.url.includes('youtu.be') || item.url.includes('vimeo')))) {
            console.log(`Waterway: ${ww.name} (${ww.id})`);
            console.log(`  Gallery item ${i}:`, JSON.stringify(item, null, 2));
            console.log('');
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

main().catch(console.error);
