// Roadmap item 5, "Let the sources speak" (2026-10-20): tie each of the 27 documents that carry
// a checked transcription to the spot where its words were written or spoken, so the map can
// show them there and a voyageur journey can quote them at the right node.
//   bun run prisma/turso-migrations/2026-10-20-voices-spots.ts [--apply]
//
// For each document: spotLatitude/spotLongitude/spotName (new columns, 2026-10-20-document-spot.sql)
// and, where the app has the record, the waterwayId/locationId links the seed never set (all 27
// had both null). Coordinates come from the app's own Location/Waterway rows where one exists
// (looked up by name below, so the ids are never typed by hand); the others are given here and
// named "(approximate)" where the site itself is uncertain. Explorer links are left as they are.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

interface Spot {
  id: string;
  title: string; // must match Turso, or the script aborts
  spotName: string;
  /** Take the coordinates from this Location (by exact name) and link it. */
  location?: string;
  /** Link this Waterway (by exact name); also the coordinates when no location and no lat/lng. */
  waterway?: string;
  lat?: number;
  lng?: number;
}

const SPOTS: Spot[] = [
  { id: "cmlmsw8te0003m22soy6y49ik", title: "Cartier's Account of First Contact at Gaspé, July 1534", spotName: "Gaspé harbour, where Cartier raised his cross", location: "Cartier's Cross at Gaspé", waterway: "Gaspé Bay" },
  { id: "cmlmsw8th0004m22s88763sxz", title: "Cartier's Description of Stadacona and Hochelaga, October 1535", spotName: "Hochelaga, below Mount Royal", location: "Hochelaga" },
  { id: "cmlmsw8tj0005m22s12za2dkq", title: "Cartier's Report on Scurvy and Indigenous Medicine, Winter 1535-1536", spotName: "Cartier's winter camp at Stadacona, on the Saint-Charles", location: "Stadacona" },
  { id: "cmlmsw8t10000m22sjvnsk785", title: "Champlain's Account of the Founding of Quebec, July 1608", spotName: "The Habitation at Quebec", location: "Quebec City" },
  { id: "cmlmsw8t70001m22svngult6w", title: "Champlain's Description of the Site of Montreal (Place Royale), 1611", spotName: "Place Royale, now Pointe-à-Callière, Montreal", location: "Montreal" },
  { id: "cmlmsw8tb0002m22sghuc01i2", title: "Letter from Champlain to the King of France on New France, 1618", spotName: "Quebec, the settlement the memorial pleads for (the memorial itself was presented in Paris)", location: "Quebec City" },
  { id: "cmlmsw8ts0006m22sv0gxap7o", title: "La Salle's Claim of Louisiana at the Mississippi Delta, April 1682", spotName: "The mouth of the Mississippi, 9 April 1682 (approximate)", waterway: "Mississippi River", lat: 29.15, lng: -89.25 },
  { id: "cmlmsw8u10008m22su0raiwnt", title: "Henri Joutel's Account of La Salle's Final Expedition, 1687", spotName: "Near present Navasota, Texas, where La Salle was killed (site approximate)", lat: 30.39, lng: -96.09 },
  { id: "cmlmt06pm000am2i2in6jeh1d", title: "William Stuart's Note to James Knight from Beyond the Churchill River, October 1715", spotName: "Received at York Factory; written in the Chipewyan country beyond the Churchill", location: "York Factory" },
  { id: "cmlitwdbn0003m2hg64xdxb13", title: "James Knight on Thanadelthur, York Factory, 1717", spotName: "York Factory, February 1717", location: "York Factory" },
  { id: "cmlitwdbv0005m2hgtzwozycr", title: "Samuel Hearne on Matonabbee's Leadership, 1770-1772", spotName: "Set down at Prince of Wales Fort after the meeting on the Barren Lands, September 1770", location: "Prince of Wales Fort" },
  { id: "cmlmt06pd0008m2i2f1d9y9fl", title: "Norton's Instructions to Samuel Hearne, December 1770", spotName: "Prince of Wales Fort, 7 December 1770", location: "Prince of Wales Fort" },
  { id: "cmlirhtnb000mm2hcbvv1aoop", title: "Samuel Hearne's Journey to the Coppermine River, July 1771", spotName: "Bloody Falls on the Coppermine, 17 July 1771", location: "Bloody Falls", waterway: "Coppermine River" },
  { id: "cmlmt06p20004m2i2j8xlcbn3", title: "The Hudson's Bay Company's Engagement of Philip Turnor as Surveyor, 1778", spotName: "York Factory, where Turnor was sent (the engagement was written in London)", location: "York Factory" },
  { id: "cmlitwdbj0002m2hgai1yy1dj", title: "David Thompson Recording Saukamappee's Account, Winter 1787-1788", spotName: "A Peigan camp on the Bow River, winter 1787-88 (site approximate)", waterway: "Bow River" },
  { id: "cmlmt06p40005m2i2lfcvqccf", title: "Turnor's Journal of the Survey to Lake Athabasca, 1790", spotName: "Fort Chipewyan, Lake Athabasca", location: "Fort Chipewyan", waterway: "Lake Athabasca" },
  { id: "cmlmt06ou0001m2i2o7ofldng", title: "Fidler's Survey Journal of the Athabasca Country, 1791", spotName: "Fort Chipewyan, Lake Athabasca", location: "Fort Chipewyan", waterway: "Lake Athabasca" },
  { id: "cmlirhtp0000pm2hcakifpeuc", title: "Alexander Mackenzie at Fort Fork, 1793", spotName: "Fort Fork on the Peace, above the Smoky (site approximate)", waterway: "Peace River", lat: 56.17, lng: -117.35 },
  { id: "cmlitwdb60000m2hgkv817kql", title: "Alexander Mackenzie's Rock Inscription at Bella Coola, July 1793", spotName: "Mackenzie's Rock, Dean Channel, 22 July 1793", waterway: "Dean Channel", lat: 52.3756, lng: -127.4708 },
  { id: "cmlitwdbf0001m2hggx0xvb0f", title: "Alexander Mackenzie Crossing the Rocky Mountains, June 1793", spotName: "The Bad River below the Arctic-Pacific divide, where the canoe was wrecked, 13 June 1793 (site approximate)", waterway: "Parsnip River", lat: 54.42, lng: -121.72 },
  { id: "cmlitwdbx0006m2hgn5412c1p", title: "Simon Fraser Navigating the Fraser River Canyon, June 1808", spotName: "Above Spuzzum, in the Fraser Canyon", waterway: "Fraser River", lat: 49.68, lng: -121.42 },
  { id: "cmlirhtn9000lm2hc4c00mjfi", title: "David Thompson's Narrative of the Columbia Descent, July 1811", spotName: "Below Kettle Falls on the Columbia, 4-5 July 1811 (approximate)", waterway: "Columbia River", lat: 48.63, lng: -118.12 },
  { id: "cmlmsw8uh000cm22swygl2mem", title: "Back's Journal of the Great Fish River Expedition, July 1834", spotName: "The mouth of the Thlew-ee-choh (Back River), Chantrey Inlet", waterway: "Back River", lat: 67.2, lng: -95.2 },
  { id: "cmlmsw8ul000dm22s7mbs616g", title: "Back's Account of Wintering at Fort Reliance, 1833-1834", spotName: "Fort Reliance, east end of Great Slave Lake", location: "Fort Reliance" },
  { id: "cmlitwdbz0007m2hgq08l4s9b", title: "Dr. John Rae's Report on Franklin Expedition Relics, 1854", spotName: "Repulse Bay (Naujaat), where the letter was written, 29 July 1854", waterway: "Repulse Bay" },
  { id: "cmlmsw8u9000am22s3rtl5v02", title: "Tyrrell's Report on the Dinosaur Bone Beds of the Red Deer River, 1884", spotName: "The Red Deer badlands near present Drumheller (approximate)", waterway: "Red Deer River", lat: 51.46, lng: -112.7 },
  { id: "cmlmsw8u50009m22so1t62x1f", title: "Tyrrell's Journal of the Barren Lands Expedition, July 1893", spotName: "Carey Lake, among the caribou, 30 July 1893 (approximate)", lat: 62.2, lng: -102.4 },
];

async function main() {
  const rows = await db.primarySourceDocument.findMany({
    where: { id: { in: SPOTS.map((s) => s.id) } },
    select: { id: true, title: true, transcription: true, waterwayId: true, locationId: true, spotLatitude: true, spotLongitude: true, spotName: true },
  });
  const checked = await db.primarySourceDocument.count({ where: { isPublished: true, transcription: { not: null } } });
  const problems: string[] = [];
  if (checked !== SPOTS.length) problems.push(`${checked} documents carry a transcription, SPOTS lists ${SPOTS.length}`);
  for (const s of SPOTS) {
    const row = rows.find((r) => r.id === s.id);
    if (!row) problems.push(`missing in Turso: ${s.title}`);
    else if (row.title !== s.title) problems.push(`title differs for ${s.id}: Turso has "${row.title}"`);
    else if (!row.transcription) problems.push(`no transcription: ${s.title}`);
  }

  const plan: Record<string, unknown>[] = [];
  for (const s of SPOTS) {
    const location = s.location ? await db.location.findFirst({ where: { name: s.location }, select: { id: true, name: true, latitude: true, longitude: true, waterwayId: true } }) : null;
    const waterway = s.waterway ? await db.waterway.findFirst({ where: { name: s.waterway }, select: { id: true, name: true, latitude: true, longitude: true } }) : null;
    if (s.location && !location) problems.push(`location not found: ${s.location} (${s.title})`);
    if (s.waterway && !waterway) problems.push(`waterway not found: ${s.waterway} (${s.title})`);
    const lat = s.lat ?? location?.latitude ?? waterway?.latitude;
    const lng = s.lng ?? location?.longitude ?? waterway?.longitude;
    if (lat === undefined || lng === undefined) problems.push(`no coordinates: ${s.title}`);
    plan.push({
      id: s.id, title: s.title, spotName: s.spotName, lat, lng,
      locationId: location?.id ?? null, waterwayId: waterway?.id ?? location?.waterwayId ?? null,
      from: s.lat !== undefined ? "given" : location ? `location ${location.name}` : `waterway ${waterway?.name}`,
    });
  }
  const backupFile = writeBackup("2026-10-20-voices-spots-before", { documents: rows });
  if (problems.length) {
    report("ABORT", { problems });
    process.exitCode = 1;
    return;
  }
  report("spots for the checked transcriptions", { count: plan.length, backupFile, plan });
  if (!APPLY) return;
  for (const p of plan) {
    await db.primarySourceDocument.update({
      where: { id: p.id as string },
      data: { spotLatitude: p.lat as number, spotLongitude: p.lng as number, spotName: p.spotName as string, locationId: (p.locationId as string | null) ?? undefined, waterwayId: (p.waterwayId as string | null) ?? undefined },
    });
  }
  const verify = await db.primarySourceDocument.findMany({
    where: { isPublished: true, transcription: { not: null } },
    select: { title: true, spotLatitude: true, spotLongitude: true, spotName: true, waterwayId: true, locationId: true },
    orderBy: { originalYear: "asc" },
  });
  report("verify", { withSpot: verify.filter((v) => v.spotLatitude !== null).length, of: verify.length, verify });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
