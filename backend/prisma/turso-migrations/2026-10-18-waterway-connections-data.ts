// Populate WaterwayConnection (2026-10-18): the hydrological links among the waterways in Turso.
//   bun run prisma/turso-migrations/2026-10-18-waterway-connections-data.ts [--apply]
//
// Only pairs whose both ends are rows in Turso. Each pair was checked today against the source,
// mouth, inflow, outflow and part-of fields of the waterways' Wikipedia articles, or against the
// geography already sourced in the content packs; where the water passes through a river or lake
// that is not a row (the St. Marys River, the Rivière des Rochers, the Waterhen) the note says so.
// Relations: flows_into (a river into a river, lake, bay or sea; a lake into the body it drains to),
// outlet_of (a river that drains a lake), part_of (an arm, basin or bay of a larger body), joins (a
// strait or channel between two bodies). Idempotent: existing (from, to, relation) rows are skipped.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Rel = "flows_into" | "outlet_of" | "part_of" | "joins";
const P: Array<[string, string, Rel, string?]> = [
  // St. Lawrence and the Gulf
  ["Lake Ontario", "St. Lawrence River", "flows_into", "The St. Lawrence leaves Lake Ontario at Kingston."],
  ["St. Lawrence River", "Lake Ontario", "outlet_of"],
  ["St. Lawrence River", "Gulf of St. Lawrence", "flows_into"],
  ["Ottawa River", "St. Lawrence River", "flows_into", "At Montreal."],
  ["Richelieu River", "St. Lawrence River", "flows_into", "At Sorel."],
  ["Richelieu River", "Lake Champlain", "outlet_of"],
  ["Saguenay River", "St. Lawrence River", "flows_into", "At Tadoussac."],
  ["Mattawa River", "Ottawa River", "flows_into", "At Mattawa."],
  ["Ottawa River", "Lake Timiskaming", "outlet_of", "The Ottawa flows through the lake and leaves it at its south end."],
  ["Baie des Chaleurs", "Gulf of St. Lawrence", "part_of", "An arm of the Gulf between Quebec and New Brunswick."],
  ["Restigouche River", "Baie des Chaleurs", "flows_into", "At Dalhousie and Miguasha."],
  ["Gaspé Bay", "Gulf of St. Lawrence", "part_of"],
  ["Miramichi River", "Gulf of St. Lawrence", "flows_into", "Through Miramichi Bay."],
  ["Northumberland Strait", "Gulf of St. Lawrence", "part_of", "The southern part of the Gulf, between Prince Edward Island and the mainland."],
  ["Cabot Strait", "Gulf of St. Lawrence", "joins", "The Gulf's widest outlet to the Atlantic, between Cape Ray and Cape North."],
  ["Strait of Belle Isle", "Gulf of St. Lawrence", "joins", "The Gulf's northern outlet, between Labrador and Newfoundland."],
  ["Bras d'Or Lake", "Gulf of St. Lawrence", "flows_into", "Tidal; open to the sea through the Great Bras d'Or Channel."],
  ["Humber River (Newfoundland)", "Gulf of St. Lawrence", "flows_into", "Into the Bay of Islands at Corner Brook."],
  // Bay of Fundy
  ["Saint John River", "Bay of Fundy", "flows_into", "At Saint John."],
  ["Annapolis Basin", "Bay of Fundy", "part_of", "Through Digby Gut."],
  ["Minas Basin", "Bay of Fundy", "part_of", "The eastern arm, beyond Cape Split."],
  ["Chignecto Bay", "Bay of Fundy", "part_of", "The northeastern arm, to the Isthmus of Chignecto."],
  // Newfoundland and Labrador
  ["Exploits River", "Beothuk Lake", "outlet_of"],
  ["Beothuk Lake", "Exploits River", "flows_into"],
  ["Exploits River", "Notre Dame Bay", "flows_into", "Into the Bay of Exploits, the southern arm of Notre Dame Bay, at Botwood."],
  ["Churchill River (Labrador)", "Hamilton Inlet", "flows_into", "Into Lake Melville, the inner part of the inlet, at Happy Valley-Goose Bay."],
  ["Naskaupi River", "Hamilton Inlet", "flows_into", "Into Grand Lake at the western end of Lake Melville."],
  // Hudson Bay, James Bay and the Arctic rivers
  ["James Bay", "Hudson Bay", "part_of", "The southern arm of the bay."],
  ["Hudson Strait", "Hudson Bay", "joins", "The bay's outlet to the Labrador Sea and the Atlantic."],
  ["Foxe Basin", "Hudson Strait", "joins", "By Foxe Channel."],
  ["Foxe Basin", "Hudson Bay", "joins", "By Roes Welcome Sound and Frozen Strait."],
  ["Ungava Bay", "Hudson Strait", "joins", "The bay opens north onto the strait."],
  ["Koksoak River", "Ungava Bay", "flows_into", "Below Kuujjuaq."],
  ["George River", "Ungava Bay", "flows_into", "Near Kangiqsualujjuaq."],
  ["Nelson River", "Hudson Bay", "flows_into", "At Port Nelson."],
  ["Nelson River", "Lake Winnipeg", "outlet_of", "Leaves the lake at Warren Landing."],
  ["Hayes River", "Hudson Bay", "flows_into", "At York Factory."],
  ["Churchill River", "Hudson Bay", "flows_into", "At Churchill."],
  ["Seal River", "Hudson Bay", "flows_into"],
  ["Severn River", "Hudson Bay", "flows_into", "At Fort Severn."],
  ["Winisk River", "Hudson Bay", "flows_into", "At Peawanuck."],
  ["Great Whale River", "Hudson Bay", "flows_into", "At Kuujjuarapik and Whapmagoostui."],
  ["Attawapiskat River", "James Bay", "flows_into", "Into Akimiski Strait."],
  ["Albany River", "James Bay", "flows_into", "At Fort Albany."],
  ["Moose River", "James Bay", "flows_into", "Below Moosonee."],
  ["Abitibi River", "Moose River", "flows_into"],
  ["Abitibi River", "Lake Abitibi", "outlet_of"],
  ["Harricana River", "James Bay", "flows_into", "Into Hannah Bay."],
  ["Nottaway River", "James Bay", "flows_into", "Into Rupert Bay."],
  ["Rupert River", "James Bay", "flows_into", "Into Rupert Bay at Waskaganish."],
  ["Rupert River", "Lake Mistassini", "outlet_of"],
  ["Eastmain River", "James Bay", "flows_into", "At Eastmain."],
  ["La Grande River", "James Bay", "flows_into", "At Chisasibi."],
  ["Chesterfield Inlet", "Hudson Bay", "part_of", "An inlet of the bay's northwest shore."],
  ["Baker Lake", "Chesterfield Inlet", "flows_into", "The lake drains east through the inlet."],
  ["Thelon River", "Baker Lake", "flows_into"],
  ["Kazan River", "Baker Lake", "flows_into"],
  ["Dubawnt River", "Thelon River", "flows_into"],
  ["Repulse Bay", "Hudson Bay", "part_of", "At the bay's northwest corner, off Roes Welcome Sound."],
  ["Wager Bay", "Hudson Bay", "part_of", "An inlet off Roes Welcome Sound."],
  // Lake Winnipeg basin
  ["Winnipeg River", "Lake Winnipeg", "flows_into"],
  ["Winnipeg River", "Lake of the Woods", "outlet_of", "Leaves the lake at Kenora."],
  ["Rainy River", "Lake of the Woods", "flows_into"],
  ["Rainy River", "Rainy Lake", "outlet_of", "Leaves the lake at Fort Frances."],
  ["Seine River", "Rainy Lake", "flows_into"],
  ["Seine River", "Lac des Mille Lacs", "outlet_of"],
  ["Atikokan River", "Seine River", "flows_into"],
  ["Savanne River", "Lac des Mille Lacs", "flows_into", "At Sawmill Bay."],
  ["Red River", "Lake Winnipeg", "flows_into"],
  ["Assiniboine River", "Red River", "flows_into", "At The Forks, Winnipeg."],
  ["Souris River", "Assiniboine River", "flows_into"],
  ["Qu'Appelle River", "Assiniboine River", "flows_into", "Near St. Lazare, below Fort Ellice."],
  ["Saskatchewan River", "Lake Winnipeg", "flows_into", "At Grand Rapids."],
  ["North Saskatchewan River", "Saskatchewan River", "flows_into", "At the Saskatchewan River Forks."],
  ["South Saskatchewan River", "Saskatchewan River", "flows_into", "At the Saskatchewan River Forks."],
  ["Bow River", "South Saskatchewan River", "flows_into", "The Bow and the Oldman form the South Saskatchewan."],
  ["Red Deer River", "South Saskatchewan River", "flows_into", "Near Empress."],
  ["Sturgeon-Weir River", "Saskatchewan River", "flows_into", "Through Namew and Cumberland lakes; the Frog Portage route from the Churchill."],
  ["Lake Winnipegosis", "Lake Manitoba", "flows_into", "By the Waterhen River."],
  ["Lake Manitoba", "Lake Winnipeg", "flows_into", "By the Fairford River, Lake St. Martin and the Dauphin River."],
  ["Reindeer Lake", "Churchill River", "flows_into", "By the Reindeer River."],
  // Mackenzie basin
  ["Mackenzie River", "Great Slave Lake", "outlet_of", "Leaves the lake at Fort Providence."],
  ["Mackenzie River", "Beaufort Sea", "flows_into", "Through the Mackenzie Delta."],
  ["Slave River", "Great Slave Lake", "flows_into", "At Fort Resolution."],
  ["Peace River", "Slave River", "flows_into", "The Peace and the Rivière des Rochers from Lake Athabasca form the Slave."],
  ["Lake Athabasca", "Slave River", "flows_into", "By the Rivière des Rochers, through the Peace-Athabasca Delta."],
  ["Athabasca River", "Lake Athabasca", "flows_into"],
  ["Clearwater River", "Athabasca River", "flows_into", "At Fort McMurray; the Methye Portage route from the Churchill."],
  ["Lesser Slave Lake", "Athabasca River", "flows_into", "By the Lesser Slave River."],
  ["Finlay River", "Peace River", "flows_into", "The Finlay and the Parsnip meet at Finlay Forks, now under Williston Lake, to form the Peace."],
  ["Parsnip River", "Peace River", "flows_into", "At Finlay Forks, now under Williston Lake; Mackenzie's road to the Fraser in 1793."],
  ["Pack River", "Parsnip River", "flows_into"],
  ["Pack River", "McLeod Lake", "outlet_of"],
  ["Liard River", "Mackenzie River", "flows_into", "At Fort Simpson."],
  ["Dease River", "Liard River", "flows_into", "At Lower Post."],
  ["Frances Lake", "Liard River", "flows_into", "By the Frances River."],
  ["Peel River", "Mackenzie River", "flows_into", "In the Mackenzie Delta, below Fort McPherson."],
  ["Great Bear Lake", "Mackenzie River", "flows_into", "By the Great Bear River, from Délı̨nę to Tulita."],
  ["Coppermine River", "Coronation Gulf", "flows_into", "At Kugluktuk."],
  // Arctic channels
  ["Amundsen Gulf", "Beaufort Sea", "part_of"],
  ["Coronation Gulf", "Amundsen Gulf", "joins", "By Dolphin and Union Strait."],
  ["Queen Maud Gulf", "Coronation Gulf", "joins", "By Dease Strait."],
  ["Prince of Wales Strait", "Amundsen Gulf", "joins", "Between Banks and Victoria islands, from the gulf north to Viscount Melville Sound."],
  ["Prince of Wales Strait", "Viscount Melville Sound", "joins"],
  ["Viscount Melville Sound", "Parry Channel", "part_of", "The western part of the channel."],
  ["Lancaster Sound", "Parry Channel", "part_of", "The eastern entrance of the channel."],
  ["Lancaster Sound", "Baffin Bay", "joins"],
  ["Wellington Channel", "Parry Channel", "joins", "Runs north from Barrow Strait between Devon and Cornwallis islands."],
  ["Peel Sound", "Parry Channel", "joins", "Runs south from Barrow Strait between Somerset and Prince of Wales islands."],
  ["Prince Regent Inlet", "Lancaster Sound", "joins", "Runs south from the sound between Somerset and Baffin islands."],
  ["Bellot Strait", "Prince Regent Inlet", "joins", "The narrow strait between Somerset Island and the Boothia Peninsula, from the inlet west to Peel Sound and Franklin Strait."],
  ["Bellot Strait", "Peel Sound", "joins"],
  ["Victoria Strait", "Queen Maud Gulf", "joins", "Between Victoria Island and King William Island."],
  ["Simpson Strait", "Queen Maud Gulf", "joins", "Between King William Island and the mainland."],
  ["Davis Strait", "Baffin Bay", "joins", "Between Baffin Island and Greenland."],
  ["Smith Sound", "Baffin Bay", "joins", "From the north end of the bay to Kane Basin."],
  ["Cumberland Sound", "Davis Strait", "joins"],
  ["Frobisher Bay", "Davis Strait", "joins", "The bay opens southeast onto the strait and the Labrador Sea."],
  // Great Lakes and the Ottawa country
  ["Kaministiquia River", "Lake Superior", "flows_into", "At Thunder Bay."],
  ["Kaministiquia River", "Dog Lake", "outlet_of"],
  ["Dog River", "Dog Lake", "flows_into"],
  ["Pigeon River", "Lake Superior", "flows_into", "At Grand Portage."],
  ["Lake Nipigon", "Lake Superior", "flows_into", "By the Nipigon River."],
  ["Lake Superior", "Lake Huron", "flows_into", "By the St. Marys River at Sault Ste. Marie."],
  ["Lake Michigan", "Lake Huron", "joins", "At the Straits of Mackinac; the two lakes are one body of water."],
  ["Fox River (Wisconsin)", "Lake Michigan", "flows_into", "Into Green Bay."],
  ["Georgian Bay", "Lake Huron", "part_of"],
  ["French River", "Georgian Bay", "flows_into"],
  ["French River", "Lake Nipissing", "outlet_of"],
  ["Lake Huron", "Detroit River", "flows_into", "By the St. Clair River and Lake St. Clair."],
  ["Detroit River", "Lake Erie", "flows_into"],
  ["Niagara River", "Lake Erie", "outlet_of"],
  ["Niagara River", "Lake Ontario", "flows_into", "At Niagara-on-the-Lake."],
  // Mississippi
  ["Wisconsin River", "Mississippi River", "flows_into", "Near Prairie du Chien; the Fox-Wisconsin route."],
  ["Illinois River", "Mississippi River", "flows_into", "At Grafton."],
  // Pacific slope
  ["Thompson River", "Fraser River", "flows_into", "At Lytton."],
  ["Nechako River", "Fraser River", "flows_into", "At Prince George."],
  ["Stuart Lake", "Nechako River", "flows_into", "By the Stuart River."],
  ["Fraser River", "Georgia Strait", "flows_into", "Through the Fraser delta at Vancouver."],
  ["Burrard Inlet", "Georgia Strait", "joins"],
  ["English Bay", "Burrard Inlet", "part_of", "The outer part of the inlet, west of the First Narrows."],
  ["Georgia Strait", "Juan de Fuca Strait", "joins", "By Haro and Rosario straits; both are parts of the Salish Sea."],
  ["Puget Sound", "Juan de Fuca Strait", "joins", "By Admiralty Inlet; both are parts of the Salish Sea."],
  ["Kootenay River", "Columbia River", "flows_into", "At Castlegar."],
  ["Okanagan Lake", "Columbia River", "flows_into", "By the Okanagan River."],
  ["Snake River", "Columbia River", "flows_into", "At Lake Wallula, near the Tri-Cities."],
  ["Willamette River", "Columbia River", "flows_into", "At Portland."],
  ["Friendly Cove (Yuquot)", "Nootka Sound", "part_of"],
  ["Dean Channel", "Queen Charlotte Sound", "joins", "By Fisher Channel and Fitz Hugh Sound."],
  ["Bella Coola River", "Queen Charlotte Sound", "flows_into", "By North Bentinck Arm and Burke Channel."],
  ["Nass River", "Dixon Entrance", "flows_into", "By Portland Inlet."],
  ["Skeena River", "Dixon Entrance", "flows_into", "By Chatham Sound, below Prince Rupert."],
  // Yukon basin
  ["Atlin Lake", "Tagish Lake", "flows_into", "By the Atlin River; the farthest source of the Yukon."],
  ["Bennett Lake", "Tagish Lake", "flows_into", "By the Nares River at Carcross."],
  ["Tagish Lake", "Yukon River", "flows_into", "By the Tagish River and Marsh Lake."],
  ["Lake Laberge", "Yukon River", "part_of", "A widening of the river north of Whitehorse."],
  ["Teslin River", "Teslin Lake", "outlet_of"],
  ["Teslin River", "Yukon River", "flows_into", "At Hootalinqua."],
  ["Pelly River", "Yukon River", "flows_into", "At Fort Selkirk."],
  ["Stewart River", "Yukon River", "flows_into", "Below Stewart Crossing."],
  ["White River", "Yukon River", "flows_into", "Above the Stewart's mouth."],
  ["Kluane Lake", "White River", "flows_into", "By the Kluane and Donjek rivers."],
  ["Klondike River", "Yukon River", "flows_into", "At Dawson City."],
  ["Fortymile River", "Yukon River", "flows_into", "At Forty Mile."],
  ["Porcupine River", "Yukon River", "flows_into", "At Fort Yukon, Alaska."],
];

async function main() {
  const ww = await db.waterway.findMany({ select: { id: true, name: true } }); const byName = new Map(ww.map((w) => [w.name, w.id]));
  const need = (n: string) => { const v = byName.get(n); if (!v) throw new Error(`waterway not found: ${n}`); return v; };
  const existing = await db.waterwayConnection.findMany({ select: { fromId: true, toId: true, relation: true } });
  const have = new Set(existing.map((e) => `${e.fromId}|${e.toId}|${e.relation}`));
  const rows = P.map(([from, to, relation, notes]) => ({ fromId: need(from), toId: need(to), relation, notes: notes ?? null, label: `${from} ${relation} ${to}` })).filter((r) => !have.has(`${r.fromId}|${r.toId}|${r.relation}`));
  const touched = new Set(P.flatMap(([a, b]) => [a, b]));
  const backupFile = writeBackup("2026-10-18-waterway-connections-data-before", { note: "inserts only", existing: existing.length });
  report("waterway connections", { toInsert: rows.length, alreadyPresent: P.length - rows.length, waterwaysConnected: touched.size, waterwaysUnconnected: ww.filter((w) => !touched.has(w.name)).map((w) => w.name), sample: rows.slice(0, 8).map((r) => r.label), backupFile });
  if (!APPLY) return;
  await db.waterwayConnection.createMany({ data: rows.map((r) => ({ fromId: r.fromId, toId: r.toId, relation: r.relation, notes: r.notes })) }); // one statement; 165 single inserts exceeded the 5 s interactive-transaction limit
  report("verify", { connections: await db.waterwayConnection.count(), byRelation: await db.waterwayConnection.groupBy({ by: ["relation"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
