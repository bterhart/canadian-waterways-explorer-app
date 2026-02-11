// Comprehensive historical data seed script
// Adds chronological explorer information, archaeological discoveries,
// and expanded historical context from earliest explorers to Joseph Tyrrell

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏛️ Adding comprehensive historical data...\n");

  // ==================== ADD MORE EXPLORERS (CHRONOLOGICAL) ====================
  console.log("👤 Adding explorers (chronological order)...");

  const explorersData = [
    // Early Norse (c. 1000 AD)
    {
      name: "Leif Erikson",
      birthYear: 970,
      deathYear: 1020,
      nationality: "Norse/Icelandic",
      biography: "Norse explorer believed to be the first European to set foot on continental North America, around 500 years before Columbus. His voyage from Greenland led him to a land he called 'Vinland,' likely in Newfoundland.",
      notableAchievements: "First documented European to reach North America. Established a short-lived Norse settlement at L'Anse aux Meadows.",
    },
    // Early French exploration (1500s)
    {
      name: "Jacques Cartier",
      birthYear: 1491,
      deathYear: 1557,
      nationality: "French",
      biography: "French navigator who made three voyages to Canada between 1534-1542. He was the first European to describe and map the Gulf of Saint Lawrence and the shores of the Saint Lawrence River, which he named 'The Country of Canadas.'",
      notableAchievements: "Claimed Canada for France in 1534. First European to navigate the St. Lawrence River. Coined the name 'Canada' from the Iroquoian word 'kanata' meaning village.",
    },
    // Champlain already exists, but we'll add more detail
    {
      name: "Étienne Brûlé",
      birthYear: 1592,
      deathYear: 1633,
      nationality: "French",
      biography: "French explorer and interpreter who lived among the Huron (Wendat) people. He was the first European to see Lakes Ontario, Erie, Huron, and Superior, and to travel through what is now southern Ontario.",
      notableAchievements: "First European to see the Great Lakes. First European to live among the Huron people. Explored the Susquehanna River to Chesapeake Bay.",
    },
    {
      name: "Jean Nicolet",
      birthYear: 1598,
      deathYear: 1642,
      nationality: "French",
      biography: "French explorer who traveled to the Great Lakes region in 1634, becoming the first European to explore Lake Michigan and meet the Menominee people of present-day Wisconsin.",
      notableAchievements: "First European to explore Lake Michigan and Wisconsin. Established trade relations with Indigenous peoples of the western Great Lakes.",
    },
    // Hudson's Bay Company era (1600s-1700s)
    {
      name: "Henry Hudson",
      birthYear: 1565,
      deathYear: 1611,
      nationality: "English",
      biography: "English sea explorer and navigator. In 1610-1611, he explored Hudson Bay, believing it might be a passage to Asia. After becoming trapped in ice during winter, his crew mutinied in June 1611, setting Hudson, his son, and loyal crew members adrift in a small boat. They were never seen again.",
      notableAchievements: "Discovered Hudson Strait and Hudson Bay in 1610. His explorations led to the founding of the Hudson's Bay Company in 1670.",
    },
    {
      name: "Pierre-Esprit Radisson",
      birthYear: 1636,
      deathYear: 1710,
      nationality: "French (later English)",
      biography: "French-Canadian explorer and fur trader who, along with his brother-in-law Médard des Groseilliers, explored the Great Lakes and Hudson Bay regions. Their reports of rich fur resources in the Hudson Bay area led to the founding of the Hudson's Bay Company.",
      notableAchievements: "Co-founder influence on Hudson's Bay Company. Explored Lake Superior region. Documented extensive interactions with Cree and other First Nations.",
    },
    {
      name: "Médard des Groseilliers",
      birthYear: 1618,
      deathYear: 1696,
      nationality: "French (later English)",
      biography: "French explorer and fur trader who, along with Pierre-Esprit Radisson, explored the western Great Lakes and advocated for a Hudson Bay fur trade route. Their advocacy led directly to the establishment of the Hudson's Bay Company in 1670.",
      notableAchievements: "Key figure in founding Hudson's Bay Company. Explored Lake Superior and the lands west. Pioneered the northern fur trade route via Hudson Bay.",
    },
    {
      name: "Henry Kelsey",
      birthYear: 1667,
      deathYear: 1724,
      nationality: "English",
      biography: "Hudson's Bay Company employee who became the first European to see the Canadian prairies and possibly the first to see bison (buffalo) and grizzly bears. Between 1690-1692, he traveled from York Factory into the interior, reaching what is now Saskatchewan.",
      notableAchievements: "First European to see the Canadian prairies (1690). First European to document grizzly bears and describe prairie bison. Wrote the first English poetry composed in Canada.",
    },
    {
      name: "James Knight",
      birthYear: 1640,
      deathYear: 1721,
      nationality: "English",
      biography: "Hudson's Bay Company governor and explorer. In 1719, at nearly 80 years old, he led an expedition of two ships (the Albany and the Discovery) to find the Northwest Passage and rumored gold and copper mines. The entire expedition vanished. In 1767, Inuit people led Samuel Hearne to the remains on Marble Island, where evidence suggested the crew had survived at least one winter before perishing.",
      notableAchievements: "Governor of Hudson's Bay Company posts. Led ill-fated 1719 expedition that became one of the Arctic's great mysteries.",
    },
    {
      name: "Pierre Gaultier de Varennes, Sieur de La Vérendrye",
      birthYear: 1685,
      deathYear: 1749,
      nationality: "French Canadian",
      biography: "French Canadian military officer and fur trader who, with his sons, established a chain of trading posts from Lake Superior to the Saskatchewan River between 1731-1743. He was the first European to reach the western prairies from the east, though he failed to find the Western Sea (Pacific Ocean).",
      notableAchievements: "Built Fort St. Charles, Fort Maurepas, Fort La Reine, and Fort Bourbon. First European family to see the Rocky Mountains (1743). Extended French influence to the Saskatchewan River.",
    },
    {
      name: "Anthony Henday",
      birthYear: 1725,
      deathYear: 1770,
      nationality: "English",
      biography: "Hudson's Bay Company explorer who in 1754-1755 became the first European to enter the territory of the Blackfoot Confederacy and to see the Rocky Mountains from the Canadian prairies. His journey helped establish trade connections with western First Nations.",
      notableAchievements: "First European to see the Rocky Mountains from the Canadian prairies (1754). First European to enter Blackfoot territory. Traveled over 1,500 km into the interior.",
    },
    // Late 18th century - Samuel Hearne already exists
    {
      name: "Peter Pond",
      birthYear: 1740,
      deathYear: 1807,
      nationality: "American (Connecticut)",
      biography: "American-born fur trader and explorer who was instrumental in opening up the Athabasca region to the fur trade. His maps, though often inaccurate, provided crucial geographic information that helped Alexander Mackenzie plan his expeditions. He discovered Methye Portage, the crucial 19 km portage connecting the Churchill River system to the Athabasca.",
      notableAchievements: "First European to cross Methye Portage (1778). Established Athabasca fur trade. Created maps that guided Mackenzie's expeditions.",
    },
    // Alexander Mackenzie, David Thompson, Simon Fraser already exist
    {
      name: "Peter Fidler",
      birthYear: 1769,
      deathYear: 1822,
      nationality: "English",
      biography: "Hudson's Bay Company surveyor and explorer who made extensive surveys of the Canadian prairies and Rocky Mountain foothills. He produced over 200 maps during his career and traveled over 48,000 km. He spent winter 1792-1793 with the Peigan (Blackfoot) people, the first European to live among them.",
      notableAchievements: "Created over 200 maps of western Canada. First European to winter with the Peigan people. Surveyed the 49th parallel border region.",
    },
    // 19th century explorers
    {
      name: "Sir John Franklin",
      birthYear: 1786,
      deathYear: 1847,
      nationality: "English",
      biography: "British Royal Navy officer and Arctic explorer. His first overland expedition (1819-1822) mapped part of the Arctic coast but ended in disaster, with 11 of 20 men dying. His second expedition (1825-1827) was more successful. His final expedition (1845) to find the Northwest Passage ended in tragedy when his ships HMS Erebus and HMS Terror became trapped in ice, and all 129 men perished.",
      notableAchievements: "Mapped portions of the Arctic coastline. His lost 1845 expedition became one of history's greatest mysteries, prompting over 30 search expeditions.",
    },
    {
      name: "Dr. John Rae",
      birthYear: 1813,
      deathYear: 1893,
      nationality: "Scottish/Canadian",
      biography: "Hudson's Bay Company surgeon and Arctic explorer who learned survival techniques from the Inuit. He was the first to bring back conclusive evidence of the fate of the Franklin expedition in 1854, learning from Inuit witnesses that the crew had resorted to cannibalism. This revelation caused public outrage in Victorian Britain.",
      notableAchievements: "Discovered the final link of the Northwest Passage (Rae Strait). First to determine the fate of the Franklin expedition. Mapped over 1,800 miles of Arctic coastline.",
    },
    {
      name: "Sir George Back",
      birthYear: 1796,
      deathYear: 1878,
      nationality: "English",
      biography: "British Royal Navy officer and Arctic explorer who served under John Franklin and later led his own expeditions. He discovered and mapped the Great Fish River (now Back River) in 1833-1835 while searching for the lost John Ross expedition.",
      notableAchievements: "Discovered and descended the Back River (1834). Survived Franklin's disastrous first overland expedition. Produced valuable Arctic sketches and paintings.",
    },
    {
      name: "Sir Robert McClure",
      birthYear: 1807,
      deathYear: 1873,
      nationality: "Irish-English",
      biography: "Royal Navy officer who, while searching for Franklin's lost expedition, became the first to traverse the Northwest Passage (1850-1854), though partly by sledge after his ship HMS Investigator became trapped in ice. He and his crew were rescued after three winters.",
      notableAchievements: "First to traverse the Northwest Passage (1850-1854). Discovered Prince of Wales Strait and Banks Island coastline.",
    },
    {
      name: "Joseph Burr Tyrrell",
      birthYear: 1858,
      deathYear: 1957,
      nationality: "Canadian",
      biography: "Canadian geologist, cartographer, and explorer who made significant contributions to mapping western and northern Canada. In 1893, he discovered dinosaur fossils in Alberta's Red Deer River valley (now the Royal Tyrrell Museum is named after him). He explored the Barren Lands of the Northwest Territories, becoming one of the last great explorers of the Canadian wilderness.",
      notableAchievements: "Discovered dinosaur fossils in Alberta (Albertosaurus). Explored the Barren Lands via the Dubawnt and Thelon Rivers (1893-1894). The Royal Tyrrell Museum is named in his honor. Mapped extensive areas of northern Canada.",
    },
    {
      name: "Vilhjalmur Stefansson",
      birthYear: 1879,
      deathYear: 1962,
      nationality: "Canadian (Icelandic descent)",
      biography: "Canadian Arctic explorer and ethnographer who led the Canadian Arctic Expedition (1913-1918). He promoted the concept of a 'Friendly Arctic' where Europeans could live off the land. His expedition discovered new Arctic islands but also suffered the loss of the ship Karluk and 11 crew members.",
      notableAchievements: "Led Canadian Arctic Expedition (1913-1918). Discovered Brock, Borden, Meighen, and Lougheed Islands. Lived among Inuit peoples and documented their culture.",
    },
  ];

  for (const explorer of explorersData) {
    const existing = await prisma.explorer.findFirst({
      where: { name: explorer.name }
    });

    if (!existing) {
      await prisma.explorer.create({ data: explorer });
      console.log(`  ✅ Added ${explorer.name}`);
    } else {
      // Update with more detailed info
      await prisma.explorer.update({
        where: { id: existing.id },
        data: explorer
      });
      console.log(`  ✅ Updated ${explorer.name}`);
    }
  }

  // ==================== ADD ARCHAEOLOGICAL DISCOVERIES ====================
  console.log("\n🔍 Adding archaeological discoveries...");

  // Get waterway IDs
  const hudsonBay = await prisma.waterway.findFirst({ where: { name: "Hudson Bay" } });
  const stLawrence = await prisma.waterway.findFirst({ where: { name: "St. Lawrence River" } });
  const ottawaRiver = await prisma.waterway.findFirst({ where: { name: "Ottawa River" } });

  const discoveries = [
    {
      name: "HMS Erebus Wreck",
      discoveryYear: 2014,
      description: "The shipwreck of HMS Erebus, Sir John Franklin's flagship, was discovered by a Parks Canada team in the waters of Queen Maud Gulf, Nunavut. The ship lies in about 11 meters of water and is remarkably well-preserved. Artifacts recovered include a ship's bell, ceramic plates, and the captain's steward's cabin contents.",
      significance: "One of the most significant maritime archaeological discoveries in Canadian history. The finding helped solve the 169-year mystery of the Franklin expedition and has yielded thousands of artifacts providing insight into the expedition's fate.",
      relatedExpedition: "Franklin's Lost Expedition (1845-1848)",
      relatedExplorerName: "Sir John Franklin",
      expeditionYear: 1845,
      latitude: 68.9167,
      longitude: -98.9167,
      locationDescription: "Queen Maud Gulf, near O'Reilly Island, Nunavut",
      waterwayId: hudsonBay?.id,
      sources: "Parks Canada; Royal Canadian Geographical Society; Dr. Douglas Stenton archaeological reports",
    },
    {
      name: "HMS Terror Wreck",
      discoveryYear: 2016,
      description: "The shipwreck of HMS Terror was discovered by the Arctic Research Foundation in Terror Bay, King William Island. The ship sits upright in 24 meters of water with its masts broken but still attached. Many artifacts remain on board, including plates, bottles, and personal effects.",
      significance: "The discovery completed the finding of both Franklin expedition ships. The remarkably preserved state of Terror, with hatches closed and provisions intact, suggests the ship may have been re-crewed after being abandoned in the ice, supporting Inuit oral histories.",
      relatedExpedition: "Franklin's Lost Expedition (1845-1848)",
      relatedExplorerName: "Sir John Franklin",
      expeditionYear: 1845,
      latitude: 68.8833,
      longitude: -99.0833,
      locationDescription: "Terror Bay, King William Island, Nunavut",
      waterwayId: hudsonBay?.id,
      sources: "Arctic Research Foundation; Parks Canada; Inuit Heritage Trust",
    },
    {
      name: "Knight Expedition Remains (Marble Island)",
      discoveryYear: 1767,
      description: "Samuel Hearne, guided by Inuit informants, found the remains of James Knight's 1719 expedition on Marble Island in Hudson Bay. He discovered the ruins of a house, tools, and human remains. Inuit oral tradition described watching the last survivors in the spring, who died shortly after, the last reportedly dying while sitting on the rocks watching for rescue ships.",
      significance: "The first major archaeological recovery of a lost Arctic expedition. Confirmed the complete loss of Knight's two ships and approximately 40 men. Demonstrated the value of Inuit oral history in solving exploration mysteries.",
      relatedExpedition: "Knight's Northwest Passage Expedition (1719)",
      relatedExplorerName: "James Knight",
      expeditionYear: 1719,
      latitude: 63.1167,
      longitude: -91.1333,
      locationDescription: "Marble Island, Hudson Bay, Nunavut",
      waterwayId: hudsonBay?.id,
      sources: "Samuel Hearne's 'A Journey to the Northern Ocean' (1795); Hudson's Bay Company archives",
    },
    {
      name: "Champlain's Astrolabe",
      discoveryYear: 1867,
      description: "A brass astrolabe dated 1603 was found by 14-year-old Edward Lee near Green Lake (now Astrolabe Lake), Ontario. The instrument is believed to have been lost by Samuel de Champlain during his 1613 expedition up the Ottawa River. Champlain records losing some equipment while portaging near the Muskrat Lake area.",
      significance: "One of the most important artifacts of early Canadian exploration. The astrolabe (a navigation instrument for determining latitude) provides tangible evidence of Champlain's 1613 expedition and is one of only a handful of such instruments surviving from the early 17th century.",
      relatedExpedition: "Champlain's Ottawa River Expedition (1613)",
      relatedExplorerName: "Samuel de Champlain",
      expeditionYear: 1613,
      latitude: 45.4833,
      longitude: -76.8333,
      locationDescription: "Near Cobden, Ontario (Green Lake/Astrolabe Lake area)",
      waterwayId: ottawaRiver?.id,
      sources: "Canadian Museum of History; Ontario Heritage Trust; Champlain's journals",
    },
    {
      name: "L'Anse aux Meadows Norse Settlement",
      discoveryYear: 1960,
      description: "Norwegian explorers Helge and Anne Stine Ingstad discovered the remains of a Norse settlement at L'Anse aux Meadows on the northern tip of Newfoundland. Excavations revealed eight buildings, including a forge for smelting iron, and numerous artifacts including a bronze cloak pin, stone oil lamp, and iron rivets from boat repair.",
      significance: "The only confirmed Norse site in North America and proof that Vikings reached the Americas nearly 500 years before Columbus. The site is now a UNESCO World Heritage Site and represents the earliest known European settlement in the New World.",
      relatedExpedition: "Norse Vinland Voyages (c. 1000 AD)",
      relatedExplorerName: "Leif Erikson",
      expeditionYear: 1000,
      latitude: 51.5961,
      longitude: -55.5339,
      locationDescription: "L'Anse aux Meadows, Northern Peninsula, Newfoundland",
      waterwayId: stLawrence?.id,
      sources: "UNESCO World Heritage; Parks Canada; Ingstad archaeological reports",
    },
    {
      name: "Red Bay Basque Whaling Station",
      discoveryYear: 1978,
      description: "Underwater archaeologists discovered the remains of the Basque whaling galleon San Juan (sunk 1565) in Red Bay, Labrador. The site revealed an extensive 16th-century Basque whaling operation, including tryworks for rendering whale oil, cooperages, cemeteries, and the remarkably preserved hull of the San Juan.",
      significance: "The most extensive underwater archaeological excavation in the Americas at the time. Revealed that Red Bay was the world's largest whaling port in the 1500s, with up to 2,000 Basque whalers processing right and bowhead whales each summer.",
      relatedExpedition: "Basque Whaling Operations (1530s-1600s)",
      relatedExplorerName: null,
      expeditionYear: 1565,
      latitude: 51.7286,
      longitude: -56.4347,
      locationDescription: "Red Bay, Labrador",
      waterwayId: stLawrence?.id,
      sources: "UNESCO World Heritage; Parks Canada; Memorial University of Newfoundland",
    },
    {
      name: "Franklin Expedition Graves (Beechey Island)",
      discoveryYear: 1850,
      description: "Search parties discovered three graves on Beechey Island in 1850—the first evidence of Franklin's lost expedition. The graves belonged to Petty Officer John Torrington (d. January 1, 1846), Able Seaman John Hartnell (d. January 4, 1846), and Private William Braine (d. April 3, 1846). In 1984, exhumation revealed remarkably preserved bodies with high lead levels from tinned food.",
      significance: "The first physical evidence found of the Franklin expedition. The 1984 exhumations by Dr. Owen Beattie revealed lead poisoning as a contributing factor to the expedition's failure, revolutionizing our understanding of the disaster.",
      relatedExpedition: "Franklin's Lost Expedition (1845-1848)",
      relatedExplorerName: "Sir John Franklin",
      expeditionYear: 1845,
      latitude: 74.7167,
      longitude: -91.8500,
      locationDescription: "Beechey Island, Devon Island, Nunavut",
      waterwayId: hudsonBay?.id,
      sources: "Dr. Owen Beattie, 'Frozen in Time'; Parks Canada; Franklin expedition research",
    },
    {
      name: "HMS Investigator Wreck",
      discoveryYear: 2010,
      description: "Parks Canada located the wreck of HMS Investigator in Mercy Bay, Banks Island. The ship was abandoned by Sir Robert McClure's expedition in 1853 after being trapped in ice for three winters. The crew survived by walking across the ice to be rescued by another expedition.",
      significance: "HMS Investigator's crew achieved the first traversing of the Northwest Passage, though partly on foot. The wreck site preserves artifacts from one of the most dramatic Arctic survival stories.",
      relatedExpedition: "McClure's Arctic Expedition (1850-1854)",
      relatedExplorerName: "Sir Robert McClure",
      expeditionYear: 1850,
      latitude: 74.1167,
      longitude: -117.7000,
      locationDescription: "Mercy Bay, Banks Island, Northwest Territories",
      waterwayId: null,
      sources: "Parks Canada; Natural Resources Canada; Arctic archaeology reports",
    },
  ];

  for (const discovery of discoveries) {
    const existing = await prisma.archaeologicalDiscovery.findFirst({
      where: { name: discovery.name }
    });

    if (!existing) {
      await prisma.archaeologicalDiscovery.create({ data: discovery });
      console.log(`  ✅ Added ${discovery.name}`);
    } else {
      await prisma.archaeologicalDiscovery.update({
        where: { id: existing.id },
        data: discovery
      });
      console.log(`  ✅ Updated ${discovery.name}`);
    }
  }

  // ==================== LINK EXPLORERS TO WATERWAYS WITH DATES ====================
  console.log("\n🔗 Linking explorers to waterways chronologically...");

  // Get all waterways
  const waterways = await prisma.waterway.findMany();
  const waterwayMap = new Map(waterways.map(w => [w.name, w.id]));

  // Get all explorers
  const explorers = await prisma.explorer.findMany();
  const explorerMap = new Map(explorers.map(e => [e.name, e.id]));

  const explorerWaterwayLinks = [
    // Jacques Cartier
    { explorer: "Jacques Cartier", waterway: "St. Lawrence River", year: 1534, notes: "First European to navigate and map the St. Lawrence River. Reached as far as present-day Montreal (Hochelaga) in 1535." },

    // Champlain links
    { explorer: "Samuel de Champlain", waterway: "St. Lawrence River", year: 1603, notes: "First explored 1603; founded Quebec City 1608; documented Indigenous nations and established French trade." },
    { explorer: "Samuel de Champlain", waterway: "Ottawa River", year: 1613, notes: "Ascended the Ottawa River seeking route to China; lost his astrolabe near present-day Cobden, Ontario." },
    { explorer: "Samuel de Champlain", waterway: "Lake Ontario", year: 1615, notes: "Traveled to Lake Ontario via the Ottawa River and French River route to aid the Huron against the Iroquois." },
    { explorer: "Samuel de Champlain", waterway: "Lake Huron", year: 1615, notes: "Reached Georgian Bay via French River; first European to document Lake Huron." },

    // Étienne Brûlé
    { explorer: "Étienne Brûlé", waterway: "Lake Ontario", year: 1610, notes: "First European to see Lake Ontario, traveling with Huron guides." },
    { explorer: "Étienne Brûlé", waterway: "Lake Huron", year: 1612, notes: "Lived among the Huron; extensively explored the region around Georgian Bay." },
    { explorer: "Étienne Brûlé", waterway: "Lake Erie", year: 1615, notes: "First European to see Lake Erie while on a mission to the Susquehannock." },
    { explorer: "Étienne Brûlé", waterway: "Lake Superior", year: 1622, notes: "First European to see Lake Superior; explored copper deposits on its shores." },

    // Jean Nicolet
    { explorer: "Jean Nicolet", waterway: "Lake Michigan", year: 1634, notes: "First European to explore Lake Michigan; met the Menominee people wearing Chinese robes, believing he might reach China." },

    // Henry Hudson
    { explorer: "Henry Hudson", waterway: "Hudson Bay", year: 1610, notes: "Discovered and explored Hudson Bay and James Bay 1610-1611. Abandoned by mutinous crew in June 1611." },
    { explorer: "Henry Hudson", waterway: "James Bay", year: 1610, notes: "Explored James Bay in autumn 1610; wintered at the southern end before the fatal mutiny." },

    // Radisson & Groseilliers
    { explorer: "Pierre-Esprit Radisson", waterway: "Lake Superior", year: 1659, notes: "Explored Lake Superior region with Groseilliers; traded extensively with Ojibwe and Cree peoples." },
    { explorer: "Pierre-Esprit Radisson", waterway: "Hudson Bay", year: 1668, notes: "Traveled to Hudson Bay promoting the idea that led to founding of Hudson's Bay Company (1670)." },
    { explorer: "Médard des Groseilliers", waterway: "Lake Superior", year: 1659, notes: "With Radisson, explored western Lake Superior and learned of rich fur resources to the north." },
    { explorer: "Médard des Groseilliers", waterway: "Hudson Bay", year: 1668, notes: "Sailed to Hudson Bay on the Nonsuch; successful fur trade voyage led directly to HBC charter." },

    // Henry Kelsey
    { explorer: "Henry Kelsey", waterway: "Nelson River", year: 1690, notes: "Traveled inland from York Factory via the Nelson River system to become first European on the prairies." },
    { explorer: "Henry Kelsey", waterway: "Saskatchewan River", year: 1691, notes: "Reached the Saskatchewan River region; first European to describe bison herds and grizzly bears." },

    // James Knight
    { explorer: "James Knight", waterway: "Hudson Bay", year: 1719, notes: "Led ill-fated expedition from York Factory seeking Northwest Passage and gold mines. All hands lost." },

    // La Vérendrye
    { explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Lake Superior", year: 1731, notes: "Established Fort St. Charles on Lake of the Woods; extended French presence west of the Great Lakes." },
    { explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Lake Winnipeg", year: 1733, notes: "First European to reach Lake Winnipeg; established Fort Maurepas on the Red River." },
    { explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Red River", year: 1733, notes: "Explored the Red River system; established key trade posts connecting to western fur trade." },
    { explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Saskatchewan River", year: 1739, notes: "His sons reached the forks of the Saskatchewan; family was first to see Rocky Mountains from the east (1743)." },

    // Anthony Henday
    { explorer: "Anthony Henday", waterway: "Saskatchewan River", year: 1754, notes: "Traveled up the Saskatchewan River to become first European to see Rocky Mountains from Canadian prairies." },

    // Samuel Hearne
    { explorer: "Samuel Hearne", waterway: "Churchill River (Saskatchewan)", year: 1769, notes: "Started from Prince of Wales Fort; first overland expedition to Arctic Ocean began along Churchill system." },
    { explorer: "Samuel Hearne", waterway: "Coppermine River", year: 1771, notes: "First European to reach the Arctic Ocean overland; descended Coppermine River to its mouth." },
    { explorer: "Samuel Hearne", waterway: "Great Slave Lake", year: 1771, notes: "Crossed Great Slave Lake on return journey; documented its extent and Indigenous inhabitants." },

    // Peter Pond
    { explorer: "Peter Pond", waterway: "Churchill River (Saskatchewan)", year: 1778, notes: "Crossed Methye Portage, the crucial link between Hudson Bay and Arctic drainage systems." },
    { explorer: "Peter Pond", waterway: "Lake Athabasca", year: 1778, notes: "First European to reach Lake Athabasca; established fur trade in this rich beaver region." },
    { explorer: "Peter Pond", waterway: "Athabasca River", year: 1778, notes: "Explored the Athabasca River system; his maps guided Mackenzie's later expeditions." },

    // Alexander Mackenzie
    { explorer: "Alexander Mackenzie", waterway: "Lake Athabasca", year: 1787, notes: "Took over Peter Pond's post at Fort Chipewyan; used as base for both major expeditions." },
    { explorer: "Alexander Mackenzie", waterway: "Mackenzie River", year: 1789, notes: "First European to descend the Mackenzie River to the Arctic Ocean, hoping to reach the Pacific." },
    { explorer: "Alexander Mackenzie", waterway: "Great Slave Lake", year: 1789, notes: "Crossed Great Slave Lake to find the river now bearing his name." },
    { explorer: "Alexander Mackenzie", waterway: "Peace River", year: 1793, notes: "Ascended the Peace River on journey to become first European to cross North America north of Mexico." },
    { explorer: "Alexander Mackenzie", waterway: "Fraser River", year: 1793, notes: "Briefly descended upper Fraser before turning back; reached Pacific at Bella Coola." },

    // David Thompson
    { explorer: "David Thompson", waterway: "Saskatchewan River", year: 1786, notes: "Arrived at Cumberland House as HBC apprentice; began surveying the vast river systems of western Canada." },
    { explorer: "David Thompson", waterway: "Lake Athabasca", year: 1796, notes: "Surveyed Lake Athabasca and surrounding regions; determined its true latitude for first time." },
    { explorer: "David Thompson", waterway: "Columbia River", year: 1807, notes: "Traced the Columbia River from its source to mouth; mapped the entire length for the first time." },
    { explorer: "David Thompson", waterway: "Fraser River", year: 1808, notes: "Explored portions of the upper Fraser while surveying the Rocky Mountain region." },

    // Simon Fraser
    { explorer: "Simon Fraser", waterway: "Fraser River", year: 1808, notes: "First European to descend the Fraser River from source to mouth; endured treacherous rapids." },
    { explorer: "Simon Fraser", waterway: "Peace River", year: 1806, notes: "Established Rocky Mountain Portage House at mouth of Moberly River, Peace River system." },

    // Peter Fidler
    { explorer: "Peter Fidler", waterway: "Lake Athabasca", year: 1791, notes: "Surveyed Lake Athabasca as part of extensive mapping of western Canada for HBC." },
    { explorer: "Peter Fidler", waterway: "Red River", year: 1817, notes: "Surveyed the Red River Colony lots; mapped the area extensively." },

    // Franklin
    { explorer: "Sir John Franklin", waterway: "Coppermine River", year: 1821, notes: "Led disastrous first overland expedition; descended Coppermine and mapped Arctic coast. 11 of 20 men died." },
    { explorer: "Sir John Franklin", waterway: "Mackenzie River", year: 1826, notes: "Second expedition descended Mackenzie; mapped coastline east and west of its mouth." },
    { explorer: "Sir John Franklin", waterway: "Great Slave Lake", year: 1825, notes: "Crossed Great Slave Lake during second, more successful, overland expedition." },
    { explorer: "Sir John Franklin", waterway: "Hudson Bay", year: 1845, notes: "Final expedition entered Arctic via Lancaster Sound; ships trapped in ice 1846. All 129 men perished." },

    // George Back
    { explorer: "Sir George Back", waterway: "Thelon River", year: 1834, notes: "Searched for the Great Fish River; traveled near Thelon region before discovering Back River." },

    // John Rae
    { explorer: "Dr. John Rae", waterway: "Hudson Bay", year: 1846, notes: "Conducted extensive surveys of Arctic coastline; learned survival techniques from Inuit." },
    { explorer: "Dr. John Rae", waterway: "Coppermine River", year: 1851, notes: "Explored Coppermine River region during search for Franklin expedition survivors." },

    // McClure
    { explorer: "Sir Robert McClure", waterway: "Hudson Bay", year: 1850, notes: "Entered Arctic from Pacific side; first to traverse Northwest Passage (1850-1854), partly by sledge." },

    // Tyrrell
    { explorer: "Joseph Burr Tyrrell", waterway: "Red River", year: 1884, notes: "Began geological surveys in Manitoba; discovered dinosaur fossils in Alberta in 1884." },
    { explorer: "Joseph Burr Tyrrell", waterway: "Lake Winnipeg", year: 1890, notes: "Surveyed the geology of the Lake Winnipeg region for the Geological Survey of Canada." },
    { explorer: "Joseph Burr Tyrrell", waterway: "Thelon River", year: 1893, notes: "Epic 1893 canoe journey through the Barren Lands via Dubawnt and Thelon rivers." },
    { explorer: "Joseph Burr Tyrrell", waterway: "Lake Athabasca", year: 1893, notes: "Explored northern regions during his surveys; one of the last great wilderness explorers." },

    // Stefansson
    { explorer: "Vilhjalmur Stefansson", waterway: "Mackenzie River", year: 1906, notes: "First Arctic expedition began at mouth of Mackenzie River; lived with Inuit peoples." },
    { explorer: "Vilhjalmur Stefansson", waterway: "Hudson Bay", year: 1913, notes: "Led Canadian Arctic Expedition (1913-1918); discovered new islands; lost ship Karluk in ice." },
  ];

  for (const link of explorerWaterwayLinks) {
    const explorerId = explorerMap.get(link.explorer);
    const waterwayId = waterwayMap.get(link.waterway);

    if (explorerId && waterwayId) {
      // Check if link exists
      const existing = await prisma.explorerWaterway.findFirst({
        where: {
          explorerId,
          waterwayId,
        }
      });

      if (!existing) {
        await prisma.explorerWaterway.create({
          data: {
            explorerId,
            waterwayId,
            yearExplored: link.year,
            expeditionNotes: link.notes,
          }
        });
        console.log(`  ✅ Linked ${link.explorer} → ${link.waterway} (${link.year})`);
      } else {
        // Update with year and notes if missing
        await prisma.explorerWaterway.update({
          where: { id: existing.id },
          data: {
            yearExplored: link.year,
            expeditionNotes: link.notes,
          }
        });
        console.log(`  ✅ Updated ${link.explorer} → ${link.waterway} (${link.year})`);
      }
    }
  }

  // ==================== ADD CARTOGRAPHERS ====================
  console.log("\n🗺️ Adding cartographers...");

  const cartographers = [
    {
      name: "Samuel de Champlain",
      birthYear: 1567,
      deathYear: 1635,
      nationality: "French",
      biography: "Often called the 'Father of New France,' Champlain was also an exceptional cartographer who created some of the first accurate maps of the Atlantic coast and St. Lawrence region.",
      notableMaps: "Map of New France (1612); Map of the St. Lawrence (1632); numerous coastal and inland charts",
    },
    {
      name: "David Thompson",
      birthYear: 1770,
      deathYear: 1857,
      nationality: "English/Canadian",
      biography: "Called 'the greatest land geographer who ever lived,' Thompson mapped over 3.9 million square kilometers of North America with remarkable accuracy using astronomical observations.",
      notableMaps: "Great Map of the North West (1814) - spanning from Hudson Bay to the Pacific; detailed charts of Columbia River system",
    },
    {
      name: "Peter Fidler",
      birthYear: 1769,
      deathYear: 1822,
      nationality: "English",
      biography: "Hudson's Bay Company surveyor who produced over 200 maps during his career, documenting the geography of the Canadian prairies and western river systems.",
      notableMaps: "Maps of the Athabasca region; surveys of the 49th parallel; numerous HBC trading post locations",
    },
    {
      name: "Philippe Buache",
      birthYear: 1700,
      deathYear: 1773,
      nationality: "French",
      biography: "French royal geographer who created influential maps of North America based on explorer reports. His theoretical maps sometimes included imaginary features like a 'Sea of the West.'",
      notableMaps: "Map of Canada (1754); theoretical maps of western North America",
    },
    {
      name: "Aaron Arrowsmith",
      birthYear: 1750,
      deathYear: 1823,
      nationality: "English",
      biography: "London-based cartographer who compiled explorer reports into comprehensive maps of North America. His maps were the standard reference for decades.",
      notableMaps: "Map of America (1795-1814) - continuously updated with Mackenzie, Thompson, and other explorer data",
    },
    {
      name: "Joseph Bouchette",
      birthYear: 1774,
      deathYear: 1841,
      nationality: "Canadian",
      biography: "Surveyor General of Lower Canada who produced detailed topographical descriptions and maps of British North America.",
      notableMaps: "The British Dominions in North America (1831); Topographical Dictionary of Lower Canada (1832)",
    },
  ];

  for (const cartographer of cartographers) {
    const existing = await prisma.cartographer.findFirst({
      where: { name: cartographer.name }
    });

    if (!existing) {
      await prisma.cartographer.create({ data: cartographer });
      console.log(`  ✅ Added ${cartographer.name}`);
    } else {
      await prisma.cartographer.update({
        where: { id: existing.id },
        data: cartographer
      });
      console.log(`  ✅ Updated ${cartographer.name}`);
    }
  }

  console.log("\n🎉 Historical data update complete!");

  // Print summary
  const explorerCount = await prisma.explorer.count();
  const discoveryCount = await prisma.archaeologicalDiscovery.count();
  const cartographerCount = await prisma.cartographer.count();
  const linkCount = await prisma.explorerWaterway.count();

  console.log(`\nSummary:`);
  console.log(`  - ${explorerCount} explorers (spanning 970 AD to 1962)`);
  console.log(`  - ${discoveryCount} archaeological discoveries`);
  console.log(`  - ${cartographerCount} cartographers`);
  console.log(`  - ${linkCount} explorer-waterway connections`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
