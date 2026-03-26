/**
 * image-health-check.ts
 *
 * Scheduled daily job (02:00 server time) that:
 *   1. Collects every image URL stored across all models in the database
 *   2. Sends a HEAD request to each URL (follows redirects, 8-second timeout)
 *   3. Classifies the result: healthy | broken | rate_limited | unreachable | repaired
 *   4. For broken Wikimedia URLs on non-UGC records: attempts auto-repair via
 *      the Wikimedia search API; updates the database if an unambiguous match is found
 *   5. Persists all results to ImageHealthLog for the admin dashboard
 *
 * Designed to run in the background without blocking server startup or requests.
 * All errors are caught internally; the job never crashes the server.
 */

import { prisma } from "../prisma";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type UrlStatus = "healthy" | "broken" | "rate_limited" | "unreachable" | "repaired";

type UrlRecord = {
  model: string;
  recordId: string;
  field: string;         // e.g. "imageUrl" or "galleryImages[2]"
  url: string;
  isUgc: boolean;        // UGC URLs: check only, never auto-repair
  isGallery: boolean;    // gallery JSON fields need special update logic
  galleryIndex?: number; // index within the JSON array, when isGallery == true
};

// ─────────────────────────────────────────────────────────────────────────────
// URL collection — one explicit block per model
// ─────────────────────────────────────────────────────────────────────────────

type GalleryEntry = { url: string; caption: string; credit: string };

function parseGallery(json: string | null | undefined): GalleryEntry[] {
  if (!json) return [];
  try {
    const p = JSON.parse(json);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

async function collectUrls(): Promise<UrlRecord[]> {
  const records: UrlRecord[] = [];

  const push = (r: Omit<UrlRecord, "isUgc" | "isGallery">, isUgc = false) =>
    records.push({ ...r, isUgc, isGallery: false });

  const pushGallery = (
    model: string,
    recordId: string,
    json: string | null | undefined
  ) => {
    parseGallery(json).forEach((entry, i) => {
      records.push({
        model,
        recordId,
        field: `galleryImages[${i}]`,
        url: entry.url,
        isUgc: false,
        isGallery: true,
        galleryIndex: i,
      });
    });
  };

  // Waterway
  const waterways = await prisma.waterway.findMany({
    select: { id: true, imageUrl: true, galleryImages: true },
  });
  for (const w of waterways) {
    if (w.imageUrl) push({ model: "Waterway", recordId: w.id, field: "imageUrl", url: w.imageUrl });
    pushGallery("Waterway", w.id, w.galleryImages);
  }

  // Location
  const locations = await prisma.location.findMany({
    select: { id: true, imageUrl: true, galleryImages: true },
  });
  for (const l of locations) {
    if (l.imageUrl) push({ model: "Location", recordId: l.id, field: "imageUrl", url: l.imageUrl });
    pushGallery("Location", l.id, l.galleryImages);
  }

  // Explorer
  const explorers = await prisma.explorer.findMany({ select: { id: true, imageUrl: true } });
  for (const e of explorers) {
    if (e.imageUrl) push({ model: "Explorer", recordId: e.id, field: "imageUrl", url: e.imageUrl });
  }

  // UserContribution (UGC — check only, never auto-repair)
  const contributions = await prisma.userContribution.findMany({
    select: { id: true, imageUrl: true },
    where: { imageUrl: { not: null } },
  });
  for (const c of contributions) {
    if (c.imageUrl) push({ model: "UserContribution", recordId: c.id, field: "imageUrl", url: c.imageUrl }, true);
  }

  // LessonPlan
  const lessonPlans = await prisma.lessonPlan.findMany({
    select: { id: true, heroImageUrl: true, images: true },
  });
  for (const lp of lessonPlans) {
    if (lp.heroImageUrl) push({ model: "LessonPlan", recordId: lp.id, field: "heroImageUrl", url: lp.heroImageUrl });
    pushGallery("LessonPlan", lp.id, lp.images);
  }

  // TimelineEvent
  const timelineEvents = await prisma.timelineEvent.findMany({ select: { id: true, imageUrl: true } });
  for (const t of timelineEvents) {
    if (t.imageUrl) push({ model: "TimelineEvent", recordId: t.id, field: "imageUrl", url: t.imageUrl });
  }

  // VirtualFieldTrip
  const fieldTrips = await prisma.virtualFieldTrip.findMany({ select: { id: true, coverImageUrl: true } });
  for (const ft of fieldTrips) {
    if (ft.coverImageUrl) push({ model: "VirtualFieldTrip", recordId: ft.id, field: "coverImageUrl", url: ft.coverImageUrl });
  }

  // FieldTripStop
  const tripStops = await prisma.fieldTripStop.findMany({ select: { id: true, imageUrl: true } });
  for (const s of tripStops) {
    if (s.imageUrl) push({ model: "FieldTripStop", recordId: s.id, field: "imageUrl", url: s.imageUrl });
  }

  // PrimarySourceDocument
  const documents = await prisma.primarySourceDocument.findMany({ select: { id: true, imageUrl: true } });
  for (const d of documents) {
    if (d.imageUrl) push({ model: "PrimarySourceDocument", recordId: d.id, field: "imageUrl", url: d.imageUrl });
  }

  // PrintableResource
  const printables = await prisma.printableResource.findMany({ select: { id: true, previewImageUrl: true } });
  for (const p of printables) {
    if (p.previewImageUrl) push({ model: "PrintableResource", recordId: p.id, field: "previewImageUrl", url: p.previewImageUrl });
  }

  // VoyageurJourney
  const journeys = await prisma.voyageurJourney.findMany({ select: { id: true, coverImageUrl: true } });
  for (const j of journeys) {
    if (j.coverImageUrl) push({ model: "VoyageurJourney", recordId: j.id, field: "coverImageUrl", url: j.coverImageUrl });
  }

  // JourneyNode
  const nodes = await prisma.journeyNode.findMany({ select: { id: true, imageUrl: true } });
  for (const n of nodes) {
    if (n.imageUrl) push({ model: "JourneyNode", recordId: n.id, field: "imageUrl", url: n.imageUrl });
  }

  // HistoricalEvent
  const histEvents = await prisma.historicalEvent.findMany({ select: { id: true, imageUrl: true } });
  for (const h of histEvents) {
    if (h.imageUrl) push({ model: "HistoricalEvent", recordId: h.id, field: "imageUrl", url: h.imageUrl });
  }

  // NotableFigure
  const figures = await prisma.notableFigure.findMany({ select: { id: true, imageUrl: true } });
  for (const f of figures) {
    if (f.imageUrl) push({ model: "NotableFigure", recordId: f.id, field: "imageUrl", url: f.imageUrl });
  }

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// URL reachability check
// ─────────────────────────────────────────────────────────────────────────────

async function checkUrl(url: string): Promise<{ status: UrlStatus; httpCode: number }> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (health-check)" },
    });

    if (response.ok) return { status: "healthy", httpCode: response.status };
    if (response.status === 429) return { status: "rate_limited", httpCode: 429 };
    if (response.status === 404) return { status: "broken", httpCode: 404 };
    return { status: "broken", httpCode: response.status };
  } catch {
    return { status: "unreachable", httpCode: 0 };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wikimedia auto-repair
// ─────────────────────────────────────────────────────────────────────────────

function extractWikimediaFilename(url: string): string | null {
  try {
    const parsed = new URL(url);

    // upload.wikimedia.org/wikipedia/commons/thumb/{h}/{hh}/{Filename}/{W}px-{Filename}
    const thumbMatch = parsed.pathname.match(/\/commons\/thumb\/[^/]+\/[^/]+\/([^/]+)\//);
    if (thumbMatch?.[1]) return decodeURIComponent(thumbMatch[1]);

    // upload.wikimedia.org/wikipedia/commons/{h}/{hh}/{Filename}
    const directMatch = parsed.pathname.match(/\/commons\/[^/]+\/[^/]+\/([^/]+)$/);
    if (directMatch?.[1]) return decodeURIComponent(directMatch[1]);

    // commons.wikimedia.org/wiki/Special:FilePath/{Filename}
    const specialMatch = parsed.pathname.match(/Special:FilePath\/(.+)$/);
    if (specialMatch?.[1]) return decodeURIComponent(specialMatch[1]);

    return null;
  } catch {
    return null;
  }
}

function isWikimediaUrl(url: string): boolean {
  return url.includes("wikimedia.org");
}

async function attemptWikimediaRepair(url: string): Promise<string | null> {
  const filename = extractWikimediaFilename(url);
  if (!filename) return null;

  // Strip extension for a cleaner search
  const basename = filename.replace(/\.[^.]+$/, "").replace(/_/g, " ");

  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(basename)}&srnamespace=6&srlimit=5&format=json`;
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (url-repair)" },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      query?: { search?: { title: string }[] };
    };
    const results = data?.query?.search ?? [];

    // Only auto-repair when there is exactly one result (unambiguous)
    if (results.length !== 1) return null;

    const newFilename = results[0]!.title.replace(/^File:/, "").replace(/ /g, "_");
    const candidateUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(newFilename)}`;

    // Verify the candidate resolves to a real image
    const verify = await fetch(candidateUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (url-repair)" },
    });

    return verify.ok ? candidateUrl : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Database update helpers
// ─────────────────────────────────────────────────────────────────────────────

async function repairUrl(record: UrlRecord, newUrl: string): Promise<void> {
  if (record.isGallery && record.galleryIndex !== undefined) {
    // Fetch the current gallery JSON, update the specific entry, write back
    const raw = await fetchGalleryField(record.model, record.recordId, record.field);
    if (!raw) return;
    const gallery = parseGallery(raw);
    if (record.galleryIndex >= gallery.length) return;
    gallery[record.galleryIndex]!.url = newUrl;
    await updateField(record.model, record.recordId, "galleryImages", JSON.stringify(gallery));
  } else {
    await updateField(record.model, record.recordId, record.field, newUrl);
  }
}

async function fetchGalleryField(model: string, id: string, _field: string): Promise<string | null> {
  switch (model) {
    case "Waterway": {
      const r = await prisma.waterway.findUnique({ where: { id }, select: { galleryImages: true } });
      return r?.galleryImages ?? null;
    }
    case "Location": {
      const r = await prisma.location.findUnique({ where: { id }, select: { galleryImages: true } });
      return r?.galleryImages ?? null;
    }
    case "LessonPlan": {
      const r = await prisma.lessonPlan.findUnique({ where: { id }, select: { images: true } });
      return r?.images ?? null;
    }
    default:
      return null;
  }
}

async function updateField(model: string, id: string, field: string, value: string): Promise<void> {
  const data = { [field]: value };
  switch (model) {
    case "Waterway":            await prisma.waterway.update({ where: { id }, data }); break;
    case "Location":            await prisma.location.update({ where: { id }, data }); break;
    case "Explorer":            await prisma.explorer.update({ where: { id }, data }); break;
    case "LessonPlan":          await prisma.lessonPlan.update({ where: { id }, data }); break;
    case "TimelineEvent":       await prisma.timelineEvent.update({ where: { id }, data }); break;
    case "VirtualFieldTrip":    await prisma.virtualFieldTrip.update({ where: { id }, data }); break;
    case "FieldTripStop":       await prisma.fieldTripStop.update({ where: { id }, data }); break;
    case "PrimarySourceDocument": await prisma.primarySourceDocument.update({ where: { id }, data }); break;
    case "VoyageurJourney":     await prisma.voyageurJourney.update({ where: { id }, data }); break;
    case "JourneyNode":         await prisma.journeyNode.update({ where: { id }, data }); break;
    case "HistoricalEvent":     await prisma.historicalEvent.update({ where: { id }, data }); break;
    case "NotableFigure":       await prisma.notableFigure.update({ where: { id }, data }); break;
    // UserContribution and PrintableResource: never auto-repaired
    default: break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main run function
// ─────────────────────────────────────────────────────────────────────────────

export async function runImageHealthCheck(): Promise<void> {
  const startedAt = new Date();
  console.log(`[ImageHealthCheck] Starting at ${startedAt.toISOString()}`);

  let healthy = 0, broken = 0, rateLimited = 0, unreachable = 0, repaired = 0;

  try {
    const urlRecords = await collectUrls();
    console.log(`[ImageHealthCheck] Checking ${urlRecords.length} URLs across all models`);

    type LogEntry = {
      model: string;
      recordId: string;
      field: string;
      url: string;
      status: string;
      resolvedUrl: string | null;
    };
    const logs: LogEntry[] = [];

    for (const record of urlRecords) {
      const { status, httpCode } = await checkUrl(record.url);
      let finalStatus: UrlStatus = status;
      let resolvedUrl: string | undefined;

      if (status === "broken" && !record.isUgc && isWikimediaUrl(record.url)) {
        // Attempt Wikimedia auto-repair for non-UGC broken Wikimedia URLs
        const newUrl = await attemptWikimediaRepair(record.url);
        if (newUrl) {
          try {
            await repairUrl(record, newUrl);
            finalStatus = "repaired";
            resolvedUrl = newUrl;
            repaired++;
            console.log(`[ImageHealthCheck] Repaired ${record.model}/${record.recordId} [${record.field}]`);
            console.log(`  ${record.url}`);
            console.log(`  → ${newUrl}`);
          } catch (err) {
            console.error(`[ImageHealthCheck] Repair DB update failed: ${err}`);
            broken++;
          }
        } else {
          broken++;
          console.warn(`[ImageHealthCheck] BROKEN (no repair found): ${record.model}/${record.recordId} [${record.field}] HTTP ${httpCode}`);
        }
      } else {
        if (status === "healthy") healthy++;
        else if (status === "broken") broken++;
        else if (status === "rate_limited") rateLimited++;
        else unreachable++;

        if (status !== "healthy") {
          console.warn(`[ImageHealthCheck] ${status.toUpperCase()}: ${record.model}/${record.recordId} [${record.field}] HTTP ${httpCode}`);
        }
      }

      logs.push({
        model: record.model,
        recordId: record.recordId,
        field: record.field,
        url: record.url,
        status: finalStatus,
        resolvedUrl: resolvedUrl ?? null,
      });
    }

    // Batch-insert all log entries
    await prisma.imageHealthLog.createMany({ data: logs });

    // Prune logs older than 30 days to keep the table lean
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await prisma.imageHealthLog.deleteMany({ where: { checkedAt: { lt: thirtyDaysAgo } } });

    const elapsed = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
    console.log(
      `[ImageHealthCheck] Done in ${elapsed}s — ` +
      `healthy=${healthy} broken=${broken} repaired=${repaired} rate_limited=${rateLimited} unreachable=${unreachable}`
    );
  } catch (err) {
    console.error("[ImageHealthCheck] Unexpected error:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scheduler — call this once from index.ts at server startup
// ─────────────────────────────────────────────────────────────────────────────

export function scheduleImageHealthCheck(): void {
  const now = new Date();

  // Target: 02:00 local server time
  const next = new Date(now);
  next.setHours(2, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  const msUntilFirst = next.getTime() - now.getTime();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  console.log(`[ImageHealthCheck] First run scheduled for ${next.toISOString()}`);

  setTimeout(() => {
    runImageHealthCheck();
    setInterval(runImageHealthCheck, MS_PER_DAY);
  }, msUntilFirst);
}
