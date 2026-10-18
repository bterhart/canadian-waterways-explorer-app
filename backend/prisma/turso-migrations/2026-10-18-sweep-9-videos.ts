// Template-field sweep, pass 9 (2026-10-18): videos from the owner's approved channels only.
//   bun run prisma/turso-migrations/2026-10-18-sweep-9-videos.ts [--apply]
//
// Approved channels (owner, 2026-10-18): Parks Canada / Parcs Canada, Historica Canada (Heritage
// Minutes), the Canadian Encyclopedia, provincial and territorial archives. No video is acceptable;
// a video from anywhere else is not. Two parts:
//   1. Every waterway's existing videoUrl is checked against YouTube's oEmbed record (title and
//      channel). Entries whose channel is not approved, or whose video no longer exists, are removed.
//   2. New videos, found by searching YouTube for each waterway's historic sites and keeping only
//      approved-channel results that concern the waterway's history, are added where the waterway
//      has none; each is confirmed by oEmbed at run time before it is written.
// Format matches the existing rows: JSON array of {url, type: "youtube"}. Backup before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const APPROVED = ["Parks Canada", "Parcs Canada", "Historica Canada", "The Canadian Encyclopedia", "Library and Archives Canada", "Archives of Ontario", "Archives of Manitoba", "BC Archives", "Royal BC Museum", "Provincial Archives of Alberta", "Provincial Archives of New Brunswick", "Nova Scotia Archives", "The Rooms", "Yukon Archives", "NWT Archives", "Provincial Archives of Saskatchewan", "BAnQ"];

// waterway → YouTube id, and why it concerns the waterway.
const NEW_VIDEOS: Array<{ waterway: string; id: string; why: string }> = [
  { waterway: "Gaspé Bay", id: "nfKr-D5VDBU", why: "Heritage Minutes: Jacques Cartier — the cross at Gaspé, 1534" },
  { waterway: "Cabot Strait", id: "ds8G9sFOK5w", why: "Heritage Minutes: John Cabot — the 1497 landfall the strait is named for" },
  { waterway: "Bonavista Bay", id: "ds8G9sFOK5w", why: "Heritage Minutes: John Cabot — Cape Bonavista is the traditional landfall" },
  { waterway: "Strait of Belle Isle", id: "Fdqg1wywlhw", why: "Parks Canada ReCollections: Red Bay, the Basque whalers of the strait" },
  { waterway: "Lake Ontario", id: "Rg5JYq3eJ2Q", why: "Heritage Minutes: Governor Frontenac — Fort Frontenac stood at the lake's outlet" },
  { waterway: "Lake Michigan", id: "RULedv5LDuA", why: "Heritage Minutes: Jean Nicollet — his 1634 landing at Green Bay" },
  { waterway: "Fox River (Wisconsin)", id: "RULedv5LDuA", why: "Heritage Minutes: Jean Nicollet — landed at the river's mouth on Green Bay, 1634" },
  { waterway: "Yukon River", id: "r00yaFwZ5bc", why: "Heritage Minutes: Sam Steele — the police on the Yukon in the gold rush" },
  { waterway: "Klondike River", id: "5oCh28RWTkw", why: "Parks Canada: Klondike National Historic Sites at Dawson" },
  { waterway: "Bennett Lake", id: "VzZiDzBZezs", why: "Parks Canada: transportation on the Chilkoot Trail, the stampeders' road to the lake" },
  { waterway: "Niagara River", id: "_L-vL5NFkYA", why: "Heritage Minutes: Laura Secord — the War of 1812 on the Niagara frontier" },
  { waterway: "Fraser River", id: "DUXOKLuO0VY", why: "Parks Canada: everyday history at Fort Langley, the company post on the lower Fraser" },
  { waterway: "St. Lawrence River", id: "H48gaLbJfxc", why: "Heritage Minutes: Orphans — the quarantine station at Grosse Île in the river, 1847" },
  { waterway: "James Bay", id: "mVVD9yYCKiI", why: "Heritage Minutes: Naskumituwin (Treaty) — Treaty 9 and the James Bay Cree" },
  { waterway: "Kluane Lake", id: "i3z4a5bUXls", why: "Parks Canada: Ä́’sía Keyi, Grandfather's Land — the Southern Tutchone and Kluane" },
  { waterway: "Minas Basin", id: "9F23fgzNbO4", why: "Heritage Minutes: Acadian Deportation — Grand-Pré on the basin, 1755" },
  { waterway: "South Saskatchewan River", id: "1VEgMf7sG1I", why: "Parks Canada: Batoche and Tourond's Coulée, the Métis landscape of 1885 on the river" },
  { waterway: "Red River", id: "nDUJAbhgWPw", why: "Parks Canada: the York boats of Lower Fort Garry on the Red" },
  { waterway: "Stuart Lake", id: "dggOcxKnc8o", why: "Parks Canada: the Métis of Fort St. James on the lake" },
  { waterway: "North Saskatchewan River", id: "MepESIAS2LU", why: "Parks Canada: the Rocky Mountain House Métis, at the posts on the river" },
  { waterway: "Richelieu River", id: "yFOs-bYN06E", why: "Parks Canada: Fort Chambly, a fort at the foot of the rapids" },
  { waterway: "Queen Maud Gulf", id: "H33xOPlqrWQ", why: "Parks Canada: exploring the wreck of HMS Erebus in the gulf" },
  { waterway: "Terror Bay", id: "OxyTZ3F7mkA", why: "Parks Canada: guided tour inside HMS Terror" },
  { waterway: "Placentia Bay", id: "D-fFC84db8M", why: "Parks Canada: Castle Hill above Placentia, the French capital" },
  { waterway: "Lake Superior", id: "iaAx6V7NMCw", why: "Historica Canada: the fur trade in Canada, a summary — the Grand Portage and Fort William trade" },
  { waterway: "Lake Huron", id: "UK-8RbVwzrk", why: "Parks Canada: the Sault Ste. Marie Canal at the rapids between Superior and Huron" },
  { waterway: "Ottawa River", id: "Bp6hGDO_LO4", why: "Parks Canada: the Rideau Canal, where history and nature flow together — built from the Ottawa at Bytown" },
  { waterway: "Detroit River", id: "RnfwO75QZ4E", why: "Parks Canada: Fort Malden virtual tour, on the river at Amherstburg" },
  { waterway: "Gulf of St. Lawrence", id: "kYtbLu4aIJM", why: "Parks Canada: Washtesiou, the Innu and the Mingan Archipelago on the Gulf's north shore" },
  { waterway: "Georgia Strait", id: "cv247vHBllA", why: "Parks Canada: restoring a Coast Salish clam garden in the Gulf Islands" },
  { waterway: "Juan de Fuca Strait", id: "lEPE3O7ShAI", why: "Parks Canada: Fort Rodd Hill and Fisgard Lighthouse on the strait" },
];

async function oembed(id: string): Promise<{ title: string; author: string } | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000 * (attempt + 1))); continue; }
      if (!res.ok) return null;
      const j = (await res.json()) as { title: string; author_name: string };
      return { title: j.title, author: j.author_name };
    } catch { if (attempt === 2) return null; }
  }
  return null;
}
const idOf = (url: string) => url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null;

async function main() {
  const ww = await db.waterway.findMany({ select: { id: true, name: true, videoUrl: true } });
  const byName = new Map(ww.map((w) => [w.name, w]));
  // 1. audit existing
  const removals: Array<{ id: string; name: string; before: string; reasons: string[]; keep: string | null }> = [];
  const kept: string[] = [];
  for (const w of ww) {
    if (!w.videoUrl) continue;
    let items: Array<{ url: string; type?: string }> = [];
    try { items = JSON.parse(w.videoUrl); } catch { items = [{ url: w.videoUrl }]; }
    const reasons: string[] = []; const ok: typeof items = [];
    for (const it of items) {
      const vid = idOf(it.url ?? ""); const meta = vid ? await oembed(vid) : null;
      if (!meta) reasons.push(`${it.url}: video not available`);
      else if (!APPROVED.some((a) => meta.author.toLowerCase() === a.toLowerCase())) reasons.push(`${it.url}: channel "${meta.author}" (${meta.title}) not approved`);
      else ok.push(it);
    }
    if (reasons.length) removals.push({ id: w.id, name: w.name, before: w.videoUrl, reasons, keep: ok.length ? JSON.stringify(ok) : null });
    else kept.push(w.name);
  }
  // 2. new videos, confirmed by oEmbed
  const adds: Array<{ id: string; name: string; videoUrl: string; title: string; author: string }> = []; const problems: string[] = [];
  for (const v of NEW_VIDEOS) {
    const w = byName.get(v.waterway); if (!w) throw new Error(`waterway not found: ${v.waterway}`);
    const rem = removals.find((r) => r.id === w.id); const willBeEmpty = !w.videoUrl || (!!rem && rem.keep === null);
    if (!willBeEmpty) { problems.push(`${v.waterway} already has an approved video; skipped ${v.id}`); continue; }
    const meta = await oembed(v.id);
    if (!meta) { problems.push(`${v.waterway}: ${v.id} not available`); continue; }
    if (!APPROVED.some((a) => meta.author.toLowerCase() === a.toLowerCase())) { problems.push(`${v.waterway}: ${v.id} channel "${meta.author}" not approved`); continue; }
    adds.push({ id: w.id, name: w.name, videoUrl: JSON.stringify([{ url: `https://www.youtube.com/watch?v=${v.id}`, type: "youtube" }]), title: meta.title, author: meta.author });
  }
  const backupFile = writeBackup("2026-10-18-sweep-9-before", { removals: removals.map((r) => ({ id: r.id, name: r.name, videoUrl: r.before })) });
  report("sweep pass 9: videos", { existingKept: kept, existingRemoved: removals.map((r) => `${r.name}: ${r.reasons.join("; ")}`), added: adds.map((a) => `${a.name}: ${a.author} — ${a.title}`), skippedOrProblems: problems, backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const r of removals) await tx.waterway.update({ where: { id: r.id }, data: { videoUrl: r.keep } });
    for (const a of adds) await tx.waterway.update({ where: { id: a.id }, data: { videoUrl: a.videoUrl } });
  }, { timeout: 60000 });
  report("verify", { waterwaysWithVideo: await db.waterway.count({ where: { videoUrl: { not: null } } }), waterwaysWithoutVideo: await db.waterway.count({ where: { videoUrl: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
