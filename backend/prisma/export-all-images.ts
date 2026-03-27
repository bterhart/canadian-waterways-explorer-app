import { prisma } from "../src/prisma";
import { writeFileSync } from "fs";

// CSV helpers
function csvEscape(val: string | null | undefined): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(
  table: string,
  id: string,
  name: string,
  field: string,
  is_hero: boolean,
  url: string,
  caption: string,
  credit: string
): string {
  return [table, id, name, field, is_hero ? "true" : "false", url, caption, credit]
    .map(csvEscape)
    .join(",");
}

function parseJsonImages(raw: string | null): Array<{ url: string; caption?: string; credit?: string }> {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: any) => item && item.url);
  } catch {
    return [];
  }
}

async function main() {
  const rows: string[] = [];
  const header = "table,id,name,field,is_hero,url,caption,credit";
  rows.push(header);

  // ── 1. Waterway ──────────────────────────────────────────────────────────
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: "asc" },
  });
  for (const w of waterways) {
    if (w.imageUrl) {
      rows.push(row("Waterway", w.id, w.name, "imageUrl", true, w.imageUrl, "", ""));
    }
    for (const img of parseJsonImages(w.galleryImages)) {
      rows.push(row("Waterway", w.id, w.name, "galleryImages", false, img.url, img.caption ?? "", img.credit ?? ""));
    }
  }

  // ── 2. Location ───────────────────────────────────────────────────────────
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
    orderBy: { name: "asc" },
  });
  for (const l of locations) {
    if (l.imageUrl) {
      rows.push(row("Location", l.id, l.name, "imageUrl", true, l.imageUrl, "", ""));
    }
    for (const img of parseJsonImages(l.galleryImages)) {
      rows.push(row("Location", l.id, l.name, "galleryImages", false, img.url, img.caption ?? "", img.credit ?? ""));
    }
  }

  // ── 3. Explorer ───────────────────────────────────────────────────────────
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
  });
  for (const e of explorers) {
    if (e.imageUrl) {
      rows.push(row("Explorer", e.id, e.name, "imageUrl", true, e.imageUrl, "", ""));
    }
  }

  // ── 4. UserContribution ───────────────────────────────────────────────────
  const contributions = await prisma.userContribution.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { createdAt: "asc" },
  });
  for (const c of contributions) {
    if (c.imageUrl) {
      rows.push(row("UserContribution", c.id, c.title, "imageUrl", true, c.imageUrl, "", ""));
    }
  }

  // ── 5. LessonPlan ─────────────────────────────────────────────────────────
  const lessons = await prisma.lessonPlan.findMany({
    select: { id: true, title: true, heroImageUrl: true, images: true },
    orderBy: { title: "asc" },
  });
  for (const l of lessons) {
    if (l.heroImageUrl) {
      rows.push(row("LessonPlan", l.id, l.title, "heroImageUrl", true, l.heroImageUrl, "", ""));
    }
    for (const img of parseJsonImages(l.images)) {
      rows.push(row("LessonPlan", l.id, l.title, "images", false, img.url, img.caption ?? "", img.credit ?? ""));
    }
  }

  // ── 6. TimelineEvent ──────────────────────────────────────────────────────
  const timelineEvents = await prisma.timelineEvent.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { year: "asc" },
  });
  for (const t of timelineEvents) {
    if (t.imageUrl) {
      rows.push(row("TimelineEvent", t.id, t.title, "imageUrl", true, t.imageUrl, "", ""));
    }
  }

  // ── 7. VirtualFieldTrip ───────────────────────────────────────────────────
  const fieldTrips = await prisma.virtualFieldTrip.findMany({
    select: { id: true, title: true, coverImageUrl: true },
    orderBy: { title: "asc" },
  });
  for (const ft of fieldTrips) {
    if (ft.coverImageUrl) {
      rows.push(row("VirtualFieldTrip", ft.id, ft.title, "coverImageUrl", true, ft.coverImageUrl, "", ""));
    }
  }

  // ── 8. FieldTripStop ──────────────────────────────────────────────────────
  const stops = await prisma.fieldTripStop.findMany({
    select: { id: true, title: true, imageUrl: true, tripId: true, trip: { select: { title: true } } },
    orderBy: { orderIndex: "asc" },
  });
  for (const s of stops) {
    if (s.imageUrl) {
      const name = `${s.trip.title} > ${s.title}`;
      rows.push(row("FieldTripStop", s.id, name, "imageUrl", true, s.imageUrl, "", ""));
    }
  }

  // ── 9. PrimarySourceDocument ──────────────────────────────────────────────
  const documents = await prisma.primarySourceDocument.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { title: "asc" },
  });
  for (const d of documents) {
    if (d.imageUrl) {
      rows.push(row("PrimarySourceDocument", d.id, d.title, "imageUrl", true, d.imageUrl, "", ""));
    }
  }

  // ── 10. PrintableResource ─────────────────────────────────────────────────
  const printables = await prisma.printableResource.findMany({
    select: { id: true, title: true, previewImageUrl: true },
    orderBy: { title: "asc" },
  });
  for (const p of printables) {
    if (p.previewImageUrl) {
      rows.push(row("PrintableResource", p.id, p.title, "previewImageUrl", true, p.previewImageUrl, "", ""));
    }
  }

  // ── 11. VoyageurJourney ───────────────────────────────────────────────────
  const journeys = await prisma.voyageurJourney.findMany({
    select: { id: true, title: true, coverImageUrl: true },
    orderBy: { title: "asc" },
  });
  for (const j of journeys) {
    if (j.coverImageUrl) {
      rows.push(row("VoyageurJourney", j.id, j.title, "coverImageUrl", true, j.coverImageUrl, "", ""));
    }
  }

  // ── 12. JourneyNode ───────────────────────────────────────────────────────
  const nodes = await prisma.journeyNode.findMany({
    select: { id: true, title: true, imageUrl: true, journeyId: true, journey: { select: { title: true } } },
    orderBy: { orderIndex: "asc" },
  });
  for (const n of nodes) {
    if (n.imageUrl) {
      const name = `${n.journey.title} > ${n.title ?? "(node)"}`;
      rows.push(row("JourneyNode", n.id, name, "imageUrl", true, n.imageUrl, "", ""));
    }
  }

  // ── 13. HistoricalEvent ───────────────────────────────────────────────────
  const historicalEvents = await prisma.historicalEvent.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { year: "asc" },
  });
  for (const h of historicalEvents) {
    if (h.imageUrl) {
      rows.push(row("HistoricalEvent", h.id, h.title, "imageUrl", true, h.imageUrl, "", ""));
    }
  }

  // ── 14. NotableFigure ─────────────────────────────────────────────────────
  const figures = await prisma.notableFigure.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
  });
  for (const f of figures) {
    if (f.imageUrl) {
      rows.push(row("NotableFigure", f.id, f.name, "imageUrl", true, f.imageUrl, "", ""));
    }
  }

  // ── Write CSV ─────────────────────────────────────────────────────────────
  const output = rows.join("\n");
  const outPath = "prisma/image-export.csv";
  writeFileSync(outPath, output, "utf8");

  console.log(`\nCSV written to: ${outPath}`);
  console.log(`Total rows (excl. header): ${rows.length - 1}`);

  // Summary by table
  const counts: Record<string, number> = {};
  for (const r of rows.slice(1)) {
    const table = r.split(",")[0] ?? "unknown";
    counts[table] = (counts[table] ?? 0) + 1;
  }
  console.log("\nRows per table:");
  for (const [t, c] of Object.entries(counts).sort()) {
    console.log(`  ${t}: ${c}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
