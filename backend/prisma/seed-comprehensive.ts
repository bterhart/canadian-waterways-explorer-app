/**
 * Comprehensive Seed Update for Fur Trade History Educational App
 *
 * This file adds ALL missing critical data including:
 * - Missing River Systems (Nelson, Hayes, Moose, Albany, Abitibi, Red, Assiniboine)
 * - Louis Riel and Additional Metis Figures
 * - Pronunciation Guide Entries
 * - Lesson Plans
 * - Comparison Templates
 * - Timeline Events
 * - Virtual Field Trips
 * - Additional Trading Post Locations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==================== RIVER SYSTEMS DATA ====================

interface RiverData {
  name: string;
  indigenousName: string;
  indigenousLanguage: string;
  description: string;
  latitude: number;
  longitude: number;
  regionName: string;
  historicalSignificance: string;
  kmlData?: string;
}

const missingRivers: RiverData[] = [
  {
    name: "Nelson River",
    indigenousName: "Sipiwesk",
    indigenousLanguage: "Cree",
    description: "One of Manitoba's major rivers, flowing from Lake Winnipeg northeast to Hudson Bay. The Nelson River is the largest river in Manitoba by volume and forms part of the Nelson-Churchill river system that drains much of the Canadian prairies.",
    latitude: 57.0,
    longitude: -92.5,
    regionName: "Manitoba",
    historicalSignificance: "The Nelson River was a major Hudson's Bay Company route connecting the interior fur trade to York Factory at its mouth. York Factory, established at the mouth of the Nelson and Hayes Rivers, was the HBC's most important trading post for over a century. The river provided direct access from Lake Winnipeg to Hudson Bay, making it crucial for transporting furs and trade goods.",
    kmlData: JSON.stringify([
      [50.4, -96.8], [51.5, -95.5], [52.5, -94.5], [53.5, -94.0],
      [54.5, -93.5], [55.5, -93.0], [56.5, -92.8], [57.0, -92.5]
    ])
  },
  {
    name: "Hayes River",
    indigenousName: "Ethenneldeli",
    indigenousLanguage: "Dene",
    description: "A major river in northern Manitoba flowing to Hudson Bay parallel to the Nelson River. York Factory sits on the peninsula between the mouths of the Nelson and Hayes Rivers. The Hayes was considered the safer and more navigable route for brigade travel.",
    latitude: 57.0,
    longitude: -92.2,
    regionName: "Manitoba",
    historicalSignificance: "The Hayes River was the primary route for Hudson's Bay Company brigades traveling between York Factory and the interior. Unlike the more powerful Nelson River with its dangerous rapids, the Hayes offered a more navigable passage for the York boats that carried furs and supplies. The Hayes River brigade route connected York Factory to Norway House at the northern outlet of Lake Winnipeg.",
    kmlData: JSON.stringify([
      [53.9, -97.8], [54.5, -96.5], [55.0, -95.5], [55.5, -94.5],
      [56.0, -93.5], [56.5, -93.0], [57.0, -92.2]
    ])
  },
  {
    name: "Moose River",
    indigenousName: "Moose",
    indigenousLanguage: "Cree",
    description: "A river in northeastern Ontario that flows into James Bay at Moose Factory. The name comes from the Cree word for moose, reflecting the abundance of these animals in the region. The river drains a large area of the Hudson Bay Lowlands.",
    latitude: 51.3,
    longitude: -80.5,
    regionName: "Ontario",
    historicalSignificance: "Moose Factory, established in 1673 at the mouth of the Moose River, is the second oldest English settlement in Canada. It was a key Hudson's Bay Company post for trading with the Cree peoples of the James Bay region. The river provided access to the rich fur lands of the interior and remained an important trading route for centuries.",
    kmlData: JSON.stringify([
      [49.5, -82.5], [50.0, -81.5], [50.5, -81.0], [51.0, -80.8], [51.3, -80.5]
    ])
  },
  {
    name: "Albany River",
    indigenousName: "Albany",
    indigenousLanguage: "Cree",
    description: "One of the major rivers flowing into James Bay in northern Ontario. The Albany River is approximately 982 km long and drains a vast area of the Canadian Shield and Hudson Bay Lowlands.",
    latitude: 52.2,
    longitude: -81.5,
    regionName: "Ontario",
    historicalSignificance: "Fort Albany, established at the mouth of the Albany River in 1679, was one of the original Hudson's Bay Company posts and the oldest English settlement in Ontario. The river served as a major trade route into the interior, connecting James Bay to the rich fur lands of the Canadian Shield. Fort Albany was frequently contested between the English and French during the colonial wars.",
    kmlData: JSON.stringify([
      [50.0, -85.0], [50.5, -84.0], [51.0, -83.0], [51.5, -82.5],
      [52.0, -82.0], [52.2, -81.5]
    ])
  },
  {
    name: "Abitibi River",
    indigenousName: "Abitibi",
    indigenousLanguage: "Algonquin",
    description: "A river flowing through northeastern Ontario and into the Moose River. The name 'Abitibi' comes from the Algonquin language meaning 'middle waters' or 'halfway water,' referring to its position between the Great Lakes and James Bay.",
    latitude: 50.3,
    longitude: -81.0,
    regionName: "Ontario/Quebec",
    historicalSignificance: "The Abitibi River was an important route connecting the Great Lakes watershed to James Bay via a series of portages and connecting waterways. Indigenous peoples used this route for millennia before Europeans arrived. French traders used the Abitibi route to compete with the English at James Bay, and it remained significant throughout the fur trade era as an alternative to the longer St. Lawrence route.",
    kmlData: JSON.stringify([
      [48.5, -79.5], [49.0, -80.0], [49.5, -80.5], [50.0, -80.8], [50.3, -81.0]
    ])
  },
  {
    name: "Red River",
    indigenousName: "Miskosipi",
    indigenousLanguage: "Cree",
    description: "A major river flowing northward through Manitoba to Lake Winnipeg. The name in Cree, 'Miskosipi,' means 'Red River' and refers to the reddish-brown sediment the river carries. The river forms at the confluence of the Bois de Sioux and Otter Tail rivers at the border of Minnesota and North Dakota.",
    latitude: 50.0,
    longitude: -97.1,
    regionName: "Manitoba",
    historicalSignificance: "The Red River is central to Metis history and identity. The Red River Settlement, established in 1812 by Lord Selkirk, became the heart of the Metis nation. The Forks, where the Red and Assiniboine rivers meet at present-day Winnipeg, was a gathering place for Indigenous peoples for 6,000 years. Louis Riel led the Red River Resistance of 1869-70 here, which resulted in Manitoba becoming a Canadian province. The river valley was home to the distinctive Metis culture, including the Red River cart and the buffalo hunt.",
    kmlData: JSON.stringify([
      [46.0, -96.8], [47.0, -97.0], [48.0, -97.1], [49.0, -97.0],
      [49.5, -97.1], [50.0, -97.1]
    ])
  },
  {
    name: "Assiniboine River",
    indigenousName: "Assiniboine",
    indigenousLanguage: "Assiniboine/Nakota",
    description: "A major tributary of the Red River, flowing through Saskatchewan and Manitoba. The river is named after the Assiniboine people (also known as Nakota), whose territory encompassed much of its watershed. The Assiniboine joins the Red River at The Forks in present-day Winnipeg.",
    latitude: 49.9,
    longitude: -97.1,
    regionName: "Manitoba/Saskatchewan",
    historicalSignificance: "The Assiniboine River was a vital fur trade route connecting the prairies to the Red River and ultimately to Hudson Bay or Montreal. The junction with the Red River at The Forks was a strategic location, and Fort Garry was built nearby. Trading posts like Brandon House and Fort Ellice were established along its length. The river gave its name to the Assiniboine people, who were important trading partners and intermediaries in the fur trade.",
    kmlData: JSON.stringify([
      [51.0, -106.0], [50.5, -104.0], [50.0, -102.0], [49.8, -100.0],
      [49.9, -98.5], [49.9, -97.1]
    ])
  }
];

// ==================== NOTABLE FIGURES DATA ====================

interface NotableFigureData {
  name: string;
  alternateNames?: string;
  birthYear?: number;
  deathYear?: number;
  nation?: string;
  birthPlace?: string;
  figureType: string;
  role: string;
  biography: string;
  significance: string;
  associatedExplorers?: { name: string; relationship: string }[];
  achievements?: string[];
  associatedLocations?: string[];
  activePeriodStart?: number;
  activePeriodEnd?: number;
  imageUrl?: string;
  isFeatured: boolean;
}

const metisFigures: NotableFigureData[] = [
  {
    name: "Louis Riel",
    alternateNames: "Louis David Riel",
    birthYear: 1844,
    deathYear: 1885,
    nation: "Metis",
    birthPlace: "Red River Settlement (present-day Winnipeg, Manitoba)",
    figureType: "metis_leader",
    role: "Founder of Manitoba and Metis rights leader",
    biography: `Louis Riel was the most significant Metis leader in Canadian history and is often called the "Father of Manitoba." Born on October 22, 1844, at the Red River Settlement, Riel was educated in Montreal and trained for the priesthood before returning to the Red River in 1868.

When the Hudson's Bay Company transferred Rupert's Land to Canada in 1869 without consulting the local Metis population, Riel emerged as the leader of the resistance. He formed a provisional government, negotiated with Ottawa, and drafted the Metis Bill of Rights. His leadership resulted in the creation of Manitoba as a province in 1870, with guarantees for Metis land rights, French language, and Catholic education.

However, the execution of Thomas Scott during the resistance made Riel a wanted man in Ontario. He was elected to Parliament three times but could never take his seat. He spent years in exile in the United States, experienced a religious crisis, and was briefly institutionalized.

In 1884, Gabriel Dumont invited Riel to return to Canada to help the Metis in Saskatchewan, who faced similar threats to their land and way of life. The Northwest Resistance of 1885 followed, ending in military defeat at Batoche. Riel surrendered and was tried for treason. Despite arguments that he was not guilty by reason of insanity, Riel insisted on his sanity and the justice of his cause. He was hanged in Regina on November 16, 1885.

Riel's execution became a defining moment in Canadian history, inflaming French-English tensions and contributing to the rise of Quebec nationalism. Today he is widely recognized as a Father of Confederation and a defender of Metis rights.`,
    significance: "Louis Riel is the most important figure in Metis history and one of the most significant figures in Canadian history. He founded Manitoba, wrote the Metis Bill of Rights, led two resistance movements, and died defending the rights of his people. His trial and execution remain controversial and have been the subject of calls for a posthumous pardon. In 1992, Parliament passed a resolution recognizing his contribution to Canada, and in 2008 Manitoba declared Louis Riel Day a provincial holiday. He is now considered a Father of Confederation.",
    associatedExplorers: [
      { name: "Gabriel Dumont", relationship: "Military leader during Northwest Resistance" },
      { name: "Thomas Scott", relationship: "Executed during Red River Resistance" }
    ],
    achievements: [
      "Led the Red River Resistance (1869-70)",
      "Founded the province of Manitoba",
      "Wrote the Metis Bill of Rights",
      "Elected to Parliament three times",
      "Led the Northwest Resistance (1885)",
      "Recognized as a Father of Confederation"
    ],
    associatedLocations: [
      "Red River Settlement",
      "Fort Garry",
      "Batoche",
      "Regina",
      "St. Boniface",
      "Montana"
    ],
    activePeriodStart: 1869,
    activePeriodEnd: 1885,
    isFeatured: true
  },
  {
    name: "Gabriel Dumont",
    alternateNames: "Gabriel Dumont dit L'Etoile",
    birthYear: 1837,
    deathYear: 1906,
    nation: "Metis",
    birthPlace: "Red River Settlement",
    figureType: "metis_leader",
    role: "Metis military leader and buffalo hunt captain",
    biography: `Gabriel Dumont was one of the greatest Metis leaders and is remembered as a legendary hunter, horseman, and military tactician. Born in 1837 at the Red River Settlement, Dumont grew up on the prairies and became known as the "Prince of the Prairies" for his skills.

Dumont was captain of the buffalo hunt, a position of great responsibility that required organizing hundreds of families and coordinating the massive hunts that sustained Metis communities. He spoke six languages including Cree, Blackfoot, and English, making him invaluable as a diplomat and trader.

When the buffalo disappeared and the Metis faced dispossession of their lands in Saskatchewan, Dumont led the delegation that traveled to Montana in 1884 to bring Louis Riel back to Canada. During the Northwest Resistance of 1885, Dumont served as military commander. His guerrilla tactics at Fish Creek and Batoche were brilliant, but the Metis were ultimately defeated by overwhelming Canadian military force.

After the defeat, Dumont escaped to the United States, where he briefly joined Buffalo Bill's Wild West Show, demonstrating his legendary marksmanship. He was eventually pardoned and returned to Canada, spending his final years at Batoche. He died in 1906 and is buried there.`,
    significance: "Gabriel Dumont represents the Metis warrior tradition and the last stand of the plains Metis way of life. His military leadership during the 1885 resistance was tactically brilliant, and his skills as a hunter and horseman made him a legend. He embodies the Metis connection to the land and the buffalo, and his loyalty to Louis Riel exemplifies Metis solidarity. The Gabriel Dumont Institute in Saskatchewan is named in his honor.",
    associatedExplorers: [
      { name: "Louis Riel", relationship: "Political leader during Northwest Resistance" }
    ],
    achievements: [
      "Captain of the buffalo hunt",
      "Military commander during Northwest Resistance",
      "Won tactical victory at Fish Creek",
      "Spoke six languages",
      "Legendary hunter and marksman",
      "Escaped to United States after Batoche"
    ],
    associatedLocations: [
      "Batoche",
      "Fish Creek",
      "Duck Lake",
      "Red River Settlement",
      "Montana",
      "Saskatchewan prairies"
    ],
    activePeriodStart: 1860,
    activePeriodEnd: 1906,
    isFeatured: true
  },
  {
    name: "Cuthbert Grant",
    alternateNames: "Cuthbert Grant Jr., Warden of the Plains",
    birthYear: 1793,
    deathYear: 1854,
    nation: "Metis",
    birthPlace: "Fort Tremblante, Saskatchewan",
    figureType: "metis_leader",
    role: "Warden of the Plains and early Metis leader",
    biography: `Cuthbert Grant Jr. was one of the first prominent Metis leaders and played a crucial role in the emergence of Metis national identity. Born in 1793 at a North West Company post, Grant was the son of a Scottish NWC trader and a Metis or Cree woman. He was educated in Montreal before returning to the West.

Grant became a leader of the Metis employed by the North West Company, and in 1816 he led the Metis in the Battle of Seven Oaks (also called the Frog Plain Incident). This confrontation with the Selkirk settlers and their HBC allies resulted in the deaths of 21 settlers, including Governor Robert Semple. While the HBC portrayed this as a massacre, for the Metis it was a defining moment in their emergence as a distinct nation.

After the HBC-NWC merger in 1821, Grant gradually made peace with the settlement. In 1828, he was appointed "Warden of the Plains" by the HBC, responsible for maintaining order and mediating disputes. He founded the Metis community of Grantown (later White Horse Plain), which became a model Metis settlement.

Grant remained an important figure until his death in 1854, balancing Metis interests with the need to coexist with the growing settlement.`,
    significance: "Cuthbert Grant is significant as one of the first Metis to explicitly articulate Metis identity and lead the Metis as a nation. The Battle of Seven Oaks, though controversial, is seen by many Metis as the birth of Metis nationalism. His later role as Warden of the Plains demonstrated that Metis leaders could work within colonial structures while maintaining their distinct identity.",
    associatedExplorers: [],
    achievements: [
      "Led Metis at Battle of Seven Oaks (1816)",
      "Appointed Warden of the Plains (1828)",
      "Founded Grantown (White Horse Plain)",
      "Emerged as first major Metis political leader",
      "Maintained Metis interests during HBC-NWC merger"
    ],
    associatedLocations: [
      "Seven Oaks",
      "Grantown (White Horse Plain)",
      "Red River Settlement",
      "Fort Tremblante"
    ],
    activePeriodStart: 1812,
    activePeriodEnd: 1854,
    isFeatured: false
  },
  {
    name: "Jean-Baptiste Lagimodiere",
    alternateNames: "Jean-Baptiste Lagimodiere",
    birthYear: 1778,
    deathYear: 1855,
    nation: undefined,
    birthPlace: "Maskinonge, Quebec",
    figureType: "voyageur",
    role: "Legendary voyageur and grandfather of Louis Riel",
    biography: `Jean-Baptiste Lagimodiere was a French-Canadian voyageur and fur trader who became famous for his epic journey from the Red River to Montreal in 1815-16. Born in Quebec in 1778, Lagimodiere went west as a young man and became one of the most skilled hunters and traders in the region.

In 1805, he married Marie-Anne Gaboury, who became the first European woman to travel to the Canadian Northwest. Together they lived the life of free traders, moving between Indigenous camps and trading posts.

Lagimodiere's most famous feat came in the winter of 1815-16, when he undertook an extraordinary journey on behalf of Lord Selkirk. With the Red River Settlement under threat from the North West Company and their Metis allies, Selkirk needed to communicate with authorities in Montreal. Lagimodiere volunteered to make the 2,900 km journey on foot and snowshoe through the dead of winter. He successfully delivered Selkirk's dispatches, though he was captured briefly by NWC men near Sault Ste. Marie.

Lagimodiere and Marie-Anne settled permanently at the Red River Settlement, where they raised a large family. Their daughter Julie married Louis Riel Sr., making them the grandparents of the famous Metis leader Louis Riel.`,
    significance: "Jean-Baptiste Lagimodiere represents the French-Canadian voyageur tradition that was foundational to the fur trade and to Metis culture. His epic winter journey demonstrated the incredible endurance and wilderness skills that voyageurs possessed. As the grandfather of Louis Riel, he is part of the most famous family in Metis history.",
    associatedExplorers: [
      { name: "Lord Selkirk", relationship: "Patron who commissioned his famous journey" }
    ],
    achievements: [
      "Made epic winter journey from Red River to Montreal (1815-16)",
      "Traveled 2,900 km on foot and snowshoe",
      "Husband of Marie-Anne Gaboury, first European woman in the Northwest",
      "Grandfather of Louis Riel",
      "Skilled hunter and free trader"
    ],
    associatedLocations: [
      "Red River Settlement",
      "Maskinonge, Quebec",
      "Pembina",
      "Montreal"
    ],
    activePeriodStart: 1800,
    activePeriodEnd: 1855,
    isFeatured: false
  }
];

// ==================== PRONUNCIATION GUIDE DATA ====================

interface PronunciationData {
  term: string;
  termType: string;
  language?: string;
  phonetic: string;
  meaning?: string;
  notes?: string;
}

const pronunciations: PronunciationData[] = [
  // Indigenous Place Names
  { term: "Kisiskatchewan", termType: "indigenous_place", language: "Cree", phonetic: "kee-sis-KA-che-wan", meaning: "swift flowing river", notes: "Origin of the name Saskatchewan" },
  { term: "Athabasca", termType: "indigenous_place", language: "Cree", phonetic: "a-tha-BAS-ka", meaning: "where there are reeds", notes: "Refers to the reeds in the Athabasca delta" },
  { term: "Winnipeg", termType: "indigenous_place", language: "Cree", phonetic: "WIN-ni-peg", meaning: "muddy waters", notes: "Refers to Lake Winnipeg's sediment-rich waters" },
  { term: "Manitoba", termType: "indigenous_place", language: "Cree", phonetic: "ma-ni-TO-ba", meaning: "strait of the spirit", notes: "Refers to the sound of waves on Lake Manitoba's shores" },
  { term: "Assiniboine", termType: "indigenous_place", language: "Ojibwe/Nakota", phonetic: "a-SIN-i-boin", meaning: "stone Sioux", notes: "Name given to the Nakota people by their Ojibwe neighbors" },
  { term: "Qu'Appelle", termType: "french", language: "French", phonetic: "kwa-PEL", meaning: "who calls?", notes: "From a legend about a voice calling across the valley" },
  { term: "Portage la Prairie", termType: "french", language: "French", phonetic: "por-TAHZH la PRAY-ree", meaning: "portage of the prairie", notes: "Named for the portage between the Assiniboine River and Lake Manitoba" },
  { term: "Moose Jaw", termType: "indigenous_place", language: "Cree", phonetic: "MOOS JAW", meaning: "warm breezes", notes: "Possibly from Cree moosegaw meaning warm breezes" },
  { term: "Kaministiquia", termType: "indigenous_place", language: "Ojibwe", phonetic: "ka-min-i-STEE-kwee-a", meaning: "river with short bends", notes: "River near Thunder Bay, site of Fort William" },
  { term: "Missinaibi", termType: "indigenous_place", language: "Cree", phonetic: "miss-in-AY-bee", meaning: "picture water", notes: "Refers to pictographs on rocks along the river" },
  { term: "Michipicoten", termType: "indigenous_place", language: "Ojibwe", phonetic: "mish-i-pi-KO-ten", meaning: "big bluffs", notes: "Site of an HBC trading post on Lake Superior" },
  { term: "Timiskaming", termType: "indigenous_place", language: "Algonquin", phonetic: "ti-MIS-ka-ming", meaning: "deep water", notes: "Refers to the depth of Lake Timiskaming" },

  // Indigenous Nations
  { term: "Cree", termType: "indigenous_nation", language: "English", phonetic: "KREE", meaning: "from Kristineaux", notes: "One of the largest Indigenous nations in Canada" },
  { term: "Ojibwe", termType: "indigenous_nation", language: "English", phonetic: "oh-JIB-way", meaning: "puckered up", notes: "Also known as Ojibway, Chippewa, or Anishinaabe" },
  { term: "Anishinaabe", termType: "indigenous_nation", language: "Anishinaabemowin", phonetic: "a-nish-i-NAH-bay", meaning: "the people", notes: "The Ojibwe people's name for themselves" },
  { term: "Dene", termType: "indigenous_nation", language: "Dene", phonetic: "de-NAY", meaning: "the people", notes: "Northern Athabaskan peoples" },
  { term: "Metis", termType: "indigenous_nation", language: "French", phonetic: "may-TEE", meaning: "mixed", notes: "Distinct Indigenous nation with European and First Nations ancestry" },
  { term: "Haudenosaunee", termType: "indigenous_nation", language: "Haudenosaunee", phonetic: "ho-dee-no-SHOW-nee", meaning: "people of the longhouse", notes: "The Six Nations Confederacy, also called Iroquois" },
  { term: "Mi'kmaq", termType: "indigenous_nation", language: "Mi'kmaq", phonetic: "MEEG-maq", meaning: "the people", notes: "First Nations of the Atlantic coast" },
  { term: "Stolo", termType: "indigenous_nation", language: "Halkomelem", phonetic: "STOH-loh", meaning: "river", notes: "People of the Fraser River valley" },

  // Explorer Names
  { term: "La Verendrye", termType: "explorer", language: "French", phonetic: "la vay-rohn-DREE", meaning: undefined, notes: "Pierre Gaultier de Varennes, sieur de La Verendrye" },
  { term: "Radisson", termType: "explorer", language: "French", phonetic: "ra-dee-SON", meaning: undefined, notes: "Pierre-Esprit Radisson, co-founder of HBC" },
  { term: "Des Groseilliers", termType: "explorer", language: "French", phonetic: "day groh-zay-YAY", meaning: "of the gooseberry bushes", notes: "Medard Chouart, sieur des Groseilliers" },

  // Fur Trade Terms
  { term: "Voyageur", termType: "french", language: "French", phonetic: "vwa-ya-ZHUR", meaning: "traveler", notes: "French-Canadian canoe paddlers in the fur trade" },
  { term: "Pemmican", termType: "indigenous_place", language: "Cree", phonetic: "PEM-i-kan", meaning: "he makes grease", notes: "Preserved food essential to the fur trade" },
  { term: "Coureur des bois", termType: "french", language: "French", phonetic: "koo-RUR day BWA", meaning: "runner of the woods", notes: "Independent French-Canadian fur traders" },
  { term: "Pays d'en haut", termType: "french", language: "French", phonetic: "pay-ee don OH", meaning: "upper country", notes: "The interior beyond the St. Lawrence settlements" },
  { term: "Portage", termType: "french", language: "French", phonetic: "por-TAHZH", meaning: "to carry", notes: "Carrying canoes and goods overland between waterways" },
  { term: "Canot du maitre", termType: "french", language: "French", phonetic: "ka-NOH doo MET-ruh", meaning: "master's canoe", notes: "Large Montreal canoe, 36 feet long, crew of 8-10" },
  { term: "Canot du nord", termType: "french", language: "French", phonetic: "ka-NOH doo NOR", meaning: "northern canoe", notes: "Smaller canoe for interior rivers, 25 feet, crew of 4-6" },
  { term: "Hivernant", termType: "french", language: "French", phonetic: "ee-vair-NAHN", meaning: "winterer", notes: "Voyageur who spent winters in the interior" },
  { term: "Bourgeois", termType: "french", language: "French", phonetic: "boor-ZHWAH", meaning: "gentleman/partner", notes: "Partner or chief trader in a fur company" },
  { term: "Engage", termType: "french", language: "French", phonetic: "ohn-ga-ZHAY", meaning: "hired man", notes: "Contract laborer in the fur trade" }
];

// ==================== LESSON PLANS DATA ====================

interface LessonPlanData {
  title: string;
  description: string;
  gradeLevel: string;
  topic: string;
  estimatedMinutes: number;
  objectives: string[];
  materials?: string[];
  introduction?: string;
  mainContent: string;
  activities?: string[];
  discussionQuestions?: string[];
  assessment?: string;
  extensions?: string;
  curriculumConnections?: { subject: string; strand: string; expectation: string }[];
}

const lessonPlans: LessonPlanData[] = [
  {
    title: "The Voyageur Life",
    description: "Students will explore the daily life of voyageurs, learning about their canoe routes, the food they ate, the songs they sang, and the incredible physical demands of their work.",
    gradeLevel: "4-6",
    topic: "Fur Trade",
    estimatedMinutes: 60,
    objectives: [
      "Understand the daily life and working conditions of voyageurs",
      "Learn about the different types of canoes and their purposes",
      "Appreciate the contributions of Indigenous peoples to voyageur travel",
      "Recognize the role of voyageur songs in maintaining paddling rhythm"
    ],
    materials: [
      "Map of major fur trade routes",
      "Images of Montreal canoes and North canoes",
      "Audio recordings of traditional voyageur songs",
      "Pemmican recipe ingredients (optional)"
    ],
    introduction: "Ask students: 'What would you pack for a journey of 2,000 kilometers that you had to complete by paddling a canoe?' Explain that voyageurs were professional canoe paddlers who traveled incredible distances carrying furs and trade goods.",
    mainContent: `**Who Were the Voyageurs?**
Voyageurs were the paddlers and transporters of the fur trade, mostly French-Canadian men who moved goods and furs between Montreal and the interior posts. Their name means "travelers" in French, and they truly earned that title.

**The Two Types of Voyageurs**
1. **Mangeurs de lard** ("pork eaters") - Traveled the route from Montreal to the Grand Portage rendezvous and back in one season
2. **Hivernants** ("winterers") - Stayed in the interior year-round, traveling to more remote posts

**The Canoes**
- **Canot du maitre** (Montreal canoe) - 36 feet long, carried 3-4 tons, crew of 8-10 men
- **Canot du nord** (North canoe) - 25 feet long, for interior rivers, crew of 4-6 men
Both were made of birchbark, a technology learned from Indigenous peoples

**A Voyageur's Day**
- Wake at 3-4 AM
- Paddle 14-18 hours with brief stops
- Each man paddled 55-60 strokes per minute
- Cover 80-120 km per day
- Carry 2 "pieces" (90-pound packs) over portages
- Eat pemmican, peas, and corn porridge

**Voyageur Songs**
Songs kept time for paddling and boosted morale. Famous songs include "En roulant ma boule" and "A la claire fontaine."

**Indigenous Knowledge**
Voyageurs depended on Indigenous knowledge: birchbark canoe technology, pemmican for food, knowledge of routes and portages, and guidance through unfamiliar territory.`,
    activities: [
      "Map the voyageur route from Montreal to the Grand Portage rendezvous, identifying major portages",
      "Learn and sing a traditional voyageur song like 'En roulant ma boule'",
      "Calculate how long a journey would take at 100 km per day",
      "Make a simple pemmican recipe (dried meat, berries, fat)",
      "Try carrying a weighted backpack to understand portaging"
    ],
    discussionQuestions: [
      "Why would someone choose to become a voyageur despite the hardships?",
      "How did voyageurs depend on Indigenous peoples and their knowledge?",
      "What modern jobs might be similar to being a voyageur?",
      "Why were songs so important to voyageurs?"
    ],
    assessment: "Students create a 'Day in the Life' journal entry from a voyageur's perspective, describing their work, food, and experiences.",
    extensions: "Research a specific voyageur route and create a detailed map showing all portages and their lengths.",
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage and Identity", expectation: "Describe the contributions of various groups to Canadian society" },
      { subject: "Music", strand: "Cultural Context", expectation: "Identify the role of music in various historical and cultural contexts" }
    ]
  },
  {
    title: "Louis Riel and the Metis Nation",
    description: "Students will learn about Louis Riel, the Metis people, and the Red River Resistance, examining Riel's legacy and the ongoing significance of Metis rights in Canada.",
    gradeLevel: "7-9",
    topic: "Metis History",
    estimatedMinutes: 90,
    objectives: [
      "Understand the origins and distinct identity of the Metis people",
      "Analyze the causes and events of the Red River Resistance (1869-70)",
      "Evaluate Louis Riel's role in Manitoba's entry into Confederation",
      "Examine the controversy surrounding Riel's trial and execution",
      "Reflect on Riel's legacy and modern Metis rights"
    ],
    materials: [
      "Map of Red River Settlement",
      "Primary source excerpts from Riel's trial",
      "Timeline of Riel's life",
      "Photos of Fort Garry and Batoche"
    ],
    introduction: "Show students a Canadian five dollar bill from before 2006 (featuring Wilfred Laurier, who ordered Riel's execution) and discuss: 'Some have argued Louis Riel should be on Canadian currency. Why might that be controversial? Who was Louis Riel?'",
    mainContent: `**Who Are the Metis?**
The Metis are a distinct Indigenous nation that emerged from the unions of European fur traders (mostly French and Scottish) and First Nations women (mostly Cree and Ojibwe). By the early 1800s, the Metis had developed their own distinct culture, language (Michif), and identity centered on the Red River Settlement.

**Metis Culture**
- The Metis sash and flag
- The Red River cart
- Metis fiddle music and jigging
- The buffalo hunt
- Michif language (mix of French and Cree)

**The Red River Settlement**
By 1869, about 12,000 people lived at Red River, most of them Metis. They had their own system of river lot farms, their own economy based on the buffalo hunt and the fur trade, and their own government.

**The Crisis of 1869**
When Canada purchased Rupert's Land from the Hudson's Bay Company:
- The Metis were not consulted
- Canadian surveyors arrived and began measuring land
- The Metis feared losing their lands and way of life

**Louis Riel's Leadership**
- Formed the National Committee of the Metis
- Established a provisional government
- Created the Metis Bill of Rights
- Negotiated Manitoba's entry into Confederation
- Ordered the execution of Thomas Scott (controversial)

**The Metis Bill of Rights**
Demanded protection for:
- French language and Catholic schools
- Metis land rights
- Representative government

**Exile and Return**
- Riel fled to the United States
- Elected to Parliament 3 times but could not take his seat
- Returned in 1884 to lead the Northwest Resistance
- Defeated at Batoche in 1885

**Trial and Execution**
- Tried for treason
- Defense argued insanity; Riel insisted on his sanity
- Found guilty and hanged November 16, 1885
- His execution divided Canada along French-English lines

**Modern Legacy**
- Recognized as a Father of Confederation
- Louis Riel Day holiday in Manitoba
- Ongoing Metis land claims and rights cases`,
    activities: [
      "Analyze primary sources from Riel's trial and debate whether the verdict was just",
      "Create a timeline of key events from 1869 to 1885",
      "Compare the Metis Bill of Rights to the Canadian Charter of Rights",
      "Research modern Metis organizations and rights issues"
    ],
    discussionQuestions: [
      "Was Louis Riel a traitor or a hero? Can he be both?",
      "How might events have unfolded differently if Canada had consulted the Metis in 1869?",
      "Why did Riel insist on his sanity at trial, even though an insanity defense might have saved his life?",
      "What do modern Metis communities want the rest of Canada to understand about their history?"
    ],
    assessment: "Write a persuasive essay arguing whether Louis Riel should receive a posthumous pardon, using evidence from primary and secondary sources.",
    extensions: "Research the Daniels case (2016 Supreme Court decision) and its implications for Metis rights today.",
    curriculumConnections: [
      { subject: "History", strand: "Canada 1850-1914", expectation: "Explain key factors that led to the Red River and Northwest Resistances" },
      { subject: "Civics", strand: "Citizenship", expectation: "Analyze diverse perspectives on issues of civic importance" }
    ]
  },
  {
    title: "Women of the Fur Trade",
    description: "Students will discover the crucial but often overlooked roles that Indigenous and Metis women played in the fur trade, from making pemmican to serving as interpreters and diplomats.",
    gradeLevel: "7-9",
    topic: "Women's History",
    estimatedMinutes: 60,
    objectives: [
      "Recognize the essential contributions of Indigenous and Metis women to the fur trade",
      "Learn about specific notable women such as Thanadelthur, Charlotte Small, and Marie-Anne Gaboury",
      "Understand the concept of 'country marriages' and their significance",
      "Analyze why women's contributions were often overlooked in historical records"
    ],
    materials: [
      "Biographies of notable women",
      "Images of fur trade life",
      "Excerpts from fur trade journals mentioning women"
    ],
    introduction: "Ask students to brainstorm what jobs were essential in the fur trade. Record their answers. Then ask: 'Who do you think did most of this work?' Explain that women's contributions were essential but often unrecorded.",
    mainContent: `**Why Women Were Essential**
The fur trade could not have functioned without Indigenous and Metis women. They provided:
- Essential skills (making pemmican, preparing hides, making moccasins and snowshoes)
- Cultural knowledge and language skills
- Diplomatic connections between traders and Indigenous nations
- Family stability that encouraged long-term trading relationships

**Country Marriages**
"Country marriages" or marriages "a la facon du pays" (in the custom of the country) were unions between European traders and Indigenous women. These marriages:
- Were recognized by Indigenous communities
- Created trading alliances
- Provided women's labor essential to post operations
- Eventually led to the emergence of the Metis nation

**Thanadelthur (c. 1697-1717)**
A Chipewyan woman who:
- Escaped Cree captivity
- Walked to York Factory in winter
- Brokered peace between Cree and Chipewyan nations
- Opened the northern fur trade
- Died at only about 20 years old, already a legend

**Charlotte Small (1785-1857)**
- Metis wife of David Thompson
- Traveled over 10,000 miles with her husband
- Served as interpreter and cultural broker
- Raised 13 children, many born during expeditions
- Made Thompson's cartographic work possible

**Marie-Anne Gaboury (1780-1875)**
- First European woman to travel to the Northwest
- Grandmother of Louis Riel
- Lived to 95, witnessing the transformation of the West

**Women's Work at Trading Posts**
- Processing furs and hides
- Making pemmican (the food that fueled the trade)
- Sewing moccasins and snowshoes
- Interpreting and translating
- Raising children who became the Metis nation`,
    activities: [
      "Create a biographical poster about one notable woman of the fur trade",
      "Research and make a list of all the skills women contributed to the fur trade",
      "Analyze why these contributions were often left out of historical records",
      "Write a diary entry from the perspective of a woman at a trading post"
    ],
    discussionQuestions: [
      "Why were women's contributions to the fur trade often not recorded in written history?",
      "How did country marriages benefit both Indigenous communities and European traders?",
      "What might we be missing about other historical periods because women's work was not recorded?",
      "How can we learn about people whose stories were not written down?"
    ],
    assessment: "Students research one notable woman of the fur trade and create a presentation arguing why she should be better known.",
    extensions: "Research modern Indigenous women leaders and compare their challenges to those faced by women in the fur trade era."
  },
  {
    title: "Mapping Canada: The Work of David Thompson",
    description: "Students will learn about David Thompson, one of history's greatest mapmakers, and understand the techniques and challenges of surveying in the early 19th century.",
    gradeLevel: "10-12",
    topic: "Cartography",
    estimatedMinutes: 90,
    objectives: [
      "Understand the significance of David Thompson's cartographic achievements",
      "Learn basic surveying and navigation techniques used in the early 19th century",
      "Appreciate the role of Charlotte Small and Indigenous guides in Thompson's work",
      "Compare Thompson's maps to modern satellite imagery"
    ],
    materials: [
      "Copies of Thompson's maps",
      "Modern maps of the same regions",
      "Compass and protractor",
      "Star charts"
    ],
    introduction: "Show students a satellite image of North America and then Thompson's map of the same region. Ask: 'This map was made without satellites, airplanes, or even photographs. How accurate do you think it is?' Reveal that Thompson's maps are remarkably accurate.",
    mainContent: `**Who Was David Thompson?**
David Thompson (1770-1857) is often called "the greatest land geographer who ever lived." Born in London, he came to Canada as a Hudson's Bay Company apprentice at age 14. He mapped over 3.9 million square kilometers of North America with remarkable accuracy.

**Thompson's Training**
Thompson learned surveying and navigation from HBC surveyor Philip Turnor. He mastered:
- Celestial navigation (using stars to determine location)
- Dead reckoning (calculating position from direction and distance traveled)
- Compass surveying
- Trigonometric calculations

**His Instruments**
- Sextant (for measuring angles to stars)
- Compass
- Chronometer (accurate clock)
- Thermometer
- Log books

**How Thompson Mapped**
Every night (weather permitting), Thompson would:
1. Take readings of star positions with his sextant
2. Record the time with his chronometer
3. Calculate latitude and longitude
4. Note landmarks, rivers, and Indigenous place names
5. Estimate distances traveled during the day

**Charlotte Small's Contribution**
Thompson's Metis wife Charlotte was essential:
- Served as interpreter with Indigenous peoples
- Helped maintain relations that allowed safe travel
- Cared for family during wilderness journeys
- Traveled over 10,000 miles with Thompson

**Thompson's Major Achievements**
- Mapped the entire Columbia River from source to sea
- Discovered the Athabasca Pass through the Rockies
- Created the first accurate map of western Canada
- His maps were used for over 100 years

**His Great Map**
After retiring, Thompson spent 10 years creating a master map 10 feet wide showing all his surveys. This map remained the most accurate depiction of western North America for decades.`,
    activities: [
      "Use a compass to determine direction and estimate distances on the school grounds",
      "Compare Thompson's maps to Google Earth for the same regions",
      "Calculate latitude using the angle of the North Star (demonstration)",
      "Plot a simple map of the classroom using Thompson's techniques"
    ],
    discussionQuestions: [
      "Why is Thompson relatively unknown compared to other explorers?",
      "How did Thompson's relationship with Indigenous peoples differ from other explorers?",
      "What modern technologies have replaced Thompson's surveying methods?",
      "Why was accurate mapping so important to the fur trade companies?"
    ],
    assessment: "Create a map of the local area using only a compass, pacing, and observation, then compare it to an actual map.",
    extensions: "Research modern surveying and GIS technology, and explain how it improves on Thompson's methods."
  },
  {
    title: "The Hudson's Bay Company: From Fur Trade to Modern Retail",
    description: "Students will trace the history of the Hudson's Bay Company from its founding in 1670 to its role as a modern retailer, understanding how the fur trade shaped Canada.",
    gradeLevel: "4-6",
    topic: "Fur Trade",
    estimatedMinutes: 45,
    objectives: [
      "Understand when and why the Hudson's Bay Company was founded",
      "Learn how trading posts operated and how Indigenous peoples participated",
      "Discover the 'Made Beaver' currency system",
      "Trace the company's evolution from fur trader to department store"
    ],
    materials: [
      "Map of HBC territory (Rupert's Land)",
      "Images of trading posts and trade goods",
      "Reproduction Made Beaver tokens",
      "HBC Point Blanket (or image)"
    ],
    introduction: "Show students the Hudson's Bay Company striped blanket or logo. Ask if anyone recognizes it. Explain that the company that makes these blankets is older than Canada itself!",
    mainContent: `**The Birth of the HBC**
In 1670, King Charles II of England gave a charter to the "Governor and Company of Adventurers of England Trading into Hudson's Bay" - we call it the Hudson's Bay Company or HBC.

**What They Got**
The charter gave the company control over all lands draining into Hudson Bay - almost 40% of modern Canada! This huge territory was called Rupert's Land.

**How the Trade Worked**
At first, the HBC built posts on the shores of Hudson Bay and waited for Indigenous trappers to bring furs to them. This was different from the French, who traveled into the interior.

**Indigenous Traders**
- Cree and other nations trapped animals and prepared furs
- They traveled great distances to bring furs to the posts
- They received trade goods in exchange
- Some became "trading chiefs" who organized large brigades

**Made Beaver Currency**
The HBC invented a clever system:
- One prime beaver pelt = 1 "Made Beaver" (MB)
- All trade goods were priced in Made Beaver
- Example: 1 blanket = 7 MB, 1 gun = 14 MB
- Even coins were made to represent Made Beaver

**What Indigenous People Traded For**
- Metal tools (knives, kettles, axes)
- Blankets and cloth
- Beads and decorative items
- Guns and ammunition
- Tea and tobacco

**Famous Trading Posts**
- York Factory - The most important HBC post
- Moose Factory - One of the oldest
- Fort Garry - Site of modern Winnipeg

**From Furs to Stores**
In 1870, the HBC sold Rupert's Land to Canada. The company then:
- Opened general stores across the West
- Became a department store chain
- Still operates The Bay stores today

**The Point Blanket**
The HBC Point Blanket (with its colored stripes) was first traded in 1779 and is still made today - over 240 years later!`,
    activities: [
      "Play a trading post simulation where students trade 'Made Beaver' tokens for goods",
      "Calculate how many beaver pelts would be needed to buy various trade goods",
      "Color a map showing the extent of Rupert's Land",
      "Design your own trading post, deciding what goods to stock and why"
    ],
    discussionQuestions: [
      "Why did Indigenous peoples want European trade goods?",
      "Was the trade fair? Why or why not?",
      "How did the fur trade change Indigenous peoples' lives?",
      "Why do you think the Hudson's Bay Company is still around after 350 years?"
    ],
    assessment: "Write a short story about a day at a trading post from the perspective of either a trader or an Indigenous person bringing furs.",
    extensions: "Research what happened to one specific trading post (like York Factory or Moose Factory) and create a timeline of its history."
  }
];

// ==================== COMPARISON TEMPLATES DATA ====================

interface ComparisonTemplateData {
  title: string;
  description: string;
  comparisonType: string;
  items: unknown;
  criteria: unknown;
  analysisPrompts?: string[];
  gradeLevel: string;
}

const comparisonTemplates: ComparisonTemplateData[] = [
  {
    title: "Hudson's Bay Company vs North West Company",
    description: "Compare the two great fur trading rivals that shaped Canadian history, examining their strategies, routes, treatment of employees, and relationships with Indigenous peoples.",
    comparisonType: "trade_companies",
    items: [
      {
        name: "Hudson's Bay Company",
        founded: "1670",
        headquarters: "London, England (operations at York Factory)",
        strategy: "Stay at bay posts, let trappers come to them",
        employees: "Mostly Orkney Scots, strict hierarchy",
        merger: "Absorbed NWC in 1821"
      },
      {
        name: "North West Company",
        founded: "1779",
        headquarters: "Montreal",
        strategy: "Go into the interior, compete aggressively",
        employees: "French-Canadian voyageurs, partnership model",
        merger: "Merged into HBC in 1821"
      }
    ],
    criteria: [
      { criterion: "Founding", description: "When was each company founded and under what circumstances?" },
      { criterion: "Trade Strategy", description: "How did each company approach getting furs?" },
      { criterion: "Transportation", description: "What routes and methods did they use?" },
      { criterion: "Workforce", description: "Who worked for each company and how were they treated?" },
      { criterion: "Indigenous Relations", description: "How did each company interact with Indigenous peoples?" },
      { criterion: "Geographic Reach", description: "Where did each company operate?" }
    ],
    analysisPrompts: [
      "Why did the NWC strategy of going into the interior eventually force the HBC to do the same?",
      "How did the different workforce models affect company culture?",
      "What factors led to the NWC's eventual absorption into the HBC?",
      "Which company had better relations with Indigenous peoples, and why?"
    ],
    gradeLevel: "7-9"
  },
  {
    title: "European vs Indigenous Perspectives on Land",
    description: "Examine the fundamentally different ways that European colonizers and Indigenous peoples understood land ownership, use, and relationships with the natural world.",
    comparisonType: "perspectives",
    items: [
      {
        perspective: "European/Colonial",
        concepts: [
          "Land as property to be owned",
          "Individual or corporate ownership",
          "Resources to be extracted",
          "Surveying and mapping to define boundaries",
          "Unused land is wasted land"
        ]
      },
      {
        perspective: "Indigenous",
        concepts: [
          "Land as relative, not property",
          "Collective stewardship",
          "Resources to be respected and used sustainably",
          "Boundaries defined by use and relationship",
          "Land has intrinsic value, not just utility"
        ]
      }
    ],
    criteria: [
      { criterion: "Ownership", description: "Can land be owned? By whom?" },
      { criterion: "Use Rights", description: "Who can use land and for what purposes?" },
      { criterion: "Boundaries", description: "How are territories defined?" },
      { criterion: "Resources", description: "How should natural resources be used?" },
      { criterion: "Relationship", description: "What is the human relationship to land?" }
    ],
    analysisPrompts: [
      "How did these different perspectives lead to conflict during the fur trade and settlement periods?",
      "Why did Europeans often claim Indigenous peoples 'weren't using' the land?",
      "How do these different perspectives still cause conflict today?",
      "What can we learn from Indigenous land relationships for addressing environmental challenges?"
    ],
    gradeLevel: "10-12"
  },
  {
    title: "River Routes: St. Lawrence vs Hudson Bay",
    description: "Compare the two main trade route systems used to access the interior of North America during the fur trade era.",
    comparisonType: "trade_routes",
    items: [
      {
        route: "St. Lawrence Route",
        users: "French traders, then North West Company",
        startPoint: "Montreal",
        mainRoute: "Ottawa River to Lake Nipissing to Georgian Bay to Lake Superior",
        rendezvous: "Grand Portage, then Fort William",
        advantages: "Closer to interior, direct contact with trappers",
        disadvantages: "Many portages, longer travel time, expensive"
      },
      {
        route: "Hudson Bay Route",
        users: "Hudson's Bay Company",
        startPoint: "York Factory",
        mainRoute: "Hayes River to Norway House to Lake Winnipeg to interior",
        rendezvous: "York Factory, later Norway House",
        advantages: "Shorter ocean voyage from England, fewer portages",
        disadvantages: "Bay frozen 8 months, required Indigenous trappers to travel far"
      }
    ],
    criteria: [
      { criterion: "Geographic Advantages", description: "What made each route appealing?" },
      { criterion: "Challenges", description: "What obstacles did traders face on each route?" },
      { criterion: "Season", description: "When could each route be used?" },
      { criterion: "Cost", description: "What were the expenses of each route?" },
      { criterion: "Speed", description: "How long did journeys take?" }
    ],
    analysisPrompts: [
      "Why did the competition between these routes shape the geography of the fur trade?",
      "How did the merger of the HBC and NWC in 1821 affect these routes?",
      "What role did Indigenous geographical knowledge play in developing these routes?",
      "How do these historic routes compare to modern transportation corridors?"
    ],
    gradeLevel: "7-9"
  },
  {
    title: "David Thompson vs Alexander Mackenzie",
    description: "Compare two of the greatest explorers of western North America, examining their achievements, methods, and lasting legacies.",
    comparisonType: "explorers",
    items: [
      {
        name: "David Thompson",
        dates: "1770-1857",
        background: "London orphan, HBC apprentice, later NWC partner",
        majorAchievements: "Mapped 3.9 million km2, first to navigate entire Columbia River",
        methods: "Meticulous astronomical observations and surveying",
        legacy: "His maps remained standard for 100 years"
      },
      {
        name: "Alexander Mackenzie",
        dates: "1764-1820",
        background: "Scottish immigrant, NWC partner",
        majorAchievements: "First to cross North America (1793), reached Arctic Ocean (1789)",
        methods: "Speed and determination, less scientific precision",
        legacy: "Knighted, proved transcontinental crossing possible"
      }
    ],
    criteria: [
      { criterion: "Goal", description: "What were each explorer's main objectives?" },
      { criterion: "Method", description: "How did they approach exploration?" },
      { criterion: "Indigenous Relations", description: "How did they work with Indigenous peoples?" },
      { criterion: "Documentation", description: "How well did they record their travels?" },
      { criterion: "Recognition", description: "How were they recognized in their time and later?" }
    ],
    analysisPrompts: [
      "Why is Mackenzie more famous than Thompson, despite Thompson's greater achievements?",
      "How did their different approaches to exploration affect their results?",
      "What role did Indigenous guides and knowledge play in each explorer's journeys?",
      "Whose contributions had a greater long-term impact on Canada?"
    ],
    gradeLevel: "7-9"
  }
];

// ==================== TIMELINE EVENTS DATA ====================

interface TimelineEventData {
  title: string;
  description: string;
  year: number;
  month?: number;
  day?: number;
  endYear?: number;
  isApproximate: boolean;
  theme: string;
  importance: string;
}

const timelineEvents: TimelineEventData[] = [
  {
    title: "Hudson's Bay Company Charter Granted",
    description: "King Charles II grants a royal charter to the 'Governor and Company of Adventurers of England Trading into Hudson's Bay,' giving them control over all lands draining into Hudson Bay - nearly 40% of modern Canada.",
    year: 1670,
    month: 5,
    day: 2,
    isApproximate: false,
    theme: "fur_trade",
    importance: "major"
  },
  {
    title: "Thanadelthur Captured by Cree Raiders",
    description: "A young Chipewyan woman named Thanadelthur is captured by Cree raiders. Her eventual escape and journey to York Factory will lead to one of the most important diplomatic missions in fur trade history.",
    year: 1713,
    isApproximate: true,
    theme: "indigenous",
    importance: "normal"
  },
  {
    title: "Thanadelthur's Peace Mission",
    description: "Thanadelthur brokers peace between the Cree and Chipewyan nations, opening the northern fur trade. Her diplomatic skills earn the admiration of HBC Governor James Knight.",
    year: 1715,
    month: 11,
    isApproximate: false,
    theme: "indigenous",
    importance: "major"
  },
  {
    title: "La Verendrye Reaches Lake Winnipeg",
    description: "Pierre Gaultier de Varennes, sieur de La Verendrye, reaches Lake Winnipeg, opening French exploration and trade into the western interior and challenging HBC dominance.",
    year: 1733,
    isApproximate: true,
    theme: "exploration",
    importance: "major"
  },
  {
    title: "Cumberland House Founded",
    description: "Samuel Hearne establishes Cumberland House, the first inland trading post of the Hudson's Bay Company. This marks a shift from the HBC's strategy of waiting at the bay to actively competing in the interior.",
    year: 1774,
    isApproximate: false,
    theme: "fur_trade",
    importance: "major"
  },
  {
    title: "North West Company Formed",
    description: "Montreal fur traders formally organize the North West Company, creating a powerful rival to the Hudson's Bay Company that will dominate the interior fur trade for nearly 40 years.",
    year: 1779,
    isApproximate: false,
    theme: "fur_trade",
    importance: "major"
  },
  {
    title: "Mackenzie Reaches Arctic Ocean",
    description: "Alexander Mackenzie reaches the Arctic Ocean via the river that will bear his name, becoming the first European to do so. He had hoped to reach the Pacific.",
    year: 1789,
    month: 7,
    day: 14,
    isApproximate: false,
    theme: "exploration",
    importance: "major"
  },
  {
    title: "Mackenzie Reaches Pacific Ocean",
    description: "Alexander Mackenzie completes the first transcontinental crossing of North America north of Mexico, reaching the Pacific Ocean at Bella Coola. He paints on a rock: 'from Canada, by land.'",
    year: 1793,
    month: 7,
    day: 22,
    isApproximate: false,
    theme: "exploration",
    importance: "major"
  },
  {
    title: "Simon Fraser Descends Fraser River",
    description: "Simon Fraser navigates the treacherous river that will bear his name from the Rocky Mountains to the Pacific, proving it is not the Columbia River as hoped.",
    year: 1808,
    month: 7,
    day: 2,
    isApproximate: false,
    theme: "exploration",
    importance: "major"
  },
  {
    title: "David Thompson Reaches Pacific via Columbia",
    description: "David Thompson completes his navigation of the Columbia River from its source to its mouth at the Pacific Ocean, becoming the first European to travel its entire length.",
    year: 1811,
    month: 7,
    day: 15,
    isApproximate: false,
    theme: "exploration",
    importance: "major"
  },
  {
    title: "Battle of Seven Oaks",
    description: "Metis under Cuthbert Grant clash with Selkirk settlers at Seven Oaks (near present-day Winnipeg), killing Governor Robert Semple and 20 others. This event becomes central to Metis national identity.",
    year: 1816,
    month: 6,
    day: 19,
    isApproximate: false,
    theme: "settlement",
    importance: "major"
  },
  {
    title: "HBC and NWC Merge",
    description: "After decades of fierce rivalry, the Hudson's Bay Company absorbs the North West Company. The merged company retains the HBC name and charter but adopts many NWC practices and personnel.",
    year: 1821,
    isApproximate: false,
    theme: "fur_trade",
    importance: "major"
  },
  {
    title: "Red River Resistance Begins",
    description: "Louis Riel and the Metis form the National Committee of the Metis to resist the Canadian government's takeover of Rupert's Land without consulting the local population.",
    year: 1869,
    month: 10,
    isApproximate: false,
    theme: "settlement",
    importance: "major"
  },
  {
    title: "Manitoba Becomes a Province",
    description: "The Manitoba Act creates the province of Manitoba, incorporating many demands from the Metis Bill of Rights including French language rights and land grants for Metis families.",
    year: 1870,
    month: 7,
    day: 15,
    isApproximate: false,
    theme: "settlement",
    importance: "major"
  },
  {
    title: "Northwest Resistance",
    description: "Louis Riel returns to lead the Metis and their First Nations allies in resistance against the Canadian government in Saskatchewan. Battles occur at Duck Lake, Fish Creek, and Batoche.",
    year: 1885,
    month: 3,
    endYear: 1885,
    isApproximate: false,
    theme: "settlement",
    importance: "major"
  },
  {
    title: "Louis Riel Executed",
    description: "Louis Riel is hanged in Regina for treason. His execution divides Canada along French-English lines and remains controversial to this day. He is now recognized as a Father of Confederation.",
    year: 1885,
    month: 11,
    day: 16,
    isApproximate: false,
    theme: "settlement",
    importance: "major"
  }
];

// ==================== VIRTUAL FIELD TRIP DATA ====================

interface FieldTripStopData {
  orderIndex: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  funFact?: string;
  thinkQuestion?: string;
}

interface VirtualFieldTripData {
  title: string;
  description: string;
  gradeLevel: string;
  estimatedMinutes: number;
  theme: string;
  stops: FieldTripStopData[];
}

const virtualFieldTrips: VirtualFieldTripData[] = [
  {
    title: "York Factory: Gateway to the West",
    description: "Explore York Factory, the most important trading post in the Hudson's Bay Company's empire. For nearly 200 years, this remote post at the mouth of the Hayes River was the gateway between Europe and the Canadian interior.",
    gradeLevel: "4-6",
    estimatedMinutes: 30,
    theme: "fur_trade",
    stops: [
      {
        orderIndex: 0,
        title: "Arriving by Ship from England",
        description: "Imagine arriving at York Factory after a two-month voyage across the Atlantic Ocean. Your ship has navigated through the ice of Hudson Bay to reach this remote outpost. As you approach, you see the white-painted depot building rising above the flat, marshy landscape. This is where trade goods from England - blankets, kettles, guns, and beads - will be unloaded and stored.",
        latitude: 57.0047,
        longitude: -92.3016,
        funFact: "Ships could only reach York Factory for about three months each year because Hudson Bay freezes solid in winter!",
        thinkQuestion: "How would you feel arriving at such a remote place after months at sea?"
      },
      {
        orderIndex: 1,
        title: "The Depot Building",
        description: "The massive wooden Depot building is the heart of York Factory. Three stories tall and built on stilts to protect against permafrost and flooding, it stored everything the fur trade needed: trade goods waiting to go into the interior and furs waiting to be shipped to England. At its peak, tens of thousands of beaver pelts were stored here each year.",
        latitude: 57.0050,
        longitude: -92.3010,
        funFact: "The Depot building is the largest wooden structure remaining from the fur trade era and is now a National Historic Site.",
        thinkQuestion: "Why do you think they built the building on stilts?"
      },
      {
        orderIndex: 2,
        title: "The Trading Room",
        description: "Step inside the trading room where furs were exchanged for goods. The room has a counter separating the trader from the Indigenous customers. Furs were graded here - prime beaver pelts were worth the most. Everything had a value in 'Made Beaver.' A gun might cost 14 Made Beaver, while a blanket was 7.",
        latitude: 57.0048,
        longitude: -92.3008,
        funFact: "A 'Made Beaver' was a prime beaver pelt. The HBC even made coins called 'Made Beaver tokens' for trade.",
        thinkQuestion: "If you were an Indigenous trader, what goods would you most want to trade for?"
      },
      {
        orderIndex: 3,
        title: "The Warehouse",
        description: "In the warehouse, furs are sorted, pressed into bales, and prepared for the long voyage to England. Each bale weighs about 90 pounds - the same weight that a voyageur would carry over portages. From here, the furs will travel to London, where they'll be sold at auction to hatmakers who turn beaver fur into fashionable felt hats.",
        latitude: 57.0045,
        longitude: -92.3020,
        funFact: "Beaver hats were so fashionable in Europe that over 100,000 pelts were shipped from York Factory every year at the peak of the trade.",
        thinkQuestion: "How did fashion in Europe affect the lives of beavers and Indigenous peoples in Canada?"
      },
      {
        orderIndex: 4,
        title: "The Cemetery",
        description: "The small cemetery at York Factory tells the story of those who lived and died here. Grave markers record the names of HBC employees, their wives, and children. Life was hard at York Factory - the climate was harsh, diseases spread easily, and medical care was limited. Yet some chose to spend their entire lives here.",
        latitude: 57.0060,
        longitude: -92.3030,
        funFact: "The permafrost at York Factory means that coffins were buried above ground in wooden vaults because the ground was too frozen to dig.",
        thinkQuestion: "What would make someone choose to spend their life in such a remote and difficult place?"
      },
      {
        orderIndex: 5,
        title: "Departure by York Boat",
        description: "Watch as a brigade of York boats prepares to depart for the interior. These sturdy boats, about 40 feet long, were the workhorses of the HBC. Each boat carried about 6 tons of cargo and was rowed by a crew of 8 men. The brigade will travel up the Hayes River to Norway House, then spread out across the interior to deliver trade goods and collect furs.",
        latitude: 57.0040,
        longitude: -92.3040,
        funFact: "York boats were named after York Factory and were designed to handle both the calm waters of lakes and the rapids of rivers.",
        thinkQuestion: "How is traveling by York boat different from traveling by canoe? Why might the HBC prefer boats to canoes?"
      }
    ]
  }
];

// ==================== ADDITIONAL LOCATIONS DATA ====================

interface LocationData {
  name: string;
  indigenousName?: string;
  indigenousLanguage?: string;
  description: string;
  latitude: number;
  longitude: number;
  locationType: string;
  yearEstablished?: number;
  historicalNotes?: string;
}

const additionalLocations: LocationData[] = [
  {
    name: "Moose Factory",
    indigenousName: "Moose Factory",
    indigenousLanguage: "Cree",
    description: "One of the oldest English settlements in Canada, established by the Hudson's Bay Company on an island in the Moose River near its mouth at James Bay.",
    latitude: 51.2578,
    longitude: -80.6087,
    locationType: "Trading Post",
    yearEstablished: 1673,
    historicalNotes: "Moose Factory is the second oldest English settlement in Ontario (after Fort Albany). It served as the HBC's main post on James Bay and remains an active community today. The historic site includes the Centennial Museum housed in a former HBC staff house."
  },
  {
    name: "Fort Albany",
    indigenousName: "Kashechewan",
    indigenousLanguage: "Cree",
    description: "The oldest English settlement in Ontario, established at the mouth of the Albany River on James Bay.",
    latitude: 52.2500,
    longitude: -81.5833,
    locationType: "Fort",
    yearEstablished: 1679,
    historicalNotes: "Fort Albany changed hands between the English and French several times during the colonial wars. It was captured by the French in 1686 but eventually became permanently British. The post was crucial for trade with the Cree peoples of the western James Bay region."
  },
  {
    name: "Norway House",
    indigenousName: "Kinosew Sipi",
    indigenousLanguage: "Cree",
    description: "Major HBC trading post and administrative center located at the northern outlet of Lake Winnipeg, serving as the crossroads of the western fur trade.",
    latitude: 53.9828,
    longitude: -97.8397,
    locationType: "Trading Post",
    yearEstablished: 1814,
    historicalNotes: "Norway House took its name from the Norwegian boat builders who were brought here to construct York boats. It became the administrative headquarters for the HBC's Northern Department and the site where Treaty 5 was negotiated in 1875. The historic site is now a National Historic Site of Canada."
  },
  {
    name: "Lower Fort Garry",
    indigenousName: undefined,
    indigenousLanguage: undefined,
    description: "A stone fort built north of Upper Fort Garry on the Red River, now the best-preserved stone fur trade fort in North America.",
    latitude: 50.1135,
    longitude: -96.9824,
    locationType: "Fort",
    yearEstablished: 1830,
    historicalNotes: "Lower Fort Garry was built as a secure depot away from the flooding that plagued Upper Fort Garry. It never became the administrative center it was intended to be, but the stone walls that were a liability in 1869 (during the Red River Resistance) make it invaluable today as the best-preserved example of a fur trade era fort."
  },
  {
    name: "Upper Fort Garry",
    indigenousName: "The Forks",
    indigenousLanguage: undefined,
    description: "The main Hudson's Bay Company fort at the junction of the Red and Assiniboine rivers, which became the nucleus of modern Winnipeg.",
    latitude: 49.8844,
    longitude: -97.1348,
    locationType: "Fort",
    yearEstablished: 1822,
    historicalNotes: "Upper Fort Garry was the center of the Red River Settlement and later the site of Louis Riel's provisional government during the Red River Resistance of 1869-70. Most of the fort was demolished in the 1880s, but the Governor's Gate survives in downtown Winnipeg. The Forks, where the rivers meet, was a gathering place for 6,000 years before European contact."
  },
  {
    name: "Batoche",
    indigenousName: "Batoche",
    indigenousLanguage: "Michif",
    description: "The Metis settlement and battlefield on the South Saskatchewan River that was the political and military center of the Northwest Resistance of 1885.",
    latitude: 52.7558,
    longitude: -106.1075,
    locationType: "Settlement",
    yearEstablished: 1872,
    historicalNotes: "Batoche was established by Metis settlers fleeing the changing conditions in Manitoba. It became the headquarters of Louis Riel's provisional government in 1885. The Battle of Batoche (May 9-12, 1885) ended the Northwest Resistance. Gabriel Dumont is buried here. The site is now a National Historic Site."
  },
  {
    name: "Fort Carlton",
    indigenousName: undefined,
    indigenousLanguage: undefined,
    description: "A Hudson's Bay Company post on the North Saskatchewan River that served as a key provisioning post and the site of Treaty 6 negotiations.",
    latitude: 52.8500,
    longitude: -106.3333,
    locationType: "Fort",
    yearEstablished: 1795,
    historicalNotes: "Fort Carlton was strategically located where the Carlton Trail crossed the North Saskatchewan River. It was a major provisioning post where pemmican from the buffalo hunt was collected. Treaty 6 was signed here in 1876. The fort was burned during the Northwest Resistance of 1885 but has been reconstructed."
  },
  {
    name: "Fort Chipewyan",
    indigenousName: "K'ai Taile",
    indigenousLanguage: "Dene",
    description: "Gateway to the Mackenzie River system and one of the oldest continuously occupied European settlements in Alberta.",
    latitude: 58.7181,
    longitude: -111.1519,
    locationType: "Fort",
    yearEstablished: 1788,
    historicalNotes: "Founded by the North West Company, Fort Chipewyan was the starting point for Alexander Mackenzie's expeditions to both the Arctic (1789) and Pacific (1793) oceans. It remains an active community today, accessible only by air or water/ice road."
  }
];

// ==================== MAIN SEED FUNCTION ====================

export async function seedComprehensive(): Promise<void> {
  console.log("Starting comprehensive seed update for Fur Trade History app...\n");

  try {
    // Get river type ID
    const riverType = await prisma.waterwayType.findUnique({
      where: { name: "River" }
    });

    if (!riverType) {
      console.log("Creating River waterway type...");
      await prisma.waterwayType.create({
        data: { name: "River" }
      });
    }

    const riverTypeId = (await prisma.waterwayType.findUnique({ where: { name: "River" } }))?.id;

    if (!riverTypeId) {
      throw new Error("Failed to get or create River type");
    }

    // ==================== SEED RIVERS ====================
    console.log("\n=== Seeding Missing River Systems ===");

    for (const river of missingRivers) {
      const existing = await prisma.waterway.findFirst({
        where: { name: river.name }
      });

      if (existing) {
        console.log(`  Updating: ${river.name}`);
        await prisma.waterway.update({
          where: { id: existing.id },
          data: {
            ...river,
            typeId: riverTypeId
          }
        });
      } else {
        console.log(`  Creating: ${river.name}`);
        await prisma.waterway.create({
          data: {
            ...river,
            typeId: riverTypeId
          }
        });
      }
    }
    console.log(`Seeded ${missingRivers.length} river systems.`);

    // ==================== SEED NOTABLE FIGURES ====================
    console.log("\n=== Seeding Metis Figures (including Louis Riel) ===");

    for (const figure of metisFigures) {
      const existing = await prisma.notableFigure.findFirst({
        where: { name: figure.name }
      });

      const figureData = {
        name: figure.name,
        alternateNames: figure.alternateNames || null,
        birthYear: figure.birthYear || null,
        deathYear: figure.deathYear || null,
        nation: figure.nation || null,
        birthPlace: figure.birthPlace || null,
        figureType: figure.figureType,
        role: figure.role,
        biography: figure.biography,
        significance: figure.significance,
        associatedExplorers: figure.associatedExplorers ? JSON.stringify(figure.associatedExplorers) : null,
        achievements: figure.achievements ? JSON.stringify(figure.achievements) : null,
        associatedLocations: figure.associatedLocations ? JSON.stringify(figure.associatedLocations) : null,
        activePeriodStart: figure.activePeriodStart || null,
        activePeriodEnd: figure.activePeriodEnd || null,
        imageUrl: figure.imageUrl || null,
        isFeatured: figure.isFeatured
      };

      if (existing) {
        console.log(`  Updating: ${figure.name}`);
        await prisma.notableFigure.update({
          where: { id: existing.id },
          data: figureData
        });
      } else {
        console.log(`  Creating: ${figure.name}`);
        await prisma.notableFigure.create({
          data: figureData
        });
      }
    }
    console.log(`Seeded ${metisFigures.length} Metis figures.`);

    // ==================== SEED PRONUNCIATIONS ====================
    console.log("\n=== Seeding Pronunciation Guide ===");

    for (const pron of pronunciations) {
      const existing = await prisma.pronunciationGuide.findFirst({
        where: {
          term: pron.term,
          termType: pron.termType
        }
      });

      if (existing) {
        console.log(`  Updating: ${pron.term}`);
        await prisma.pronunciationGuide.update({
          where: { id: existing.id },
          data: pron
        });
      } else {
        console.log(`  Creating: ${pron.term}`);
        await prisma.pronunciationGuide.create({
          data: pron
        });
      }
    }
    console.log(`Seeded ${pronunciations.length} pronunciation entries.`);

    // ==================== SEED LESSON PLANS ====================
    console.log("\n=== Seeding Lesson Plans ===");

    for (const lesson of lessonPlans) {
      const existing = await prisma.lessonPlan.findFirst({
        where: { title: lesson.title }
      });

      const lessonData = {
        title: lesson.title,
        description: lesson.description,
        gradeLevel: lesson.gradeLevel,
        topic: lesson.topic,
        estimatedMinutes: lesson.estimatedMinutes,
        objectives: JSON.stringify(lesson.objectives),
        materials: lesson.materials ? JSON.stringify(lesson.materials) : null,
        introduction: lesson.introduction || null,
        mainContent: lesson.mainContent,
        activities: lesson.activities ? JSON.stringify(lesson.activities) : null,
        discussionQuestions: lesson.discussionQuestions ? JSON.stringify(lesson.discussionQuestions) : null,
        assessment: lesson.assessment || null,
        extensions: lesson.extensions || null,
        curriculumConnections: lesson.curriculumConnections ? JSON.stringify(lesson.curriculumConnections) : null,
        isPublished: true
      };

      if (existing) {
        console.log(`  Updating: ${lesson.title}`);
        await prisma.lessonPlan.update({
          where: { id: existing.id },
          data: lessonData
        });
      } else {
        console.log(`  Creating: ${lesson.title}`);
        await prisma.lessonPlan.create({
          data: lessonData
        });
      }
    }
    console.log(`Seeded ${lessonPlans.length} lesson plans.`);

    // ==================== SEED COMPARISON TEMPLATES ====================
    console.log("\n=== Seeding Comparison Templates ===");

    for (const template of comparisonTemplates) {
      const existing = await prisma.comparisonTemplate.findFirst({
        where: { title: template.title }
      });

      const templateData = {
        title: template.title,
        description: template.description,
        comparisonType: template.comparisonType,
        items: JSON.stringify(template.items),
        criteria: JSON.stringify(template.criteria),
        analysisPrompts: template.analysisPrompts ? JSON.stringify(template.analysisPrompts) : null,
        gradeLevel: template.gradeLevel,
        isPublished: true
      };

      if (existing) {
        console.log(`  Updating: ${template.title}`);
        await prisma.comparisonTemplate.update({
          where: { id: existing.id },
          data: templateData
        });
      } else {
        console.log(`  Creating: ${template.title}`);
        await prisma.comparisonTemplate.create({
          data: templateData
        });
      }
    }
    console.log(`Seeded ${comparisonTemplates.length} comparison templates.`);

    // ==================== SEED TIMELINE EVENTS ====================
    console.log("\n=== Seeding Timeline Events ===");

    for (const event of timelineEvents) {
      const existing = await prisma.timelineEvent.findFirst({
        where: {
          title: event.title,
          year: event.year
        }
      });

      if (existing) {
        console.log(`  Updating: ${event.title}`);
        await prisma.timelineEvent.update({
          where: { id: existing.id },
          data: event
        });
      } else {
        console.log(`  Creating: ${event.title}`);
        await prisma.timelineEvent.create({
          data: event
        });
      }
    }
    console.log(`Seeded ${timelineEvents.length} timeline events.`);

    // ==================== SEED VIRTUAL FIELD TRIPS ====================
    console.log("\n=== Seeding Virtual Field Trips ===");

    for (const trip of virtualFieldTrips) {
      const existing = await prisma.virtualFieldTrip.findFirst({
        where: { title: trip.title }
      });

      if (existing) {
        console.log(`  Updating: ${trip.title}`);
        // Delete existing stops
        await prisma.fieldTripStop.deleteMany({
          where: { tripId: existing.id }
        });
        // Update trip
        await prisma.virtualFieldTrip.update({
          where: { id: existing.id },
          data: {
            description: trip.description,
            gradeLevel: trip.gradeLevel,
            estimatedMinutes: trip.estimatedMinutes,
            theme: trip.theme,
            isPublished: true
          }
        });
        // Create stops
        for (const stop of trip.stops) {
          await prisma.fieldTripStop.create({
            data: {
              ...stop,
              tripId: existing.id
            }
          });
        }
      } else {
        console.log(`  Creating: ${trip.title}`);
        const newTrip = await prisma.virtualFieldTrip.create({
          data: {
            title: trip.title,
            description: trip.description,
            gradeLevel: trip.gradeLevel,
            estimatedMinutes: trip.estimatedMinutes,
            theme: trip.theme,
            isPublished: true
          }
        });
        // Create stops
        for (const stop of trip.stops) {
          await prisma.fieldTripStop.create({
            data: {
              ...stop,
              tripId: newTrip.id
            }
          });
        }
      }
    }
    console.log(`Seeded ${virtualFieldTrips.length} virtual field trips.`);

    // ==================== SEED ADDITIONAL LOCATIONS ====================
    console.log("\n=== Seeding Additional Trading Post Locations ===");

    // Get waterway IDs for linking
    const jamesBay = await prisma.waterway.findFirst({ where: { name: "James Bay" } });
    const mooseRiver = await prisma.waterway.findFirst({ where: { name: "Moose River" } });
    const albanyRiver = await prisma.waterway.findFirst({ where: { name: "Albany River" } });
    const lakeWinnipeg = await prisma.waterway.findFirst({ where: { name: "Lake Winnipeg" } });
    const redRiver = await prisma.waterway.findFirst({ where: { name: "Red River" } });
    const saskatchewanRiver = await prisma.waterway.findFirst({ where: { name: "Saskatchewan River" } });
    const lakeAthabasca = await prisma.waterway.findFirst({ where: { name: "Lake Athabasca" } });

    const locationWaterwayMap: Record<string, string | undefined> = {
      "Moose Factory": mooseRiver?.id || jamesBay?.id,
      "Fort Albany": albanyRiver?.id || jamesBay?.id,
      "Norway House": lakeWinnipeg?.id,
      "Lower Fort Garry": redRiver?.id,
      "Upper Fort Garry": redRiver?.id,
      "Batoche": saskatchewanRiver?.id,
      "Fort Carlton": saskatchewanRiver?.id,
      "Fort Chipewyan": lakeAthabasca?.id
    };

    for (const loc of additionalLocations) {
      const existing = await prisma.location.findFirst({
        where: { name: loc.name }
      });

      const waterwayId = locationWaterwayMap[loc.name];

      if (!waterwayId) {
        console.log(`  Skipping ${loc.name}: No waterway found to link to`);
        continue;
      }

      if (existing) {
        console.log(`  Updating: ${loc.name}`);
        await prisma.location.update({
          where: { id: existing.id },
          data: {
            ...loc,
            waterwayId
          }
        });
      } else {
        console.log(`  Creating: ${loc.name}`);
        await prisma.location.create({
          data: {
            ...loc,
            waterwayId
          }
        });
      }
    }
    console.log(`Seeded locations.`);

    // ==================== SUMMARY ====================
    console.log("\n=== Comprehensive Seed Complete ===");

    const stats = {
      waterways: await prisma.waterway.count(),
      locations: await prisma.location.count(),
      notableFigures: await prisma.notableFigure.count(),
      pronunciations: await prisma.pronunciationGuide.count(),
      lessonPlans: await prisma.lessonPlan.count(),
      comparisonTemplates: await prisma.comparisonTemplate.count(),
      timelineEvents: await prisma.timelineEvent.count(),
      virtualFieldTrips: await prisma.virtualFieldTrip.count()
    };

    console.log(`
Summary:
- ${stats.waterways} waterways (rivers and lakes)
- ${stats.locations} historic locations
- ${stats.notableFigures} notable figures
- ${stats.pronunciations} pronunciation guide entries
- ${stats.lessonPlans} lesson plans
- ${stats.comparisonTemplates} comparison templates
- ${stats.timelineEvents} timeline events
- ${stats.virtualFieldTrips} virtual field trips
    `);

  } catch (error) {
    console.error("Error during comprehensive seed:", error);
    throw error;
  }
}

// Run if executed directly
// ES Module compatible check
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
                     process.argv[1]?.endsWith('seed-comprehensive.ts');

if (isMainModule) {
  seedComprehensive()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
