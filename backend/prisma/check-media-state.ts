import { prisma } from "../src/prisma";

async function main() {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      galleryImages: true,
    },
    orderBy: { name: 'asc' }
  });
  
  let withGallery = 0;
  let withoutGallery = 0;
  let withHero = 0;
  let withoutHero = 0;
  let r2Count = 0;
  let wikimediaCount = 0;
  let emptyGallery = 0;
  
  for (const loc of locations) {
    if (loc.imageUrl) withHero++;
    else withoutHero++;
    
    if (loc.imageUrl?.includes('r2.dev') || loc.imageUrl?.includes('pub-') || loc.imageUrl?.includes('vibecodeapp') || loc.imageUrl?.includes('cloudflare')) r2Count++;
    else if (loc.imageUrl?.includes('wikimedia') || loc.imageUrl?.includes('upload.wikimedia')) wikimediaCount++;
    
    if (loc.galleryImages) {
      try {
        const gallery = JSON.parse(loc.galleryImages as string);
        if (Array.isArray(gallery) && gallery.length > 0) {
          withGallery++;
        } else {
          emptyGallery++;
        }
      } catch {
        emptyGallery++;
      }
    } else {
      withoutGallery++;
    }
  }
  
  console.log(`Total locations: ${locations.length}`);
  console.log(`With hero image: ${withHero}, Without: ${withoutHero}`);
  console.log(`R2/CDN URLs: ${r2Count}, Wikimedia URLs: ${wikimediaCount}`);
  console.log(`With gallery data: ${withGallery}, Empty/null gallery: ${emptyGallery + withoutGallery}`);
  
  // Show a few samples with full URL
  console.log("\nSample locations:");
  for (const loc of locations.slice(0, 8)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(loc.galleryImages as string || '[]'); } catch {}
    console.log(`  ${loc.name}:`);
    console.log(`    hero: ${loc.imageUrl}`);
    console.log(`    gallery count: ${gallery.length}`);
    if (gallery.length > 0) {
      console.log(`    first gallery: ${gallery[0]?.url}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
