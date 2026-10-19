/**
 * historical-maps.ts — the cartography gallery (roadmap item 15, 2026-10-19).
 *
 * GET /api/historical-maps          → { data: [{ id, title, mapmaker, mapmakerNation, year, yearLabel,
 *                                     region, imageUrl, imageCredit, hasBounds }] } oldest first
 * GET /api/historical-maps/:id      → { data: { ...map, bounds | null, relatedWaterways: [{id,name}],
 *                                     relatedExplorers: [{id,name}], cartographer | null, citations } }
 */
import { Hono } from "hono";
import { db } from "../db";
import { formatText, getCitations } from "../lib/citations";

const historicalMapsRouter = new Hono();

const parseIds = (value: string | null): string[] => {
  if (!value) return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []; } catch { return []; }
};

historicalMapsRouter.get("/", async (c) => {
  const rows = await db.historicalMap.findMany({
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
    select: { id: true, title: true, mapmaker: true, mapmakerNation: true, year: true, yearLabel: true, region: true, imageUrl: true, imageCredit: true, boundsSwLat: true },
  });
  return c.json({ data: rows.map(({ boundsSwLat, ...r }) => ({ ...r, hasBounds: boundsSwLat !== null })) });
});

historicalMapsRouter.get("/:id", async (c) => {
  const map = await db.historicalMap.findUnique({
    where: { id: c.req.param("id") },
    include: { cartographer: { select: { id: true, name: true, birthYear: true, deathYear: true, nationality: true, biography: true, notableMaps: true } } },
  });
  if (!map) return c.json({ error: { message: "Map not found", code: "NOT_FOUND" } }, 404);
  const [relatedWaterways, relatedExplorers, citations] = await Promise.all([
    db.waterway.findMany({ where: { id: { in: parseIds(map.relatedWaterwayIds) } }, select: { id: true, name: true, latitude: true, longitude: true } }),
    db.explorer.findMany({ where: { id: { in: parseIds(map.relatedExplorerIds) } }, select: { id: true, name: true } }),
    getCitations("historical_map", map.id),
  ]);
  const { boundsSwLat, boundsSwLng, boundsNeLat, boundsNeLng, relatedWaterwayIds: _w, relatedExplorerIds: _e, ...rest } = map;
  const bounds = boundsSwLat !== null && boundsSwLng !== null && boundsNeLat !== null && boundsNeLng !== null
    ? { southWest: { latitude: boundsSwLat, longitude: boundsSwLng }, northEast: { latitude: boundsNeLat, longitude: boundsNeLng } }
    : null;
  return c.json({ data: { ...rest, bounds, relatedWaterways, relatedExplorers, citations: citations.map((r) => ({ ...r, text: formatText(r) })) } });
});

export { historicalMapsRouter };
