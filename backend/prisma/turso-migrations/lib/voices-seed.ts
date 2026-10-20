// Shared seeding for narrations (2026-10-20 onward): a checked transcription of a primary source,
// read in a published edition, spotted where the words were written, linked to its explorer and
// waterway (and location when one exists), with context, vocabulary, questions and an edition
// citation. The per-region migration files are data only and call seedVoices().
//
// Rules (passes 13 and 15, and the read-aloud rules agreed 2026-10-20): only text read in the
// edition goes into `transcription`; OCR line-break hyphens joined and obvious scanner errors
// corrected; nothing added; omitted stretches marked [...]; one scene, about two minutes spoken.
// The `checked` note is appended to historicalContext, as the earlier passes did.
//
//   bun run <file> [--apply] [--only <id substring>] [--dump]
//   --dump prints the entries as JSON for the edition checker (scratchpad narr/check.py).
import { db } from "../../../src/db";
import { APPLY, writeBackup, report } from "./migration";

export interface VoiceEntry {
  id: string;
  title: string;
  documentType: "journal" | "report" | "letter" | "inscription" | "record";
  author: string;
  originalDate: string;
  originalYear: number;
  gradeLevel: "4-6" | "7-9" | "10-12";
  explorerId: string | null;
  waterwayId: string;
  locationId: string | null;
  spot: { latitude: number; longitude: number; name: string };
  transcription: string;
  originalText?: string;
  /** "Quotation checked against …", appended to historicalContext. */
  checked: string;
  historicalContext: string;
  vocabulary: { word: string; definition: string }[];
  discussionQuestions: string[];
  citation: { author?: string; title: string; publisher?: string; year?: string; url?: string; pages?: string };
  /** The local edition text file the checker reads (scratchpad narr/texts/<name>). */
  edition: string;
  /** Obvious scanner errors in the edition's OCR text, [as scanned, as printed], so the checker can match; not stored. */
  ocrFixes?: [string, string][];
  /** The edition reproduces 1690s typography, scanned with f for the long s; the checker folds both. Not stored. */
  longS?: boolean;
}

export async function seedVoices(name: string, entries: VoiceEntry[]): Promise<void> {
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1]?.toLowerCase() ?? null : null;
  const chosen = entries.filter((e) => !only || e.id.includes(only) || e.title.toLowerCase().includes(only));
  if (process.argv.includes("--dump")) { console.log(JSON.stringify(chosen, null, 1)); return; }

  const problems: string[] = [];
  const ids = new Set<string>();
  for (const e of chosen) {
    if (ids.has(e.id)) problems.push(`duplicate id ${e.id}`); ids.add(e.id);
    if (e.transcription.length < 120) problems.push(`${e.id}: transcription too short (${e.transcription.length})`);
    if (e.transcription.length > 2600) problems.push(`${e.id}: transcription over about two minutes (${e.transcription.length} characters)`);
    if (!e.checked.startsWith("Quotation checked against")) problems.push(`${e.id}: checked note must start "Quotation checked against"`);
    const [w, l, x] = await Promise.all([
      db.waterway.findUnique({ where: { id: e.waterwayId }, select: { name: true } }),
      e.locationId ? db.location.findUnique({ where: { id: e.locationId }, select: { name: true } }) : null,
      e.explorerId ? db.explorer.findUnique({ where: { id: e.explorerId }, select: { name: true } }) : null,
    ]);
    if (!w) problems.push(`${e.id}: waterway not found ${e.waterwayId}`);
    if (e.locationId && !l) problems.push(`${e.id}: location not found ${e.locationId}`);
    if (e.explorerId && !x) problems.push(`${e.id}: explorer not found ${e.explorerId}`);
  }
  const existing = await db.primarySourceDocument.findMany({ where: { id: { in: chosen.map((e) => e.id) } } });
  const backupFile = writeBackup(`${name}-before`, { existing });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report(name, { entries: chosen.length, existing: existing.length, backupFile, plan: chosen.map((e) => ({ id: e.id, title: e.title, waterway: e.waterwayId, spot: e.spot.name, chars: e.transcription.length })) });
  if (!APPLY) return;

  for (const e of chosen) {
    const data = {
      title: e.title, documentType: e.documentType, author: e.author, originalDate: e.originalDate, originalYear: e.originalYear,
      originalText: e.originalText ?? null, transcription: e.transcription, imageUrl: null, annotations: null,
      historicalContext: `${e.historicalContext}\n\n${e.checked}`,
      vocabulary: JSON.stringify(e.vocabulary), discussionQuestions: JSON.stringify(e.discussionQuestions),
      explorerId: e.explorerId, waterwayId: e.waterwayId, locationId: e.locationId, gradeLevel: e.gradeLevel,
      isPublished: true, isCore: false, visibility: "private", createdById: null,
      spotLatitude: e.spot.latitude, spotLongitude: e.spot.longitude, spotName: e.spot.name,
    };
    await db.primarySourceDocument.upsert({ where: { id: e.id }, create: { id: e.id, ...data }, update: data });
    const cite = { targetType: "document", targetId: e.id, sortOrder: 0, kind: "edition", author: e.citation.author ?? null, title: e.citation.title, publisher: e.citation.publisher ?? null, year: e.citation.year ?? null, pages: e.citation.pages ?? null, url: e.citation.url ?? null, accessed: "2026-10-20", note: "Edition against which the transcription was checked" };
    const have = await db.citation.findFirst({ where: { targetType: "document", targetId: e.id, kind: "edition" } });
    if (have) await db.citation.update({ where: { id: have.id }, data: cite });
    else await db.citation.create({ data: cite });
  }
  const verify = await db.primarySourceDocument.findMany({ where: { id: { in: chosen.map((e) => e.id) } }, select: { id: true, title: true, waterwayId: true, spotName: true } });
  const total = await db.primarySourceDocument.count({ where: { isPublished: true, transcription: { not: null }, spotLatitude: { not: null } } });
  report("verify", { written: verify, checkedTranscriptionsWithSpot: total });
}
