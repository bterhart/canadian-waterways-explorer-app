// Roadmap item 16 (2026-10-20): Indigenous contributions as records. The first 28 KnowledgeGiven
// rows, each with its Citation rows (targetType knowledge_given).
//   bun run prisma/turso-migrations/2026-10-20-knowledge-given-seed.ts [--apply]
//
// Rule: no record without a source. Every record below restates what the app's own sourced
// biographies (notable figures, documents) and the cited Dictionary of Canadian Biography
// entries say; the three mapmakers who are not notable figures (Idotliazee with Matonabbee,
// Ac ko mok ki, Iligliuk) rest on the DCB, the Archives of Manitoba and the John Carter Brown
// Library records cited on them. DCB URLs were checked on 2026-10-20 (each answers with the
// biography, not "Biography not found"). Links to explorers, waterways, places and figures are
// looked up by exact name at run time; a name that is not found aborts the run.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Kind = "route_shown" | "map_drawn" | "interpreting" | "testimony" | "medicine_survival" | "discovery" | "diplomacy";
interface Cite { kind: "dcb" | "encyclopedia" | "edition" | "archive" | "article" | "web"; title: string; container?: string; author?: string; year?: string; url?: string; note?: string }
interface Rec {
  id: string; title: string; kind: Kind; year: number; yearLabel?: string;
  personName: string; nation: string; figure?: string; explorer?: string; explorerName?: string;
  waterway?: string; location?: string; lat?: number; lng?: number;
  given: string; outcome: string; cites: Cite[];
}

const DCB = (slug: string, title: string): Cite => ({ kind: "dcb", title, container: "Dictionary of Canadian Biography", url: `https://www.biographi.ca/en/bio/${slug}.html` });
const TCE = (slug: string, title: string): Cite => ({ kind: "encyclopedia", title, container: "The Canadian Encyclopedia", url: `https://www.thecanadianencyclopedia.ca/en/article/${slug}` });

const RECORDS: Rec[] = [
  {
    id: "kg_matonabbee_hearne_coppermine", title: "Matonabbee leads Hearne to the Coppermine and the Arctic Ocean", kind: "route_shown", year: 1771, yearLabel: "1770–1772",
    personName: "Matonabbee", nation: "Chipewyan (Dene)", figure: "Matonabbee", explorer: "Samuel Hearne", waterway: "Coppermine River", location: "Bloody Falls",
    given: "After Hearne's two failed attempts to reach the copper mine, Matonabbee offered to guide him and set the terms: travel as the Chipewyan did, with their families, hunters and carriers. Fluent in Chipewyan, Cree and English, he led the third expedition across the Barren Lands to the Coppermine River and the Arctic Ocean in July 1771.",
    outcome: "The first European overland journey to the Arctic coast of North America, published as Hearne's Journey (1795), which records Matonabbee's own words on why the earlier attempts had failed.",
    cites: [DCB("matonabbee_4E", "Matonabbee"), { kind: "edition", author: "Samuel Hearne", title: "A Journey from Prince of Wales's Fort in Hudson's Bay to the Northern Ocean", container: "Champlain Society edition, ed. J. B. Tyrrell", year: "1911" }],
  },
  {
    id: "kg_matonabbee_idotliazee_map", title: "Matonabbee and Idotliazee draw the country north of Churchill for Moses Norton", kind: "map_drawn", year: 1767, yearLabel: "about 1767–1768",
    personName: "Matonabbee and Idotliazee", nation: "Chipewyan (Dene)", figure: "Matonabbee", explorer: "Moses Norton", waterway: "Churchill River", location: "Prince of Wales Fort",
    given: "A map of the land north of the Churchill River as far as the Coppermine, drawn on deerskin by the two Chipewyan leaders after Norton sent them north to look for the copper; Norton copied it onto paper with a legend.",
    outcome: "The copy went to London with Norton's proposal for an overland search for the copper mine, and the Hudson's Bay Company commissioned Hearne's journeys of 1769–1772.",
    cites: [{ kind: "archive", title: "Map of land north of Churchill River by \"Captain Mea'to'na'bee & I'dot'ly'a'zees\", ca. 1767–1768", container: "Hudson's Bay Company Archives, Archives of Manitoba, G.2/27", url: "https://www.gov.mb.ca/yourarchives/blog/2020/09_sep.html" }, DCB("matonabbee_4E", "Matonabbee")],
  },
  {
    id: "kg_thanadelthur_peace", title: "Thanadelthur makes the peace between the Chipewyan and the Cree", kind: "diplomacy", year: 1716, yearLabel: "1715–1716",
    personName: "Thanadelthur", nation: "Chipewyan (Dene)", figure: "Thanadelthur", explorer: "William Stuart", waterway: "Hayes River", location: "York Factory",
    given: "Escaped from Cree captivity to York Factory in 1714, she led William Stuart's party into the Chipewyan country in 1715–16 and, when the two sides met, argued the peace through herself.",
    outcome: "The Chipewyan could trade at York Factory in safety, and the Company built its post at Churchill in 1717 to receive them. She died at York Factory in February 1717; James Knight's journal records her loss.",
    cites: [DCB("thanadelthur_2E", "Thanadelthur"), TCE("thanadelthur", "Thanadelthur"), DCB("knight_james_2E", "Knight, James")],
  },
  {
    id: "kg_akaitcho_franklin", title: "Akaitcho guides, feeds and rescues Franklin's first expedition", kind: "route_shown", year: 1820, yearLabel: "1820–1822",
    personName: "Akaitcho", nation: "Yellowknife Dene", figure: "Akaitcho", explorer: "Sir John Franklin", waterway: "Coppermine River", location: "Fort Enterprise",
    given: "Akaitcho and his band gave Franklin's poorly supplied party guides, hunters and knowledge of the country from Great Slave Lake to the Coppermine, and warned him against winter travel on British supplies.",
    outcome: "Franklin went on; eleven of his twenty men died on the return. Akaitcho's people found and fed the survivors at Fort Enterprise.",
    cites: [{ kind: "web", author: "Yellowknives Dene First Nation", title: "Our History", container: "Nation website", url: "https://ykdene.com/about-us/our-history/" }, { kind: "article", title: "Akaitcho (Arctic Profiles)", container: "Arctic, Arctic Institute of North America", url: "https://journalhosting.ucalgary.ca/index.php/arctic/article/download/65318/49232/185348" }],
  },
  {
    id: "kg_tattannoeuck_franklin", title: "Tattannoeuck interprets for both of Franklin's Arctic expeditions", kind: "interpreting", year: 1821, yearLabel: "1819–1827",
    personName: "Tattannoeuck (Augustus)", nation: "Inuit", figure: "Tattannoeuck", explorer: "Sir John Franklin", waterway: "Coppermine River",
    given: "Raised near Churchill and speaking English, he interpreted with the Inuit of the Arctic coast on Franklin's first expedition (1819–22) and was the principal interpreter of the second (1825–27).",
    outcome: "Peaceful meetings and food where the expedition had neither; the officers wrote of his intelligence, courage and good humour.",
    cites: [DCB("tattannoeuck_6E", "Tattannoeuck")],
  },
  {
    id: "kg_charlotte_small_thompson", title: "Charlotte Small interprets for David Thompson across the mountains", kind: "interpreting", year: 1807, yearLabel: "1799–1812",
    personName: "Charlotte Small", nation: "Métis (Cree)", figure: "Charlotte Small", explorer: "David Thompson", waterway: "Columbia River", location: "Rocky Mountain House",
    given: "Married to Thompson at Île-à-la-Crosse in 1799, she travelled with him on his surveys, interpreting between the traders and the Cree and keeping the relationships his work depended on, often while pregnant or with young children.",
    outcome: "Thompson's surveys of the Saskatchewan, the Rockies and the Columbia, made over the years she travelled with him.",
    cites: [{ kind: "web", author: "Manitoba Métis Federation", title: "Charlotte Small", container: "Nation website", url: "https://www.mmf.mb.ca/charlotte-small-biography" }],
  },
  {
    id: "kg_saukamappee_thompson", title: "Saukamappee tells David Thompson the history of the Plains", kind: "testimony", year: 1787, yearLabel: "winter 1787–1788",
    personName: "Saukamappee", nation: "Cree, adopted Piikani (Blackfoot)", figure: "Saukamappee", explorer: "David Thompson", waterway: "Bow River",
    given: "At a Piikani camp where the young Thompson wintered, the elder told him his life and his people's: the first horses and guns on the Plains, the wars with the Snake, and the smallpox of 1781.",
    outcome: "Thompson wrote it down; his Narrative carries the account, one of the few records of the northern Plains before and at contact told by someone who lived it.",
    cites: [{ kind: "edition", author: "David Thompson", title: "David Thompson's Narrative of His Explorations in Western America, 1784–1812", container: "Champlain Society, ed. J. B. Tyrrell", year: "1916" }],
  },
  {
    id: "kg_domagaya_taignoagny_cartier", title: "Domagaya and Taignoagny interpret and guide Cartier up the St. Lawrence", kind: "interpreting", year: 1535, yearLabel: "1534–1535",
    personName: "Domagaya and Taignoagny, sons of Donnacona", nation: "St. Lawrence Iroquoian", figure: "Donnacona", explorer: "Jacques Cartier", waterway: "St. Lawrence River", location: "Stadacona",
    given: "Taken to France from Gaspé in 1534 and returned in 1535 speaking French, the two guided Cartier's ships up the river to Stadacona and interpreted between him and their father.",
    outcome: "Cartier reached Stadacona and Hochelaga and learned the river's name and course; the Dictionary of Canadian Biography records that the brothers soon turned against the French.",
    cites: [DCB("donnacona_1E", "Donnacona")],
  },
  {
    id: "kg_stadacona_annedda", title: "The people of Stadacona cure Cartier's crew of scurvy", kind: "medicine_survival", year: 1536, yearLabel: "winter 1535–1536",
    personName: "Domagaya and the people of Stadacona", nation: "St. Lawrence Iroquoian", figure: "Donnacona", explorer: "Jacques Cartier", waterway: "St. Lawrence River", location: "Stadacona",
    given: "With twenty-five of his men dead of scurvy, Cartier learned from Domagaya the remedy the Stadaconans used: a drink boiled from the bark and leaves of the tree they called annedda.",
    outcome: "The crew recovered within days; Cartier's own account describes the tree and the cure, and the record of it is in the app's document on the scurvy winter.",
    cites: [DCB("donnacona_1E", "Donnacona"), { kind: "edition", author: "Jacques Cartier", title: "The Voyages of Jacques Cartier", container: "ed. H. P. Biggar, Publications of the Public Archives of Canada", year: "1924" }],
  },
  {
    id: "kg_kwah_fort_st_james", title: "Kwah lets Fraser and Stuart build Fort St. James and keeps the peace", kind: "diplomacy", year: 1806, yearLabel: "1806–1836",
    personName: "Kwah", nation: "Dakelh (Carrier)", figure: "Kwah", explorer: "Simon Fraser", waterway: "Stuart Lake", location: "Fort St. James",
    given: "The leading chief of the Nak'azdli allowed Simon Fraser and John Stuart to build on Stuart Lake in 1806, traded with the post for thirty years and kept the peace between his people and the newcomers.",
    outcome: "New Caledonia's first posts stood; in 1828 Kwah spared the clerk James Douglas, who went on to govern British Columbia.",
    cites: [DCB("kwah_7E", "Kwah")],
  },
  {
    id: "kg_amelia_douglas_1828", title: "Amelia Douglas saves James Douglas at Fort St. James", kind: "medicine_survival", year: 1828,
    personName: "Amelia Douglas", nation: "Cree-Métis", figure: "Amelia Douglas", explorer: "James Douglas", waterway: "Stuart Lake", location: "Fort St. James",
    given: "Weeks after her marriage, when Kwah's Dakelh seized her husband for killing an accused man, she and the interpreter's wife threw goods from the storeroom to the crowd and pleaded for his life until Kwah let him go.",
    outcome: "Douglas lived to govern Vancouver Island and British Columbia; she was the colony's first lady.",
    cites: [DCB("douglas_james_10E", "Douglas, Sir James")],
  },
  {
    id: "kg_ouligbuck_interpreter", title: "Ouligbuck interprets for Richardson, Dease and Simpson, and Rae", kind: "interpreting", year: 1837, yearLabel: "1826–1847",
    personName: "Ouligbuck", nation: "Inuit (western Hudson Bay)", figure: "Ouligbuck", explorer: "Sir John Richardson", waterway: "Repulse Bay", location: "Fort Hope",
    given: "Interpreter on Richardson's boat survey from the Mackenzie to the Coppermine in 1826, on all three seasons of Dease and Simpson's coastal survey of 1837–39, and with his son William at Rae's Repulse Bay winter of 1846–47; his judgement of weather and ice was relied on as much as his words.",
    outcome: "Three Arctic coastal surveys made in safety among the Inuit they met.",
    cites: [DCB("ooligbuck_8E", "Ooligbuck")],
  },
  {
    id: "kg_william_ouligbuck_1854", title: "William Ouligbuck translates the first word of Franklin's fate", kind: "interpreting", year: 1854, yearLabel: "April 1854",
    personName: "William Ouligbuck", nation: "Inuit (western Hudson Bay)", figure: "William Ouligbuck", explorer: "Dr. John Rae", waterway: "Repulse Bay", location: "Fort Hope",
    given: "Near Pelly Bay on 21 April 1854 he translated for Rae the words of In-nook-poo-zhe-jook, and over the following weeks the accounts of the Inuit who had seen the dead and their belongings.",
    outcome: "Rae carried the testimony to London; his report, in the app's documents, is the first account of the end of the Franklin expedition.",
    cites: [DCB("rae_john_1813_93_12E", "Rae, John"), TCE("franklin-search", "Franklin Search")],
  },
  {
    id: "kg_innookpoozhejook_testimony", title: "In-nook-poo-zhe-jook tells Rae, then Hall, what became of Franklin's men", kind: "testimony", year: 1854, yearLabel: "1854 and 1869",
    personName: "In-nook-poo-zhe-jook", nation: "Inuit (Netsilik)", figure: "In-nook-poo-zhe-jook", explorer: "Dr. John Rae", waterway: "Simpson Strait",
    given: "In 1854 he told Rae of about forty white men seen dragging a boat south along King William Island and of their bodies found later. In 1869 he told Charles Francis Hall far more, drew him a map of where the ships had been and the bodies lay, and led him to a skeleton.",
    outcome: "Rae's report of 1854 and Hall's search of 1869; the skeleton was later identified as Lieutenant Le Vesconte's, and the map pointed to where a ship was found in 2014.",
    cites: [TCE("franklin-search", "Franklin Search"), DCB("rae_john_1813_93_12E", "Rae, John"), DCB("hall_charles_francis_10E", "Hall, Charles Francis")],
  },
  {
    id: "kg_tookoolito_hall", title: "Tookoolito interprets for Hall, from Frobisher's mine to the Franklin testimony", kind: "interpreting", year: 1861, yearLabel: "1860–1871",
    personName: "Tookoolito", nation: "Inuit (Baffin Island)", figure: "Tookoolito", explorer: "Charles Francis Hall", waterway: "Frobisher Bay", location: "Kodlunarn Island",
    given: "Fluent in English since her visit to England in 1853, she was Hall's interpreter, teacher and guide for eleven years: her questions to the elders at Frobisher Bay found the site of Frobisher's mine of 1578, and at Repulse Bay and King William Island she translated the Inuit accounts of Franklin's men.",
    outcome: "Hall's recovery of the Frobisher relics (1861–62) and his Franklin testimony (1864–69).",
    cites: [DCB("hall_charles_francis_10E", "Hall, Charles Francis")],
  },
  {
    id: "kg_ebierbing_hall_schwatka", title: "Ebierbing guides Hall to King William Island and Schwatka after him", kind: "route_shown", year: 1869, yearLabel: "1860–1880",
    personName: "Ebierbing", nation: "Inuit (Baffin Island)", figure: "Ebierbing", explorer: "Charles Francis Hall", waterway: "Simpson Strait",
    given: "Hunter, dog-driver and guide on all three of Hall's expeditions, he led Hall to King William Island in 1869; his hunting kept nineteen people alive on the Polaris floe in 1872–73; and in 1878–80 he guided Schwatka's search of the island.",
    outcome: "Hall's and Schwatka's searches of the Franklin coast; nineteen lives on the floe.",
    cites: [DCB("hall_charles_francis_10E", "Hall, Charles Francis")],
  },
  {
    id: "kg_eenoolooapik_cumberland_sound", title: "Eenoolooapik maps Cumberland Sound for Penny and pilots the first ship in", kind: "map_drawn", year: 1839, yearLabel: "1839–1840",
    personName: "Eenoolooapik", nation: "Inuit (Baffin Island)", figure: "Eenoolooapik", explorer: "William Penny", waterway: "Cumberland Sound",
    given: "In Aberdeen in the winter of 1839 he drew Penny a map from memory of the great sound the whalers had never found; in the summer of 1840 he piloted Penny's Bon Accord into it.",
    outcome: "Cumberland Sound opened to the Scottish whale fishery for the next sixty years.",
    cites: [DCB("eenoolooapik_7E", "Eenoolooapik"), DCB("penny_william_12E", "Penny, William")],
  },
  {
    id: "kg_hans_hendrik_kane", title: "Hans Hendrik keeps Kane's men alive at Rensselaer Harbour", kind: "medicine_survival", year: 1854, yearLabel: "1853–1855",
    personName: "Hans Hendrik", nation: "Kalaallit (Greenlandic Inuit)", figure: "Hans Hendrik", explorer: "Elisha Kent Kane", waterway: "Smith Sound",
    given: "Hired at nineteen, his seal hunting and his friendship with the Inughuit of Etah fed Kane's party through two winters in Smith Sound; he later served Hayes, Hall and Nares, and his family was among the nineteen on the Polaris floe.",
    outcome: "Four polar expeditions served (1853–1876), and the first book by an Inuk about them, his Memoirs (1878).",
    cites: [DCB("hans_hendrik_11E", "Hans Hendrik")],
  },
  {
    id: "kg_jerry_potts_nwmp", title: "Jerry Potts leads the North-West Mounted Police to Fort Whoop-Up and the Oldman", kind: "route_shown", year: 1874, yearLabel: "1874–1896",
    personName: "Jerry Potts", nation: "Métis (Kainai-Scottish)", figure: "Jerry Potts", explorerName: "North-West Mounted Police", waterway: "Bow River",
    given: "Hired at Fort Benton in 1874, he led the exhausted force to Fort Whoop-Up and the Oldman River, and for twenty-two years found the way for the police across the southern plains in any weather, reading the country and the Blackfoot, and interpreting at Treaty 7.",
    outcome: "The police posts of the foothills, Fort Macleod first, and the treaty council of 1877.",
    cites: [DCB("potts_jerry_12E", "Potts, Jerry"), TCE("jerry-potts", "Jerry Potts")],
  },
  {
    id: "kg_keish_kaa_goox_klondike", title: "Keish and Káa Goox find the Klondike gold", kind: "discovery", year: 1896, yearLabel: "August 1896",
    personName: "Keish (Skookum Jim) and Káa Goox (Dawson Charlie)", nation: "Tagish", figure: "Keish", explorer: "George Carmack", waterway: "Klondike River", location: "Bonanza Creek Discovery Claim",
    given: "Looking for Keish's sister, the two Tagish men found her and her husband George Carmack at the Klondike's mouth and, in mid August, with him, found gold on Rabbit Creek, renamed Bonanza.",
    outcome: "Carmack staked the discovery claim and the Tagish men staked beside it; the claims paid close to a million dollars in four years and the rush of 1898 followed. The discovery is recorded under Carmack's name; the Tagish account puts the two men first.",
    cites: [DCB("keish_14E", "Keish (Skookum Jim, James Mason)"), DCB("kaa_goox_13E", "Káa Goox (Charlie, Dawson Charlie)"), TCE("klondike-gold-rush", "Klondike Gold Rush")],
  },
  {
    id: "kg_shawnadithit_cormack", title: "Shawnadithit records the Beothuk for William Cormack", kind: "testimony", year: 1828, yearLabel: "1828–1829",
    personName: "Shawnadithit", nation: "Beothuk", figure: "Shawnadithit", explorerName: "William Eppes Cormack", waterway: "Exploits River",
    given: "The last known Beothuk, taken in 1823, she spent her final winter with Cormack of the Beothuk Institution, drawing her people's camps, tools, canoes and their meetings with the settlers, and telling him their words and their history.",
    outcome: "Her drawings and accounts are the primary record of Beothuk life; she died of tuberculosis in St. John's in June 1829.",
    cites: [TCE("shawnadithit", "Shawnadithit"), DCB("shawnadithit_6E", "Shawnadithit"), DCB("cormack_william_eppes_9E", "Cormack, William Eppes")],
  },
  {
    id: "kg_mikak_tuglavina_nain", title: "Mikak and Tuglavina pilot the Moravians to the site of Nain", kind: "route_shown", year: 1770, yearLabel: "1770–1771",
    personName: "Mikak and Tuglavina", nation: "Labrador Inuit", figure: "Mikak", explorer: "Jens Haven", waterway: "Nain Bay", location: "Nain Moravian Mission",
    given: "Home from London, Mikak and her husband Tuglavina piloted the Moravian sloop along the coast to the place where the mission of Nain was built in 1771.",
    outcome: "The first Moravian mission in Labrador, and the start of two centuries of mission records on the coast.",
    cites: [DCB("mikak_4E", "Mikak"), DCB("tuglavina_4E", "Tuglavina")],
  },
  {
    id: "kg_mikak_london", title: "Mikak speaks for the Moravian land grant in London", kind: "diplomacy", year: 1768, yearLabel: "1768–1769",
    personName: "Mikak", nation: "Labrador Inuit", figure: "Mikak", explorer: "Jens Haven", waterway: "Nain Bay",
    given: "Sent to England by Governor Palliser in 1768, she met Jens Haven again in London and spoke for the Moravians' request for land in Labrador.",
    outcome: "The Privy Council granted the land in 1769; Haven founded Nain two years later with her help.",
    cites: [DCB("mikak_4E", "Mikak")],
  },
  {
    id: "kg_membertou_port_royal", title: "Membertou keeps Port-Royal for the French", kind: "diplomacy", year: 1607, yearLabel: "1605–1610",
    personName: "Membertou", nation: "Mi'kmaq", figure: "Membertou", explorer: "Samuel de Champlain", waterway: "Bay of Fundy", location: "Port-Royal (Habitation)",
    given: "The sakamow of the Annapolis Basin welcomed de Mons and Champlain in 1605 and, when the French left in 1607, guarded the empty habitation until they returned in 1610.",
    outcome: "Port-Royal stood when the French came back; Membertou's baptism in June 1610 was the first recorded in New France.",
    cites: [DCB("membertou_1E", "Membertou")],
  },
  {
    id: "kg_tessouat_vignau", title: "Tessouat shows Champlain that Vignau's northern sea was a lie", kind: "testimony", year: 1613, yearLabel: "June 1613",
    personName: "Tessouat", nation: "Kichesipirini Algonquin", figure: "Tessouat", explorer: "Samuel de Champlain", waterway: "Ottawa River", location: "Allumette Island",
    given: "Receiving Champlain on Allumette Island, the chief refused him canoes and guides to the Nipissing and proved before Champlain that the interpreter Nicolas de Vignau had never gone north and had invented the sea he claimed to have seen.",
    outcome: "Champlain turned back; the Ottawa above the island stayed closed to him, and the Kichesipirini kept their place as the river's middlemen.",
    cites: [DCB("tessouat_1636_1E", "Tessouat (d. 1636)")],
  },
  {
    id: "kg_comcomly_racoon", title: "Comcomly warns the Astorians of the British warship", kind: "diplomacy", year: 1813, yearLabel: "1811–1813",
    personName: "Comcomly", nation: "Chinook", figure: "Comcomly", explorer: "Gabriel Franchère", waterway: "Columbia River", location: "Fort Astoria / Fort George",
    given: "The Chinook chief at the Columbia's mouth welcomed the Astorians in 1811, became the post's intermediary with the river's peoples, and in 1813 warned them of the coming of HMS Racoon.",
    outcome: "Astoria passed to the North West Company without a fight; the Hudson's Bay Company later rewarded Comcomly for keeping the peace until his death in 1830.",
    cites: [DCB("mcdougall_duncan_5E", "McDougall, Duncan")],
  },
  {
    id: "kg_ac_ko_mok_ki_fidler_map", title: "Ac ko mok ki draws the Missouri country for Peter Fidler", kind: "map_drawn", year: 1801, yearLabel: "February 1801",
    personName: "Ac ko mok ki (A-ca-oo-mah-ca-ye, Old Swan)", nation: "Siksika (Blackfoot)", explorer: "Peter Fidler", waterway: "South Saskatchewan River", location: "Chesterfield House",
    given: "At Chesterfield House in February 1801 the Blackfoot chief drew Fidler a map of the country to the south: the rivers of the Missouri drainage, the line of the Rocky Mountains and the peoples along them.",
    outcome: "Fidler's map built on it was sent to London and, the Dictionary of Canadian Biography records, was instrumental in Aaron Arrowsmith's map of 1802, which Lewis and Clark carried up the Missouri in 1804.",
    cites: [DCB("a_ca_oo_mah_ca_ye_8E", "A-ca-oo-mah-ca-ye"), DCB("fidler_peter_6E", "Fidler, Peter")],
  },
  {
    id: "kg_iligliuk_parry_charts", title: "Iligliuk draws the coast of Melville Peninsula for Parry", kind: "map_drawn", year: 1822, yearLabel: "winter 1822",
    personName: "Iligliuk", nation: "Inuit (Iglulingmiut)", explorer: "Sir William Edward Parry", waterway: "Foxe Basin",
    given: "At Winter Island, where Parry's ships lay through the winter of 1822, Iligliuk drew the officers charts of the Melville Peninsula coast to the north and the strait beyond it.",
    outcome: "Parry's ships followed her charts to Igloolik and the strait he named Fury and Hecla; he printed her chart in his journal of 1824, one of the few maps drawn by an Inuk to survive.",
    cites: [{ kind: "archive", title: "Eskimaux Chart, No. 1. Drawn by Iligliuk at Winter Island, 1822", container: "John Carter Brown Library, map collection", url: "https://jcb.lunaimaging.com/luna/servlet/detail/JCB~1~1~4058~6400004" }, { kind: "article", author: "Kenn Harper", title: "Iligliuk, female cartographer extraordinaire", container: "Nunatsiaq News", url: "https://nunatsiaq.com/stories/article/iligliuk-female-cartographer-extraordinaire/" }, DCB("parry_william_edward_8E", "Parry, Sir William Edward")],
  },
];

async function main() {
  const [figures, explorers, waterways, locations] = await Promise.all([
    db.notableFigure.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.location.findMany({ select: { id: true, name: true } }),
  ]);
  const byName = (rows: { id: string; name: string }[]) => new Map(rows.map((r) => [r.name, r.id]));
  const F = byName(figures), E = byName(explorers), W = byName(waterways), L = byName(locations);
  const figureByStart = (name: string) => figures.find((f) => f.name.startsWith(name))?.id ?? null;

  const problems: string[] = [];
  const ids = new Set<string>();
  const rows = RECORDS.map((r) => {
    if (ids.has(r.id)) problems.push(`duplicate id ${r.id}`);
    ids.add(r.id);
    const figureId = r.figure ? F.get(r.figure) ?? figureByStart(r.figure) : null;
    if (r.figure && !figureId) problems.push(`figure not found: ${r.figure} (${r.id})`);
    const explorerId = r.explorer ? E.get(r.explorer) ?? null : null;
    if (r.explorer && !explorerId) problems.push(`explorer not found: ${r.explorer} (${r.id})`);
    const waterwayId = r.waterway ? W.get(r.waterway) ?? null : null;
    if (r.waterway && !waterwayId) problems.push(`waterway not found: ${r.waterway} (${r.id})`);
    const locationId = r.location ? L.get(r.location) ?? null : null;
    if (r.location && !locationId) problems.push(`location not found: ${r.location} (${r.id})`);
    if (!r.explorer && !r.explorerName) problems.push(`no explorer: ${r.id}`);
    if (r.cites.length === 0) problems.push(`no source: ${r.id}`);
    return { ...r, figureId, explorerId, waterwayId, locationId };
  });
  const before = await db.knowledgeGiven.findMany();
  const backupFile = writeBackup("2026-10-20-knowledge-given-before", { knowledgeGiven: before });
  if (problems.length) {
    report("ABORT", { problems });
    process.exitCode = 1;
    return;
  }
  report("knowledge given", { records: rows.length, citations: rows.reduce((n, r) => n + r.cites.length, 0), backupFile, plan: rows.map((r) => ({ id: r.id, kind: r.kind, year: r.year, person: r.personName, explorer: r.explorer ?? r.explorerName, figure: r.figureId, waterway: r.waterwayId, location: r.locationId, sources: r.cites.length })) });
  if (!APPLY) return;
  let i = 0;
  for (const r of rows) {
    i += 1;
    const data = {
      title: r.title, kind: r.kind, year: r.year, yearLabel: r.yearLabel ?? null, personName: r.personName, nation: r.nation,
      figureId: r.figureId, explorerId: r.explorerId, explorerName: r.explorerName ?? null, waterwayId: r.waterwayId, locationId: r.locationId,
      latitude: r.lat ?? null, longitude: r.lng ?? null, given: r.given, outcome: r.outcome, sortOrder: i,
    };
    await db.knowledgeGiven.upsert({ where: { id: r.id }, create: { id: r.id, ...data }, update: data });
    await db.citation.deleteMany({ where: { targetType: "knowledge_given", targetId: r.id } });
    let n = 0;
    for (const c of r.cites) {
      n += 1;
      await db.citation.create({ data: { id: `${r.id}-c${n}`, targetType: "knowledge_given", targetId: r.id, sortOrder: n, kind: c.kind, author: c.author ?? null, title: c.title, container: c.container ?? null, year: c.year ?? null, url: c.url ?? null, note: c.note ?? null, accessed: "2026-10-20" } });
    }
  }
  const verify = await db.knowledgeGiven.findMany({ select: { id: true, kind: true, title: true }, orderBy: { year: "asc" } });
  const cites = await db.citation.count({ where: { targetType: "knowledge_given" } });
  report("verify", { records: verify.length, citations: cites, byKind: Object.fromEntries(["route_shown", "map_drawn", "interpreting", "testimony", "medicine_survival", "discovery", "diplomacy"].map((k) => [k, verify.filter((v) => v.kind === k).length])) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
