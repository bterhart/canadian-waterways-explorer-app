/**
 * decades.ts — "who was here in this decade" (roadmap item 1, 2026-10-19).
 *
 * GET /api/decades            → { data: [{ decade, visits, explorers, locations, expeditions, events, documents }] }
 * GET /api/decades/:decade    → { data: { decade, explorers: [{ explorer, visits: [{ year, notes, waterway }] }],
 *                                locations, expeditions, events (with explorer/waterway/location refs), documents,
 *                                waterwayIds } }
 * The decade is its first year (1790 for the 1790s). Everything comes from the year columns the
 * records already carry: ExplorerWaterway.yearExplored, Location.yearEstablished, Expedition
 * start/end, TimelineEvent.year and PrimarySourceDocument.originalYear.
 */
import { Hono } from "hono";
import { getDecade, listDecades } from "../lib/connections";
import { attachRelated, loadRelated } from "../lib/related";

const decadesRouter = new Hono();

decadesRouter.get("/", async (c) => {
  return c.json({ data: await listDecades() });
});

decadesRouter.get("/:decade", async (c) => {
  const decade = Number(c.req.param("decade"));
  if (!Number.isInteger(decade) || decade % 10 !== 0 || decade < 900 || decade > 2100) {
    return c.json({ error: { message: "decade must be a year ending in 0, e.g. 1790", code: "BAD_REQUEST" } }, 400);
  }
  const slice = await getDecade(decade);
  const maps = await loadRelated({
    explorerIds: slice.events.map((e) => e.explorerId),
    waterwayIds: slice.events.map((e) => e.waterwayId),
    locationIds: slice.events.map((e) => e.locationId),
  });
  return c.json({ data: { ...slice, events: slice.events.map((e) => attachRelated(e, maps)) } });
});

export { decadesRouter };
