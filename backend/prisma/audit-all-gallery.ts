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

  // Known fabricated generic URLs from fix-all-media.ts
  const FABRICATED = [
    'FAH_Voyageurs', 'Voyageurs_at_Dawn', 'Shooting_the_Rapids', 'Canoe_Manned_by_Voyageurs',
    'Fur_Traders_Descending', 'BattleofSevenOaks', 'Death_of_General_Wolfe',
    'Siege_of_Louisbourg', 'Samuel_de_Champlain_portrait',
    'AlexanderMackenzie', 'David_Thompson_%28explorer%29',
    'Simon_Fraser_%28explorer%29', 'George_Vancouver_portrait',
    'Captainjamescookportrait', 'Amundsen_in_fur_skins',
    'Sir_Martin_Frobisher', 'Samuel_Hearne', 'La_V%C3%A9rendrye',
    'Henry_Kelsey_sees_the_buffalo',
    // R2 CDN prefix
    'pub-376806a1556549999cfff53a786882dd.r2.dev',
  ];

  function classifyUrl(url: string): string {
    if (!url) return 'NULL';
    if (url.includes('pub-376806a1556549999cfff53a786882dd.r2.dev')) return 'R2_CDN';
    for (const f of FABRICATED) {
      if (url.includes(f)) return 'FABRICATED';
    }
    return 'WIKIMEDIA_SPECIFIC';
  }

  console.log('=== LOCATIONS (' + locations.length + ' total) ===\n');
  for (const loc of locations) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(loc.galleryImages as string || '[]'); } catch {}
    const heroClass = classifyUrl(loc.imageUrl || '');
    const galleryClasses = gallery.map((g: any, i: number) => `[${i}]:${classifyUrl(g.url)}`);
    console.log(`${loc.name}`);
    console.log(`  hero (${heroClass}): ${loc.imageUrl}`);
    for (let i = 0; i < gallery.length; i++) {
      const g = gallery[i];
      console.log(`  gallery[${i}] (${classifyUrl(g.url)}): ${g.url}`);
    }
    console.log('');
  }

  console.log('\n=== WATERWAYS (' + waterways.length + ' total) ===\n');
  for (const way of waterways) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(way.galleryImages as string || '[]'); } catch {}
    const heroClass = classifyUrl(way.imageUrl || '');
    console.log(`${way.name}`);
    console.log(`  hero (${heroClass}): ${way.imageUrl}`);
    for (let i = 0; i < gallery.length; i++) {
      const g = gallery[i];
      console.log(`  gallery[${i}] (${classifyUrl(g.url)}): ${g.url}`);
    }
    console.log('');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
