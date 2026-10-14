import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN!;

const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Helper: delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch Wikipedia article images
async function fetchWikipediaImages(title: string): Promise<string[]> {
  const encoded = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=images&format=json&imlimit=20`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (educational app)" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as any;
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0] as any;
    if (!page || !page.images) return [];
    return page.images.map((img: any) => img.title as string);
  } catch {
    return [];
  }
}

// Filter image files: skip SVG, PDF, flags, coats of arms, locator maps, icons
function isValidImageFile(title: string): boolean {
  const lower = title.toLowerCase();
  // Must be jpg or png
  if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".png")) {
    return false;
  }
  // Skip flags, coats of arms, seals, locator maps, icons
  const skipPatterns = [
    "flag_of",
    "coat_of_arms",
    "seal_of",
    "locator",
    "location_map",
    "red_pog",
    "blue_pog",
    "green_pog",
    "yellow_pog",
    "orange_pog",
    "pink_pog",
    "purple_pog",
    "stub",
    "portal-",
    "_stub.",
    "commons-logo",
    "wikidata",
    "wikimedia",
    "icon_",
    "_icon.",
    "canada_outline",
    "grey_up",
    "grey_down",
    "arrow_",
    "symbol_",
    "nuvola_",
    "crystal_",
    "emblem_",
    "insignia",
    "badge_",
  ];
  for (const pat of skipPatterns) {
    if (lower.includes(pat)) return false;
  }
  return true;
}

// Get direct upload.wikimedia.org URLs from Commons API
async function getDirectUrls(fileTitles: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (fileTitles.length === 0) return result;

  // Batch in groups of 10
  for (let i = 0; i < fileTitles.length; i += 10) {
    const batch = fileTitles.slice(i, i + 10);
    const titlesParam = batch.map((t) => encodeURIComponent(t)).join("|");
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (educational app)" },
      });
      if (!res.ok) continue;
      const data = (await res.json()) as any;
      const pages = data?.query?.pages || {};
      for (const page of Object.values(pages) as any[]) {
        if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
          const rawTitle = page.title as string;
          result.set(rawTitle, page.imageinfo[0].url);
        }
      }
    } catch {
      // continue
    }
    if (i + 10 < fileTitles.length) await delay(200);
  }
  return result;
}

// Extract existing Google Places URLs from galleryImages JSON
function extractGooglePlacesUrls(galleryImages: string | null): Array<{ url: string; caption: string; credit: string }> {
  if (!galleryImages) return [];
  try {
    const parsed = JSON.parse(galleryImages);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: any) => item.url && item.url.includes("maps.googleapis.com"));
  } catch {
    return [];
  }
}

// Convert commons.wikimedia.org/wiki/Special:FilePath/ URL to search name
function extractFilenameFromSpecialFilePath(url: string): string | null {
  const match = url.match(/Special:FilePath\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

// Convert upload.wikimedia.org URL to File: title
function uploadUrlToFileTitle(url: string): string | null {
  const match = url.match(/upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
  if (match && match[1]) {
    return `File:${decodeURIComponent(match[1])}`;
  }
  return null;
}

interface LocationData {
  id: string;
  name: string;
  imageUrl: string | null;
  galleryImages: string | null;
}

// The 99 locations to process
const LOCATIONS: Array<{ id: string; name: string; currentImageUrl: string; wikiSearch?: string }> = [
  { id: "cmlhcpxp60023m2a3nk6v0ile", name: "Bas-de-la-Rivière (Fort Alexander)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Alexander_(Manitoba).jpg?width=800", wikiSearch: "Fort Alexander, Manitoba" },
  { id: "cmligbl0s002em20zgl2s057e", name: "Batoche", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Batoche_NHA.jpg?width=800", wikiSearch: "Batoche National Historic Site" },
  { id: "cmlhci09b001lm2rxun86l1q7", name: "Bligh Island (Nootka Sound)", currentImageUrl: "", wikiSearch: "Bligh Island (British Columbia)" },
  { id: "bloody_falls_location", name: "Bloody Falls", currentImageUrl: "", wikiSearch: "Bloody Falls" },
  { id: "cmlhci08p0017m2rxhlfgplt0", name: "Cape Bonavista", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cape_Bonavista_Lighthouse.jpg?width=800", wikiSearch: "Cape Bonavista" },
  { id: "cmlhci08s0019m2rx3b2ipe6i", name: "Cartier's Cross at Gaspé", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques_Cartier_memorial_cross_at_Gaspe.jpg?width=800", wikiSearch: "Gaspé, Quebec" },
  { id: "cmlk1ohsy0005m2atetkkpn26", name: "Chaudière Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chaudiere_Falls_Ottawa.jpg?width=800", wikiSearch: "Chaudière Falls" },
  { id: "cmlhci09p001tm2rx1oek684y", name: "Columbia River Mouth (Chinook Point)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Columbia_River_Mouth_Aerial.jpg?width=800", wikiSearch: "Columbia River" },
  { id: "cmlhasls40025m2zh8ceyw7jl", name: "Cumberland House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cumberland_House_Saskatchewan.jpg?width=800", wikiSearch: "Cumberland House, Saskatchewan" },
  { id: "cmlhci09l001rm2rxtlpntiw8", name: "Desolation Sound", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Desolation_Sound.jpg?width=800", wikiSearch: "Desolation Sound" },
  { id: "cmlk1oht8000bm2atj8bjogev", name: "Echimamish Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Echimamish_River.jpg?width=800", wikiSearch: "Echimamish River" },
  { id: "cmlhbjrrd0013m2mbr25pwdi0", name: "Fort Albany", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Albany_Ontario.jpg?width=800", wikiSearch: "Fort Albany First Nation" },
  { id: "cmlhcpxob001nm2a3t1ddlxuc", name: "Fort Alexandria", currentImageUrl: "", wikiSearch: "Fort Alexandria, British Columbia" },
  { id: "cmlhcpxoq001vm2a398m9wqo1", name: "Fort Astoria / Fort George", currentImageUrl: "", wikiSearch: "Fort Astoria" },
  { id: "cmlhcpxnk001bm2a3bv60prh0", name: "Fort Augustus (NWC)", currentImageUrl: "", wikiSearch: "Fort Augustus (North West Company)" },
  { id: "cmlhcpxpi0029m2a36jgoptfh", name: "Fort Battleford", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Battleford.jpg?width=800", wikiSearch: "Fort Battleford National Historic Site" },
  { id: "cmlhcpxk40009m2a3ly9irieb", name: "Fort Carlton", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Carlton.jpg?width=800", wikiSearch: "Fort Carlton Provincial Historic Park" },
  { id: "cmlhasls40027m2zhq13ab7xs", name: "Fort Chipewyan", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Chipewyan.jpg?width=800", wikiSearch: "Fort Chipewyan" },
  { id: "cmlhasls40022m2zhaovlkwt2", name: "Fort Churchill", currentImageUrl: "", wikiSearch: "Churchill, Manitoba" },
  { id: "cmlhcpxjt0005m2a3yptljq2u", name: "Fort Churchill (HBC)", currentImageUrl: "", wikiSearch: "Fort Churchill" },
  { id: "cmlhcpxmu000zm2a30yaasx30", name: "Fort Colville", currentImageUrl: "", wikiSearch: "Fort Colville" },
  { id: "cmlhcpxnw001hm2a3vu8g9i5h", name: "Fort Dunvegan", currentImageUrl: "", wikiSearch: "Fort Dunvegan" },
  { id: "cmlhasls40026m2zhpi43jsew", name: "Fort Edmonton", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Edmonton.jpg?width=800", wikiSearch: "Fort Edmonton Park" },
  { id: "cmlhcpxk7000bm2a3aywic3h2", name: "Fort Edmonton (HBC)", currentImageUrl: "", wikiSearch: "Fort Edmonton" },
  { id: "cmlhcpxle000nm2a3bogpycqa", name: "Fort Ellice", currentImageUrl: "", wikiSearch: "Fort Ellice" },
  { id: "cmlhbjrr5000xm2mbkhf0cqiw", name: "Fort Garry", currentImageUrl: "", wikiSearch: "Upper Fort Garry" },
  { id: "cmlhcpxl6000jm2a3g5tcl5vu", name: "Fort Garry (Upper)", currentImageUrl: "", wikiSearch: "Upper Fort Garry" },
  { id: "cmlhcpxo4001lm2a3bv6j547w", name: "Fort George (NWC - BC)", currentImageUrl: "", wikiSearch: "Fort George, British Columbia" },
  { id: "cmlhcpxno001dm2a3gc40a1u2", name: "Fort George (NWC - Saskatchewan)", currentImageUrl: "", wikiSearch: "Fort George, Saskatchewan" },
  { id: "cmlhcpxot001xm2a3nzh39xs0", name: "Fort Gibraltar", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Gibraltar.jpg?width=800", wikiSearch: "Fort Gibraltar" },
  { id: "cmlhasls40028m2zh4aji898k", name: "Fort Good Hope", currentImageUrl: "", wikiSearch: "Fort Good Hope" },
  { id: "cmlhcpxnc0017m2a37uwth5fr", name: "Fort Kaministiquia", currentImageUrl: "", wikiSearch: "Kaministiquia" },
  { id: "cmlhcpxmo000vm2a3n43nxs5n", name: "Fort Kamloops", currentImageUrl: "", wikiSearch: "Fort Kamloops" },
  { id: "cmlhcpxp20021m2a32mlrbo8z", name: "Fort Lac La Pluie (Fort Frances)", currentImageUrl: "", wikiSearch: "Fort Frances" },
  { id: "cmlhasls40029m2zhhfgaamg9", name: "Fort Langley", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Langley.jpg?width=800", wikiSearch: "Fort Langley National Historic Site" },
  { id: "cmlhcpxpl002bm2a35iiq5vzp", name: "Fort Liard", currentImageUrl: "", wikiSearch: "Fort Liard" },
  { id: "cmlhcpxo0001jm2a36ckmzggi", name: "Fort McLeod (BC)", currentImageUrl: "", wikiSearch: "Fort McLeod, British Columbia" },
  { id: "cmlhcpxq9002nm2a3kn445t0w", name: "Fort McLoughlin", currentImageUrl: "", wikiSearch: "Fort McLoughlin" },
  { id: "cmlhcpxn10013m2a3zq358xxd", name: "Fort McPherson", currentImageUrl: "", wikiSearch: "Fort McPherson, Northwest Territories" },
  { id: "cmlhcpxmr000xm2a3xopobi8t", name: "Fort Nez Percés (Fort Walla Walla)", currentImageUrl: "", wikiSearch: "Fort Walla Walla (fur trade)" },
  { id: "cmlhcpxl2000hm2a35zf7u98t", name: "Fort Norman", currentImageUrl: "", wikiSearch: "Fort Norman, Northwest Territories" },
  { id: "cmlhcpxpb0025m2a3u22bcmrn", name: "Fort Pelly", currentImageUrl: "", wikiSearch: "Fort Pelly" },
  { id: "cmlhcpxoy001zm2a304m2lgbl", name: "Fort Pembina", currentImageUrl: "", wikiSearch: "Fort Pembina" },
  { id: "cmlhcpxpf0027m2a3vq60ln3h", name: "Fort Pitt", currentImageUrl: "", wikiSearch: "Fort Pitt, Saskatchewan" },
  { id: "cmlhcpxpt002fm2a3f9j5lnfo", name: "Fort Providence", currentImageUrl: "", wikiSearch: "Fort Providence, Northwest Territories" },
  { id: "cmlhcpxlh000pm2a37jv1ad25", name: "Fort Qu'Appelle", currentImageUrl: "", wikiSearch: "Fort Qu'Appelle" },
  { id: "cmlhcpxpp002dm2a3enfqyhkk", name: "Fort Rae", currentImageUrl: "", wikiSearch: "Behchokǫ̀, Northwest Territories" },
  { id: "cmlhcpxpx002hm2a3etw7eega", name: "Fort Reliance", currentImageUrl: "", wikiSearch: "Fort Reliance, Northwest Territories" },
  { id: "cmlhcpxks000fm2a34uekbxty", name: "Fort Resolution", currentImageUrl: "", wikiSearch: "Fort Resolution" },
  { id: "cmlhcpxq0002jm2a3phk4pbzy", name: "Fort Rupert", currentImageUrl: "", wikiSearch: "Fort Rupert (Hudson's Bay Company)" },
  { id: "cmlhci098001jm2rxi0if729k", name: "Fort San Miguel (Spanish Fort at Nootka)", currentImageUrl: "", wikiSearch: "Nootka Sound" },
  { id: "cmlhcpxjq0003m2a3mh417co2", name: "Fort Severn", currentImageUrl: "", wikiSearch: "Fort Severn, Ontario" },
  { id: "cmlhbjrri0017m2mbfts7d8is", name: "Fort Simpson", currentImageUrl: "", wikiSearch: "Fort Simpson, Northwest Territories" },
  { id: "cmlhcpxq5002lm2a353mda50w", name: "Fort Simpson (BC)", currentImageUrl: "", wikiSearch: "Fort Simpson, British Columbia" },
  { id: "fort_st_charles_location", name: "Fort St. Charles", currentImageUrl: "", wikiSearch: "Fort St. Charles" },
  { id: "cmlhbjrrn001bm2mbmbhxd2wx", name: "Fort St. James", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_St._James.jpg?width=800", wikiSearch: "Fort St. James National Historic Site" },
  { id: "cmlhasls4002am2zhut4b7lsm", name: "Fort Témiscamingue", currentImageUrl: "", wikiSearch: "Fort Témiscamingue" },
  { id: "cmlhcpxlo000rm2a3z56bctdt", name: "Fort Vancouver (HBC)", currentImageUrl: "", wikiSearch: "Fort Vancouver National Historic Site" },
  { id: "cmlhcpxnr001fm2a3urmu7hn2", name: "Fort Vermilion (NWC)", currentImageUrl: "", wikiSearch: "Fort Vermilion, Alberta" },
  { id: "cmlhcpxm4000tm2a3h0q903om", name: "Fort Victoria", currentImageUrl: "", wikiSearch: "Fort Victoria (British Columbia)" },
  { id: "cmlhbjrr2000vm2mb4xb3au6o", name: "Fort William", currentImageUrl: "", wikiSearch: "Fort William, Ontario" },
  { id: "cmlhcpxn40015m2a37q2atmqk", name: "Fort William (NWC)", currentImageUrl: "", wikiSearch: "Fort William First Nation" },
  { id: "cmlhcpxmx0011m2a3ip116duw", name: "Fort Yukon", currentImageUrl: "", wikiSearch: "Fort Yukon, Alaska" },
  { id: "cmlk1ohtb000dm2ati96rxt36", name: "French Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Boundary_Waters.jpg?width=800", wikiSearch: "Boundary Waters Canoe Area" },
  { id: "cmlhci092001fm2rxed77jk9j", name: "Friendly Cove Landing (Cook's Landing)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nootka_Sound.jpg?width=800", wikiSearch: "Friendly Cove, British Columbia" },
  { id: "cmlk1oht20007m2at0bcedeyz", name: "Frog Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Churchill_River.jpg?width=800", wikiSearch: "Churchill River (Saskatchewan)" },
  { id: "cmlhasls40024m2zhk53dsecy", name: "Grand Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Portage.jpg?width=800", wikiSearch: "Grand Portage National Monument" },
  { id: "cmlk1ohtp000lm2at4e9n5kau", name: "Grande Décharge", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Saguenay_River.jpg?width=800", wikiSearch: "Saguenay River" },
  { id: "cmlizphiu0003m2ybn31j3yf2", name: "Great Dog Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Portage.jpg?width=800", wikiSearch: "Grand Portage" },
  { id: "cmlk1ohsr0001m2atdr81i0k0", name: "Hauteur des Terres", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Height_of_Land_Portage.jpg?width=800", wikiSearch: "Height of Land Portage" },
  { id: "cmlhcpxoi001rm2a3o6bx74af", name: "Kootenay House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson.jpg?width=800", wikiSearch: "Kootenay House" },
  { id: "cmlhci09d001nm2rxalbz2n3h", name: "La Pérouse Memorial (Lituya Bay)", currentImageUrl: "", wikiSearch: "Lituya Bay" },
  { id: "cmlk1ohte000fm2at6rkrfsdz", name: "La Vase Portages", currentImageUrl: "", wikiSearch: "La Vase Portages" },
  { id: "cmlk1ohsu0003m2atw65xozuc", name: "Long Sault Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Long_Sault_Rapids.jpg?width=800", wikiSearch: "Long Sault Rapids" },
  { id: "cmlhcpxla000lm2a36zgze0vh", name: "Lower Fort Garry", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Lower_Fort_Garry.jpg?width=800", wikiSearch: "Lower Fort Garry National Historic Site" },
  { id: "cml_marble_island", name: "Marble Island", currentImageUrl: "", wikiSearch: "Marble Island" },
  { id: "massacre_island_location", name: "Massacre Island (Lake of the Woods)", currentImageUrl: "", wikiSearch: "Lake of the Woods" },
  { id: "cmlhasls40020m2zhz16w8vz5", name: "Montreal", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Place-Jacques-Cartier.jpg?width=800", wikiSearch: "Montreal" },
  { id: "cmlhbjrrb0011m2mb7wkob1wv", name: "Moose Factory", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/MooseFactory.jpg?width=800", wikiSearch: "Moose Factory, Ontario" },
  { id: "cmlhbjrrf0015m2mbj2bojm5s", name: "Norway House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Norway_House.jpg?width=800", wikiSearch: "Norway House, Manitoba" },
  { id: "cmlhcpxjz0007m2a39z07cplj", name: "Oxford House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Oxford_House.jpg?width=800", wikiSearch: "Oxford House, Manitoba" },
  { id: "cmlhci09i001pm2rx0nywnjr9", name: "Point Grey (Vancouver Meeting Point)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Point_Grey.jpg?width=800", wikiSearch: "Point Grey" },
  { id: "cmlhci08v001bm2rx1qzcbb7o", name: "Port-Royal (Habitation)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Port-Royal.jpg?width=800", wikiSearch: "Port-Royal National Historic Site" },
  { id: "cmlhcpxik0001m2a32ftvmlnd", name: "Prince of Wales Fort", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_of_Wales_Fort.jpg?width=800", wikiSearch: "Prince of Wales Fort National Historic Site" },
  { id: "cmlhasls4001zm2zhg7ahjwlx", name: "Quebec City", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chateau_Frontenac.jpg?width=800", wikiSearch: "Quebec City" },
  { id: "cmlk1oht50009m2atw1lxbena", name: "Rat Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake_of_the_Woods.jpg?width=800", wikiSearch: "Kenora, Ontario" },
  { id: "cmlhci08x001dm2rxttfhbqjr", name: "Red Bay Basque Whaling Station", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_Bay_National_Historic_Site.jpg?width=800", wikiSearch: "Red Bay, Newfoundland and Labrador" },
  { id: "cmlhcpxka000dm2a38u2u5e1v", name: "Rocky Mountain House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Rocky_Mountain_House.jpg?width=800", wikiSearch: "Rocky Mountain House National Historic Site" },
  { id: "cmlhcpxoe001pm2a35trj97gi", name: "Rocky Mountain House (NWC)", currentImageUrl: "", wikiSearch: "Rocky Mountain House" },
  { id: "cmlhcpxqm002pm2a38i7y4iyx", name: "Rupert House (Fort Charles)", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Waskaganish.jpg?width=800", wikiSearch: "Waskaganish" },
  { id: "cmlhasls40023m2zhzrnt7rr9", name: "Sault Ste. Marie", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Sault_Ste_Marie.jpg?width=800", wikiSearch: "Sault Ste. Marie, Ontario" },
  { id: "cmlhcpxng0019m2a3aeo031li", name: "Sault Ste. Marie Post", currentImageUrl: "", wikiSearch: "Sault Ste. Marie Canal National Historic Site" },
  { id: "cmlk1ohtm000jm2atwndo0iu1", name: "Slave Falls Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Winnipeg_River.jpg?width=800", wikiSearch: "Winnipeg River" },
  { id: "cmlhci095001hm2rxh06cgnow", name: "Spanish Banks Beach", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Spanish_Banks_Beach.jpg?width=800", wikiSearch: "Spanish Banks" },
  { id: "cmlhcpxol001tm2a3z4iparrf", name: "Spokane House", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Spokane_House.jpg?width=800", wikiSearch: "Spokane House" },
  { id: "cmlhbjrrk0019m2mbo76o9uph", name: "Tadoussac", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tadoussac.jpg?width=800", wikiSearch: "Tadoussac" },
  { id: "cmlk1ohth000hm2atid2o0cto", name: "The Pas Portage", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Pas_Manitoba.jpg?width=800", wikiSearch: "The Pas, Manitoba" },
  { id: "cmligbl0q002cm20z7q06luf5", name: "Upper Fort Garry", currentImageUrl: "", wikiSearch: "Upper Fort Garry" },
  { id: "cmlhasls40021m2zhu35xikyc", name: "York Factory", currentImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory.jpg?width=800", wikiSearch: "York Factory National Historic Site" },
];

interface GalleryImage {
  url: string;
  caption: string;
  credit: string;
}

async function processLocation(loc: (typeof LOCATIONS)[0]): Promise<{ updated: boolean; heroUrl: string | null; error?: string }> {
  // 1. Get current DB record
  let dbRecord: LocationData | null = null;
  try {
    const result = await db.execute({
      sql: "SELECT id, name, imageUrl, galleryImages FROM Location WHERE id = ?",
      args: [loc.id],
    });
    if (result.rows.length > 0) {
      const row = result.rows[0];
      if (row) {
        dbRecord = {
          id: row[0] as string,
          name: row[1] as string,
          imageUrl: row[2] as string | null,
          galleryImages: row[3] as string | null,
        };
      }
    }
  } catch (e) {
    return { updated: false, heroUrl: null, error: `DB read error: ${e}` };
  }

  if (!dbRecord) {
    return { updated: false, heroUrl: null, error: "Location not found in DB" };
  }

  // 2. Get existing Google Places gallery images
  const existingGoogleImages = extractGooglePlacesUrls(dbRecord.galleryImages);

  // 3. Fetch Wikipedia images
  const wikiSearch = loc.wikiSearch || loc.name;
  const wikiImageTitles = await fetchWikipediaImages(wikiSearch);
  await delay(200);

  // 4. Filter to valid image files
  const validWikiTitles = wikiImageTitles.filter(isValidImageFile);

  // 5. Get direct URLs from Commons
  let directUrlMap = new Map<string, string>();
  if (validWikiTitles.length > 0) {
    directUrlMap = await getDirectUrls(validWikiTitles);
    await delay(200);
  }

  // Collect wiki images with direct URLs
  const wikiImages: GalleryImage[] = [];
  for (const title of validWikiTitles) {
    const directUrl = directUrlMap.get(title);
    if (directUrl && directUrl.startsWith("https://upload.wikimedia.org/")) {
      // Use just the filename for caption
      const filename = title.replace(/^File:/, "").replace(/_/g, " ").replace(/\.[^.]+$/, "");
      wikiImages.push({
        url: directUrl,
        caption: loc.name,
        credit: "Wikimedia Commons",
      });
    }
  }

  // 6. Determine hero image
  let heroUrl: string | null = null;

  const firstWiki = wikiImages[0];
  if (firstWiki) {
    heroUrl = firstWiki.url;
  } else {
    // Try to fix existing Special:FilePath URL to get a direct URL
    const currentUrl = dbRecord.imageUrl || loc.currentImageUrl;
    if (currentUrl && currentUrl.includes("upload.wikimedia.org")) {
      heroUrl = currentUrl;
    } else if (currentUrl && currentUrl.includes("Special:FilePath")) {
      // Try to get direct URL via Commons API
      const filename = extractFilenameFromSpecialFilePath(currentUrl);
      if (filename) {
        const fileTitle = `File:${filename}`;
        const urlMap = await getDirectUrls([fileTitle]);
        await delay(200);
        const directUrl = urlMap.get(fileTitle);
        if (directUrl && directUrl.startsWith("https://upload.wikimedia.org/")) {
          heroUrl = directUrl;
        }
      }
    }

    if (!heroUrl) {
      // Fall back to existing Google Places URL if available
      const firstGoogle = existingGoogleImages[0];
      if (firstGoogle) {
        heroUrl = firstGoogle.url;
      } else {
        // Keep current URL if it's already a valid direct URL or Google URL
        const existingUrl = dbRecord.imageUrl;
        if (existingUrl && (existingUrl.includes("upload.wikimedia.org") || existingUrl.includes("maps.googleapis.com"))) {
          heroUrl = existingUrl;
        }
      }
    }
  }

  // 7. Build galleryImages array:
  // [wiki images (excluding hero)] + [google places images] + [hero image as last]
  const galleryImages: GalleryImage[] = [];

  // Add non-hero wiki images first (up to 5 total wiki images)
  for (const img of wikiImages.slice(0, 5)) {
    if (img.url !== heroUrl) {
      galleryImages.push(img);
    }
  }

  // Add google places images (dedup)
  const urlSet = new Set(galleryImages.map((g) => g.url));
  for (const gImg of existingGoogleImages) {
    if (!urlSet.has(gImg.url)) {
      galleryImages.push(gImg);
      urlSet.add(gImg.url);
    }
  }

  // Add hero as last entry (if we have one and it's a valid image)
  if (heroUrl) {
    if (!urlSet.has(heroUrl)) {
      galleryImages.push({
        url: heroUrl,
        caption: loc.name,
        credit: heroUrl.includes("wikimedia") ? "Wikimedia Commons" : heroUrl.includes("googleapis") ? "Google Places" : "Public Domain",
      });
    } else {
      // Remove it from wherever it was and add at end
      const heroEntry = galleryImages.find((g) => g.url === heroUrl);
      const filtered = galleryImages.filter((g) => g.url !== heroUrl);
      if (heroEntry) {
        filtered.push(heroEntry);
      }
      galleryImages.length = 0;
      galleryImages.push(...filtered);
    }
  }

  // 8. Update database
  try {
    await db.execute({
      sql: "UPDATE Location SET imageUrl = ?, galleryImages = ?, updatedAt = datetime('now') WHERE id = ?",
      args: [heroUrl, JSON.stringify(galleryImages), loc.id],
    });
    return { updated: true, heroUrl };
  } catch (e) {
    return { updated: false, heroUrl, error: `DB write error: ${e}` };
  }
}

async function main() {
  console.log("====================================================");
  console.log("  Fix All Location Images - 99 locations");
  console.log("====================================================\n");

  let updated = 0;
  let failed = 0;
  const failedLocations: Array<{ name: string; id: string; error: string }> = [];
  const successLocations: Array<{ name: string; id: string; heroUrl: string | null }> = [];

  // Process in batches of 5 to avoid overwhelming APIs
  const BATCH_SIZE = 5;

  for (let i = 0; i < LOCATIONS.length; i += BATCH_SIZE) {
    const batch = LOCATIONS.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(LOCATIONS.length / BATCH_SIZE)} ---`);

    // Process batch sequentially to respect API rate limits
    for (const loc of batch) {
      process.stdout.write(`  Processing: ${loc.name}...`);
      try {
        const result = await processLocation(loc);
        if (result.updated) {
          updated++;
          successLocations.push({ name: loc.name, id: loc.id, heroUrl: result.heroUrl });
          console.log(` OK (hero: ${result.heroUrl ? result.heroUrl.substring(0, 60) + "..." : "null"})`);
        } else {
          failed++;
          failedLocations.push({ name: loc.name, id: loc.id, error: result.error || "Unknown error" });
          console.log(` FAILED: ${result.error}`);
        }
      } catch (e) {
        failed++;
        failedLocations.push({ name: loc.name, id: loc.id, error: String(e) });
        console.log(` ERROR: ${e}`);
      }
    }

    // Delay between batches
    if (i + BATCH_SIZE < LOCATIONS.length) {
      await delay(1000);
    }
  }

  console.log("\n====================================================");
  console.log(`  RESULTS:`);
  console.log(`  Updated: ${updated} locations`);
  console.log(`  Failed:  ${failed} locations`);
  console.log("====================================================\n");

  if (failedLocations.length > 0) {
    console.log("Failed locations:");
    for (const fl of failedLocations) {
      console.log(`  - ${fl.name} (${fl.id}): ${fl.error}`);
    }
  }

  // Summary of heroes
  console.log("\nSample of updated hero images (first 10):");
  for (const sl of successLocations.slice(0, 10)) {
    console.log(`  ${sl.name}: ${sl.heroUrl || "null"}`);
  }

  await db.close();
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
