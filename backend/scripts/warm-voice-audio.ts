// Synthesise and store the spoken copy of every checked transcription in both narrator voices,
// so no reader waits on the first play (roadmap item 5, 2026-10-20). Idempotent: copies already
// on R2 are skipped. Needs XAI_API_KEY and the R2 variables in the environment.
//   bun run scripts/warm-voice-audio.ts [--only <title substring>] [--voice male|female]
import { db } from "../src/db";
import { listVoices } from "../src/lib/voices";
import { ensureVoiceAudio, NARRATOR_VOICES, ttsConfigured, type NarratorVoice } from "../src/lib/tts";

async function main() {
  if (!ttsConfigured()) {
    console.error("XAI_API_KEY and the R2 variables must be set");
    process.exitCode = 1;
    return;
  }
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1]?.toLowerCase() ?? null : null;
  const voiceIndex = process.argv.indexOf("--voice");
  const voices = voiceIndex >= 0 ? [process.argv[voiceIndex + 1] as NarratorVoice] : NARRATOR_VOICES;
  const docs = (await listVoices()).filter((v) => !only || v.title.toLowerCase().includes(only));
  let made = 0, kept = 0, failed = 0;
  for (const doc of docs) {
    for (const voice of voices) {
      try {
        const { url, generated } = await ensureVoiceAudio(doc.id, voice);
        generated ? made++ : kept++;
        console.log(`${generated ? "made" : "kept"}  ${voice.padEnd(6)} ${doc.title.slice(0, 60).padEnd(60)} ${url}`);
      } catch (e) {
        failed++;
        console.error(`FAIL  ${voice.padEnd(6)} ${doc.title.slice(0, 60)}: ${(e as Error).message}`);
      }
    }
  }
  console.log(`\nmade ${made}, kept ${kept}, failed ${failed} of ${docs.length * voices.length}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
