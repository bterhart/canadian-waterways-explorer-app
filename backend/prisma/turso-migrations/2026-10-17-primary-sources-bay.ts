// Primary-source pointers for The Bay and the Barren Lands (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-primary-sources-bay.ts [--apply]
//
// Same rules as the earlier sets. Run after the bay-and-barren-lands pack, which creates several of
// the names used here. Idempotent by title.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;
const JR = (vol: number) => `https://moses.creighton.edu/kripke/jesuitrelations/relations_${vol}.html`;

interface Doc {
  title: string; documentType: "journal" | "report" | "letter" | "map" | "treaty";
  author: string; originalDate: string; originalYear: number;
  whatItIs: string; whereToReadIt: string[];
  vocabulary: { word: string; definition: string }[]; discussionQuestions: string[];
  gradeLevel: "4-6" | "7-9" | "10-12"; explorer?: string; waterway?: string; location?: string;
}

const DOCS: Doc[] = [
  {
    title: "Albanel's Relation of the Journey to the North Sea, 1672", documentType: "report", author: "Charles Albanel", originalDate: "1672, printed 1673", originalYear: 1672,
    whatItIs: "The Jesuit's own account, printed in the Relation of 1672, of the first overland journey from the St. Lawrence to Hudson Bay: up the Saguenay and Lac Saint-Jean in August 1671, the winter on the height of land, the crossing of Lake Mistassini in June 1672, the descent of the Rupert with Innu guides, the meeting with the Cree of the bay and the empty English post at the river's mouth. It is the first description of the Mistassini and Rupert country and of the James Bay Cree from the French side.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, vol. 56 (Thwaites, 1899), French and English — ${JR(56)}`,
      `The same volume at the Internet Archive — ${IA("jesuitrelationsa56jesuuoft")}`,
      "Original: Relation de ce qui s'est passé de plus remarquable aux missions des pères de la Compagnie de Jésus en la Nouvelle France, les années 1671 et 1672 (Paris, 1673).",
    ],
    vocabulary: [{ word: "Mer du Nord", definition: "The North Sea, the French name for Hudson Bay" }, { word: "Mistassini", definition: "The great lake on the height of land between the Saguenay and James Bay, 'large rock' in Cree" }, { word: "Relation", definition: "The Jesuits' annual printed report from New France" }],
    discussionQuestions: ["Who guided Albanel, and what did they want from the journey?", "What did he find at the mouth of the Rupert, and what did he do about it?", "Why did Intendant Talon want a priest to go to the bay in 1671?"],
    gradeLevel: "10-12", explorer: "Charles Albanel", waterway: "Rupert River", location: "Mistassini Post",
  },
  {
    title: "Isham's Observations on Hudsons Bay, 1743", documentType: "journal", author: "James Isham", originalDate: "1743, published 1949", originalYear: 1743,
    whatItIs: "Written on a voyage home from York Fort, in a spelling all his own, Isham's Observations describe the Cree of the coast, their language (with a vocabulary), hunting, beliefs and trade, the weather and seasons of the bay, and its birds, beasts and fish, many of them never described before; the naturalist George Edwards named species from Isham's specimens. With it the Hudson's Bay Record Society printed his notes answering Arthur Dobbs's attack on the company. It is the earliest full account of the bay by a company man.",
    whereToReadIt: [
      `James Isham's Observations on Hudsons Bay, 1743, and Notes and Observations on a Book Entitled A Voyage to Hudsons Bay in the Dobbs Galley, 1749, ed. E. E. Rich (Hudson's Bay Record Society XII, 1949) — ${IA("Ayer_168.6_H89_v._12")}`,
      "Original manuscript: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg, E.2/1-2.",
    ],
    vocabulary: [{ word: "York Fort", definition: "The company's post at the Hayes River's mouth, later York Factory, which Isham commanded" }, { word: "Home Indians", definition: "The Cree families who lived around a post and hunted for it" }, { word: "Dobbs", definition: "Arthur Dobbs, the Irish MP who attacked the company's monopoly in the 1740s" }],
    discussionQuestions: ["What did Isham think the Cree thought of the English?", "Which animals did he describe that no European had written about?", "How is a factor's account different from an explorer's?"],
    gradeLevel: "10-12", explorer: "James Isham", waterway: "Hayes River", location: "York Factory",
  },
  {
    title: "Andrew Graham's Observations on Hudson's Bay, 1767-1791", documentType: "journal", author: "Andrew Graham", originalDate: "1767-1791, published 1969", originalYear: 1767,
    whatItIs: "The manuscript Observations that Graham began at Severn House in 1767 and revised for twenty years: narratives of life at the posts, the trade and its goods and prices, the Cree of York and Severn in more detail than any other eighteenth-century source, the Inuit of the northwest coast he had met from the sloops, weather and astronomical records, copies of the inland journals of Henday, Cocking and others, the first vocabularies of the Gros Ventre and Tsuut'ina, and long sections on the birds and animals of the bay. Umfreville and Hutchins lifted from it without credit.",
    whereToReadIt: [
      "Andrew Graham's Observations on Hudson's Bay, 1767-91, ed. Glyndwr Williams (Hudson's Bay Record Society XXVII, 1969); in university libraries.",
      "Original manuscripts: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg, E.2/4-13.",
      `What was taken from it: Edward Umfreville, The Present State of Hudson's Bay (London, 1790) — ${IA("10282186bsb")}`,
    ],
    vocabulary: [{ word: "Severn House", definition: "The post at the Severn's mouth, where Graham was master 1761-74" }, { word: "pedlars", definition: "The company's name for the Montreal traders competing inland" }, { word: "Arctic Zoology", definition: "Thomas Pennant's 1784-85 work, much of it built on Graham's specimens" }],
    discussionQuestions: ["What did Graham know from his own experience, and what did he copy from others?", "Why did he argue for inland posts, and what came of it?", "How did his work reach the naturalists of London, and why without his name?"],
    gradeLevel: "10-12", explorer: "Andrew Graham", waterway: "Severn River", location: "Fort Severn",
  },
  {
    title: "Coats's Geography of Hudson's Bay, 1727-1751", documentType: "journal", author: "William Coats", originalDate: "written 1744-1751, published 1852", originalYear: 1749,
    whatItIs: "The notes that the company captain compiled over twenty-five voyages toward a geography of the bay: the ice and tides of Hudson Strait, the harbours and rivers of the west coast, and above all his own survey of the East Main in 1749 from Cape Digges to Richmond Gulf, with the Inuit and Cree he met. The manuscript passed to the Arctic explorer Parry and was printed by the Hakluyt Society in 1852, a century after Coats died dismissed and disgraced; his six surviving manuscript charts are in the company's archives.",
    whereToReadIt: [
      "The Geography of Hudson's Bay: being the remarks of Captain W. Coats, in many voyages to that locality, between the years 1727 and 1751, ed. John Barrow (Hakluyt Society, first series XI, London, 1852); digitized copies are in the HathiTrust and Internet Archive Hakluyt Society sets.",
      "Coats's manuscript maps: Hudson's Bay Company Archives, Archives of Manitoba, G.1/14-18.",
      "Glyndwr Williams, 'Captain Coats and exploration along the East Main', The Beaver, winter 1963, for the voyage of 1749.",
    ],
    vocabulary: [{ word: "East Main", definition: "The company's name for the eastern shore of Hudson Bay and James Bay" }, { word: "Richmond Gulf", definition: "The inland bay, now Lake Tasiujaq, where Coats recommended a post" }, { word: "Hakluyt Society", definition: "The London society founded in 1846 to publish voyages and travels" }],
    discussionQuestions: ["What did Coats hope to find on the East Main, and what did he find?", "Why was his geography not published in his lifetime?", "What does his account add to what the Inuit and Cree of the coast already knew?"],
    gradeLevel: "10-12", explorer: "William Coats", waterway: "Hudson Bay", location: "Fort Richmond",
  },
  {
    title: "Wales's Journal of a Voyage to Churchill River, 1768-1769", documentType: "journal", author: "William Wales", originalDate: "1769, published 1770", originalYear: 1769,
    whatItIs: "The astronomer's account, printed by the Royal Society in its Philosophical Transactions, of the voyage to Prince of Wales Fort, thirteen months there with Joseph Dymond, the observations of the transit of Venus on 3 June 1769 and of the weather through the winter, the cold, the men's clothing and diet and the country around the fort. It is the first scientific wintering on Hudson Bay, and its weather tables are the earliest instrumental record of a Canadian winter.",
    whereToReadIt: [
      `'Journal of a Voyage, Made by Order of the Royal Society, to Churchill River, on the North-west Coast of Hudson's Bay; of Thirteen Months Residence in That Country; and the Voyage Back to England; in the Years 1768 and 1769', Philosophical Transactions LX (1770), 100-136 — ${IA("philtrans06272280")}`,
      "The transit and weather observations by Wales and Dymond follow in the same volume, and both are at the Royal Society's publishing site.",
    ],
    vocabulary: [{ word: "transit of Venus", definition: "The passage of Venus across the face of the sun, observed in 1769 from many stations to measure the solar system" }, { word: "Prince of Wales Fort", definition: "The stone fort at the Churchill's mouth, built 1731-71" }, { word: "Philosophical Transactions", definition: "The Royal Society's journal, the oldest scientific journal in English" }],
    discussionQuestions: ["Why did the Royal Society send observers to Hudson Bay, Tahiti and Norway at once?", "What did Wales find hardest about the winter?", "What did he learn from the company's men and from the Cree and Dene around the fort?"],
    gradeLevel: "10-12", explorer: "William Wales", waterway: "Churchill River", location: "Prince of Wales Fort",
  },
  {
    title: "The Severn House Journal on Abishabis, 1842-1843", documentType: "journal", author: "John Cromartie, postmaster at Severn House", originalDate: "1842-1843", originalYear: 1842,
    whatItIs: "The daily post journal kept at Severn through the year of the Cree prophetic movement: the Cree gathered at the post 'psalm singing and painting books' instead of hunting geese in September 1842, the woods ringing with music through October, the news from York and Albany, Abishabis's arrival in irons in August 1843 and his death on 30 August. With George Barnston's Albany correspondence and the Methodist George Barnley's notes at Moose, it is the whole written record of the movement; the Cree side survives only in what these men wrote down.",
    whereToReadIt: [
      "Severn post journals, 1842-1843, and the Albany and York Factory correspondence: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg (microfilm available through the Archives' reading room and interlibrary loan).",
      "Jennifer S. H. Brown, 'Abishabis', Dictionary of Canadian Biography, vol. 7, which quotes the journals at length — https://www.biographi.ca/en/bio/abishabis_7E.html",
      "Jennifer S. H. Brown, 'The Track to Heaven: The Hudson Bay Cree Religious Movement of 1842-1843', in Papers of the Thirteenth Algonquian Conference (1982).",
    ],
    vocabulary: [{ word: "syllabics", definition: "The writing James Evans devised for Cree at Norway House in 1840, which the movement took up at once" }, { word: "Wasiteck", definition: "'The Light', Abishabis's companion prophet" }, { word: "windigo", definition: "The cannibal spirit; Abishabis's body was burned as a windigo's is" }],
    discussionQuestions: ["What did the postmaster complain about, and what does that tell us about what mattered to the company?", "How can we read the Cree's actions through a record written against them?", "Why did a new way of writing become a religious tool so quickly?"],
    gradeLevel: "10-12", waterway: "Severn River", location: "Fort Severn",
  },
  {
    title: "Erlandson's Journal of the Crossing of Labrador, 1834", documentType: "journal", author: "Erland Erlandson", originalDate: "April-July 1834, published 1963", originalYear: 1834,
    whatItIs: "The Hudson's Bay Company clerk's journal of the journey from Fort Chimo on 6 April 1834 with five Innu guides, south by the Whale River to Lake Petitsikapau, across Lake Michikamau and down the Naskaupi to the tidal water of Lake Melville on 22 June, the first crossing of the Labrador peninsula by a European, and back to Fort Chimo by 17 July. With it the Record Society printed the Ungava correspondence of Nicol Finlayson and the journals of the posts on the East Main, the record of the company's 'dangerous service' in Ungava from 1830.",
    whereToReadIt: [
      "Northern Quebec and Labrador Journals and Correspondence, 1819-35, ed. K. G. Davies and A. M. Johnson (Hudson's Bay Record Society XXIV, 1963); in university libraries.",
      "Originals: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg, Fort Chimo journals and correspondence (B.38).",
      "Alan Cooke, 'Erlandson, Erland', Dictionary of Canadian Biography, vol. 10 — https://www.biographi.ca/en/bio/erlandson_erland_10E.html",
    ],
    vocabulary: [{ word: "Fort Chimo", definition: "The company's Ungava post of 1830 on the Koksoak, now Kuujjuaq" }, { word: "Lake Melville", definition: "The tidal lake behind Hamilton Inlet on the Labrador coast, where Goose Bay now stands" }, { word: "Naskapi", definition: "The Innu of the Ungava interior, 'people beyond the horizon'" }],
    discussionQuestions: ["Why did the guides take Erlandson east to the Atlantic rather than south to Mingan as ordered?", "What did the company hope the crossing would prove?", "Why was Erlandson never promoted, by his own account and the governor's?"],
    gradeLevel: "10-12", explorer: "Erland Erlandson", waterway: "Ungava Bay", location: "Fort Chimo",
  },
  {
    title: "McLean's Notes of a Twenty-Five Years' Service in the Hudson's Bay Territory, 1849", documentType: "journal", author: "John McLean", originalDate: "1820-1846, published 1849", originalYear: 1849,
    whatItIs: "The memoir of a trader who had served on the Ottawa, the Columbia, in Ungava and on the Mackenzie: the Ungava chapters describe Fort Chimo, the Naskapi and Inuit of the Koksoak, his journeys of 1838-41 across the interior to Hamilton Inlet, the first sight of the Grand Falls of the Churchill in 1839, and the closing of the district. It is also a sustained attack on George Simpson and the company's treatment of its officers, and one of the frankest books the fur trade produced.",
    whereToReadIt: [
      `Notes of a Twenty-Five Years' Service in the Hudson's Bay Territory (London, 1849), vol. 1 — ${IA("notesoftwentyfiv01mcle")}`,
      `Vol. 2 — ${IA("notesoftwentyfiv12mcle")}`,
      "W. S. Wallace, ed., John McLean's Notes of a Twenty-Five Years' Service (Champlain Society XIX, 1932), annotated.",
    ],
    vocabulary: [{ word: "Grand Falls", definition: "The falls of the Churchill River of Labrador, now Churchill Falls, which McLean reached in 1839" }, { word: "Esquimaux Bay", definition: "Hamilton Inlet, the company's name for the Labrador coast depot" }, { word: "chief trader", definition: "The commissioned rank below chief factor that McLean reached in 1841 and thought came too late" }],
    discussionQuestions: ["What did McLean think of the Ungava district and the people who lived there?", "Why did he believe Simpson had wronged him, and does the record bear him out?", "How does a memoir written in anger differ from a journal written at the time?"],
    gradeLevel: "10-12", explorer: "John McLean", waterway: "Koksoak River", location: "Fort Chimo",
  },
  {
    title: "Turner's Ethnology of the Ungava District, 1894", documentType: "report", author: "Lucien M. Turner", originalDate: "1882-1884, published 1894", originalYear: 1894,
    whatItIs: "The Smithsonian naturalist Lucien Turner spent two years at Fort Chimo in 1882-84 collecting birds and recording the Inuit and Naskapi of the Koksoak: their houses, clothing, hunting, tools, games, stories and language, with hundreds of drawings. Published by the Bureau of Ethnology in 1894, it is the fullest nineteenth-century description of the people of Ungava, and the collection he made is in the Smithsonian.",
    whereToReadIt: [
      `Ethnology of the Ungava District, Hudson Bay Territory, Eleventh Annual Report of the Bureau of Ethnology (Washington, 1894) — ${IA("ethnologyofungav00turnrich")}`,
      "Reprinted with an introduction by Stephen Loring (Smithsonian Institution Press, 2001).",
    ],
    vocabulary: [{ word: "Bureau of Ethnology", definition: "The Smithsonian's bureau for the study of Native American peoples, founded 1879" }, { word: "Nenenot", definition: "Turner's name for the Naskapi, from their own name for themselves" }, { word: "Fort Chimo", definition: "The reopened company post where Turner lived, 1882-84" }],
    discussionQuestions: ["What did Turner record that the company's journals did not?", "How did the Inuit and Naskapi of the Koksoak use the post, and how did Turner see them?", "What are the limits of a two-year visitor's account?"],
    gradeLevel: "10-12", waterway: "Koksoak River", location: "Fort Chimo",
  },
  {
    title: "Bell's Report on the Attawapiskat and Albany Rivers, 1887", documentType: "report", author: "Robert Bell, Geological Survey of Canada", originalDate: "1886, published 1887", originalYear: 1887,
    whatItIs: "Bell's report of his 1886 season for the Geological Survey: the Attawapiskat from its lake to James Bay and the Albany, with the geology, the rapids and portages, the forest and the lowland, notes on the Cree who guided him and on the Hudson's Bay Company posts, and a map made as he went, since none existed. One of a dozen such reports in which Bell mapped the rivers between Hudson Bay and Lake Superior and argued for a railway to the bay.",
    whereToReadIt: [
      `Report on an Exploration of Portions of the At-ta-wa-pish-kat and Albany Rivers, Lonely Lake to James Bay (Geological and Natural History Survey of Canada, Annual Report, vol. II, 1886; Montreal, 1887) — ${IA("reportonexplorat00belluoft")}`,
      "Bell's other Hudson Bay reports and his papers: Library and Archives Canada, Robert Bell fonds.",
    ],
    vocabulary: [{ word: "Geological Survey of Canada", definition: "The Dominion's scientific survey, founded 1842, which mapped the north as it went" }, { word: "Hudson Bay Lowlands", definition: "The flat wet country between the Shield and the bay that the Attawapiskat crosses" }, { word: "track survey", definition: "A map made by compass bearings and estimated distances while travelling" }],
    discussionQuestions: ["Why did the government want the rivers of the lowlands mapped in the 1880s?", "Who showed Bell the way, and how does his report treat them?", "What did Bell argue the Hudson Bay route could do for western Canada?"],
    gradeLevel: "10-12", explorer: "Robert Bell", waterway: "Attawapiskat River",
  },
  {
    title: "Low's Report on Explorations in the Labrador Peninsula, 1892-1895", documentType: "report", author: "A. P. Low, Geological Survey of Canada", originalDate: "1892-1895, published 1896", originalYear: 1896,
    whatItIs: "The report of the Geological Survey's great Labrador reconnaissance: Low's journeys by canoe, snowshoe and boat along the East Main, up the Koksoak and the Caniapiscau, down the Hamilton and the Manicouagan, with the geology that found the iron ranges of the interior, the first maps of the rivers and lakes of the plateau, and chapters on the Naskapi, Innu, Cree and Inuit, the climate, forests and animals. The report of his 1898 traverse from Richmond Gulf to Ungava Bay completes it.",
    whereToReadIt: [
      `Report on Explorations in the Labrador Peninsula along the East Main, Koksoak, Hamilton, Manicuagan and Portions of Other Rivers in 1892-93-94-95 (Geological Survey of Canada, Annual Report, vol. VIII, 1895; Ottawa, 1896) — ${IA("reportonexplorat00geoluoft")}`,
      `Report on a Traverse of the Northern Part of the Labrador Peninsula from Richmond Gulf to Ungava Bay (Geological Survey of Canada, 1898) — ${IA("cihm_26610")}`,
      "Low's The Cruise of the Neptune (Ottawa, 1906) for the 1903-04 Hudson Bay and Arctic voyage.",
    ],
    vocabulary: [{ word: "Labrador peninsula", definition: "The whole land between Hudson Bay, Hudson Strait and the Gulf of St. Lawrence, of which Labrador proper is the east coast" }, { word: "iron range", definition: "The belt of iron ore Low mapped in 1893-94 that became Schefferville and Labrador City" }, { word: "Caniapiscau", definition: "The Koksoak's main tributary, which Low ascended" }],
    discussionQuestions: ["How much country did Low cover, and how, in four seasons?", "What did he say about the people of the interior, and what did he owe to their guidance?", "What became of the iron he found, and who gained and lost by it?"],
    gradeLevel: "10-12", explorer: "Albert Peter Low", waterway: "Koksoak River",
  },
  {
    title: "Tyrrell's Report on the Doobaunt, Kazan and Ferguson Rivers, 1897", documentType: "report", author: "J. B. Tyrrell, Geological Survey of Canada", originalDate: "1893-1894, published 1897", originalYear: 1897,
    whatItIs: "The official report of the two Barren Lands expeditions: in 1893 from Lake Athabasca over the height of land and down the Dubawnt and the Thelon to Baker Lake, Chesterfield Inlet and the coast to Churchill, and in 1894 down the Kazan and the Ferguson to the bay. Geology, the lakes and rapids, the caribou, the musk-ox and the Caribou Inuit of the Kazan whom Tyrrell was the first outsider to meet, with the first maps of the Kivalliq interior. His brother's book tells the same journey as a story.",
    whereToReadIt: [
      `Report on the Doobaunt, Kazan and Ferguson Rivers and the North-West Coast of Hudson Bay, and on Two Overland Routes from Hudson Bay to Lake Winnipeg (Geological Survey of Canada, Annual Report, vol. IX, 1896; Ottawa, 1897) — ${IA("cihm_29129")}`,
      `J. W. Tyrrell, Across the Sub-Arctics of Canada: A Journey of 3,200 Miles by Canoe and Snowshoe through the Barren Lands (Toronto, 1897) — ${IA("acrosssubarctics00tyrr")}`,
      "Tyrrell's journals and photographs: Thomas Fisher Rare Book Library, University of Toronto, J. B. Tyrrell papers.",
    ],
    vocabulary: [{ word: "Doobaunt", definition: "Tyrrell's spelling of the Dubawnt" }, { word: "Caribou Inuit", definition: "The inland Inuit of the Kazan and Thelon, who lived by the caribou herds" }, { word: "height of land", definition: "The divide between waters flowing to Lake Athabasca and the Mackenzie and those flowing to Hudson Bay" }],
    discussionQuestions: ["What did Tyrrell record about the Inuit of the Kazan, and what did they make of him?", "What went wrong on the coast in the autumn of 1893, and how did the party survive?", "How do the brother's book and the official report differ in what they choose to tell?"],
    gradeLevel: "10-12", explorer: "Joseph Burr Tyrrell", waterway: "Dubawnt River",
  },
  {
    title: "Pike's The Barren Ground of Northern Canada, 1892", documentType: "journal", author: "Warburton Pike", originalDate: "1889-1890, published 1892", originalYear: 1892,
    whatItIs: "The English sportsman's account of a year north of Great Slave Lake with the Yellowknives Dene, hunting musk-ox and caribou on the Barren Ground in the autumn of 1889, wintering at Fort Resolution and with the Dene, and returning to the tundra in the spring. The first popular book about the Barren Lands and the people who lived by the caribou, written plainly and with respect for the Dene hunters on whom Pike depended, it sent Hanbury, Seton, Hornby and many others north after it.",
    whereToReadIt: [
      `The Barren Ground of Northern Canada (London, 1892) — ${IA("barrengroundnor03pikegoog")}`,
      "Through the Subarctic Forest (London, 1896), his account of the Stikine, the Pelly and the Yukon.",
    ],
    vocabulary: [{ word: "Barren Ground", definition: "The tundra north of the treeline between Great Slave Lake and Hudson Bay" }, { word: "Yellowknives", definition: "The T'atsaot'ine Dene of the country northeast of Great Slave Lake" }, { word: "musk-ox", definition: "The shaggy Arctic ox, hunted nearly to extinction for its robes by the 1890s" }],
    discussionQuestions: ["Who actually found the game, and how does Pike acknowledge it?", "What did Pike think a sportsman owed the country he hunted in?", "Why did this book start a fashion for the Barren Lands?"],
    gradeLevel: "7-9", explorer: "Warburton Pike", waterway: "Great Slave Lake",
  },
  {
    title: "Hanbury's Sport and Travel in the Northland of Canada, 1904", documentType: "journal", author: "David T. Hanbury", originalDate: "1899-1902, published 1904", originalYear: 1904,
    whatItIs: "Hanbury's account of his two journeys: in 1899 by dog team from Churchill to Marble Island and up Chesterfield Inlet to Baker Lake with the Inuit guide Milook, then by canoe up the Thelon and out by Great Slave Lake; and in 1901-02 from Chesterfield Inlet across the Barren Ground to the Arctic coast at the Coppermine with Hubert Darrell and the guides Uttungerlah and Ameroryuak, wintering with the Inuit. Musk-ox hunting, fishing, dog travel and careful notes on Inuit and Dene life, with word lists, collections and maps, and an insistence on the Indigenous names of every place.",
    whereToReadIt: [
      `Sport and Travel in the Northland of Canada (London, 1904) — ${IA("sporttravelinnor00hanbuoft")}`,
      "'A Journey from Chesterfield Inlet to Great Slave Lake, 1898-9', Geographical Journal 16 (1900), and 'Through the Barren Ground of North-Eastern Canada to the Arctic Coast', Geographical Journal 22 (1903).",
      "Hanbury's journals: Scott Polar Research Institute, Cambridge.",
    ],
    vocabulary: [{ word: "Arkeleenik", definition: "Hanbury's rendering of the Inuit name of the Thelon" }, { word: "Depot Island", definition: "The whalers' harbour near Chesterfield Inlet where Hanbury took on supplies in 1901" }, { word: "kayak", definition: "The skin-covered hunting boat Hanbury's Inuit companions used on the Thelon" }],
    discussionQuestions: ["Why did Hanbury insist on Inuit and Dene place names, and why did Tyrrell overrule him?", "How did he travel in winter and in summer, and who taught him?", "What does his book tell us about the Inuit of the interior at the turn of the century?"],
    gradeLevel: "10-12", explorer: "David Hanbury", waterway: "Thelon River",
  },
  {
    title: "Seton's The Arctic Prairies, 1911", documentType: "journal", author: "Ernest Thompson Seton", originalDate: "1907, published 1911", originalYear: 1911,
    whatItIs: "The naturalist's account of his canoe journey of 1907 with the biologist Edward Preble: down the Athabasca and the Slave, across Great Slave Lake, over Pike's Portage to Artillery Lake and Aylmer Lake and the Barren Grounds, to see the caribou and the musk-ox and count them. With Seton's own drawings, his estimate of thirty million caribou, his notes on the Dene and Métis who travelled with him and on the Hudson's Bay Company posts, and his argument for protecting the north.",
    whereToReadIt: [
      `The Arctic Prairies: A Canoe-Journey of 2,000 Miles in Search of the Caribou (New York, 1911) — ${IA("arcticprairiesca00setouoft")}`,
      "Edward A. Preble, A Biological Investigation of the Athabaska-Mackenzie Region (North American Fauna 27, Washington, 1908), the companion scientific report.",
    ],
    vocabulary: [{ word: "Arctic prairies", definition: "Seton's name for the Barren Grounds, grassland like the prairies but north of the trees" }, { word: "Pike's Portage", definition: "The chain of lakes and carries from Great Slave Lake to Artillery Lake, named for Warburton Pike" }, { word: "Aylmer Lake", definition: "The lake at the head of the Lockhart River where Seton's journey turned back" }],
    discussionQuestions: ["How did Seton count the caribou, and how reliable was his estimate?", "What did he think the north needed protecting from?", "How does a naturalist's journey differ from a sportsman's like Pike's?"],
    gradeLevel: "7-9", explorer: "Ernest Thompson Seton", waterway: "Great Slave Lake",
  },
  {
    title: "Edgar Christian's Diary, Hornby Point, 1926-1927", documentType: "journal", author: "Edgar Christian", originalDate: "October 1926 - 1 June 1927, published 1937", originalYear: 1927,
    whatItIs: "The diary kept by the eighteen-year-old through the winter on the Thelon with his cousin John Hornby and Harold Adlard: the building of the cabin, the caribou that did not come, the fishing and trapping, the slow starvation, Hornby's death in April and Adlard's in May, and the last entries written alone. Christian put the diary in the cold stove with letters to his parents and a note on the stovepipe, 'Look in stove'; it was found with the bodies in 1928 and published by his family in 1937.",
    whereToReadIt: [
      "Unflinching: A Diary of Tragic Adventure (London, 1937), with an introduction and conclusion by B. Dew Roberts; in libraries.",
      "Death in the Barren Ground: The Diary of Edgar Christian, ed. George Whalley (Ottawa, 1980), the complete text.",
      `George Whalley, The Legend of John Hornby (Toronto, 1962), the biography that sets the diary in Hornby's life — ${IA("legendofjohnhorn0000geor")}`,
    ],
    vocabulary: [{ word: "Hornby Point", definition: "The spruce oasis on the Thelon below the Hanbury's mouth where the cabin stood" }, { word: "Thelon Game Sanctuary", definition: "The reserve created in 1927, the year the three died, on Hornby's own recommendation" }, { word: "Unflinching", definition: "The title his family gave the diary, from the spirit in which it was written" }],
    discussionQuestions: ["What does Christian never say in the diary, and why?", "Who was responsible for what happened at the cabin?", "What did the Inuit and Dene of the Thelon know about surviving a winter there that the three men did not?"],
    gradeLevel: "7-9", explorer: "John Hornby", waterway: "Thelon River", location: "Hornby Point",
  },
  {
    title: "Killing the Shamen: The Sandy Lake Account of Jack Fiddler, 1985", documentType: "report", author: "Thomas Fiddler and James R. Stevens", originalDate: "oral history recorded 1970s, published 1985", originalYear: 1985,
    whatItIs: "The history of the Sucker people of Sandy Lake told by Thomas Fiddler, grandson of Zhauwuno-geezhigo-gaubow, with the historian James Stevens: the legends of the shamans, the windigo, the arrest of Jack and Joseph Fiddler in 1907, the trial at Norway House and the long aftermath, set against the police and court records. The only full account of the Sandy Lake people's own law and of its end from their side.",
    whereToReadIt: [
      `Killing the Shamen (Moonbeam, Ontario: Penumbra Press, 1985), borrowable at the Internet Archive — ${IA("killingshamen0000fidd")}`,
      "Jennifer S. H. Brown, 'Zhauwuno-geezhigo-gaubow', Dictionary of Canadian Biography, vol. 13 — https://www.biographi.ca/en/bio/zhauwuno_geezhigo_gaubow_13E.html",
    ],
    vocabulary: [{ word: "Sucker people", definition: "The Anishinaabe clan of Sandy Lake on the upper Severn, led by the Fiddler family" }, { word: "windigo", definition: "The cannibal spirit of the boreal forest; killing a person possessed by it was an act of law, not murder, to the Sucker people" }, { word: "ogimaa", definition: "Chief or leader in Anishinaabemowin" }],
    discussionQuestions: ["How does the Sandy Lake account differ from the newspaper headlines of 1907?", "What did the police and the missionaries each think they were doing?", "Why does it matter who tells this story?"],
    gradeLevel: "10-12", waterway: "Severn River", location: "Norway House",
  },
];

async function checkUrl(url: string, problems: string[]) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 15_000 * (attempt + 1))); continue; }
      if (res.status === 405 || res.status === 403) { const g = await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } }); if (g.ok) return; problems.push(`${g.status} ${url}`); return; }
      problems.push(`${res.status} ${url}`); return;
    } catch (e) { problems.push(`${String(e).slice(0, 60)} ${url}`); return; }
  }
  problems.push(`rate-limited ${url}`);
}

async function main() {
  const [explorers, waterways, locations, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }), db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } }), db.primarySourceDocument.findMany({ select: { title: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id])); const loc = new Map(locations.map((l) => [l.name, l.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const problems: string[] = []; const urls = new Set<string>();
  for (const d of DOCS) for (const w of d.whereToReadIt) { const m = w.match(/https?:\/\/\S+/); if (m) urls.add(m[0]); }
  for (const u of urls) await checkUrl(u, problems);
  const rows = DOCS.filter((d) => !existing.some((e) => e.title === d.title)).map((d, i) => ({
    id: `psd_int_${String(i + 1).padStart(2, "0")}`, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear,
    originalText: null, transcription: null, imageUrl: null,
    historicalContext: `${d.whatItIs}\n\nWhere to read it:\n${d.whereToReadIt.map((w) => `• ${w}`).join("\n")}`,
    annotations: null, vocabulary: JSON.stringify(d.vocabulary), discussionQuestions: JSON.stringify(d.discussionQuestions),
    explorerId: d.explorer ? need(ex, d.explorer, "explorer") : null, waterwayId: d.waterway ? need(ww, d.waterway, "waterway") : null, locationId: d.location ? need(loc, d.location, "location") : null,
    gradeLevel: d.gradeLevel, isPublished: true,
  }));
  const backupFile = writeBackup("2026-10-17-primary-sources-bay-plan", { rows });
  report("primary sources: The Bay and the Barren Lands", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
