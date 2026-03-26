/**
 * migrate-images-to-cdn.ts
 *
 * ONE-TIME migration: downloads all gallery and portrait images from their
 * current external URLs and re-hosts them on Cloudflare R2.
 *
 * Scope:
 *   Waterway.imageUrl + Waterway.galleryImages
 *   Location.imageUrl + Location.galleryImages
 *   Explorer.imageUrl
 *
 * Safe to re-run: any URL already pointing to the CDN is skipped.
 * On failure: the original URL is preserved and the failure is logged.
 *
 * Usage (after adding R2 env vars via the ENV tab):
 *   cd backend && bun run prisma/migrate-images-to-cdn.ts
 */

import path from "path";
import { prisma } from "../src/prisma";
import { uploadImageFromUrl, isCdnUrl } from "../src/lib/image-cdn";
import { env } from "../src/env";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Failure = {
  model: string;
  recordId: string;
  field: string;
  url: string;
  error: string;
};

type Stats = {
  migrated: number;
  skipped: number;
  failed: number;
  failures: Failure[];
};

type GalleryEntry = { url: string; caption: string; credit: string };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract the file extension from a URL path, falling back to .jpg. */
function extFromUrl(url: string): string {
  try {
    const p = new URL(url).pathname;
    const ext = path.extname(p).toLowerCase();
    return ext || ".jpg";
  } catch {
    return ".jpg";
  }
}

/** Delay between downloads — 1.5s base to stay under Wikimedia rate limits. */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const REQUEST_DELAY = 1500;

/**
 * Attempts to migrate one URL to the CDN.
 * Returns the new CDN URL on success, the original URL on failure.
 * Mutates `stats` in place.
 */
async function migrateUrl(
  sourceUrl: string,
  cdnKey: string,
  label: string,
  stats: Stats
): Promise<string> {
  if (isCdnUrl(sourceUrl)) {
    console.log(`  [skip]  ${label}`);
    stats.skipped++;
    return sourceUrl;
  }

  try {
    const cdnUrl = await uploadImageFromUrl(sourceUrl, cdnKey);
    console.log(`  [ok]    ${label}`);
    console.log(`          → ${cdnUrl}`);
    stats.migrated++;
    return cdnUrl;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [fail]  ${label}: ${message}`);
    const parts = label.split("/");
    stats.failed++;
    stats.failures.push({
      model: parts[0] ?? "unknown",
      recordId: parts[1] ?? "unknown",
      field: parts[2] ?? "unknown",
      url: sourceUrl,
      error: message,
    });
    return sourceUrl; // preserve original on failure
  }
}

/** Parse galleryImages JSON; return empty array on any parse error. */
function parseGallery(json: string | null): GalleryEntry[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  // Guard: all R2 vars must be present
  const missing = (["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL"] as const)
    .filter((k) => !env[k]);
  if (missing.length > 0) {
    console.error(`\n❌  R2 not configured. Missing env vars: ${missing.join(", ")}`);
    console.error("    Add them via the ENV tab on Vibecode, then re-run this script.\n");
    process.exit(1);
  }

  console.log("=== migrate-images-to-cdn.ts ===\n");
  const stats: Stats = { migrated: 0, skipped: 0, failed: 0, failures: [] };

  // ── Waterways ─────────────────────────────────────────────────────────────
  console.log("── Waterways ──────────────────────────────────────────────────");
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: "asc" },
  });

  for (const w of waterways) {
    console.log(`\n[Waterway] ${w.name}`);
    const updates: { imageUrl?: string; galleryImages?: string } = {};

    // Hero image
    if (w.imageUrl) {
      const ext = extFromUrl(w.imageUrl);
      const newUrl = await migrateUrl(
        w.imageUrl,
        `waterways/${w.id}/hero${ext}`,
        `Waterway/${w.id}/imageUrl`,
        stats
      );
      if (newUrl !== w.imageUrl) updates.imageUrl = newUrl;
      await delay(200);
    }

    // Gallery images — migrate sequentially to avoid rate limits
    const gallery = parseGallery(w.galleryImages);
    if (gallery.length > 0) {
      let galleryChanged = false;
      const updatedGallery: GalleryEntry[] = [];

      for (let i = 0; i < gallery.length; i++) {
        const entry = gallery[i]!;
        const ext = extFromUrl(entry.url);
        const newUrl = await migrateUrl(
          entry.url,
          `waterways/${w.id}/gallery-${i}${ext}`,
          `Waterway/${w.id}/galleryImages[${i}]`,
          stats
        );
        if (newUrl !== entry.url) galleryChanged = true;
        updatedGallery.push({ ...entry, url: newUrl });
        if (i < gallery.length - 1) await delay(200);
      }

      if (galleryChanged) updates.galleryImages = JSON.stringify(updatedGallery);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.waterway.update({ where: { id: w.id }, data: updates });
    }
  }

  // ── Locations ─────────────────────────────────────────────────────────────
  console.log("\n── Locations ──────────────────────────────────────────────────");
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: "asc" },
  });

  for (const l of locations) {
    console.log(`\n[Location] ${l.name}`);
    const updates: { imageUrl?: string; galleryImages?: string } = {};

    if (l.imageUrl) {
      const ext = extFromUrl(l.imageUrl);
      const newUrl = await migrateUrl(
        l.imageUrl,
        `locations/${l.id}/hero${ext}`,
        `Location/${l.id}/imageUrl`,
        stats
      );
      if (newUrl !== l.imageUrl) updates.imageUrl = newUrl;
      await delay(200);
    }

    const gallery = parseGallery(l.galleryImages);
    if (gallery.length > 0) {
      let galleryChanged = false;
      const updatedGallery: GalleryEntry[] = [];

      for (let i = 0; i < gallery.length; i++) {
        const entry = gallery[i]!;
        const ext = extFromUrl(entry.url);
        const newUrl = await migrateUrl(
          entry.url,
          `locations/${l.id}/gallery-${i}${ext}`,
          `Location/${l.id}/galleryImages[${i}]`,
          stats
        );
        if (newUrl !== entry.url) galleryChanged = true;
        updatedGallery.push({ ...entry, url: newUrl });
        if (i < gallery.length - 1) await delay(200);
      }

      if (galleryChanged) updates.galleryImages = JSON.stringify(updatedGallery);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.location.update({ where: { id: l.id }, data: updates });
    }
  }

  // ── Explorers ─────────────────────────────────────────────────────────────
  console.log("\n── Explorers ──────────────────────────────────────────────────");
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
  });

  for (const e of explorers) {
    if (!e.imageUrl) continue;
    console.log(`\n[Explorer] ${e.name}`);
    const ext = extFromUrl(e.imageUrl);
    const newUrl = await migrateUrl(
      e.imageUrl,
      `explorers/${e.id}/portrait${ext}`,
      `Explorer/${e.id}/imageUrl`,
      stats
    );
    if (newUrl !== e.imageUrl) {
      await prisma.explorer.update({ where: { id: e.id }, data: { imageUrl: newUrl } });
    }
    await delay(200);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = stats.migrated + stats.skipped + stats.failed;
  console.log("\n=== Summary ===");
  console.log(`Total URLs processed : ${total}`);
  console.log(`  Migrated to CDN    : ${stats.migrated}`);
  console.log(`  Already on CDN     : ${stats.skipped}`);
  console.log(`  Failed (kept orig) : ${stats.failed}`);

  if (stats.failures.length > 0) {
    console.log("\nFailures — original URLs preserved in database:");
    for (const f of stats.failures) {
      console.log(`  ${f.model}/${f.recordId} [${f.field}]`);
      console.log(`    url   : ${f.url}`);
      console.log(`    error : ${f.error}`);
    }
    console.log("\nRe-run this script after resolving failures to retry only the remaining URLs.");
  } else {
    console.log("\n✅  All images successfully migrated to CDN.");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
