// Primary-source pointers for The Interior Rivers (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-primary-sources-interior.ts [--apply]
//
// Same rules as the earlier sets. Run after the interior-rivers pack, which creates several of
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
    title: "Brébeuf's Relation of the Huron Mission, 1636", documentType: "report", author: "Jean de Brébeuf", originalDate: "1636", originalYear: 1636,
    whatItIs: "Brébeuf's long report from the Wendat country for the Jesuit Relation of 1636: the language, the villages, the Feast of the Dead he witnessed at Ossossané, the councils, games and beliefs of the Wendat, and his instructions to new missionaries on how to behave in a canoe. It is the fullest European description of Wendake before the epidemics and the wars destroyed it, written by the man who had lived there longest.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, vol. 10 (Thwaites, 1897), English and French — ${JR(10)}`,
      "Original: Relation de ce qui s'est passé en la Nouvelle France en l'année 1636 (Paris, 1637).",
      "Sagard's Le Grand Voyage du pays des Hurons (1632), the Récollet account of the same country a decade earlier: George M. Wrong, ed., The Long Journey to the Country of the Hurons (Champlain Society, 1939), borrowable at the Internet Archive — " + IA("longjourneytocou0025fath"),
    ],
    vocabulary: [{ word: "Wendake", definition: "The Wendat (Huron) country between Georgian Bay and Lake Simcoe" }, { word: "Feast of the Dead", definition: "The Wendat ceremony, every ten or fifteen years, in which the bones of the dead were reburied together" }, { word: "Relation", definition: "The Jesuits' annual printed report from New France" }],
    discussionQuestions: ["What did Brébeuf admire in the Wendat, and what did he want to change?", "What does his advice to new missionaries tell us about travelling with the Wendat?", "How does Sagard's account from 1623-24 compare with Brébeuf's?"],
    gradeLevel: "10-12", waterway: "Georgian Bay", location: "Sainte-Marie among the Hurons",
  },
  {
    title: "Ragueneau's Relation of the Destruction of Huronia, 1649-1650", documentType: "report", author: "Paul Ragueneau, Superior of the Huron mission", originalDate: "1649-1650", originalYear: 1649,
    whatItIs: "The Relations of 1649 and 1650, written by the superior at Sainte-Marie, describe the Haudenosaunee attacks on the Wendat villages in March 1649, the deaths of Brébeuf and Lalemant at St. Ignace, the decision to burn Sainte-Marie, the winter of famine on Christian Island and the withdrawal to Quebec. They are the only detailed contemporary account of the end of Wendake, from the Jesuit side.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, vol. 34 (1649) — ${JR(34)}`,
      `The Jesuit Relations and Allied Documents, vol. 35 (1650) — ${JR(35)}`,
      "The Wendat side: Georges E. Sioui, Huron-Wendat: The Heritage of the Circle (UBC Press, 1999), and the oral traditions of Wendake, Quebec.",
    ],
    vocabulary: [{ word: "Haudenosaunee", definition: "The Five Nations Iroquois, the Wendat's rivals in the fur trade and old enemies" }, { word: "Christian Island", definition: "Gahoendoe, the island in Georgian Bay where the Jesuits and Wendat refugees wintered in 1649-50" }, { word: "martyr", definition: "A person killed for their faith; the Church canonized Brébeuf and Lalemant in 1930" }],
    discussionQuestions: ["Why did the Jesuits burn Sainte-Marie rather than defend it?", "What happened to the Wendat who survived?", "How might a Wendat or a Haudenosaunee account of 1649 differ from Ragueneau's?"],
    gradeLevel: "10-12", waterway: "Georgian Bay", location: "Sainte-Marie among the Hurons",
  },
  {
    title: "The Journals and Letters of La Vérendrye and his Sons, 1731-1749", documentType: "journal", author: "Pierre Gaultier de Varennes de La Vérendrye and his sons", originalDate: "1731-1749, published 1927", originalYear: 1731,
    whatItIs: "The reports La Vérendrye sent to the governor and the minister on the posts he built west of Lake Superior: Fort St. Pierre on Rainy Lake, Fort St. Charles on Lake of the Woods, Fort Maurepas on the Winnipeg River, Fort La Reine on the Assiniboine and Fort Dauphin; the Cree and Assiniboine who guided and traded with him; the death of his son Jean-Baptiste and twenty others at Lake of the Woods in 1736; and his sons' journeys to the Mandan villages and toward the Rockies. Collected and translated by Lawrence Burpee for the Champlain Society in 1927.",
    whereToReadIt: [
      `Lawrence J. Burpee, ed., Journals and Letters of Pierre Gaultier de Varennes de La Vérendrye and his Sons (Champlain Society, 1927) — ${IA("P000027")}`,
      "Originals: Archives nationales d'outre-mer, Aix-en-Provence, and Library and Archives Canada.",
    ],
    vocabulary: [{ word: "Western Sea", definition: "The Mer de l'Ouest La Vérendrye was sent to find, which he believed lay beyond the plains" }, { word: "Fort St. Charles", definition: "His post of 1732 on Lake of the Woods, rediscovered in 1908" }, { word: "Mandan", definition: "The farming nation of the Missouri whose villages his sons reached in 1738" }],
    discussionQuestions: ["What did La Vérendrye want from the west, and what did the Cree and Assiniboine want from him?", "How did he pay for his posts, and why did it get him into trouble?", "What happened at Lake of the Woods in 1736, and why?"],
    gradeLevel: "10-12", explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Rainy Lake", location: "Fort St. Pierre",
  },
  {
    title: "Anthony Henday's Journal, 1754-1755", documentType: "journal", author: "Anthony Henday (Hendry)", originalDate: "1754-1755", originalYear: 1754,
    whatItIs: "The daily journal of the Hudson's Bay Company labourer sent inland from York Factory with Cree companions to persuade the plains nations to trade at the bay: the journey up the Hayes and the Saskatchewan, the crossing of the plains with his Cree hosts, the great Blackfoot camp he met in October 1754, the first mention by a European of the Rockies in sight from the Alberta plains, and the Cree traders selling their best furs to the French posts on the way back down. Four manuscript copies survive and disagree, which has kept historians arguing about his route.",
    whereToReadIt: [
      "Lawrence J. Burpee, ed., 'York Factory to the Blackfeet Country: The Journal of Anthony Hendry, 1754-55', Transactions of the Royal Society of Canada, 1907; digitized copies of the Transactions are on the Internet Archive and HathiTrust.",
      "Barbara Belyea, ed., A Year Inland: The Journal of a Hudson's Bay Company Winterer (Wilfrid Laurier University Press, 2000), which prints all four versions side by side.",
      "Originals: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "winterer", definition: "A Hudson's Bay Company man sent inland to live a winter with Indigenous people" }, { word: "Archithinue", definition: "Henday's name for the Blackfoot and allied nations he met" }, { word: "pedlars", definition: "The company's name for the Montreal traders competing inland" }],
    discussionQuestions: ["Why did the Blackfoot chiefs decline to travel to Hudson Bay to trade?", "How much of Henday's journey was his own doing and how much his Cree hosts'?", "Why do the four copies of the journal disagree?"],
    gradeLevel: "7-9", explorer: "Anthony Henday", waterway: "North Saskatchewan River",
  },
  {
    title: "Matthew Cocking's Journal, 1772-1773", documentType: "journal", author: "Matthew Cocking", originalDate: "1772-1773, published 1908", originalYear: 1772,
    whatItIs: "The journal of the second Hudson's Bay Company officer sent inland to winter on the Saskatchewan plains, eighteen years after Henday. Cocking travelled with Cree traders from York Factory, wintered with the Gros Ventre south of the river, described the buffalo pound, the Montreal traders' new posts and the furs they were taking, and recommended the company build inland: Cumberland House followed in 1774.",
    whereToReadIt: [
      `Lawrence J. Burpee, ed., An Adventurer from Hudson Bay: Journal of Matthew Cocking, from York Factory to the Blackfeet Country, 1772-73 (Royal Society of Canada, 1908) — ${IA("adventurerfromhu00cock")}`,
      "Original: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "buffalo pound", definition: "The enclosure into which plains hunters drove bison, which Cocking described in detail" }, { word: "Gros Ventre", definition: "The A'aninin, allies of the Blackfoot, with whom Cocking wintered" }, { word: "Cumberland House", definition: "The post Hearne built in 1774 on Cocking's advice" }],
    discussionQuestions: ["What did Cocking see that convinced him the company must build inland?", "How does his account of the plains compare with Henday's?", "What did the Cree gain from being middlemen between the plains and the bay?"],
    gradeLevel: "7-9", explorer: "Matthew Cocking", waterway: "North Saskatchewan River",
  },
  {
    title: "Peter Pond's Narrative and Map, 1785", documentType: "journal", author: "Peter Pond", originalDate: "written c. 1785", originalYear: 1785,
    whatItIs: "Pond's own account of his life to 1775, in his unschooled spelling, from Connecticut to the Saskatchewan, with the end lost; and the maps he drew in 1785 of the Athabasca country he had opened in 1778, which showed the Mackenzie River flowing to the Pacific and sent Alexander Mackenzie north in 1789 to find out. Pond was the first trader over Methye Portage and the Athabasca's first mapmaker, and his narrative is the only fur trader's autobiography of its generation.",
    whereToReadIt: [
      `Charles M. Gates, ed., Five Fur Traders of the Northwest: Being the Narrative of Peter Pond and the Diaries of John Macdonell, Archibald N. McLeod, Hugh Faries and Thomas Connor (Minnesota Historical Society, 1933; reissued 1965), borrowable at the Internet Archive — ${IA("fivefurtradersof0000unse")}`,
      "Pond's maps of 1785: the copy presented to Congress is in the Public Record Office copy at Library and Archives Canada; the version in the British Library is reproduced in most histories of the Athabasca trade.",
      "Original narrative: Yale University Library.",
    ],
    vocabulary: [{ word: "Methye Portage", definition: "The twenty-kilometre portage from the Churchill waters to the Clearwater, which Pond crossed in 1778" }, { word: "Athabasca", definition: "The country around Lake Athabasca, the richest fur region of the continent" }, { word: "narrative", definition: "A first-person account of a life or journey" }],
    discussionQuestions: ["What kind of man does Pond's narrative show, in his own words and spelling?", "Why did his map of the Athabasca matter so much, and where was it wrong?", "Why was Pond never given credit in his lifetime?"],
    gradeLevel: "10-12", explorer: "Peter Pond", waterway: "Clearwater River", location: "Methye Portage",
  },
  {
    title: "Alexander Henry the Younger's Journals, 1799-1814", documentType: "journal", author: "Alexander Henry the Younger", originalDate: "1799-1814, published 1897", originalYear: 1800,
    whatItIs: "The daily journals of a North West Company partner at Pembina on the Red River (1800-1808), Fort Vermilion and Rocky Mountain House on the North Saskatchewan (1808-1811), and Fort George at the Columbia's mouth, where he drowned in 1814. Blunt and detailed, they record the Red River valley, the Saulteaux and Métis buffalo hunt, the Blackfoot trade and the liquor that ran it, and the posts of the Saskatchewan at the height of the trade war. Elliott Coues's edition of 1897 combined them with Thompson's journals.",
    whereToReadIt: [
      `Elliott Coues, ed., New Light on the Early History of the Greater Northwest: The Manuscript Journals of Alexander Henry and of David Thompson (New York, 1897), vol. 1 — ${IA("newlightonearlyh01henr")}`,
      "Barry M. Gough, ed., The Journal of Alexander Henry the Younger, 1799-1814, 2 vols. (Champlain Society, 1988-1992), the complete modern edition.",
      "Original: Library and Archives Canada.",
    ],
    vocabulary: [{ word: "Pembina", definition: "The post on the Red River at the present border, Henry's base for eight years" }, { word: "Saulteaux", definition: "The Anishinaabe of the Red River country" }, { word: "high wine", definition: "The strong spirits the traders diluted and traded" }],
    discussionQuestions: ["What does Henry's journal show about the buffalo hunt and the Métis?", "How does he describe the liquor trade, and his own part in it?", "What did the Saskatchewan posts look like in 1810 from the inside?"],
    gradeLevel: "10-12", explorer: "Alexander Henry the Younger", waterway: "North Saskatchewan River",
  },
  {
    title: "Peter Fidler's Journals and the Ac ko mok ki Map, 1792-1802", documentType: "map", author: "Peter Fidler, with Ac ko mok ki and other Blackfoot and Gros Ventre mapmakers", originalDate: "1792-1802", originalYear: 1801,
    whatItIs: "Fidler's journal of his winter with the Piikani on the Bow in 1792-93, the first European record of the southern Alberta plains and the Rockies seen from them, and the maps he collected at Chesterfield House on the South Saskatchewan in 1801-02 from Blackfoot and Gros Ventre visitors, above all the Siksika chief Ac ko mok ki's map of the Missouri and the mountains, which Fidler copied and sent to London, where Aaron Arrowsmith put it on his map of North America in 1802. They are among the earliest surviving Indigenous maps of the continent.",
    whereToReadIt: [
      "Fidler's journals and the Indigenous maps: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg (the Ac ko mok ki map is HBCA G.1/25).",
      "Barbara Belyea, ed., Peter Fidler: From York Factory to the Rocky Mountains (McGill-Queen's University Press, 2020), for the 1792-93 journal.",
      `J. G. MacGregor, Peter Fidler: Canada's Forgotten Surveyor, 1769-1822 (McClelland and Stewart, 1966), borrowable at the Internet Archive — ${IA("peterfidlercanad0000macg")}`,
    ],
    vocabulary: [{ word: "Ac ko mok ki", definition: "Old Swan, the Siksika chief who drew the 1801 map for Fidler" }, { word: "Chesterfield House", definition: "Fidler's post at the Red Deer River's mouth, 1800-1802" }, { word: "Arrowsmith", definition: "The London mapmaker whose maps of North America used the Hudson's Bay Company's surveys" }],
    discussionQuestions: ["How did Ac ko mok ki show distance and direction on his map, and how did Fidler read it?", "What did the Blackfoot know about the country to the south and west that no European did?", "Why did the company want Fidler to winter with the Piikani?"],
    gradeLevel: "10-12", explorer: "Peter Fidler", waterway: "South Saskatchewan River", location: "Chesterfield House",
  },
  {
    title: "Henry Youle Hind's Narrative of the Red River and Assiniboine and Saskatchewan Expeditions, 1860", documentType: "report", author: "Henry Youle Hind", originalDate: "1857-1858, published 1860", originalYear: 1860,
    whatItIs: "Hind's two-volume account of the Canadian government expeditions of 1857 and 1858: the Winnipeg River route from Lake Superior, Red River, the Assiniboine, the Qu'Appelle valley and the South Saskatchewan to the Elbow and the Forks, with Humphrey Lloyd Hime's photographs, the first taken on the Canadian prairies, and Hind's argument for a Fertile Belt open to settlement and a canal from the South Saskatchewan into the Qu'Appelle. It made the case in Toronto for taking the west.",
    whereToReadIt: [
      `Narrative of the Canadian Red River Exploring Expedition of 1857 and of the Assinniboine and Saskatchewan Exploring Expedition of 1858 (London, 1860), vol. 1 — ${IA("narrativeofcanad01hind_0")}`,
      `Vol. 2 — ${IA("narrativeofcanad02inhind")}`,
      "Hind's official reports to the Legislative Assembly of Canada (1858, 1859) and Hime's photographs: Library and Archives Canada.",
    ],
    vocabulary: [{ word: "Fertile Belt", definition: "Hind's name for the arc of good land along the North Saskatchewan, as against the dry plains to the south" }, { word: "Qu'Appelle", definition: "The valley Hind surveyed for a canal from the South Saskatchewan" }, { word: "expedition photograph", definition: "Hime's 1858 pictures are the first photographs of the Canadian prairies and their people" }],
    discussionQuestions: ["What did Hind see in the Qu'Appelle valley, and what did he want to do with it?", "Who did Hind meet along the way, and how does he describe the Cree, Saulteaux and Métis?", "How did the expedition's report change what people in Canada thought the west was for?"],
    gradeLevel: "10-12", explorer: "Henry Youle Hind", waterway: "Qu'Appelle River",
  },
  {
    title: "The Palliser Expedition's Journals and Reports, 1857-1860", documentType: "report", author: "John Palliser, James Hector, Eugène Bourgeau, Thomas Blakiston and John W. Sullivan", originalDate: "1857-1860, published 1859-1863", originalYear: 1863,
    whatItIs: "The reports of the British North American Exploring Expedition to Parliament: the Winnipeg River route, two winters at Fort Carlton and Fort Edmonton, the survey of the plains from the Red River to the Rockies, Hector's crossings of the Vermilion, Kicking Horse and Howse passes, Bourgeau's botany, Blakiston's magnetic and ornithological work, and the conclusion that a Fertile Belt could be farmed while the dry triangle to the south could not. The map and the geological sections were the first scientific survey of the Canadian west.",
    whereToReadIt: [
      `The Journals, Detailed Reports, and Observations relative to the Exploration by Captain Palliser (London, 1863), the final report — ${IA("P000405")}`,
      `Papers relative to the Exploration by Captain Palliser (1859), the first report — ${IA("P000392")}`,
      `Irene M. Spry, ed., The Papers of the Palliser Expedition, 1857-1860 (Champlain Society, 1968), borrowable at the Internet Archive — ${IA("papersofpalliser0000iren")}`,
    ],
    vocabulary: [{ word: "Palliser's Triangle", definition: "The dry grassland of southern Alberta and Saskatchewan that Palliser judged unfit for farming" }, { word: "Kicking Horse Pass", definition: "The pass Hector found in 1858, taken by the Canadian Pacific Railway in 1884" }, { word: "blue book", definition: "A British parliamentary report, so called from its cover" }],
    discussionQuestions: ["What did the expedition conclude about the plains, and was it right?", "How did it find the passes through the Rockies, and who showed the way?", "What did Palliser and Hind agree and disagree about?"],
    gradeLevel: "10-12", explorer: "James Hector", waterway: "Bow River",
  },
  {
    title: "Anderson's Hand-Book and Map to the Gold Region, 1858", documentType: "map", author: "Alexander Caulfield Anderson", originalDate: "1858", originalYear: 1858,
    whatItIs: "The guide and map the former Hudson's Bay Company officer published in San Francisco in the spring of 1858 for the thousands heading to the Fraser River gold rush: the routes from the coast to the Fraser and the Thompson by the Harrison and Lillooet and by the brigade trails Anderson had explored himself in 1846-47, with distances, portages and advice. It is the first published guide to the interior of British Columbia and a record of the fur-trade routes at the moment they became roads.",
    whereToReadIt: [
      `Hand-Book and Map to the Gold Region of Frazer's and Thompson's Rivers (San Francisco, 1858) — ${IA("cihm_27870")}`,
      "Anderson's journals of the 1846-47 explorations: BC Archives, Royal BC Museum, Victoria.",
    ],
    vocabulary: [{ word: "brigade trail", definition: "The horse trail by which the fur brigades carried furs out and goods in each year" }, { word: "gold rush", definition: "The rush of some 30,000 people to the Fraser in 1858" }, { word: "Lillooet", definition: "The route from Harrison Lake to the Fraser that Anderson explored in 1846" }],
    discussionQuestions: ["What did a miner in 1858 need to know that Anderson could tell him?", "How did the fur-trade routes become the gold rush roads?", "What did the gold rush mean for the Nlaka'pamux and St'át'imc whose rivers these were?"],
    gradeLevel: "7-9", explorer: "Alexander Caulfield Anderson", waterway: "Fraser River", location: "Fort Alexandria",
  },
  {
    title: "Morris's Treaties of Canada with the Indians, 1880", documentType: "treaty", author: "Alexander Morris, Lieutenant-Governor of Manitoba and the North-West Territories", originalDate: "1871-1877, published 1880", originalYear: 1880,
    whatItIs: "The texts of Treaties 1 to 7 and the negotiator's own account of the councils at which they were made, with the official shorthand records of what was said at the North-West Angle (Treaty 3), Fort Qu'Appelle (Treaty 4), Fort Carlton and Fort Pitt (Treaty 6) and Blackfoot Crossing (Treaty 7, by David Laird). The speeches of Mistawasis, Ahtahkakoop, Poundmaker, Payipwat and Crowfoot are recorded here as the government's interpreters rendered them.",
    whereToReadIt: [
      `The Treaties of Canada with the Indians of Manitoba and the North-West Territories (Toronto, 1880) — ${IA("cihm_14955")}`,
      "The treaty texts and the Crown's current statements on them: Crown-Indigenous Relations and Northern Affairs Canada, Treaty Texts, online.",
      `The Cree side of the Carlton council: Peter Erasmus, Buffalo Days and Nights (Glenbow, 1976), the interpreter's memoir, borrowable at the Internet Archive — ${IA("buffalodaysnight0000pete")}`,
    ],
    vocabulary: [{ word: "numbered treaties", definition: "The eleven treaties of 1871-1921 between the Crown and the First Nations of the west and north" }, { word: "medicine chest", definition: "The clause of Treaty 6 promising medical care, demanded by the Cree at Carlton" }, { word: "interpreter", definition: "Peter Erasmus, a Métis, interpreted at Carlton and later wrote his own account" }],
    discussionQuestions: ["What did the Cree ask for at Fort Carlton, and what did Morris agree to?", "How does Erasmus's account differ from Morris's?", "What did the treaties mean to each side, then and now?"],
    gradeLevel: "10-12", waterway: "North Saskatchewan River", location: "Fort Carlton",
  },
  {
    title: "Pierre Falcon's Chanson de la Grenouillère, 1816", documentType: "letter", author: "Pierre Falcon", originalDate: "June 1816", originalYear: 1816,
    whatItIs: "The song the Métis bard composed on the night of 19 June 1816 after the fight at Seven Oaks (la Grenouillère, the Frog Plain) on the Red River, in which Cuthbert Grant's Métis killed Governor Semple and twenty of the Selkirk colony's men. Sung on the buffalo hunt for a century, it is the Métis account of the battle, the oldest Métis literature, and the first song composed in what is now western Canada to come down in writing.",
    whereToReadIt: [
      `Printed, with a translation, in Joseph James Hargrave, Red River (Montreal, 1871) — ${IA("redriver00harggoog")}`,
      "The text and music: Margaret Arnett MacLeod, Songs of Old Manitoba (Ryerson, 1960); Manitoba Métis Federation and Gabriel Dumont Institute publications.",
      "Louis Riel's and Cuthbert Grant's correspondence on the Métis nation: Archives of Manitoba.",
    ],
    vocabulary: [{ word: "la Grenouillère", definition: "The Frog Plain, the Métis name for the site of Seven Oaks" }, { word: "Bois-Brûlés", definition: "The Métis' name for themselves in Falcon's song, 'burnt wood'" }, { word: "pemmican war", definition: "The conflict of 1814-1816 over the Red River colony's ban on exporting pemmican" }],
    discussionQuestions: ["Whose version of Seven Oaks does the song give, and how does it differ from the Hudson's Bay Company's?", "Why did a song carry the Métis memory better than a document?", "What does the song say the Métis were fighting for?"],
    gradeLevel: "7-9", waterway: "Red River",
  },
  {
    title: "Mackenzie's Account of the Parsnip, the Fraser and the Bella Coola, 1793", documentType: "journal", author: "Alexander Mackenzie", originalDate: "May-August 1793, published 1801", originalYear: 1793,
    whatItIs: "The second half of Mackenzie's Voyages: the ascent of the Peace and the Parsnip, the Sekani elder's directions at Finlay Forks, the carry over the divide, the descent of the Fraser to the point where the Dakelh persuaded him to leave it, the march west on the grease trail to the Nuxalk villages, the canoe journey down the Bella Coola to the sea, and the rock in Dean Channel. The daily entries record the people who fed, guided and sometimes refused him on every stage.",
    whereToReadIt: [
      "Voyages from Montreal, on the River St. Laurence, through the Continent of North America, to the Frozen and Pacific Oceans (London, 1801), the second journal; many editions, and digitized copies on the Internet Archive and Canadiana.",
      "W. Kaye Lamb, ed., The Journals and Letters of Sir Alexander Mackenzie (Hakluyt Society, 1970), the scholarly edition.",
      "The 1793 journey is retraced in the Alexander Mackenzie Heritage Trail from the Fraser to Bella Coola.",
    ],
    vocabulary: [{ word: "grease trail", definition: "The Nuxalk and Dakelh trade route over which eulachon oil was carried inland, which Mackenzie followed west" }, { word: "Finlay Forks", definition: "Where the Finlay and Parsnip met to form the Peace, now under Williston Lake" }, { word: "Friendly Village", definition: "Mackenzie's name for the first Nuxalk village on the Bella Coola" }],
    discussionQuestions: ["How many decisions on the 1793 journey were made on Indigenous advice?", "Why did Mackenzie leave the Fraser, and was it the right call?", "What did the Nuxalk do for the party, and what did they get in return?"],
    gradeLevel: "7-9", explorer: "Alexander Mackenzie", waterway: "Bella Coola River", location: "Mackenzie Rock",
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
  const backupFile = writeBackup("2026-10-17-primary-sources-interior-plan", { rows });
  report("primary sources: The Interior Rivers", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
