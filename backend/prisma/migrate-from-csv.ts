/**
 * migrate-from-csv.ts
 *
 * ONE-TIME migration: reads cleaned_urls_final.csv as the authoritative image map,
 * downloads each image from its effective URL, uploads it to Cloudflare R2,
 * and updates the database one sequence at a time.
 *
 * A "sequence" = all images for one (table, field) pair.
 * The database is committed after each sequence completes.
 *
 * Performance:
 *   - Parallel downloads within each sequence (default 6 workers)
 *   - 3 s inter-request delay per worker (~18 req/min aggregate)
 *   - Duplicate source URLs downloaded once, R2 object reused
 *   - TIFF images auto-converted to JPEG before upload
 *
 * Rate-limit safety:
 *   - Per-request: 2 retries on 429 with escalating backoff (50–70 s, 80–100 s)
 *   - Circuit breaker: 3+ 429s in 60 s → all workers pause 120 s, delays double
 *   - Sustained throttle: 3 breaker trips in one sequence → drop to 2 workers, 15 s delay
 *   - Sequence abort: 10+ consecutive failures → commit partial, move on
 *
 * Crash safety:
 *   - DB committed per-sequence: a crash preserves all completed sequences
 *   - Resume-safe: R2 HEAD check skips already-uploaded images
 *   - Failed images NOT written to DB
 *
 * Usage:
 *   cd backend && bun run prisma/migrate-from-csv.ts
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { prisma } from "../src/prisma";

// ── Config ─────────────────────────────────────────────────────────────────

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const CSV_PATH = "cleaned_urls_final.csv";

/** Enable this for safer, slower migration when dealing with Wikimedia Commons */
const WIKIMEDIA_SLOW_MODE = true;   // ← SET TO TRUE for set-and-forget

/** Allowed image content-type prefixes. */
const VALID_IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "image/svg+xml", "image/tiff", "image/bmp",
];

/** Known image extensions */
const KNOWN_IMAGE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".tiff", ".tif", ".bmp",
]);

// ── Concurrency & timing ───────────────────────────────────────────────────

let CONCURRENCY = 6;
let INTER_REQUEST_DELAY_MS = 3_000;

if (WIKIMEDIA_SLOW_MODE) {
  CONCURRENCY = 2;
  INTER_REQUEST_DELAY_MS = 10_000;        // 10 seconds between requests
  console.log("⚠️  WIKIMEDIA_SLOW_MODE ENABLED → Using conservative settings (2 workers, 10s delay)");
}

const MAX_RETRIES = 3;                    // increased slightly
const R2_UPLOAD_TIMEOUT_MS = 60_000;

// Circuit breaker state (global, shared across workers)
const rateLimitHits: number[] = [];              // timestamps of recent 429s
let circuitBreakerTrips = 0;                     // trips within current sequence
let consecutiveFailures = 0;                     // consecutive failures across workers
const BREAKER_WINDOW_MS = 60_000;                // 60 s window for 429 counting
const BREAKER_THRESHOLD = 3;                     // 429s in window to trip breaker
const BREAKER_PAUSE_MS = 120_000;                // 120 s global pause on trip
const SEQUENCE_ABORT_THRESHOLD = 10;             // consecutive failures to abort sequence
const SUSTAINED_THROTTLE_TRIPS = 3;              // breaker trips to enter degraded mode
let breakerPausePromise: Promise<void> | null = null; // shared pause lock

// ── Timing helpers ─────────────────────────────────────────────────────────

function randMs(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function retryDelayMs(attempt: number): number {
  const base = attempt === 0 ? 50_000 : 80_000;
  return base + randMs(0, 20_000);
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

function extFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const lastSegment = urlObj.pathname.split("/").pop() ?? "";
    const ext = path.extname(lastSegment).toLowerCase();
    if (ext && KNOWN_IMAGE_EXTS.has(ext)) return ext;
    return ".jpg";
  } catch {
    return ".jpg";
  }
}

function isTiff(ext: string): boolean {
  return ext === ".tif" || ext === ".tiff";
}

async function existsInR2(key: string): Promise<boolean> {
  try {
    await getS3().send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ── Circuit breaker ────────────────────────────────────────────────────────

function record429(): void {
  const now = Date.now();
  rateLimitHits.push(now);
  while (rateLimitHits.length > 0 && rateLimitHits[0]! < now - BREAKER_WINDOW_MS) {
    rateLimitHits.shift();
  }
}

function shouldTripBreaker(): boolean {
  const now = Date.now();
  const recent = rateLimitHits.filter((t) => t > now - BREAKER_WINDOW_MS);
  return recent.length >= BREAKER_THRESHOLD;
}

async function tripBreaker(): Promise<void> {
  if (breakerPausePromise) {
    await breakerPausePromise;
    return;
  }

  circuitBreakerTrips++;
  INTER_REQUEST_DELAY_MS = Math.min(INTER_REQUEST_DELAY_MS * 2, 30_000);

  if (circuitBreakerTrips >= SUSTAINED_THROTTLE_TRIPS) {
    CONCURRENCY = 2;
    INTER_REQUEST_DELAY_MS = 15_000;
    console.warn(
      `\n  ⚠️  SUSTAINED THROTTLE: ${circuitBreakerTrips} breaker trips. ` +
      `Dropping to ${CONCURRENCY} workers, ${INTER_REQUEST_DELAY_MS / 1000}s delay.\n`
    );
    console.warn(`  Pausing 5 minutes before resuming…\n`);
    breakerPausePromise = sleep(300_000);
  } else {
    console.warn(
      `\n  ⚠️  CIRCUIT BREAKER TRIPPED (#${circuitBreakerTrips}). ` +
      `Pausing all workers ${BREAKER_PAUSE_MS / 1000}s. ` +
      `New delay: ${INTER_REQUEST_DELAY_MS / 1000}s/worker.\n`
    );
    breakerPausePromise = sleep(BREAKER_PAUSE_MS);
  }

  await breakerPausePromise;
  breakerPausePromise = null;
  rateLimitHits.length = 0;
}

function resetBreakerForSequence(): void {
  circuitBreakerTrips = 0;
  consecutiveFailures = 0;
  rateLimitHits.length = 0;
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

function parseCSV(content: string): CsvRow[] {
  const lines = content.split("\n").filter((l) => l.trim());
  const headers = lines[0]!
    .split(",")
    .map((h) => h.trim().replace(/^\uFEFF/, "").replace(/\r$/, ""));

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
          if (j + 1 < line.length && line[j + 1] === '"') {
            current += '"';
            j += 2;
            continue;
          }
          inQuote = false;
          j++;
          continue;
        }
        current += ch;
        j++;
      } else {
        if (ch === '"') { inQuote = true; j++; continue; }
        if (ch === ",") { vals.push(current); current = ""; j++; continue; }
        current += ch;
        j++;
      }
    }
    vals.push(current);

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (vals[idx] ?? "").trim().replace(/\r$/, "");
    });
    rows.push(row as unknown as CsvRow);
  }

  return rows;
}

function effectiveUrl(row: CsvRow): string {
  return row.final_url_converted.trim() || row.final_url.trim();
}

// ── BAC-LAC flagging ───────────────────────────────────────────────────────

function flagBacLacUrls(rows: CsvRow[]): void {
  const bacLac = rows.filter((r) => {
    const url = effectiveUrl(r);
    return url.includes("bac-lac.gc.ca");
  });

  if (bacLac.length === 0) return;

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║  ⚠️  BAC-LAC URLs — MANUAL VERIFICATION NEEDED      ║");
  console.log("╚══════════════════════════════════════════════════════╝");

  for (const r of bacLac) {
    const url = effectiveUrl(r);
    const isSearch = url.includes("recherche-collection-search");
    const severity = isSearch ? "🔴 LIKELY HTML" : "🟡 VERIFY";
    console.log(`  ${severity} ${r.table}.${r.field} [${r.id}]`);
    console.log(`    name: ${r.name}`);
    console.log(`    url:  ${url}`);
    if (isSearch) {
      console.log(`    ↑ This is a search/record page, almost certainly serves HTML`);
    } else {
      console.log(`    ↑ Has &op=img — may serve image directly, but verify`);
    }
    console.log();
  }

  console.log(`  Total BAC-LAC URLs: ${bacLac.length}`);
  console.log(`  These will go through the pipeline — content-type check`);
  console.log(`  will reject any that serve HTML. Check failures list at end.\n`);
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

  // TIFF → convert to JPEG, so key should use .jpg
  const finalExt = isTiff(ext) ? ".jpg" : ext;

  if (GALLERY_FIELDS.has(field)) {
    return `${prefix}/${id}/gallery-${galleryIndex}${finalExt}`;
  }

  let suffix: string;
  if (isHeroNorm === "portrait") suffix = "portrait";
  else if (isHeroNorm === "hero") suffix = "hero";
  else suffix = PORTRAIT_TABLES.has(table) ? "portrait" : "hero";

  return `${prefix}/${id}/${suffix}${finalExt}`;
}

// ── Duplicate URL cache ────────────────────────────────────────────────────

interface DownloadedImage {
  buffer: Buffer;
  contentType: string;
}

const downloadCache = new Map<string, DownloadedImage>();

// ── Image processing ───────────────────────────────────────────────────────

type ImageResult =
  | { status: "migrated"; r2Url: string }
  | { status: "skipped";  r2Url: string }
  | { status: "failed";   sourceUrl: string; error: string };

async function downloadImage(sourceUrl: string): Promise<DownloadedImage | { error: string }> {
  const cached = downloadCache.get(sourceUrl);
  if (cached) return cached;

  const isWikimedia = sourceUrl.includes("wikimedia.org");

  let response: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers: HeadersInit = {
        "User-Agent": "CanadianWaterwaysExplorer/1.0 (https://canadianwaterways.ca; bert@canadianwaterways.ca) image-migration-bot",
        "Api-User-Agent": "CanadianWaterwaysExplorer/1.0 (https://canadianwaterways.ca; bert@canadianwaterways.ca) image-migration-bot",
      };

      response = await fetch(sourceUrl, {
        headers,
        signal: AbortSignal.timeout(60_000),
        redirect: "follow",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt === MAX_RETRIES) {
        return { error: `Fetch timeout/network error: ${msg}` };
      }
      await sleep(8000);
      continue;
    }

    // ── Wikimedia-specific smart handling ─────────────────────────────────
    if (isWikimedia) {
      if (response.status === 403) {
        record429();
        console.warn(`    [WIKI 403 BLOCKED] Attempt ${attempt + 1}/${MAX_RETRIES + 1}`);

        if (attempt < MAX_RETRIES) {
          const wait = retryDelayMs(attempt) * 2;   // extra long backoff on 403
          console.log(`    → Waiting ${(wait / 1000).toFixed(0)}s before retry...`);
          await sleep(wait);
          continue;
        }
      }

      if (response.status === 429) {
        record429();
        if (shouldTripBreaker()) await tripBreaker();
      }

      if (response.status === 404) {
        return { error: `HTTP 404 - Image not found (likely bad/truncated URL)` };
      }
    }

    // General rate limit handling
    if (response.status === 429) {
      record429();
      if (shouldTripBreaker()) await tripBreaker();

      if (attempt < MAX_RETRIES) {
        const wait = retryDelayMs(attempt);
        console.log(`    [429] retry ${attempt + 1} in ${(wait / 1000).toFixed(0)}s…`);
        await sleep(wait);
        continue;
      }
    }

    if (response.status !== 429 && response.status !== 403) break;
  }

  if (!response || !response.ok) {
    return { error: `HTTP ${response?.status ?? "unknown"} from ${sourceUrl}` };
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isImage = VALID_IMAGE_TYPES.some((t) => contentType.startsWith(t));

  if (!isImage) {
    return { error: `Non-image content-type: "${contentType}"` };
  }

  let buffer = Buffer.from(await response.arrayBuffer());

  // Convert TIFF → JPEG
  if (contentType.startsWith("image/tiff")) {
    try {
      console.log(`    [TIFF→JPEG] converting…`);
      buffer = Buffer.from(await sharp(buffer).jpeg({ quality: 90 }).toBuffer());
    } catch (err) {
      return { error: `TIFF conversion error: ${err}` };
    }
  }

  const result: DownloadedImage = {
    buffer,
    contentType: contentType.startsWith("image/tiff") ? "image/jpeg" : contentType,
  };

  downloadCache.set(sourceUrl, result);
  return result;
}

async function processImage(sourceUrl: string, key: string): Promise<ImageResult> {
  if (await existsInR2(key)) {
    return { status: "skipped", r2Url: `${R2_PUBLIC_URL}/${key}` };
  }

  const downloaded = await downloadImage(sourceUrl);
  if ("error" in downloaded) {
    return { status: "failed", sourceUrl, error: downloaded.error };
  }

  try {
    await getS3().send(
      new PutObjectCommand({
        Bucket:      R2_BUCKET_NAME,
        Key:         key,
        Body:        downloaded.buffer,
        ContentType: downloaded.contentType,
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
    consecutiveFailures = 0;
    console.log(`    → [OK]   ${result.r2Url}`);
  } else if (result.status === "skipped") {
    stats.skipped++;
    consecutiveFailures = 0;
    console.log(`    → [SKIP] ${result.r2Url}`);
  } else {
    stats.failed++;
    consecutiveFailures++;
    stats.failures.push({
      table: row.table, field: row.field, id: row.id,
      name: row.name, sourceUrl: result.sourceUrl, error: result.error,
    });
    console.error(`    → [FAIL] ${result.error}`);
  }
}

// ── Parallel worker pool ───────────────────────────────────────────────────

interface WorkItem<T> {
  row: CsvRow;
  sourceUrl: string;
  key: string;
  galleryIndex: number;
  context: T;
}

async function runPool<T>(
  items: WorkItem<T>[],
  onResult: (item: WorkItem<T>, result: ImageResult) => void
): Promise<boolean /* aborted */> {
  let nextIndex = 0;
  let aborted = false;

  async function worker(): Promise<void> {
    while (!aborted) {
      const idx = nextIndex++;
      if (idx >= items.length) return;

      const item = items[idx]!;
      console.log(`  ${item.row.name} [${item.row.id}]${item.galleryIndex >= 0 ? ` gallery[${item.galleryIndex}]` : ""}`);
      console.log(`    src: ${item.sourceUrl.substring(0, 100)}`);

      if (breakerPausePromise) await breakerPausePromise;

      const result = await processImage(item.sourceUrl, item.key);
      recordResult(result, item.row);
      onResult(item, result);

      if (consecutiveFailures >= SEQUENCE_ABORT_THRESHOLD) {
        console.error(`\n  🛑 ${consecutiveFailures} consecutive failures — aborting sequence early.\n`);
        aborted = true;
        return;
      }

      if (result.status === "migrated") {
        await sleep(INTER_REQUEST_DELAY_MS);
      }
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  return aborted;
}

// ── Sequence runners ───────────────────────────────────────────────────────

type UpdateScalarFn = (id: string, url: string) => Promise<void>;
type UpdateGalleryFn = (id: string, gallery: string) => Promise<void>;

async function runScalarSequence(
  rows: CsvRow[],
  label: string,
  updateFn: UpdateScalarFn
) {
  if (rows.length === 0) {
    console.log(`\n╔══ ${label} (0 images — skipping) ══╗`);
    return;
  }

  console.log(`\n╔══ ${label} (${rows.length} images) ══╗`);
  resetBreakerForSequence();

  const pending = new Map<string, string>(); // id → r2Url

  const items: WorkItem<void>[] = rows.map((row) => {
    const srcUrl = effectiveUrl(row);
    const ext    = extFromUrl(srcUrl);
    const key    = buildR2Key(row.table, row.field, row.id, 0, ext, row.is_hero_norm);
    return { row, sourceUrl: srcUrl, key, galleryIndex: -1, context: undefined };
  });

  const aborted = await runPool(items, (item, result) => {
    if (result.status === "migrated" || result.status === "skipped") {
      pending.set(item.row.id, result.r2Url);
    }
  });

  if (aborted) {
    console.log(`  Sequence aborted early. Committing ${pending.size} successful records…`);
  }

  console.log(`\n  Committing ${pending.size} records to database…`);
  let saved = 0;
  for (const [id, r2Url] of pending) {
    try {
      await updateFn(id, r2Url);
      saved++;
    } catch (err) {
      console.error(`  [DB ERROR] id=${id}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`  ✓ ${saved}/${pending.size} records saved`);
  console.log(`╚══ ${label} done ══╝`);
}

async function runGallerySequence(
  rows: CsvRow[],
  label: string,
  updateFn: UpdateGalleryFn
) {
  if (rows.length === 0) {
    console.log(`\n╔══ ${label} (0 images — skipping) ══╗`);
    return;
  }

  console.log(`\n╔══ ${label} (${rows.length} images) ══╗`);
  resetBreakerForSequence();

  const grouped = new Map<string, CsvRow[]>();
  for (const row of rows) {
    if (!grouped.has(row.id)) grouped.set(row.id, []);
    grouped.get(row.id)!.push(row);
  }

  type GalleryEntry = { url: string; caption: string; credit: string };
  const entryMap = new Map<string, GalleryEntry>();

  const items: WorkItem<{ id: string; galleryIndex: number }>[] = [];
  for (const [id, groupRows] of grouped) {
    for (let i = 0; i < groupRows.length; i++) {
      const row    = groupRows[i]!;
      const srcUrl = effectiveUrl(row);
      const ext    = extFromUrl(srcUrl);
      const key    = buildR2Key(row.table, row.field, id, i, ext, row.is_hero_norm);
      items.push({ row, sourceUrl: srcUrl, key, galleryIndex: i, context: { id, galleryIndex: i } });
    }
  }

  const aborted = await runPool(items, (item, result) => {
    if (result.status === "migrated" || result.status === "skipped") {
      entryMap.set(`${item.context.id}:${item.context.galleryIndex}`, {
        url: result.r2Url,
        caption: item.row.caption,
        credit: item.row.credit,
      });
    }
  });

  if (aborted) {
    console.log(`  Sequence aborted early. Committing successful gallery records…`);
  }

  type PendingGallery = { id: string; entries: GalleryEntry[] };
  const pending: PendingGallery[] = [];

  for (const [id, groupRows] of grouped) {
    const entries: GalleryEntry[] = [];
    for (let i = 0; i < groupRows.length; i++) {
      const entry = entryMap.get(`${id}:${i}`);
      if (entry) entries.push(entry);
    }
    if (entries.length > 0) {
      pending.push({ id, entries });
    }
  }

  console.log(`\n  Committing ${pending.length} gallery records to database…`);
  let saved = 0;
  for (const { id, entries } of pending) {
    try {
      await updateFn(id, JSON.stringify(entries));
      saved++;
    } catch (err) {
      console.error(`  [DB ERROR] id=${id}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`  ✓ ${saved}/${pending.length} records saved`);
  console.log(`╚══ ${label} done ══╝`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const missing = [
    "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME", "R2_PUBLIC_URL",
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
  console.log(`  CSV rows        : ${rows.length}`);
  console.log(`  R2 bucket       : ${R2_BUCKET_NAME}`);
  console.log(`  R2 public URL   : ${R2_PUBLIC_URL}`);
  console.log(`  Concurrency     : ${CONCURRENCY} workers`);
  console.log(`  Worker delay    : ${INTER_REQUEST_DELAY_MS / 1000}s`);
  console.log(`  Started at      : ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════");

  flagBacLacUrls(rows);

  const tiffRows = rows.filter((r) => {
    const ext = extFromUrl(effectiveUrl(r));
    return isTiff(ext);
  });
  if (tiffRows.length > 0) {
    console.log(`\n  ℹ️  ${tiffRows.length} TIFF image(s) will be auto-converted to JPEG:\n`);
    for (const r of tiffRows) {
      console.log(`    ${r.table}.${r.field} [${r.id}] ${r.name}`);
    }
    console.log();
  }

  const filter = (table: string, field: string) =>
    rows.filter((r) => r.table === table && r.field === field);

  // ── 13 sequences, DB committed after each ─────────────────────────────

  await runScalarSequence(
    filter("Waterway", "imageUrl"), "Waterway.imageUrl",
    async (id, url) => { await prisma.waterway.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runGallerySequence(
    filter("Waterway", "galleryImages"), "Waterway.galleryImages",
    async (id, gallery) => { await prisma.waterway.update({ where: { id }, data: { galleryImages: gallery } }); }
  );

  await runScalarSequence(
    filter("Location", "imageUrl"), "Location.imageUrl",
    async (id, url) => { await prisma.location.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runGallerySequence(
    filter("Location", "galleryImages"), "Location.galleryImages",
    async (id, gallery) => { await prisma.location.update({ where: { id }, data: { galleryImages: gallery } }); }
  );

  await runScalarSequence(
    filter("Explorer", "imageUrl"), "Explorer.imageUrl",
    async (id, url) => { await prisma.explorer.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("FieldTripStop", "imageUrl"), "FieldTripStop.imageUrl",
    async (id, url) => { await prisma.fieldTripStop.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("HistoricalEvent", "imageUrl"), "HistoricalEvent.imageUrl",
    async (id, url) => { await prisma.historicalEvent.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("LessonPlan", "heroImageUrl"), "LessonPlan.heroImageUrl",
    async (id, url) => { await prisma.lessonPlan.update({ where: { id }, data: { heroImageUrl: url } }); }
  );

  await runGallerySequence(
    filter("LessonPlan", "images"), "LessonPlan.images",
    async (id, gallery) => { await prisma.lessonPlan.update({ where: { id }, data: { images: gallery } }); }
  );

  await runScalarSequence(
    filter("NotableFigure", "imageUrl"), "NotableFigure.imageUrl",
    async (id, url) => { await prisma.notableFigure.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("PrimarySourceDocument", "imageUrl"), "PrimarySourceDocument.imageUrl",
    async (id, url) => { await prisma.primarySourceDocument.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("UserContribution", "imageUrl"), "UserContribution.imageUrl",
    async (id, url) => { await prisma.userContribution.update({ where: { id }, data: { imageUrl: url } }); }
  );

  await runScalarSequence(
    filter("VirtualFieldTrip", "coverImageUrl"), "VirtualFieldTrip.coverImageUrl",
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
  console.log(`  Download cache hits  : ${downloadCache.size} unique URLs cached`);

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