// Citations seed (2026-10-19, roadmap item 14): structured sources for the records that already
// carry them in text form.
//   bun run prisma/turso-migrations/2026-10-19-citations-seed.ts [--apply]
//
// Four sources of citations, none invented:
//   1. ReadingGuide rows whose link is to an authority: the Dictionary of Canadian Biography,
//      the Canadian Encyclopedia, Parks Canada, the Internet Archive (digitized editions), Library
//      and Archives Canada, the Champlain Society, the Library of Congress, the Manitoba Historical
//      Society, the U.S. National Park Service and the Lewis and Clark journals. Wikipedia guides
//      are left out: the app uses them as reading pointers, not as the authority for facts.
//   2. The "Quotation checked against ..." line on each document with a checked transcription.
//   3. The `sources` text on every archaeological discovery, split on semicolons.
//   4. The place-name records behind the Indigenous names set in passes 3 and 14.
// Idempotent: a target never gets two citations with the same url (or, without a url, the same
// title). Inserts only; backup notes the counts.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Row = { targetType: string; targetId: string; sortOrder: number; kind: string; author?: string | null; title: string; container?: string | null; publisher?: string | null; year?: string | null; pages?: string | null; url?: string | null; accessed?: string | null; note?: string | null };
const TODAY = "2026-10-19";

const HOSTS: Array<{ match: RegExp; kind: string; container: string; publisher: string | null }> = [
  { match: /biographi\.ca/, kind: "dcb", container: "Dictionary of Canadian Biography", publisher: "University of Toronto / Université Laval" },
  { match: /thecanadianencyclopedia\.ca/, kind: "encyclopedia", container: "The Canadian Encyclopedia", publisher: "Historica Canada" },
  { match: /archive\.org/, kind: "edition", container: "Internet Archive (digitized copy)", publisher: null },
  { match: /pc\.gc\.ca|parks\.canada\.ca/, kind: "parks_canada", container: "Parks Canada", publisher: "Government of Canada" },
  { match: /bac-lac\.gc\.ca/, kind: "archive", container: "Library and Archives Canada", publisher: null },
  { match: /champlainsociety/, kind: "edition", container: "The Champlain Society", publisher: null },
  { match: /loc\.gov/, kind: "archive", container: "Library of Congress", publisher: null },
  { match: /mhs\.mb\.ca/, kind: "web", container: "Manitoba Historical Society", publisher: null },
  { match: /nps\.gov/, kind: "web", container: "U.S. National Park Service", publisher: null },
  { match: /lewisandclarkjournals/, kind: "edition", container: "Journals of the Lewis and Clark Expedition (University of Nebraska)", publisher: null },
  { match: /mmf\.mb\.ca|ykdene\.com/, kind: "web", container: "Nation website", publisher: null },
];

// 4. Place-name records behind the Indigenous names of passes 3 and 14 (sources as recorded there).
const NAME_RECORDS: Array<{ kind: "waterway" | "location"; name: string; cite: Omit<Row, "targetType" | "targetId" | "sortOrder"> }> = [
  { kind: "waterway", name: "Eastmain River", cite: { kind: "place_name_record", author: "Commission de toponymie du Québec", title: "Rivière Eastmain (fiche 20122): variante traditionnelle autochtone Iismeniiu-siipii", url: "https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=20122", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Prince of Wales Strait", cite: { kind: "place_name_record", author: "Natural Resources Canada", title: "Canadian Geographical Names Database: Ikirahak (Inuinnaqtun), official name, Northwest Territories, decision 2006-04-01", url: "https://geogratis.gc.ca/services/geoname/en/geonames?q=Ikirahak", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Naskaupi River", cite: { kind: "place_name_record", author: "Natural Resources Canada", title: "Canadian Geographical Names Database: Meshikamau-shipu (Innu-aimun), official name, Newfoundland and Labrador, decision 2015-01-27 (key ACVOX)", url: "https://geogratis.gc.ca/services/geoname/en/geonames/ACVOX.html", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Okanagan Lake", cite: { kind: "web", author: "IndigiNews", title: "kɬúsx̌nítkʷ, the original and accurate name for 'Okanagan Lake'", url: "https://indiginews.com/features/the-original-and-accurate-name-for-okanagan-lake/", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Humber River (Newfoundland)", cite: { kind: "book", author: "Qalipu First Nation (Michelle Matthews and Angela Robinson)", title: "Ktaqmkuk: Across the Waters, Mi'kmaq place names of Newfoundland (Humber River: Maqtukwek)", url: "https://qalipu.ca/qalipu/wp-content/uploads/2018/11/Ktaqmkuk%20Handbook.pdf", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Beothuk Lake", cite: { kind: "book", author: "Qalipu First Nation (Michelle Matthews and Angela Robinson)", title: "Ktaqmkuk: Across the Waters, Mi'kmaq place names of Newfoundland (Red Indian Lake: Mekwe'jite'wey)", url: "https://qalipu.ca/qalipu/wp-content/uploads/2018/11/Ktaqmkuk%20Handbook.pdf", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Miramichi River", cite: { kind: "web", author: "Mi'gmaq-Mi'kmaq Online (Listuguj)", title: "Listuguji'j: Miramichi River", url: "https://mikmaqonline.org/entries/l/Listuguji'j/Listuguji'j.html", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Restigouche River", cite: { kind: "place_name_record", author: "Commission de toponymie du Québec", title: "Rivière Ristigouche (fiche 53438): origine micmaque", url: "https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=53438", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Rainy River", cite: { kind: "web", author: "Rainy River First Nations", title: "Manidoo Ziibi (Rainy River): Kay-Nah-Chi-Wah-Nung, Manitou Mounds", url: "https://manitoumounds.com/a-gathering-place/about/", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Richelieu River", cite: { kind: "encyclopedia", author: "The Canadian Encyclopedia", title: "Richelieu River (Masoliantekw, Abenaki)", container: "The Canadian Encyclopedia", publisher: "Historica Canada", url: "https://www.thecanadianencyclopedia.ca/en/article/richelieu-river", accessed: "2026-10-18" } },
  { kind: "waterway", name: "Nottaway River", cite: { kind: "place_name_record", author: "Commission de toponymie du Québec", title: "Rivière Nottaway (fiche 44898): Natuweu Nipi (cri)", url: "https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=44898", accessed: "2026-10-18" } },
  { kind: "location", name: "Fort McLoughlin", cite: { kind: "place_name_record", author: "BC Geographical Names", title: "McLoughlin Bay: Q̓ḷc, a Haíłzaqvḷa name meaning 'slippery' (Heiltsuk Nation, 2025)", url: "https://apps.gov.bc.ca/pub/bcgnws/names/77259.html", accessed: "2026-10-18" } },
  { kind: "location", name: "Fort Stikine", cite: { kind: "web", author: "Sealaska", title: "Ḵaachx̱an.áakʼw (Wrangell)", url: "https://mysealaska.com/Communities/Wrangell", accessed: "2026-10-18" } },
  { kind: "location", name: "Trois-Rivières", cite: { kind: "place_name_record", author: "Commission de toponymie du Québec", title: "Mad8baloden (fiche 451418): variante traditionnelle autochtone, abénakise, de Trois-Rivières", url: "https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=451418", accessed: "2026-10-18" } },
  { kind: "location", name: "Placentia (Plaisance)", cite: { kind: "book", author: "Qalipu First Nation (Michelle Matthews and Angela Robinson)", title: "Ktaqmkuk: Across the Waters, Mi'kmaq place names of Newfoundland (Placentia: Plisantek)", url: "https://qalipu.ca/qalipu/wp-content/uploads/2018/11/Ktaqmkuk%20Handbook.pdf", accessed: "2026-10-18" } },
  { kind: "location", name: "Lapierre House", cite: { kind: "place_name_record", author: "Natural Resources Canada", title: "Canadian Geographical Names Database: Zheh Gwatsal (Gwich'in), Yukon alternate official name, decision 2018-08-23", url: "https://geogratis.gc.ca/services/geoname/en/geonames?q=Zheh%20Gwatsal", accessed: "2026-10-18" } },
];

function parseGuideAuthorYear(authorSource: string | null, year: string | null) {
  return { author: authorSource && !/^(Dictionary of Canadian Biography|The Canadian Encyclopedia|Parks Canada)$/i.test(authorSource) ? authorSource : null, year: year ?? null };
}

async function main() {
  const rows: Row[] = [];
  // 1. reading guides with authority links
  const guides = await db.readingGuide.findMany({ select: { targetType: true, targetId: true, sortOrder: true, title: true, authorSource: true, publisher: true, year: true, url: true, description: true } });
  let skippedWikipedia = 0;
  for (const g of guides) {
    if (!g.url) continue;
    if (/wikipedia\.org/.test(g.url)) { skippedWikipedia++; continue; }
    const host = HOSTS.find((h) => h.match.test(g.url!));
    if (!host) continue;
    const { author, year } = parseGuideAuthorYear(g.authorSource, g.year);
    rows.push({ targetType: g.targetType, targetId: g.targetId, sortOrder: g.sortOrder, kind: host.kind, author, title: g.title, container: host.container, publisher: g.publisher && !/Internet Archive/.test(g.publisher) ? g.publisher : host.publisher, year, url: g.url, accessed: TODAY, note: g.description ?? null });
  }
  // 2. checked documents
  const docs = await db.primarySourceDocument.findMany({ where: { transcription: { not: null } }, select: { id: true, historicalContext: true } });
  for (const d of docs) {
    const m = d.historicalContext?.match(/Quotation checked against ([^.]+(?:\.[^.]*\))?[^.]*)\./);
    const cited = m?.[1]?.trim();
    if (!cited) continue;
    rows.push({ targetType: "document", targetId: d.id, sortOrder: 0, kind: "edition", title: cited, note: "Edition against which the transcription was checked", accessed: TODAY });
  }
  // 3. discoveries
  const disc = await db.archaeologicalDiscovery.findMany({ select: { id: true, sources: true } });
  for (const d of disc) {
    if (!d.sources) continue;
    d.sources.split(/;\s*/).map((s) => s.trim()).filter(Boolean).forEach((s, i) => {
      const url = s.match(/https?:\/\/\S+/)?.[0] ?? null;
      const title = s.replace(/\s*—\s*https?:\/\/\S+/, "").replace(/https?:\/\/\S+/, "").trim();
      const host = url ? HOSTS.find((h) => h.match.test(url)) : undefined;
      rows.push({ targetType: "discovery", targetId: d.id, sortOrder: i, kind: host?.kind ?? (url ? "web" : "book"), title: title || url || s, container: host?.container ?? null, url, accessed: url ? TODAY : null });
    });
  }
  // 4. name records
  const [ww, locs] = await Promise.all([db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } })]);
  for (const r of NAME_RECORDS) {
    const id = (r.kind === "waterway" ? ww : locs).find((x) => x.name === r.name)?.id; if (!id) throw new Error(`not found: ${r.name}`);
    rows.push({ targetType: r.kind, targetId: id, sortOrder: 100, ...r.cite, note: "Record for the Indigenous name shown on this entry" });
  }
  // idempotency
  const existing = await db.citation.findMany({ select: { targetType: true, targetId: true, url: true, title: true } });
  const key = (r: { targetType: string; targetId: string; url?: string | null; title: string }) => `${r.targetType}|${r.targetId}|${r.url ?? r.title}`;
  const seen = new Set(existing.map(key));
  const toInsert = rows.filter((r) => { const k = key(r); if (seen.has(k)) return false; seen.add(k); return true; });
  const byKind = toInsert.reduce<Record<string, number>>((a, r) => { a[r.kind] = (a[r.kind] ?? 0) + 1; return a; }, {});
  const byTarget = toInsert.reduce<Record<string, number>>((a, r) => { a[r.targetType] = (a[r.targetType] ?? 0) + 1; return a; }, {});
  const backupFile = writeBackup("2026-10-19-citations-seed-before", { note: "inserts only", existingCitations: existing.length });
  report("citations seed", { toInsert: toInsert.length, byKind, byTarget, skippedWikipediaGuides: skippedWikipedia, sample: toInsert.slice(0, 3), backupFile });
  if (!APPLY) return;
  for (let i = 0; i < toInsert.length; i += 200) await db.citation.createMany({ data: toInsert.slice(i, i + 200).map((r) => ({ ...r, updatedAt: new Date() })) });
  report("verify", { citations: await db.citation.count(), targetsWithCitations: (await db.citation.groupBy({ by: ["targetType", "targetId"] })).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
