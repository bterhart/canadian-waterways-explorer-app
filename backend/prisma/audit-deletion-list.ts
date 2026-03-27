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

  const R2 = 'pub-376806a1556549999cfff53a786882dd.r2.dev';
  const FAB = [
    'FAH_Voyageurs','Voyageurs_at_Dawn','Shooting_the_Rapids','Canoe_Manned_by_Voyageurs',
    'Fur_Traders_Descending','BattleofSevenOaks','Death_of_General_Wolfe',
    'Siege_of_Louisbourg','Samuel_de_Champlain_portrait',
    'AlexanderMackenzie','David_Thompson_%28explorer%29',
    'Simon_Fraser_%28explorer%29','George_Vancouver_portrait',
    'Captainjamescookportrait','Amundsen_in_fur_skins',
    'Sir_Martin_Frobisher','Samuel_Hearne.jpg','La_V%C3%A9rendrye',
    'Henry_Kelsey_sees','Henry_Kelsey.jpg',
    'Franklin%27s_lost_expedition','HMS_Erebus_and_Terror',
    'Plains_of_Abraham',
  ];

  function isR2(url: string) { return url?.includes(R2); }
  function isFab(url: string) { if (!url) return false; return FAB.some(p => url.includes(p)); }
  function isSpecific(url: string) { return url && !isR2(url) && !isFab(url); }

  const allEntities = [
    ...locations.map(l => ({...l, type:'LOC'})),
    ...waterways.map(w => ({...w, type:'WAY'}))
  ];

  console.log('=======================================================');
  console.log('SECTION A: HERO imageUrl DELETIONS (set to NULL)');
  console.log('=======================================================');
  let heroDelCount = 0;
  for (const e of allEntities) {
    const url = e.imageUrl || '';
    if (isR2(url) || isFab(url)) {
      heroDelCount++;
      const reason = isR2(url) ? 'R2_CDN' : 'FABRICATED';
      console.log(`[${e.type}] ${e.name}`);
      console.log(`   HERO (${reason}): ${url}`);
    }
  }
  console.log(`\nTotal hero entries to delete: ${heroDelCount}`);

  console.log('\n=======================================================');
  console.log('SECTION B: GALLERY SLOT DELETIONS (individual slots)');
  console.log('=======================================================');
  let galleryDelCount = 0;
  for (const e of allEntities) {
    let gallery: any[] = [];
    try { gallery = JSON.parse(e.galleryImages as string || '[]'); } catch {}
    const slotsToDelete = gallery
      .map((g: any, i: number) => ({i, url: g.url, reason: isR2(g.url) ? 'R2_CDN' : isFab(g.url) ? 'FABRICATED' : 'KEEP'}))
      .filter(s => s.reason !== 'KEEP');
    if (slotsToDelete.length > 0) {
      console.log(`[${e.type}] ${e.name}`);
      for (const s of slotsToDelete) {
        galleryDelCount++;
        console.log(`   gallery[${s.i}] (${s.reason}): ${s.url}`);
      }
    }
  }
  console.log(`\nTotal gallery slots to delete: ${galleryDelCount}`);

  console.log('\n=======================================================');
  console.log('SECTION C: RETAINED — location-specific Wikimedia URLs');
  console.log('=======================================================');
  let heroRetain = 0, galleryRetain = 0;
  for (const e of allEntities) {
    const heroUrl = e.imageUrl || '';
    const isHeroSpec = isSpecific(heroUrl);
    let gallery: any[] = [];
    try { gallery = JSON.parse(e.galleryImages as string || '[]'); } catch {}
    const specGallery = gallery.filter((g: any) => isSpecific(g.url));

    if (isHeroSpec || specGallery.length > 0) {
      console.log(`[${e.type}] ${e.name}`);
      if (isHeroSpec) {
        heroRetain++;
        console.log(`   HERO (SPECIFIC): ${heroUrl}`);
      }
      for (const g of specGallery) {
        galleryRetain++;
        console.log(`   gallery (SPECIFIC): ${g.url}`);
      }
    }
  }
  console.log(`\nRetained hero entries: ${heroRetain}`);
  console.log(`Retained gallery entries: ${galleryRetain}`);
  console.log(`Total retained: ${heroRetain + galleryRetain}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
