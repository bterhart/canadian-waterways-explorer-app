/**
 * voices.ts — "Let the sources speak" (roadmap item 5, 2026-10-20).
 *
 * GET /api/voices                               → { data: Voice[] }  every checked transcription with its spot
 * GET /api/voices/near?lat&lng&radiusKm&limit   → { data: VoiceNear[] }  nearest first
 * GET /api/voices/:id/audio?voice=male|female   → { data: { url, voice, generated } }  the spoken copy on R2,
 *                                                  synthesised with the xAI voice on first request;
 *                                                  503 TTS_NOT_CONFIGURED when a copy must be made and XAI_API_KEY is unset
 */
import { Hono } from "hono";
import { listVoices, voicesNear } from "../lib/voices";
import { ensureVoiceAudio, NARRATOR_VOICES, audioStoreConfigured, TtsNotConfiguredError, type NarratorVoice } from "../lib/tts";

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

voicesRouter.get("/:id/audio", async (c) => {
  const requested = (c.req.query("voice") ?? "male").toLowerCase();
  if (!NARRATOR_VOICES.includes(requested as NarratorVoice)) {
    return c.json({ error: { message: "voice must be male or female", code: "BAD_REQUEST" } }, 400);
  }
  const voice = requested as NarratorVoice;
  if (!audioStoreConfigured()) {
    return c.json({ error: { message: "Spoken copies are not configured on this server", code: "TTS_NOT_CONFIGURED" } }, 503);
  }
  const id = c.req.param("id");
  if (!(await listVoices()).some((v) => v.id === id)) {
    return c.json({ error: { message: "No checked transcription for this document", code: "NOT_FOUND" } }, 404);
  }
  try {
    // A copy already on R2 is served whether or not the xAI key is set; only making a new one needs it
    const { url, generated } = await ensureVoiceAudio(id, voice);
    return c.json({ data: { url, voice, generated } });
  } catch (e) {
    if (e instanceof TtsNotConfiguredError) {
      return c.json({ error: { message: "Spoken copies are not configured on this server", code: "TTS_NOT_CONFIGURED" } }, 503);
    }
    console.error("voice audio failed", id, voice, e);
    return c.json({ error: { message: "The spoken copy could not be made", code: "TTS_FAILED" } }, 502);
  }
});

export { voicesRouter };
