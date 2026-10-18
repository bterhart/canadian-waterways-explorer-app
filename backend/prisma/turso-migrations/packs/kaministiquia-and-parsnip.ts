// Gap pack — the Kaministiquia route and the Parsnip (owner's review of 2026-10-17, authored
// 2026-10-18).
//
// Two gaps the owner found: the Dog Lake and Dog River leg of the Kaministiquia route, used by
// de Noyon in 1688, La Noue's post of 1717 and the North West Company after 1803, was missing
// although Great Dog Portage existed; and the Parsnip, Mackenzie's river to the Pacific, had no
// fur-trade record and no post, though Fort McLeod on McLeod Lake was supplied up it for twenty
// years. This pack adds the waterways, moves Fort Kaministiquia to its river and Fort McLeod to
// its lake, and gives the Parsnip and the route their fur-trade rows. Same rules as the packs.
// It has no lesson or field trip; the apply script treats those as optional.
import type { PackWaterway, PackLink, PackLocation, PackTimelineEvent, PackHistoricalEvent, PackPronunciation, PackGuide } from "./new-france-to-the-gulf";
import type { PackExplorerWithPortrait, PackFigureWithPortrait } from "./pacific-and-russians";

const wiki = (slug: string) => `https://en.wikipedia.org/wiki/${slug}`;
const dcb = (slug: string) => `https://www.biographi.ca/en/bio/${slug}.html`;
const tce = (slug: string) => `https://www.thecanadianencyclopedia.ca/en/article/${slug}`;
const W = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "Wikipedia", url: wiki(slug), description, gradeLevel: "7-9" });
const DCB = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "Dictionary of Canadian Biography", url: dcb(slug), description, gradeLevel: "10-12" });
const TCE = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "The Canadian Encyclopedia", url: tce(slug), description, gradeLevel: "7-9" });
const HBCA = (post: string, description: string): PackGuide => ({ title: `${post} post records`, authorSource: "Hudson's Bay Company Archives", publisher: "Archives of Manitoba, Winnipeg", description, gradeLevel: "10-12" });
const PC = (title: string, description: string): PackGuide => ({ title, authorSource: "Parks Canada", description, gradeLevel: "4-6" });
const OP = (title: string, description: string): PackGuide => ({ title, authorSource: "Ontario Parks", description, gradeLevel: "4-6" });

export type { PackImage, PackGuide } from "./new-france-to-the-gulf";

// ────────────────────────────────────────────────────────────────────────────────
export const waterways: PackWaterway[] = [
  { key: "doglake", name: "Dog Lake", typeName: "Lake", indigenousName: null, indigenousLanguage: "Anishinaabemowin (Ojibwe)",
    description: "The lake northwest of Thunder Bay from which the Kaministiquia flows south to Lake Superior, fed by the Dog River from the north; named for the great effigy of a dog that the Ojibwe cut into the ridge between Big and Little Dog lakes, in memory of a dog that woke the village before a Cree attack. Dammed now, and a reserve water supply for the city.",
    historicalSignificance: "The first lake above the Great Dog Portage on the voyageurs' road west: Jacques de Noyon crossed it in 1688 on his way from Kaministiquia to Rainy Lake, the first Frenchman that far west, and from 1803 to 1821 every North West Company brigade from Fort William climbed the portage to it and paddled north up the Dog River toward the height of land. Silver Falls Provincial Park is on its outlet.",
    latitude: 48.78, longitude: -89.45, regionName: "Ontario", kmlSlug: "dog-lake",
    images: [{ file: "Dog Lake Thunder Bay Ontario", caption: "Dog Lake" }],
    guide: [W("Dog Lake (Ontario)", "Dog_Lake_(Ontario)", "The lake, its name and the voyageur route."), DCB("Noyon, Jacques de", "noyon_jacques_de_3E", "The first Frenchman across the lake, 1688."), HBCA("Fort William", "The Fort William district records cover the Kaministiquia route to Lac la Pluie.")],
    furTrade: { tradingCompany: "North West Company / Hudson's Bay Company", peakTradePeriod: "1803-1821", primaryFurs: "Route only; brigades in transit", tradeRouteNotes: "From Fort William the north canoes went up the Kaministiquia, around Kakabeka Falls and over the Great Dog Portage to Dog Lake, then up the Dog River to the height of land and down the Savanne to Lac des Mille Lacs, the Seine and Rainy Lake." } },
  { key: "dogriver", name: "Dog River", typeName: "River", indigenousName: null, indigenousLanguage: "Anishinaabemowin (Ojibwe)",
    description: "The river that comes down from the northwest into the head of Big Dog Lake, draining the country toward the height of land between the Superior and Hudson Bay watersheds. The voyageurs ascended it from Dog Lake to the portages that led over to the Savanne.",
    historicalSignificance: "The leg of the Kaministiquia route between the Great Dog Portage and the Savanne: de Noyon's way to Rainy Lake in 1688, La Noue's intended road to the Lake of the Woods in 1717, and the North West Company's highway after it left Grand Portage in 1803. The portages at its head carried the canoes over the divide to the Savanne.",
    latitude: 49.0, longitude: -89.85, regionName: "Ontario", kmlSlug: "dog-river",
    images: [{ file: "Dog River Ontario Thunder Bay", caption: "The falls at the Dog River's outlet into Dog Lake, photographed before 1923" }],
    guide: [W("Dog River (Ontario)", "Dog_River_(Ontario)", "The river and the dog effigy."), DCB("Robutel de La Noue, Zacharie", "robutel_de_la_noue_zacharie_2E", "The officer sent to open the route in 1717.")] },
  { key: "millelacs", name: "Lac des Mille Lacs", typeName: "Lake", indigenousName: null, indigenousLanguage: "Anishinaabemowin (Ojibwe)",
    description: "A 30-kilometre lake of many arms and islands on the height of land west of Thunder Bay, the source of the Seine River, which flows to Rainy Lake and so to Lake Winnipeg and Hudson Bay; the Savanne River comes into it from the east. Lac des Mille Lacs First Nation's country.",
    historicalSignificance: "The first Hudson Bay water on the Kaministiquia route: the canoes came down the Savanne into the lake, crossed it and ran the Seine to Lac la Pluie. De Noyon passed in 1688, and the North West Company brigades from 1803 to 1821. Its dam now regulates the Seine for the Rainy River system.",
    latitude: 48.85, longitude: -90.5, regionName: "Ontario", kmlSlug: "lac-des-mille-lacs",
    images: [],
    guide: [W("Lac des Mille Lacs", "Lac_des_Mille_Lacs", "The lake and its drainage."), TCE("Fort William", "fort-william", "The post the route served.")] },
  { key: "savanne", name: "Savanne River", typeName: "River", indigenousName: null, indigenousLanguage: "Anishinaabemowin (Ojibwe)",
    description: "The small river that flows west from the height of land into the northeast corner of Lac des Mille Lacs, the first water on the Hudson Bay side of the Kaministiquia route; the Savanne Portage brought the canoes to it from the Dog River country.",
    historicalSignificance: "The voyageurs' Savanne, 'swamp', where the brigades from Fort William, having climbed from Lake Superior over the Great Dog and Prairie portages, first floated downhill toward the west. The railway and the Trans-Canada Highway now cross the old route near it.",
    latitude: 48.95, longitude: -90.2, regionName: "Ontario", kmlSlug: "savanne-river",
    images: [],
    guide: [W("Lac des Mille Lacs", "Lac_des_Mille_Lacs", "The lake it feeds."), W("Kaministiquia River", "Kaministiquia_River", "The route it belongs to.")] },
  { key: "packriver", name: "Pack River", typeName: "River", indigenousName: null, indigenousLanguage: "Tsek'ene (Sekani)",
    description: "The 30-kilometre river that carries the water of McLeod Lake north into the Parsnip, now the Parsnip Reach of Williston Lake. Tse'khene (Sekani) country, the McLeod Lake Indian Band's.",
    historicalSignificance: "The last leg of the New Caledonia supply route: from the Parsnip the North West Company's canoes turned up the Pack to Fort McLeod on McLeod Lake, the first post west of the Rockies, founded by Simon Fraser in 1805, and from the lake a trail led west to Stuart Lake and Fort St. James. The Bennett Dam flooded its mouth in 1968.",
    latitude: 55.3, longitude: -123.1, regionName: "British Columbia", kmlSlug: "pack-river",
    images: [],
    guide: [W("Pack River (British Columbia)", "Pack_River_(British_Columbia)", "The river and McLeod Lake."), DCB("Fraser, Simon", "fraser_simon_9E", "The founder of Fort McLeod.")] },
  { key: "mcleodlake", name: "McLeod Lake", typeName: "Lake", indigenousName: null, indigenousLanguage: "Tsek'ene (Sekani)",
    description: "The lake on the Pack River north of Prince George where Simon Fraser built Trout Lake Fort in 1805, soon Fort McLeod, the first continuously occupied European settlement west of the Rockies in what is now Canada. The McLeod Lake Indian Band, Tse'khene people, live beside it.",
    historicalSignificance: "Supplied from the Peace up the Parsnip and the Pack, Fort McLeod was the North West Company's door into New Caledonia; Fraser and Stuart went on from it to Stuart Lake and the Fraser in 1806-08, and Archibald Norman McLeod, for whom it was named, had it for many years. The post site is a national historic site, and the band is a signatory of Treaty 8.",
    latitude: 55.0, longitude: -123.0, regionName: "British Columbia", kmlSlug: "mcleod-lake",
    images: [],
    guide: [W("McLeod Lake", "McLeod_Lake", "The community and the fort."), DCB("Fraser, Simon", "fraser_simon_9E", "The post's founder."), HBCA("Fort McLeod", "Post journals of Fort McLeod, New Caledonia district.")],
    furTrade: { tradingCompany: "North West Company / Hudson's Bay Company", peakTradePeriod: "1805-1870", primaryFurs: "Beaver, marten, bear", tradeRouteNotes: "The first New Caledonia post, provisioned by the Peace River route until the brigades shifted to the Fraser and Columbia; salmon from the Tse'khene and dried fish from Stuart Lake fed it." } },
];

// Fur-trade rows for existing waterways that lacked them (the owner's Parsnip, and the route).
export const furTradeForExisting: Array<{ waterway: string; tradingCompany: string; peakTradePeriod: string; primaryFurs: string; tradeRouteNotes: string }> = [
  { waterway: "Parsnip River", tradingCompany: "North West Company / Hudson's Bay Company", peakTradePeriod: "1805-1826", primaryFurs: "Route only; New Caledonia furs in transit", tradeRouteNotes: "Mackenzie's river of 1793 became the North West Company's supply line to New Caledonia: from Fort Chipewyan up the Peace, through the canyon portage at Hudson's Hope, to Finlay Forks and up the Parsnip to the Pack and Fort McLeod. The brigades turned to the Fraser and the Columbia in the 1820s." },
  { waterway: "Kaministiquia River", tradingCompany: "North West Company / Hudson's Bay Company", peakTradePeriod: "1803-1821", primaryFurs: "Depot river; all the furs of the northwest in transit", tradeRouteNotes: "After the Grand Portage fell on the American side, the company moved its depot to Fort William in 1803 and sent its north canoes up the Kaministiquia, around Kakabeka Falls by the Mountain Portage, over the Great Dog Portage and the Dog River to the Savanne, Lac des Mille Lacs and Rainy Lake." },
];

// ────────────────────────────────────────────────────────────────────────────────
export const explorers: PackExplorerWithPortrait[] = [
  { name: "Zacharie Robutel de La Noue", birthYear: 1665, deathYear: 1733, nationality: "French (Canadian-born)",
    biography: "A Montreal-born officer of the colonial regulars who went to Hudson Bay with de Troyes in 1686, nearly drowning twice in the rapids because he could not swim, and was among the first into Fort Monsipi, La Noue led parties against the Mohawk in 1693 and to the north in 1709. In July 1717 Governor Vaudreuil sent him west with three canoes to find the way to the western sea: he was to build the first post on the Kaministiquia, a second at Rainy Lake and a third at the Lake of the Woods. He built and kept Fort Kaministiquia until 1721, and got no farther; La Vérendrye took up the task ten years later. Seigneur of Châteauguay, he died at Green Bay in 1733.",
    notableAchievements: "Re-established Fort Kaministiquia at the mouth of the Kaministiquia (1717-21), the French starting point of the road to the west.",
    guide: [DCB("Robutel de La Noue, Zacharie", "robutel_de_la_noue_zacharie_2E", "Scholarly biography."), W("Zacharie Robutel de La Noue", "Zacharie_Robutel_de_La_Noue", "Life and the post of 1717."), W("Fort Kaministiquia", "Fort_Kaministiquia", "The French posts at the river's mouth.")] },
];

export const links: PackLink[] = [
  { explorer: "Jacques de Noyon", waterway: "Dog Lake", year: 1688, notes: "Crossed Dog Lake from the Kaministiquia on his way to Rainy Lake in 1688, the first Frenchman that far west." },
  { explorer: "Jacques de Noyon", waterway: "Dog River", year: 1688, notes: "Ascended the Dog River toward the height of land in 1688." },
  { explorer: "Jacques de Noyon", waterway: "Lac des Mille Lacs", year: 1688, notes: "Came down to Lac des Mille Lacs and the Seine on the way to his winter at Rainy Lake, 1688-89." },
  { explorer: "Zacharie Robutel de La Noue", waterway: "Kaministiquia River", year: 1717, notes: "Built Fort Kaministiquia at the river's mouth in 1717 and commanded it until 1721." },
  { explorer: "Zacharie Robutel de La Noue", waterway: "Lake Superior", year: 1717, notes: "Sent west along the north shore of Lake Superior in 1717 to open the road to the western sea." },
  { explorer: "Daniel Greysolon Dulhut", waterway: "Lake Superior", year: 1679, notes: "Built the first post at the Kaministiquia's mouth about 1684-85 and Fort Nipigon in 1684, the French footholds on the north shore." },
  { explorer: "Simon Fraser", waterway: "Pack River", year: 1805, notes: "Went up the Pack from the Parsnip in 1805 to build Trout Lake Fort, later Fort McLeod." },
  { explorer: "Simon Fraser", waterway: "McLeod Lake", year: 1805, notes: "Founded the post on McLeod Lake in 1805, the first west of the Rockies, and went on from it to Stuart Lake in 1806." },
  { explorer: "John Stuart", waterway: "McLeod Lake", year: 1805, notes: "With Fraser at the founding of Fort McLeod in 1805 and on to Stuart Lake in 1806." },
  { explorer: "Alexander Mackenzie", waterway: "Peace River", year: 1793, notes: "Ascended the Peace from Fort Fork in May 1793, through the canyon at Hudson's Hope, to Finlay Forks and the Parsnip." },
];

// ────────────────────────────────────────────────────────────────────────────────
export const locations: PackLocation[] = [
  { name: "Kakabeka Falls", locationType: "Portage", yearEstablished: null, latitude: 48.4, longitude: -89.62, waterway: "Kaministiquia River", indigenousName: "Gakaabikaa", indigenousLanguage: "Anishinaabemowin (Ojibwe)",
    description: "The high fall of the Kaministiquia some thirty kilometres above Fort William, 'waterfall over a cliff' in Ojibwe, the Niagara of the North, which the voyageurs carried around by the Mountain Portage on the first day out from the depot. Frances Anne Hopkins painted the Red River Expedition's canoes below it in 1870.",
    historicalNotes: "A provincial park since 1955; the rocks of the gorge hold fossils 1.6 billion years old.",
    images: [{ file: "Kakabeka Falls Kaministiquia", caption: "Kakabeka Falls" }], guide: [W("Kakabeka Falls", "Kakabeka_Falls", "The falls and the park."), OP("Kakabeka Falls Provincial Park", "The falls, the gorge and the portage trail."), W("Kaministiquia River", "Kaministiquia_River", "The river and its history.")] },
];

// Existing posts moved to the water they stand on.
export const relocations: Array<{ location: string; waterway: string; reason: string }> = [
  { location: "Fort Kaministiquia", waterway: "Kaministiquia River", reason: "At the mouth of the Kaministiquia; was on the Lake Superior row." },
  { location: "Fort McLeod (BC)", waterway: "McLeod Lake", reason: "On McLeod Lake, reached by the Pack from the Parsnip; was on the Peace River row." },
];

export const figures: PackFigureWithPortrait[] = [];

// ────────────────────────────────────────────────────────────────────────────────
export const timelineEvents: PackTimelineEvent[] = [
  { year: 1688, title: "De Noyon Crosses Dog Lake to Rainy Lake", description: "Jacques de Noyon leads a trading party from the Kaministiquia over the Great Dog Portage, across Dog Lake and the height of land to Rainy Lake, where he winters with the Assiniboine, the first Frenchman on the route west.", theme: "exploration", importance: "major", explorer: "Jacques de Noyon", waterway: "Dog Lake", location: "Great Dog Portage" },
  { year: 1717, month: 7, title: "La Noue Sent to Open the Road West", description: "Governor Vaudreuil sends Zacharie Robutel de La Noue with three canoes to build posts at the Kaministiquia, Rainy Lake and the Lake of the Woods on the way to the western sea; he builds the first and stays four years.", theme: "fur_trade", importance: "moderate", explorer: "Zacharie Robutel de La Noue", waterway: "Kaministiquia River", location: "Fort Kaministiquia" },
  { year: 1805, title: "Fraser Founds Fort McLeod", description: "Simon Fraser goes up the Parsnip and the Pack and builds Trout Lake Fort on McLeod Lake, the North West Company's first post west of the Rockies.", theme: "fur_trade", importance: "major", explorer: "Simon Fraser", waterway: "McLeod Lake", location: "Fort McLeod (BC)" },
];

export const historicalEvents: PackHistoricalEvent[] = [
  { title: "La Noue Builds Fort Kaministiquia", description: "In the summer of 1717 Zacharie Robutel de La Noue, ordered to find the western sea by an inland route, built a post at the mouth of the Kaministiquia on the site of Dulhut's post of the 1680s; he commanded it until 1721 and never reached the second and third posts he was told to build.", latitude: 48.4, longitude: -89.32, locationName: "Mouth of the Kaministiquia River, Thunder Bay", year: 1717, category: "fur_trade", significance: "normal", explorer: "Zacharie Robutel de La Noue", waterway: "Kaministiquia River", location: "Fort Kaministiquia" },
  { title: "Mackenzie at Finlay Forks", description: "At the end of May 1793, where the Parsnip and the Finlay met to form the Peace, Alexander Mackenzie chose the Parsnip on a Sekani elder's advice against his own judgement, and so found the way over the divide to the Fraser and the Pacific; the forks are under Williston Lake now.", latitude: 56.0, longitude: -124.0, locationName: "Finlay Forks, British Columbia (submerged)", year: 1793, month: 5, category: "exploration", significance: "major", explorer: "Alexander Mackenzie", waterway: "Parsnip River" },
];

export const historicalBackfill: Array<{ title: string; explorer?: string; waterway?: string; location?: string }> = [];
export const timelineBackfill: Array<{ title: string; explorer?: string; waterway?: string; location?: string }> = [];

export const pronunciations: PackPronunciation[] = [
  { term: "Gakaabikaa", termType: "indigenous_place", language: "Anishinaabemowin (Ojibwe)", phonetic: "gah-KAH-bih-kah", meaning: "waterfall over a cliff", notes: "The Ojibwe name that became Kakabeka", location: "Kakabeka Falls" },
  { term: "Kaministiquia", termType: "indigenous_place", language: "Anishinaabemowin (Ojibwe)", phonetic: "kah-min-ih-STIK-wee-ah", meaning: "where a stream flows in islands", notes: "For the islands at the river's three mouths; the Kam to Thunder Bay", waterway: "Kaministiquia River" },
  { term: "Tse'khene", termType: "indigenous_nation", language: "Tsek'ene (Sekani)", phonetic: "tseh-KEH-neh", meaning: "people of the rocks", notes: "The McLeod Lake Indian Band's name for themselves", waterway: "McLeod Lake" },
];

export const quiz = {
  title: "Two Roads: the Kaministiquia and the Parsnip", description: "The voyageurs' road west from Lake Superior over the Great Dog Portage, and the fur traders' road over the Rockies by the Parsnip and the Pack.",
  category: "Fur Trade", gradeLevel: "7-9", difficulty: "easy" as const,
  questions: [
    { questionText: "Why did the North West Company move its depot from Grand Portage to the Kaministiquia in 1803?", options: ["The Pigeon River dried up", "Grand Portage was on the American side of the new border", "The Ojibwe closed the Pigeon River", "Fort William had a better harbour"], correct: 1, explanation: "The 1783 treaty put Grand Portage in the United States, and American customs officers were coming. The company rediscovered the old French route up the Kaministiquia and built Fort William in 1803.", source: { type: "waterway", name: "Kaministiquia River" } },
    { questionText: "Who was the first Frenchman to travel from the Kaministiquia over Dog Lake to Rainy Lake?", options: ["La Vérendrye in 1731", "Jacques de Noyon in 1688", "La Noue in 1717", "Dulhut in 1679"], correct: 1, explanation: "De Noyon's trading party went over the Great Dog Portage and across Dog Lake in 1688 and wintered at Rainy Lake with the Assiniboine, forty years before La Vérendrye.", source: { type: "waterway", name: "Dog Lake" } },
    { questionText: "Which river did Alexander Mackenzie choose at Finlay Forks in 1793?", options: ["The Finlay", "The Parsnip, on a Sekani elder's advice", "The Peace, downstream", "The Pack"], correct: 1, explanation: "The elder told him the Parsnip led to a short portage and a river flowing to the sea. It did: over the divide to the Fraser system and the Pacific.", source: { type: "waterway", name: "Parsnip River" } },
    { questionText: "What was Fort McLeod on McLeod Lake, founded in 1805?", options: ["A Hudson's Bay Company post on Hudson Bay", "The first fur post west of the Rockies, supplied up the Parsnip and the Pack", "A police post of the gold rush", "A French mission"], correct: 1, explanation: "Simon Fraser built it as the North West Company's first post in New Caledonia; its supplies came from the Peace up the Parsnip and the Pack River.", source: { type: "waterway", name: "McLeod Lake" } },
  ],
};

export const lesson = undefined;
export const fieldTrip = undefined;
