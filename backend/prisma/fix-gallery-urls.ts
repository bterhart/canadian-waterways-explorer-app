/**
 * fix-gallery-urls.ts
 *
 * Repairs broken Wikimedia Commons URLs in galleryImages for all Waterway and Location records.
 *
 * Two-pass strategy:
 *  1. Known dead files (404 after redirect even via Special:FilePath) are replaced with confirmed
 *     working direct URLs. These files were renamed/moved on Wikimedia Commons.
 *  2. All remaining /thumb/ format URLs are converted to Special:FilePath format, which is the
 *     stable canonical Wikimedia redirect API and survives file renames/hash changes.
 *
 * Does NOT touch the imageUrl (hero) field — only galleryImages JSON.
 */

import { prisma } from "../src/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// Known broken thumbnail URLs → confirmed working replacements
// Files were renamed or moved on Wikimedia Commons and return 404 even via Special:FilePath
// ─────────────────────────────────────────────────────────────────────────────
const BROKEN_URL_MAP: Record<string, string> = {
  // Frances Anne Hopkins — "Voyageurs at Dawn" (renamed from old title)
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg/1280px-Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/1/17/FAH_Voyageurs.jpg",

  // Frances Anne Hopkins — "Shooting the Rapids" (renamed)
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg/1280px-Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f5/Shooting_the_Rapids.jpg",

  // Frances Anne Hopkins — "Canoe Manned by Voyageurs" (content hash changed)
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg/1280px-Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/e/e7/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg",

  // Fur Traders Descending the Missouri — original file removed, replaced by MET version
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Fur_Traders_Descending_the_Missouri.jpg/1280px-Fur_Traders_Descending_the_Missouri.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Fur_Traders_Descending_the_Missouri_MET_DP316875.jpg/1280px-Fur_Traders_Descending_the_Missouri_MET_DP316875.jpg",

  // York Factory — old filename removed; new aerial filename confirmed 200
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/6/66/YorkFactoryaerial.jpg",

  // Fort St. Charles — file does not exist on Wikimedia; substitute with Canoe Voyageurs
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Fort_St._Charles.jpg/1280px-Fort_St._Charles.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/e/e7/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg",

  // Henry Kelsey portrait — never existed under this filename; use buffalo plains illustration
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Henry_Kelsey.jpg/800px-Henry_Kelsey.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/Henry_Kelsey_sees_the_buffalo_on_the_western_plains.jpg",

  // HMS Erebus — content hash changed from f/f0 to a/ad; use Special:FilePath
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg/1280px-HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg":
    "https://commons.wikimedia.org/wiki/Special:FilePath/HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg?width=1280",
};

// ─────────────────────────────────────────────────────────────────────────────
// Convert a Wikimedia /thumb/ URL to Special:FilePath format
// Special:FilePath is the stable canonical redirect API — it survives hash changes
// ─────────────────────────────────────────────────────────────────────────────
function thumbToSpecialFilePath(url: string): string | null {
  const match = url.match(
    /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[a-f0-9]\/[a-f0-9]+\/([^/]+)\/(\d+)px-/
  );
  if (!match || !match[1] || !match[2]) return null;

  const encodedFilename = match[1];
  const width = match[2];

  // Decode percent-encoded ASCII characters (e.g. %2C → ,)
  // Re-encode non-ASCII characters only (e.g. é → %C3%A9)
  const decodedFilename = decodeURIComponent(encodedFilename);
  const safeFilename = decodedFilename.replace(/[^\x00-\x7F]/g, (char) =>
    encodeURIComponent(char)
  );

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${safeFilename}?width=${width}`;
}

function fixUrl(url: string): string {
  // Pass 1: check known broken URLs with confirmed direct replacements
  if (BROKEN_URL_MAP[url]) {
    return BROKEN_URL_MAP[url];
  }

  // Pass 2: convert remaining /thumb/ URLs to Special:FilePath
  const specialFilePath = thumbToSpecialFilePath(url);
  if (specialFilePath) {
    return specialFilePath;
  }

  // Already a working URL (Special:FilePath, direct, or other format)
  return url;
}

function fixGalleryJson(
  galleryJson: string | null
): { fixed: string | null; changed: boolean } {
  if (!galleryJson) return { fixed: null, changed: false };

  try {
    const gallery = JSON.parse(galleryJson) as Array<{
      url: string;
      caption: string;
      credit: string;
    }>;
    let changed = false;

    const fixedGallery = gallery.map((entry) => {
      const newUrl = fixUrl(entry.url);
      if (newUrl !== entry.url) {
        changed = true;
        return { ...entry, url: newUrl };
      }
      return entry;
    });

    return {
      fixed: changed ? JSON.stringify(fixedGallery) : galleryJson,
      changed,
    };
  } catch {
    return { fixed: galleryJson, changed: false };
  }
}

async function main() {
  console.log("=== fix-gallery-urls.ts ===\n");

  // ── Waterways ──────────────────────────────────────────────────────────────
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, galleryImages: true },
    orderBy: { name: "asc" },
  });

  let waterwayFixed = 0;
  for (const w of waterways) {
    const { fixed, changed } = fixGalleryJson(w.galleryImages);
    if (changed && fixed) {
      await prisma.waterway.update({
        where: { id: w.id },
        data: { galleryImages: fixed },
      });
      waterwayFixed++;
      console.log(`[waterway] Fixed: ${w.name}`);
    }
  }

  // ── Locations ──────────────────────────────────────────────────────────────
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, galleryImages: true },
    orderBy: { name: "asc" },
  });

  let locationFixed = 0;
  for (const l of locations) {
    const { fixed, changed } = fixGalleryJson(l.galleryImages);
    if (changed && fixed) {
      await prisma.location.update({
        where: { id: l.id },
        data: { galleryImages: fixed },
      });
      locationFixed++;
      console.log(`[location]  Fixed: ${l.name}`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(
    `Waterways: ${waterwayFixed} fixed / ${waterways.length} total`
  );
  console.log(
    `Locations:  ${locationFixed} fixed / ${locations.length} total`
  );
  console.log("\nDone.");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
