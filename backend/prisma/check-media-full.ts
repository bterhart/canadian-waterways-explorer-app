import { prisma } from "../src/prisma";

async function main() {
  // Check waterways too
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });
  
  console.log(`Total waterways: ${waterways.length}`);
  
  let waterwaysWithR2 = 0, waterwaysWithWiki = 0, waterwaysWithGallery = 0;
  for (const w of waterways) {
    if (w.imageUrl?.includes('r2.dev') || w.imageUrl?.includes('pub-')) waterwaysWithR2++;
    else if (w.imageUrl?.includes('wikimedia')) waterwaysWithWiki++;
    
    try {
      const g = JSON.parse(w.galleryImages as string || '[]');
      if (Array.isArray(g) && g.length > 0) waterwaysWithGallery++;
    } catch {}
  }
  
  console.log(`Waterways - R2 hero: ${waterwaysWithR2}, Wiki hero: ${waterwaysWithWiki}, With gallery: ${waterwaysWithGallery}`);
  
  // Sample waterways
  console.log("\nSample waterways:");
  for (const w of waterways.slice(0, 3)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(w.galleryImages as string || '[]'); } catch {}
    console.log(`  ${w.name}: hero=${w.imageUrl}, gallery_count=${gallery.length}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
