// 2026-10-21 (owner's ask): the 27 edition citations written by passes 13 and 15 carry a title but no
// URL, so the pair pages of the primary-source literacy unit (10.29) cannot open the edition. This
// sets each URL to the Internet Archive item, Project Gutenberg text or Dictionary of Canadian
// Biography page the edition was read in. Before anything is written, every Internet Archive
// identifier is checked against archive.org's metadata (it must exist and carry the edition's year)
// and every other URL must answer 200; a failure aborts the whole run.
//   bun run prisma/turso-migrations/2026-10-21-citation-urls.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;
const DCB = (slug: string) => `https://www.biographi.ca/en/bio/${slug}.html`;

/** citation id → { url, year the archive item should carry (Internet Archive only) } */
const URLS: Record<string, { url: string; year?: string }> = {
  cmvetn25d00h27dkxkubtlzaz: { url: IA("davidthompsonsna12thom"), year: "1916" },      // Thompson, Narrative (Champlain Society, 1916): Columbia descent
  cmvetn25d00h77dkxcw17rfx3: { url: IA("davidthompsonsna12thom"), year: "1916" },      // Thompson, Narrative: Saukamappee's account
  cmvetn25d00h37dkx6njq9to1: { url: IA("journeyfromprinc00hearuoft"), year: "1911" },  // Hearne, Journey (Champlain Society, 1911): Coppermine
  cmvetn25d00h97dkxpmhyytm4: { url: IA("journeyfromprinc00hearuoft"), year: "1911" },  // Hearne, Journey: Matonabbee's words
  cmvetn25d00hr7dkxnz9sggsc: { url: IA("journeyfromprinc00hearuoft"), year: "1911" },  // Hearne, Journey: Norton's orders of 7 December 1770
  cmvetn25d00h47dkxqg0hdkp9: { url: "https://www.gutenberg.org/ebooks/35659" },        // Mackenzie, Voyages (1801), vol. II: Fort Fork, May 1793
  cmvetn25d00h57dkxwf8mnvro: { url: "https://www.gutenberg.org/ebooks/35659" },        // Mackenzie, Voyages, vol. II: the rock, 22 July 1793
  cmvetn25d00h67dkxq0vpi4jh: { url: "https://www.gutenberg.org/ebooks/35659" },        // Mackenzie, Voyages, vol. II: 13 June 1793
  cmvetn25d00ha7dkxm5c3k78h: { url: IA("P000159"), year: "1889" },                     // Fraser's journal in Masson, Les Bourgeois, vol. I (1889)
  cmvetn25d00hb7dkxfmamp4sl: { url: IA("melancholyfateof00raej"), year: "1854" },      // Rae's letter in The Melancholy Fate of Sir John Franklin (1854)
  cmvetn25d00hc7dkxqzuz8ggr: { url: IA("worksofsamueldec02chamuoft"), year: "1922" },  // Champlain, Works, vol. II (Biggar): Quebec, 1608
  cmvetn25d00hd7dkxxu3lwlb4: { url: IA("worksofsamueldec02chamuoft"), year: "1922" },  // Champlain, Works, vol. II: Place Royale, 1611
  cmvetn25d00he7dkxogivet7b: { url: IA("worksofsamueldec02chamuoft"), year: "1922" },  // Champlain, Works, vol. II: memorial of 1618
  cmvetn25d00hf7dkxp7eketm2: { url: IA("voyagesofjacques0000hpbi"), year: "1924" },    // Biggar, Voyages of Jacques Cartier (1924): Gaspé
  cmvetn25d00hg7dkxctb8l2re: { url: IA("voyagesofjacques0000hpbi"), year: "1924" },    // Biggar, Cartier: Hochelaga
  cmvetn25d00hh7dkxa9o7jnyy: { url: IA("voyagesofjacques0000hpbi"), year: "1924" },    // Biggar, Cartier: the scurvy winter
  cmvetn25d00hi7dkxf22oak5d: { url: IA("cihm_36227"), year: "1846" },                  // French, Historical Collections of Louisiana, part I (1846)
  cmvetn25d00hj7dkxtoakdyyb: { url: IA("joutelsjournalof010248mbp"), year: "1906" },   // Joutel's Journal, ed. Stiles (1906)
  cmvetn25d00hk7dkx271swef2: { url: IA("cihm_29129"), year: "1897" },                  // Tyrrell, Report on the Doobaunt, Kazan and Ferguson Rivers (1897)
  cmvetn25d00hl7dkxa9h1e54l: { url: IA("P001699"), year: "1887" },                     // Tyrrell, Report on a Part of Northern Alberta (1887)
  cmvetn25d00hm7dkx0fvo0yxz: { url: IA("narrativeofarctic00back"), year: "1836" },     // Back, Narrative (1836): the river's mouth
  cmvetn25d00hn7dkxocn2ukra: { url: IA("narrativeofarctic00back"), year: "1836" },     // Back, Narrative: Fort Reliance winter
  cmvetn25d00h87dkxjibzcsaf: { url: DCB("thanadelthur_2E") },                          // DCB vol. II, Thanadelthur
  cmvetn25d00ho7dkxk1r0z0f8: { url: DCB("fidler_peter_6E") },                          // DCB vol. VI, Fidler
  cmvetn25d00hp7dkxk1c8iclr: { url: DCB("turnor_philip_4E") },                         // DCB vol. IV, Turnor: the 1778 engagement
  cmvetn25d00hq7dkxvd80cxd4: { url: DCB("turnor_philip_4E") },                         // DCB vol. IV, Turnor: the 1790-92 journal
  cmvetn25d00hs7dkxwsexq0jf: { url: DCB("stuart_william_2E") },                        // DCB vol. II, Stuart
};

async function checkUrl(entry: { url: string; year?: string }): Promise<string | null> {
  const m = entry.url.match(/^https:\/\/archive\.org\/details\/([^/]+)$/);
  try {
    if (m) {
      const res = await fetch(`https://archive.org/metadata/${m[1]}`);
      if (!res.ok) return `metadata ${res.status}`;
      const json = (await res.json()) as { metadata?: { year?: string | string[]; date?: string; title?: string } };
      if (!json.metadata?.title) return "no metadata (item missing)";
      const years = [json.metadata.year, json.metadata.date].flat().filter(Boolean).map(String).join(" ");
      if (entry.year && !years.includes(entry.year)) return `year ${years || "?"} ≠ ${entry.year} (${json.metadata.title})`;
      return null;
    }
    const res = await fetch(entry.url, { method: "GET", headers: { "User-Agent": "Mozilla/5.0 (compatible; canadian-waterways-explorer-app citation check)" } });
    return res.ok ? null : `HTTP ${res.status}`;
  } catch (e) {
    return (e as Error).message;
  }
}

async function main() {
  const ids = Object.keys(URLS);
  const cits = await db.citation.findMany({ where: { id: { in: ids } } });
  const problems: string[] = [];
  const byId = new Map(cits.map((c) => [c.id, c]));
  for (const id of ids) {
    const c = byId.get(id);
    if (!c) { problems.push(`citation ${id} not found`); continue; }
    if (c.kind !== "edition" || c.targetType !== "document") problems.push(`citation ${id} is ${c.kind}/${c.targetType}, not an edition citation of a document`);
    if (c.url) problems.push(`citation ${id} already has a URL: ${c.url}`);
  }
  const checks: Record<string, string | null> = {};
  for (const url of new Set(Object.values(URLS).map((u) => u.url))) {
    const entry = Object.values(URLS).find((u) => u.url === url)!;
    checks[url] = await checkUrl(entry);
    if (checks[url]) problems.push(`${url}: ${checks[url]}`);
  }
  const remaining = await db.citation.count({ where: { targetType: "document", kind: "edition", url: null, id: { notIn: ids } } });
  const backupFile = writeBackup("2026-10-21-citation-urls-before", { citations: cits });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("citation urls", { backupFile, citations: ids.length, distinctUrls: Object.keys(checks).length, allReachable: true, editionCitationsStillWithoutUrl: remaining, plan: ids.map((id) => ({ id, title: byId.get(id)!.title.slice(0, 70), url: URLS[id]!.url })) });
  if (!APPLY) return;
  for (const id of ids) await db.citation.update({ where: { id }, data: { url: URLS[id]!.url } });
  report("verify", { withUrl: await db.citation.count({ where: { targetType: "document", kind: "edition", url: { not: null } } }), withoutUrl: await db.citation.count({ where: { targetType: "document", kind: "edition", url: null } }) });
}

await main();
