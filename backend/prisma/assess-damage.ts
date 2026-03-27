import { prisma } from "../src/prisma";

async function main() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  const R2_PREFIX = 'pub-376806a1556549999cfff53a786882dd.r2.dev';
  
  // For each entity, check if we can reconstruct from R2 gallery entries
  let canReconstruct = 0;
  let cannotReconstruct = 0;
  const noR2Gallery: string[] = [];

  for (const entity of [...locations, ...waterways]) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(entity.galleryImages as string || '[]'); } catch {}
    
    const r2GalleryEntries = gallery.filter((g: any) => g.url?.includes(R2_PREFIX));
    
    if (r2GalleryEntries.length > 0) {
      canReconstruct++;
    } else {
      cannotReconstruct++;
      noR2Gallery.push(entity.name);
    }
  }

  console.log(`Can reconstruct from R2 gallery entries: ${canReconstruct}`);
  console.log(`Cannot reconstruct (no R2 gallery entries): ${cannotReconstruct}`);
  if (noR2Gallery.length > 0) {
    console.log("Entities with no R2 gallery entries:");
    noR2Gallery.forEach(n => console.log(`  - ${n}`));
  }

  // Also check: how many entities have ALL 3 gallery entries as R2?
  let allR2Gallery = 0;
  let partialR2Gallery = 0;
  let needsHeroFix = 0;
  let needsGalleryFix = 0;

  for (const entity of [...locations, ...waterways]) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(entity.galleryImages as string || '[]'); } catch {}
    
    const r2GalleryEntries = gallery.filter((g: any) => g.url?.includes(R2_PREFIX));
    const isHeroBroken = entity.imageUrl?.includes('wikimedia') || entity.imageUrl?.includes('commons.wikimedia');
    
    if (r2GalleryEntries.length >= 3) allR2Gallery++;
    else if (r2GalleryEntries.length > 0) partialR2Gallery++;
    
    if (isHeroBroken) needsHeroFix++;
    if (r2GalleryEntries.length < 3) needsGalleryFix++;
  }

  console.log(`\nWith all 3 R2 gallery entries intact: ${allR2Gallery}`);
  console.log(`With partial R2 gallery entries: ${partialR2Gallery}`);
  console.log(`Need hero fix: ${needsHeroFix}`);
  console.log(`Need gallery fix (< 3 R2 entries): ${needsGalleryFix}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
