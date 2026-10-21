/**
 * source-pairs.ts — primary-source literacy (roadmap item 10, 2026-10-21).
 *
 * GET /api/source-pairs?kind&gradeLevel&userId  → { data: SourcePairSummary[] }
 * GET /api/source-pairs/:id                      → { data: SourcePairDetail }
 * A pair puts the passage a document first carried in the seed data (quoted, never checked) beside
 * the sentences as published in the edition the document now cites. The published side is the
 * document's live transcription; the edition is its citation of kind "edition". Public, read-only.
 * ?userId= is the student device id: the list is cut to the device's class content scope (10.27).
 */
import { Hono } from "hono";
import { db } from "../db";
import { applyScope, scopeForUser } from "../lib/content-scope";

const sourcePairsRouter = new Hono();

const KIND_LABELS: Record<string, string> = {
  not_in_source: "Not in the source",
  partly_in_source: "Partly in the source",
  paraphrase: "A paraphrase, not a quotation",
  number_changed: "A number that is not in the book",
  date_or_author: "Wrong date or wrong author",
  abbreviation: "An abbreviation standing for the sentence",
  confirmed: "Checked and confirmed",
  unverifiable: "No published edition to check against",
  no_such_document: "No such document exists",
};

async function editionFor(documentIds: string[]) {
  const cits = await db.citation.findMany({ where: { targetType: "document", targetId: { in: documentIds }, kind: "edition" }, orderBy: { sortOrder: "asc" } });
  const byDoc = new Map<string, { title: string; year: string | null; url: string | null }>();
  for (const c of cits) if (!byDoc.has(c.targetId)) byDoc.set(c.targetId, { title: c.title, year: c.year, url: c.url });
  return byDoc;
}

sourcePairsRouter.get("/", async (c) => {
  const kind = c.req.query("kind");
  const gradeLevel = c.req.query("gradeLevel");
  const scopeUserId = c.req.query("userId");
  const where: { isPublished: boolean; kind?: string; gradeLevel?: string } = { isPublished: true };
  if (kind) where.kind = kind;
  if (gradeLevel) where.gradeLevel = gradeLevel;
  const pairs = await db.sourcePair.findMany({ where, orderBy: [{ sortOrder: "asc" }] });
  const docs = await db.primarySourceDocument.findMany({
    where: { id: { in: pairs.map((p) => p.documentId) } },
    select: { id: true, title: true, author: true, originalYear: true, originalDate: true, transcription: true, imageUrl: true, gradeLevel: true },
  });
  const docById = new Map(docs.map((d) => [d.id, d]));
  const editions = await editionFor(pairs.map((p) => p.documentId));
  const rows = pairs.map((p) => {
    const d = docById.get(p.documentId);
    return {
      id: p.id, documentId: p.documentId, kind: p.kind, kindLabel: KIND_LABELS[p.kind] ?? p.kind, gradeLevel: p.gradeLevel, sortOrder: p.sortOrder,
      seedTitle: p.seedTitle, documentTitle: d?.title ?? p.seedTitle, author: d?.author ?? null, originalYear: d?.originalYear ?? null, originalDate: d?.originalDate ?? null,
      imageUrl: d?.imageUrl ?? null, hasPublishedText: !!d?.transcription, edition: editions.get(p.documentId) ?? null,
    };
  });
  return c.json({ data: applyScope(await scopeForUser(scopeUserId), rows) });
});

sourcePairsRouter.get("/kinds", (c) => c.json({ data: Object.entries(KIND_LABELS).map(([kind, label]) => ({ kind, label })) }));

sourcePairsRouter.get("/:id", async (c) => {
  const p = await db.sourcePair.findUnique({ where: { id: c.req.param("id") } });
  if (!p || !p.isPublished) return c.json({ error: { message: "Source pair not found", code: "NOT_FOUND" } }, 404);
  const d = await db.primarySourceDocument.findUnique({
    where: { id: p.documentId },
    select: { id: true, title: true, author: true, originalYear: true, originalDate: true, documentType: true, transcription: true, originalText: true, historicalContext: true, imageUrl: true, gradeLevel: true, explorerId: true },
  });
  const edition = (await editionFor([p.documentId])).get(p.documentId) ?? null;
  const checkedNote = d?.historicalContext?.match(/(?:Quotation c|C)hecked against[^]*$/)?.[0] ?? null;
  return c.json({
    data: {
      id: p.id, documentId: p.documentId, kind: p.kind, kindLabel: KIND_LABELS[p.kind] ?? p.kind, gradeLevel: p.gradeLevel, sortOrder: p.sortOrder,
      seedTitle: p.seedTitle, seedText: p.seedText, whatChanged: p.whatChanged, task: p.task,
      document: d ? { id: d.id, title: d.title, author: d.author, originalYear: d.originalYear, originalDate: d.originalDate, documentType: d.documentType, imageUrl: d.imageUrl, gradeLevel: d.gradeLevel, explorerId: d.explorerId } : null,
      publishedText: d?.transcription ?? null, publishedOriginalText: d?.originalText ?? null, checkedNote, edition,
    },
  });
});

export { sourcePairsRouter };
