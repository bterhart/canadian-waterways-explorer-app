/**
 * migrate-from-csv.ts
 *
 * ONE-TIME migration: reads /tmp/cleaned-urls.csv as the authoritative image map,
 * downloads each image from its effective URL, uploads it to Cloudflare R2,
 * and updates the database one sequence at a time.
 *
 * A "sequence" = all images for one (table, field) pair.
 * The database is committed after each sequence completes.
 *
 * Safety:
 *   - Random 17–63 s delay between downloads (Wikimedia rate-limit safe)
 *   - On 429: retry with rand(20–40 s) + 30 s, then rand(20–40 s) + 60 s
 *   - DB saved per-sequence: a crash mid-run preserves all completed sequences
 *   - On download/upload failure: row is SKIPPED in DB (not written with source URL)
 *   - Resume-safe: R2 HEAD check skips already-uploaded images
 *
 * Usage:
 *   cd backend && bun run prisma/migrate-from-csv.ts
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import { prisma } from "../src/prisma";

// ── Config ─────────────────────────────────────────────────────────────────

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const CSV_PATH = "/tmp/cleaned-urls.csv";

/** Allowed image content-type prefixes. Anything else is rejected. */
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
];

/** Known image extensions for validation. */
const KNOWN_IMAGE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".tiff", ".tif", ".bmp",
]);

// ── Timing helpers ─────────────────────────────────────────────────────────

/** Returns a random integer in [min, max] (inclusive). */
function randMs(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/** Inter-request delay: random 17–63 s. */
function requestDelayMs(): number {
  return randMs(17_000, 63_000);
}

/**
 * Retry delays on 429.
 * Attempt 1: rand(20–40 s) + 30 s
 * Attempt 2: rand(20–40 s) + 60 s
 */
function retryDelayMs(attempt: number): number {
  const base = attempt === 0 ? 30_000 : 60_000;
  return base + randMs(20_000, 40_000);
}

// ── S3 / R2 client ─────────────────────────────────────────────────────────

let s3: S3Client;

function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3;
}

// ── Utilities ──────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Extract a file extension from a URL.
 * Strips query strings and fragments before extracting.
 * Falls back to .jpg only if the extracted extension isn't a known image type.
 */
function extFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastSegment = pathname.split("/").pop() ?? "";
    const ext = path.extname(lastSegment).toLowerCase();

    if (ext && KNOWN_IMAGE_EXTS.has(ext)) {
      return ext;
    }
    // Unknown or missing extension — default to .jpg
    return ".jpg";
  } catch {
    return ".jpg";
  }
}

async function existsInR2(key: string): Promise<boolean> {
  try {
    await getS3().send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ── CSV types and parser ───────────────────────────────────────────────────

interface CsvRow {
  table: string;
  id: string;
  name: string;
  field: string;
  is_hero: string;
  url: string;
  caption: string;
  credit: string;
  http_code: string;
  status: string;
  final_url: string;
  url_converted: string;
  final_url_converted: string;
  converted_urls_identical: string;
  is_hero_norm: string;
}

/**
 * RFC 4180–aware CSV parser.
 * Handles doubled quotes ("") as escaped literal quotes inside quoted fields.
 */
function parseCSV(content: string): CsvRow[] {
  const lines = content.split("\n").filter((l) => l.trim());
  const headers = lines[0]!
    .split(",")
    .map((h) => h.trim().replace(/^\uFEFF/, ""));

  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    const vals: string[] = [];
    let current = "";
    let inQuote = false;
    let j = 0;

    while (j < line.length) {
      const ch = line[j]!;

      if (inQuote) {
        if (ch === '"') {
          // Look ahead: doubled quote = escaped literal quote
          if (j + 1 < line.length && line[j + 1] === '"') {
            current += '"';
            j += 2;
            continue;
          }
          // Single quote = end of quoted field
          inQuote = false;
          j++;
          continue;
        }
        current += ch;
        j++;
      } else {
        if (ch === '"') {
          inQuote = true;
          j++;
          continue;
        }
        if (ch === ",") {
          vals.push(current);
          current = "";
          j++;
          continue;
        }
        current += ch;
        j++;
      }
    }
    vals.push(current);

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (vals[idx] ?? "").trim();
    });
    rows.push(row as unknown as CsvRow);
  }

  return rows;
}

/** Effective URL = final_url_converted if non-empty, else final_url */
function effectiveUrl(row: CsvRow): string {
  return row.final_url_converted.trim() || row.final_url.trim();
}

// ── R2 key naming ──────────────────────────────────────────────────────────

const TABLE_SLUG: Record<string, string> = {
  Waterway:              "waterways",
  Location:              "locations",
  Explorer:              "explorers",
  FieldTripStop:         "field-trip-stops",
  HistoricalEvent:       "historical-events",
  LessonPlan:            "lesson-plans",
  NotableFigure:         "notable-figures",
  PrimarySourceDocument: "primary-sources",
  UserContribution:      "user-contributions",
  VirtualFieldTrip:      "virtual-field-trips",
};

const PORTRAIT_TABLES = new Set(["Explorer", "NotableFigure"]);
const GALLERY_FIELDS  = new Set(["galleryImages", "images"]);

function buildR2Key(
  table: string,
  field: string,
  id: string,
  galleryIndex: number,
  ext: string,
  isHeroNorm: string
): string {
  const slug = TABLE_SLUG[table];
  if (!slug) {
    console.warn(`  [WARN] Unknown table "${table}" — using lowercase fallback`);
  }
  const prefix = slug ?? table.toLowerCase();
  const isGall = GALLERY_FIELDS.has(field);

  if (isGall) {
    return `${prefix}/${id}/gallery-${galleryIndex}${ext}`;
  }

  // Use is_hero_norm from CSV if available, else infer from table
  let suffix: string;
  if (isHeroNorm === "portrait") {
    suffix = "portrait";
  } else if (isHeroNorm === "hero") {
    suffix = "hero";
  } else {
    suffix = PORTRAIT_TABLES.has(table) ? "portrait" : "hero";
  }
  return `${prefix}/${id}/${suffix}${ext}`;
}

// ── Image processing ───────────────────────────────────────────────────────

type ImageResult =
  | { status: "migrated"; r2Url: string }
  | { status: "skipped";  r2Url: string }
  | { status: "failed";   sourceUrl: string; error: string };

const MAX_RETRIES = 2;
const R2_UPLOAD_TIMEOUT_MS = 60_000;

async function processImage(sourceUrl: string, key: string): Promise<ImageResult> {
  // Resume: if object already in R2, return its public URL immediately
  if (await existsInR2(key)) {
    return { status: "skipped", r2Url: `${R2_PUBLIC_URL}/${key}` };
  }

  let response: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      response = await fetch(sourceUrl, {
        headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (image-migration)" },
        signal: AbortSignal.timeout(30_000),
        redirect: "follow",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { status: "failed", sourceUrl, error: `Fetch error: ${msg}` };
    }

    if (response.status !== 429) break;

    if (attempt < MAX_RETRIES) {
      const wait = retryDelayMs(attempt);
      console.log(`    [rate-limited] waiting ${(wait / 1000).toFixed(1)}s before retry ${attempt + 1}…`);
      await sleep(wait);
    }
  }

  if (!response || !response.ok) {
    return {
      status: "failed",
      sourceUrl,
      error: `HTTP ${response?.status ?? "unknown"} from ${sourceUrl}`,
    };
  }

  // Validate content-type is actually an image
  const contentType = response.headers.get("content-type") ?? "";
  const isImage = VALID_IMAGE_TYPES.some((t) => contentType.startsWith(t));
  if (!isImage) {
    // Drain the body to avoid connection leak
    try { await response.arrayBuffer(); } catch { /* ignore */ }
    return {
      status: "failed",
      sourceUrl,
      error: `Non-image content-type: "${contentType}"`,
    };
  }

  try {
    const buffer = Buffer.from(await response.arrayBuffer());

    await getS3().send(
      new PutObjectCommand({
        Bucket:      R2_BUCKET_NAME,
        Key:         key,
        Body:        buffer,
        ContentType: contentType,
      }),
      { requestTimeout: R2_UPLOAD_TIMEOUT_MS }
    );

    return { status: "migrated", r2Url: `${R2_PUBLIC_URL}/${key}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { status: "failed", sourceUrl, error: `R2 upload error: ${msg}` };
  }
}

// ── Stats ──────────────────────────────────────────────────────────────────

interface Failure {
  table: string;
  field: string;
  id: string;
  name: string;
  sourceUrl: string;
  error: string;
}

const stats = { migrated: 0, skipped: 0, failed: 0, failures: [] as Failure[] };

function recordResult(result: ImageResult, row: CsvRow) {
  if (result.status === "migrated") {
    stats.migrated++;
    console.log(`    → [OK]   ${result.r2Url}`);
  } else if (result.status === "skipped") {
    stats.skipped++;
    console.log(`    → [SKIP] already in R2: ${result.r2Url}`);
  } else {
    stats.failed++;
    stats.failures.push({
      table:     row.table,
      field:     row.field,
      id:        row.id,
      name:      row.name,
      sourceUrl: result.sourceUrl,
      error:     result.error,
    });
    console.error(`    → [FAIL] ${result.error}`);
  }
}

// ── Sequence runners ───────────────────────────────────────────────────────

type UpdateScalarFn = (id: string, url: string) => Promise<void>;
type UpdateGalleryFn = (id: string, gallery: string) => Promise<void>;

/**
 * Scalar field sequence (imageUrl / heroImageUrl / coverImageUrl).
 * One row per record; writes a plain string to the DB field.
 * Failed images are NOT written to the DB.
 */
async function runScalarSequence(
  rows: CsvRow[],
  label: string,
  updateFn: UpdateScalarFn
) {
  console.log(`\n╔══ ${label} (${rows.length} images) ══╗`);

  const pending: Array<{ id: string; r2Url: string }> = [];

  for (const row of rows) {
    const srcUrl = effectiveUrl(row);
    const ext    = extFromUrl(srcUrl);
    const key    = buildR2Key(row.table, row.field, row.id, 0, ext, row.is_hero_norm);

    console.log(`  ${row.name} [${row.id}]`);
    console.log(`    src: ${srcUrl.substring(0, 100)}`);

    const result = await processImage(srcUrl, key);
    recordResult(result, row);

    // Only queue successful results for DB write
    if (result.status === "migrated" || result.status === "skipped") {
      pending.push({ id: row.id, r2Url: result.r2Url });
    }

    // Only delay when we actually downloaded from upstream
    if (result.status === "migrated") await sleep(requestDelayMs());
  }

  // ── Commit this sequence ───────────────────────────────────────────────
  console.log(`\n  Committing ${pending.length} records to database…`);
  let saved = 0;
  for (const { id, r2Url } of pending) {
    try {
      await updateFn(id, r2Url);
      saved++;
    } catch (err) {
      console.error(
        `  [DB ERROR] id=${id}: ${err instanceof Error ? err.message : err}`
      );
    }
  }
  console.log(`  ✓ ${saved}/${pending.length} records saved`);
  console.log(`╚══ ${label} done ══╝`);
}

/**
 * Gallery field sequence (galleryImages / images).
 * Multiple rows share the same id; writes a JSON array to the DB field.
 * Failed images are excluded from the gallery array.
 */
async function runGallerySequence(
  rows: CsvRow[],
  label: string,
  updateFn: UpdateGalleryFn
) {
  console.log(`\n╔══ ${label} (${rows.length} images) ══╗`);

  // Group rows by id, preserving CSV order within each group
  const grouped = new Map<string, CsvRow[]>();
  for (const row of rows) {
    if (!grouped.has(row.id)) grouped.set(row.id, []);
    grouped.get(row.id)!.push(row);
  }

  type GalleryEntry = { url: string; caption: string; credit: string };
  const pending: Array<{ id: string; entries: GalleryEntry[] }> = [];

  for (const [id, groupRows] of grouped) {
    const entries: GalleryEntry[] = [];

    for (let i = 0; i < groupRows.length; i++) {
      const row    = groupRows[i]!;
      const srcUrl = effectiveUrl(row);
      const ext    = extFromUrl(srcUrl);
      const key    = buildR2Key(row.table, row.field, id, i, ext, row.is_hero_norm);

      console.log(`  ${row.name} [${id}] gallery[${i}]`);
      console.log(`    src: ${srcUrl.substring(0, 100)}`);

      const result = await processImage(srcUrl, key);
      recordResult(result, row);

      // Only include successfully migrated/skipped images in gallery
      if (result.status === "migrated" || result.status === "skipped") {
        entries.push({ url: result.r2Url, caption: row.caption, credit: row.credit });
      }

      // Only delay when we actually downloaded from upstream
      if (result.status === "migrated") await sleep(requestDelayMs());
    }

    // Only queue if at least one image succeeded
    if (entries.length > 0) {
      pending.push({ id, entries });
    }
  }

  // ── Commit this sequence ───────────────────────────────────────────────
  console.log(`\n  Committing ${pending.length} gallery records to database…`);
  let saved = 0;
  for (const { id, entries } of pending) {
    try {
      await updateFn(id, JSON.stringify(entries));
      saved++;
    } catch (err) {
      console.error(
        `  [DB ERROR] id=${id}: ${err instanceof Error ? err.message : err}`
      );
    }
  }
  console.log(`  ✓ ${saved}/${pending.length} records saved`);
  console.log(`╚══ ${label} done ══╝`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  // Validate R2 env
  const missing = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ].filter((k) => !process.env[k]);

  if (missing.length > 0) {
    console.error(`\n❌ R2 not configured. Missing vars: ${missing.join(", ")}\n`);
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`\n❌ CSV not found at ${CSV_PATH}\n`);
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf-8"));

  console.log("═══════════════════════════════════════════════════");
  console.log("  migrate-from-csv.ts — R2 image migration");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  CSV rows       : ${rows.length}`);
  console.log(`  R2 bucket      : ${R2_BUCKET_NAME}`);
  console.log(`  R2 public URL  : ${R2_PUBLIC_URL}`);
  console.log(`  Request delay  : 17–63 s (randomised, downloads only)`);
  console.log(`  Started at     : ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════");

  const filter = (table: string, field: string) =>
    rows.filter((r) => r.table === table && r.field === field);

  // ── 13 sequences, DB committed after each ─────────────────────────────

  // 1. Waterway.imageUrl
  await runScalarSequence(
    filter("Waterway", "imageUrl"),
    "Waterway.imageUrl",
    async (id, url) => { await prisma.waterway.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 2. Waterway.galleryImages
  await runGallerySequence(
    filter("Waterway", "galleryImages"),
    "Waterway.galleryImages",
    async (id, gallery) => { await prisma.waterway.update({ where: { id }, data: { galleryImages: gallery } }); }
  );

  // 3. Location.imageUrl
  await runScalarSequence(
    filter("Location", "imageUrl"),
    "Location.imageUrl",
    async (id, url) => { await prisma.location.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 4. Location.galleryImages
  await runGallerySequence(
    filter("Location", "galleryImages"),
    "Location.galleryImages",
    async (id, gallery) => { await prisma.location.update({ where: { id }, data: { galleryImages: gallery } }); }
  );

  // 5. Explorer.imageUrl
  await runScalarSequence(
    filter("Explorer", "imageUrl"),
    "Explorer.imageUrl",
    async (id, url) => { await prisma.explorer.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 6. FieldTripStop.imageUrl
  await runScalarSequence(
    filter("FieldTripStop", "imageUrl"),
    "FieldTripStop.imageUrl",
    async (id, url) => { await prisma.fieldTripStop.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 7. HistoricalEvent.imageUrl
  await runScalarSequence(
    filter("HistoricalEvent", "imageUrl"),
    "HistoricalEvent.imageUrl",
    async (id, url) => { await prisma.historicalEvent.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 8. LessonPlan.heroImageUrl
  await runScalarSequence(
    filter("LessonPlan", "heroImageUrl"),
    "LessonPlan.heroImageUrl",
    async (id, url) => { await prisma.lessonPlan.update({ where: { id }, data: { heroImageUrl: url } }); }
  );

  // 9. LessonPlan.images
  await runGallerySequence(
    filter("LessonPlan", "images"),
    "LessonPlan.images",
    async (id, gallery) => { await prisma.lessonPlan.update({ where: { id }, data: { images: gallery } }); }
  );

  // 10. NotableFigure.imageUrl
  await runScalarSequence(
    filter("NotableFigure", "imageUrl"),
    "NotableFigure.imageUrl",
    async (id, url) => { await prisma.notableFigure.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 11. PrimarySourceDocument.imageUrl
  await runScalarSequence(
    filter("PrimarySourceDocument", "imageUrl"),
    "PrimarySourceDocument.imageUrl",
    async (id, url) => { await prisma.primarySourceDocument.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 12. UserContribution.imageUrl
  await runScalarSequence(
    filter("UserContribution", "imageUrl"),
    "UserContribution.imageUrl",
    async (id, url) => { await prisma.userContribution.update({ where: { id }, data: { imageUrl: url } }); }
  );

  // 13. VirtualFieldTrip.coverImageUrl
  await runScalarSequence(
    filter("VirtualFieldTrip", "coverImageUrl"),
    "VirtualFieldTrip.coverImageUrl",
    async (id, url) => { await prisma.virtualFieldTrip.update({ where: { id }, data: { coverImageUrl: url } }); }
  );

  // ── Final summary ──────────────────────────────────────────────────────

  const total = stats.migrated + stats.skipped + stats.failed;
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  MIGRATION COMPLETE");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Completed at         : ${new Date().toISOString()}`);
  console.log(`  Total images         : ${total}`);
  console.log(`  Uploaded to R2       : ${stats.migrated}`);
  console.log(`  Already in R2        : ${stats.skipped}`);
  console.log(`  Failed               : ${stats.failed}`);

  if (stats.failures.length > 0) {
    console.log("\n  Failed images (NOT written to DB — re-run to retry):");
    for (const f of stats.failures) {
      console.log(`    [${f.table}.${f.field}] ${f.name} (${f.id})`);
      console.log(`      src : ${f.sourceUrl}`);
      console.log(`      err : ${f.error}`);
    }
    console.log("\n  Re-run the script to retry only the failed images.");
  } else {
    console.log("\n  ✅ All images successfully migrated to R2.");
  }

  await prisma.$disconnect();
}

let exitCode = 0;

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    exitCode = 1;
  })
  .finally(() => process.exit(exitCode));
