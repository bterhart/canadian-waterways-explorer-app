import { prisma } from "../src/prisma";

const R2_DOMAIN = 'pub-376806a1556549999cfff53a786882dd.r2.dev';

// Fabricated generic images — patterns from fix-all-media.ts damage
const FAB_PATTERNS = [
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
  // Additional: unencoded parens variants missed by encoded patterns above
  'David_Thompson_(explorer)',
  'Simon_Fraser_(explorer)',
  // Thunder Bay postcard appearing generically across unrelated locations
  'Thunder_Bay_ON_-_Old_Postcard',
];

function isR2(url: string | null): boolean {
  return !!url && url.includes(R2_DOMAIN);
}

function isFab(url: string | null): boolean {
  if (!url) return false;
  return FAB_PATTERNS.some(p => url.includes(p));
}

function shouldDelete(url: string | null): boolean {
  return isR2(url) || isFab(url);
}

async function main() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: 'asc' }
  });

  const allEntities = [
    ...locations.map(l => ({ ...l, type: 'Location' as const })),
    ...waterways.map(w => ({ ...w, type: 'Waterway' as const })),
  ];

  let heroNulled = 0;
  let gallerySlotsBefore = 0;
  let gallerySlotsAfter = 0;
  let gallerySlotsRemoved = 0;
  let entitiesUpdated = 0;

  for (const entity of allEntities) {
    let heroChanged = false;
    let galleryChanged = false;
    let newImageUrl = entity.imageUrl;
    let newGallery: any[] = [];

    // Hero cleanup
    if (shouldDelete(entity.imageUrl)) {
      console.log(`[HERO NULL] ${entity.type} "${entity.name}": ${entity.imageUrl}`);
      newImageUrl = null;
      heroChanged = true;
      heroNulled++;
    }

    // Gallery cleanup
    let gallery: any[] = [];
    try { gallery = JSON.parse(entity.galleryImages as string || '[]'); } catch {}

    gallerySlotsBefore += gallery.length;

    newGallery = gallery.filter((g: any) => {
      if (shouldDelete(g.url)) {
        console.log(`[GALLERY REMOVE] ${entity.type} "${entity.name}": ${g.url}`);
        gallerySlotsRemoved++;
        return false;
      }
      return true;
    });

    gallerySlotsAfter += newGallery.length;

    if (newGallery.length !== gallery.length) galleryChanged = true;

    // Write to DB if anything changed
    if (heroChanged || galleryChanged) {
      entitiesUpdated++;
      const updateData: any = {};
      if (heroChanged) updateData.imageUrl = newImageUrl;
      if (galleryChanged) updateData.galleryImages = JSON.stringify(newGallery);

      if (entity.type === 'Location') {
        await prisma.location.update({ where: { id: entity.id }, data: updateData });
      } else {
        await prisma.waterway.update({ where: { id: entity.id }, data: updateData });
      }
    }
  }

  console.log('\n========= CLEANUP SUMMARY =========');
  console.log(`Entities updated:         ${entitiesUpdated}`);
  console.log(`Hero imageUrl set NULL:   ${heroNulled}`);
  console.log(`Gallery slots before:     ${gallerySlotsBefore}`);
  console.log(`Gallery slots removed:    ${gallerySlotsRemoved}`);
  console.log(`Gallery slots after:      ${gallerySlotsAfter}`);
  console.log('====================================');
}

main().catch(console.error).finally(() => prisma.$disconnect());
