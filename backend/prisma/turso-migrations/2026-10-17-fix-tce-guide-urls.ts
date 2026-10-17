// Repair the Canadian Encyclopedia reading-guide links that do not resolve (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-fix-tce-guide-urls.ts [--apply]
//
// thecanadianencyclopedia.ca answers 403 to plain HTTP clients and could not be checked when
// the guides were imported; checked with a browser user agent, 48 of its 164 guide URLs in
// Turso return 404 (guessed slugs). For each dead URL this script tries the candidate
// replacements below in order, live, at dry run: the first that answers 200 (Canadian
// Encyclopedia with the browser agent, Wikipedia by HEAD, the Dictionary of Canadian
// Biography by page title) is written to the row with its author source. A row with no
// working candidate is deleted rather than left pointing at a 404, and the deletion is
// listed. Backup of every touched row is written first.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const tce = (s: string) => `https://www.thecanadianencyclopedia.ca/en/article/${s}`;
const wiki = (s: string) => `https://en.wikipedia.org/wiki/${s}`;
const dcb = (s: string) => `https://www.biographi.ca/en/bio/${s}.html`;
const sourceOf = (u: string) => u.includes("thecanadianencyclopedia") ? "The Canadian Encyclopedia" : u.includes("biographi.ca") ? "Dictionary of Canadian Biography" : "Wikipedia";

// Dead slug (the part after /en/article/) → candidate replacement URLs, best first.
const CANDIDATES: Record<string, string[]> = {
  "fort-temiscamingue": [tce("fort-temiscamingue-national-historic-site"), wiki("Fort_Témiscamingue")],
  "lake-erie": [wiki("Lake_Erie")],
  "lake-michigan": [wiki("Lake_Michigan")],
  "fort-albany": [wiki("Fort_Albany,_Ontario"), wiki("Fort_Albany_First_Nation")],
  "fort-severn": [wiki("Fort_Severn,_Ontario"), wiki("Fort_Severn_First_Nation")],
  "oxford-house": [wiki("Oxford_House,_Manitoba")],
  "fort-norman": [wiki("Tulita")],
  "fort-kamloops": [tce("kamloops"), wiki("Fort_Kamloops")],
  "fort-yukon": [wiki("Fort_Yukon,_Alaska")],
  "fort-dunvegan": [wiki("Dunvegan,_Alberta"), wiki("Fort_Dunvegan")],
  "fort-alexandria": [wiki("Fort_Alexandria")],
  "fort-alexander": [wiki("Fort_Alexander,_Manitoba"), wiki("Sagkeeng_First_Nation")],
  "fort-rae": [wiki("Behchokǫ̀"), wiki("Fort_Rae")],
  "fort-rupert": [wiki("Fort_Rupert,_British_Columbia"), wiki("Fort_Rupert")],
  "ottawa-river": [tce("ottawa-river")],
  "martin-frobisher": [tce("sir-martin-frobisher"), dcb("frobisher_martin_1E")],
  "jean-baptiste-de-la-verendrye": [dcb("gaultier_de_la_verendrye_jean_baptiste_2E"), wiki("Jean_Baptiste_de_La_Vérendrye")],
  "sir-robert-mcclure": [dcb("mcclure_robert_john_le_mesurier_10E"), wiki("Robert_McClure")],
  "queen-maud-gulf": [wiki("Queen_Maud_Gulf")],
  "terror-bay": [wiki("Terror_Bay")],
  "david-thompson-explorer": [tce("david-thompson"), dcb("thompson_david_1770_1857_8E")],
  "pierre-gaultier-de-varennes-sieur-de-la-verendrye": [tce("pierre-gaultier-de-varennes-et-de-la-verendrye"), dcb("gaultier_de_varennes_et_de_la_verendrye_pierre_3E")],
  "joseph-burr-tyrrell": [tce("joseph-burr-tyrrell"), wiki("Joseph_Tyrrell")],
  "matthew-cocking": [dcb("cocking_matthew_4E"), wiki("Matthew_Cocking")],
  "rene-robert-cavelier-sieur-de-la-salle": [tce("rene-robert-cavelier-de-la-salle"), dcb("cavelier_de_la_salle_rene_robert_1E")],
  "akaitcho": [wiki("Akaitcho")],
  "big-bear-mistahimaskwa": [tce("big-bear"), dcb("mistahimaskwa_11E")],
  "crowfoot-isapo-muxika": [tce("crowfoot"), dcb("isapo_muxika_11E")],
  "chief-peguis": [tce("peguis"), dcb("peguis_9E")],
  "marie-anne-gaboury": [wiki("Marie-Anne_Gaboury"), dcb("gaboury_marie_anne_10E")],
  "jean-baptiste-lagimodiere": [wiki("Jean-Baptiste_Lagimodière"), dcb("lagimodiere_jean_baptiste_8E")],
  "john-davis": [tce("john-davis"), dcb("davis_john_1605_1E")],
  "isabel-gunn": [wiki("Isabel_Gunn"), dcb("gunn_isabel_9E")],
  "jacques-de-noyon": [dcb("noyon_jacques_de_3E"), wiki("Jacques_de_Noyon")],
  "james-knight": [dcb("knight_james_2E"), wiki("James_Knight_(sea_captain)")],
  "jean-nicolet-de-belleborne": [dcb("nicollet_de_belleborne_jean_1E"), wiki("Jean_Nicolet")],
  "moses-norton": [dcb("norton_moses_4E"), wiki("Moses_Norton")],
  "pierre-gaultier-de-la-verendrye-fils": [dcb("gaultier_de_la_verendrye_pierre_3E"), wiki("Pierre_Gaultier_de_La_Vérendrye_(1714–1755)")],
  "pierre-le-moyne-d-iberville": [tce("pierre-le-moyne-diberville"), dcb("le_moyne_d_iberville_et_d_ardillieres_pierre_2E"), wiki("Pierre_Le_Moyne_d'Iberville")],
  "mississippi-river": [wiki("Mississippi_River")],
  "richelieu-river": [wiki("Richelieu_River")],
  "michilimackinac": [wiki("Fort_Michilimackinac")],
  "great-peace-of-montreal-1701": [tce("peace-of-montreal-1701"), wiki("Great_Peace_of_Montreal")],
  "membertou": [tce("henri-membertou"), dcb("membertou_1E"), wiki("Henri_Membertou")],
  "kootenay-ktunaxa": [tce("ktunaxa-kootenay"), tce("kootenay"), wiki("Ktunaxa")],
  "amelia-douglas": [wiki("Amelia_Douglas")],
};

const okCache = new Map<string, boolean>();
async function works(url: string): Promise<boolean> {
  if (okCache.has(url)) return okCache.get(url)!;
  let ok = false;
  try {
    if (url.includes("thecanadianencyclopedia")) { const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": BROWSER_UA, Accept: "text/html" } }); ok = r.status === 200; }
    else if (url.includes("biographi.ca")) { const html = await (await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } })).text(); ok = !/<title>Biography not found/.test(html); }
    else { const r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } }); ok = r.ok; }
  } catch { ok = false; }
  okCache.set(url, ok);
  await new Promise((r) => setTimeout(r, 300));
  return ok;
}

async function main() {
  const rows = await db.readingGuide.findMany({ where: { url: { contains: "thecanadianencyclopedia.ca" } }, select: { id: true, title: true, url: true, authorSource: true, targetType: true, targetId: true } });
  const dead = [] as typeof rows;
  for (const r of rows) if (!(await works(r.url!))) dead.push(r);
  const updates: Array<{ id: string; title: string; from: string; to: string; authorSource: string }> = [];
  const deletions: Array<{ id: string; title: string; url: string }> = [];
  const unmapped: string[] = [];
  for (const r of dead) {
    const slug = r.url!.replace(/^.*\/en\/article\//, "").replace(/\s.*$/, "");
    const cands = CANDIDATES[slug];
    if (!cands) { unmapped.push(`${r.id} | ${r.title} | ${r.url}`); continue; }
    let chosen: string | null = null;
    for (const c of cands) if (await works(c)) { chosen = c; break; }
    if (chosen) updates.push({ id: r.id, title: r.title, from: r.url!, to: chosen, authorSource: sourceOf(chosen) });
    else deletions.push({ id: r.id, title: r.title, url: r.url! });
  }
  const backupFile = writeBackup("2026-10-17-fix-tce-guide-urls-before", { rows: dead });
  report("fix Canadian Encyclopedia guide URLs", { tceRows: rows.length, dead: dead.length, updates: updates.map((u) => `${u.title}: ${u.from.replace(/^.*\/en\/article\//, "")} → ${u.to}`), deletions: deletions.map((d) => `${d.id} | ${d.title} | ${d.url}`), unmapped, backupFile });
  if (unmapped.length) throw new Error("Add candidates for the unmapped rows first.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of updates) await tx.readingGuide.update({ where: { id: u.id }, data: { url: u.to, authorSource: u.authorSource } });
    for (const d of deletions) await tx.readingGuide.delete({ where: { id: d.id } });
  });
  const after = await db.readingGuide.findMany({ where: { url: { contains: "thecanadianencyclopedia.ca" } }, select: { url: true } });
  let stillDead = 0; for (const a of after) if (!(await works(a.url!))) stillDead++;
  report("verify", { tceRowsNow: after.length, stillDead, guides: await db.readingGuide.count() });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
