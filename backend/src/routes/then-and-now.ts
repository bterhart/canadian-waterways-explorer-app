/**
 * then-and-now.ts — then-and-now imagery (roadmap item 7, 2026-10-20).
 *
 * GET /api/then-and-now?locationId&waterwayId → { data: ThenAndNowPair[] } oldest "then" first
 * GET /api/then-and-now/:id                   → { data: ThenAndNowPair }
 */
import { Hono } from "hono";
import { getThenAndNow, listThenAndNow } from "../lib/then-and-now";

const thenAndNowRouter = new Hono();

thenAndNowRouter.get("/", async (c) => {
  const q = c.req.query();
  return c.json({ data: await listThenAndNow({ locationId: q.locationId, waterwayId: q.waterwayId }) });
});

thenAndNowRouter.get("/:id", async (c) => {
  const pair = await getThenAndNow(c.req.param("id"));
  if (!pair) return c.json({ error: { message: "Pair not found", code: "NOT_FOUND" } }, 404);
  return c.json({ data: pair });
});

export { thenAndNowRouter };
