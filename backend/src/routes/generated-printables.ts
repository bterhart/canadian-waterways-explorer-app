/**
 * generated-printables.ts — printables made from the live data (roadmap item 13, 2026-10-21).
 *
 * GET /api/generated-printables/options                                  → the pickers' choices
 * GET /api/generated-printables/blank-map?waterwayId&labels=blank|numbered|named
 * GET /api/generated-printables/timeline-strip?waterwayId|explorerId|theme&startYear&endYear&blank=1
 * GET /api/generated-printables/pronunciation-cards?language&termType&waterwayId
 * Each returns { data: { title, html } }: a complete HTML document the app previews and prints.
 * Public, read-only; nothing is stored.
 */
import { Hono, type Context } from "hono";
import { blankMap, pronunciationCards, printableOptions, timelineStrip, type MapLabels } from "../lib/generated-printables";

const generatedPrintablesRouter = new Hono();

const notFound = (c: Context, message: string) => c.json({ error: { message, code: "NOT_FOUND" } }, 404);
const intOrUndefined = (v: string | undefined) => { const n = v ? parseInt(v, 10) : NaN; return Number.isFinite(n) ? n : undefined; };

generatedPrintablesRouter.get("/options", async (c) => c.json({ data: await printableOptions() }));

generatedPrintablesRouter.get("/blank-map", async (c) => {
  const waterwayId = c.req.query("waterwayId");
  if (!waterwayId) return c.json({ error: { message: "waterwayId is required", code: "BAD_REQUEST" } }, 400);
  const labelsParam = c.req.query("labels") ?? "numbered";
  const labels: MapLabels = labelsParam === "blank" || labelsParam === "named" ? labelsParam : "numbered";
  const result = await blankMap(waterwayId, labels);
  return result ? c.json({ data: result }) : notFound(c, "No drawn geometry for this water");
});

generatedPrintablesRouter.get("/timeline-strip", async (c) => {
  const result = await timelineStrip(
    { waterwayId: c.req.query("waterwayId") || undefined, explorerId: c.req.query("explorerId") || undefined, theme: c.req.query("theme") || undefined, startYear: intOrUndefined(c.req.query("startYear")), endYear: intOrUndefined(c.req.query("endYear")) },
    c.req.query("blank") === "1" || c.req.query("blank") === "true",
  );
  return result ? c.json({ data: result }) : notFound(c, "No timeline events match");
});

generatedPrintablesRouter.get("/pronunciation-cards", async (c) => {
  const result = await pronunciationCards({ language: c.req.query("language") || undefined, termType: c.req.query("termType") || undefined, waterwayId: c.req.query("waterwayId") || undefined });
  return result ? c.json({ data: result }) : notFound(c, "No pronunciation terms match");
});

export { generatedPrintablesRouter };
