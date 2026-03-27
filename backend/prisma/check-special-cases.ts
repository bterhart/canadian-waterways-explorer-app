import { prisma } from "../src/prisma";

async function main() {
  const specialNames = ['Port-Royal (Habitation)', 'Quebec City', 'Saint John River', 'Strait of Belle Isle'];
  
  for (const name of specialNames) {
    const loc = await prisma.location.findFirst({ where: { name }, select: { id: true, name: true, imageUrl: true, galleryImages: true }});
    const way = await prisma.waterway.findFirst({ where: { name }, select: { id: true, name: true, imageUrl: true, galleryImages: true }});
    const entity = loc || way;
    if (!entity) { console.log(`NOT FOUND: ${name}`); continue; }
    
    let gallery: any[] = [];
    try { gallery = JSON.parse(entity.galleryImages as string || '[]'); } catch {}
    
    console.log(`\n${entity.name} (${loc ? 'location' : 'waterway'}):`);
    console.log(`  id: ${entity.id}`);
    console.log(`  hero: ${entity.imageUrl}`);
    console.log(`  gallery (${gallery.length}):`);
    gallery.forEach((g: any, i: number) => console.log(`    [${i}]: ${g.url}`));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
