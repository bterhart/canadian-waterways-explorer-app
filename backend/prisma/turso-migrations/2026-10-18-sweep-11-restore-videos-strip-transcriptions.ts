// Template-field sweep, pass 11 (2026-10-18): two corrections on the owner's instructions.
//   bun run prisma/turso-migrations/2026-10-18-sweep-11-restore-videos-strip-transcriptions.ts [--apply]
//
// 1. Videos. Pass 9 read the approved-channel list too narrowly and removed the seed videos that were
//    not from those channels. The owner's rule: YouTube at large is acceptable, do not scrub videos
//    just because they are not on the expanded list (Bloody Falls on the Coppermine is the example).
//    So every video removed in pass 9 is restored from that pass's backup, except the eleven that
//    YouTube no longer serves (checked again here), and placed after the approved-channel video that
//    pass 9 added where there is one.
// 2. Documents. The 44 primary-source documents from the original seed data that carry quoted
//    "transcriptions" nobody has checked keep their place as sourced pointers (the owner has read
//    them and wants them kept) but lose the quoted text: transcription and originalText are set to
//    null. A quotation goes back only when it has been checked against a published edition.
// Backup of every changed row before --apply.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const PASS9_BACKUP = resolve(import.meta.dir, "backups", "2026-10-18-sweep-9-before.json");
type Item = { url: string; type?: string };
const idOf = (url: string) => url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null;
async function available(id: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000 * (attempt + 1))); continue; }
      return res.ok;
    } catch { if (attempt === 2) return false; }
  }
  return false;
}

async function main() {
  const backup = JSON.parse(readFileSync(PASS9_BACKUP, "utf8")) as { data?: { removals: Array<{ id: string; name: string; videoUrl: string }> }; removals?: Array<{ id: string; name: string; videoUrl: string }> };
  const removals = backup.removals ?? backup.data?.removals ?? [];
  if (!removals.length) throw new Error("pass 9 backup has no removals");
  const current = new Map((await db.waterway.findMany({ where: { id: { in: removals.map((r) => r.id) } }, select: { id: true, videoUrl: true } })).map((w) => [w.id, w.videoUrl]));
  const updates: Array<{ id: string; name: string; before: string | null; after: string; restored: number; dropped: string[] }> = [];
  for (const r of removals) {
    let items: Item[] = []; try { items = JSON.parse(r.videoUrl); } catch { items = [{ url: r.videoUrl, type: "youtube" }]; }
    const kept: Item[] = []; const dropped: string[] = [];
    for (const it of items) { const id = idOf(it.url); if (id && (await available(id))) kept.push({ url: it.url, type: it.type ?? "youtube" }); else dropped.push(it.url); }
    const cur: Item[] = current.get(r.id) ? JSON.parse(current.get(r.id)!) : [];
    const merged = [...cur, ...kept.filter((k) => !cur.some((c) => idOf(c.url) === idOf(k.url)))];
    if (merged.length !== cur.length) updates.push({ id: r.id, name: r.name, before: current.get(r.id) ?? null, after: JSON.stringify(merged), restored: merged.length - cur.length, dropped });
  }
  const docs = await db.primarySourceDocument.findMany({ where: { OR: [{ transcription: { not: null } }, { originalText: { not: null } }] }, select: { id: true, title: true, transcription: true, originalText: true } });
  const backupFile = writeBackup("2026-10-18-sweep-11-before", { videos: updates.map((u) => ({ id: u.id, videoUrl: u.before })), documents: docs });
  report("sweep pass 11: restore videos, strip transcriptions", {
    videosRestoredOn: updates.map((u) => `${u.name}: +${u.restored}${u.dropped.length ? ` (dropped, no longer on YouTube: ${u.dropped.length})` : ""}`),
    documentsToStrip: docs.map((d) => d.title), backupFile,
  });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of updates) await tx.waterway.update({ where: { id: u.id }, data: { videoUrl: u.after } });
    for (const d of docs) await tx.primarySourceDocument.update({ where: { id: d.id }, data: { transcription: null, originalText: null } });
  }, { timeout: 60000 });
  report("verify", { waterwaysWithVideo: await db.waterway.count({ where: { videoUrl: { not: null } } }), documentsWithTranscription: await db.primarySourceDocument.count({ where: { OR: [{ transcription: { not: null } }, { originalText: { not: null } }] } }), documents: await db.primarySourceDocument.count() });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
