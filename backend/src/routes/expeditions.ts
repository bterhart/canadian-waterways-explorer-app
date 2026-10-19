/**
 * expeditions.ts — the expedition route layer (roadmap item 2, 2026-10-19).
 *
 * GET /api/expeditions          → { data: [{ id, name, startYear, endYear, color, legCount,
 *                                  explorer: { id, name } }] } grouped by the client
 * GET /api/expeditions/:id      → { data: { ...expedition, explorer, legs: [{ orderIndex, year,
 *                                  notes, waterway: { id, name, latitude, longitude, type },
 *                                  location: { id, name, latitude, longitude } | null }] } }
 * The app draws each leg's waterway geometry from the overview dataset it already holds.
 */
import { Hono } from "hono";
import { db } from "../db";

const expeditionsRouter = new Hono();

export const expeditionLegSelect = {
  id: true, orderIndex: true, year: true, notes: true,
  waterway: { select: { id: true, name: true, latitude: true, longitude: true, type: { select: { name: true } } } },
  location: { select: { id: true, name: true, latitude: true, longitude: true } },
} as const;

expeditionsRouter.get("/", async (c) => {
  const rows = await db.expedition.findMany({
    orderBy: [{ startYear: "asc" }, { sortOrder: "asc" }],
    select: { id: true, name: true, startYear: true, endYear: true, color: true, explorer: { select: { id: true, name: true } }, _count: { select: { legs: true } } },
  });
  return c.json({ data: rows.map(({ _count, ...r }) => ({ ...r, legCount: _count.legs })) });
});

expeditionsRouter.get("/:id", async (c) => {
  const expedition = await db.expedition.findUnique({
    where: { id: c.req.param("id") },
    include: { explorer: { select: { id: true, name: true, imageUrl: true } }, legs: { orderBy: { orderIndex: "asc" }, select: expeditionLegSelect } },
  });
  if (!expedition) return c.json({ error: { message: "Expedition not found", code: "NOT_FOUND" } }, 404);
  return c.json({ data: expedition });
});

export { expeditionsRouter };
