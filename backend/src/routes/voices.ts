/**
 * voices.ts — "Let the sources speak" (roadmap item 5, 2026-10-20).
 *
 * GET /api/voices                       → { data: Voice[] }  every checked transcription with its spot
 * GET /api/voices/near?lat&lng&radiusKm&limit → { data: VoiceNear[] }  nearest first
 */
import { Hono } from "hono";
import { listVoices, voicesNear } from "../lib/voices";

const voicesRouter = new Hono();

voicesRouter.get("/", async (c) => c.json({ data: await listVoices() }));

voicesRouter.get("/near", async (c) => {
  const lat = Number(c.req.query("lat"));
  const lng = Number(c.req.query("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return c.json({ error: { message: "lat and lng are required numbers", code: "BAD_REQUEST" } }, 400);
  }
  const radius = Number(c.req.query("radiusKm"));
  const limit = Number(c.req.query("limit"));
  return c.json({
    data: await voicesNear(
      lat,
      lng,
      Number.isFinite(radius) && radius > 0 ? Math.min(radius, 2000) : 120,
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 10) : 2,
    ),
  });
});

export { voicesRouter };
