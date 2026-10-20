// Roadmap item 7 (2026-10-20): then-and-now pairs. Each pair names two Wikimedia Commons files,
// a period image and a modern photograph of the same spot. At run time the script reads each
// file's author and licence from the Commons API (so the credit is what Commons records, not
// what was typed), copies both images to R2 (then-and-now/<id>/then.jpg, now.jpg) and writes
// the ThenAndNow row placed on the app's own Location or Waterway, looked up by exact name.
//   bun run prisma/turso-migrations/2026-10-20-then-and-now-seed.ts [--apply] [--only <id substring>]
// Only public-domain and Creative Commons files are accepted; any other licence aborts the run.
import { db } from "../../src/db";
import { uploadImageFromUrl } from "../../src/lib/image-cdn";
import { APPLY, writeBackup, report } from "./lib/migration";

interface Pair {
  id: string; title: string; location?: string; waterway?: string; lat?: number; lng?: number;
  then: { file: string; year?: number; yearLabel?: string; caption: string };
  now: { file: string; year?: number; caption: string };
  note: string;
}

const PAIRS: Pair[] = [
  {
    id: "tn_chilkoot_summit", title: "The summit of the Chilkoot Pass", location: "Chilkoot Pass",
    then: { file: "Chilkoot Pass summit.jpg", year: 1899, yearLabel: "winter 1898–99", caption: "Stampeders and their caches at the summit of the Chilkoot Pass, where the North-West Mounted Police checked each outfit, photographed by Eric A. Hegg." },
    now: { file: "__CHILKOOT_NOW__", caption: "The summit today, on the Chilkoot Trail National Historic Site; the border and the police post stood here." },
    note: "In the winter of 1897–98 the pass carried about 22,000 people and their year's provisions up the Golden Stairs. The railway over the White Pass opened in 1899 and the trail emptied; it is hiked now, with the Parks Canada and U.S. National Park Service sharing it.",
  },
  {
    id: "tn_dawson_front_street", title: "Front Street, Dawson City", location: "Dawson City",
    then: { file: "Front St, Dawson, Yukon Territory, June 1898 (HEGG 400).jpeg", year: 1898, yearLabel: "June 1898", caption: "Front Street in the first summer of the rush, a dog team hauling a cart past Jo's Juneau Restaurant, photographed by Eric A. Hegg." },
    now: { file: "__DAWSON_NOW__", caption: "Front Street today, its false fronts and boardwalks kept by Parks Canada's Klondike National Historic Sites." },
    note: "Seventeen thousand people in the summer of 1898; about 1,500 live in Dawson now. The street's wooden fronts are restored or rebuilt, and the river still runs past the end of it.",
  },
  {
    id: "tn_miles_canyon", title: "Miles Canyon", location: "Miles Canyon",
    then: { file: "Small boat navigating the upper end of Miles Canyon on the Yukon River, Yukon Territory, 1898 (HEGG 359).jpeg", year: 1898, caption: "A stampeders' boat entering the upper end of Miles Canyon in 1898, photographed by Eric A. Hegg." },
    now: { file: "__MILES_NOW__", caption: "The canyon today, its basalt walls above water slowed by the Whitehorse dam, with the footbridge of 1922." },
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
];

const UA = "CanadianWaterwaysExplorer/1.0 (then-and-now seed)";
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
const filePath = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`;
const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const ALLOWED = /^(Public domain|CC0|CC BY( |-)|CC BY-SA( |-)|No restrictions)/i;

async function commonsInfo(file: string): Promise<{ artist: string; license: string }> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=Artist|LicenseShortName&titles=${encodeURIComponent(`File:${file}`)}`;
  for (const delay of [0, 20_000, 45_000, 90_000]) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) continue;
    if (!res.ok) throw new Error(`Commons ${res.status} for ${file}`);
    const json = (await res.json()) as { query?: { pages?: Record<string, { missing?: string; imageinfo?: { extmetadata?: Record<string, { value: string }> }[] }> } };
    const page = Object.values(json.query?.pages ?? {})[0];
    if (!page || page.missing !== undefined) throw new Error(`Commons file not found: ${file}`);
    const em = page.imageinfo?.[0]?.extmetadata ?? {};
    return { artist: strip(em.Artist?.value ?? "") || "unknown author", license: strip(em.LicenseShortName?.value ?? "") };
  }
  throw new Error(`Commons rate limit for ${file}`);
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
    if (p.then.file.startsWith("__") || p.now.file.startsWith("__")) problems.push(`file placeholder not filled: ${p.id}`);
  }
  const before = await db.thenAndNow.findMany();
  const backupFile = writeBackup("2026-10-20-then-and-now-before", { pairs: before });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("then-and-now pairs", { pairs: pairs.length, backupFile, plan: pairs.map((p) => ({ id: p.id, title: p.title, place: p.location ?? p.waterway, then: p.then.file, now: p.now.file })) });
  if (!APPLY) return;
  const results: Record<string, unknown>[] = [];
  let i = 0;
  for (const p of pairs) {
    i += 1;
    const [thenInfo, nowInfo] = [await commonsInfo(p.then.file), await commonsInfo(p.now.file)];
    for (const [side, info] of [["then", thenInfo], ["now", nowInfo]] as const) {
      if (!ALLOWED.test(info.license)) throw new Error(`${p.id} ${side}: licence "${info.license}" is not public domain or Creative Commons; aborting`);
    }
    const thenUrl = await uploadImageFromUrl(filePath(p.then.file), `then-and-now/${p.id}/then.jpg`);
    const nowUrl = await uploadImageFromUrl(filePath(p.now.file), `then-and-now/${p.id}/now.jpg`);
    const place = p.location ? L.get(p.location)! : p.waterway ? W.get(p.waterway)! : null;
    const data = {
      title: p.title, locationId: p.location ? L.get(p.location)!.id : null, waterwayId: p.waterway ? W.get(p.waterway)!.id : null,
      latitude: p.lat ?? place!.latitude, longitude: p.lng ?? place!.longitude,
      thenUrl, thenYear: p.then.year ?? null, thenYearLabel: p.then.yearLabel ?? null, thenCaption: p.then.caption, thenCredit: `Wikimedia Commons / ${thenInfo.artist} / ${thenInfo.license}`, thenSourceUrl: commonsPage(p.then.file),
      nowUrl, nowYear: p.now.year ?? null, nowCaption: p.now.caption, nowCredit: `Wikimedia Commons / ${nowInfo.artist} / ${nowInfo.license}`, nowSourceUrl: commonsPage(p.now.file),
      note: p.note, sortOrder: i,
    };
    await db.thenAndNow.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
    results.push({ id: p.id, then: `${thenInfo.artist} / ${thenInfo.license}`, now: `${nowInfo.artist} / ${nowInfo.license}` });
    console.log(`  ${p.id}: then ${thenInfo.license}, now ${nowInfo.license}`);
  }
  const verify = await db.thenAndNow.findMany({ select: { id: true, title: true, locationId: true, waterwayId: true }, orderBy: { thenYear: "asc" } });
  report("verify", { pairs: verify.length, placed: verify.filter((v) => v.locationId || v.waterwayId).length, results });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
