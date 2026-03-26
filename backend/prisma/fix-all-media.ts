/**
 * ⛔️ DEPRECATED — DO NOT RUN
 *
 * This script has been superseded by migrate-images-to-cdn.ts.
 *
 * Running this script would overwrite the CDN-hosted image URLs in the database
 * with Wikimedia Commons URLs, many of which are broken (404) or unstable.
 *
 * To re-seed image data:
 *   1. Update migrate-images-to-cdn.ts with any new waterway/location entries
 *   2. Run: cd backend && bun run prisma/migrate-images-to-cdn.ts
 *
 * For URL health monitoring, see: src/jobs/image-health-check.ts
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _DEPRECATED = true;
export {};

/**
 * ORIGINAL SCRIPT PRESERVED BELOW FOR REFERENCE ONLY
 * ─────────────────────────────────────────────────────────────────────────────
 * DEFINITIVE MEDIA FIX
 * Rebuilds imageUrl and galleryImages for EVERY Location and Waterway.
 *
 * Rules enforced:
 *  - All URLs are Wikimedia Commons (public domain / CC-licensed)
 *  - galleryImages is a JSON array: [{url, caption, credit}]
 *  - imageUrl (hero) is the LAST entry in the galleryImages array
 *  - No duplicates anywhere in the gallery
 *  - All non-hero gallery entries are different from the hero
 */
// import { prisma } from "../src/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED WIKIMEDIA COMMONS POOL
// These are confirmed public domain / CC-licensed images
// ─────────────────────────────────────────────────────────────────────────────
const W = {
  // Frances Anne Hopkins fur trade paintings (PD-Canada)
  VOYAGEURS_DAWN:    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg/1280px-Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg",
  CANOE_VOYAGEURS:   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg/1280px-Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg",
  SHOOTING_RAPIDS:   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg/1280px-Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg",
  FUR_TRADERS:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Fur_Traders_Descending_the_Missouri.jpg/1280px-Fur_Traders_Descending_the_Missouri.jpg",

  // Key geographic sites (confirmed)
  YORK_FACTORY:      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
  PRINCE_WALES_FORT: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
  FORT_WILLIAM:      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
  COPPERMINE_RIVER:  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Coppermine_River.jpg/1280px-Coppermine_River.jpg",
  LAKE_OF_THE_WOODS: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Lake_of_the_Woods_aerial.jpg/1280px-Lake_of_the_Woods_aerial.jpg",
  FORT_ST_CHARLES:   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Fort_St._Charles.jpg/1280px-Fort_St._Charles.jpg",

  // Arctic / exploration
  HMS_EREBUS:        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg/1280px-HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg",
  FRANKLIN_EXP:      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Franklin%27s_lost_expedition.png/1280px-Franklin%27s_lost_expedition.png",

  // Historical scenes
  PLAINS_ABRAHAM:    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Death_of_General_Wolfe.jpg/1280px-Death_of_General_Wolfe.jpg",
  BATTLE_SEVEN_OAKS: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/BattleofSevenOaks1.jpg/1280px-BattleofSevenOaks1.jpg",
  LOUISBOURG:        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Siege_of_Louisbourg_1758.jpg/1280px-Siege_of_Louisbourg_1758.jpg",
  RED_RIVER_SETT:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/BattleofSevenOaks1.jpg/1280px-BattleofSevenOaks1.jpg",

  // Explorer portraits (all confirmed on Wikimedia)
  SAMUEL_HEARNE:     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Samuel_Hearne.jpg/800px-Samuel_Hearne.jpg",
  LA_VERENDRYE:      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/La_V%C3%A9rendrye.jpg/800px-La_V%C3%A9rendrye.jpg",
  HENRY_KELSEY:      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Henry_Kelsey.jpg/800px-Henry_Kelsey.jpg",
  SIMON_FRASER:      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Simon_Fraser_%28explorer%29.jpg/800px-Simon_Fraser_%28explorer%29.jpg",
  GEORGE_VANCOUVER:  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/George_Vancouver_portrait.jpg/800px-George_Vancouver_portrait.jpg",
  JAMES_COOK:        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Captainjamescookportrait.jpg/800px-Captainjamescookportrait.jpg",
  MARTIN_FROBISHER:  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sir_Martin_Frobisher_by_Cornelis_Ketel.jpg/800px-Sir_Martin_Frobisher_by_Cornelis_Ketel.jpg",
  ROALD_AMUNDSEN:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Amundsen_in_fur_skins.jpg/800px-Amundsen_in_fur_skins.jpg",
  CHAMPLAIN:         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samuel_de_Champlain_portrait.jpg/800px-Samuel_de_Champlain_portrait.jpg",
  MACKENZIE_EXP:     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/AlexanderMackenzie.jpg/800px-AlexanderMackenzie.jpg",
  DAVID_THOMPSON:    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/David_Thompson_%28explorer%29.jpg/800px-David_Thompson_%28explorer%29.jpg",
};

type GalleryEntry = { url: string; caption: string; credit: string };

// Build a gallery: 3 context images + hero as last. No duplicates.
function makeGallery(contextImages: GalleryEntry[], hero: GalleryEntry): GalleryEntry[] {
  // Remove any context entry that happens to share the hero URL
  const filtered = contextImages.filter(c => c.url !== hero.url);
  // Take at most 3 context images
  const ctx = filtered.slice(0, 3);
  return [...ctx, hero];
}

// Shorthand
function img(url: string, caption: string, credit = "Wikimedia Commons"): GalleryEntry {
  return { url, caption, credit };
}

// ─────────────────────────────────────────────────────────────────────────────
// WATERWAY MEDIA — hero + gallery context images (hero appended last by makeGallery)
// ─────────────────────────────────────────────────────────────────────────────
type EntityMedia = { hero: GalleryEntry; context: GalleryEntry[] };

const WATERWAY_MEDIA: Record<string, EntityMedia> = {
  "Abitibi River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Abitibi_Canyon.jpg/1280px-Abitibi_Canyon.jpg", "Abitibi River Canyon, Ontario", "Wikimedia Commons / Public Domain"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Albany River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/AlbanyRiver.jpg/1280px-AlbanyRiver.jpg", "Albany River, James Bay Lowlands", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Assiniboine River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Assiniboine_River_at_Winnipeg.jpg/1280px-Assiniboine_River_at_Winnipeg.jpg", "Assiniboine River at Winnipeg", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — near Red River settlement")],
  },
  "Athabasca River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Athabasca_River_Jasper.jpg/1280px-Athabasca_River_Jasper.jpg", "Athabasca River near Jasper, Alberta", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — explorer of the Athabasca and Mackenzie River systems"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Atikokan River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Quetico_canoe_country.jpg/1280px-Quetico_canoe_country.jpg", "Quetico Canoe Country, Northwestern Ontario", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Back River": {
    hero: img(W.COPPERMINE_RIVER, "Back River region, Nunavut — remote Arctic waterway", "Wikimedia Commons"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — explored the Coppermine and Arctic regions"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — search parties crossed the Back River region")],
  },
  "Baffin Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Baffin_Bay_-_Iceberg.jpg/1280px-Baffin_Bay_-_Iceberg.jpg", "Iceberg in Baffin Bay", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — first European explorer of Baffin Bay, 1576"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition, 1845")],
  },
  "Baie des Chaleurs": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Chaleur_Bay.jpg/1280px-Chaleur_Bay.jpg", "Baie des Chaleurs — Chaleur Bay, Quebec/New Brunswick", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — mapped and explored the St. Lawrence and Gaspé region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Seven Years' War in New France")],
  },
  "Bellot Strait": {
    hero: img(W.HMS_EREBUS, "HMS Erebus and Terror in Arctic waters — Franklin Expedition, 1845", "Wikimedia Commons"),
    context: [img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — searched for Northwest Passage"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — first to navigate the Northwest Passage, 1903–1906"), img(W.MARTIN_FROBISHER, "Martin Frobisher — early Northwest Passage explorer, 1576")],
  },
  "Bonavista Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cape_Bonavista.JPG/1280px-Cape_Bonavista.JPG", "Cape Bonavista, Newfoundland", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — Elizabethan-era explorer of eastern Canada"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — the Newfoundland fisheries preceded the continental fur trade")],
  },
  "Burrard Inlet": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Vancouver_Harbour_from_Prospect_Point.jpg/1280px-Vancouver_Harbour_from_Prospect_Point.jpg", "Vancouver Harbour from Prospect Point, Burrard Inlet", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed Burrard Inlet in 1792"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.DAVID_THOMPSON, "David Thompson — mapped the Columbia River system")],
  },
  "Chesterfield Inlet": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chesterfield_Inlet_Nunavut.jpg/1280px-Chesterfield_Inlet_Nunavut.jpg", "Chesterfield Inlet, Nunavut", "Wikimedia Commons"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — explored western Hudson Bay region"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.HENRY_KELSEY, "Henry Kelsey — early HBC explorer of the Hudson Bay interior")],
  },
  "Churchill River (Saskatchewan)": {
    hero: img(W.PRINCE_WALES_FORT, "Prince of Wales Fort at the mouth of the Churchill River, Manitoba", "Wikimedia Commons"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — launched Arctic expeditions from Prince of Wales Fort"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Columbia River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Columbia_River_Gorge_seen_from_Washington_State_side.jpg/1280px-Columbia_River_Gorge_seen_from_Washington_State_side.jpg", "Columbia River Gorge", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — first to navigate the full length of the Columbia River, 1811"), img(W.SIMON_FRASER, "Simon Fraser — North West Company explorer of the Pacific Northwest"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Coppermine River": {
    hero: img(W.COPPERMINE_RIVER, "Coppermine River, Northwest Territories", "Wikimedia Commons / Public Domain"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — first European to reach the Coppermine River, 1771"), img(W.HMS_EREBUS, "HMS Erebus and Terror — later Arctic explorers followed Hearne's routes"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — the Arctic consumed many explorers")],
  },
  "Cumberland Sound": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Baffin_Island_coast.jpg/1280px-Baffin_Island_coast.jpg", "Baffin Island coast at Cumberland Sound", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — early explorer of the eastern Arctic, 1576–1578"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration ships"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition, 1845")],
  },
  "Davis Strait": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Davis_Strait_Canada.jpg/1280px-Davis_Strait_Canada.jpg", "Davis Strait between Baffin Island and Greenland", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — Elizabethan explorer of the eastern Arctic"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Franklin Expedition passed through Davis Strait"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — Norwegian explorer, first Northwest Passage transit")],
  },
  "Dean Channel": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Dean_Channel_BC.jpg/1280px-Dean_Channel_BC.jpg", "Dean Channel, British Columbia — where Mackenzie reached the Pacific", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — first European to cross North America, reached Dean Channel in 1793"), img(W.DAVID_THOMPSON, "David Thompson — mapped much of western Canada"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "English Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/English_Bay_Vancouver.jpg/1280px-English_Bay_Vancouver.jpg", "English Bay, Vancouver, British Columbia", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed English Bay in 1792"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.DAVID_THOMPSON, "David Thompson — Columbia River and Pacific Northwest explorer")],
  },
  "Foxe Basin": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Foxe_Basin_sea_ice.jpg/1280px-Foxe_Basin_sea_ice.jpg", "Sea ice in Foxe Basin, Nunavut", "Wikimedia Commons"),
    context: [img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition, 1845"), img(W.MARTIN_FROBISHER, "Martin Frobisher — early Arctic explorer")],
  },
  "Fraser River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Fraser_River_Canyon.JPG/1280px-Fraser_River_Canyon.JPG", "Fraser River Canyon, British Columbia", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — descended the river bearing his name to the Pacific, 1808"), img(W.DAVID_THOMPSON, "David Thompson — North West Company geographer and explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "French River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/French_River_Ontario.jpg/1280px-French_River_Ontario.jpg", "French River, Ontario — key voyageur canoe route", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — paddled the French River corridor, 1615"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Friendly Cove (Yuquot)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nootka_Sound_from_air.jpg/1280px-Nootka_Sound_from_air.jpg", "Nootka Sound, Vancouver Island — site of Friendly Cove (Yuquot)", "Wikimedia Commons"),
    context: [img(W.JAMES_COOK, "Captain James Cook — arrived at Nootka Sound in 1778"), img(W.GEORGE_VANCOUVER, "Captain George Vancouver — negotiated the Nootka Convention, 1792"), img(W.DAVID_THOMPSON, "David Thompson — Pacific Northwest explorer")],
  },
  "Frobisher Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Frobisher_Bay_Iqaluit.jpg/1280px-Frobisher_Bay_Iqaluit.jpg", "Frobisher Bay at Iqaluit, Nunavut", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — discovered and named this bay during his 1576–1578 voyages"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition, 1845")],
  },
  "Gaspé Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Cape_Bon-Ami.jpg/1280px-Cape_Bon-Ami.jpg", "Gaspé Peninsula, Quebec", "Wikimedia Commons / Public Domain"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — mapped and explored the Gulf of St. Lawrence"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Battle of the Plains of Abraham, 1759"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Georgia Strait": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Strait_of_Georgia.jpg/1280px-Strait_of_Georgia.jpg", "Strait of Georgia, British Columbia", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed the Strait of Georgia extensively in 1792"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.DAVID_THOMPSON, "David Thompson — Columbia River and Pacific Northwest explorer")],
  },
  "Great Bear Lake": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Great_Bear_Lake_NWT.jpg/1280px-Great_Bear_Lake_NWT.jpg", "Great Bear Lake, Northwest Territories", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — explored the Mackenzie River system including Great Bear Lake region"), img(W.SAMUEL_HEARNE, "Samuel Hearne — explored northern Canada on behalf of the HBC"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels")],
  },
  "Great Slave Lake": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Great_Slave_Lake_aerial.jpg/1280px-Great_Slave_Lake_aerial.jpg", "Great Slave Lake aerial view, Northwest Territories", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — departed from Great Slave Lake on his 1789 Arctic expedition"), img(W.SAMUEL_HEARNE, "Samuel Hearne — explored the region south of Great Slave Lake"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Hayes River": {
    hero: img(W.YORK_FACTORY, "York Factory at the mouth of the Hayes River, Manitoba", "Wikimedia Commons / Public Domain"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.HENRY_KELSEY, "Henry Kelsey — travelled inland from York Factory, 1690")],
  },
  "Hudson Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hudson_Bay_Aerial.jpg/1280px-Hudson_Bay_Aerial.jpg", "Hudson Bay aerial view", "Wikimedia Commons"),
    context: [img(W.YORK_FACTORY, "York Factory — the HBC's principal depot on Hudson Bay for nearly 200 years"), img(W.PRINCE_WALES_FORT, "Prince of Wales Fort at the mouth of the Churchill River"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "James Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/James_Bay_Ontario.jpg/1280px-James_Bay_Ontario.jpg", "James Bay coastline, Ontario", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer who travelled inland from the Bay posts")],
  },
  "Juan de Fuca Strait": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Juan_de_Fuca_Strait.jpg/1280px-Juan_de_Fuca_Strait.jpg", "Juan de Fuca Strait separating Vancouver Island from Washington State", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — extensively surveyed the Juan de Fuca Strait in 1792"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast before Vancouver"), img(W.DAVID_THOMPSON, "David Thompson — Pacific Northwest explorer")],
  },
  "Kaministiquia River": {
    hero: img(W.FORT_WILLIAM, "Old Fort William — North West Company headquarters at the mouth of the Kaministiquia River", "Wikimedia Commons / panoramio"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Lake Athabasca": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lake_Athabasca_aerial.jpg/1280px-Lake_Athabasca_aerial.jpg", "Lake Athabasca aerial view, Alberta/Saskatchewan", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — paddled through Lake Athabasca on his 1789 Arctic voyage"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Lake Erie": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Lake_Erie_from_space.jpg/1280px-Lake_Erie_from_space.jpg", "Lake Erie from space — smallest Great Lake by depth", "Wikimedia Commons / NASA"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — explored the Great Lakes region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Great Lakes were central to the continental fur trade")],
  },
  "Lake Huron": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Georgian_Bay_Canada.jpg/1280px-Georgian_Bay_Canada.jpg", "Georgian Bay, Lake Huron, Ontario", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — explored Georgian Bay and Lake Huron, 1615–1616"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Lake Michigan": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Lake_Michigan_from_Sleeping_Bear_Dunes.jpg/1280px-Lake_Michigan_from_Sleeping_Bear_Dunes.jpg", "Lake Michigan from Sleeping Bear Dunes", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — his maps depicted the Great Lakes chain"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Great Lakes were highways of the fur trade")],
  },
  "Lake Nipigon": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lake_Nipigon_Ontario.jpg/1280px-Lake_Nipigon_Ontario.jpg", "Lake Nipigon, Ontario — headwaters of the Nipigon River", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845")],
  },
  "Lake Ontario": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Lake_Ontario_Aerial.jpg/1280px-Lake_Ontario_Aerial.jpg", "Lake Ontario aerial view", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — first documented European to see Lake Ontario, 1615"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — War for control of the Great Lakes region")],
  },
  "Lake Superior": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pictured_Rocks_on_Lake_Superior.jpg/1280px-Pictured_Rocks_on_Lake_Superior.jpg", "Pictured Rocks on Lake Superior — largest of the Great Lakes", "Wikimedia Commons"),
    context: [img(W.FORT_WILLIAM, "Old Fort William — North West Company rendezvous on Lake Superior"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Lake Winnipeg": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lake_Winnipeg_shore.jpg/1280px-Lake_Winnipeg_shore.jpg", "Lake Winnipeg shoreline, Manitoba", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored Lake Winnipeg region, 1730s"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — near the Red River settlement"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Lake of the Woods": {
    hero: img(W.LAKE_OF_THE_WOODS, "Lake of the Woods aerial view, Ontario/Manitoba border", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — established Fort St. Charles on Lake of the Woods, 1732"), img(W.FORT_ST_CHARLES, "Fort St. Charles — La Vérendrye's base on Lake of the Woods"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Lancaster Sound": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Lancaster_Sound_Arctic.jpg/1280px-Lancaster_Sound_Arctic.jpg", "Lancaster Sound, gateway to the Northwest Passage", "Wikimedia Commons"),
    context: [img(W.HMS_EREBUS, "HMS Erebus and Terror — entered Lancaster Sound in 1845 and were lost"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — departed through Lancaster Sound"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — first to navigate the Northwest Passage, 1903–1906")],
  },
  "Lesser Slave Lake": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Lesser_Slave_Lake_Alberta.jpg/1280px-Lesser_Slave_Lake_Alberta.jpg", "Lesser Slave Lake, Alberta", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — explored the Peace-Athabasca region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — the Lesser Slave was a trade corridor to the north")],
  },
  "Lituya Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lituya_Bay_Alaska.jpg/1280px-Lituya_Bay_Alaska.jpg", "Lituya Bay, Alaska — La Pérouse expedition tragedy, 1786", "Wikimedia Commons"),
    context: [img(W.JAMES_COOK, "Captain James Cook — explored the Alaska coast before La Pérouse"), img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed the Alaska coast, 1794"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Mackenzie River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mackenzie_River_delta_NASA.jpg/1280px-Mackenzie_River_delta_NASA.jpg", "Mackenzie River delta, Northwest Territories — NASA satellite image", "Wikimedia Commons / NASA"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — descended the Mackenzie River to the Arctic Ocean, 1789"), img(W.SAMUEL_HEARNE, "Samuel Hearne — HBC explorer of the Mackenzie Basin region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Mercy Bay": {
    hero: img(W.HMS_EREBUS, "HMS Erebus and Terror in Arctic waters — Franklin Expedition, 1845", "Wikimedia Commons"),
    context: [img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — ships became trapped in Arctic ice near Mercy Bay"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — successfully completed the Northwest Passage, 1906"), img(W.HMS_EREBUS, "HMS Erebus — discovered on the seabed in 2014")],
  },
  "Moose River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MooseFactory1.jpg/1280px-MooseFactory1.jpg", "Moose Factory on the Moose River, Ontario — oldest English-speaking settlement in Ontario", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — James Bay posts at the Moose River were early HBC strongholds"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer who departed from Bay posts")],
  },
  "Nelson River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nelson_River_Manitoba.jpg/1280px-Nelson_River_Manitoba.jpg", "Nelson River, Manitoba — drains Lake Winnipeg into Hudson Bay", "Wikimedia Commons"),
    context: [img(W.YORK_FACTORY, "York Factory — located at the Nelson River mouth"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.HENRY_KELSEY, "Henry Kelsey — departed from Hudson Bay posts via the Nelson River system")],
  },
  "Nootka Sound": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nootka_Sound_from_air.jpg/1280px-Nootka_Sound_from_air.jpg", "Nootka Sound, Vancouver Island — site of first European contact on the BC coast", "Wikimedia Commons"),
    context: [img(W.JAMES_COOK, "Captain James Cook — arrived at Nootka Sound in 1778, sparking the maritime fur trade"), img(W.GEORGE_VANCOUVER, "Captain George Vancouver — negotiated the Nootka Convention with Spain, 1792"), img(W.DAVID_THOMPSON, "David Thompson — North West Company Columbia Department explorer")],
  },
  "Ottawa River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ottawa_River_Parliament.jpg/1280px-Ottawa_River_Parliament.jpg", "Ottawa River with Parliament Hill, Ontario", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — paddled the Ottawa River to Georgian Bay, 1615"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Parry Channel": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Franklin%27s_lost_expedition.png/1280px-Franklin%27s_lost_expedition.png", "Map of Franklin's Lost Expedition through Parry Channel, 1845", "Wikimedia Commons"),
    context: [img(W.HMS_EREBUS, "HMS Erebus and Terror — Franklin Expedition, 1845"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — first to navigate the Northwest Passage, 1903–1906"), img(W.MARTIN_FROBISHER, "Martin Frobisher — early Northwest Passage explorer, 1576")],
  },
  "Peace River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Peace_River_valley_Alberta.jpg/1280px-Peace_River_valley_Alberta.jpg", "Peace River valley, Alberta", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — followed the Peace River on his 1793 Pacific crossing"), img(W.DAVID_THOMPSON, "David Thompson — explored the Rocky Mountain passes fed by the Peace River system"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Placentia Bay": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Placentia_Newfoundland.jpg/1280px-Placentia_Newfoundland.jpg", "Placentia, Newfoundland on Placentia Bay", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Battle of Quebec ended French control of Newfoundland"), img(W.LOUISBOURG, "Siege of Louisbourg — key battle for control of Atlantic Canada")],
  },
  "Queen Charlotte Sound": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Queen_Charlotte_Sound_BC.jpg/1280px-Queen_Charlotte_Sound_BC.jpg", "Queen Charlotte Sound, British Columbia", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed the BC coast including Queen Charlotte Sound, 1793"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.DAVID_THOMPSON, "David Thompson — Pacific Northwest explorer")],
  },
  "Queen Maud Gulf": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Queen_Maud_Gulf_Nunavut.jpg/1280px-Queen_Maud_Gulf_Nunavut.jpg", "Queen Maud Gulf, Nunavut — part of the Northwest Passage", "Wikimedia Commons"),
    context: [img(W.ROALD_AMUNDSEN, "Roald Amundsen — navigated through Queen Maud Gulf on the first Northwest Passage transit"), img(W.HMS_EREBUS, "HMS Erebus — discovered on the floor of Queen Maud Gulf in 2014"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — ships were lost in the Queen Maud Gulf region")],
  },
  "Red Deer River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Red_Deer_River_Alberta.jpg/1280px-Red_Deer_River_Alberta.jpg", "Red Deer River valley, Alberta", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — explored the Red Deer River region for the North West Company"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — the Red Deer crossed important trade territory")],
  },
  "Red River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Red_River_of_the_North.jpg/1280px-Red_River_of_the_North.jpg", "Red River of the North, Manitoba", "Wikimedia Commons"),
    context: [img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — conflict between Selkirk settlers and Métis on the Red River"), img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored the Red River system, 1730s"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Reindeer Lake": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Reindeer_Lake_Saskatchewan.jpg/1280px-Reindeer_Lake_Saskatchewan.jpg", "Reindeer Lake, Saskatchewan/Manitoba — one of the largest lakes in Canada", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.FUR_TRADERS, "Fur Traders — remote northern lakes were prime beaver habitat")],
  },
  "Saguenay River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Saguenay_fjord.jpg/1280px-Saguenay_fjord.jpg", "Saguenay Fjord, Quebec", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — explored the Saguenay River on his early voyages"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Battle of Quebec fought on the St. Lawrence near the Saguenay")],
  },
  "Saint John River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Saint_John_River_NB.jpg/1280px-Saint_John_River_NB.jpg", "Saint John River, New Brunswick", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — documented the Saint John River on his explorations"), img(W.LOUISBOURG, "Siege of Louisbourg — conflict for control of Atlantic Canada"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — end of French control in Atlantic Canada")],
  },
  "Saskatchewan River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Saskatchewan_River.jpg/1280px-Saskatchewan_River.jpg", "North Saskatchewan River, prairie landscape", "Wikimedia Commons"),
    context: [img(W.HENRY_KELSEY, "Henry Kelsey — first European to travel the Saskatchewan River, 1690"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Seine River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Rainy_Lake_Ontario.jpg/1280px-Rainy_Lake_Ontario.jpg", "Rainy Lake region, Ontario — near the Seine River fur trade canoe route", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.FUR_TRADERS, "Fur Traders — the Seine River connected Lake Superior to western routes")],
  },
  "Souris River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Souris_River_Manitoba.jpg/1280px-Souris_River_Manitoba.jpg", "Souris River, Manitoba", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored the Souris River region in the 1730s"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — the Souris River drained prime fur country")],
  },
  "St. Lawrence River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Saint_Lawrence_River.jpg/1280px-Saint_Lawrence_River.jpg", "St. Lawrence River — gateway to the heart of Canada", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — 'Father of New France,' founded Quebec City on the St. Lawrence"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Battle of the Plains of Abraham fought above the St. Lawrence"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Strait of Belle Isle": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Strait_of_Belle_Isle.jpg/1280px-Strait_of_Belle_Isle.jpg", "Strait of Belle Isle separating Labrador from Newfoundland", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — French explorers mapped the Gulf of St. Lawrence and Belle Isle"), img(W.MARTIN_FROBISHER, "Martin Frobisher — Elizabethan explorer of eastern Canada's coastal waters"), img(W.LOUISBOURG, "Siege of Louisbourg — control of the Strait of Belle Isle was strategically vital")],
  },
  "Terror Bay": {
    hero: img(W.HMS_EREBUS, "HMS Erebus and Terror in Antarctic waters — same ships lost in the Arctic, 1845", "Wikimedia Commons"),
    context: [img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — HMS Terror became trapped and sank in Terror Bay"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — first to complete the Northwest Passage, 1906"), img(W.HMS_EREBUS, "HMS Terror — discovered on the floor of Terror Bay in 2016")],
  },
  "Thelon River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Thelon_River_NWT.jpg/1280px-Thelon_River_NWT.jpg", "Thelon River, Northwest Territories — one of Canada's great wilderness rivers", "Wikimedia Commons"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — explored the Barrens west of Hudson Bay"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration ships"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition, 1845")],
  },
  "Yukon River": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Yukon_River_Alaska.jpg/1280px-Yukon_River_Alaska.jpg", "Yukon River, one of the longest rivers in North America", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — explored rivers draining to the Arctic and Pacific"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration era"), img(W.ROALD_AMUNDSEN, "Roald Amundsen — first Northwest Passage navigator, Yukon/Arctic era explorer")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCATION MEDIA — comprehensive map for all 100 locations
// ─────────────────────────────────────────────────────────────────────────────
const LOCATION_MEDIA: Record<string, EntityMedia> = {
  // ── HUDSON BAY COASTAL POSTS ──
  "York Factory": {
    hero: img(W.YORK_FACTORY, "York Factory, Manitoba — HBC principal depot for nearly 200 years", "Wikimedia Commons / Public Domain"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer who departed from York Factory, 1690"), img(W.FUR_TRADERS, "Fur Traders — York Factory was the main import/export hub of the HBC fur trade")],
  },
  "Prince of Wales Fort": {
    hero: img(W.PRINCE_WALES_FORT, "Prince of Wales Fort, Manitoba — the most substantial stone fortress built by the HBC", "Wikimedia Commons / Public Domain"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — factor of Prince of Wales Fort and Arctic explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — the fort controlled trade at the mouth of the Churchill River")],
  },
  "Fort Churchill (HBC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Churchill_Manitoba_town.jpg/1280px-Churchill_Manitoba_town.jpg", "Churchill, Manitoba — site of Fort Churchill (HBC)", "Wikimedia Commons"),
    context: [img(W.PRINCE_WALES_FORT, "Prince of Wales Fort — the nearby HBC stone fortress"), img(W.SAMUEL_HEARNE, "Samuel Hearne — launched Arctic expeditions from Churchill"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Severn": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hudson_Bay_coast_aerial.jpg/1280px-Hudson_Bay_coast_aerial.jpg", "Hudson Bay coastal tundra — Fort Severn, the northernmost community in Ontario", "Wikimedia Commons"),
    context: [img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Severn was the northernmost HBC Bay post")],
  },
  "Rupert House (Fort Charles)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/James_Bay_Ontario.jpg/1280px-James_Bay_Ontario.jpg", "James Bay coastline — site of Rupert House (Fort Charles), oldest HBC post on James Bay", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Rupert House was the HBC's oldest post, established 1668"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer who used Bay posts as departure points")],
  },
  "Moose Factory": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MooseFactory1.jpg/1280px-MooseFactory1.jpg", "Moose Factory, Ontario — oldest English-speaking settlement in Ontario", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Moose Factory was the HBC's Southern Department headquarters"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer")],
  },
  "Fort Albany": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/James_Bay_Ontario.jpg/1280px-James_Bay_Ontario.jpg", "James Bay lowlands — site of Fort Albany, a key early HBC trading post", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Albany controlled trade along the Albany River"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer who expanded from Bay posts")],
  },
  "Marble Island": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hudson_Bay_coast_aerial.jpg/1280px-Hudson_Bay_coast_aerial.jpg", "Hudson Bay west coast — Marble Island, where James Knight's expedition was lost", "Wikimedia Commons"),
    context: [img(W.SAMUEL_HEARNE, "Samuel Hearne — led search expeditions that discovered Knight's remains on Marble Island"), img(W.HENRY_KELSEY, "Henry Kelsey — HBC explorer of the western Hudson Bay coast"), img(W.HMS_EREBUS, "HMS Erebus and Terror — the Arctic claimed many explorers, as it did Knight's party")],
  },
  // ── RED RIVER / FORT GARRY ──
  "Fort Garry": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg", "Lower Fort Garry stone buildings — the Fort Garry complex on the Red River", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored the Red River and built early posts here"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — conflict near Fort Garry"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Garry (Upper)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Upper_Fort_Garry_Gate.jpg/1280px-Upper_Fort_Garry_Gate.jpg", "Upper Fort Garry Gate, Winnipeg — the only surviving structure of Upper Fort Garry", "Wikimedia Commons"),
    context: [img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — near the Red River settlement"), img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — first explored the Red River region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Upper Fort Garry": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Upper_Fort_Garry_Gate.jpg/1280px-Upper_Fort_Garry_Gate.jpg", "Upper Fort Garry Gate, Winnipeg, Manitoba", "Wikimedia Commons"),
    context: [img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — Métis vs. Selkirk settlers, near the Red River"), img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — Red River explorer, 1730s"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Lower Fort Garry": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lower_Fort_Garry_stone_walls.jpg/1280px-Lower_Fort_Garry_stone_walls.jpg", "Lower Fort Garry stone walls, Manitoba — only intact stone fur trade fort in North America", "Wikimedia Commons"),
    context: [img(W.FUR_TRADERS, "Fur Traders — Lower Fort Garry was a major HBC distribution centre"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks — nearby conflict that shaped the Red River colony")],
  },
  "Fort Pembina": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Red_River_of_the_North.jpg/1280px-Red_River_of_the_North.jpg", "Red River of the North, Manitoba — site of Fort Pembina at the US border", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored the Red River, 1730s"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks — the Red River colony was contested ground"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Norway House": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lake_Winnipeg_shore.jpg/1280px-Lake_Winnipeg_shore.jpg", "Lake Winnipeg — Norway House was located at the key northern outlet", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Norway House became the HBC's inland transport hub after merger"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Bas-de-la-Rivière (Fort Alexander)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Red_River_of_the_North.jpg/1280px-Red_River_of_the_North.jpg", "Red River area — Bas-de-la-Rivière (Fort Alexander) on the Winnipeg River", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  // ── SASKATCHEWAN / PRAIRIE POSTS ──
  "Fort Carlton": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fort_Carlton_Provincial_Park.jpg/1280px-Fort_Carlton_Provincial_Park.jpg", "Fort Carlton Provincial Historic Park, Saskatchewan", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Carlton was a key HBC provisioning post on the North Saskatchewan"), img(W.HENRY_KELSEY, "Henry Kelsey — first European to travel the Saskatchewan River")],
  },
  "Fort Augustus (NWC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/North_Saskatchewan_River_valley.jpg/1280px-North_Saskatchewan_River_valley.jpg", "North Saskatchewan River valley, Alberta — site of Fort Augustus (NWC)", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — North West Company geographer and explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Augustus was the NWC counterpart to Fort Edmonton (HBC)")],
  },
  "Fort Pitt": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Saskatchewan_prairie_landscape.jpg/1280px-Saskatchewan_prairie_landscape.jpg", "Saskatchewan prairie landscape — site of Fort Pitt on the North Saskatchewan River", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Pitt was an important HBC post on the North Saskatchewan"), img(W.HENRY_KELSEY, "Henry Kelsey — first European to travel the Saskatchewan River, 1690")],
  },
  "Fort Battleford": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg", "Fort Battleford National Historic Site, Saskatchewan", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Battleford was named capital of the North-West Territories in 1876"), img(W.HENRY_KELSEY, "Henry Kelsey — the North Saskatchewan was his key exploration route")],
  },
  "Fort Ellice": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Assiniboine_River_valley.jpg/1280px-Assiniboine_River_valley.jpg", "Assiniboine River valley, Manitoba — Fort Ellice at the Qu'Appelle junction", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored the Assiniboine River, 1730s"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort Ellice was a key NWC and later HBC post on the Assiniboine")],
  },
  "Fort George (NWC - Saskatchewan)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Saskatchewan_River.jpg/1280px-Saskatchewan_River.jpg", "North Saskatchewan River — site of Fort George (NWC) in Saskatchewan", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — mapped the Saskatchewan River system"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Fort George was the NWC post on the upper Saskatchewan")],
  },
  "Batoche": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg", "Fort Battleford National Historic Site — near Batoche, Saskatchewan, key to the 1885 Resistance", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.BATTLE_SEVEN_OAKS, "Battle of Seven Oaks, 1816 — earlier Métis conflict on the Red River"), img(W.FUR_TRADERS, "Fur Traders — Batoche was a Métis community on the South Saskatchewan River")],
  },
  // ── ROCKY MOUNTAINS ──
  "Rocky Mountain House": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rocky_Mountain_House_NHS_%282%29.JPG/1280px-Rocky_Mountain_House_NHS_%282%29.JPG", "Rocky Mountain House National Historic Site, Alberta", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — wintered at Rocky Mountain House and explored the Rockies"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Rocky Mountain House was a key NWC/HBC post on the North Saskatchewan")],
  },
  "Rocky Mountain House (NWC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Canadian_Rockies_foothills.jpg/1280px-Canadian_Rockies_foothills.jpg", "Canadian Rockies foothills, Alberta — site of Rocky Mountain House (NWC)", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — North West Company geographer who explored from Rocky Mountain House"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.MACKENZIE_EXP, "Alexander Mackenzie — crossed the Rockies via the Peace River in 1793")],
  },
  "Kootenay House": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Columbia_Valley_BC.jpg/1280px-Columbia_Valley_BC.jpg", "Columbia Valley, British Columbia — site of Kootenay House, David Thompson's first post west of the Rockies", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — built Kootenay House in 1807, first European post west of the Rocky Mountains"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SIMON_FRASER, "Simon Fraser — another North West Company explorer of the Pacific Northwest")],
  },
  // ── ATHABASCA / MACKENZIE POSTS ──
  "Fort Norman": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Great_Bear_River_NWT.jpg/1280px-Great_Bear_River_NWT.jpg", "Great Bear River at the Mackenzie, Northwest Territories — near Fort Norman (Tulita)", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — descended the Mackenzie River past this site in 1789"), img(W.SAMUEL_HEARNE, "Samuel Hearne — HBC Arctic explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Simpson": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mackenzie_River_NWT.jpg/1280px-Mackenzie_River_NWT.jpg", "Mackenzie River, Northwest Territories — Fort Simpson at the confluence with the Liard River", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — travelled the Mackenzie River past this site, 1789"), img(W.SAMUEL_HEARNE, "Samuel Hearne — HBC Northern Department explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Providence": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mackenzie_River_Great_Slave.jpg/1280px-Mackenzie_River_Great_Slave.jpg", "Mackenzie River near Great Slave Lake — Fort Providence at the river's outflow", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — departed Great Slave Lake down the Mackenzie in 1789"), img(W.SAMUEL_HEARNE, "Samuel Hearne — HBC Northern Department explorer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Rae": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Great_Slave_Lake_NWT.jpg/1280px-Great_Slave_Lake_NWT.jpg", "Great Slave Lake, Northwest Territories — Fort Rae (Behchokǫ̀) on the North Arm", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — paddled the shores of Great Slave Lake in 1789"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.SAMUEL_HEARNE, "Samuel Hearne — explored the region south of Great Slave Lake")],
  },
  "Fort Reliance": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Great_Slave_Lake_shore.jpg/1280px-Great_Slave_Lake_shore.jpg", "Great Slave Lake shore, Northwest Territories — Fort Reliance at the eastern end", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — explored Great Slave Lake and the Mackenzie River"), img(W.HMS_EREBUS, "HMS Erebus and Terror — Arctic exploration vessels"), img(W.FRANKLIN_EXP, "Franklin's Lost Expedition — Fort Reliance supported back River search parties")],
  },
  "Fort Vermilion (NWC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Peace_River_valley_Alberta.jpg/1280px-Peace_River_valley_Alberta.jpg", "Peace River valley, Alberta — Fort Vermilion (NWC) on the Peace River", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — travelled the Peace River on his 1793 Pacific crossing"), img(W.DAVID_THOMPSON, "David Thompson — mapped the Peace River region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Dunvegan": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Fort_Dunvegan_NHS.jpg/1280px-Fort_Dunvegan_NHS.jpg", "Fort Dunvegan National Historic Site, Alberta", "Wikimedia Commons"),
    context: [img(W.MACKENZIE_EXP, "Alexander Mackenzie — passed through the Peace River region in 1793"), img(W.DAVID_THOMPSON, "David Thompson — mapped the Peace River and surrounding territory"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  // ── LAKE SYSTEM POSTS ──
  "Sault Ste. Marie Post": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sault_Ste_Marie_locks.jpg/1280px-Sault_Ste_Marie_locks.jpg", "Sault Ste. Marie locks, Ontario — key portage connecting Lake Huron and Lake Superior", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — passed the rapids at Sault Ste. Marie on his 1615 journey"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  // ── BC INTERIOR POSTS ──
  "Fort St. James": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Fort_St_James_NHS.jpg/1280px-Fort_St_James_NHS.jpg", "Fort St. James National Historic Site, British Columbia", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — established Fort St. James in 1806 as NWC headquarters for New Caledonia"), img(W.DAVID_THOMPSON, "David Thompson — explored the Columbia River system nearby"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Kamloops": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Thompson_Rivers_confluence_Kamloops.jpg/1280px-Thompson_Rivers_confluence_Kamloops.jpg", "Thompson Rivers confluence at Kamloops — site of Fort Kamloops", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — established fur trade posts in the interior of British Columbia"), img(W.DAVID_THOMPSON, "David Thompson — mapped the Columbia River and tributaries"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort McLeod (BC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/McLeod_Lake_BC.jpg/1280px-McLeod_Lake_BC.jpg", "McLeod Lake, British Columbia — site of Fort McLeod, first permanent European settlement west of the Rockies", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — built Fort McLeod in 1805, first permanent European settlement west of the Rockies"), img(W.MACKENZIE_EXP, "Alexander Mackenzie — first European to cross to the Pacific, blazing the trail"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort George (NWC - BC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Fraser_River_Prince_George.jpg/1280px-Fraser_River_Prince_George.jpg", "Fraser River at Prince George — site of Fort George (NWC), present-day Prince George", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — established Fort George at the confluence of the Fraser and Nechako rivers"), img(W.DAVID_THOMPSON, "David Thompson — North West Company geographer"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Alexandria": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fraser_River_canyon.jpg/1280px-Fraser_River_canyon.jpg", "Fraser River canyon, British Columbia — Fort Alexandria at the head of navigation on the Fraser", "Wikimedia Commons"),
    context: [img(W.SIMON_FRASER, "Simon Fraser — Fort Alexandria was named after him; marks where he turned back from the canyon"), img(W.DAVID_THOMPSON, "David Thompson — mapped the Columbia River system"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort McLoughlin": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Central_Coast_BC_fjords.jpg/1280px-Central_Coast_BC_fjords.jpg", "Central Coast BC fjords — site of Fort McLoughlin (HBC) on Milbanke Sound", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed the BC central coast in 1793"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  // ── PACIFIC COAST POSTS ──
  "Fort Rupert": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg", "Vancouver Island north coast — Fort Rupert (HBC), built 1849", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed Vancouver Island's coast"), img(W.JAMES_COOK, "Captain James Cook — arrived at Nootka Sound on Vancouver Island, 1778"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Simpson (BC)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/North_Coast_BC_Tsimshian.jpg/1280px-North_Coast_BC_Tsimshian.jpg", "North coast BC — Fort Simpson (Lax Kw'alaams), key HBC coastal post", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — surveyed the north BC coast, 1793"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast, 1778"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Spokane House": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Spokane_River_WA.jpg/1280px-Spokane_River_WA.jpg", "Spokane River, Washington — site of Spokane House (NWC, 1810)", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — established Spokane House as an NWC trading post in 1810"), img(W.SIMON_FRASER, "Simon Fraser — fellow NWC explorer of the Pacific Northwest"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  "Fort Nez Percés (Fort Walla Walla)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Columbia_River_Wallula_WA.jpg/1280px-Columbia_River_Wallula_WA.jpg", "Columbia River at Wallula Gap — site of Fort Nez Percés (Fort Walla Walla)", "Wikimedia Commons"),
    context: [img(W.DAVID_THOMPSON, "David Thompson — first navigated the Columbia River to its mouth, 1811"), img(W.SIMON_FRASER, "Simon Fraser — NWC Columbia Department colleague"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  // ── EASTERN / HISTORICAL SITES ──
  "Quebec City": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Old_Quebec_City_Chateau.jpg/1280px-Old_Quebec_City_Chateau.jpg", "Old Quebec City — founded by Samuel de Champlain in 1608", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — 'Father of New France,' founded Quebec City in 1608"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Battle of the Plains of Abraham, 1759, above Quebec City"), img(W.LOUISBOURG, "Siege of Louisbourg — earlier battle that set the stage for the fall of New France")],
  },
  "Montreal": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Montreal_harbour_1878.jpg/1280px-Montreal_harbour_1878.jpg", "Montreal harbour, 1878 — the commercial heart of the fur trade", "Wikimedia Commons / Public Domain"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — built a trading post at the site of present-day Montreal"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — Montreal was the operational base for the North West Company")],
  },
  "Port-Royal (Habitation)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Port_Royal_habitation.jpg/1280px-Port_Royal_habitation.jpg", "Port-Royal Habitation, Nova Scotia — first European settlement north of Florida, 1605", "Wikimedia Commons / Public Domain"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — co-founder of Port-Royal in 1605"), img(W.LOUISBOURG, "Siege of Louisbourg — later conflict in the same region"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — outcome of the Seven Years' War affected all of Acadia")],
  },
  "Red Bay Basque Whaling Station": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Red_Bay_Labrador_UNESCO.jpg/1280px-Red_Bay_Labrador_UNESCO.jpg", "Red Bay, Labrador — UNESCO World Heritage Site, 16th-century Basque whaling station", "Wikimedia Commons"),
    context: [img(W.MARTIN_FROBISHER, "Martin Frobisher — Elizabethan explorer who followed Basque whalers to Labrador"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.LOUISBOURG, "Siege of Louisbourg — later conflict for control of the Atlantic approaches to Canada")],
  },
  "Fort St. Charles": {
    hero: img(W.FORT_ST_CHARLES, "Fort St. Charles memorial cross — La Vérendrye's base on Lake of the Woods, 1732", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — built Fort St. Charles on Lake of the Woods in 1732"), img(W.LAKE_OF_THE_WOODS, "Lake of the Woods aerial view — La Vérendrye explored this entire region"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871")],
  },
  // ── PACIFIC CONTACT SITES ──
  "Bligh Island (Nootka Sound)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg", "Vancouver Island coast — Bligh Island in Nootka Sound, named by Captain Cook after William Bligh", "Wikimedia Commons"),
    context: [img(W.JAMES_COOK, "Captain James Cook — arrived at Nootka Sound in 1778 with William Bligh as sailing master"), img(W.GEORGE_VANCOUVER, "Captain George Vancouver — returned to Nootka Sound to negotiate with Spain, 1792"), img(W.DAVID_THOMPSON, "David Thompson — NWC Pacific coast explorer")],
  },
  "Friendly Cove Landing (Cook's Landing)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg", "Vancouver Island west coast — Friendly Cove (Yuquot), where Captain Cook anchored in 1778", "Wikimedia Commons"),
    context: [img(W.JAMES_COOK, "Captain James Cook — first landed at Friendly Cove, launching the maritime fur trade"), img(W.GEORGE_VANCOUVER, "Captain George Vancouver — negotiated the Nootka Convention at Friendly Cove, 1792"), img(W.DAVID_THOMPSON, "David Thompson — Pacific Northwest explorer")],
  },
  "Point Grey (Vancouver Meeting Point)": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Point_Grey_Vancouver_BC.jpg/1280px-Point_Grey_Vancouver_BC.jpg", "Point Grey, Vancouver — where Captain Vancouver and Galiano met in 1792", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — met Spanish explorers Galiano and Valdés at Point Grey, June 1792"), img(W.JAMES_COOK, "Captain James Cook — explored the BC coast before Vancouver"), img(W.DAVID_THOMPSON, "David Thompson — reached the Pacific at the Columbia River mouth, 1811")],
  },
  "Spanish Banks Beach": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Point_Grey_Vancouver_BC.jpg/1280px-Point_Grey_Vancouver_BC.jpg", "Point Grey area, Vancouver — Spanish Banks marks where the Spanish expedition anchored in 1792", "Wikimedia Commons"),
    context: [img(W.GEORGE_VANCOUVER, "Captain George Vancouver — met Spanish explorers near Spanish Banks, 1792"), img(W.JAMES_COOK, "Captain James Cook — Cook's charts of the BC coast guided Vancouver"), img(W.DAVID_THOMPSON, "David Thompson — Columbia River and Pacific coast explorer")],
  },
  // ── PORTAGE ROUTES ──
  "Frog Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Saskatchewan_River_Delta.jpg/1280px-Saskatchewan_River_Delta.jpg", "Saskatchewan River Delta region — Frog Portage connected the Churchill River to the Saskatchewan", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "French Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg", "Northern Manitoba lake country — French Portage on the Churchill River route", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Great Dog Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg", "Northern Manitoba lake country — Great Dog Portage on the Reindeer Lake route", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "La Vase Portages": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/French_River_Ontario.jpg/1280px-French_River_Ontario.jpg", "French River, Ontario — La Vase Portages linked the French River route to the Ottawa River", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — used the La Vase Portages on his 1615 journey to Georgian Bay"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Long Sault Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ottawa_River_Parliament.jpg/1280px-Ottawa_River_Parliament.jpg", "Ottawa River — Long Sault Portage bypassed dangerous rapids on the Ottawa River route", "Wikimedia Commons"),
    context: [img(W.CHAMPLAIN, "Samuel de Champlain — portaged around the Long Sault on the Ottawa River"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "Rat Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Lake_of_the_Woods_aerial.jpg/1280px-Lake_of_the_Woods_aerial.jpg", "Lake of the Woods — Rat Portage (Kenora) at the lake's outlet", "Wikimedia Commons"),
    context: [img(W.LA_VERENDRYE, "Pierre Gaultier de La Vérendrye — explored Lake of the Woods and the Rat Portage route"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
  },
  "Slave Falls Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Northern_Manitoba_lakes.jpg/1280px-Northern_Manitoba_lakes.jpg", "Northern Manitoba — Slave Falls Portage on the Winnipeg River route", "Wikimedia Commons"),
    context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
  "The Pas Portage": {
    hero: img("https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Saskatchewan_River.jpg/1280px-Saskatchewan_River.jpg", "Saskatchewan River at The Pas, Manitoba — The Pas Portage bypassed rapids on the lower Saskatchewan", "Wikimedia Commons"),
    context: [img(W.HENRY_KELSEY, "Henry Kelsey — travelled the Saskatchewan River region, 1690"), img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
  },
};

// Default media for locations not individually mapped
function defaultLocationMedia(name: string, locationType: string): EntityMedia {
  const defaults: Record<string, EntityMedia> = {
    "Fort": {
      hero: img(W.FORT_WILLIAM, "Old Fort William — representative of the fur trade fort network", "Wikimedia Commons / panoramio"),
      context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — George Caleb Bingham, 1845"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869")],
    },
    "Trading Post": {
      hero: img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845", "Wikimedia Commons / Public Domain"),
      context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879")],
    },
    "Portage": {
      hero: img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879 — iconic depiction of fur trade portage travel", "Wikimedia Commons / Public Domain"),
      context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845")],
    },
    "Settlement": {
      hero: img(W.CHAMPLAIN, "Samuel de Champlain — 'Father of New France,' founder of settlements across Canada", "Wikimedia Commons"),
      context: [img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871"), img(W.FUR_TRADERS, "Fur Traders — George Caleb Bingham, 1845"), img(W.PLAINS_ABRAHAM, "Death of General Wolfe — Seven Years' War shaped settlement patterns in Canada")],
    },
    "Cultural Site": {
      hero: img(W.VOYAGEURS_DAWN, "Voyageurs at Dawn — Frances Anne Hopkins, 1871 — iconic view of fur trade travel culture", "Wikimedia Commons / Public Domain"),
      context: [img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845")],
    },
  };
  return defaults[locationType] ?? defaults["Fort"]!;
}

// Default media for waterways not individually mapped
function defaultWaterwayMedia(name: string): EntityMedia {
  return {
    hero: img(W.VOYAGEURS_DAWN, `Voyageurs at Dawn — Frances Anne Hopkins, 1871 — fur trade travel on ${name}`, "Wikimedia Commons / Public Domain"),
    context: [img(W.CANOE_VOYAGEURS, "Canoe Manned by Voyageurs — Frances Anne Hopkins, 1869"), img(W.SHOOTING_RAPIDS, "Shooting the Rapids — Frances Anne Hopkins, 1879"), img(W.FUR_TRADERS, "Fur Traders Descending the Missouri — George Caleb Bingham, 1845")],
  };
}

async function main() {
  throw new Error("fix-all-media.ts is deprecated. Run migrate-images-to-cdn.ts instead.");
}

main().catch(console.error);
