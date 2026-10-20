/**
 * citations.ts — structured sources for a record (roadmap item 14, 2026-10-19).
 *
 * GET /api/citations/:targetType/:targetId
 *     → { data: { citations: [...rows with `text`], recordCitation: {...}, recordText } }
 * GET /api/citations/:targetType/:targetId/export?format=bibtex|ris|csv|text
 *     → the citations as a text body in that format (Content-Disposition attachment)
 * targetType: waterway | location | explorer | notable_figure | document | discovery | historical_map | knowledge_given
 */
import { Hono } from "hono";
import { db } from "../db";
import { EXPORT_FORMATS, formatText, getCitations, isCitationTargetType, recordCitation, type CitationTargetType, type ExportFormat } from "../lib/citations";

const citationsRouter = new Hono();

async function recordTitle(targetType: CitationTargetType, id: string): Promise<string | null> {
  switch (targetType) {
    case "waterway": return (await db.waterway.findUnique({ where: { id }, select: { name: true } }))?.name ?? null;
    case "location": return (await db.location.findUnique({ where: { id }, select: { name: true } }))?.name ?? null;
    case "explorer": return (await db.explorer.findUnique({ where: { id }, select: { name: true } }))?.name ?? null;
    case "notable_figure": return (await db.notableFigure.findUnique({ where: { id }, select: { name: true } }))?.name ?? null;
    case "document": return (await db.primarySourceDocument.findUnique({ where: { id }, select: { title: true } }))?.title ?? null;
    case "discovery": return (await db.archaeologicalDiscovery.findUnique({ where: { id }, select: { name: true } }))?.name ?? null;
    case "historical_map": return (await db.historicalMap.findUnique({ where: { id }, select: { title: true } }))?.title ?? null;
    case "knowledge_given": return (await db.knowledgeGiven.findUnique({ where: { id }, select: { title: true } }))?.title ?? null;
  }
}

citationsRouter.get("/:targetType/:targetId", async (c) => {
  const targetType = c.req.param("targetType"); const targetId = c.req.param("targetId");
  if (!isCitationTargetType(targetType)) return c.json({ error: { message: "Unknown target type", code: "BAD_REQUEST" } }, 400);
  const title = await recordTitle(targetType, targetId);
  if (!title) return c.json({ error: { message: "Record not found", code: "NOT_FOUND" } }, 404);
  const rows = await getCitations(targetType, targetId);
  const record = recordCitation(targetType, title);
  // The app's client unwraps JSON only, so the export texts ride along here for the share sheet;
  // the /export route below serves the same texts as downloadable files.
  const all = [...rows, record];
  return c.json({ data: { citations: rows.map((r) => ({ ...r, text: formatText(r) })), recordCitation: { ...record, text: formatText(record) }, exports: { bibtex: EXPORT_FORMATS.bibtex.fn(all), ris: EXPORT_FORMATS.ris.fn(all), text: EXPORT_FORMATS.text.fn(all) } } });
});

citationsRouter.get("/:targetType/:targetId/export", async (c) => {
  const targetType = c.req.param("targetType"); const targetId = c.req.param("targetId");
  const format = (c.req.query("format") ?? "bibtex") as ExportFormat;
  if (!isCitationTargetType(targetType)) return c.json({ error: { message: "Unknown target type", code: "BAD_REQUEST" } }, 400);
  if (!(format in EXPORT_FORMATS)) return c.json({ error: { message: "Unknown format", code: "BAD_REQUEST" } }, 400);
  const title = await recordTitle(targetType, targetId);
  if (!title) return c.json({ error: { message: "Record not found", code: "NOT_FOUND" } }, 404);
  const rows = await getCitations(targetType, targetId);
  const body = EXPORT_FORMATS[format].fn(c.req.query("includeRecord") === "0" ? rows : [...rows, recordCitation(targetType, title)]);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || targetId;
  c.header("Content-Type", `${EXPORT_FORMATS[format].mime}; charset=utf-8`);
  c.header("Content-Disposition", `attachment; filename="${slug}-sources.${EXPORT_FORMATS[format].ext}"`);
  return c.body(body);
});

export { citationsRouter };
