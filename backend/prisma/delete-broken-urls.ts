import { prisma } from "../src/prisma";
import { readFileSync } from "fs";

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let inQuote = false;
  let current = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"' && !inQuote) { inQuote = true; continue; }
    if (ch === '"' && inQuote) {
      if (line[i + 1] === '"') { current += '"'; i++; continue; }
      inQuote = false; continue;
    }
    if (ch === "," && !inQuote) { fields.push(current); current = ""; continue; }
    current += ch;
  }
  fields.push(current);
  return fields;
}

async function main() {
  const raw = readFileSync("prisma/image-test-results.csv", "utf-8");
  const lines = raw.split("\n").filter(l => l.trim().length > 0);

  // Collect all NOT_FOUND entries
  type BrokenEntry = { table: string; id: string; name: string; field: string; url: string };
  const broken: BrokenEntry[] = [];

  for (const line of lines.slice(1)) {
    const f = parseCsvRow(line);
    const table  = f[0] ?? "";
    const id     = f[1] ?? "";
    const name   = f[2] ?? "";
    const field  = f[3] ?? "";
    const url    = f[5] ?? "";
    const status = f[9] ?? "";
    if (status === "NOT_FOUND") {
      broken.push({ table, id, name, field, url });
    }
  }

  console.log(`Found ${broken.length} NOT_FOUND entries to remove.\n`);

  let removed = 0;

  for (const entry of broken) {
    console.log(`[${entry.table}] "${entry.name}" | ${entry.field}`);
    console.log(`  URL: ${entry.url}`);

    try {
      if (entry.field === "imageUrl" || entry.field === "heroImageUrl" || entry.field === "coverImageUrl" || entry.field === "previewImageUrl") {
        // Set image field to NULL
        if (entry.table === "Waterway") {
          await prisma.waterway.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "Location") {
          await prisma.location.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "Explorer") {
          await prisma.explorer.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "UserContribution") {
          await prisma.userContribution.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "FieldTripStop") {
          await prisma.fieldTripStop.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "VirtualFieldTrip") {
          await prisma.virtualFieldTrip.update({ where: { id: entry.id }, data: { coverImageUrl: null } });
        } else if (entry.table === "LessonPlan") {
          await prisma.lessonPlan.update({ where: { id: entry.id }, data: { heroImageUrl: null } });
        } else if (entry.table === "PrintableResource") {
          await prisma.printableResource.update({ where: { id: entry.id }, data: { previewImageUrl: null } });
        } else if (entry.table === "VoyageurJourney") {
          await prisma.voyageurJourney.update({ where: { id: entry.id }, data: { coverImageUrl: null } });
        } else if (entry.table === "JourneyNode") {
          await prisma.journeyNode.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "HistoricalEvent") {
          await prisma.historicalEvent.update({ where: { id: entry.id }, data: { imageUrl: null } });
        } else if (entry.table === "NotableFigure") {
          await prisma.notableFigure.update({ where: { id: entry.id }, data: { imageUrl: null } });
        }
        console.log(`  → imageUrl set to NULL`);
        removed++;

      } else if (entry.field === "galleryImages" || entry.field === "images") {
        // Remove specific URL from JSON array
        let current: any[] = [];
        if (entry.table === "Waterway") {
          const rec = await prisma.waterway.findUnique({ where: { id: entry.id }, select: { galleryImages: true } });
          try { current = JSON.parse(rec?.galleryImages as string ?? "[]"); } catch {}
          const filtered = current.filter((g: any) => g.url !== entry.url);
          await prisma.waterway.update({ where: { id: entry.id }, data: { galleryImages: JSON.stringify(filtered) } });
        } else if (entry.table === "Location") {
          const rec = await prisma.location.findUnique({ where: { id: entry.id }, select: { galleryImages: true } });
          try { current = JSON.parse(rec?.galleryImages as string ?? "[]"); } catch {}
          const filtered = current.filter((g: any) => g.url !== entry.url);
          await prisma.location.update({ where: { id: entry.id }, data: { galleryImages: JSON.stringify(filtered) } });
        } else if (entry.table === "LessonPlan") {
          const rec = await prisma.lessonPlan.findUnique({ where: { id: entry.id }, select: { images: true } });
          try { current = JSON.parse(rec?.images as string ?? "[]"); } catch {}
          const filtered = current.filter((g: any) => g.url !== entry.url);
          await prisma.lessonPlan.update({ where: { id: entry.id }, data: { images: JSON.stringify(filtered) } });
        }
        const before = current.length;
        console.log(`  → Removed from ${entry.field} array (was ${before} items)`);
        removed++;
      }
    } catch (e) {
      console.log(`  ERROR: ${e}`);
    }
  }

  console.log(`\n========= DONE =========`);
  console.log(`Removed: ${removed} / ${broken.length} entries`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
