// Roadmap item 7 (2026-10-20): then-and-now pairs. Each pair names two Wikimedia Commons files,
// a period image and a modern photograph of the same spot. At run time the script reads each
// file's author and licence from the Commons API (so the credit is what Commons records, not
// what was typed), copies both images to R2 (then-and-now/<id>/then.jpg, now.jpg) and writes
// the ThenAndNow row placed on the app's own Location or Waterway, looked up by exact name.
//   bun run prisma/turso-migrations/2026-10-20-then-and-now-seed.ts [--apply] [--only <id substring>] [--check]
// Only public-domain and Creative Commons files are accepted; any other licence aborts the run.
import { db } from "../../src/db";
import { env } from "../../src/env";
import { cdnObjectExists, uploadImageFromUrl } from "../../src/lib/image-cdn";
import { APPLY, writeBackup, report } from "./lib/migration";

interface Side { file?: string; url?: string; credit?: string; year?: number; yearLabel?: string; caption: string }
interface Pair {
  id: string; title: string; location?: string; waterway?: string; lat?: number; lng?: number;
  /** Either a Commons file (author and licence read from Commons, image copied to R2) or an image already on R2 with the credit recorded when it was added to the gallery. */
  then: Side;
  now: Side;
  note: string;
}

const PAIRS: Pair[] = [
  {
    id: "tn_chilkoot_summit", title: "The summit of the Chilkoot Pass", location: "Chilkoot Pass",
    then: { file: "Chilkoot Pass summit.jpg", year: 1899, yearLabel: "winter 1898–99", caption: "Stampeders and their caches at the summit of the Chilkoot Pass, where the North-West Mounted Police checked each outfit, photographed by Eric A. Hegg." },
    now: { file: "Chilkoot Trail Summit Tea Break (9434243470).jpg", year: 2013, caption: "Hikers resting at the summit on the Chilkoot Trail, the border between Alaska and British Columbia." },
    note: "In the winter of 1897–98 the pass carried about 22,000 people and their year's provisions up the Golden Stairs. The railway over the White Pass opened in 1899 and the trail emptied; it is hiked now, in a historic site shared by Parks Canada and the U.S. National Park Service.",
  },
  {
    id: "tn_dawson_city", title: "Dawson City", location: "Dawson City",
    then: { file: "Front St, Dawson, Yukon Territory, June 1898 (HEGG 400).jpeg", year: 1898, yearLabel: "June 1898", caption: "Front Street in the first summer of the rush, a dog team hauling a cart past Jo's Juneau Restaurant, photographed by Eric A. Hegg." },
    now: { file: "Palace Grand Theatre at Sunset - Dawson City - Yukon Territory - Canada.jpg", year: 2011, caption: "The Palace Grand Theatre of 1899, rebuilt by Parks Canada in 1962, on King Street two blocks from the river." },
    note: "Seventeen thousand people in the summer of 1898; about 1,500 live in Dawson now. The wooden false fronts and boardwalks are kept or rebuilt by Klondike National Historic Sites, and the river still runs past the end of Front Street.",
  },
  {
    id: "tn_miles_canyon", title: "Miles Canyon", location: "Miles Canyon",
    then: { file: "Small boat navigating the upper end of Miles Canyon on the Yukon River, Yukon Territory, 1898 (HEGG 359).jpeg", year: 1898, caption: "A stampeders' boat entering the upper end of Miles Canyon in 1898, photographed by Eric A. Hegg." },
    now: { file: "Miles Canyon -suspension bridge- (44459227661).jpg", year: 2018, caption: "The canyon today under the Robert Lowe suspension bridge of 1922, its water slowed by the Whitehorse dam." },
    note: "Several hundred people drowned here and in the White Horse Rapids below before Sam Steele's police made the rules of 1898. The hydro dam of 1958 drowned the rapids and calmed the canyon.",
  },
  {
    id: "tn_beechey_island", title: "The graves on Beechey Island", location: "Beechey Island",
    then: { file: "Graves of Franklin's men on Beechey Island.jpg", year: 1854, caption: "The graves of three of Franklin's men, found by the search expeditions of 1850–51, drawn for Elisha Kent Kane's narrative." },
    now: { file: "Beechey Island 009-AXW 0884.jpg", year: 2010, caption: "The same graves, with their replacement headboards, on the gravel of Beechey Island." },
    note: "Franklin's ships wintered here in 1845–46 and left three men in the ground: John Torrington, John Hartnell and William Braine. The site is a territorial historic site of Nunavut; the headboards are replicas of the originals.",
  },
  {
    id: "tn_place_royale", title: "Place Royale, Quebec", location: "Quebec City",
    then: { file: "Place Royale, Quebec City, 1933.jpg", year: 1933, caption: "Place Royale in the Lower Town of Quebec in 1933, with the church of Notre-Dame-des-Victoires, photographed by Clifford M. Johnston." },
    now: { file: "Buildings located at Place Royale, Québec 20170413 1.jpg", year: 2017, caption: "Place Royale in 2017, the square and its stone houses restored to their eighteenth-century lines." },
    note: "Champlain's Habitation of 1608 stood on this square. The church was begun in 1687 on its site; the square was restored between the 1960s and the 1980s to the appearance of New France.",
  },
  {
    id: "tn_fort_st_james", title: "Fort St. James", location: "Fort St. James",
    then: { file: "Obliging Very - A sketch of Fort St. James 1879.jpg", year: 1879, caption: "Fort St. James on Stuart Lake, sketched by H. Bullock Webster in 1879." },
    now: { file: "FORT ST. JAMES NATIONAL HISTORIC SITE , BRITISH COLUMBIA.jpg", year: 2008, caption: "The fur warehouse of the Hudson's Bay Company's post at Fort St. James National Historic Site." },
    note: "Simon Fraser and John Stuart built the first post here in 1806, in Kwah's country. The buildings standing are the Hudson's Bay Company's of the 1880s, restored by Parks Canada to 1896.",
  },
  {
    id: "tn_fort_langley", title: "Fort Langley", location: "Fort Langley",
    then: { file: "Langley Butte - NARA - 102278830 (page 1).jpg", year: 1858, yearLabel: "September 1858", caption: "The Hudson's Bay Company's Fort Langley on the left bank of the Fraser, with the Langley Buttes beyond, photographed by the boundary survey on 23 September 1858." },
    now: { file: "2018 05 27d Fort Langley 8 (42812155112).jpg", year: 2018, caption: "The palisade gate of Fort Langley National Historic Site, rebuilt on the fort's ground." },
    note: "James Douglas took the oath as first governor of British Columbia here on 19 November 1858, weeks after the photograph. One original building, the storehouse of 1840, survives inside the reconstructed palisade.",
  },
  {
    id: "tn_fort_edmonton", title: "Fort Edmonton", location: "Fort Edmonton",
    then: { file: "Kane Fort Edmonton.jpg", year: 1849, yearLabel: "1849–56", caption: "Fort Edmonton above the North Saskatchewan, painted by Paul Kane from his visit of 1846." },
    now: { file: "Fort Edmonton Cabin.jpg", year: 2003, caption: "A cabin inside the reconstructed fort of 1846 at Fort Edmonton Park." },
    note: "The fort Kane painted stood on the river flat below the legislature until 1915. Fort Edmonton Park rebuilt it in the 1970s on a different stretch of the river, to Kane's and the company's records.",
  },
  {
    id: "tn_fort_william", title: "Fort William", location: "Fort William",
    then: { url: "https://pub-376806a1556549999cfff53a786882dd.r2.dev/locations/cmlhbjrr2000vm2mb4xb3au6o/gallery-0.jpg", credit: "Wikimedia Commons / Library and Archives Canada via Commons / Public Domain Mark / PD-Art", yearLabel: "North West Company years", caption: "The North West Company's Fort William on the Kaministiquia, in a period watercolour held by Library and Archives Canada." },
    now: { file: "Fort William Historical Park (50402803861).jpg", year: 2020, caption: "The reconstructed fort at Fort William Historical Park, built upstream of the original site at Pointe de Meuron." },
    note: "The original fort of 1803 disappeared under the Canadian Pacific Railway's yards in the 1880s. The reconstruction of the 1970s stands nine miles up the river, with the Great Hall, the palisade and the farm rebuilt to the company's plans.",
  },
  {
    id: "tn_upper_fort_garry", title: "Upper Fort Garry", location: "Upper Fort Garry",
    then: { url: "https://pub-376806a1556549999cfff53a786882dd.r2.dev/locations/cmligbl0q002cm20z7q06luf5/gallery-2.jpg", credit: "Wikimedia Commons / Library and Archives Canada via Commons / historical image", year: 1872, yearLabel: "about 1872", caption: "Upper Fort Garry at the Forks of the Red and the Assiniboine, about 1872, in a photograph held by Library and Archives Canada." },
    now: { file: "Governor’s Gate, Upper Fort Garry Provincial Park, Winnipeg, Manitoba 2019 07 22.jpg", year: 2019, caption: "The Governor's Gate of 1853, the one piece of the fort still standing, in Upper Fort Garry Provincial Park in downtown Winnipeg." },
    note: "Riel's provisional government sat here in 1869–70. The city took the fort down in the 1880s for Main Street; the gate was kept, and the park of 2015 marks the walls' lines in the pavement.",
  },
  {
    id: "tn_lachine_rapids", title: "The Lachine Rapids", location: "Lachine",
    then: { file: "Steamer Rapids King, Lachine Rapids 1901 (8525827850).jpg", year: 1901, caption: "The steamer Rapids King shooting the Lachine Rapids in 1901, on a postcard of the day." },
    now: { file: "Rapides de Lachine 2.jpg", year: 2006, caption: "The rapids today from the Montreal shore, with the Mercier bridge beyond." },
    note: "The rapids stopped every ship above Montreal; Lachine, above them, was where the canoe brigades loaded. Excursion steamers ran them with Mohawk pilots from Kahnawake for a century; the Lachine Canal of 1825 and the Seaway of 1959 went round them.",
  },
  {
    id: "tn_tadoussac", title: "Tadoussac", location: "Tadoussac",
    then: { url: "https://pub-376806a1556549999cfff53a786882dd.r2.dev/locations/cmlhbjrrk0019m2mbo76o9uph/gallery-2.jpg", credit: "Wikimedia Commons / historical scan / Public domain", year: 1910, caption: "Tadoussac at the meeting of the Saguenay and the St. Lawrence, in a view published in 1910." },
    now: { file: "Historic Hotel in Tadoussac - Quebec Canada.jpg", year: 2023, caption: "The Hotel Tadoussac of 1942 on the bay, on the site of the hotel of 1864." },
    note: "Chauvin's trading post of 1600 stood at the bay, the first French post in Canada; Champlain called here in 1603 and 1608. The whale-watching town of today is on the same cove.",
  },
  {
    id: "tn_montreal_harbour", title: "Montreal harbour", location: "Montreal",
    then: { url: "https://pub-376806a1556549999cfff53a786882dd.r2.dev/locations/cmlhasls40020m2zhz16w8vz5/gallery-4.jpg", credit: "Wikimedia Commons / Public Domain", year: 1878, caption: "Montreal harbour in 1878, the commercial heart of the fur trade." },
    now: { file: "Old Port of Montreal.jpg", year: 2012, caption: "The Old Port today, the quays of the nineteenth century turned to parks and marinas." },
    note: "The Montreal fur trade shipped its furs from these quays until 1821, and the port grew into Canada's largest through the century that followed. The working port moved downstream in the 1970s and the old quays became the Vieux-Port.",
  },
  {
    id: "tn_port_royal", title: "The Habitation at Port-Royal", location: "Port-Royal (Habitation)",
    then: { file: "1613 Habitation Port Royal.jpg", year: 1613, caption: "The Habitation at Port-Royal as Champlain drew it for his Voyages of 1613." },
    now: { file: "Interior Yard and Well, Port-Royal Habitation, Nova Scotia (3618040959).jpg", year: 2009, caption: "The courtyard and well of the reconstructed Habitation at Port-Royal National Historic Site." },
    note: "De Mons and Champlain built the Habitation in 1605; Argall's Virginians burned it in 1613, the year Champlain's drawing was printed. Parks Canada rebuilt it from the drawing in 1939–41 on the original site, in Membertou's country.",
  },
  {
    id: "tn_fort_frontenac", title: "Fort Frontenac", location: "Fort Frontenac",
    then: { file: "Fort frontenac.jpg", year: 1685, caption: "Fort Frontenac at Cataraqui in 1685, in a plan of the French fort." },
    now: { file: "2018-10-05 Fort Frontenac 005.jpg", year: 2018, caption: "The Fort Frontenac of today, a Canadian Forces college on the site in Kingston." },
    note: "Frontenac built the fort in 1673 and La Salle held it as his seigneury; the French demolished it in 1758 before Bradstreet's attack. The British fort and the city of Kingston grew on the ground, and the army still holds it.",
  },
];

const UA = "CanadianWaterwaysExplorer/1.0 (https://github.com/bterhart/canadian-waterways-explorer-app)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Fetch with a pause between calls and a backoff on 429; Commons throttles this address readily. */
let apiThrottled = false;
async function politeFetch(url: string): Promise<Response> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status !== 429) return res;
    await sleep(8000 * (attempt + 1));
  }
  return fetch(url, { headers: { "User-Agent": UA } });
}
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
const filePath = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`;
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s: string) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => (e[0] === "#" ? String.fromCodePoint(parseInt(e[1] === "x" || e[1] === "X" ? e.slice(2) : e.slice(1), e[1] === "x" || e[1] === "X" ? 16 : 10)) : ENTITIES[e.toLowerCase()] ?? m));
const strip = (s: string) => decode(s.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
// A Creator template renders the name once per language; "Unknown authorUnknown author" becomes one.
const dedupe = (s: string) => s.replace(/^(.{3,}?)\1/, "$1");
const ALLOWED = /^(Public domain|PDM|CC0|CC BY( |-)|CC BY-SA( |-)|No restrictions)/i;

/**
 * The file's author and licence. Commons' api.php answered 429 for this session after the first
 * burst of searches, while the file pages themselves still answered, so the page is the
 * fallback: the licence from its licensetpl_short span, the author from the fileinfotpl_aut row.
 */
async function commonsInfo(file: string): Promise<{ artist: string; license: string }> {
  const title = `File:${file}`;
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=Artist|LicenseShortName&titles=${encodeURIComponent(title)}`;
  if (!apiThrottled) {
    const res = await fetch(api, { headers: { "User-Agent": UA } });
    if (res.ok) {
      const json = (await res.json()) as { query?: { pages?: Record<string, { missing?: string; imageinfo?: { extmetadata?: Record<string, { value: string }> }[] }> } };
      const page = Object.values(json.query?.pages ?? {})[0];
      if (!page || page.missing !== undefined) throw new Error(`Commons file not found: ${file}`);
      const em = page.imageinfo?.[0]?.extmetadata ?? {};
      return { artist: strip(em.Artist?.value ?? "") || "unknown author", license: strip(em.LicenseShortName?.value ?? "") };
    }
    if (res.status === 429) apiThrottled = true; // the file pages still answer; stop asking the api
    await sleep(3000);
  }
  const pageRes = await politeFetch(commonsPage(file));
  if (pageRes.status === 404) throw new Error(`Commons file not found: ${file}`);
  if (!pageRes.ok) throw new Error(`Commons ${pageRes.status} for ${file}`);
  const html = await pageRes.text();
  if (/There is no file by this name|class="noarticletext"/.test(html)) throw new Error(`Commons file not found: ${file}`);
  // Commons escapes the underscore in these class and id names as &#95; in the served HTML.
  const lics = [...html.matchAll(/<span class="licensetpl(?:_|&#95;)short"[^>]*>([^<]+)<\/span>/g)].map((m) => strip(m[1] ?? "")).filter(Boolean);
  const aut = html.match(/<td id="fileinfotpl(?:_|&#95;)aut"[^>]*>[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/);
  const license = lics.find((l) => ALLOWED.test(l)) ?? lics[0] ?? "";
  if (!license) throw new Error(`no licence found on the page of ${file}`);
  return { artist: aut ? dedupe(strip(aut[1] ?? "")).slice(0, 120) || "unknown author" : "unknown author", license };
}

async function main() {
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1]?.toLowerCase() ?? null : null;
  const [locations, waterways] = await Promise.all([db.location.findMany({ select: { id: true, name: true, latitude: true, longitude: true } }), db.waterway.findMany({ select: { id: true, name: true, latitude: true, longitude: true } })]);
  const L = new Map(locations.map((x) => [x.name, x])), W = new Map(waterways.map((x) => [x.name, x]));
  const problems: string[] = [];
  const pairs = PAIRS.filter((p) => !only || p.id.includes(only));
  for (const p of pairs) {
    if (p.location && !L.has(p.location)) problems.push(`location not found: ${p.location} (${p.id})`);
    if (p.waterway && !W.has(p.waterway)) problems.push(`waterway not found: ${p.waterway} (${p.id})`);
    if (!p.location && !p.waterway && (p.lat === undefined || p.lng === undefined)) problems.push(`no place and no coordinates: ${p.id}`);
    for (const [name, side] of [["then", p.then], ["now", p.now]] as const) {
      if (!side.file && !(side.url && side.credit)) problems.push(`${p.id} ${name}: needs a Commons file or an R2 url with its credit`);
    }
  }
  const before = await db.thenAndNow.findMany();
  const backupFile = writeBackup("2026-10-20-then-and-now-before", { pairs: before });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("then-and-now pairs", { pairs: pairs.length, backupFile, plan: pairs.map((p) => ({ id: p.id, title: p.title, place: p.location ?? p.waterway, then: p.then.file ?? "R2 gallery image", now: p.now.file })) });
  if (process.argv.includes("--check")) {
    // Licence and author of every Commons file, without uploading or writing anything.
    const checked: Record<string, unknown>[] = [];
    for (const p of pairs) {
      for (const [name, side] of [["then", p.then], ["now", p.now]] as const) {
        if (!side.file) continue;
        try {
          const info = await commonsInfo(side.file);
          checked.push({ id: p.id, side: name, file: side.file, ...info, ok: ALLOWED.test(info.license) });
        } catch (e) {
          checked.push({ id: p.id, side: name, file: side.file, error: (e as Error).message, ok: false });
        }
        await sleep(5000);
      }
    }
    report("check", { files: checked.length, notOk: checked.filter((c) => !c.ok), checked });
    return;
  }
  if (!APPLY) return;
  const results: Record<string, unknown>[] = [];
  let i = 0;
  for (const p of pairs) {
    i += 1;
    const resolveSide = async (side: Side, name: "then" | "now"): Promise<{ url: string; credit: string; sourceUrl: string | null; label: string }> => {
      if (side.url) return { url: side.url, credit: side.credit!, sourceUrl: null, label: side.credit! };
      const info = await commonsInfo(side.file!);
      if (!ALLOWED.test(info.license)) throw new Error(`${p.id} ${name}: licence "${info.license}" is not public domain or Creative Commons; aborting`);
      // Resumable: a copy already on R2 (from an earlier run that Commons' throttling cut short) is kept.
      const cdnPath = `then-and-now/${p.id}/${name}.jpg`;
      let url: string;
      if (await cdnObjectExists(cdnPath)) {
        url = `${env.R2_PUBLIC_URL}/${cdnPath}`;
      } else {
        await sleep(6000);
        url = await uploadImageFromUrl(filePath(side.file!), cdnPath);
        await sleep(6000);
      }
      return { url, credit: `Wikimedia Commons / ${info.artist} / ${info.license}`, sourceUrl: commonsPage(side.file!), label: `${info.artist} / ${info.license}` };
    };
    const thenSide = await resolveSide(p.then, "then");
    const nowSide = await resolveSide(p.now, "now");
    const thenUrl = thenSide.url, nowUrl = nowSide.url;
    const place = p.location ? L.get(p.location)! : p.waterway ? W.get(p.waterway)! : null;
    const data = {
      title: p.title, locationId: p.location ? L.get(p.location)!.id : null, waterwayId: p.waterway ? W.get(p.waterway)!.id : null,
      latitude: p.lat ?? place!.latitude, longitude: p.lng ?? place!.longitude,
      thenUrl, thenYear: p.then.year ?? null, thenYearLabel: p.then.yearLabel ?? null, thenCaption: p.then.caption, thenCredit: thenSide.credit, thenSourceUrl: thenSide.sourceUrl,
      nowUrl, nowYear: p.now.year ?? null, nowCaption: p.now.caption, nowCredit: nowSide.credit, nowSourceUrl: nowSide.sourceUrl,
      note: p.note, sortOrder: i,
    };
    await db.thenAndNow.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
    results.push({ id: p.id, then: thenSide.label, now: nowSide.label });
    console.log(`  ${p.id}: then ${thenSide.label} | now ${nowSide.label}`);
  }
  const verify = await db.thenAndNow.findMany({ select: { id: true, title: true, locationId: true, waterwayId: true }, orderBy: { thenYear: "asc" } });
  report("verify", { pairs: verify.length, placed: verify.filter((v) => v.locationId || v.waterwayId).length, results });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
