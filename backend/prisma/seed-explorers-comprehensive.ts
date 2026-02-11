// Comprehensive seed file for early Canadian fur traders, explorers, adventurers, and cartographers
// Covers HBC, NWC/XY Company, French explorers, Indigenous leaders, women, Metis leaders

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ExplorerData {
  name: string;
  birthYear?: number;
  deathYear?: number;
  nationality: string;
  biography: string;
  notableAchievements: string;
  imageUrl?: string;
}

const explorers: ExplorerData[] = [
  // ==================== HBC EXPLORERS & FACTORS ====================
  {
    name: "Samuel Hearne",
    birthYear: 1745,
    deathYear: 1792,
    nationality: "English",
    biography: "Samuel Hearne was a Hudson's Bay Company explorer who made history as the first European to reach the Arctic Ocean overland from Hudson Bay. Between 1769 and 1772, he undertook three expeditions into the northern interior, the last guided by the Chipewyan leader Matonabbee. On July 17, 1771, Hearne reached the mouth of the Coppermine River at the Arctic Ocean, proving that no Northwest Passage existed through the continent at that latitude. His journey of over 5,000 kilometers took him through some of the most inhospitable terrain on Earth. In 1774, he established Cumberland House, the first inland HBC post, marking the company's expansion into the interior to compete with the Montreal traders. Hearne later served as governor of Prince of Wales Fort until its capture by the French in 1782. His posthumously published journal, 'A Journey from Prince of Wales's Fort in Hudson's Bay to the Northern Ocean,' remains a valuable ethnographic record of the Chipewyan people.",
    notableAchievements: "First European to reach Arctic Ocean overland from Hudson Bay (1771). Traveled over 5,000 km through the Barren Lands. Established Cumberland House, first HBC inland post (1774). Governor of Prince of Wales Fort. Published important ethnographic account of Chipewyan life. Proved no Northwest Passage existed at that latitude.",
  },
  {
    name: "Anthony Henday",
    birthYear: 1725,
    deathYear: 1770,
    nationality: "English",
    biography: "Anthony Henday was a Hudson's Bay Company explorer who in 1754-1755 became the first European to reach the Canadian prairies and sight the Rocky Mountains. Setting out from York Factory, he traveled with a group of Cree traders deep into what is now Alberta, reaching near present-day Red Deer in the fall of 1754. He attempted to convince the Blackfoot people to bring their furs to HBC posts on Hudson Bay, but they declined, preferring their equestrian lifestyle on the plains. Henday's journal provides the first European observations of Blackfoot culture, the vast buffalo herds of the prairies, and the distant Rocky Mountains. His expedition demonstrated both the rich potential of the western fur trade and the challenges the HBC would face competing with inland traders. Though his exact route is debated, his journey opened European awareness to the immense western interior.",
    notableAchievements: "First European to reach the Canadian prairies (1754). First European to sight the Rocky Mountains from the plains. First European to encounter and describe the Blackfoot Confederacy. Provided first detailed observations of prairie buffalo herds. Traveled over 2,000 km into the interior from York Factory.",
  },
  {
    name: "Henry Kelsey",
    birthYear: 1667,
    deathYear: 1724,
    nationality: "English",
    biography: "Henry Kelsey was a Hudson's Bay Company explorer and trader who became the first European to see the Canadian prairies and observe the bison herds that sustained Plains peoples. In 1690-1692, he traveled inland from York Factory with a group of Cree and Assiniboine people, reaching the grasslands of what is now Saskatchewan or Manitoba. His journal, written partly in verse, describes the prairies, the abundant wildlife including grizzly bears and musk oxen, and his observations of Indigenous peoples. Kelsey was remarkable for his ability to live among and communicate with First Nations peoples, learning their languages and customs. He later became governor of all HBC posts on Hudson Bay (1718-1722). His early journey demonstrated the potential of the interior fur trade, though the HBC would not establish inland posts for another 80 years.",
    notableAchievements: "First European to see the Canadian prairies (1690-1692). First European to observe and describe prairie bison herds. First European to encounter grizzly bears. Mastered Cree and Assiniboine languages. Governor of HBC posts on Hudson Bay (1718-1722). Wrote earliest surviving English literary work in Western Canada.",
  },
  {
    name: "James Knight",
    birthYear: 1640,
    deathYear: 1721,
    nationality: "English",
    biography: "James Knight was a Hudson's Bay Company governor and explorer whose career spanned crucial decades in the company's early history. He served as governor at York Factory and later at Prince of Wales Fort (Churchill), which he helped establish in 1717. Knight was driven by Indigenous reports of rich copper deposits far to the north and the possibility of a Northwest Passage. He sponsored the peace mission of Thanadelthur that opened trade with the Chipewyan people. In 1719, at nearly eighty years old, Knight led an expedition of two ships to search for the fabled copper mines and the passage. The expedition vanished, and it was not until 1767 that Samuel Hearne found the wreckage of their ships and remains of a winter camp on Marble Island, revealing that the entire party had perished. Knight's tragic end became one of the great mysteries of Arctic exploration.",
    notableAchievements: "Governor of York Factory and Prince of Wales Fort. Helped establish Fort Churchill (1717). Sponsored Thanadelthur's peace mission to the Chipewyan. Opened trade with the Chipewyan people. Led fatal expedition to find copper mines (1719). His expedition's fate remained a mystery for nearly 50 years.",
  },
  {
    name: "William Tomison",
    birthYear: 1739,
    deathYear: 1829,
    nationality: "Scottish (Orkney)",
    biography: "William Tomison was one of the Hudson's Bay Company's most important inland traders during the critical period of competition with the North West Company. An Orkneyman who joined the HBC in 1760, he rose to become master of all inland operations. Tomison established numerous posts in the Saskatchewan River country, including Edmonton House (1795), which would become one of the most significant trading posts in the West. He was instrumental in the HBC's expansion into the interior to counter the aggressive competition from Montreal traders. Known for his fairness in dealing with Indigenous peoples and his phenomenal endurance, Tomison spent over 30 winters in the interior, more than any other HBC officer of his era. He trained many younger traders and oversaw the transformation of the HBC from a coastal trading company into an inland commercial empire.",
    notableAchievements: "Master of all HBC inland operations. Established Edmonton House (1795). Spent over 30 winters in the interior. Led HBC expansion to compete with NWC. Established numerous Saskatchewan River posts. Trained generation of inland traders. Remarkable career spanning nearly 50 years.",
  },
  {
    name: "Joseph Colen",
    birthYear: 1751,
    deathYear: 1818,
    nationality: "English",
    biography: "Joseph Colen was a Hudson's Bay Company chief factor who served at York Factory during the intense competition with the North West Company. He was responsible for organizing inland expeditions and managing the company's response to the aggressive tactics of the Montreal traders. Colen was instrumental in sending Philip Turnor on surveying expeditions and supported the training of young surveyors like David Thompson and Peter Fidler. His administrative work helped establish the scientific cartography that became central to HBC operations. Colen advocated for more aggressive expansion into the interior to counter NWC competition, though the conservative London Committee was often slow to respond to his recommendations.",
    notableAchievements: "Chief Factor at York Factory during crucial period of NWC competition. Organized surveying expeditions led by Philip Turnor. Supported training of David Thompson and Peter Fidler. Advocated for HBC inland expansion. Coordinated company response to NWC competition.",
  },
  {
    name: "Matthew Cocking",
    birthYear: 1743,
    deathYear: 1799,
    nationality: "English",
    biography: "Matthew Cocking was a Hudson's Bay Company explorer and trader who made a significant journey into the interior in 1772-1773. Traveling from York Factory with a group of Indigenous guides, he reached the prairies near present-day central Saskatchewan, following a route similar to Anthony Henday's earlier expedition. His journal provides valuable observations about the inland peoples and their relationships with both the HBC and the pedlars from Montreal. Cocking documented the growing competition from Montreal traders and warned the HBC that it needed to establish inland posts to maintain its trade. He served at various posts on Hudson Bay and eventually became chief at York Factory. His reports helped convince the HBC to begin its inland expansion.",
    notableAchievements: "Inland expedition to Saskatchewan prairies (1772-1773). Documented growing competition from Montreal traders. Advocated for HBC inland expansion. Chief at York Factory. Provided detailed journals of Indigenous peoples and prairie landscape.",
  },
  {
    name: "George Simpson",
    birthYear: 1787,
    deathYear: 1860,
    nationality: "Scottish",
    biography: "Sir George Simpson was the most powerful figure in the North American fur trade, serving as Governor of Rupert's Land and later of all HBC territories in North America from 1821 to 1860. He managed the company's operations after its merger with the North West Company, implementing ruthless cost-cutting measures that made the HBC enormously profitable. Simpson was famous for his rapid canoe journeys across the continent, crossing from Hudson Bay to the Pacific and completing a journey around the world in 1841-1842. Known as the 'Little Emperor' for his autocratic style, he controlled an empire stretching from Labrador to the Pacific and from California to the Arctic. He established company policy on relations with Indigenous peoples and oversaw the HBC during the peak of its commercial and political power.",
    notableAchievements: "Governor of Rupert's Land (1821-1860). Managed HBC-NWC merger integration. Controlled largest fur trade empire in history. Circumnavigated the globe (1841-1842). Famous for record-breaking canoe journeys. Knighted in 1841. 'Little Emperor' of the fur trade.",
  },
  {
    name: "John McLoughlin",
    birthYear: 1784,
    deathYear: 1857,
    nationality: "Canadian (Quebec)",
    biography: "Dr. John McLoughlin was a larger-than-life figure who served as Chief Factor of the Columbia District for the Hudson's Bay Company from 1824 to 1846, effectively ruling the Pacific Northwest. Standing six feet four inches with white hair, he was an imposing presence known as the 'Father of Oregon.' McLoughlin established Fort Vancouver as headquarters and developed the company's network of posts from California to Alaska. He created agricultural settlements to make the district self-sufficient and welcomed American settlers, often providing them with supplies on credit against company policy. His humanitarian treatment of settlers contributed to American migration and ultimately American claims to the Oregon Territory. After conflicts with George Simpson over his policies, McLoughlin retired to Oregon City, where he became an American citizen.",
    notableAchievements: "Chief Factor of Columbia District (1824-1846). Built Fort Vancouver as Pacific headquarters. 'Father of Oregon' for assistance to American settlers. Established agricultural settlements for company self-sufficiency. Managed vast territory from California to Alaska. Created profitable Pacific fur trade operations.",
  },
  {
    name: "James Douglas",
    birthYear: 1803,
    deathYear: 1877,
    nationality: "British (born British Guiana)",
    biography: "Sir James Douglas began his career with the North West Company before the 1821 merger brought him into the Hudson's Bay Company. He rose to become Chief Factor and eventually Governor of Vancouver Island (1851-1864) and British Columbia (1858-1864). Douglas managed the company's Pacific operations during the turbulent gold rush era, maintaining order during the Fraser River and Cariboo gold rushes. Of mixed Scottish and Creole heritage, he married Amelia Connolly, a Metis woman, following the custom of the country. Douglas is credited with preserving British sovereignty over the Pacific Northwest during American expansion. He built roads, established colonial government, and transformed the region from a fur trading territory into a settled colony. He was knighted in 1863 and is considered the 'Father of British Columbia.'",
    notableAchievements: "Governor of Vancouver Island (1851-1864). Governor of British Columbia (1858-1864). 'Father of British Columbia.' Managed gold rush era crises. Built infrastructure including the Cariboo Road. Preserved British sovereignty in Pacific Northwest. Chief Factor of HBC. Knighted 1863.",
  },

  // ==================== NWC/XY COMPANY ====================
  {
    name: "Simon McTavish",
    birthYear: 1750,
    deathYear: 1804,
    nationality: "Scottish",
    biography: "Simon McTavish was the dominant figure in the North West Company and the Montreal fur trade for three decades. Known as 'Le Marquis' for his aristocratic pretensions, McTavish organized and controlled the coalition of Montreal merchants that formed the NWC. Through shrewd business dealings and relentless ambition, he accumulated vast wealth from the fur trade. His grand mansion in Montreal and plans for an even larger estate reflected his aspirations for social prominence. McTavish's business acumen transformed the NWC into the most successful competitor the Hudson's Bay Company ever faced. He controlled the company until his death in 1804, just as the XY Company challenge was resolved and before the intensified competition that would eventually lead to the 1821 merger with the HBC.",
    notableAchievements: "Dominant figure in North West Company for 30 years. Known as 'Le Marquis' for his wealth and ambition. Organized Montreal merchants into the NWC coalition. Built the most powerful fur trade company outside the HBC. Accumulated vast fortune from the fur trade. His death in 1804 marked the end of an era.",
  },
  {
    name: "Alexander Henry the Elder",
    birthYear: 1739,
    deathYear: 1824,
    nationality: "American (New Jersey)",
    biography: "Alexander Henry the Elder was a pioneering fur trader and explorer who was among the first English-speaking traders to venture into the Great Lakes region after the British conquest of New France. His memoir 'Travels and Adventures in Canada and the Indian Territories' (1809) provides a vivid account of the early British fur trade and his survival of the 1763 attack on Fort Michilimackinac during Pontiac's War, where he was saved by his Ojibwe friend Wawatam. Henry traveled extensively throughout the upper Great Lakes and into the Saskatchewan country. He later became a Montreal merchant and investor in the fur trade, though he never joined the North West Company partnership. His account remains one of the most important sources for the early post-conquest fur trade.",
    notableAchievements: "Survived attack on Fort Michilimackinac (1763). Published 'Travels and Adventures' (1809), major historical source. Pioneer English-speaking trader in Great Lakes region. Explored upper Great Lakes and Saskatchewan country. Provided detailed account of Ojibwe culture and early British fur trade.",
  },
  {
    name: "Alexander Henry the Younger",
    birthYear: 1765,
    deathYear: 1814,
    nationality: "Canadian",
    biography: "Alexander Henry the Younger, nephew of the Elder Alexander Henry, was a North West Company trader whose detailed journals provide an invaluable record of the fur trade and Indigenous peoples of the Red River and Rocky Mountain regions. He traded in the Red River area from 1799 to 1808 and later on the Pacific slope. His journals describe daily trading operations, relations with Indigenous peoples (including detailed ethnographic observations), the intense competition with the Hudson's Bay Company, and life at various NWC posts. Henry drowned in 1814 when his canoe capsized near Astoria during the transfer of the Pacific Fur Company to the NWC. His unedited journals, published in 1897, remain essential primary sources for fur trade history.",
    notableAchievements: "Kept detailed journals of Red River and Pacific fur trade. Major primary source for fur trade history. North West Company partner. Traded extensively in Red River region (1799-1808). Documented daily fur trade operations and Indigenous cultures. Journals provide unparalleled detail of NWC operations.",
  },
  {
    name: "Peter Pond",
    birthYear: 1740,
    deathYear: 1807,
    nationality: "American (Connecticut)",
    biography: "Peter Pond was a controversial but significant figure who opened the rich Athabasca fur trade. A veteran of the Seven Years' War, he became a fur trader in the 1760s and pushed into ever more remote regions. In 1778, he crossed the Methye Portage and established a post on the Athabasca River, opening the most productive fur region in North America. His maps, though based partly on Indigenous information and speculation, inspired Alexander Mackenzie's expeditions. Pond was a violent man, implicated in the deaths of two rival traders, which eventually forced him to leave the trade. Despite his flawed character, his geographic theories and the Athabasca trade he opened transformed the North West Company's fortunes.",
    notableAchievements: "Opened the Athabasca fur trade (1778). First trader to cross Methye Portage. His maps inspired Mackenzie's expeditions. Discovered richest fur region in North America. Pioneered route that became key to NWC success. Created early speculative maps of northwest.",
  },
  {
    name: "Simon Fraser",
    birthYear: 1776,
    deathYear: 1862,
    nationality: "American (Vermont), Loyalist",
    biography: "Simon Fraser was a North West Company partner and explorer who established the first European settlements west of the Rocky Mountains in New Caledonia (British Columbia). In 1808, he led a harrowing expedition down the river that now bears his name, hoping it was the Columbia. The Fraser River proved to be a terrifying torrent, with Fraser and his men forced to cling to cliff faces and navigate through deadly rapids. Upon reaching the Pacific, Fraser realized the river was not the Columbia and was useless as a trade route. Despite this disappointment, his expedition and the posts he established (including Fort George, Fort Fraser, and Fort St. James) secured the region for British interests. Fraser later retired to Ontario and lived to age 86.",
    notableAchievements: "Descended the Fraser River to the Pacific (1808). Established first European settlements in New Caledonia (BC). Built Fort George, Fort Fraser, Fort St. James. Secured British Columbia for British interests. His journals document one of the most harrowing river descents in exploration history. North West Company partner.",
  },
  {
    name: "Alexander Mackenzie",
    birthYear: 1764,
    deathYear: 1820,
    nationality: "Scottish",
    biography: "Sir Alexander Mackenzie was the first European to cross the North American continent north of Mexico, completing his epic journey to the Pacific Ocean on July 22, 1793. His first expedition in 1789 followed the river now bearing his name to the Arctic Ocean, a journey he considered a failure since he sought the Pacific. Learning from Indigenous guides and improving his navigation skills, his 1793 expedition from Fort Chipewyan crossed the Rockies and descended to the Pacific, where he famously painted on a rock: 'Alexander Mackenzie, from Canada, by land, the twenty-second of July, one thousand seven hundred and ninety-three.' His book 'Voyages from Montreal' (1801) brought him fame and a knighthood. Mackenzie's achievements pressured both the HBC and the British government to take the Pacific coast seriously.",
    notableAchievements: "First European to cross North America north of Mexico (1793). Discovered and descended the Mackenzie River to the Arctic (1789). Published 'Voyages from Montreal' (1801). Knighted in 1802. North West Company partner. Painted famous inscription at Bella Coola. Inspired Lewis and Clark expedition.",
  },
  {
    name: "Daniel Williams Harmon",
    birthYear: 1778,
    deathYear: 1843,
    nationality: "American (Vermont)",
    biography: "Daniel Williams Harmon was a North West Company trader whose journal, covering his years in the trade from 1800 to 1819, provides one of the most detailed accounts of fur trade life in the Athabasca and New Caledonia regions. A devout Protestant from New England, Harmon's journals reflect his moral struggles with the customs of the trade, including his own 'country marriage' to Lizette Duval, a Metis woman he eventually married legally and took east. His sixteen years of journal entries describe daily trading operations, relations with Indigenous peoples, the landscape and wildlife, and the social world of the fur trade posts. His 'Journal of Voyages and Travels in the Interior of North America' (1820) remains an important primary source.",
    notableAchievements: "Kept detailed journals 1800-1819 covering fur trade life. Published 'Journal of Voyages and Travels' (1820). Traded in Athabasca and New Caledonia regions. Documented social life at fur trade posts. His marriage to Lizette Duval challenged fur trade conventions. NWC trader for nearly two decades.",
  },
  {
    name: "David Thompson",
    birthYear: 1770,
    deathYear: 1857,
    nationality: "English (Welsh heritage)",
    biography: "David Thompson is widely considered the greatest land geographer in history, having surveyed and mapped over 4.9 million square kilometers of North American wilderness. Apprenticed to the Hudson's Bay Company at age 14, he was trained in surveying by Philip Turnor. Thompson defected to the North West Company in 1797 to pursue his passion for exploration and mapping. His meticulous astronomical observations and surveys produced the first accurate maps of western Canada. He traced the entire length of the Columbia River to its mouth (1811), mapped the Rocky Mountains, and documented countless rivers and lakes. Thompson married Charlotte Small, a Metis woman who accompanied him on many journeys. After the 1821 merger, he completed the landmark map of the Northwest for the NWC/HBC. He died in poverty and obscurity, his achievements only fully recognized in the 20th century.",
    notableAchievements: "Mapped over 4.9 million square kilometers. Greatest land geographer in history. Traced entire Columbia River to Pacific (1811). Trained by Philip Turnor in surveying. Produced first accurate maps of western Canada. Made over 1,000 astronomical observations. Married Charlotte Small, who accompanied his explorations. Created landmark 1814 map of the Northwest.",
  },
  {
    name: "William McGillivray",
    birthYear: 1764,
    deathYear: 1825,
    nationality: "Scottish",
    biography: "William McGillivray was the chief director of the North West Company during its final two decades, succeeding his uncle Simon McTavish in 1804. He oversaw the company during its most aggressive expansion and its bitter competition with the Hudson's Bay Company. McGillivray managed the merger of the NWC with the XY Company in 1804 and led the company through the violent conflicts of the Pemmican War, including the Seven Oaks Massacre of 1816. Though the NWC was ultimately forced to merge with the HBC in 1821, largely due to the financial strain of the competition, McGillivray negotiated terms that preserved some NWC interests. He was a sophisticated businessman who entertained lavishly at his Montreal home and the company's annual rendezvous at Fort William.",
    notableAchievements: "Chief Director of North West Company (1804-1821). Managed NWC-XY Company merger (1804). Led NWC during Pemmican War. Negotiated 1821 merger with HBC. Oversaw peak of NWC expansion. Built Fort William as grand interior headquarters.",
  },
  {
    name: "Duncan McGillivray",
    birthYear: 1770,
    deathYear: 1808,
    nationality: "Scottish",
    biography: "Duncan McGillivray was a North West Company partner and explorer who kept detailed journals of fur trade operations in the Saskatchewan River region. The nephew of Simon McTavish and brother of William McGillivray, he traded in the western interior from 1793 until illness forced his retirement. His journal from Fort George on the Saskatchewan (1794-1795) provides valuable details about trade relations with the Blackfoot Confederacy and Cree nations. McGillivray was particularly interested in crossing the Rocky Mountains and gathering geographic information about western routes. His early death at age 38 cut short a promising career. His journals were eventually published and remain important sources for understanding NWC operations and Indigenous relations.",
    notableAchievements: "NWC partner trading on Saskatchewan River. Kept detailed journals of western trade (1794-1795). Documented relations with Blackfoot and Cree. Gathered intelligence about Rocky Mountain routes. Nephew of Simon McTavish, brother of William McGillivray. His journals provide crucial fur trade history.",
  },
  {
    name: "John McDonald of Garth",
    birthYear: 1771,
    deathYear: 1866,
    nationality: "Scottish",
    biography: "John McDonald of Garth was one of the most experienced and colorful North West Company partners, serving in the trade for over 40 years. He began as a clerk in 1791 and rose to become a leading wintering partner. McDonald traded throughout the Northwest, from the Great Lakes to the Athabasca and Columbia districts. He was present at crucial moments in fur trade history and personally knew virtually every major figure of the era. After the 1821 merger, he continued briefly with the HBC before retiring to his estate in Quebec. In his old age, he dictated his memoirs, which provide unique firsthand accounts of NWC operations and personalities. He lived to 95, the last surviving partner of the original North West Company.",
    notableAchievements: "NWC partner for over 40 years. Traded from Great Lakes to Columbia. Last surviving original NWC partner. Dictated valuable memoirs in old age. Witnessed crucial moments in fur trade history. Served in Athabasca, Saskatchewan, and Columbia districts. Lived to age 95.",
  },
  {
    name: "Roderick Mackenzie",
    birthYear: 1761,
    deathYear: 1844,
    nationality: "Scottish",
    biography: "Roderick Mackenzie was a North West Company partner and the cousin of the famous explorer Alexander Mackenzie. He established Fort Chipewyan on Lake Athabasca in 1788, which became the most important post in the rich Athabasca fur trade and the launching point for Alexander Mackenzie's expeditions. Roderick was a capable administrator who managed the demanding logistics of the Athabasca trade. He also had scholarly interests, collecting documents and manuscripts related to the fur trade and Indigenous peoples. His collection became an important source for historians. After retirement, he lived in Quebec and compiled historical materials. His steady competence contrasted with his cousin's more dramatic achievements but was equally important to NWC success.",
    notableAchievements: "Established Fort Chipewyan (1788), key to Athabasca trade. Cousin of Alexander Mackenzie. Managed logistics for Mackenzie's expeditions. Collected important fur trade documents and manuscripts. NWC partner in Athabasca district. His collections became valuable historical sources.",
  },

  // ==================== FRENCH EXPLORERS/COUREURS DES BOIS ====================
  {
    name: "Pierre-Esprit Radisson",
    birthYear: 1636,
    deathYear: 1710,
    nationality: "French",
    biography: "Pierre-Esprit Radisson was one of the most remarkable adventurers of New France, whose explorations and shifting allegiances helped shape the North American fur trade. Captured by the Mohawk as a youth, he was adopted into the tribe and learned Indigenous languages and customs. With his brother-in-law Medard des Groseilliers, he made groundbreaking journeys into the interior, reaching Lake Superior and beyond. Frustrated by French colonial restrictions, the pair approached the English with their knowledge of the rich beaver territories of Hudson Bay. This led directly to the founding of the Hudson's Bay Company in 1670. Radisson switched allegiances between France and England multiple times, always seeking the best advantage for himself. His colorful memoirs, though sometimes unreliable, provide unique insights into early exploration and Indigenous relations.",
    notableAchievements: "Co-founder of Hudson's Bay Company (1670) through his geographic knowledge. Captured and adopted by Mohawk. Explored Lake Superior region. Mastered Indigenous languages and customs. Switched between French and English service. Wrote valuable memoirs of exploration and Indigenous life. One of the greatest coureurs des bois.",
  },
  {
    name: "Medard des Groseilliers",
    birthYear: 1618,
    deathYear: 1696,
    nationality: "French",
    biography: "Medard Chouart des Groseilliers was a French explorer and fur trader whose voyages into the interior of North America led directly to the founding of the Hudson's Bay Company. With his brother-in-law Pierre-Esprit Radisson, he explored the Lake Superior region in the 1650s and 1660s, learning from Indigenous peoples about the vast beaver-rich territories draining into Hudson Bay. When French authorities seized their furs and refused to support a Hudson Bay expedition, the pair approached English backers. Their knowledge convinced Prince Rupert and other investors to form the HBC in 1670. Des Groseilliers sailed on the Nonsuch to Hudson Bay in 1668, returning with furs that proved the viability of the bay trade. Though he eventually returned to French service, his role in founding the HBC makes him one of the most consequential figures in Canadian history.",
    notableAchievements: "Co-founder of Hudson's Bay Company through his exploration. Voyaged to Hudson Bay on the Nonsuch (1668). Explored Lake Superior region. Learned from Indigenous peoples about northern fur resources. His geographic knowledge convinced English investors to found HBC. One of the greatest coureurs des bois.",
  },
  {
    name: "Pierre Gaultier de Varennes, Sieur de La Vérendrye",
    birthYear: 1685,
    deathYear: 1749,
    nationality: "French Canadian",
    biography: "Pierre Gaultier de Varennes, Sieur de La Verendrye, was the greatest French explorer of the Canadian interior, establishing a network of posts from Lake Superior to the Saskatchewan River and sending his sons to explore as far as the Rocky Mountains. A veteran of European wars, he turned to exploration seeking both the Western Sea (Pacific) and wealth from the fur trade. Beginning in 1731, he and his sons built posts including Fort St. Charles, Fort Maurepas, Fort Rouge (Winnipeg), Fort La Reine, and Fort Dauphin, opening the rich interior trade. His sons reached the Black Hills or Rocky Mountains in 1742-1743, though their exact route is debated. La Verendrye faced constant financial difficulties and official criticism for prioritizing trade over exploration. He died planning another expedition, his dream of reaching the Western Sea unfulfilled.",
    notableAchievements: "Explored from Lake Superior to Saskatchewan River. Built network of interior posts including Fort Rouge (Winnipeg). His sons reached the Rocky Mountains/Black Hills (1742-1743). Opened interior trade for New France. Fort La Reine, Fort Maurepas, Fort Dauphin, Fort St. Charles. Greatest French explorer of Canadian interior.",
  },
  {
    name: "Louis-Joseph Gaultier de La Vérendrye",
    birthYear: 1717,
    deathYear: 1761,
    nationality: "French Canadian",
    biography: "Louis-Joseph Gaultier de La Verendrye, known as the 'Chevalier,' was the most ambitious explorer among La Verendrye's sons. In 1742-1743, he and his brother Francois led an expedition from Fort La Reine deep into the western interior, reaching mountains that were likely the Black Hills or the Big Horn Mountains, though some argue they saw the Rockies. They buried a lead plate claiming the territory for France, which was discovered by a schoolgirl in South Dakota in 1913. The Chevalier continued his father's work after the elder La Verendrye's death, but French support for western exploration waned. He served in the Seven Years' War and died during the French defense of Quebec in 1761. His expedition remains the farthest west that verified French exploration reached.",
    notableAchievements: "Led expedition to western mountains (1742-1743). Buried lead plate claiming territory for France. Farthest verified French exploration westward. Continued father's exploration after 1749. Served and died in Seven Years' War (1761). Son of La Verendrye.",
  },
  {
    name: "Etienne Brule",
    birthYear: 1592,
    deathYear: 1633,
    nationality: "French",
    biography: "Etienne Brule was the first European to live among the Indigenous peoples of Canada and explore the Great Lakes region. Sent by Samuel de Champlain to live with the Huron (Wendat) in 1610 when only about 18 years old, Brule mastered their language and customs, serving as interpreter and cultural intermediary. Over the next two decades, he explored more of North America than perhaps any European of his era, likely reaching all five Great Lakes, Lake Nipissing, and possibly as far as Chesapeake Bay. His exact travels are uncertain since he left no written records. Brule eventually fell out with Champlain after cooperating with the English during the Kirke brothers' occupation of Quebec. He was killed by the Huron in 1633 under circumstances that remain mysterious. Despite his shadowy record, Brule was a pathbreaking explorer.",
    notableAchievements: "First European to live among Indigenous peoples of interior Canada. First European to see Great Lakes (likely all five). Interpreter and guide for Champlain. Lived with Huron/Wendat for over 20 years. Mastered Huron language and customs. Explored more territory than any contemporary European.",
  },
  {
    name: "Jean Nicolet",
    birthYear: 1598,
    deathYear: 1642,
    nationality: "French",
    biography: "Jean Nicolet was a French explorer and interpreter who became the first European to reach Lake Michigan and explore what is now Wisconsin. Like Etienne Brule, Nicolet was sent to live among Indigenous peoples to learn their languages, spending years with the Algonquin and Nipissing peoples. In 1634, Champlain sent him westward to make contact with a people known as the 'People of the Sea' (the Ho-Chunk/Winnebago), hoping they might provide a route to China. Nicolet famously packed a Chinese ceremonial robe for the occasion. He reached Green Bay and traveled up the Fox River, establishing relations with the Ho-Chunk and other peoples. Though no route to Asia existed, Nicolet's journey opened French awareness to the lands beyond Lake Michigan. He drowned in the St. Lawrence River in 1642.",
    notableAchievements: "First European to reach Lake Michigan (1634). First European in Wisconsin. Explored Green Bay and Fox River. Interpreter who lived among Algonquin and Nipissing. Established French contact with Ho-Chunk (Winnebago) people. Expanded French knowledge of Great Lakes region.",
  },
  {
    name: "Louis Jolliet",
    birthYear: 1645,
    deathYear: 1700,
    nationality: "French Canadian",
    biography: "Louis Jolliet was a French Canadian explorer who, with Father Jacques Marquette, became the first Europeans to explore and map the upper Mississippi River. Born in Quebec and educated by the Jesuits, Jolliet combined scholarly training with practical skills as a fur trader and mapmaker. In 1673, he and Marquette paddled down the Mississippi from the Wisconsin River to the mouth of the Arkansas River, proving the Mississippi flowed south to the Gulf of Mexico rather than west to the Pacific. They turned back to avoid Spanish territory. Jolliet's maps and journals were lost when his canoe capsized near Montreal, forcing him to recreate them from memory. He later explored the Labrador coast and received the seigneury of Anticosti Island. His Mississippi expedition opened French claims to the vast Mississippi watershed.",
    notableAchievements: "Co-discovered upper Mississippi River (1673). First to map Mississippi from Wisconsin to Arkansas. Proved Mississippi flowed to Gulf of Mexico. Explored Labrador coast. Received Anticosti Island seigneury. Combined exploration with cartography and scholarship.",
  },
  {
    name: "Jacques Marquette",
    birthYear: 1637,
    deathYear: 1675,
    nationality: "French",
    biography: "Father Jacques Marquette was a Jesuit missionary and explorer who, with Louis Jolliet, became one of the first Europeans to explore the Mississippi River. Born in France and trained as a Jesuit, Marquette came to New France in 1666 and established missions among the Ottawa and Huron peoples. He mastered several Indigenous languages, which proved invaluable during the 1673 expedition. Marquette kept a detailed journal of the voyage, documenting the geography, wildlife, and peoples encountered along the Mississippi. After returning from the expedition, he attempted to establish a mission among the Illinois people but died on the journey in 1675, aged only 37. His journal, preserved by the Jesuits, became the primary account of the expedition after Jolliet's papers were lost.",
    notableAchievements: "Co-discovered upper Mississippi River (1673). Jesuit missionary to Ottawa and Huron. Mastered multiple Indigenous languages. Kept detailed journal of Mississippi expedition. Attempted to establish mission among Illinois people. His account became primary source for expedition.",
  },
  {
    name: "Rene-Robert Cavelier, Sieur de La Salle",
    birthYear: 1643,
    deathYear: 1687,
    nationality: "French",
    biography: "Rene-Robert Cavelier, Sieur de La Salle, was one of the most ambitious explorers of New France, who claimed the entire Mississippi River valley for France and named it Louisiana in honor of Louis XIV. After exploring the Great Lakes region in the 1670s, La Salle obtained royal permission to explore the Mississippi to its mouth. In 1682, he descended the river from the Illinois country to the Gulf of Mexico, claiming the vast watershed for France. He then attempted to establish a colony at the Mississippi's mouth by sea but landed instead on the Texas coast. After two years of searching for the river, his demoralized men mutinied and murdered him in 1687. Despite his tragic end, La Salle's claims established French Louisiana and challenged Spanish dominion over the Gulf region.",
    notableAchievements: "Descended Mississippi to Gulf of Mexico (1682). Claimed Louisiana for France. Explored Great Lakes region. Built Fort Frontenac and Fort Crevecoeur. Attempted Gulf Coast colony. His claims established French Louisiana. Explored more than any other French explorer.",
  },
  {
    name: "Pierre Le Moyne d'Iberville",
    birthYear: 1661,
    deathYear: 1706,
    nationality: "French Canadian",
    biography: "Pierre Le Moyne d'Iberville was the most accomplished military commander of New France and founder of French Louisiana. Born in Montreal to a prominent family, he participated in raids against English posts on Hudson Bay, capturing or destroying nearly every HBC fort during King William's War. His naval victories in Hudson Bay were remarkable achievements given English naval superiority. In 1699, Iberville was chosen to establish the colony of Louisiana, founding settlements at Biloxi and Mobile. He successfully located the mouth of the Mississippi River from the sea, completing La Salle's unfulfilled mission. Iberville continued military operations against English colonies in the Caribbean, where he died of yellow fever in Havana in 1706. He is considered the first great Canadian-born military hero.",
    notableAchievements: "Captured English posts on Hudson Bay multiple times. Founded French Louisiana (1699). Located Mississippi River mouth from sea. Founded Biloxi and Mobile. Greatest military commander of New France. Naval victories against superior English forces. First Canadian-born military hero.",
  },
  {
    name: "Antoine Laumet de La Mothe Cadillac",
    birthYear: 1658,
    deathYear: 1730,
    nationality: "French",
    biography: "Antoine Laumet de La Mothe Cadillac was a French colonial administrator and explorer who founded Detroit in 1701 to control the Great Lakes fur trade and prevent English expansion. A self-invented aristocrat who adopted his noble name, Cadillac arrived in New France in 1683 and commanded the post at Michilimackinac. Seeking to consolidate French control of the Great Lakes, he convinced Louis XIV to authorize a new settlement at the strait (detroit) between Lakes Erie and Huron. Fort Pontchartrain du Detroit became a major trading center and the foundation of modern Detroit. Cadillac later served as governor of Louisiana from 1710 to 1716, though his tenure was troubled by conflicts with other officials. His legacy lives on in the city he founded and the automobile brand named for him.",
    notableAchievements: "Founded Detroit (1701). Commanded Michilimackinac. Governor of Louisiana (1710-1716). Established Fort Pontchartrain du Detroit. Sought to prevent English expansion into Great Lakes. His founding of Detroit shaped Great Lakes history.",
  },

  // ==================== INDIGENOUS LEADERS & GUIDES ====================
  {
    name: "Thanadelthur",
    birthYear: 1697,
    deathYear: 1717,
    nationality: "Chipewyan (Dene)",
    biography: "Thanadelthur, known to the English as the 'Slave Woman,' was a Chipewyan woman whose diplomatic skills opened the northern fur trade to her people. Captured by a Cree raiding party around 1713, she eventually escaped and made her way to York Factory, arriving in late 1714. There she met HBC Governor James Knight, who recognized her exceptional abilities. In 1715-1716, she led an expedition with HBC employee William Stuart to broker peace between the Cree and Chipewyan peoples, who had been at war. Despite tremendous hardships including starvation and the near-failure of the mission, Thanadelthur's forceful diplomacy succeeded. Knight wrote that she had 'a Devillish Spirit' and was 'the Chief promoter and Actor' of the peace. This peace allowed the Chipewyan to trade safely at York Factory and led to the establishment of Fort Churchill. Tragically, Thanadelthur died of illness at York Factory in February 1717, at approximately twenty years of age.",
    notableAchievements: "Brokered historic peace between Cree and Chipewyan nations. Led HBC expedition into Barren Lands (1715-1716). Opened northern fur trade for Chipewyan people. Her diplomacy led to establishment of Fort Churchill. Escaped captivity and survived winter journey to York Factory. Recognized by HBC Governor James Knight for her exceptional abilities.",
  },
  {
    name: "Matonabbee",
    birthYear: 1737,
    deathYear: 1782,
    nationality: "Chipewyan (Dene)",
    biography: "Matonabbee was one of the most influential Chipewyan leaders of the 18th century and the guide who led Samuel Hearne to the Arctic Ocean. Raised in part at Prince of Wales Fort, he became fluent in English and Cree, making him invaluable as a diplomat and trade captain. After Hearne's first two expeditions failed, Matonabbee offered to guide him, explaining that previous failures were due to lack of women to do essential work and proper Indigenous leadership. Under his guidance, Hearne's third expedition succeeded, reaching the Coppermine River and Arctic Ocean in July 1771. Matonabbee commanded respect through his leadership abilities, diplomatic skills, and commanding presence. Tragically, when the French captured and destroyed Prince of Wales Fort in 1782, Matonabbee took his own life, devastated by the loss of the trading relationship he had worked to build. His death marked the end of an era in Chipewyan-HBC relations.",
    notableAchievements: "Led Samuel Hearne to Arctic Ocean (1770-1772). Master diplomat between Chipewyan, Cree, and HBC. Leading Chipewyan trading chief. Fluent in Chipewyan, Cree, and English. Ensured success of one of Canada's most important explorations. His guidance made Hearne's expedition possible.",
  },
  {
    name: "Akaitcho",
    birthYear: 1786,
    deathYear: 1838,
    nationality: "Yellowknife Dene",
    biography: "Akaitcho was a prominent chief of the Yellowknife Dene who played a crucial role in John Franklin's first Arctic expedition (1819-1822). When Franklin's poorly supplied party arrived in the North, Akaitcho provided guides, hunters, and essential local knowledge. He repeatedly warned Franklin about the dangers of his planned winter travel and the inadequacy of British supplies. When Franklin proceeded anyway, Akaitcho's predictions proved tragically correct, with eleven of Franklin's twenty men dying of starvation and exposure. Akaitcho and his people helped rescue the survivors and provided food and shelter during their recovery. He continued to lead his people and maintain relationships with Europeans until his death in 1838. The community of N'Dilo near Yellowknife and Akaitcho Bay are named in his honor, as is the Akaitcho Territory Government.",
    notableAchievements: "Provided crucial support for Franklin's first Arctic expedition. Warned Franklin about dangers of winter travel. Led rescue efforts for expedition survivors. Maintained peaceful Yellowknife Dene-European relations. Honored by multiple place names including Akaitcho Bay. Demonstrated both generosity and wisdom in dealing with British explorers.",
  },
  {
    name: "Poundmaker",
    birthYear: 1842,
    deathYear: 1886,
    nationality: "Plains Cree",
    biography: "Poundmaker (Pitikwahanapiwiyin) was a Plains Cree chief known both as a skilled diplomat who sought peaceful coexistence and as a leader convicted of treason-felony during the North-West Rebellion of 1885. His name came from his skill at building buffalo pounds for communal hunts. Adopted by Blackfoot chief Crowfoot, he worked to maintain peace between traditional enemies. During the 1876 Treaty 6 negotiations, Poundmaker advocated forcefully for better terms for his people. When the 1885 rebellion broke out, Poundmaker tried to restrain his warriors but was unable to prevent the attack on Battleford. He surrendered to spare his people further suffering and was sentenced to three years in prison, though he served only one. He died shortly after his release, aged only 44. In 2019, the Canadian government exonerated Poundmaker, acknowledging the injustice of his conviction.",
    notableAchievements: "Skilled diplomat between Cree and Blackfoot. Advocated for better treaty terms (Treaty 6, 1876). Adopted son of Crowfoot. Sought to restrain violence during 1885 rebellion. Surrendered to protect his people. Exonerated by Canadian government (2019). Named for skill at building buffalo pounds.",
  },
  {
    name: "Big Bear",
    birthYear: 1825,
    deathYear: 1888,
    nationality: "Plains Cree",
    biography: "Big Bear (Mistahimaskwa) was a Plains Cree chief who resisted signing Treaty 6 for six years, seeking better terms for his people as the buffalo disappeared and starvation spread. He understood that the treaties would end the traditional way of life and fought for provisions that would help his people adapt. When he finally signed in 1882, it was under duress as his people faced famine. During the 1885 North-West Rebellion, warriors in his band killed nine people at Frog Lake despite Big Bear's efforts to prevent violence. Though he had tried to restrain his warriors, Big Bear was convicted of treason-felony and sentenced to three years in prison. He was released after two years due to failing health and died shortly thereafter. His resistance to inadequate treaty terms and his efforts to protect his people earned him lasting respect.",
    notableAchievements: "Resisted signing Treaty 6 for six years seeking better terms. Fought for provisions to help Cree adapt to post-buffalo era. Tried to prevent violence at Frog Lake. Advocated for Indigenous rights and self-determination. His resistance highlighted inadequacy of treaty provisions.",
  },
  {
    name: "Crowfoot",
    birthYear: 1830,
    deathYear: 1890,
    nationality: "Siksika (Blackfoot)",
    biography: "Crowfoot (Isapo-Muxika) was the principal chief of the Siksika (Blackfoot) people during the critical period of treaties and the disappearance of the buffalo. A renowned warrior in his youth, Crowfoot became a statesman who recognized that armed resistance to Canadian expansion would be futile. He signed Treaty 7 in 1877, securing a reserve for his people while maintaining their dignity. During the 1885 North-West Rebellion, Crowfoot kept the Blackfoot Confederacy neutral despite pressure to join the uprising, believing it would lead only to destruction. His wisdom prevented a wider conflict. Crowfoot suffered greatly as his people faced starvation and disease, losing most of his children. He died in 1890, recognized even by his adversaries as a great leader who made the best of impossible circumstances.",
    notableAchievements: "Principal chief of the Siksika during treaty era. Signed Treaty 7 (1877) maintaining Blackfoot dignity. Kept Blackfoot Confederacy neutral during 1885 Rebellion. Prevented wider conflict through his leadership. Recognized as statesman by both Indigenous peoples and settlers. Adoptive father of Poundmaker.",
  },
  {
    name: "Chief Peguis",
    birthYear: 1774,
    deathYear: 1864,
    nationality: "Saulteaux (Ojibwe)",
    biography: "Chief Peguis was a Saulteaux (Ojibwe) leader who became one of the most important Indigenous allies of the early Red River Settlement. When Lord Selkirk's colonists arrived in 1812, facing hostility from the North West Company and harsh conditions, Peguis and his people provided crucial assistance, sharing food and teaching survival skills. He helped defend the colony during conflicts with the NWC, particularly after the Seven Oaks Massacre of 1816. Peguis signed an agreement with Selkirk that he believed was a friendship treaty but later proved to be a land surrender. As settlers encroached on Saulteaux lands and broke promises, Peguis became increasingly critical, writing eloquent letters of protest to authorities. He converted to Christianity and took the name William King. He died in 1864, disappointed by the treatment his people received despite their crucial early assistance to the colony.",
    notableAchievements: "Crucial ally of Red River Settlement from 1812. Provided food and assistance to starving colonists. Helped defend colony after Seven Oaks Massacre. Signed treaty with Lord Selkirk. Advocated for his people through eloquent letters. Friendship enabled survival of Red River Settlement.",
  },
  {
    name: "Shawnadithit",
    birthYear: 1801,
    deathYear: 1829,
    nationality: "Beothuk",
    biography: "Shawnadithit, also known as Nancy, was the last known member of the Beothuk people of Newfoundland. Her people had been devastated by European diseases, loss of resources, and violent conflicts with settlers and fishermen. In 1823, starving and ill, she was captured along with her mother and sister; she was the only one to survive. Shawnadithit lived for six years among Europeans, eventually becoming an informant for William Cormack, founder of the Beothuk Institution, which sought to study her people. She created drawings depicting Beothuk life, customs, and their encounters with Europeans. These drawings and her accounts are the primary record of Beothuk culture. Shawnadithit died of tuberculosis in St. John's in June 1829. Her death marked the tragic extinction of the Beothuk people.",
    notableAchievements: "Last known member of the Beothuk people. Created invaluable drawings of Beothuk culture and life. Primary source of knowledge about Beothuk customs. Her testimony recorded by William Cormack. Her drawings preserved in Newfoundland Museum. Symbol of the tragedy of cultural extinction.",
  },

  // ==================== WOMEN IN THE FUR TRADE ====================
  {
    name: "Marie-Anne Gaboury",
    birthYear: 1780,
    deathYear: 1875,
    nationality: "French Canadian (Quebec)",
    biography: "Marie-Anne Gaboury holds the distinction of being the first European woman to travel to and settle in the Canadian Northwest. In 1806, at age 26, she insisted on accompanying her husband Jean-Baptiste Lagimodiere, a fur trader and voyageur, when he returned west rather than remaining in Quebec as convention demanded. She traveled by canoe and on foot through the wilderness, eventually settling near present-day Pembina and later the Red River Settlement. Marie-Anne gave birth to several children in the West, adapting to life among Indigenous and Metis peoples. She learned to live off the land and survived the hardships of frontier life. Marie-Anne lived to the remarkable age of 95, witnessing the transformation of the Northwest from fur trade territory to Canadian provinces. Her grandson was Louis Riel, the famous Metis leader.",
    notableAchievements: "First European woman to travel to and settle in Canadian Northwest (1806). Grandmother of Louis Riel. Survived wilderness journey by canoe and on foot. Gave birth to children in the West. Lived to age 95, spanning fur trade era to Confederation. Challenged gender conventions of her era.",
  },
  {
    name: "Isabel Gunn",
    birthYear: 1780,
    deathYear: 1861,
    nationality: "Scottish (Orkney)",
    biography: "Isabel Gunn was a Scottish woman from the Orkney Islands who disguised herself as a man named 'John Fubbister' to work for the Hudson's Bay Company. In 1806, she arrived at Moose Factory and later transferred to Pembina, performing the same demanding physical labor as male employees for nearly two years. Her deception was remarkably successful given the close quarters of fur trade life. Her secret was dramatically revealed on December 29, 1807, when she gave birth to a son at the Pembina post. The father was reportedly another HBC employee. The incident caused considerable scandal, and Gunn was sent back to York Factory, then Albany Factory, where she worked as a washerwoman before being sent to Scotland in 1809. Her story reveals the lengths some women went to escape limited opportunities and seek adventure.",
    notableAchievements: "First European woman to live in Rupert's Land (though disguised). Successfully masqueraded as man for nearly two years. Performed demanding physical labor as HBC employee. Challenged gender barriers of early 19th century. Her story reveals women's desire for opportunity and adventure.",
  },
  {
    name: "Charlotte Small",
    birthYear: 1785,
    deathYear: 1857,
    nationality: "Metis (Cree-Scottish)",
    biography: "Charlotte Small was the Metis wife and lifelong companion of the great explorer and cartographer David Thompson. Born at Ile-a-la-Crosse to Patrick Small, a North West Company partner, and a Cree woman, Charlotte married Thompson in 1799 when she was fourteen. She accompanied her husband on many of his most significant journeys, traveling thousands of miles through uncharted wilderness while pregnant or with young children. Charlotte's linguistic abilities (she spoke Cree and likely other Indigenous languages) were essential for Thompson's success, helping him communicate with Indigenous peoples and gather geographic information. Together they had thirteen children, many born during expeditions. After Thompson's death in February 1857, Charlotte passed away just three months later, a testament to their enduring bond. She traveled over 10,000 miles with Thompson.",
    notableAchievements: "Wife and travel companion of David Thompson. Traveled over 10,000 miles through Canadian wilderness. Served as interpreter between English traders and Indigenous peoples. Raised 13 children, many born during wilderness expeditions. Crossed Rocky Mountains multiple times. Essential to Thompson's success through her language skills and cultural knowledge.",
  },

  // ==================== METIS LEADERS ====================
  {
    name: "Louis Riel",
    birthYear: 1844,
    deathYear: 1885,
    nationality: "Metis",
    biography: "Louis Riel was the founder of the province of Manitoba and the leader who twice led his Metis people in resistance against the Canadian government. Educated in Montreal, Riel returned to Red River and in 1869-1870 led the resistance against the Canadian takeover of Rupert's Land, establishing a provisional government and negotiating Manitoba's entry into Confederation. His execution of Thomas Scott led to his exile, though he was elected to Parliament three times. In 1884, he returned from Montana to lead the North-West Rebellion of 1885, seeking to protect Metis land rights and way of life. After the defeat at Batoche, Riel surrendered and was tried for treason. Despite questions about his mental state, he was convicted and hanged on November 16, 1885. His execution remains one of the most controversial events in Canadian history, inflaming French-English tensions for generations.",
    notableAchievements: "Founder of Manitoba. Led Red River Resistance (1869-1870). Established provisional government. Negotiated Manitoba Act. Led North-West Rebellion (1885). Elected to Parliament three times while in exile. His execution inflamed national divisions. Central figure in Metis history and Canadian identity.",
  },
  {
    name: "Gabriel Dumont",
    birthYear: 1837,
    deathYear: 1906,
    nationality: "Metis",
    biography: "Gabriel Dumont was the military leader of the Metis during the North-West Rebellion of 1885 and one of the greatest plainsmen of his era. Born at Red River, he grew up on the prairies, becoming a legendary buffalo hunter, scout, and leader. He could speak six languages and was renowned for his skills as a horseman and marksman. Dumont served as the 'president of the hunt' for the Metis of St. Laurent and later led the Metis military forces under Riel. His guerrilla tactics at Fish Creek and Batoche nearly achieved victory against superior Canadian forces, but Riel's insistence on defensive warfare undermined his strategy. After the rebellion's defeat, Dumont escaped to the United States, where he briefly joined Buffalo Bill's Wild West Show. He was eventually pardoned and returned to Canada, spending his final years at Batoche.",
    notableAchievements: "Military commander of Metis forces (1885). Legendary buffalo hunter and plainsman. Spoke six languages. Led guerrilla campaign at Fish Creek and Batoche. President of the hunt for St. Laurent Metis. Escaped to US after rebellion. Later toured with Buffalo Bill's Wild West Show. Greatest Metis military leader.",
  },
  {
    name: "Cuthbert Grant",
    birthYear: 1793,
    deathYear: 1854,
    nationality: "Metis",
    biography: "Cuthbert Grant was the leader who forged the Metis into a distinct nation and led them at the Battle of Seven Oaks in 1816. Son of a North West Company trader and a Metis or Cree woman, Grant was educated in Scotland before returning to the Northwest. The NWC cultivated him as a leader of the Metis, whom they used as allies against the HBC and the Red River Settlement. At Seven Oaks on June 19, 1816, Grant led a party of Metis and NWC men that clashed with HBC Governor Robert Semple's group, resulting in the deaths of Semple and twenty of his men. This event galvanized Metis identity. After the 1821 HBC-NWC merger, Grant made peace with the HBC and was appointed Warden of the Plains, responsible for maintaining order. He served the Red River community for the rest of his life, organizing buffalo hunts and serving as a magistrate.",
    notableAchievements: "Led Metis at Battle of Seven Oaks (1816). Forged Metis national identity. Appointed Warden of the Plains by HBC. Organized major Metis buffalo hunts. Served as magistrate at Red River. Bridged NWC-HBC conflict. First recognized leader of the Metis nation.",
  },
  {
    name: "Jean-Baptiste Lagimodiere",
    birthYear: 1778,
    deathYear: 1855,
    nationality: "French Canadian",
    biography: "Jean-Baptiste Lagimodiere was a voyageur and fur trader who became a legendary figure in the Red River Settlement. After traveling west as a young man, he returned to Quebec in 1805 and married Marie-Anne Gaboury, who insisted on accompanying him back west in an unprecedented journey. Lagimodiere became one of the most skilled hunters and travelers in the Northwest. In the winter of 1815-1816, when the Red River Settlement was under threat from the North West Company, Lagimodiere made an epic 2,900-kilometer journey on snowshoes to Montreal to deliver dispatches to Lord Selkirk, returning with reinforcements. This heroic journey took nearly six months through hostile territory in the depths of winter. He and Marie-Anne settled permanently at Red River, where they raised a family. Their daughter Julie married Louis Riel Sr., making them the grandparents of Louis Riel.",
    notableAchievements: "Epic snowshoe journey of 2,900 km from Red River to Montreal (1815-1816). Husband of Marie-Anne Gaboury, first European woman in the Northwest. Grandfather of Louis Riel. Legendary hunter and voyageur. Helped save Red River Settlement by reaching Lord Selkirk. Six-month winter journey through hostile territory.",
  },

  // ==================== CARTOGRAPHERS/SURVEYORS ====================
  {
    name: "Philip Turnor",
    birthYear: 1751,
    deathYear: 1799,
    nationality: "English",
    biography: "Philip Turnor was the Hudson's Bay Company's first official surveyor and the founder of the company's cartographic tradition. Appointed in 1778, he brought scientific methods to the mapping of the Canadian interior, using astronomical observations to determine accurate positions. Between 1778 and 1792, Turnor surveyed the routes from Hudson Bay to Lake Athabasca, correcting many errors in earlier maps. Most importantly, he trained the next generation of HBC surveyors, including David Thompson and Peter Fidler, passing on his skills in astronomical observation and surveying. His meticulous work established the foundation for the accurate mapping of western Canada. Turnor's journals and observations remained valuable references for decades. His legacy lives on through his students, particularly David Thompson, who became the greatest land geographer in history.",
    notableAchievements: "First official HBC surveyor (1778). Trained David Thompson and Peter Fidler. Surveyed routes from Hudson Bay to Lake Athabasca. Established scientific cartography for HBC. His astronomical observations set standards for accuracy. Founded HBC cartographic tradition. Corrected errors in earlier maps.",
  },
  {
    name: "Peter Fidler",
    birthYear: 1769,
    deathYear: 1822,
    nationality: "English",
    biography: "Peter Fidler was the most prolific cartographer in Hudson's Bay Company history, producing over 200 maps during his 47-year career. Trained by Philip Turnor alongside David Thompson, Fidler became the HBC's primary surveyor after Thompson defected to the North West Company. During the winter of 1792-1793, he lived with the Peigan (Piikani) people of the Blackfoot Confederacy, becoming the first European to winter among them and documenting their culture and language. Fidler surveyed vast areas of the prairies, the 49th parallel boundary region, the Red River Settlement, and the Rocky Mountain foothills. He traveled over 48,000 kilometers during his explorations. Though less famous than Thompson, Fidler's consistent, accurate work was essential to the HBC's geographic knowledge. His maps and journals remain valuable primary sources.",
    notableAchievements: "Created over 200 maps of western Canada. Traveled over 48,000 km during explorations. First European to winter with Peigan people (1792-1793). Surveyed 49th parallel boundary region. Trained by Philip Turnor. 47-year HBC career, longest of any company surveyor. Documented Blackfoot culture and language.",
  },
  {
    name: "Joseph Burr Tyrrell",
    birthYear: 1858,
    deathYear: 1957,
    nationality: "Canadian",
    biography: "Joseph Burr Tyrrell was a geologist, explorer, mining consultant, and historian who made major contributions to the knowledge of Canada's North. Working for the Geological Survey of Canada, he explored vast areas of the Barren Lands, including two epic canoe journeys in 1893 and 1894 that retraced and extended routes first traveled by Samuel Hearne. His 1893 expedition crossed the Barren Lands from Lake Athabasca to Hudson Bay, covering over 5,200 kilometers through some of the most remote terrain in North America. Tyrrell discovered the dinosaur beds in Alberta that now bear his name (the Royal Tyrrell Museum) and made significant contributions to understanding Canada's Precambrian geology. He later became a successful mining entrepreneur and edited the journals of David Thompson and Samuel Hearne. Tyrrell lived to age 98, spanning from Confederation to the Space Age.",
    notableAchievements: "Crossed Barren Lands by canoe (1893). Traveled over 5,200 km through remote northern Canada. Discovered Alberta dinosaur beds. Royal Tyrrell Museum named for him. Edited journals of David Thompson and Samuel Hearne. Major contributions to Canadian geology. Lived to age 98, one of Canada's greatest explorers.",
  },
  {
    name: "John Palliser",
    birthYear: 1817,
    deathYear: 1887,
    nationality: "Irish",
    biography: "Captain John Palliser led the British North American Exploring Expedition (1857-1860), known as the Palliser Expedition, which conducted the first comprehensive scientific survey of the Canadian prairies and Rocky Mountain passes. The expedition assessed the region's suitability for agriculture and settlement, identifying the fertile belt along the North Saskatchewan River and the semi-arid 'Palliser's Triangle' in the southern prairies. Palliser's team included botanist Eugene Bourgeau, geologist James Hector, and astronomer Thomas Blakiston, who made significant scientific contributions. The expedition mapped passes through the Rocky Mountains, including Kicking Horse Pass, which would later be used by the Canadian Pacific Railway. Though Palliser was pessimistic about settlement prospects in the dry southern prairies, his detailed reports provided crucial information for Canadian expansion westward.",
    notableAchievements: "Led Palliser Expedition (1857-1860). First comprehensive survey of Canadian prairies. Identified Palliser's Triangle and the fertile belt. Mapped Rocky Mountain passes including Kicking Horse Pass. Reports guided Canadian western expansion. Assessed region for agriculture and settlement. Team made major scientific contributions.",
  },
];

async function seedExplorersComprehensive() {
  console.log("Seeding comprehensive explorers database...\n");

  let created = 0;
  let updated = 0;
  const newlyAdded: string[] = [];

  for (const explorer of explorers) {
    // Check if explorer already exists by name
    const existing = await prisma.explorer.findFirst({
      where: { name: explorer.name },
    });

    if (!existing) {
      await prisma.explorer.create({ data: explorer });
      console.log(`  Created: ${explorer.name}`);
      created++;
      newlyAdded.push(explorer.name);
    } else {
      // Update with more detailed info if exists
      await prisma.explorer.update({
        where: { id: existing.id },
        data: explorer,
      });
      console.log(`  Updated: ${explorer.name}`);
      updated++;
    }
  }

  // Print summary
  console.log("\n==================== SEEDING COMPLETE ====================\n");

  const totalCount = await prisma.explorer.count();

  console.log("Summary:");
  console.log(`  Total explorers in database: ${totalCount}`);
  console.log(`  New explorers created: ${created}`);
  console.log(`  Existing explorers updated: ${updated}`);

  if (newlyAdded.length > 0) {
    console.log("\nNewly added explorers:");
    for (const name of newlyAdded) {
      console.log(`  - ${name}`);
    }
  }

  // List all explorers by category
  console.log("\n==================== ALL EXPLORERS ====================\n");
  const allExplorers = await prisma.explorer.findMany({
    orderBy: { name: "asc" },
    select: { name: true, nationality: true, birthYear: true, deathYear: true },
  });

  for (const exp of allExplorers) {
    const years = exp.birthYear && exp.deathYear
      ? `(${exp.birthYear}-${exp.deathYear})`
      : exp.birthYear
        ? `(b. ${exp.birthYear})`
        : "";
    console.log(`  ${exp.name} ${years} - ${exp.nationality || "Unknown"}`);
  }
}

seedExplorersComprehensive()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
