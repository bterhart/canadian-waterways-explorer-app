// Reading guides for the records that had none, and a second kind of source for the records
// that leaned on one (2026-10-17, after the owner asked that the app not rest on a single
// source). Every URL is checked live at dry run: Wikipedia and most sites by HEAD, the
// Dictionary of Canadian Biography by page title, the Canadian Encyclopedia with a browser
// user agent; a guide whose URL fails is reported and the run stops. Guides without a URL
// point to a named archive, museum or edition. Idempotent: a guide whose title already exists
// for the target is skipped.
//   bun run prisma/turso-migrations/2026-10-17-reading-guide-gaps.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type G = { title: string; authorSource: string; url?: string; publisher?: string; year?: string; description: string; gradeLevel: "4-6" | "7-9" | "10-12" };
const wiki = (s: string) => `https://en.wikipedia.org/wiki/${s}`;
const dcb = (s: string) => `https://www.biographi.ca/en/bio/${s}.html`;
const tce = (s: string) => `https://www.thecanadianencyclopedia.ca/en/article/${s}`;
const pc = (s: string) => `https://parks.canada.ca/lhn-nhs/${s}`;
const nps = (s: string) => `https://www.nps.gov/${s}/index.htm`;
const mhs = (s: string) => `https://www.mhs.mb.ca/docs/sites/${s}.shtml`;
const W = (t: string, s: string, d: string): G => ({ title: t, authorSource: "Wikipedia", url: wiki(s), description: d, gradeLevel: "7-9" });
const DCB = (t: string, s: string, d: string): G => ({ title: t, authorSource: "Dictionary of Canadian Biography", url: dcb(s), description: d, gradeLevel: "10-12" });
const TCE = (t: string, s: string, d: string): G => ({ title: t, authorSource: "The Canadian Encyclopedia", url: tce(s), description: d, gradeLevel: "7-9" });
const PC = (t: string, s: string, d: string): G => ({ title: t, authorSource: "Parks Canada", url: pc(s), description: d, gradeLevel: "4-6" });
const NPS = (t: string, s: string, d: string): G => ({ title: t, authorSource: "U.S. National Park Service", url: nps(s), description: d, gradeLevel: "4-6" });
const MHS = (t: string, s: string, d: string): G => ({ title: t, authorSource: "Manitoba Historical Society", url: mhs(s), description: d, gradeLevel: "7-9" });
const HBCA = (post: string, d: string): G => ({ title: `${post} post records`, authorSource: "Hudson's Bay Company Archives", publisher: "Archives of Manitoba, Winnipeg", description: d, gradeLevel: "10-12" });
const BOOK = (t: string, a: string, pub: string, y: string, d: string, g: G["gradeLevel"] = "10-12"): G => ({ title: t, authorSource: a, publisher: pub, year: y, description: d, gradeLevel: g });

// targetType → target name → guides to add
const GUIDES: Record<"waterway" | "location" | "explorer" | "notable_figure", Record<string, G[]>> = {
  waterway: {
    "Bering Strait": [DCB("Cook, James", "cook_james_4E", "Cook's passage of the strait in 1778."), BOOK("A Voyage of Discovery into the South Sea and Beering's Straits, 1815-1818", "Kotzebue Otto von", "Longman, London", "1821", "Kotzebue's account of the strait and its peoples.")],
    "Peel Sound": [DCB("Franklin, Sir John", "franklin_john_7E", "Franklin's route down the sound in 1846, in his biography."), DCB("McClintock, Sir Francis Leopold", "mcclintock_francis_leopold_13E", "McClintock's attempt on the sound in 1858.")],
    "Prince Regent Inlet": [DCB("Ross, Sir John", "ross_john_8E", "The four winters of the Victory in the inlet."), DCB("Parry, Sir William Edward", "parry_william_edward_8E", "Parry's voyages into the inlet, 1819 and 1824-25.")],
    "Wellington Channel": [DCB("Bellot, Joseph-René", "bellot_joseph_rene_8E", "Bellot's death in the channel, 1853."), DCB("Penny, William", "penny_william_12E", "Penny's boat search of the channel, 1851.")],
    "Viscount Melville Sound": [DCB("Parry, Sir William Edward", "parry_william_edward_8E", "The winter at Melville Island, 1819-20."), DCB("Kellett, Sir Henry", "kellett_henry_10E", "The Resolute at Dealy Island and the rescue of McClure.")],
    "Amundsen Gulf": [DCB("Richardson, Sir John", "richardson_john_9E", "Richardson's survey of the gulf's southern shore, 1826."), DCB("Collinson, Sir Richard", "collinson_richard_11E", "Collinson's seasons in the gulf, 1851-52.")],
    "Kotzebue Sound": [DCB("Beechey, Frederick William", "beechey_frederick_william_8E", "Beechey's two seasons waiting in the sound, 1826-27."), BOOK("Narrative of a Voyage to the Pacific and Beering's Strait", "Beechey Frederick William", "Colburn and Bentley, London", "1831", "The first full description of the Iñupiat of the sound.")],
    "Hayes River": [TCE("Hayes River", "hayes-river", "The river from York Factory inland, a Canadian Heritage River."), W("Hayes River", "Hayes_River", "Course and the fur-trade route."), HBCA("York Factory", "The post at the river's mouth; journals from 1714.")],
    "Kaministiquia River": [W("Kaministiquia River", "Kaministiquia_River", "Course, Kakabeka Falls and the fur trade."), BOOK("Fort William Historical Park", "Fort William Historical Park", "Thunder Bay, Ontario", "", "The reconstructed North West Company depot at the river's mouth.", "4-6")],
    "Wisconsin River": [BOOK("Dictionary of Wisconsin History: Wisconsin River", "Wisconsin Historical Society", "Wisconsin Historical Society, Madison", "", "The state historical society's entry on the river and the Fox-Wisconsin portage.", "7-9"), BOOK("The Fox-Wisconsin Waterway", "Wisconsin Historical Society", "Wisconsin Historical Society, Madison", "", "Jolliet and Marquette's route and the portage at Portage, Wisconsin.", "7-9")],
    "Fox River (Wisconsin)": [BOOK("Dictionary of Wisconsin History: Fox River", "Wisconsin Historical Society", "Wisconsin Historical Society, Madison", "", "The river from Green Bay to the portage.", "7-9"), DCB("Nicollet de Belleborne, Jean", "nicollet_de_belleborne_jean_1E", "The first European on the river, 1634.")],
    "Richelieu River": [TCE("Richelieu River", "richelieu-river", "The river from Lake Champlain to the St. Lawrence."), PC("Fort Chambly National Historic Site", "qc/fortchambly", "The French fort on the Richelieu rapids.")],
    "Hudson River": [BOOK("The Island at the Center of the World", "Shorto Russell", "Doubleday", "2004", "New Netherland and the Hudson from the Dutch records.", "10-12"), BOOK("New Netherland Institute: Hudson River and New Netherland", "New Netherland Institute", "Albany, New York", "", "Translations of the Dutch colonial records of the river.", "10-12")],
    "Prince William Sound": [BOOK("Alaska Historical Society: Prince William Sound", "Alaska Historical Society", "Anchorage", "", "The sound's history from Chugach times through the Russian and American periods.", "7-9"), DCB("Cook, James", "cook_james_4E", "Cook's 1778 visit, in his biography.")],
    "Cook Inlet": [DCB("Cook, James", "cook_james_4E", "Cook's exploration of the inlet, 1778."), BOOK("Russian America: An Overseas Colony of a Continental Empire", "Vinkovetsky Ilya", "Oxford University Press", "2011", "The Russian posts on the inlet in the history of the colony.")],
    "Sitka Sound": [NPS("Sitka National Historical Park", "sitk", "The 1804 battle site, the Russian Bishop's House and Tlingit history."), BOOK("Anóoshi Lingít Aaní Ká: Russians in Tlingit America", "Dauenhauer Nora Marks, Dauenhauer Richard and Black Lydia T. eds.", "University of Washington Press", "2008", "The battles of 1802 and 1804 from Tlingit and Russian sources.")],
    "Clayoquot Sound": [DCB("Meares, John", "meares_john_5E", "Meares's trade at Clayoquot, 1788."), BOOK("Tofino and Clayoquot Sound: A History", "Horsfield Margaret and Kennedy Ian", "Harbour Publishing", "2014", "The sound's history from the Tla-o-qui-aht to the present.", "7-9")],
    "Willamette River": [BOOK("The Oregon Encyclopedia: Willamette River", "Oregon Historical Society", "Portland", "", "The river's history from the Kalapuya to the present.", "7-9"), NPS("Fort Vancouver National Historic Site", "fova", "The Hudson's Bay Company headquarters that farmed the Willamette.")],
  },
  location: {
    "Fort Enterprise": [BOOK("Narrative of a Journey to the Shores of the Polar Sea", "Franklin John", "John Murray, London", "1823", "Franklin's own account of the winter of 1820-21 and the starvation of 1821 at the fort."), W("Akaitcho", "Akaitcho", "The Yellowknives chief whose people built and relieved the fort.")],
    "Fort Franklin": [DCB("Franklin, Sir John", "franklin_john_7E", "The second expedition's base, in Franklin's biography."), BOOK("Narrative of a Second Expedition to the Shores of the Polar Sea", "Franklin John", "John Murray, London", "1828", "The two winters at Fort Franklin.")],
    "Fort Confidence": [DCB("Dease, Peter Warren", "dease_peter_warren_9E", "The builder of the post, 1837."), BOOK("Narrative of the Discoveries on the North Coast of America", "Simpson Thomas", "Richard Bentley, London", "1843", "The expedition's winters at Fort Confidence.")],
    "Herschel Island": [BOOK("Qikiqtaruk–Herschel Island Territorial Park", "Government of Yukon", "Whitehorse", "", "The park's history of the Inuvialuit, the whalers and the police post.", "4-6"), DCB("Franklin, Sir John", "franklin_john_7E", "Franklin named the island in 1826.")],
    "Icy Cape": [DCB("Cook, James", "cook_james_4E", "Cook's farthest north in the Pacific, 1778."), BOOK("Narrative of a Voyage to the Pacific and Beering's Strait", "Beechey Frederick William", "Colburn and Bentley, London", "1831", "The barge's passage of the cape to Point Barrow in 1826.")],
    "Port Leopold": [W("Port Leopold", "Port_Leopold", "The harbour and the search expedition's winter."), BOOK("Narrative of the Arctic Land Expedition", "Back George", "John Murray, London", "1836", "Back's and Ross's Arctic context; see also Ross's own reports in the Parliamentary Papers of 1850.")],
    "Dealy Island": [W("Melville Island (Northwest Territories and Nunavut)", "Melville_Island_(Northwest_Territories_and_Nunavut)", "The island off which the Resolute wintered."), BOOK("The Discovery of the North-West Passage by H.M.S. Investigator", "McClure Robert; Osborn Sherard ed.", "Longman, London", "1856", "The rescue of McClure's crew by the sledge from Dealy Island.")],
    "Lower Fort Garry": [PC("Lower Fort Garry National Historic Site", "mb/fortgarry", "The stone fort on the Red River, built 1830."), MHS("Lower Fort Garry", "lowerfortgarry", "The Manitoba Historical Society's page on the fort."), HBCA("Lower Fort Garry", "Post journals and correspondence, 1830-1911.")],
    "Fort Ellice": [MHS("Fort Ellice", "fortellice", "The Manitoba Historical Society's page on the post at the Qu'Appelle's mouth."), HBCA("Fort Ellice", "Post journals, 1831-1890.")],
    "Fort Kaministiquia": [TCE("Fort William", "fort-william", "The French post and its North West Company successor."), DCB("Greysolon Dulhut, Daniel", "greysolon_dulhut_daniel_2E", "The trader who built the first post at the river's mouth.")],
    "Sault Ste. Marie Post": [PC("Sault Ste. Marie Canal National Historic Site", "on/ssmarie", "The canal and the history of the Sault."), TCE("Sault Ste. Marie", "sault-ste-marie", "The city and the posts at the rapids.")],
    "Fort Augustus (NWC)": [TCE("Fort Edmonton", "fort-edmonton", "Fort Augustus and Edmonton House, the twin posts."), HBCA("Edmonton House", "The Hudson's Bay Company's journals from the post beside Fort Augustus, 1795-1800s.")],
    "Fort George (NWC - Saskatchewan)": [W("Fort George and Buckingham House", "Fort_George_and_Buckingham_House", "The twin posts of 1792-1800 near Elk Point."), DCB("McGillivray, Duncan", "mcgillivray_duncan_5E", "The clerk whose journal describes Fort George.")],
    "Fort McLeod (BC)": [W("McLeod Lake", "McLeod_Lake", "The lake and the post of 1805, the first west of the Rockies."), DCB("Fraser, Simon", "fraser_simon_9E", "The founder of the post.")],
    "Fort George (NWC - BC)": [W("Fort George, British Columbia", "Fort_George,_British_Columbia", "The post at the Nechako's mouth and the city of Prince George."), HBCA("Fort George (New Caledonia)", "Post journals, 1820s-1900s.")],
    "Fort Gibraltar": [MHS("Fort Gibraltar", "fortgibraltar", "The Manitoba Historical Society's page on the North West Company post at the Forks."), W("Fort Gibraltar", "Fort_Gibraltar", "The post and its destruction in 1816.")],
    "Fort Lac La Pluie (Fort Frances)": [TCE("Fort Frances", "fort-frances", "The town and the posts at the Rainy River's head."), HBCA("Fort Frances (Lac La Pluie)", "Post journals from 1793.")],
    "Fort Battleford": [PC("Fort Battleford National Historic Site", "sk/battleford", "The North-West Mounted Police post of 1876 and the events of 1885."), TCE("Battleford", "battleford", "The town and the territorial capital.")],
    "Fort Liard": [W("Fort Liard", "Fort_Liard", "The community and the post of 1805."), HBCA("Fort Liard", "Post journals, 1820s-1900s.")],
    "Fort Simpson (BC)": [W("Lax Kw'alaams", "Lax_Kw'alaams", "The Tsimshian community that grew beside Fort Simpson."), HBCA("Fort Simpson (Nass)", "Post journals from 1834 and the coast trade reports.")],
    "Fort McLoughlin": [W("Fort McLoughlin", "Fort_McLoughlin", "The Hudson's Bay Company post of 1833 at Bella Bella."), BOOK("Trading Beyond the Mountains: The British Fur Trade on the Pacific, 1793-1843", "Mackie Richard Somerset", "UBC Press", "1997", "The coast posts, Fort McLoughlin among them.")],
    "Rupert House (Fort Charles)": [W("Waskaganish", "Waskaganish", "The Cree community on the site of the first Hudson's Bay Company post."), HBCA("Rupert House", "Post journals from 1668, the oldest in the archive.")],
    "Fort Niagara": [BOOK("Old Fort Niagara", "Old Fort Niagara Association", "Youngstown, New York", "", "The fort's own history, from the French castle of 1726 to the present.", "4-6"), DCB("Léry, Gaspard-Joseph Chaussegros de", "chaussegros_de_lery_gaspard_joseph_1682_1756_3E", "The engineer who built the French castle at Niagara.")],
    "Fort Crèvecoeur": [DCB("Tonty, Henri de", "tonty_henri_2E", "The officer left in command of the fort in 1680."), DCB("Cavelier de La Salle, René-Robert", "cavelier_de_la_salle_rene_robert_1E", "The builder of the fort.")],
    "Fort Saint-Louis (Starved Rock)": [DCB("Tonty, Henri de", "tonty_henri_2E", "Tonty's twenty years at the Rock."), BOOK("Starved Rock State Park", "Illinois Department of Natural Resources", "Springfield, Illinois", "", "The park on the site of La Salle's fort.", "4-6")],
    "Michilimackinac": [BOOK("Mackinac State Historic Parks: Colonial Michilimackinac", "Mackinac State Historic Parks", "Mackinac Island, Michigan", "", "The reconstructed fort and its archaeology.", "4-6"), DCB("Henry, Alexander (1739-1824)", "henry_alexander_1739_1824_6E", "The trader who survived the capture of the fort in 1763.")],
    "Fort Orange": [BOOK("New Netherland Institute: Fort Orange", "New Netherland Institute", "Albany, New York", "", "The Dutch post of 1624 and the translated colonial records.", "10-12"), BOOK("A Description of New Netherland (1655)", "Van der Donck Adriaen; Gehring Charles T. and Starna William A. eds.", "University of Nebraska Press", "2008", "The contemporary Dutch account.")],
    "New Amsterdam": [BOOK("New Netherland Institute: New Amsterdam", "New Netherland Institute", "Albany, New York", "", "The Dutch town and its records.", "10-12"), BOOK("The Island at the Center of the World", "Shorto Russell", "Doubleday", "2004", "New Amsterdam from the Dutch records.")],
    "Fort Pontchartrain du Détroit": [DCB("Laumet, dit de Lamothe Cadillac, Antoine", "laumet_antoine_2E", "The founder of Detroit, 1701."), BOOK("Detroit Historical Society: Fort Pontchartrain", "Detroit Historical Society", "Detroit", "", "The French fort of 1701 and the city that grew from it.", "7-9")],
    "Fort Saint-Frédéric": [BOOK("Crown Point State Historic Site", "New York State Office of Parks, Recreation and Historic Preservation", "Crown Point, New York", "", "The French fort of 1734 and the British fort beside it.", "4-6"), DCB("Lusignan, Paul-Louis Dazemard de", "dazemard_de_lusignan_paul_louis_3E", "A commandant of the fort in the 1740s.")],
    "Fort Carillon": [BOOK("Fort Ticonderoga", "Fort Ticonderoga Association", "Ticonderoga, New York", "", "The fort's museum and its history from Carillon to the Revolution.", "4-6"), DCB("Montcalm, Louis-Joseph de", "montcalm_louis_joseph_de_3E", "The victor of Carillon, 1758.")],
    "Fort de Chartres": [BOOK("Fort de Chartres State Historic Site", "Illinois Department of Natural Resources", "Prairie du Rocher, Illinois", "", "The reconstructed French fort of the Illinois Country.", "4-6"), DCB("Boisbriand, Pierre Dugué de", "dugue_de_boisbriand_pierre_2E", "The first commandant of the Illinois, who built the fort in 1720.")],
    "Kaskaskia": [BOOK("Illinois State Historical Society: Kaskaskia", "Illinois State Historical Society", "Springfield, Illinois", "", "The French village and first state capital.", "7-9"), DCB("Marquette, Jacques", "marquette_jacques_1E", "The founder of the mission to the Kaskaskia, 1675.")],
    "New Orleans": [DCB("Le Moyne de Bienville, Jean-Baptiste", "le_moyne_de_bienville_jean_baptiste_3E", "The founder of New Orleans, 1718."), BOOK("The Historic New Orleans Collection", "The Historic New Orleans Collection", "New Orleans", "", "The museum and research centre for the French and Spanish city.", "7-9")],
    "La Baye (Green Bay)": [BOOK("Dictionary of Wisconsin History: La Baye", "Wisconsin Historical Society", "Wisconsin Historical Society, Madison", "", "The French post at Green Bay.", "7-9"), DCB("Nicollet de Belleborne, Jean", "nicollet_de_belleborne_jean_1E", "The first European at the bay, 1634.")],
    "Prairie du Chien": [BOOK("Dictionary of Wisconsin History: Prairie du Chien", "Wisconsin Historical Society", "Wisconsin Historical Society, Madison", "", "The village at the Wisconsin's mouth and the fur-trade rendezvous.", "7-9"), DCB("Marquette, Jacques", "marquette_jacques_1E", "Jolliet and Marquette's entry to the Mississippi here, 1673.")],
    "Fort Okanogan": [BOOK("HistoryLink: Fort Okanogan", "HistoryLink.org, the free online encyclopedia of Washington state history", "Seattle", "", "The Pacific Fur Company post of 1811 and its successors.", "7-9"), DCB("Ross, Alexander", "ross_alexander_8E", "The co-founder's biography.")],
    "Fort Nisqually": [BOOK("HistoryLink: Fort Nisqually", "HistoryLink.org, the free online encyclopedia of Washington state history", "Seattle", "", "The Hudson's Bay Company post of 1833 and the Puget's Sound Agricultural Company.", "7-9"), HBCA("Fort Nisqually", "Post journals, 1833-1859.")],
    "Novo-Arkhangelsk (Sitka)": [NPS("Sitka National Historical Park", "sitk", "The Russian Bishop's House and the history of the Russian capital."), BOOK("Russian America: An Overseas Colony of a Continental Empire", "Vinkovetsky Ilya", "Oxford University Press", "2011", "Sitka as the capital of the colony.")],
    "Fort Fraser": [DCB("Fraser, Simon", "fraser_simon_9E", "The founder of the post, 1806."), HBCA("Fort Fraser", "Post journals, 1820s-1900s.")],
    "Fort Boise": [BOOK("Idaho State Historical Society: Fort Boise", "Idaho State Historical Society", "Boise", "", "The Hudson's Bay Company post on the Snake and the Oregon Trail.", "7-9"), HBCA("Fort Boise", "Post journals, 1834-1855.")],
    "Fort Clatsop": [NPS("Lewis and Clark National Historical Park", "lewi", "The reconstructed fort and the winter of 1805-06."), BOOK("The Journals of the Lewis and Clark Expedition", "Moulton Gary E. ed.", "University of Nebraska Press", "1983-2001", "The daily record of the winter at Fort Clatsop, vol. 6.")],
    "Celilo Falls": [BOOK("The Oregon Encyclopedia: Celilo Falls", "Oregon Historical Society", "Portland", "", "The falls, the fishery and the dam of 1957.", "7-9"), BOOK("Death of Celilo Falls", "Barber Katrine", "University of Washington Press", "2005", "The flooding of the falls and the people of Celilo Village.")],
    "Opitsaht": [W("Tla-o-qui-aht First Nations", "Tla-o-qui-aht_First_Nations", "The nation whose village Opitsaht is."), DCB("Meares, John", "meares_john_5E", "Meares at Clayoquot and Opitsaht, 1788.")],
    "Fort Stikine": [HBCA("Fort Stikine", "Post journals, 1840-1849, including the murder of John McLoughlin Jr."), DCB("McLoughlin, John", "mcloughlin_john_8E", "The chief factor whose son was killed at the post in 1842.")],
    "Howse Pass": [DCB("Howse, Joseph", "howse_joseph_8E", "The Hudson's Bay Company man the pass is named for."), DCB("Thompson, David", "thompson_david_1770_1857_8E", "Thompson's crossings of 1807-1810.")],
  },
  explorer: {
    "Otto von Kotzebue": [BOOK("A Voyage of Discovery into the South Sea and Beering's Straits, 1815-1818", "Kotzebue Otto von", "Longman, London", "1821", "His own narrative of the Rurik voyage, with Chamisso's observations."), BOOK("A Voyage Around the World with the Romanzov Exploring Expedition in the Years 1815-1818", "Chamisso Adelbert von; Kratz Henry trans.", "University of Hawaii Press", "1986", "The naturalist's account of the same voyage.")],
    "Otto Sverdrup": [BOOK("New Land: Four Years in the Arctic Regions", "Sverdrup Otto", "Longmans, Green, London", "1904", "His own account of the second Fram expedition."), BOOK("The Fram Museum, Oslo", "Fram Museum", "Oslo", "", "The ship and the expedition's collections.", "4-6")],
    "John Stuart": [W("John Stuart (explorer)", "John_Stuart_(explorer)", "Life and New Caledonia."), HBCA("Fort St. James", "Stuart's district correspondence, 1821-1824.")],
    "Samuel Black": [W("Samuel Black (fur trader)", "Samuel_Black_(fur_trader)", "Life, the Finlay journey and Kamloops."), BOOK("A Journal of a Voyage from Rocky Mountain Portage in Peace River to the Sources of Finlays Branch and North West Ward in Summer 1824", "Black Samuel; Rich E.E. and Johnson A.M. eds.", "Hudson's Bay Record Society", "1955", "Black's own journal of the Finlay expedition.")],
    "Manuel Quimper": [BOOK("Spanish Explorations in the Strait of Juan de Fuca", "Wagner Henry R.", "Fine Arts Press, Santa Ana", "1933", "Quimper's 1790 diary in translation, with Eliza's and the others.")],
    "Charles William Barkley": [W("Charles William Barkley", "Charles_William_Barkley", "Life and the Imperial Eagle."), BOOK("The Remarkable World of Frances Barkley, 1769-1845", "Hill Beth", "Gray's Publishing", "1978", "The voyage from his wife's diary.", "7-9")],
    "Peter Puget": [BOOK("HistoryLink: Peter Puget", "HistoryLink.org, the free online encyclopedia of Washington state history", "Seattle", "", "Puget's boat survey of 1792 and the naming of the sound.", "7-9"), BOOK("The Voyage of George Vancouver 1791-1795", "Lamb W. Kaye ed.", "Hakluyt Society", "1984", "Puget's survey in the expedition's record.")],
    "Gabriel Franchère": [W("Gabriel Franchère", "Gabriel_Franchère", "Life and the Astoria narrative."), BOOK("Narrative of a Voyage to the Northwest Coast of America in the Years 1811, 1812, 1813 and 1814", "Franchère Gabriel; Huntington J.V. trans.", "Redfield, New York", "1854", "His own account, in the first English translation.")],
    "David Stuart": [DCB("Stuart, John (1780-1847)", "stuart_john_1780_1847_7E", "His North West Company contemporary in New Caledonia."), BOOK("Adventures of the First Settlers on the Oregon or Columbia River", "Ross Alexander", "Smith, Elder, London", "1849", "Ross's first-hand account of Stuart at Fort Okanogan and Kamloops.")],
    "William Clark": [BOOK("The Journals of the Lewis and Clark Expedition", "Moulton Gary E. ed.", "University of Nebraska Press", "1983-2001", "Clark's journals and maps, the fuller of the two captains' records."), BOOK("Wilderness Journey: The Life of William Clark", "Jones Landon Y.", "Hill and Wang", "2004", "A full biography.")],
    "Jaco Finlay": [W("Jaco Finlay", "Jaco_Finlay", "Life and Spokane House."), DCB("Thompson, David", "thompson_david_1770_1857_8E", "Thompson's biography, with Finlay's part in the Howse Pass crossing.")],
  },
  notable_figure: {
    "Ouligbuck": [BOOK("Narrative of the Discoveries on the North Coast of America", "Simpson Thomas", "Richard Bentley, London", "1843", "Ouligbuck as the expedition's interpreter, 1837-39."), BOOK("Narrative of an Expedition to the Shores of the Arctic Sea in 1846 and 1847", "Rae John", "T. and W. Boone, London", "1850", "Ouligbuck and his son at Repulse Bay.")],
    "Eenoolooapik": [BOOK("A Narrative of Some Passages in the History of Eenoolooapik, a Young Esquimaux", "M'Donald Alexander", "Fraser and Company, Edinburgh", "1841", "The first published biography of an Inuk, by the ship's surgeon who knew him; digitized at the Internet Archive."), W("Eenoolooapik", "Eenoolooapik", "Life and the opening of Cumberland Sound.")],
    "Sacagawea": [BOOK("The Journals of the Lewis and Clark Expedition", "Moulton Gary E. ed.", "University of Nebraska Press", "1983-2001", "Every mention of Sacagawea in the captains' journals, 1804-1806."), W("Sacagawea", "Sacagawea", "Life and the expedition."), NPS("Lewis and Clark National Historic Trail", "lecl", "The trail and the people of the expedition.")],
    "Saukamappee": [W("Piikani Nation", "Piikani_Nation", "The nation Saukamappee was adopted into."), BOOK("David Thompson's Narrative of his Explorations in Western America", "Thompson David; Tyrrell J.B. ed.", "Champlain Society", "1916", "Thompson's record of Saukamappee's account of the Piikani's first horses, guns and smallpox, as told to him in 1787-88.")],
    "Tattannoeuck": [DCB("Tattannoeuck", "tattannoeuck_6E", "Scholarly biography of the interpreter Augustus."), BOOK("Narrative of a Journey to the Shores of the Polar Sea", "Franklin John", "John Murray, London", "1823", "Franklin's account of Augustus and Junius on the first expedition.")],
    "Keskarrah": [BOOK("Narrative of a Journey to the Shores of the Polar Sea", "Franklin John", "John Murray, London", "1823", "Franklin's and Richardson's account of Keskarrah, the Yellowknife guide, and his daughter."), BOOK("To the Arctic by Canoe, 1819-1821: The Journal and Paintings of Robert Hood", "Houston C. Stuart ed.", "McGill-Queen's University Press", "1974", "Hood's portrait of Keskarrah and his daughter, and his journal."), W("Akaitcho", "Akaitcho", "The Yellowknives chief with whom Keskarrah served.")],
    "Roderick McKenzie": [DCB("McKenzie, Roderick", "mckenzie_roderick_8E", "Scholarly biography."), HBCA("Île-à-la-Crosse", "Journals of the district McKenzie commanded.")],
    "Membertou": [W("Henri Membertou", "Henri_Membertou", "Life of the Mi'kmaq sagamore."), BOOK("The Jesuit Relations and Allied Documents, vol. 1-2", "Thwaites Reuben Gold ed.", "Burrows Brothers, Cleveland", "1896", "Biard's and Lescarbot's accounts of Membertou and Port-Royal.")],
    "Wickaninnish": [DCB("Meares, John", "meares_john_5E", "Meares's dealings with Wickaninnish, 1788."), W("Tla-o-qui-aht First Nations", "Tla-o-qui-aht_First_Nations", "His nation today.")],
    "Kwah": [W("Kwah", "Kwah", "Life and the 1828 confrontation."), BOOK("Sixteen Years in the Indian Country: The Journal of Daniel Williams Harmon", "Harmon Daniel Williams; Lamb W. Kaye ed.", "Macmillan", "1957", "Harmon's record of Kwah and Stuart Lake, 1811-1819.")],
    "Alexander Baranov": [BOOK("Baranov, Chief Manager of the Russian Colonies in America", "Khlebnikov Kyrill T.; Pierce Richard A. ed.", "Limestone Press, Kingston", "1973", "The 1835 biography by his colleague, in translation."), BOOK("Russian America: An Overseas Colony of a Continental Empire", "Vinkovetsky Ilya", "Oxford University Press", "2011", "Baranov's rule in the history of the colony.")],
    "Grigory Shelikhov": [BOOK("A History of the Russian-American Company", "Tikhmenev P.A.; Pierce Richard A. and Donnelly Alton S. trans.", "University of Washington Press", "1978", "The company's official history of 1861-63, with Shelikhov's founding."), BOOK("Russian America: An Overseas Colony of a Continental Empire", "Vinkovetsky Ilya", "Oxford University Press", "2011", "Shelikhov in the history of the colony.")],
  },
};

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function check(url: string): Promise<string | null> {
  try {
    if (url.includes("biographi.ca")) { const html = await (await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } })).text(); return /<title>Biography not found/.test(html) ? "DCB biography not found" : null; }
    if (url.includes("thecanadianencyclopedia")) { const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": BROWSER_UA, Accept: "text/html" } }); return r.status === 200 ? null : `${r.status}`; }
    let r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": BROWSER_UA } });
    if (r.status === 405 || r.status === 403) r = await fetch(url, { redirect: "follow", headers: { "User-Agent": BROWSER_UA, Accept: "text/html" } });
    return r.ok ? null : `${r.status}`;
  } catch (e) { await new Promise((r) => setTimeout(r, 3000)); try { const r2 = await fetch(url, { redirect: "follow", headers: { "User-Agent": BROWSER_UA, Accept: "text/html" } }); return r2.ok ? null : `${r2.status}`; } catch (e2) { return String(e2).slice(0, 60); } }
}

async function main() {
  const [ww, loc, ex, fig, existing] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }), db.notableFigure.findMany({ select: { id: true, name: true } }),
    db.readingGuide.findMany({ select: { targetType: true, targetId: true, title: true, sortOrder: true } }),
  ]);
  const ids = { waterway: new Map(ww.map((x) => [x.name, x.id])), location: new Map(loc.map((x) => [x.name, x.id])), explorer: new Map(ex.map((x) => [x.name, x.id])), notable_figure: new Map(fig.map((x) => [x.name.replace(/\s*\(.*\)$/, ""), x.id])) };
  const problems: string[] = []; const rows: Array<{ id: string; targetType: string; targetId: string; sortOrder: number; title: string; authorSource: string; publisher: string | null; year: string | null; url: string | null; description: string; gradeLevel: string }> = [];
  const checked = new Map<string, string | null>();
  for (const [type, byName] of Object.entries(GUIDES) as Array<[keyof typeof GUIDES, Record<string, G[]>]>) {
    for (const [name, guides] of Object.entries(byName)) {
      const targetId = ids[type].get(name); if (!targetId) { problems.push(`${type} not found: ${name}`); continue; }
      const have = existing.filter((e) => e.targetType === type && e.targetId === targetId);
      let next = have.reduce((m, e) => Math.max(m, e.sortOrder), -1) + 1;
      for (const g of guides) {
        if (have.some((e) => e.title === g.title)) continue;
        if (g.url) { if (!checked.has(g.url)) { checked.set(g.url, await check(g.url)); await new Promise((r) => setTimeout(r, 250)); } const bad = checked.get(g.url); if (bad) { problems.push(`${bad} ${g.url} (${name})`); continue; } }
        rows.push({ id: `rg_${type}_${targetId}_${next}`, targetType: type, targetId, sortOrder: next++, title: g.title, authorSource: g.authorSource, publisher: g.publisher ?? null, year: g.year ?? null, url: g.url ?? null, description: g.description, gradeLevel: g.gradeLevel });
      }
    }
  }
  const backupFile = writeBackup("2026-10-17-reading-guide-gaps-plan", { rows });
  const byTarget = new Map<string, number>(); for (const r of rows) byTarget.set(`${r.targetType}:${r.targetId}`, (byTarget.get(`${r.targetType}:${r.targetId}`) ?? 0) + 1);
  report("reading-guide gaps", { targets: byTarget.size, guidesToInsert: rows.length, urlsChecked: checked.size, bySource: Object.fromEntries([...rows.reduce((m, r) => m.set(r.authorSource, (m.get(r.authorSource) ?? 0) + 1), new Map<string, number>())]), problems, backupFile });
  if (problems.length) throw new Error("Fix the problems above before applying.");
  if (!APPLY) return;
  await db.readingGuide.createMany({ data: rows });
  const all = await db.readingGuide.findMany({ select: { targetType: true, targetId: true, authorSource: true } });
  const kinds = new Map<string, Set<string>>(); for (const g of all) { const k = `${g.targetType}:${g.targetId}`; if (!kinds.has(k)) kinds.set(k, new Set()); kinds.get(k)!.add(g.authorSource); }
  report("verify", { guides: all.length, recordsWithGuides: kinds.size, singleSourceRecords: [...kinds.values()].filter((s) => s.size < 2).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
