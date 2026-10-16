// Move the two static reading-guide files shipped in the app into the ReadingGuide
// table (decision 12, 2026-10-16). Dry run by default; --apply writes.
//
//   bun run prisma/turso-migrations/2026-10-16-import-reading-guides.ts            # report only
//   bun run prisma/turso-migrations/2026-10-16-import-reading-guides.ts --apply    # insert
//
// What it does:
//   1. Reads mobile/src/data/locationReadingGuideData.ts (155 keys: waterway and
//      location ids) and readingGuideData.ts (92 explorer ids).
//   2. Resolves every key against live Turso. Four keys resolve to nothing; they are
//      remapped by the place their entries describe (see DEAD_KEYS).
//   3. Repairs the truncation defect in the static files: roughly 250 fields were cut
//      at an apostrophe when the files were generated ("Hudson's Bay Company Archives"
//      survived as "Hudson\\"). Confident restorations are listed in RESTORE; every
//      other truncated field keeps its text up to the cut, trailing backslashes and
//      dangling "(" fragments removed, and is counted in the report.
//   4. Assigns a reading band from the source type (RULES below) so grade gaps can be
//      measured. This is a heuristic the owner can override per row.
//   5. Writes a JSON backup of every row it would insert, then (with --apply) inserts
//      them with deterministic ids. A rerun skips targets that already have rows.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { locationReadingGuideData } from "../../../mobile/src/data/locationReadingGuideData";
import { readingGuideData } from "../../../mobile/src/data/readingGuideData";

const APPLY = process.argv.includes("--apply");
const BACKUP_DIR = resolve(import.meta.dir, "backups");
const BACKUP_FILE = resolve(BACKUP_DIR, "2026-10-16-reading-guides-import.json");

type TargetType = "waterway" | "location" | "explorer";
interface StaticEntry {
  authorSource?: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  description?: string;
}
interface Row {
  id: string;
  targetType: TargetType;
  targetId: string;
  sortOrder: number;
  title: string;
  authorSource: string | null;
  publisher: string | null;
  year: string | null;
  url: string | null;
  description: string | null;
  gradeLevel: string | null;
}

// Keys in the static file that match no live row, remapped by the place they describe.
const DEAD_KEYS: Record<string, { locationName: string }> = {
  cmlhbjrrri0017m2mbfts7d8is: { locationName: "Fort Simpson" },
  cmlhcpxjz0007m2a3yptljq2u: { locationName: "Oxford House" },
  cmlhcpxk7000dm2a3aywic3h2: { locationName: "Fort Edmonton (HBC)" },
  cmlhcpxka000dm2a3aywic3h2: { locationName: "Rocky Mountain House (NWC)" },
};

// Truncated value (after the backslashes are stripped) → the full text it was cut from.
// Only titles and publishers whose completion is unambiguous are restored.
const RESTORE: Record<string, string> = {
  "Hudson": "Hudson's Bay Company Archives", // authorSource only (see repairField)
  "McGill-Queen": "McGill-Queen's University Press",
  "Canadian Museum of Civilization / McGill-Queen": "Canadian Museum of Civilization / McGill-Queen's University Press",
  "The People of Denendeh: Ethnohistory of the Indians of Canada":
    "The People of Denendeh: Ethnohistory of the Indians of Canada's Northwest Territories",
  "A Journey from Prince of Wales": "A Journey from Prince of Wales's Fort in Hudson's Bay to the Northern Ocean",
  "Lady Franklin": "Lady Franklin's Revenge",
  "History of the Hudson": "History of the Hudson's Bay Company",
  "The History of the Hudson": "The History of the Hudson's Bay Company",
  "David Thompson": "David Thompson's Narrative of His Explorations in Western America, 1784-1812",
  "The Mapmaker": "The Mapmaker's Eye: David Thompson on the Columbia Plateau",
  "Fort Qu": "Fort Qu'Appelle",
  "Fort St. James / Nak": "Fort St. James / Nak'azdli",
  "Fort Kamloops / Tk": "Fort Kamloops / Tk'emlúps",
  "Ancient Mariner: The Amazing Adventures of Samuel Hearne the Sailor Who Inspired Coleridge":
    "Ancient Mariner: The Amazing Adventures of Samuel Hearne, the Sailor Who Inspired Coleridge's Rime of the Ancient Mariner",
  "The North West Passage: Being the Record of a Voyage of Exploration of the Ship":
    "The North West Passage: Being the Record of a Voyage of Exploration of the Ship 'Gjøa' 1903-1907",
};
// The publisher "Hudson" is the Hudson's Bay Record Society (E. E. Rich's company history).
const RESTORE_PUBLISHER_HUDSON = "Hudson's Bay Record Society";

const stats = {
  entriesRead: 0,
  rowsPlanned: 0,
  truncatedFields: 0,
  restoredFields: 0,
  trimmedFields: 0,
  droppedEntries: [] as string[],
  deadKeysRemapped: [] as string[],
  unresolvedKeys: [] as string[],
  skippedExisting: [] as string[],
  trimmedSamples: [] as string[],
  duplicatesSkipped: 0,
};

/** Same repair as repairField, without touching the counters (used for the duplicate check). */
function repairFieldQuiet(value: string | undefined): string | null {
  if (value === undefined) return null;
  const v = value.trim().replace(/\\+$/, "").trim();
  return v === "Hudson" ? RESTORE["Hudson"]! : v || null;
}

function repairField(field: keyof StaticEntry, value: string | undefined): string | null {
  if (value === undefined) return null;
  let v = value.trim();
  if (!/\\+$/.test(v)) return v || null;
  stats.truncatedFields++;
  v = v.replace(/\\+$/, "").trim();
  if (field === "authorSource" && v === "Hudson") { stats.restoredFields++; return RESTORE["Hudson"]!; }
  if (field === "publisher" && v === "Hudson") { stats.restoredFields++; return RESTORE_PUBLISHER_HUDSON; }
  if ((field === "title" || field === "publisher") && RESTORE[v]) { stats.restoredFields++; return RESTORE[v]!; }
  // Fragment: drop a dangling "(" clause and trailing separators
  const open = v.lastIndexOf("(");
  if (open !== -1 && v.indexOf(")", open) === -1) v = v.slice(0, open).trim();
  v = v.replace(/[\s,:;/-]+$/, "").trim();
  stats.trimmedFields++;
  if (stats.trimmedSamples.length < 12) stats.trimmedSamples.push(`${field}: "${v}"`);
  return v || null;
}

// Reading band from the kind of source. Scholarly editions and archival series read at
// the senior level; encyclopedias, Parks Canada and Wikipedia at the intermediate level.
const RULES: Array<{ test: (e: StaticEntry) => boolean; band: string }> = [
  { test: (e) => /wikipedia|canadian encyclopedia|parks canada|historic site|museum|heritage/i.test(`${e.authorSource ?? ""} ${e.publisher ?? ""} ${e.url ?? ""}`), band: "7-9" },
  { test: () => true, band: "10-12" },
];
const bandFor = (e: StaticEntry): string => RULES.find((r) => r.test(e))!.band;

async function main() {
  const [waterways, locations, explorers] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.location.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }),
  ]);
  const wwIds = new Set(waterways.map((w) => w.id));
  const locIds = new Set(locations.map((l) => l.id));
  const exIds = new Set(explorers.map((e) => e.id));
  const locByName = new Map(locations.map((l) => [l.name, l.id]));

  const planned = new Map<string, Row[]>(); // `${type}:${id}` → rows

  const add = (targetType: TargetType, targetId: string, entries: StaticEntry[]) => {
    const key = `${targetType}:${targetId}`;
    const existing = planned.get(key) ?? [];
    // Two sources often share a title ("Fort Qu'Appelle" in both Wikipedia and The Canadian
    // Encyclopedia), so a duplicate is the same title AND the same source AND the same url.
    const fingerprint = (r: { title: string; authorSource: string | null; url: string | null }) =>
      `${r.title}|${r.authorSource ?? ""}|${r.url ?? ""}`;
    const seen = new Set(existing.map(fingerprint));
    for (const entry of entries) {
      stats.entriesRead++;
      const title = repairField("title", entry.title);
      if (!title) { stats.droppedEntries.push(`${key} (empty title: ${JSON.stringify(entry).slice(0, 80)})`); continue; }
      const candidate = { title, authorSource: repairFieldQuiet(entry.authorSource), url: entry.url?.trim() ?? null };
      if (seen.has(fingerprint(candidate))) { stats.duplicatesSkipped++; continue; }
      seen.add(fingerprint(candidate));
      const sortOrder = existing.length;
      existing.push({
        id: `rg_${targetType}_${targetId}_${sortOrder}`,
        targetType,
        targetId,
        sortOrder,
        title,
        authorSource: repairField("authorSource", entry.authorSource),
        publisher: repairField("publisher", entry.publisher),
        year: repairField("year", entry.year),
        url: repairField("url", entry.url),
        description: repairField("description", entry.description),
        gradeLevel: bandFor(entry),
      });
    }
    planned.set(key, existing);
  };

  for (const [key, entries] of Object.entries(locationReadingGuideData as Record<string, StaticEntry[]>)) {
    if (wwIds.has(key)) add("waterway", key, entries);
    else if (locIds.has(key)) add("location", key, entries);
    else if (DEAD_KEYS[key]) {
      const id = locByName.get(DEAD_KEYS[key]!.locationName);
      if (!id) { stats.unresolvedKeys.push(`${key} → ${DEAD_KEYS[key]!.locationName} (no such location)`); continue; }
      stats.deadKeysRemapped.push(`${key} → ${DEAD_KEYS[key]!.locationName} (${id})`);
      add("location", id, entries);
    } else stats.unresolvedKeys.push(key);
  }
  for (const [key, entries] of Object.entries(readingGuideData as Record<string, StaticEntry[]>)) {
    if (exIds.has(key)) add("explorer", key, entries);
    else stats.unresolvedKeys.push(`explorer ${key}`);
  }

  // Skip targets that already hold rows (idempotent rerun)
  const existingRows = await db.readingGuide.findMany({ select: { targetType: true, targetId: true } });
  const existingKeys = new Set(existingRows.map((r) => `${r.targetType}:${r.targetId}`));
  const rows: Row[] = [];
  for (const [key, list] of planned) {
    if (existingKeys.has(key)) { stats.skippedExisting.push(key); continue; }
    rows.push(...list);
  }
  stats.rowsPlanned = rows.length;

  const byType = rows.reduce<Record<string, number>>((m, r) => ((m[r.targetType] = (m[r.targetType] ?? 0) + 1), m), {});
  const byBand = rows.reduce<Record<string, number>>((m, r) => ((m[r.gradeLevel ?? "null"] = (m[r.gradeLevel ?? "null"] ?? 0) + 1), m), {});
  const targetsCovered = { waterway: new Set<string>(), location: new Set<string>(), explorer: new Set<string>() };
  for (const r of rows) targetsCovered[r.targetType].add(r.targetId);

  // The backup is the exact row set inserted; a no-op rerun must not overwrite it.
  if (rows.length > 0) {
    mkdirSync(BACKUP_DIR, { recursive: true });
    writeFileSync(BACKUP_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), stats, rows }, null, 1));
  }

  console.log(JSON.stringify({
    mode: APPLY ? "APPLY" : "DRY RUN",
    ...stats,
    rowsByTargetType: byType,
    rowsByGradeBand: byBand,
    targetsCovered: { waterway: targetsCovered.waterway.size, location: targetsCovered.location.size, explorer: targetsCovered.explorer.size },
    waterwaysWithoutGuide: waterways.filter((w) => !targetsCovered.waterway.has(w.id) && !existingKeys.has(`waterway:${w.id}`)).map((w) => w.name),
    locationsWithoutGuide: locations.filter((l) => !targetsCovered.location.has(l.id) && !existingKeys.has(`location:${l.id}`)).map((l) => l.name),
    explorersWithoutGuide: explorers.filter((e) => !targetsCovered.explorer.has(e.id) && !existingKeys.has(`explorer:${e.id}`)).map((e) => e.name),
    backup: BACKUP_FILE,
  }, null, 1));

  if (!APPLY) { console.log("\nDry run only. Re-run with --apply to insert."); return; }

  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    await db.readingGuide.createMany({ data: rows.slice(i, i + BATCH) });
  }
  const after = await db.readingGuide.count();
  console.log(`\nInserted ${rows.length}; ReadingGuide now holds ${after} rows.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => db.$disconnect());
