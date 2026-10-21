/**
 * tts.ts — spoken copies of the checked transcriptions (roadmap item 5, owner's instruction of
 * 2026-10-20: the phone's own voices are not good enough; use the xAI voices, one male and one
 * female, through the owner's API key).
 *
 * POST https://api.x.ai/v1/tts  { text, voice_id, language, output_format: { codec, sample_rate,
 * bit_rate }, speed }  →  raw audio bytes (audio/mpeg for mp3). Read from docs.x.ai on 2026-10-20.
 * Each passage is synthesised once per voice and kept on R2 at voices/<documentId>/<male|female>.mp3;
 * the app plays the URL. Without XAI_API_KEY nothing is synthesised and the route says so, and the
 * app falls back to the phone's synthesiser.
 */
import { env } from "../env";
import { cdnObjectExists, uploadImageBuffer } from "./image-cdn";
import { listVoices } from "./voices";

export type NarratorVoice = "male" | "female";
export const NARRATOR_VOICES: NarratorVoice[] = ["male", "female"];

/** R2 is where the copies live; serving an existing copy needs only this. */
export const audioStoreConfigured = (): boolean => !!env.R2_BUCKET_NAME && !!env.R2_PUBLIC_URL;
/** Making a new copy needs the xAI key as well. */
export const ttsConfigured = (): boolean => !!env.XAI_API_KEY && audioStoreConfigured();

export class TtsNotConfiguredError extends Error {
  constructor() {
    super("XAI_API_KEY is not set");
    this.name = "TtsNotConfiguredError";
  }
}

const voiceIdFor = (voice: NarratorVoice): string => (voice === "male" ? env.XAI_VOICE_MALE : env.XAI_VOICE_FEMALE);

/** French if the passage reads as French (Cartier's Louvain sentence, Champlain's French), else English. */
export function languageOf(text: string): "en" | "fr" {
  const sample = text.slice(0, 600).toLowerCase();
  const fr = (sample.match(/\b(les|des|nous|vous|avec|dans|pour|sont|est|une|qui|que|et|le|la)\b/g) ?? []).length;
  const en = (sample.match(/\b(the|and|with|were|was|which|that|they|have|from|of|to)\b/g) ?? []).length;
  return fr > en ? "fr" : "en";
}

/**
 * What the voice is given: the editions' editorial brackets are read as their words ("[Friday]"
 * → "Friday"), an omitted stretch "[...]" becomes a silent sentence break (the engine read the
 * earlier "[pause]" marker aloud as the word; owner, 2026-10-21), and the engine's own tag syntax
 * is never produced by accident.
 */
export function spokenText(text: string): string {
  return text
    .replace(/\s*\[\s*(\.\.\.|…)\s*\]\s*/g, (_m, _g, offset: number, whole: string) => {
      const before = whole.slice(0, offset).trimEnd();
      return /[.!?;:]$/.test(before) ? " " : ". ";
    })
    .replace(/\[([^\]]{1,80})\]/g, "$1")
    .replace(/<[^>]{1,40}>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function synthesize(text: string, voice: NarratorVoice): Promise<Buffer> {
  if (!env.XAI_API_KEY) throw new TtsNotConfiguredError();
  const response = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.XAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: spokenText(text),
      voice_id: voiceIdFor(voice),
      language: languageOf(text),
      output_format: { codec: "mp3", sample_rate: 24000, bit_rate: 128000 },
      speed: 0.95,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`xAI tts ${response.status}: ${detail.slice(0, 300)}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  const bytes = Buffer.from(await response.arrayBuffer());
  // The documented default is raw audio; a JSON envelope carries base64 audio in `audio`.
  if (contentType.includes("application/json")) {
    const parsed = JSON.parse(bytes.toString("utf8")) as { audio?: string };
    if (!parsed.audio) throw new Error("xAI tts: JSON response without audio");
    return Buffer.from(parsed.audio, "base64");
  }
  return bytes;
}

export const voiceAudioKey = (documentId: string, voice: NarratorVoice) => `voices/${documentId}/${voice}.mp3`;
export const voiceAudioUrl = (documentId: string, voice: NarratorVoice): string | null =>
  env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${voiceAudioKey(documentId, voice)}` : null;

const known = new Set<string>();
const inFlight = new Map<string, Promise<string>>();

/** The public URL of the spoken copy, synthesising and storing it on first request; `force` remakes an existing copy (scripts only). */
export async function ensureVoiceAudio(documentId: string, voice: NarratorVoice, force = false): Promise<{ url: string; generated: boolean }> {
  const key = voiceAudioKey(documentId, voice);
  const url = voiceAudioUrl(documentId, voice);
  if (!url) throw new Error("R2_PUBLIC_URL is not set");
  if (!force) {
    if (known.has(key)) return { url, generated: false };
    if (await cdnObjectExists(key)) {
      known.add(key);
      return { url, generated: false };
    }
  }
  const pending = inFlight.get(key);
  if (pending) return { url: await pending, generated: true };
  const job = (async () => {
    const voiceDoc = (await listVoices()).find((v) => v.id === documentId);
    if (!voiceDoc) throw new Error(`no checked transcription for ${documentId}`);
    const audio = await synthesize(voiceDoc.text, voice);
    await uploadImageBuffer(audio, key, "audio/mpeg");
    known.add(key);
    return url;
  })();
  inFlight.set(key, job);
  try {
    return { url: await job, generated: true };
  } finally {
    inFlight.delete(key);
  }
}
