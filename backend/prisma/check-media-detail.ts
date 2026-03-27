import { prisma } from "../src/prisma";

async function main() {
  // Get a waterway with R2 hero (correct state)
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  console.log("=== WATERWAYS WITH R2 HERO (CORRECT STATE) ===");
  const r2Waterways = waterways.filter(w => w.imageUrl?.includes('r2.dev') || w.imageUrl?.includes('pub-'));
  for (const w of r2Waterways.slice(0, 3)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(w.galleryImages as string || '[]'); } catch {}
    console.log(`\n${w.name}:`);
    console.log(`  hero: ${w.imageUrl}`);
    console.log(`  gallery (${gallery.length} entries):`);
    for (const g of gallery) {
      console.log(`    - ${g.url}`);
    }
  }

  console.log("\n=== WATERWAYS WITH WIKIMEDIA HERO (BROKEN STATE) ===");
  const wikiWaterways = waterways.filter(w => w.imageUrl?.includes('wikimedia'));
  for (const w of wikiWaterways.slice(0, 3)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(w.galleryImages as string || '[]'); } catch {}
    console.log(`\n${w.name}:`);
    console.log(`  hero: ${w.imageUrl}`);
    console.log(`  gallery (${gallery.length} entries):`);
    for (const g of gallery) {
      console.log(`    - ${g.url}`);
    }
  }

  // Check locations
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  console.log("\n=== LOCATIONS WITH R2 HERO (CORRECT STATE) ===");
  const r2Locations = locations.filter(l => l.imageUrl?.includes('r2.dev') || l.imageUrl?.includes('pub-'));
  for (const l of r2Locations.slice(0, 3)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(l.galleryImages as string || '[]'); } catch {}
    console.log(`\n${l.name}:`);
    console.log(`  hero: ${l.imageUrl}`);
    console.log(`  gallery (${gallery.length} entries):`);
    for (const g of gallery) {
      console.log(`    - ${g.url}`);
    }
  }

  console.log("\n=== LOCATIONS WITH WIKIMEDIA HERO (BROKEN STATE) ===");
  const wikiLocations = locations.filter(l => l.imageUrl?.includes('wikimedia'));
  for (const l of wikiLocations.slice(0, 3)) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(l.galleryImages as string || '[]'); } catch {}
    console.log(`\n${l.name}:`);
    console.log(`  hero: ${l.imageUrl}`);
    console.log(`  gallery (${gallery.length} entries):`);
    for (const g of gallery) {
      console.log(`    - ${g.url}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
