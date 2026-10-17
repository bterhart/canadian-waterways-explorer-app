// Content pack 1 — New France to the Gulf (authored 2026-10-17).
//
// Scope: the French water road from the St. Lawrence through the Great Lakes to the
// Mississippi and the Gulf of Mexico, the Richelieu–Champlain–Hudson corridor that tied
// New France to the Dutch and English trade, and the people the app already held with
// nowhere to point (Jolliet, Marquette, La Salle, Cadillac, Iberville, Nicolet, Brûlé).
//
// Every record below is plain data; the apply script resolves names to ids, attaches
// images from the Commons manifest (licence and author recorded), reads KML from
// generated/kml-exports and writes everything in one transaction with a backup.
//
// Rules followed: no portrait where no verified likeness exists (none of the new people
// gets one); Indigenous names only where the attestation is well known, with the language
// named; associatedLocations use exact Waterway / Location names so the text match works.

export interface PackImage { file: string; caption: string }
export interface PackGuide { title: string; authorSource: string; publisher?: string; year?: string; url?: string; description: string; gradeLevel: string }

export interface PackWaterway {
  key: string; name: string; typeName: "River" | "Lake" | "Bay" | "Strait" | "Sound" | "Inlet";
  indigenousName: string | null; indigenousLanguage: string | null;
  description: string; historicalSignificance: string;
  latitude: number; longitude: number; regionName: string;
  kmlSlug: string | null; images: PackImage[]; guide: PackGuide[];
  furTrade?: { tradingCompany: string; peakTradePeriod: string; primaryFurs: string; tradeRouteNotes: string };
}
export interface PackExplorer {
  name: string; birthYear: number | null; deathYear: number | null; nationality: string;
  biography: string; notableAchievements: string; guide: PackGuide[];
}
export interface PackLink { explorer: string; waterway: string; year: number; notes: string }
export interface PackLocation {
  name: string; locationType: "Fort" | "Trading Post" | "Portage" | "Settlement" | "Cultural Site";
  yearEstablished: number | null; latitude: number; longitude: number; waterway: string;
  indigenousName: string | null; indigenousLanguage: string | null;
  description: string; historicalNotes: string; images: PackImage[]; guide: PackGuide[];
}
export interface PackFigure {
  id: string; name: string; alternateNames: string | null; birthYear: number | null; deathYear: number | null;
  nation: string; birthPlace: string | null; figureType: string; role: string; biography: string; significance: string;
  associatedExplorers: { name: string; relationship: string }[]; achievements: string[]; associatedLocations: string[];
  activePeriodStart: number | null; activePeriodEnd: number | null; isFeatured: boolean; guide: PackGuide[];
}
export interface PackTimelineEvent {
  year: number; month?: number; day?: number; endYear?: number; isApproximate?: boolean; title: string; description: string;
  theme: "exploration" | "fur_trade" | "indigenous" | "settlement"; importance: "major" | "moderate" | "minor";
  explorer?: string; waterway?: string; location?: string;
}
export interface PackHistoricalEvent {
  title: string; description: string; latitude: number; longitude: number; locationName: string; year: number;
  month?: number; day?: number; isApproximate?: boolean; category: "exploration" | "fur_trade" | "indigenous" | "settlement" | "battle" | "treaty" | "maritime";
  significance: "major" | "normal"; explorer?: string; waterway?: string; location?: string; image?: PackImage;
}
export interface PackPronunciation { term: string; termType: string; language: string; phonetic: string; meaning: string | null; notes: string | null; explorer?: string; waterway?: string; location?: string }

const wiki = (slug: string) => `https://en.wikipedia.org/wiki/${slug}`;
const dcb = (slug: string) => `https://www.biographi.ca/en/bio/${slug}.html`;
const tce = (slug: string) => `https://www.thecanadianencyclopedia.ca/en/article/${slug}`;
const W = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "Wikipedia", url: wiki(slug), description, gradeLevel: "7-9" });
const DCB = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "Dictionary of Canadian Biography", url: dcb(slug), description, gradeLevel: "10-12" });
const TCE = (title: string, slug: string, description: string): PackGuide => ({ title, authorSource: "The Canadian Encyclopedia", url: tce(slug), description, gradeLevel: "7-9" });

// ────────────────────────────────────────────────────────────────────────────────
export const waterways: PackWaterway[] = [
  {
    key: "mississippi", name: "Mississippi River", typeName: "River", indigenousName: "Misi-ziibi", indigenousLanguage: "Ojibwe",
    description: "The great river of the continent's interior, flowing 3,700 kilometres from Lake Itasca in Minnesota to the Gulf of Mexico. Its Ojibwe name, Misi-ziibi, means 'great river'.",
    historicalSignificance: "For the French of Canada the Mississippi was the road south. Louis Jolliet and Jacques Marquette reached it from the Wisconsin River in June 1673 and paddled down to the Arkansas; René-Robert Cavelier de La Salle followed it to the Gulf in 1682 and claimed the whole basin as Louisiana; Pierre Le Moyne d'Iberville found its mouth from the sea in 1699 and founded the colony. For sixty years a chain of French posts and villages, from Michilimackinac to Kaskaskia, Fort de Chartres and New Orleans, joined New France to the Gulf, until the Treaty of Paris of 1763 gave the east bank to Britain and the west to Spain.",
    latitude: 38.63, longitude: -90.2, regionName: "Minnesota to Louisiana (United States)", kmlSlug: "mississippi-river",
    images: [{ file: "Mississippi River", caption: "The Mississippi" }],
    guide: [W("Mississippi River", "Mississippi_River", "Geography and history of the river from Itasca to the Gulf."), TCE("Mississippi River", "mississippi-river", "The river's place in the history of New France."), { title: "The Jesuit Relations and Allied Documents, vol. 59", authorSource: "Thwaites Reuben Gold ed.", publisher: "Burrows Brothers", year: "1900", description: "Marquette's own account of the 1673 voyage down the Mississippi, in English translation.", gradeLevel: "10-12" }, { title: "La Salle and the Discovery of the Great West", authorSource: "Parkman Francis", publisher: "Little, Brown", year: "1869", description: "The classic narrative of La Salle's Illinois and Mississippi expeditions.", gradeLevel: "10-12" }],
    furTrade: { tradingCompany: "French Crown / French trading companies", peakTradePeriod: "1673-1763", primaryFurs: "Beaver, deerskin, bear, raccoon", tradeRouteNotes: "Canoes from Montreal reached the Mississippi by the Ottawa–Nipissing route to Michilimackinac, then by the Fox–Wisconsin portage or the Chicago and Illinois rivers; furs went north to Montreal or south to New Orleans." },
  },
  {
    key: "illinois", name: "Illinois River", typeName: "River", indigenousName: null, indigenousLanguage: null,
    description: "A broad, slow tributary of the Mississippi flowing south-west across Illinois from the junction of the Des Plaines and Kankakee rivers. The Chicago portage at its head joined it to Lake Michigan.",
    historicalSignificance: "Jolliet and Marquette came home this way in 1673 and reported a short portage to Lake Michigan, the easiest link between the lakes and the Mississippi. La Salle built Fort Crèvecoeur near present Peoria in 1680 and, with Henri de Tonti, Fort Saint-Louis on the rock above the great village of the Illinois in 1682. The river valley became the heart of the French 'Illinois Country'.",
    latitude: 40.9, longitude: -89.5, regionName: "Illinois (United States)", kmlSlug: "illinois-river",
    images: [{ file: "Illinois River", caption: "The Illinois River" }],
    guide: [W("Illinois River", "Illinois_River", "The river, the Chicago portage and the Illinois Country."), { title: "La Salle and the Discovery of the Great West", authorSource: "Parkman Francis", publisher: "Little, Brown", year: "1869", description: "Fort Crèvecoeur, Fort Saint-Louis and the Illinois in La Salle's plans.", gradeLevel: "10-12" }],
  },
  {
    key: "wisconsin", name: "Wisconsin River", typeName: "River", indigenousName: "Meskousing", indigenousLanguage: "Miami-Illinois (as written by Marquette)",
    description: "Wisconsin's longest river, rising near the Michigan border and flowing south then west to the Mississippi at Prairie du Chien. A short portage from the Fox River joins it to Green Bay and Lake Michigan.",
    historicalSignificance: "Marquette wrote the river's name as 'Meskousing' when he and Jolliet carried their canoes across the Fox–Wisconsin portage in June 1673 and floated down to the Mississippi. The portage route they used remained a main road between the Great Lakes and the Mississippi for the French and the fur traders who followed them.",
    latitude: 43.3, longitude: -90.0, regionName: "Wisconsin (United States)", kmlSlug: "wisconsin-river",
    images: [{ file: "Wisconsin River", caption: "The lower Wisconsin River" }],
    guide: [W("Wisconsin River", "Wisconsin_River", "Course of the river and the Fox–Wisconsin waterway.")],
  },
  {
    key: "fox", name: "Fox River (Wisconsin)", typeName: "River", indigenousName: null, indigenousLanguage: null,
    description: "Flows from central Wisconsin north-east through Lake Winnebago to Green Bay on Lake Michigan. Its upper course comes within two kilometres of the Wisconsin River at the Portage.",
    historicalSignificance: "Jean Nicolet landed at Green Bay in 1634 and ascended the Fox among the Ho-Chunk and Menominee. Jolliet and Marquette followed the river to the portage in 1673, and the French post of La Baye stood at its mouth from 1717. The Fox–Wisconsin route was the western door of the Great Lakes for a century.",
    latitude: 44.2, longitude: -88.4, regionName: "Wisconsin (United States)", kmlSlug: "fox-river",
    images: [{ file: "Fox River Wisconsin", caption: "The Fox River" }],
    guide: [W("Fox River (Green Bay tributary)", "Fox_River_(Green_Bay_tributary)", "The river from the Portage to Green Bay.")],
  },
  {
    key: "richelieu", name: "Richelieu River", typeName: "River", indigenousName: null, indigenousLanguage: null,
    description: "Flows north from Lake Champlain to the St. Lawrence at Sorel. The only easy water road between the St. Lawrence valley and the Hudson, it was fortified at Chambly and Saint-Jean.",
    historicalSignificance: "Champlain went up the Richelieu with his Innu, Algonquin and Wendat allies in July 1609 to fight the Mohawk, the first European on the river. It became the 'river of the Iroquois', the war road between New France and the Haudenosaunee and later between the French and the English colonies, guarded by Fort Chambly from 1665.",
    latitude: 45.5, longitude: -73.25, regionName: "Quebec", kmlSlug: "richelieu-river",
    images: [{ file: "Richelieu River", caption: "The Richelieu River" }],
    guide: [W("Richelieu River", "Richelieu_River", "Course and history of the river."), TCE("Richelieu River", "richelieu-river", "The river as a corridor of war and trade.")],
  },
  {
    key: "champlain", name: "Lake Champlain", typeName: "Lake", indigenousName: "Bitawbagok", indigenousLanguage: "Abenaki",
    description: "A long lake between the Adirondacks and the Green Mountains, draining north by the Richelieu to the St. Lawrence. Its Abenaki name, Bitawbagok, means 'the lake between'.",
    historicalSignificance: "Champlain reached the lake in July 1609 and named it for himself after a fight with the Mohawk near Ticonderoga, the first use of firearms against the Haudenosaunee and the start of a long enmity. The lake was the military highway between Montreal and Albany: the French built Fort Saint-Frédéric at Crown Point in 1731 and Fort Carillon in 1755, both lost in 1759.",
    latitude: 44.5, longitude: -73.3, regionName: "Quebec / New York / Vermont", kmlSlug: "lake-champlain",
    images: [{ file: "Lake Champlain", caption: "Lake Champlain" }],
    guide: [W("Lake Champlain", "Lake_Champlain", "Geography and the lake's military history."), TCE("Lake Champlain", "lake-champlain", "The lake in the history of New France.")],
  },
  {
    key: "hudson", name: "Hudson River", typeName: "River", indigenousName: "Muhheakantuck", indigenousLanguage: "Mahican / Lenape",
    description: "Flows 500 kilometres from the Adirondacks to New York harbour. Tidal as far as Albany, which is why its Mahican name is usually translated 'the river that flows both ways'.",
    historicalSignificance: "Henry Hudson, sailing for the Dutch East India Company, took the Half Moon up the river in September 1609 as far as present Albany. The Dutch built Fort Orange there in 1624 and New Amsterdam at the mouth in 1625, and the beaver trade they opened with the Mohawk drew furs away from the St. Lawrence. After the English took the colony in 1664 Albany remained the southern rival of Montreal for the trade of the interior.",
    latitude: 42.0, longitude: -73.93, regionName: "New York (United States)", kmlSlug: "hudson-river",
    images: [{ file: "Hudson River", caption: "The Hudson River" }],
    guide: [W("Hudson River", "Hudson_River", "Course of the river and its exploration."), W("New Netherland", "New_Netherland", "The Dutch colony and its fur trade with the Haudenosaunee.")],
    furTrade: { tradingCompany: "Dutch West India Company / English colonial traders", peakTradePeriod: "1624-1760", primaryFurs: "Beaver, otter", tradeRouteNotes: "Furs from the Mohawk and the western nations came down the Mohawk River to Fort Orange and Albany, in direct rivalry with Montreal." },
  },
  {
    key: "nipissing", name: "Lake Nipissing", typeName: "Lake", indigenousName: "Nbisiing", indigenousLanguage: "Anishinaabemowin (Nipissing)",
    description: "A shallow lake between the Ottawa River and Georgian Bay, home of the Nipissing people. The French River carries its waters to Lake Huron.",
    historicalSignificance: "Champlain crossed the lake in 1615 on his way to the Wendat country, and for two centuries afterwards every canoe from Montreal to the upper lakes followed the same road: up the Ottawa and the Mattawa, over the height of land to Lake Nipissing, and down the French River. The Nipissing people were traders and intermediaries on it long before the French came.",
    latitude: 46.28, longitude: -79.8, regionName: "Ontario", kmlSlug: "lake-nipissing",
    images: [{ file: "Lake Nipissing", caption: "Lake Nipissing" }],
    guide: [W("Lake Nipissing", "Lake_Nipissing", "Geography and the Nipissing people."), TCE("Lake Nipissing", "lake-nipissing", "The lake on the Montreal to Lake Huron canoe route.")],
  },
  {
    key: "mattawa", name: "Mattawa River", typeName: "River", indigenousName: "Mattawa", indigenousLanguage: "Algonquin",
    description: "A 76-kilometre river joining Trout Lake, near Lake Nipissing, to the Ottawa River at Mattawa. Its Algonquin name means 'meeting of waters'.",
    historicalSignificance: "The Mattawa was the link that made the Ottawa a road to the west. Champlain and Brûlé used it in 1615 and the voyageurs for two hundred years after, crossing its rapids by a dozen portages and the La Vase portages into Lake Nipissing. It is now a Canadian Heritage River.",
    latitude: 46.32, longitude: -78.9, regionName: "Ontario", kmlSlug: "mattawa-river",
    images: [{ file: "Mattawa River", caption: "The Mattawa River" }],
    guide: [W("Mattawa River", "Mattawa_River", "The river and its portages."), TCE("Mattawa River", "mattawa-river", "A Canadian Heritage River on the voyageur route.")],
  },
  {
    key: "detroit", name: "Detroit River", typeName: "River", indigenousName: null, indigenousLanguage: null,
    description: "The 45-kilometre strait between Lake St. Clair and Lake Erie, now the Canada–United States border. 'Le détroit' is simply the French for strait.",
    historicalSignificance: "Antoine Laumet de La Mothe Cadillac founded Fort Pontchartrain du Détroit on the north bank in 1701 to hold the passage between the lower and upper lakes and to gather the western nations around a French post. Wyandot, Odawa, Potawatomi and Ojibwe villages grew up beside it, and Detroit remained the key to the upper lakes under France, Britain and the United States.",
    latitude: 42.2, longitude: -83.1, regionName: "Ontario / Michigan", kmlSlug: "detroit-river",
    images: [{ file: "Detroit River", caption: "The Detroit River" }],
    guide: [W("Detroit River", "Detroit_River", "The strait and its history."), TCE("Detroit River", "detroit-river", "The river in Canadian history.")],
  },
  {
    key: "niagara", name: "Niagara River", typeName: "River", indigenousName: "Onguiaahra", indigenousLanguage: "Iroquoian (as recorded by the French)",
    description: "The 58-kilometre river carrying the waters of Lake Erie over Niagara Falls to Lake Ontario. The Falls and the gorge forced every traveller onto a portage along the east bank.",
    historicalSignificance: "Father Louis Hennepin published the first description of the Falls in 1683 after visiting them with La Salle's party in December 1678. La Salle built the Griffon, the first sailing ship on the upper lakes, above the Falls in 1679 and a first post, Fort Conti, at the mouth. Fort Niagara, begun in 1726, controlled the portage and with it the fur trade of the whole upper country.",
    latitude: 43.1, longitude: -79.05, regionName: "Ontario / New York", kmlSlug: "niagara-river",
    images: [{ file: "Niagara River", caption: "The Niagara River" }],
    guide: [W("Niagara River", "Niagara_River", "The river, the Falls and the portage."), TCE("Niagara River", "niagara-river", "The river in Canadian history.")],
  },
];

// ────────────────────────────────────────────────────────────────────────────────
export const explorers: PackExplorer[] = [
  {
    name: "Louis Hennepin", birthYear: 1626, deathYear: 1705, nationality: "French",
    biography: "Louis Hennepin was a Récollet friar, born at Ath in the Spanish Netherlands, who came to New France in 1675 and joined La Salle's western expedition in 1678. He saw Niagara Falls that December and wrote the first published description of them. In 1680 La Salle sent him from Fort Crèvecoeur to explore the upper Mississippi; he was taken by a Dakota party, carried north past the falls he named for St. Anthony (at present Minneapolis), and released after Daniel Greysolon Dulhut intervened. Back in Europe he published Description de la Louisiane (1683), a best-seller that made the Mississippi known to Europe, and later books in which he falsely claimed to have descended the river to its mouth before La Salle.",
    notableAchievements: "First published description of Niagara Falls (1683). Explored and described the upper Mississippi and named the Falls of St. Anthony (1680). His books spread knowledge of the Mississippi across Europe, though his later claims were invented.",
    guide: [DCB("Hennepin, Louis", "hennepin_louis_2E", "Scholarly biography with the evidence for and against his claims."), W("Louis Hennepin", "Louis_Hennepin", "Life, writings and controversies.")],
  },
  {
    name: "Daniel Greysolon Dulhut", birthYear: 1639, deathYear: 1710, nationality: "French",
    biography: "Daniel Greysolon, Sieur Dulhut, was a soldier from Saint-Germain-Laval who came to New France about 1674 and became the leading French figure on Lake Superior. In 1679 he held a council of Ojibwe, Dakota and Assiniboine at the head of the lake, where the city of Duluth now bears his name, to make peace among them and open the western trade to Montreal. In 1680 he rescued Louis Hennepin from the Dakota. He built posts at Kaministiquia and Lake Nipigon, held the western nations to the French alliance during the Iroquois wars, and commanded at Fort Frontenac and Detroit before retiring to Montreal.",
    notableAchievements: "Brought the Dakota and Ojibwe into the French alliance at the head of Lake Superior (1679). Rescued Hennepin (1680). Built Fort Kaministiquia (1683) and the Nipigon post. Namesake of Duluth, Minnesota.",
    guide: [DCB("Greysolon Dulhut, Daniel", "greysolon_dulhut_daniel_2E", "Scholarly biography."), W("Daniel Greysolon, Sieur du Lhut", "Daniel_Greysolon,_Sieur_du_Lhut", "Life and western career.")],
  },
  {
    name: "Pierre de Troyes", birthYear: null, deathYear: 1688, nationality: "French",
    biography: "Pierre de Troyes, Chevalier de Troyes, was an officer of the Troupes de la Marine who arrived at Quebec in 1685. In March 1686 he led about a hundred men, Canadians and Indigenous guides among them, from Montreal up the Ottawa River, across Lake Timiskaming and down the Abitibi and Moose rivers to James Bay, an eighty-two-day overland journey in the thaw. In June and July he captured the Hudson's Bay Company posts of Moose Factory, Rupert House and Fort Albany, with Pierre Le Moyne d'Iberville among his lieutenants. He died at Fort Niagara in 1688, probably of scurvy.",
    notableAchievements: "Led the 1686 overland expedition from Montreal to James Bay. Captured Moose Factory, Rupert House and Fort Albany from the Hudson's Bay Company. His journal is the first detailed account of the Ottawa–Abitibi–Moose route.",
    guide: [DCB("Troyes, Pierre de", "troyes_pierre_de_1E", "Scholarly biography and the 1686 expedition."), W("Pierre de Troyes", "Pierre_de_Troyes", "The Hudson Bay expedition of 1686.")],
  },
  {
    name: "Henri de Tonti", birthYear: 1649, deathYear: 1704, nationality: "Italian",
    biography: "Henri de Tonti, born near Gaeta and raised in France, lost a hand to a grenade in the Sicilian wars and wore an iron one afterwards; the Indigenous nations of the Illinois called him 'Iron Hand'. He came to New France with La Salle in 1678, oversaw the building of the Griffon on the Niagara, held Fort Crèvecoeur and then Fort Saint-Louis on Starved Rock, and was with La Salle at the mouth of the Mississippi in 1682. He kept the Illinois Country for France for twenty years, founded Arkansas Post in 1686 while searching for La Salle, and died of yellow fever at Mobile in 1704.",
    notableAchievements: "La Salle's lieutenant on the Illinois and the Mississippi (1679-1682). Commanded Fort Saint-Louis of the Illinois for two decades. Founded Arkansas Post (1686), the first European settlement in the lower Mississippi valley.",
    guide: [DCB("Tonty, Henri de", "tonty_henri_de_2E", "Scholarly biography."), W("Henri de Tonti", "Henri_de_Tonti", "Life in the Illinois Country and Louisiana.")],
  },
];

// Links for explorers that already exist in the table, and for the new ones above.
export const links: PackLink[] = [
  { explorer: "Louis Jolliet", waterway: "Mississippi River", year: 1673, notes: "With Marquette, entered the Mississippi from the Wisconsin on 17 June 1673 and descended it to the mouth of the Arkansas before turning back." },
  { explorer: "Louis Jolliet", waterway: "Wisconsin River", year: 1673, notes: "Crossed the Fox–Wisconsin portage and followed the river to the Mississippi." },
  { explorer: "Louis Jolliet", waterway: "Illinois River", year: 1673, notes: "Returned by the Illinois and the Chicago portage; reported the short carry to Lake Michigan." },
  { explorer: "Louis Jolliet", waterway: "Fox River (Wisconsin)", year: 1673, notes: "Ascended the Fox from Green Bay to the portage with Miami and Mascouten guides." },
  { explorer: "Jacques Marquette", waterway: "Mississippi River", year: 1673, notes: "Kept the journal of the voyage; his map and account are the primary record of the expedition." },
  { explorer: "Jacques Marquette", waterway: "Wisconsin River", year: 1673, notes: "Recorded the river's name as 'Meskousing'." },
  { explorer: "Jacques Marquette", waterway: "Illinois River", year: 1673, notes: "Returned through the Illinois country and promised the Kaskaskia a mission; he returned to found it in 1675 and died on the way home." },
  { explorer: "Jacques Marquette", waterway: "Fox River (Wisconsin)", year: 1673, notes: "Left the mission of St. Francis Xavier at De Pere on the lower Fox in May 1673." },
  { explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Lake Ontario", year: 1673, notes: "Commanded Fort Frontenac at the foot of the lake from 1675 and used it as the base for his western ventures." },
  { explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Niagara River", year: 1679, notes: "Built the Griffon, the first sailing vessel on the upper lakes, above the Falls in 1679." },
  { explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Illinois River", year: 1680, notes: "Built Fort Crèvecoeur near Peoria in 1680 and Fort Saint-Louis on Starved Rock in 1682." },
  { explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Mississippi River", year: 1682, notes: "Descended the river to the Gulf of Mexico and on 9 April 1682 claimed the whole basin for France as Louisiana." },
  { explorer: "Antoine Laumet de La Mothe Cadillac", waterway: "Lake Huron", year: 1694, notes: "Commanded the post of Michilimackinac at the straits from 1694 to 1697." },
  { explorer: "Antoine Laumet de La Mothe Cadillac", waterway: "Detroit River", year: 1701, notes: "Founded Fort Pontchartrain du Détroit on 24 July 1701." },
  { explorer: "Samuel de Champlain", waterway: "Richelieu River", year: 1609, notes: "Ascended the river with Innu, Algonquin and Wendat allies in July 1609." },
  { explorer: "Samuel de Champlain", waterway: "Lake Champlain", year: 1609, notes: "First European on the lake; fought the Mohawk near Ticonderoga on 30 July 1609 and named the lake for himself." },
  { explorer: "Samuel de Champlain", waterway: "Mattawa River", year: 1615, notes: "Followed the Mattawa and its portages on the way to the Wendat country." },
  { explorer: "Samuel de Champlain", waterway: "Lake Nipissing", year: 1615, notes: "Crossed the lake in July 1615 and was received by the Nipissing before descending the French River." },
  { explorer: "Henry Hudson", waterway: "Hudson River", year: 1609, notes: "Sailed the Half Moon up the river to the head of navigation near present Albany in September 1609, for the Dutch East India Company." },
  { explorer: "Jean Nicolet", waterway: "Fox River (Wisconsin)", year: 1634, notes: "Landed at Green Bay in 1634 and went up the Fox among the Ho-Chunk and Menominee, seeking a passage to China." },
  { explorer: "Etienne Brule", waterway: "Lake Huron", year: 1610, notes: "Sent by Champlain to live with the Wendat in 1610; the first European to winter in the Huron country on Georgian Bay." },
  { explorer: "Etienne Brule", waterway: "Lake Superior", year: 1618, notes: "Reached Lake Superior about 1618, probably the first European to see it." },
  { explorer: "Pierre Le Moyne d'Iberville", waterway: "James Bay", year: 1686, notes: "Served under de Troyes in the capture of the James Bay posts; returned to take them again in 1689 and 1694." },
  { explorer: "Pierre Le Moyne d'Iberville", waterway: "Hudson Bay", year: 1697, notes: "Won the Battle of Hudson Bay in the Pélican on 5 September 1697 and took York Factory." },
  { explorer: "Pierre Le Moyne d'Iberville", waterway: "Mississippi River", year: 1699, notes: "Found the mouth of the river from the sea on 2 March 1699 and founded the colony of Louisiana." },
  { explorer: "Louis Hennepin", waterway: "Niagara River", year: 1678, notes: "Saw the Falls in December 1678 and published the first description of them in 1683." },
  { explorer: "Louis Hennepin", waterway: "Mississippi River", year: 1680, notes: "Explored the upper river from the Illinois; taken by the Dakota and carried to the Falls of St. Anthony." },
  { explorer: "Daniel Greysolon Dulhut", waterway: "Lake Superior", year: 1679, notes: "Held a peace council of Ojibwe, Dakota and Assiniboine at the head of the lake in 1679." },
  { explorer: "Daniel Greysolon Dulhut", waterway: "Mississippi River", year: 1680, notes: "Reached the upper river from Lake Superior and secured Hennepin's release from the Dakota." },
  { explorer: "Daniel Greysolon Dulhut", waterway: "Kaministiquia River", year: 1683, notes: "Built the first French post at the mouth of the Kaministiquia." },
  { explorer: "Pierre de Troyes", waterway: "Ottawa River", year: 1686, notes: "Led the James Bay expedition up the Ottawa from Montreal in March 1686." },
  { explorer: "Pierre de Troyes", waterway: "Abitibi River", year: 1686, notes: "Descended the Abitibi from Lake Abitibi toward the Moose on the way to James Bay." },
  { explorer: "Pierre de Troyes", waterway: "Moose River", year: 1686, notes: "Reached James Bay by the Moose and captured Moose Factory on 21 June 1686." },
  { explorer: "Pierre de Troyes", waterway: "James Bay", year: 1686, notes: "Captured Moose Factory, Rupert House and Fort Albany for France in the summer of 1686." },
  { explorer: "Henri de Tonti", waterway: "Niagara River", year: 1679, notes: "Oversaw the building of La Salle's Griffon above the Falls." },
  { explorer: "Henri de Tonti", waterway: "Illinois River", year: 1680, notes: "Held Fort Crèvecoeur and then Fort Saint-Louis on Starved Rock for La Salle; commanded there for twenty years." },
  { explorer: "Henri de Tonti", waterway: "Mississippi River", year: 1682, notes: "With La Salle at the mouth of the river in 1682; founded Arkansas Post in 1686." },
];

// ────────────────────────────────────────────────────────────────────────────────
export const locations: PackLocation[] = [
  { name: "Fort Frontenac", locationType: "Fort", yearEstablished: 1673, latitude: 44.231, longitude: -76.481, waterway: "Lake Ontario", indigenousName: "Cataraqui", indigenousLanguage: "Iroquoian",
    description: "Governor Frontenac's fort at the mouth of the Cataraqui River, where Kingston now stands, built in 1673 to hold the foot of Lake Ontario and the trade of the Iroquois country.",
    historicalNotes: "La Salle received the fort as a seigneury in 1675 and rebuilt it in stone; it was his base for the Griffon and the western expeditions. Abandoned in 1689 and reoccupied in 1695, it fell to the British in 1758 during the Seven Years' War.",
    images: [{ file: "Fort Frontenac", caption: "Fort Frontenac, Kingston" }], guide: [W("Fort Frontenac", "Fort_Frontenac", "History of the fort."), TCE("Fort Frontenac", "fort-frontenac", "The fort and its role in New France.")] },
  { name: "Fort Niagara", locationType: "Fort", yearEstablished: 1726, latitude: 43.263, longitude: -79.064, waterway: "Niagara River", indigenousName: null, indigenousLanguage: null,
    description: "The French stone 'castle' at the mouth of the Niagara River, built in 1726 to control the portage around the Falls and the fur trade of the upper lakes.",
    historicalNotes: "La Salle's Fort Conti of 1679 and Denonville's fort of 1687 stood here first. The stone fort of 1726 was taken by the British in 1759, held by them through the American Revolution, and handed to the United States in 1796.",
    images: [{ file: "Fort Niagara", caption: "Old Fort Niagara" }], guide: [W("Fort Niagara", "Fort_Niagara", "The fort from Fort Conti to the present.")] },
  { name: "Fort Crèvecoeur", locationType: "Fort", yearEstablished: 1680, latitude: 40.65, longitude: -89.59, waterway: "Illinois River", indigenousName: null, indigenousLanguage: null,
    description: "La Salle's first post on the Illinois, built in January 1680 below Lake Peoria as a base for a vessel to descend the Mississippi.",
    historicalNotes: "While La Salle went back to Fort Frontenac for supplies, the garrison mutinied, plundered the fort and deserted in April 1680. Tonti, who had been left in charge, withdrew to the Illinois village and the fort was never rebuilt.",
    images: [], guide: [W("Fort Crèvecoeur", "Fort_Cr%C3%A8vecoeur", "The short life of La Salle's fort.")] },
  { name: "Fort Saint-Louis (Starved Rock)", locationType: "Fort", yearEstablished: 1682, latitude: 41.32, longitude: -88.99, waterway: "Illinois River", indigenousName: null, indigenousLanguage: null,
    description: "La Salle and Tonti's fort on the sandstone bluff above the Illinois River, built in the winter of 1682-83 opposite the great village of the Kaskaskia.",
    historicalNotes: "Tonti gathered thousands of Illinois, Miami and Shawnee around the fort as a bulwark against the Iroquois. The post moved downriver to Lake Peoria in 1691. The rock is now Starved Rock State Park.",
    images: [{ file: "Starved Rock", caption: "Starved Rock on the Illinois River" }], guide: [W("Starved Rock State Park", "Starved_Rock_State_Park", "The rock, the fort and the park.")] },
  { name: "Michilimackinac", locationType: "Fort", yearEstablished: 1715, latitude: 45.787, longitude: -84.736, waterway: "Lake Huron", indigenousName: "Michilimackinac", indigenousLanguage: "Anishinaabemowin (Odawa / Ojibwe)",
    description: "The French fort and trading town at the Straits of Mackinac, where Lakes Michigan and Huron meet, the hub of the upper-lakes fur trade for most of the eighteenth century.",
    historicalNotes: "The Jesuit mission of St. Ignace stood across the strait from 1671, and Marquette was buried there. Fort Michilimackinac on the south shore was built about 1715; the British took it over in 1761, lost it in Pontiac's War in June 1763 when Ojibwe players turned a lacrosse game into an attack, and moved the fort to Mackinac Island in 1781. The site is reconstructed as Colonial Michilimackinac.",
    images: [{ file: "Colonial Michilimackinac", caption: "The reconstructed fort at Colonial Michilimackinac" }], guide: [W("Fort Michilimackinac", "Fort_Michilimackinac", "The fort and the 1763 attack."), TCE("Michilimackinac", "michilimackinac", "The straits in the fur trade.")] },
  { name: "Fort Orange", locationType: "Trading Post", yearEstablished: 1624, latitude: 42.641, longitude: -73.75, waterway: "Hudson River", indigenousName: null, indigenousLanguage: null,
    description: "The Dutch West India Company's fur-trading post at the head of navigation on the Hudson, built in 1624 where Albany now stands.",
    historicalNotes: "Fort Orange was the Mohawk's door to European goods and guns, and the reason the Haudenosaunee fought the French and their allies for the beaver country of the north. The English renamed the town Albany in 1664; the trade it carried on with Montreal, legal and illegal, lasted into the eighteenth century.",
    images: [{ file: "Fort Orange Albany", caption: "Fort Orange" }], guide: [W("Fort Orange (New Netherland)", "Fort_Orange_(New_Netherland)", "The Dutch post and the fur trade.")] },
  { name: "New Amsterdam", locationType: "Settlement", yearEstablished: 1625, latitude: 40.705, longitude: -74.012, waterway: "Hudson River", indigenousName: "Mannahatta", indigenousLanguage: "Lenape",
    description: "The Dutch town at the tip of Manhattan Island, founded in 1625 as the port and capital of New Netherland.",
    historicalNotes: "Furs from Fort Orange were shipped to Europe from here. The English took the town in 1664 and renamed it New York. Hudson's log of 1609 recorded the Lenape name of the island as Mannahatta.",
    images: [{ file: "New Amsterdam", caption: "New Amsterdam" }], guide: [W("New Amsterdam", "New_Amsterdam", "The Dutch settlement that became New York.")] },
  { name: "Fort Pontchartrain du Détroit", locationType: "Fort", yearEstablished: 1701, latitude: 42.329, longitude: -83.044, waterway: "Detroit River", indigenousName: null, indigenousLanguage: null,
    description: "Cadillac's fort on the north bank of the Detroit River, founded on 24 July 1701 to hold the strait between the lakes.",
    historicalNotes: "Cadillac invited the western nations to settle beside the fort; Wyandot, Odawa, Potawatomi and Ojibwe villages soon surrounded it. The post passed to Britain in 1760 and was besieged by Pontiac in 1763. It is the origin of the city of Detroit.",
    images: [{ file: "Fort Pontchartrain Detroit", caption: "Fort Pontchartrain du Détroit" }], guide: [W("Fort Pontchartrain du Détroit", "Fort_Pontchartrain_du_D%C3%A9troit", "Cadillac's fort and the founding of Detroit.")] },
  { name: "Trois-Rivières", locationType: "Settlement", yearEstablished: 1634, latitude: 46.343, longitude: -72.542, waterway: "St. Lawrence River", indigenousName: null, indigenousLanguage: null,
    description: "The second town of New France, founded by Laviolette in 1634 at the mouth of the Saint-Maurice as a trading post with the Algonquin and Atikamekw.",
    historicalNotes: "A fur-trade fair and a launching point for the interior; Radisson, Des Groseilliers, Nicolet and the La Vérendrye family all lived here. The Saint-Maurice ironworks of 1730 were the first heavy industry in Canada.",
    images: [{ file: "Trois-Rivières", caption: "Trois-Rivières" }], guide: [W("Trois-Rivières", "Trois-Rivi%C3%A8res", "History of the town."), TCE("Trois-Rivières", "trois-rivieres", "The town's role in New France.")] },
  { name: "Lachine", locationType: "Settlement", yearEstablished: 1667, latitude: 45.43, longitude: -73.67, waterway: "St. Lawrence River", indigenousName: null, indigenousLanguage: null,
    description: "La Salle's seigneury above the Lachine Rapids, granted in 1667, named in mockery of his hope of finding a route to China ('la Chine').",
    historicalNotes: "Because the rapids blocked the river above Montreal, Lachine became the place where every canoe brigade to the west was loaded; the North West Company's warehouses stood here. The Iroquois attack of August 1689 killed or captured scores of settlers.",
    images: [{ file: "Lachine Quebec", caption: "Lachine on the St. Lawrence" }], guide: [W("Lachine, Quebec", "Lachine,_Quebec", "History of Lachine."), TCE("Lachine", "lachine", "Lachine and the fur-trade brigades.")] },
  { name: "Fort Saint-Frédéric", locationType: "Fort", yearEstablished: 1731, latitude: 44.029, longitude: -73.428, waterway: "Lake Champlain", indigenousName: null, indigenousLanguage: null,
    description: "The French stone fort at Crown Point, built from 1731 to command the narrows of Lake Champlain and the road to Albany.",
    historicalNotes: "For nearly thirty years it was the southernmost post of New France and the base for raids on New England. The French blew it up in 1759 as Amherst approached; the British built the much larger Crown Point fort beside the ruins.",
    images: [{ file: "Fort Saint-Frédéric Crown Point", caption: "Ruins of Fort Saint-Frédéric at Crown Point" }], guide: [W("Fort St. Frédéric", "Fort_St._Fr%C3%A9d%C3%A9ric", "The fort at Crown Point.")] },
  { name: "Fort Carillon", locationType: "Fort", yearEstablished: 1755, latitude: 43.843, longitude: -73.388, waterway: "Lake Champlain", indigenousName: null, indigenousLanguage: null,
    description: "The French fort at the outlet of Lake George into Lake Champlain, built in 1755 and renamed Ticonderoga by the British.",
    historicalNotes: "Montcalm's 3,600 men defeated a British army of 16,000 here on 8 July 1758, the greatest French victory of the war; the French abandoned the fort a year later. Champlain's fight with the Mohawk in 1609 took place nearby.",
    images: [{ file: "Fort Ticonderoga", caption: "Fort Ticonderoga, the former Fort Carillon" }], guide: [W("Fort Ticonderoga", "Fort_Ticonderoga", "Carillon and Ticonderoga.")] },
  { name: "Fort Chambly", locationType: "Fort", yearEstablished: 1665, latitude: 45.448, longitude: -73.284, waterway: "Richelieu River", indigenousName: null, indigenousLanguage: null,
    description: "The fort at the Chambly rapids on the Richelieu, first built of wood in 1665 by the Carignan-Salières regiment against the Iroquois and rebuilt in stone in 1709-11.",
    historicalNotes: "The stone fort guarded the river road from Lake Champlain to Montreal through the wars with the English colonies. It surrendered in 1760, was held by the Americans in 1775-76, and is now a national historic site.",
    images: [{ file: "Fort Chambly", caption: "Fort Chambly on the Richelieu" }], guide: [W("Fort Chambly", "Fort_Chambly", "History of the fort."), TCE("Fort Chambly", "fort-chambly", "The fort on the Richelieu.")] },
  { name: "Fort de Chartres", locationType: "Fort", yearEstablished: 1720, latitude: 38.084, longitude: -90.157, waterway: "Mississippi River", indigenousName: null, indigenousLanguage: null,
    description: "The seat of French government in the Illinois Country, built on the east bank of the Mississippi in 1720 and rebuilt in stone in the 1750s.",
    historicalNotes: "From here the French governed the villages of Kaskaskia, Cahokia and Prairie du Rocher and sent wheat down the river to New Orleans. It was the last French post in North America handed to the British, in October 1765.",
    images: [{ file: "Fort de Chartres", caption: "Fort de Chartres" }], guide: [W("Fort de Chartres", "Fort_de_Chartres", "The French fort in the Illinois Country.")] },
  { name: "Kaskaskia", locationType: "Settlement", yearEstablished: 1703, latitude: 37.92, longitude: -89.92, waterway: "Mississippi River", indigenousName: null, indigenousLanguage: null,
    description: "The chief French village of the Illinois Country, founded in 1703 beside the Kaskaskia people's village near the mouth of the Kaskaskia River.",
    historicalNotes: "A farming town of French habitants and Illinois families that fed New Orleans with flour. Capital of the Illinois Territory under the United States; most of the old town was washed away when the Mississippi changed course in 1881.",
    images: [{ file: "Kaskaskia Illinois", caption: "Kaskaskia" }], guide: [W("Kaskaskia, Illinois", "Kaskaskia,_Illinois", "The French village and its fate.")] },
  { name: "New Orleans", locationType: "Settlement", yearEstablished: 1718, latitude: 29.958, longitude: -90.065, waterway: "Mississippi River", indigenousName: "Bulbancha", indigenousLanguage: "Choctaw",
    description: "The capital of French Louisiana, founded in 1718 by Jean-Baptiste Le Moyne de Bienville, Iberville's brother, on a crescent of the lower Mississippi. The Choctaw name Bulbancha means 'place of many tongues'.",
    historicalNotes: "New Orleans was the southern end of the French river empire that began at Quebec. Ceded to Spain in 1762 and returned to France in 1800, it was sold to the United States with the rest of Louisiana in 1803.",
    images: [{ file: "New Orleans Jackson Square", caption: "The French Quarter of New Orleans" }], guide: [W("New Orleans", "New_Orleans", "History of the city."), W("Louisiana (New France)", "Louisiana_(New_France)", "The French colony from the Great Lakes to the Gulf.")] },
  { name: "Stadacona", locationType: "Cultural Site", yearEstablished: 1535, latitude: 46.81, longitude: -71.21, waterway: "St. Lawrence River", indigenousName: "Stadacona", indigenousLanguage: "St. Lawrence Iroquoian",
    description: "The St. Lawrence Iroquoian town at the foot of the Quebec promontory where Jacques Cartier wintered in 1535-36 and where Donnacona ruled.",
    historicalNotes: "Cartier's men were saved from scurvy by the Stadaconans' cedar remedy. The town and its people had vanished by the time Champlain arrived in 1608, for reasons still debated: war with the Haudenosaunee, disease, or migration. 'Canada', the Iroquoian word for village, entered European maps from Cartier's visit here.",
    images: [], guide: [W("Stadacona", "Stadacona", "Cartier's winter at Stadacona and the town's disappearance."), TCE("Stadacona", "stadacona", "The Iroquoian village at Quebec.")] },
  { name: "Hochelaga", locationType: "Cultural Site", yearEstablished: 1535, latitude: 45.505, longitude: -73.58, waterway: "St. Lawrence River", indigenousName: "Hochelaga", indigenousLanguage: "St. Lawrence Iroquoian",
    description: "The fortified St. Lawrence Iroquoian town of some fifty longhouses on the island of Montreal, visited by Cartier on 2 October 1535.",
    historicalNotes: "Cartier climbed the mountain behind the town and named it Mont Royal. By 1603, when Champlain came, Hochelaga was gone. Its exact site is unknown; the Dawson site near McGill University is one candidate.",
    images: [], guide: [W("Hochelaga (village)", "Hochelaga_(village)", "Cartier's visit and the search for the site."), TCE("Hochelaga", "hochelaga", "The Iroquoian town on Montreal island.")] },
  { name: "La Baye (Green Bay)", locationType: "Trading Post", yearEstablished: 1717, latitude: 44.52, longitude: -88.02, waterway: "Fox River (Wisconsin)", indigenousName: null, indigenousLanguage: null,
    description: "The French post at the mouth of the Fox River on Green Bay, built in 1717 at the western door of the Fox–Wisconsin route to the Mississippi.",
    historicalNotes: "Nicolet landed here in 1634 and the Jesuits founded the mission of St. Francis Xavier nearby in 1669. The post was the French base in the Fox Wars of the 1710s and 1730s and became the town of Green Bay.",
    images: [{ file: "Green Bay Wisconsin", caption: "Green Bay" }], guide: [W("Green Bay, Wisconsin", "Green_Bay,_Wisconsin", "From La Baye to the modern city.")] },
  { name: "Prairie du Chien", locationType: "Cultural Site", yearEstablished: 1673, latitude: 43.05, longitude: -91.14, waterway: "Mississippi River", indigenousName: null, indigenousLanguage: null,
    description: "The prairie at the mouth of the Wisconsin River where Jolliet and Marquette entered the Mississippi on 17 June 1673, later the great trading rendezvous of the upper river.",
    historicalNotes: "A neutral meeting ground for the Dakota, Ho-Chunk, Fox and Sauk and the French and British traders; the Treaty of Prairie du Chien of 1825 was signed here. Named for a Fox chief called 'the Dog'.",
    images: [{ file: "Prairie du Chien", caption: "The Mississippi at Prairie du Chien" }], guide: [W("Prairie du Chien, Wisconsin", "Prairie_du_Chien,_Wisconsin", "The rendezvous at the mouth of the Wisconsin.")] },
  { name: "Allumette Island", locationType: "Cultural Site", yearEstablished: 1613, latitude: 45.8, longitude: -77.0, waterway: "Ottawa River", indigenousName: null, indigenousLanguage: null,
    description: "The island in the Ottawa River where the Kichesipirini Algonquin under Tessouat controlled the river and levied tolls on everyone who passed; Champlain reached it in June 1613.",
    historicalNotes: "Tessouat refused Champlain guides to go further and exposed Nicolas de Vignau's tale of a northern sea as a lie. The Kichesipirini held the Ottawa toll until the Iroquois wars of the 1640s scattered them.",
    images: [{ file: "Allumette Island", caption: "Allumette Island on the Ottawa River" }], guide: [W("Allumette Island", "Allumette_Island", "The island and the Kichesipirini."), DCB("Tessouat (d. 1636)", "tessouat_1603_1613_1E", "The chief who held the Ottawa.")] },
];

// ────────────────────────────────────────────────────────────────────────────────
export const figures: PackFigure[] = [
  {
    id: "nf_donnacona", name: "Donnacona", alternateNames: null, birthYear: null, deathYear: 1539, nation: "St. Lawrence Iroquoian", birthPlace: "Stadacona",
    figureType: "indigenous_leader", role: "Chief of Stadacona who met Jacques Cartier",
    biography: "Donnacona was the headman of Stadacona, the St. Lawrence Iroquoian town at Quebec, when Jacques Cartier arrived in 1534 and 1535. He protested the cross Cartier raised at Gaspé in 1534, yet allowed two of his sons, Domagaya and Taignoagny, to sail to France and return as interpreters. In 1535 he tried to keep Cartier from going upriver to Hochelaga, and in May 1536, after a winter in which his people's cedar remedy had saved the French from scurvy, Cartier seized him and nine others and carried them to France. Donnacona told King Francis I of a rich 'Kingdom of Saguenay' and died in France about 1539; none of the ten returned home.",
    significance: "Donnacona's story is the first recorded diplomacy between a First Nation and France on the St. Lawrence, and the first abduction. His tales of the Saguenay drove the next French expedition in 1541, and his people's remedy for scurvy is the earliest recorded gift of Indigenous medicine to Europeans in Canada.",
    associatedExplorers: [{ name: "Jacques Cartier", relationship: "Met Cartier in 1534 and 1535; abducted by him in 1536" }],
    achievements: ["Led Stadacona at the time of Cartier's voyages", "Sent his sons to France and received them back as interpreters", "His people's cedar remedy saved Cartier's crew from scurvy", "Described the 'Kingdom of Saguenay' to the French court"],
    associatedLocations: ["St. Lawrence River", "Gaspé Bay", "Stadacona"], activePeriodStart: 1534, activePeriodEnd: 1536, isFeatured: true,
    guide: [DCB("Donnacona", "donnacona_1E", "Scholarly biography."), TCE("Donnacona", "donnacona", "The chief of Stadacona.")],
  },
  {
    id: "nf_kondiaronk", name: "Kondiaronk", alternateNames: "Le Rat, Gaspar Soiaga", birthYear: 1649, deathYear: 1701, nation: "Wendat (Tionontati / Petun)", birthPlace: null,
    figureType: "indigenous_leader", role: "Wendat chief at Michilimackinac and architect of the Great Peace of 1701",
    biography: "Kondiaronk led the Wendat (Huron-Petun) community at Michilimackinac in the last decades of the seventeenth century, when the French alliance and the Iroquois wars shaped every choice. Called 'Le Rat' by the French, he was famous as an orator and strategist; in 1688 he wrecked a French–Iroquois truce that threatened his people by ambushing an Iroquois embassy and blaming the French. He dealt with Cadillac, commandant at Michilimackinac from 1694, and in the summer of 1701 came to Montreal as the leading voice for peace among the forty nations gathered there. He fell ill during the council, spoke from a chair for two hours on 1 August, and died the next day; the Great Peace was signed two days later and he was buried with full honours in the church of Notre-Dame.",
    significance: "The Great Peace of Montreal ended more than a century of war between the Haudenosaunee and the French and their allies, and Kondiaronk was its principal Indigenous author. Baron de Lahontan's published 'dialogues' with him made him, under the name Adario, one of the best-known Indigenous thinkers in eighteenth-century Europe.",
    associatedExplorers: [{ name: "Antoine Laumet de La Mothe Cadillac", relationship: "Dealt with Cadillac as commandant at Michilimackinac, 1694-1697" }],
    achievements: ["Preserved Wendat independence between the French and the Iroquois", "Chief negotiator for the western nations at the Great Peace of Montreal, 1701", "Subject of Lahontan's influential 'Dialogues with a Savage' (1703)"],
    associatedLocations: ["Lake Huron", "St. Lawrence River", "Michilimackinac", "Montreal"], activePeriodStart: 1682, activePeriodEnd: 1701, isFeatured: true,
    guide: [DCB("Kondiaronk", "kondiaronk_2E", "Scholarly biography."), TCE("Great Peace of Montreal, 1701", "great-peace-of-montreal-1701", "The treaty Kondiaronk helped make."), W("Kondiaronk", "Kondiaronk", "Life and the Great Peace.")],
  },
  {
    id: "nf_tessouat", name: "Tessouat", alternateNames: "Le Borgne de l'Île", birthYear: null, deathYear: 1636, nation: "Kichesipirini Algonquin", birthPlace: null,
    figureType: "indigenous_leader", role: "Chief of the Kichesipirini who controlled the Ottawa River at Allumette Island",
    biography: "Tessouat, the one-eyed chief of the Island, led the Kichesipirini Algonquin whose village on Allumette Island commanded the Ottawa River. Every canoe between the St. Lawrence and the upper country passed his island and paid his toll. He met Champlain at Tadoussac in 1603 and received him on the island in June 1613, feasting him but refusing him canoes and guides to go on to the Nipissing, and proving that Champlain's interpreter Vignau had lied about a sea to the north. He kept the Kichesipirini's middleman position against French and Wendat alike until his death in 1636.",
    significance: "Tessouat shows that the Ottawa River was an Indigenous highway with its own masters before it was a French one. His control of the river forced Champlain to deal with Algonquin interests on Algonquin terms, and the toll his people collected is the earliest recorded regulation of the fur road to the interior.",
    associatedExplorers: [{ name: "Samuel de Champlain", relationship: "Hosted and turned back Champlain at Allumette Island in 1613" }],
    achievements: ["Controlled the Ottawa River passage and its toll for three decades", "Exposed Nicolas de Vignau's false report of a northern sea (1613)", "Maintained Algonquin independence between the French and the Wendat"],
    associatedLocations: ["Ottawa River", "Allumette Island"], activePeriodStart: 1603, activePeriodEnd: 1636, isFeatured: false,
    guide: [DCB("Tessouat (d. 1636)", "tessouat_1603_1613_1E", "Scholarly biography."), W("Tessouat", "Tessouat", "The chief of Allumette Island.")],
  },
  {
    id: "nf_membertou", name: "Membertou", alternateNames: "Henri Membertou", birthYear: null, deathYear: 1611, nation: "Mi'kmaq", birthPlace: null,
    figureType: "indigenous_leader", role: "Mi'kmaq grand chief and ally of the French at Port-Royal",
    biography: "Membertou was the sakamow, or chief, of the Mi'kmaq around the Annapolis Basin when Pierre Dugua de Mons and Samuel de Champlain built Port-Royal in 1605. Already old, he said he remembered Cartier's voyages. He welcomed the French, guarded the habitation when they left in 1607, and led a war party against the Penobscot in 1607 in the French-style shallop. In June 1610 he and twenty members of his family were baptized by the priest Jessé Fléché, the first baptisms recorded in New France, Membertou taking the name Henri after the king. He died in 1611 and was buried, at his wish, among the French.",
    significance: "Membertou's alliance made Acadia possible: the small French settlement on the Bay of Fundy survived on Mi'kmaq goodwill, food and knowledge. His baptism marked the beginning of the Mi'kmaq–French alliance that lasted until the fall of New France.",
    associatedExplorers: [{ name: "Samuel de Champlain", relationship: "Host and ally of Champlain at Port-Royal, 1605-1607" }],
    achievements: ["Grand chief of the Mi'kmaq of the Annapolis Basin", "Protected Port-Royal during the French absence of 1607-1610", "First recorded baptism in New France, 24 June 1610"],
    associatedLocations: ["Bay of Fundy", "Port-Royal (Habitation)"], activePeriodStart: 1605, activePeriodEnd: 1611, isFeatured: false,
    guide: [DCB("Membertou", "membertou_1E", "Scholarly biography."), TCE("Membertou", "membertou", "The Mi'kmaq chief and the French.")],
  },
];

// ────────────────────────────────────────────────────────────────────────────────
export const timelineEvents: PackTimelineEvent[] = [
  { year: 1535, month: 10, day: 2, title: "Cartier at Stadacona and Hochelaga", description: "Jacques Cartier sails up the St. Lawrence to the Iroquoian towns of Stadacona and Hochelaga and winters below Stadacona, where Donnacona's people save his crew from scurvy.", theme: "exploration", importance: "major", explorer: "Jacques Cartier", waterway: "St. Lawrence River", location: "Hochelaga" },
  { year: 1609, month: 7, day: 30, title: "Champlain on Lake Champlain", description: "Champlain and his Innu, Algonquin and Wendat allies go up the Richelieu to the lake he names for himself and defeat a Mohawk party near Ticonderoga with firearms.", theme: "exploration", importance: "major", explorer: "Samuel de Champlain", waterway: "Lake Champlain" },
  { year: 1609, month: 9, title: "Hudson Ascends the Hudson River", description: "Henry Hudson, sailing for the Dutch East India Company, takes the Half Moon up the river to the head of navigation near present Albany, opening the Dutch fur trade.", theme: "exploration", importance: "major", explorer: "Henry Hudson", waterway: "Hudson River" },
  { year: 1613, month: 6, title: "Champlain at Tessouat's Island", description: "Champlain reaches Allumette Island, where Tessouat and the Kichesipirini control the Ottawa River; refused guides, he turns back, having exposed Vignau's false story of a northern sea.", theme: "exploration", importance: "minor", explorer: "Samuel de Champlain", waterway: "Ottawa River", location: "Allumette Island" },
  { year: 1615, month: 7, title: "Champlain Reaches Huronia", description: "Champlain follows the Mattawa, Lake Nipissing and the French River to Georgian Bay and the Wendat towns, the road every canoe to the west will follow for two centuries.", theme: "exploration", importance: "moderate", explorer: "Samuel de Champlain", waterway: "Lake Nipissing" },
  { year: 1624, title: "Fort Orange Founded", description: "The Dutch West India Company builds Fort Orange at the head of navigation on the Hudson, giving the Mohawk a direct source of European goods and guns.", theme: "fur_trade", importance: "moderate", waterway: "Hudson River", location: "Fort Orange" },
  { year: 1634, title: "Nicolet at Green Bay", description: "Jean Nicolet lands at Green Bay in a robe of Chinese silk, expecting Asia, and makes peace between the Ho-Chunk and the Wendat; he is the first European on Lake Michigan.", theme: "exploration", importance: "moderate", explorer: "Jean Nicolet", waterway: "Lake Michigan", location: "La Baye (Green Bay)" },
  { year: 1673, month: 6, day: 17, title: "Jolliet and Marquette Reach the Mississippi", description: "Louis Jolliet and Father Jacques Marquette enter the Mississippi from the Wisconsin River and descend it to the Arkansas, proving that it flows to the Gulf of Mexico, not the Pacific.", theme: "exploration", importance: "major", explorer: "Louis Jolliet", waterway: "Mississippi River", location: "Prairie du Chien" },
  { year: 1673, month: 7, title: "Fort Frontenac Founded", description: "Governor Frontenac builds a fort at Cataraqui, the foot of Lake Ontario, to hold the Iroquois trade; La Salle will make it the base for his western ventures.", theme: "fur_trade", importance: "moderate", waterway: "Lake Ontario", location: "Fort Frontenac" },
  { year: 1679, month: 8, day: 7, title: "The Griffon Sails the Upper Lakes", description: "La Salle's Griffon, built above Niagara Falls, is the first sailing ship on the upper Great Lakes; it vanishes with its cargo of furs on the return voyage.", theme: "exploration", importance: "moderate", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Niagara River" },
  { year: 1682, month: 4, day: 9, title: "La Salle Claims Louisiana", description: "At the mouth of the Mississippi, La Salle claims the whole river basin for Louis XIV and names it Louisiana, joining New France to the Gulf of Mexico on paper.", theme: "exploration", importance: "major", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Mississippi River" },
  { year: 1686, month: 6, title: "De Troyes Takes the James Bay Posts", description: "Pierre de Troyes, with Iberville among his officers, marches overland from Montreal and captures Moose Factory, Rupert House and Fort Albany from the Hudson's Bay Company.", theme: "fur_trade", importance: "major", explorer: "Pierre de Troyes", waterway: "James Bay", location: "Moose Factory" },
  { year: 1699, month: 3, day: 2, title: "Iberville Founds Louisiana", description: "Pierre Le Moyne d'Iberville finds the mouth of the Mississippi from the sea and plants the first French post on the Gulf coast at Biloxi.", theme: "settlement", importance: "moderate", explorer: "Pierre Le Moyne d'Iberville", waterway: "Mississippi River" },
  { year: 1701, month: 8, day: 4, title: "The Great Peace of Montreal", description: "Some 1,300 delegates of forty nations sign a peace with New France and the Haudenosaunee at Montreal, ending a century of war; Kondiaronk, its chief Indigenous author, dies during the council.", theme: "indigenous", importance: "major", waterway: "St. Lawrence River", location: "Montreal" },
  { year: 1701, month: 7, day: 24, title: "Cadillac Founds Detroit", description: "Cadillac builds Fort Pontchartrain du Détroit to hold the strait between the lakes and gathers the western nations around it.", theme: "settlement", importance: "moderate", explorer: "Antoine Laumet de La Mothe Cadillac", waterway: "Detroit River", location: "Fort Pontchartrain du Détroit" },
  { year: 1718, title: "New Orleans Founded", description: "Bienville founds New Orleans on the lower Mississippi, the capital of Louisiana and the southern end of the French river empire that began at Quebec.", theme: "settlement", importance: "moderate", waterway: "Mississippi River", location: "New Orleans" },
  { year: 1763, month: 2, day: 10, title: "Treaty of Paris Ends New France", description: "France cedes Canada and the east bank of the Mississippi to Britain and Louisiana west of the river to Spain; the French water road from the St. Lawrence to the Gulf is divided.", theme: "settlement", importance: "major", waterway: "Mississippi River" },
];

export const historicalEvents: PackHistoricalEvent[] = [
  { title: "Champlain Fights the Mohawk", description: "On 30 July 1609 Champlain and two French companions, with their Innu, Algonquin and Wendat allies, met a Mohawk party near the south end of the lake. Champlain's arquebus killed two chiefs at the first shot. The fight began a century of enmity between New France and the Haudenosaunee.", latitude: 43.84, longitude: -73.39, locationName: "Near Ticonderoga, New York", year: 1609, month: 7, day: 30, category: "battle", significance: "major", explorer: "Samuel de Champlain", waterway: "Lake Champlain" },
  { title: "Hudson Reaches the Head of Navigation", description: "In September 1609 Henry Hudson's Half Moon anchored near present Albany, as far as the tide would carry a ship. Trade with the Mahican there was the beginning of the Dutch fur trade on the Hudson.", latitude: 42.65, longitude: -73.75, locationName: "Albany, New York", year: 1609, month: 9, category: "exploration", significance: "major", explorer: "Henry Hudson", waterway: "Hudson River" },
  { title: "Fort Orange Built", description: "The Dutch West India Company built its fur post here in 1624. Through it the Mohawk obtained the guns and goods that changed the balance of power across the Great Lakes and the St. Lawrence.", latitude: 42.641, longitude: -73.75, locationName: "Albany, New York", year: 1624, category: "fur_trade", significance: "major", waterway: "Hudson River", location: "Fort Orange" },
  { title: "Jolliet and Marquette Enter the Mississippi", description: "On 17 June 1673 two canoes carrying Louis Jolliet, Father Marquette and five voyageurs came out of the Wisconsin River onto the Mississippi here, the first Europeans known to reach the upper river.", latitude: 43.05, longitude: -91.14, locationName: "Prairie du Chien, Wisconsin", year: 1673, month: 6, day: 17, category: "exploration", significance: "major", explorer: "Louis Jolliet", waterway: "Mississippi River", location: "Prairie du Chien" },
  { title: "The Griffon Is Launched", description: "La Salle's men built the Griffon, a 45-ton barque, at the mouth of Cayuga Creek above Niagara Falls in the winter of 1679 and launched it in May. It sailed to Green Bay in August and was never seen again.", latitude: 43.08, longitude: -78.95, locationName: "Cayuga Creek, Niagara River", year: 1679, month: 5, category: "exploration", significance: "normal", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Niagara River" },
  { title: "La Salle Claims Louisiana", description: "On 9 April 1682, near the mouth of the Mississippi, La Salle raised a cross and the arms of France and claimed the river and all the lands it drained for Louis XIV, naming them Louisiana.", latitude: 29.15, longitude: -89.25, locationName: "Mouth of the Mississippi, Louisiana", year: 1682, month: 4, day: 9, category: "exploration", significance: "major", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Mississippi River" },
  { title: "De Troyes Captures Moose Factory", description: "After eighty-two days overland from Montreal, Pierre de Troyes and his Canadians stormed the Hudson's Bay Company's Moose Fort before dawn on 21 June 1686. Iberville was the first over the palisade.", latitude: 51.26, longitude: -80.6, locationName: "Moose Factory, Ontario", year: 1686, month: 6, day: 21, category: "battle", significance: "major", explorer: "Pierre de Troyes", waterway: "Moose River", location: "Moose Factory" },
  { title: "The Great Peace of Montreal", description: "In the summer of 1701 some 1,300 delegates of forty nations camped outside Montreal and signed a general peace with New France and the Haudenosaunee on 4 August. Kondiaronk died during the council and was buried in Notre-Dame.", latitude: 45.505, longitude: -73.556, locationName: "Montreal, Quebec", year: 1701, month: 8, day: 4, category: "treaty", significance: "major", waterway: "St. Lawrence River", location: "Montreal" },
  { title: "New Orleans Founded", description: "Jean-Baptiste Le Moyne de Bienville chose this crescent of the lower Mississippi for the capital of Louisiana in 1718. It became the southern port of the French river empire that began at Quebec.", latitude: 29.958, longitude: -90.065, locationName: "New Orleans, Louisiana", year: 1718, category: "settlement", significance: "major", waterway: "Mississippi River", location: "New Orleans" },
];

// Existing What Happened Here events that the new records let us link (title → links).
export const historicalBackfill: Array<{ title: string; explorer?: string; waterway?: string; location?: string }> = [
  { title: "Cartier Raises Cross at Gaspe", explorer: "Jacques Cartier", waterway: "Gaspé Bay", location: "Cartier's Cross at Gaspé" },
  { title: "Cartier at Montreal (Hochelaga)", explorer: "Jacques Cartier", waterway: "St. Lawrence River", location: "Hochelaga" },
  { title: "Champlain Founds Quebec City", explorer: "Samuel de Champlain", waterway: "St. Lawrence River", location: "Quebec City" },
  { title: "Brule Sees Lake Superior", explorer: "Etienne Brule", waterway: "Lake Superior" },
  { title: "Father Marquette at Michilimackinac", explorer: "Jacques Marquette", waterway: "Lake Huron", location: "Michilimackinac" },
  { title: "Fort Frontenac Established", waterway: "Lake Ontario", location: "Fort Frontenac" },
  { title: "La Salle at Niagara", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Niagara River" },
  { title: "Founding of Detroit", explorer: "Antoine Laumet de La Mothe Cadillac", waterway: "Detroit River", location: "Fort Pontchartrain du Détroit" },
  { title: "Cook Arrives at Nootka Sound", explorer: "Captain James Cook", waterway: "Nootka Sound" },
  { title: "Hearne Reaches Arctic Ocean", explorer: "Samuel Hearne", waterway: "Coppermine River" },
  { title: "Mackenzie Reaches the Pacific", explorer: "Alexander Mackenzie", waterway: "Dean Channel" },
  { title: "Thompson Reaches the Pacific via Columbia River", explorer: "David Thompson", waterway: "Columbia River" },
  { title: "Frobisher Lands at Baffin Island", explorer: "Martin Frobisher", waterway: "Frobisher Bay" },
  { title: "Kelsey Reaches the Prairies", explorer: "Henry Kelsey", waterway: "Saskatchewan River" },
];

// ────────────────────────────────────────────────────────────────────────────────
export const pronunciations: PackPronunciation[] = [
  { term: "Michilimackinac", termType: "indigenous_place", language: "Anishinaabemowin", phonetic: "mish-ill-ih-MACK-in-aw", meaning: "place of the great turtle", notes: "The straits between Lakes Michigan and Huron; the French fort and the Jesuit mission of St. Ignace", location: "Michilimackinac" },
  { term: "Hochelaga", termType: "indigenous_place", language: "St. Lawrence Iroquoian", phonetic: "ho-shuh-LAH-gah", meaning: "at the beaver dam (one reading)", notes: "The Iroquoian town on Montreal island visited by Cartier in 1535", location: "Hochelaga" },
  { term: "Stadacona", termType: "indigenous_place", language: "St. Lawrence Iroquoian", phonetic: "stad-uh-KO-nuh", meaning: null, notes: "The Iroquoian town at Quebec where Cartier wintered in 1535-36", location: "Stadacona" },
  { term: "Kondiaronk", termType: "indigenous_nation", language: "Wendat", phonetic: "kon-dee-ah-RONK", meaning: null, notes: "Wendat chief, architect of the Great Peace of Montreal, 1701" },
  { term: "Donnacona", termType: "indigenous_nation", language: "St. Lawrence Iroquoian", phonetic: "don-nuh-KO-nuh", meaning: null, notes: "Chief of Stadacona in Cartier's time" },
  { term: "Nipissing", termType: "indigenous_place", language: "Anishinaabemowin", phonetic: "NIP-ih-sing", meaning: "little water", notes: "The lake and the people on the canoe route to Lake Huron", waterway: "Lake Nipissing" },
  { term: "Mattawa", termType: "indigenous_place", language: "Algonquin", phonetic: "MAT-uh-wah", meaning: "meeting of waters", notes: "The river joining the Ottawa to Lake Nipissing", waterway: "Mattawa River" },
  { term: "Misi-ziibi", termType: "indigenous_place", language: "Ojibwe", phonetic: "MISS-ih-ZEE-bee", meaning: "great river", notes: "The Ojibwe name from which 'Mississippi' comes", waterway: "Mississippi River" },
  { term: "Jolliet", termType: "explorer", language: "French", phonetic: "zhol-YAY", meaning: null, notes: "Louis Jolliet, who reached the Mississippi with Marquette in 1673", explorer: "Louis Jolliet" },
  { term: "Marquette", termType: "explorer", language: "French", phonetic: "mar-KET", meaning: null, notes: "Father Jacques Marquette, Jesuit missionary and chronicler of the 1673 voyage", explorer: "Jacques Marquette" },
  { term: "Cavelier de La Salle", termType: "explorer", language: "French", phonetic: "ka-vuhl-YAY duh la SAL", meaning: null, notes: "René-Robert Cavelier, Sieur de La Salle, who claimed Louisiana in 1682", explorer: "Rene-Robert Cavelier, Sieur de La Salle" },
  { term: "Hennepin", termType: "explorer", language: "French", phonetic: "en-PAN (French) / HEN-uh-pin (English)", meaning: null, notes: "Louis Hennepin, the Récollet who described Niagara Falls", explorer: "Louis Hennepin" },
  { term: "Dulhut", termType: "explorer", language: "French", phonetic: "dü-LÜ", meaning: null, notes: "Daniel Greysolon Dulhut; the city of Duluth takes its name from him", explorer: "Daniel Greysolon Dulhut" },
  { term: "Iberville", termType: "explorer", language: "French", phonetic: "ee-bair-VEEL", meaning: null, notes: "Pierre Le Moyne d'Iberville, soldier of New France and founder of Louisiana", explorer: "Pierre Le Moyne d'Iberville" },
  { term: "Cadillac", termType: "explorer", language: "French", phonetic: "ka-dee-YAK", meaning: null, notes: "Antoine Laumet de La Mothe Cadillac, founder of Detroit", explorer: "Antoine Laumet de La Mothe Cadillac" },
  { term: "Richelieu", termType: "french", language: "French", phonetic: "REESH-uh-lyuh", meaning: null, notes: "The river from Lake Champlain to the St. Lawrence, named for the cardinal", waterway: "Richelieu River" },
  { term: "Pays des Illinois", termType: "french", language: "French", phonetic: "pay-ee dayz ee-lee-NWAH", meaning: "the Illinois Country", notes: "The French name for the Mississippi–Illinois valley settlements" },
];

// ────────────────────────────────────────────────────────────────────────────────
export const quiz = {
  title: "New France to the Gulf", description: "From the St. Lawrence to the Mississippi: the French explorers, forts and alliances that joined Canada to the Gulf of Mexico.",
  category: "Explorers", gradeLevel: "7-9", difficulty: "medium" as const,
  questions: [
    { questionText: "Which two men entered the Mississippi River from the Wisconsin River in June 1673?", options: ["Champlain and Brûlé", "Jolliet and Marquette", "La Salle and Tonti", "Radisson and Des Groseilliers"], correct: 1, explanation: "Louis Jolliet, a Quebec-born trader and mapmaker, and Father Jacques Marquette, a Jesuit, reached the Mississippi on 17 June 1673 and paddled down to the Arkansas River.", source: { type: "explorer", name: "Louis Jolliet" } },
    { questionText: "What did La Salle do at the mouth of the Mississippi on 9 April 1682?", options: ["Built Fort de Chartres", "Founded New Orleans", "Claimed the whole river basin for France as Louisiana", "Met Iberville's ships"], correct: 2, explanation: "La Salle raised a cross and the arms of France and claimed every land drained by the Mississippi for Louis XIV, naming it Louisiana after the king.", source: { type: "waterway", name: "Mississippi River" } },
    { questionText: "Why did Champlain's fight with the Mohawk on Lake Champlain in 1609 matter for the next hundred years?", options: ["It opened a trade route to Albany", "It made the Haudenosaunee enemies of New France", "It ended the fur trade on the St. Lawrence", "It gave France control of the Hudson River"], correct: 1, explanation: "Champlain sided with the Innu, Algonquin and Wendat and killed Mohawk chiefs with firearms. The Haudenosaunee remembered it, and the wars between them and New France lasted until the Great Peace of 1701.", source: { type: "waterway", name: "Lake Champlain" } },
    { questionText: "Which fort at the Straits of Mackinac was the hub of the upper-lakes fur trade?", options: ["Fort Frontenac", "Fort Niagara", "Michilimackinac", "Fort Chambly"], correct: 2, explanation: "Michilimackinac, where Lakes Michigan and Huron meet, was the place where canoes from Montreal met the traders of the west for most of the eighteenth century.", source: { type: "location", name: "Michilimackinac" } },
    { questionText: "Who was the first European to publish a description of Niagara Falls?", options: ["Samuel de Champlain", "Louis Hennepin", "Jacques Cartier", "Henri de Tonti"], correct: 1, explanation: "Father Louis Hennepin saw the Falls with La Salle's party in December 1678 and described them in his Description de la Louisiane, published in 1683.", source: { type: "explorer", name: "Louis Hennepin" } },
    { questionText: "The Dutch post of Fort Orange on the Hudson River was important to the fur trade because it", options: ["sold furs to Montreal", "gave the Mohawk a direct source of European goods and guns", "was the first fort built by Champlain", "controlled the Mississippi"], correct: 1, explanation: "Fort Orange, built in 1624 at present Albany, let the Mohawk and the other Haudenosaunee nations trade furs for guns and goods without going through the French, which changed the balance of power around the Great Lakes.", source: { type: "location", name: "Fort Orange" } },
    { questionText: "Which Wendat chief was the leading Indigenous voice at the Great Peace of Montreal in 1701?", options: ["Donnacona", "Tessouat", "Membertou", "Kondiaronk"], correct: 3, explanation: "Kondiaronk, called Le Rat by the French, spoke for the western nations at the council of forty nations in Montreal; he died during the council and the peace was signed two days later.", source: { type: "notable_figure", name: "Kondiaronk" } },
    { questionText: "How did Pierre de Troyes reach James Bay in 1686 to capture the Hudson's Bay Company posts?", options: ["By sea around Labrador", "Overland from Montreal by the Ottawa, Abitibi and Moose rivers", "Down the Mississippi", "Across Hudson Bay from Churchill"], correct: 1, explanation: "De Troyes led about a hundred men up the Ottawa, across Lake Timiskaming and down the Abitibi and Moose rivers, an eighty-two-day journey in the spring thaw, and took Moose Factory, Rupert House and Fort Albany.", source: { type: "explorer", name: "Pierre de Troyes" } },
  ],
};

// ────────────────────────────────────────────────────────────────────────────────
export const lesson = {
  title: "New France to the Gulf: Jolliet, Marquette and La Salle",
  description: "How French explorers, traders and missionaries followed the rivers from the St. Lawrence through the Great Lakes to the Mississippi and the Gulf of Mexico, and what their alliances with Indigenous nations made possible.",
  gradeLevel: "7-9", topic: "Early Explorers", estimatedMinutes: 70, readingTimeMinutes: 12,
  heroImage: { file: "Mississippi River", caption: "The Mississippi" },
  images: [{ file: "Starved Rock", caption: "Starved Rock on the Illinois River, where La Salle and Tonti built Fort Saint-Louis in 1682" }, { file: "Colonial Michilimackinac", caption: "The reconstructed fort at Michilimackinac, hub of the upper-lakes trade" }, { file: "New Orleans Jackson Square", caption: "New Orleans, founded in 1718 as the capital of French Louisiana" }],
  narrativeContent: `New France was never only the St. Lawrence valley. From the moment Champlain reached Lake Huron in 1615, the French understood that the interior of the continent was a web of rivers and lakes, and that whoever held the portages between them held the trade. Within seventy years their canoes had reached the Gulf of Mexico.

## The road west

Every journey began the same way. Canoes left Montreal, climbed the Ottawa River past Tessouat's old toll station at Allumette Island, turned up the Mattawa, crossed the height of land into Lake Nipissing, and ran down the French River into Georgian Bay. From there the lakes opened: Lake Huron, the Straits of Mackinac, Lake Michigan to Green Bay. This was the Indigenous highway that Champlain's Algonquin and Wendat allies had shown him, and the French used it for two hundred years.

## Jolliet and Marquette, 1673

In May 1673 Louis Jolliet, a Quebec-born trader and mapmaker, and Father Jacques Marquette, a Jesuit who spoke six Indigenous languages, left the mission at the mouth of the Fox River with five voyageurs and two canoes. Miami guides led them up the Fox to the portage, and on 17 June they came out of the Wisconsin onto a river the Ojibwe called Misi-ziibi, the great river. They paddled south for a month, past the mouths of the Illinois, the Missouri and the Ohio, until the Quapaw at the Arkansas River warned them of Spaniards further south. They had proved what everyone had wondered: the Mississippi flowed into the Gulf of Mexico, not the Pacific. They came home by the Illinois River, and reported that a portage of only a few kilometres joined it to Lake Michigan at the place that is now Chicago.

## La Salle, Tonti and the forts

René-Robert Cavelier de La Salle saw in that report an empire. From Fort Frontenac on Lake Ontario he built the Griffon above Niagara Falls in 1679, the first sailing ship on the upper lakes, and sent it west for furs; it was never seen again. With his one-handed lieutenant Henri de Tonti, 'Iron Hand', he built Fort Crèvecoeur and then Fort Saint-Louis on the great rock above the Illinois River, where Tonti gathered thousands of Illinois, Miami and Shawnee as allies against the Iroquois. In the spring of 1682 La Salle descended the Mississippi to the sea, and on 9 April, near its mouth, he claimed everything the river drained for Louis XIV and named it Louisiana.

## Hennepin and Dulhut

Not every Frenchman on the river was under La Salle's orders. The Récollet friar Louis Hennepin, sent to explore the upper Mississippi in 1680, was captured by the Dakota and carried north past the falls he named for St. Anthony. He was rescued by Daniel Greysolon Dulhut, who had come overland from Lake Superior, where a year earlier he had made peace between the Dakota and the Ojibwe at the place that bears his name, Duluth. Hennepin's books made Niagara Falls and the Mississippi famous in Europe, even though some of his later adventures were invented.

## Holding the river

Claiming a river and holding it were different things. Iberville, the hero of Hudson Bay, found the mouth of the Mississippi from the sea in 1699 and founded the colony of Louisiana; his brother Bienville founded New Orleans in 1718. In the Illinois Country, French farmers at Kaskaskia grew wheat beside the Kaskaskia people's village, and Fort de Chartres governed them. Michilimackinac, Detroit and Fort Niagara guarded the lakes. None of it would have stood without the Indigenous nations who fed the posts, guided the canoes, married the traders and chose, year by year, to stay in the French alliance. The Great Peace of Montreal in 1701, made with Kondiaronk's help, was what let the whole system work.

## The end of the road

In 1763 the Treaty of Paris cut the river empire in two: Canada and the east bank of the Mississippi went to Britain, Louisiana west of the river to Spain. But the French names stayed on the map, from Trois-Rivières and Lachine to Detroit, Prairie du Chien, St. Louis and New Orleans, and so did the French-speaking families and the Métis communities that the fur road had created.`,
  keyFigures: [
    { name: "Louis Jolliet", role: "Trader and mapmaker", years: "1645-1700", description: "Quebec-born leader of the 1673 Mississippi expedition; his maps fixed the river's course for Europe.", explorer: "Louis Jolliet" },
    { name: "Jacques Marquette", role: "Jesuit missionary", years: "1637-1675", description: "Chronicler of the 1673 voyage, who spoke six Indigenous languages and promised the Illinois a mission.", explorer: "Jacques Marquette" },
    { name: "René-Robert Cavelier de La Salle", role: "Explorer and empire-builder", years: "1643-1687", description: "Claimed the Mississippi basin for France in 1682 and built the first forts on the Illinois.", explorer: "Rene-Robert Cavelier, Sieur de La Salle" },
    { name: "Henri de Tonti", role: "La Salle's lieutenant", years: "1649-1704", description: "'Iron Hand', who held the Illinois Country for France for twenty years and founded Arkansas Post.", explorer: "Henri de Tonti" },
    { name: "Louis Hennepin", role: "Récollet friar and author", years: "1626-1705", description: "First to describe Niagara Falls in print; explored the upper Mississippi as a Dakota captive.", explorer: "Louis Hennepin" },
    { name: "Kondiaronk", role: "Wendat chief", years: "c. 1649-1701", description: "Principal Indigenous author of the Great Peace of Montreal that made the French river empire possible.", figure: "Kondiaronk" },
  ],
  timeline: [
    { year: 1615, title: "Champlain reaches Huronia", description: "The Ottawa–Mattawa–Nipissing–French River road to the lakes is opened to the French.", event: "Champlain Reaches Huronia" },
    { year: 1673, title: "Jolliet and Marquette on the Mississippi", description: "The great river is proved to flow to the Gulf of Mexico.", event: "Jolliet and Marquette Reach the Mississippi" },
    { year: 1679, title: "The Griffon", description: "La Salle launches the first sailing ship on the upper lakes above Niagara.", event: "The Griffon Sails the Upper Lakes" },
    { year: 1682, title: "Louisiana claimed", description: "La Salle claims the whole Mississippi basin for France.", event: "La Salle Claims Louisiana" },
    { year: 1701, title: "The Great Peace of Montreal", description: "Forty nations and New France make peace; Kondiaronk dies during the council.", event: "The Great Peace of Montreal" },
    { year: 1718, title: "New Orleans", description: "Bienville founds the capital of Louisiana at the southern end of the river road.", event: "New Orleans Founded" },
    { year: 1763, title: "Treaty of Paris", description: "The French river empire is divided between Britain and Spain.", event: "Treaty of Paris Ends New France" },
  ],
  objectives: ["Trace the water route from Montreal to the Mississippi and explain why portages mattered", "Explain what Jolliet and Marquette proved in 1673 and how La Salle built on it", "Describe the role of Indigenous nations, guides and alliances in the French river empire", "Assess why France could claim so much territory and hold so little of it"],
  materials: ["Map of New France and Louisiana about 1750", "Marquette's 1673 journal in translation (Jesuit Relations vol. 59)", "Blank outline map of the Great Lakes and Mississippi", "Images of Michilimackinac, Starved Rock and New Orleans"],
  activities: [
    { title: "Mapping the river road", description: "On the outline map, students trace the route from Montreal to the Gulf and mark every portage, then explain why the French built forts where they did.", duration: "20 minutes", materials: ["Blank outline map", "Coloured pencils"] },
    { title: "Reading Marquette", description: "Read the passage on entering the Mississippi and the meeting with the Quapaw. What does Marquette notice? What does he not understand?", duration: "15 minutes", materials: ["Jesuit Relations excerpt"] },
    { title: "Whose river?", description: "In groups, students argue the Mississippi 'belongs' to one party in 1700: the Illinois, the French, the Dakota, the Spanish. Each presents the strongest case.", duration: "20 minutes", materials: [] },
    { title: "Names on the map", description: "Students find ten French or Indigenous place names between Montreal and New Orleans that survive today and explain each one.", duration: "15 minutes", materials: ["Modern road atlas or online map"] },
  ],
  discussionQuestions: ["Why did the French explore by canoe along rivers while the English colonies spread out by land?", "What did La Salle's claim of 1682 actually give France? What did it not give?", "Why did Indigenous nations choose to trade with and fight alongside the French? What did they gain and risk?", "How could the Great Peace of 1701 be both a French and an Indigenous success?", "Is the French river empire part of Canadian history, American history, or both?"],
  assessment: "Students write a letter home from one member of the 1673 expedition (Jolliet, Marquette, a voyageur or a Miami guide) describing one day on the river, using at least four facts from the lesson and one from the Marquette reading.",
  extensions: "Compare the French use of rivers with the Hudson's Bay Company's use of Hudson Bay in the same years. Which strategy reached further? Which lasted longer?",
  curriculumConnections: [
    { subject: "History", strand: "New France and British North America, 1713-1800", expectation: "Describe significant events, developments and people in New France and analyze their impact" },
    { subject: "Geography", strand: "Physical Patterns in a Changing World", expectation: "Explain how river systems and portages shaped patterns of settlement and trade" },
    { subject: "Social Studies", strand: "Heritage and Identity", expectation: "Describe interactions between Indigenous peoples and Europeans and their consequences" },
  ],
  teacherObjectives: ["Students will explain how the Indigenous canoe road from Montreal to the Great Lakes became the French road to the Mississippi", "Students will analyze the 1673 expedition as a joint Indigenous–French achievement", "Students will evaluate the gap between La Salle's claim and French control on the ground"],
  teacherActivities: [
    { title: "Primary source station", description: "Set up three stations: Marquette's journal (1673), Hennepin's description of Niagara (1683), and the text of La Salle's 1682 proclamation. Students record what each author wanted readers to believe.", duration: "25 minutes", materials: ["Printed excerpts", "Station worksheets"] },
    { title: "Alliance map", description: "Students map the nations around each French post (Illinois at Fort Saint-Louis, Wyandot and Odawa at Detroit, Wendat at Michilimackinac) and explain why each alliance held or broke.", duration: "20 minutes", materials: ["Outline map", "Nation list"] },
  ],
  teacherQuestions: ["How does Hennepin's unreliability change how we should read all explorers' accounts?", "Why did the Illinois Country become a farming colony while the Great Lakes posts stayed trading posts?", "In what ways did the 1763 division of the river basin shape the later border between Canada and the United States?"],
  teacherNotes: "This lesson connects the St. Lawrence story students know to the continental one they often do not. Three cautions: Marquette and Jolliet did not 'discover' the Mississippi, which was home to dozens of nations and had been reached by Spaniards under de Soto in 1541; Hennepin's later books are unreliable and are a good opportunity to discuss evaluating sources; and the Illinois, Miami, Dakota and Wendat appear here as actors with their own goals, not as scenery. The Great Peace of 1701 is the hinge of the lesson: without it the French river empire could not have functioned.",
  mainContent: `## Teaching context

The French reach to the Gulf of Mexico rested on three things: the Indigenous canoe road from Montreal to the upper lakes, which Champlain's allies opened to him in 1615; the alliances that fed and guided the posts; and the portages, Fox–Wisconsin and Chicago–Illinois above all, that joined the lakes to the Mississippi basin. The 1673 expedition was small, two canoes and seven men, and it succeeded because Miami guides took it to the portage and because the nations along the river chose to receive it.

## Sequence

1. Hook (5 min): show a map of North America in 1750 with French claims shaded. Ask how seven men in two canoes could begin a claim that size.
2. The road west (10 min): walk the route from Montreal to Green Bay on the map, naming each water body and portage.
3. 1673 (15 min): Jolliet and Marquette, the Quapaw warning, the Illinois return and the Chicago portage.
4. La Salle, Tonti, Hennepin and Dulhut (15 min): forts, the Griffon, the 1682 claim, and the problem of sources.
5. Holding the river (15 min): Louisiana, the Illinois Country, Michilimackinac, Detroit, and the Great Peace of 1701.
6. Close (10 min): the Treaty of Paris and the French names that remain.

## Common misconceptions

- That the Mississippi was unknown before 1673. De Soto's Spaniards crossed it in 1541, and it was home to many nations.
- That La Salle's claim gave France control. It gave France a map; control depended on alliances and a few hundred soldiers.
- That this is only American history. The expeditions left from Quebec and Montreal, were staffed by Canadians, and their forts are the origin of cities on both sides of the border.`,
  guide: [] as PackGuide[],
};

// ────────────────────────────────────────────────────────────────────────────────
export const fieldTrip = {
  title: "Michilimackinac: Where the Lakes Meet",
  description: "Paddle into the Straits of Mackinac and visit the French fort and trading town where Lakes Michigan and Huron come together. Meet the traders, the voyageurs and the Odawa and Ojibwe families who made it the busiest place on the upper lakes.",
  gradeLevel: "K-3", estimatedMinutes: 25, theme: "explorer", coverImage: { file: "Colonial Michilimackinac", caption: "Colonial Michilimackinac" },
  introduction: "Welcome, young voyageur! You have paddled for weeks from Montreal, up rivers and across lakes. Now you can see a wooden fort on the shore where two huge lakes meet. This is Michilimackinac. Let's go ashore and look around.",
  conclusion: "You have seen the fort, the trading room, the church and the canoes. Michilimackinac was a meeting place: French, Odawa, Ojibwe and Wendat people all lived and traded here. Today the fort is rebuilt so visitors can see what you saw.",
  location: "Michilimackinac", waterway: "Lake Huron",
  stops: [
    { title: "Arriving by Canoe", description: "Your big birchbark canoe glides toward the shore. On your left is Lake Michigan and on your right is Lake Huron. The water here is very deep and very cold! The Odawa and Ojibwe people call this place Michilimackinac, which means 'place of the great turtle'. Can you see the island shaped like a turtle?", funFact: "A big fur-trade canoe could carry eight paddlers and as much cargo as a small truck!", thinkQuestion: "Why do you think people built a fort right where two lakes meet?", image: { file: "Colonial Michilimackinac", caption: "The shore at Michilimackinac" }, lat: 45.7835, lng: -84.7395 },
    { title: "The Wooden Walls", description: "The fort has tall walls made of cedar logs standing on end. This is called a palisade. Inside are small houses with steep roofs, a church and storehouses. Soldiers in blue and white coats guard the gate. Most of the people inside are French traders and their families.", funFact: "The fort was built about 1715 and moved to Mackinac Island in 1781 because the island was easier to defend.", thinkQuestion: "What would you want to keep safe inside the walls?", image: { file: "Colonial Michilimackinac", caption: "The palisade and the gate" }, lat: 45.7868, lng: -84.7362 },
    { title: "The Trading Room", description: "Inside a trader's house, shelves hold blankets, kettles, knives, beads and bright cloth from France. Odawa and Ojibwe families bring beaver, otter and marten furs to trade. Everyone talks in French, Odawa and Ojibwe, and a lot of pointing and smiling!", funFact: "One good beaver pelt could be traded for a warm wool blanket or a metal kettle that lasted for years.", thinkQuestion: "If you lived here, what would you want to trade for?", image: { file: "Colonial Michilimackinac", caption: "A trader's house" }, lat: 45.7872, lng: -84.7357 },
    { title: "The Church of Sainte-Anne", description: "The little wooden church is the heart of the town. The priest keeps a book where he writes down every baptism, wedding and burial. Many weddings here are between French traders and Odawa or Ojibwe women. Their children grow up speaking two or three languages.", funFact: "The church's old record book still exists, and historians use it to learn the names of the families who lived here.", thinkQuestion: "Why would it be useful to speak more than one language at Michilimackinac?", image: { file: "Colonial Michilimackinac", caption: "The church inside the fort" }, lat: 45.7866, lng: -84.7370 },
    { title: "The Canoes Leave for Montreal", description: "At the end of summer the voyageurs load their canoes with bundles of furs. They sing as they paddle away toward Lake Huron, the French River and the long road home to Montreal. They will be back next year with new goods to trade. Au revoir, Michilimackinac!", funFact: "Voyageurs sang songs to keep everyone paddling in time, about 55 strokes every minute!", thinkQuestion: "What song would you sing to keep paddling for a whole day?", image: { file: "Colonial Michilimackinac", caption: "The straits from the fort" }, lat: 45.7840, lng: -84.7330 },
  ],
};
