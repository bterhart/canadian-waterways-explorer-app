import { prisma } from "../src/prisma";

async function main() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
  });
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
  });

  const allUrls: { entity: string; field: string; url: string; type: string }[] = [];

  for (const e of [...locations, ...waterways]) {
    const label = e.name;
    if (e.imageUrl) {
      const url = e.imageUrl;
      const type = url.includes('Special:FilePath') ? 'SPECIAL_FILEPATH'
        : url.includes('/thumb/') ? 'THUMB'
        : url.includes('upload.wikimedia.org') ? 'UPLOAD_DIRECT'
        : url.includes('commons.wikimedia.org') ? 'COMMONS_OTHER'
        : 'OTHER';
      allUrls.push({ entity: label, field: 'hero', url, type });
    }
    let gallery: any[] = [];
    try { gallery = JSON.parse(e.galleryImages as string || '[]'); } catch {}
    for (const g of gallery) {
      if (g.url) {
        const url = g.url;
        const type = url.includes('Special:FilePath') ? 'SPECIAL_FILEPATH'
          : url.includes('/thumb/') ? 'THUMB'
          : url.includes('upload.wikimedia.org') ? 'UPLOAD_DIRECT'
          : url.includes('commons.wikimedia.org') ? 'COMMONS_OTHER'
          : 'OTHER';
        allUrls.push({ entity: label, field: 'gallery', url, type });
      }
    }
  }

  // Count by type
  const counts: Record<string, number> = {};
  for (const u of allUrls) {
    counts[u.type] = (counts[u.type] || 0) + 1;
  }

  console.log('=== URL TYPE BREAKDOWN ===');
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log(`  TOTAL: ${allUrls.length}`);

  // Print one sample of each type
  console.log('\n=== SAMPLE URLs BY TYPE ===');
  const seen = new Set<string>();
  for (const u of allUrls) {
    if (!seen.has(u.type)) {
      seen.add(u.type);
      console.log(`\n[${u.type}]`);
      console.log(`  Entity: ${u.entity} (${u.field})`);
      console.log(`  URL: ${u.url}`);
    }
  }

  // Print all THUMB URLs (these were the original problem)
  const thumbUrls = allUrls.filter(u => u.type === 'THUMB');
  if (thumbUrls.length > 0) {
    console.log('\n=== ALL THUMB URLs (original problem format) ===');
    for (const u of thumbUrls) {
      console.log(`  [${u.entity}] ${u.url}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
