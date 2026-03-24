// Audit and fix all broken imageUrl + galleryImages URLs against the real Turso DB.
// Run: cd /home/user/workspace/backend && bun run prisma/audit-fix-urls.ts

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (!tursoUrl) throw new Error("TURSO_DATABASE_URL not set");

const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
const prisma = new PrismaClient({ adapter } as any);

interface GalleryImage { url: string; caption?: string; credit?: string; }

async function checkUrl(url: string): Promise<number> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CanadianWaterwaysApp/1.0)", Accept: "image/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    return res.status;
  } catch { return 0; }
}

function extractWikimediaFilename(url: string): string | null {
  const m = url.match(/\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//);
  if (m?.[1]) return decodeURIComponent(m[1]);
  const m2 = url.match(/\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^?/]+)/);
  if (m2?.[1]) return decodeURIComponent(m2[1]);
  return null;
}

async function findFix(brokenUrl: string): Promise<string | null> {
  if (!brokenUrl.includes("wikimedia.org")) return null;
  const filename = extractWikimediaFilename(brokenUrl);
  if (!filename) return null;

  const candidates: string[] = [
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`,
  ];
  const m = brokenUrl.match(/(\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2})\//);
  if (m?.[1]) {
    candidates.push(`https://upload.wikimedia.org${m[1].replace("/thumb", "")}/${encodeURIComponent(filename)}`);
  }

  for (const c of candidates) {
    const status = await checkUrl(c);
    if (status === 200) return c;
  }
  return null;
}

function parseGallery(raw: string | null): GalleryImage[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
}

async function main() {
  console.log("Connecting to Turso database...");
  const [locations, waterways] = await Promise.all([
    prisma.location.findMany({ select: { id: true, name: true, imageUrl: true, galleryImages: true } }),
    prisma.waterway.findMany({ select: { id: true, name: true, imageUrl: true, galleryImages: true } }),
  ]);
  console.log(`Locations: ${locations.length}  Waterways: ${waterways.length}\n`);

  let checked = 0, broken = 0, fixed = 0, unfixable = 0;

  type Rec = { id: string; name: string; imageUrl: string | null; galleryImages: string | null };

  async function processRecord(rec: Rec, table: "location" | "waterway") {
    const updateData: Record<string, string | null> = {};

    if (rec.imageUrl) {
      checked++;
      const status = await checkUrl(rec.imageUrl);
      if (status !== 200) {
        broken++;
        console.log(`BROKEN(${status}) [${table}] ${rec.name} imageUrl`);
        const fix = await findFix(rec.imageUrl);
        if (fix) { console.log(`  FIXED: ${fix}`); updateData.imageUrl = fix; fixed++; }
        else { console.log(`  UNFIXABLE`); unfixable++; }
      }
    }

    if (rec.galleryImages) {
      const imgs = parseGallery(rec.galleryImages);
      let changed = false;
      const patched: GalleryImage[] = [];
      for (const img of imgs) {
        if (!img.url) { patched.push(img); continue; }
        checked++;
        const status = await checkUrl(img.url);
        if (status !== 200) {
          broken++;
          console.log(`BROKEN(${status}) [${table}] ${rec.name} gallery: ${img.url.slice(0, 80)}`);
          const fix = await findFix(img.url);
          if (fix) { console.log(`  FIXED: ${fix}`); patched.push({ ...img, url: fix }); changed = true; fixed++; }
          else { console.log(`  UNFIXABLE`); patched.push(img); unfixable++; }
        } else { patched.push(img); }
      }
      if (changed) updateData.galleryImages = JSON.stringify(patched);
    }

    if (Object.keys(updateData).length > 0) {
      if (table === "location") await prisma.location.update({ where: { id: rec.id }, data: updateData });
      else await prisma.waterway.update({ where: { id: rec.id }, data: updateData });
      console.log(`  DB updated: [${table}] ${rec.name}`);
    }
  }

  for (const loc of locations) await processRecord(loc as Rec, "location");
  for (const ww of waterways) await processRecord(ww as Rec, "waterway");

  console.log(`\n=== DONE ===`);
  console.log(`Checked: ${checked}  Broken: ${broken}  Fixed: ${fixed}  Unfixable: ${unfixable}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
