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

  const FABRICATED_PATTERNS = [
    'FAH_Voyageurs', 'Voyageurs_at_Dawn', 'Shooting_the_Rapids', 'Canoe_Manned_by_Voyageurs',
    'Fur_Traders_Descending', 'BattleofSevenOaks', 'Death_of_General_Wolfe',
    'Siege_of_Louisbourg', 'Samuel_de_Champlain_portrait',
    'AlexanderMackenzie', 'David_Thompson_%28explorer%29',
    'Simon_Fraser_%28explorer%29', 'George_Vancouver_portrait',
    'Captainjamescookportrait', 'Amundsen_in_fur_skins',
    'Sir_Martin_Frobisher', 'Samuel_Hearne.jpg', 'La_V%C3%A9rendrye',
    'Henry_Kelsey_sees', 'Henry_Kelsey.jpg',
    'Franklin%27s_lost_expedition', 'HMS_Erebus_and_Terror',
    'Shooting_the_Rapids', 'Plains_of_Abraham',
  ];
  const R2 = 'pub-376806a1556549999cfff53a786882dd.r2.dev';

  function classify(url: string): 'R2' | 'FABRICATED' | 'SPECIFIC' | 'NULL' {
    if (!url) return 'NULL';
    if (url.includes(R2)) return 'R2';
    for (const p of FABRICATED_PATTERNS) if (url.includes(p)) return 'FABRICATED';
    return 'SPECIFIC';
  }

  const allEntities = [
    ...locations.map(l => ({...l, type: 'LOC'})),
    ...waterways.map(w => ({...w, type: 'WAY'}))
  ];

  let heroR2 = 0, heroFab = 0, heroSpec = 0;
  let galleryR2 = 0, galleryFab = 0, gallerySpec = 0;
  
  const heroFabList: string[] = [];
  const heroSpecList: string[] = [];
  const heroR2List: string[] = [];
  const entitiesWithFabGallery: {name: string, fabSlots: string[]}[] = [];

  for (const e of allEntities) {
    const hc = classify(e.imageUrl || '');
    if (hc === 'R2') { heroR2++; heroR2List.push(`[${e.type}] ${e.name}: ${e.imageUrl}`); }
    else if (hc === 'FABRICATED') { heroFab++; heroFabList.push(`[${e.type}] ${e.name}: ${e.imageUrl}`); }
    else if (hc === 'SPECIFIC') { heroSpec++; heroSpecList.push(`[${e.type}] ${e.name}: ${e.imageUrl}`); }

    let gallery: any[] = [];
    try { gallery = JSON.parse(e.galleryImages as string || '[]'); } catch {}
    const fabSlots: string[] = [];
    for (let i = 0; i < gallery.length; i++) {
      const gc = classify(gallery[i]?.url || '');
      if (gc === 'R2') galleryR2++;
      else if (gc === 'FABRICATED') { galleryFab++; fabSlots.push(`[${i}]:${gallery[i].url}`); }
      else if (gc === 'SPECIFIC') gallerySpec++;
    }
    if (fabSlots.length > 0) entitiesWithFabGallery.push({name: `[${e.type}] ${e.name}`, fabSlots});
  }

  console.log('=== HERO IMAGE SUMMARY ===');
  console.log(`R2 CDN:    ${heroR2}`);
  console.log(`FABRICATED: ${heroFab}`);
  console.log(`SPECIFIC Wikimedia: ${heroSpec}`);
  
  console.log('\n=== GALLERY IMAGE SUMMARY (across all slots) ===');
  console.log(`R2 CDN:    ${galleryR2}`);
  console.log(`FABRICATED: ${galleryFab}`);
  console.log(`SPECIFIC Wikimedia: ${gallerySpec}`);

  if (heroR2List.length > 0) {
    console.log('\n--- ENTITIES WITH R2 HERO ---');
    heroR2List.forEach(l => console.log(' ' + l));
  }

  if (heroFabList.length > 0) {
    console.log('\n--- ENTITIES WITH FABRICATED HERO ---');
    heroFabList.forEach(l => console.log(' ' + l));
  }

  console.log('\n--- ENTITIES WITH FABRICATED GALLERY ENTRIES ---');
  for (const e of entitiesWithFabGallery) {
    console.log(` ${e.name}`);
    e.fabSlots.forEach(s => console.log(`   ${s}`));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
