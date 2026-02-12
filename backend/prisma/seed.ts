import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌊 Seeding Canadian Waterways Database...");

  // Create waterway types
  const riverType = await prisma.waterwayType.upsert({
    where: { name: "River" },
    update: {},
    create: { name: "River" }
  });

  const lakeType = await prisma.waterwayType.upsert({
    where: { name: "Lake" },
    update: {},
    create: { name: "Lake" }
  });

  const bayType = await prisma.waterwayType.upsert({
    where: { name: "Bay" },
    update: {},
    create: { name: "Bay" }
  });

  const straitType = await prisma.waterwayType.upsert({
    where: { name: "Strait" },
    update: {},
    create: { name: "Strait" }
  });

  console.log("✅ Created waterway types");

  // Create explorers
  const champlain = await prisma.explorer.create({
    data: {
      name: "Samuel de Champlain",
      birthYear: 1567,
      deathYear: 1635,
      nationality: "French",
      biography: "Known as the 'Father of New France,' Champlain founded Quebec City in 1608 and extensively explored the St. Lawrence River region, mapping much of eastern Canada.",
      notableAchievements: "Founded Quebec City (1608), explored the Great Lakes, created detailed maps of New France, established trade relations with Indigenous peoples",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samuel_de_Champlain_portrait.jpg/220px-Samuel_de_Champlain_portrait.jpg"
    }
  });

  // Alexander Mackenzie - find existing or create
  // The comprehensive seed file may have already created this explorer
  let mackenzie = await prisma.explorer.findFirst({
    where: { name: "Alexander Mackenzie" }
  });
  if (!mackenzie) {
    mackenzie = await prisma.explorer.create({
      data: {
        name: "Alexander Mackenzie",
        birthYear: 1764,
        deathYear: 1820,
        nationality: "Scottish",
        biography: "First European to complete a transcontinental crossing of North America north of Mexico. Explored the river that now bears his name to the Arctic Ocean in 1789.",
        notableAchievements: "First transcontinental crossing (1793), explored Mackenzie River to Arctic Ocean (1789), knighted in 1802",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/AlexanderMackenzie.jpg/220px-AlexanderMackenzie.jpg"
      }
    });
  }

  const thompson = await prisma.explorer.create({
    data: {
      name: "David Thompson",
      birthYear: 1770,
      deathYear: 1857,
      nationality: "English-Canadian",
      biography: "Known as 'the greatest land geographer who ever lived,' Thompson mapped over 3.9 million square kilometers of North America, including the Columbia River system.",
      notableAchievements: "Mapped western Canada and northwestern US, discovered Athabasca Pass, first to navigate entire length of Columbia River",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/David_Thompson_%28explorer%29.jpg/220px-David_Thompson_%28explorer%29.jpg"
    }
  });

  const hearne = await prisma.explorer.create({
    data: {
      name: "Samuel Hearne",
      birthYear: 1745,
      deathYear: 1792,
      nationality: "English",
      biography: "First European to reach the Arctic Ocean overland from Hudson Bay. His journey with Dene guide Matonabbee covered over 5,600 km.",
      notableAchievements: "First European to reach Arctic Ocean overland (1771), established Cumberland House (first inland HBC post)",
      imageUrl: null
    }
  });

  const franklin = await prisma.explorer.create({
    data: {
      name: "Sir John Franklin",
      birthYear: 1786,
      deathYear: 1847,
      nationality: "English",
      biography: "Royal Navy officer who led two overland Arctic expeditions mapping northern Canada's coastline. His final expedition to find the Northwest Passage ended in tragedy.",
      notableAchievements: "Mapped northern coastline of Canada, led Arctic expeditions (1819-1822, 1825-1827), died seeking Northwest Passage",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sir_John_Franklin%2C_Kt.%2C_R.N..jpg/220px-Sir_John_Franklin%2C_Kt.%2C_R.N..jpg"
    }
  });

  const fraser = await prisma.explorer.create({
    data: {
      name: "Simon Fraser",
      birthYear: 1776,
      deathYear: 1862,
      nationality: "American-Canadian",
      biography: "Fur trader and explorer who charted the Fraser River in 1808 for the North West Company. The river was later named in his honor.",
      notableAchievements: "First European to travel length of Fraser River (1808), established Fort George and Fort Fraser",
      imageUrl: null
    }
  });

  console.log("✅ Created explorers");

  // Create cartographers
  const joliet = await prisma.cartographer.create({
    data: {
      name: "Louis Jolliet",
      birthYear: 1645,
      deathYear: 1700,
      nationality: "French-Canadian",
      biography: "Explorer and hydrographer who, with Father Marquette, explored and mapped the Mississippi River. Created first detailed maps of the Great Lakes region.",
      notableMaps: "First accurate maps of the Great Lakes and upper Mississippi River (1673-1674)"
    }
  });

  const bellin = await prisma.cartographer.create({
    data: {
      name: "Jacques-Nicolas Bellin",
      birthYear: 1703,
      deathYear: 1772,
      nationality: "French",
      biography: "Chief cartographer of the French Navy who created influential maps of New France and the Canadian interior.",
      notableMaps: "Carte de l'Amérique Septentrionale (1755), numerous maps of Canadian rivers and lakes"
    }
  });

  console.log("✅ Created cartographers");

  // Create Indigenous Nations
  await prisma.indigenousNation.createMany({
    data: [
      {
        name: "Cree",
        alternateNames: "Nehiyawak, Ininiwak",
        languageFamily: "Algonquian",
        traditionalTerritory: "From James Bay west to the Rocky Mountains, encompassing much of the Canadian prairies and boreal forest",
        culturalNotes: "The Cree developed extensive canoe routes along major waterways for trade and seasonal movement. Rivers like the Churchill and Saskatchewan were central to their way of life."
      },
      {
        name: "Anishinaabe (Ojibwe)",
        alternateNames: "Ojibway, Chippewa, Saulteaux",
        languageFamily: "Algonquian",
        traditionalTerritory: "Great Lakes region, extending from Ontario to Saskatchewan",
        culturalNotes: "Master canoe builders who developed the birchbark canoe. The Great Lakes and connecting waterways were central to trade, fishing, and wild rice harvesting."
      },
      {
        name: "Haudenosaunee (Iroquois)",
        alternateNames: "Six Nations, Iroquois Confederacy",
        languageFamily: "Iroquoian",
        traditionalTerritory: "St. Lawrence Valley and Great Lakes lowlands, primarily in present-day Ontario, Quebec, and New York State",
        culturalNotes: "Controlled strategic waterways and portages, which gave them significant influence in the fur trade. The St. Lawrence River was central to their confederation."
      },
      {
        name: "Dene",
        alternateNames: "Athabaskan, Chipewyan",
        languageFamily: "Athapaskan",
        traditionalTerritory: "Northwest Territories, northern Alberta, Saskatchewan, and Manitoba",
        culturalNotes: "Guided European explorers like Samuel Hearne along northern river routes. The Mackenzie River (Deh Cho - 'Big River') has been their highway for millennia."
      },
      {
        name: "Mi'kmaq",
        alternateNames: "Micmac",
        languageFamily: "Algonquian",
        traditionalTerritory: "Maritime provinces, Gaspé Peninsula, and parts of Maine",
        culturalNotes: "Skilled seafarers and fishermen who used coastal waterways and rivers for travel and sustenance. First Indigenous peoples to encounter European explorers."
      },
      {
        name: "Inuit",
        alternateNames: "Eskimo (outdated)",
        languageFamily: "Inuit-Yupik-Unangan",
        traditionalTerritory: "Arctic coast from Alaska to Greenland, including northern Quebec and Labrador",
        culturalNotes: "Masters of Arctic waterways, using kayaks and umiaks for hunting and travel. Their knowledge of Arctic conditions was essential to European polar expeditions."
      },
      {
        name: "Stó:lō",
        alternateNames: "Sto:lo, People of the River",
        languageFamily: "Salish",
        traditionalTerritory: "Fraser River Valley in British Columbia",
        culturalNotes: "The name Stó:lō means 'river' in Halkomelem. The Fraser River salmon runs have sustained their culture for thousands of years."
      }
    ]
  });

  console.log("✅ Created Indigenous nations");

  // Create major waterways
  const stLawrence = await prisma.waterway.create({
    data: {
      name: "St. Lawrence River",
      indigenousName: "Kaniatarowanenneh",
      indigenousLanguage: "Mohawk",
      description: "One of North America's great rivers, flowing from Lake Ontario to the Gulf of St. Lawrence. It served as the main highway into the heart of the continent.",
      latitude: 46.8139,
      longitude: -71.2082,
      regionName: "Quebec / Ontario",
      typeId: riverType.id,
      historicalSignificance: "Gateway to New France, primary route for exploration and fur trade into the interior of North America. Jacques Cartier sailed up the river in 1535."
    }
  });

  const mackenzieRiver = await prisma.waterway.create({
    data: {
      name: "Mackenzie River",
      indigenousName: "Deh Cho",
      indigenousLanguage: "Dene",
      description: "Canada's longest river system, flowing 1,738 km from Great Slave Lake to the Arctic Ocean. Second largest river system in North America after the Mississippi.",
      latitude: 68.9355,
      longitude: -136.3872,
      regionName: "Northwest Territories",
      typeId: riverType.id,
      historicalSignificance: "Alexander Mackenzie traveled this river to the Arctic Ocean in 1789, becoming the first European to do so. The river was central to Dene life for thousands of years."
    }
  });

  const fraserRiver = await prisma.waterway.create({
    data: {
      name: "Fraser River",
      indigenousName: "Sto:lo",
      indigenousLanguage: "Halkomelem",
      description: "British Columbia's longest river at 1,375 km, famous for its dramatic canyon and salmon runs. Flows from the Rocky Mountains to the Pacific Ocean.",
      latitude: 49.1913,
      longitude: -122.9109,
      regionName: "British Columbia",
      typeId: riverType.id,
      historicalSignificance: "Simon Fraser navigated this treacherous river in 1808. The river's salmon runs have sustained Coast Salish peoples for over 9,000 years."
    }
  });

  const ottawaRiver = await prisma.waterway.create({
    data: {
      name: "Ottawa River",
      indigenousName: "Kichi Sibi",
      indigenousLanguage: "Algonquin",
      description: "Major tributary of the St. Lawrence, forming the border between Ontario and Quebec. Essential canoe route to the interior.",
      latitude: 45.4368,
      longitude: -75.9287,
      regionName: "Ontario / Quebec",
      typeId: riverType.id,
      historicalSignificance: "The 'Grand River' of the fur trade, this was the main route from Montreal to the pays d'en haut (upper country). Champlain traveled it in 1613."
    }
  });

  const saskatchewanRiver = await prisma.waterway.create({
    data: {
      name: "Saskatchewan River",
      indigenousName: "Kisiskāciwani-sīpiy",
      indigenousLanguage: "Cree",
      description: "Major river of the prairies, formed by the North and South Saskatchewan rivers. The name means 'swift-flowing river' in Cree.",
      latitude: 53.1799,
      longitude: -105.7583,
      regionName: "Saskatchewan / Manitoba",
      typeId: riverType.id,
      historicalSignificance: "Highway of the western fur trade. Cumberland House, the first inland HBC post, was established here in 1774."
    }
  });

  const churchillRiver = await prisma.waterway.create({
    data: {
      name: "Churchill River (Saskatchewan)",
      indigenousName: "Missinipi",
      indigenousLanguage: "Cree",
      description: "Major river of northern Saskatchewan, the name Missinipi means 'Big Water' in Cree. Important fur trade route connecting Hudson Bay to the interior.",
      latitude: 56.5,
      longitude: -104.0,
      regionName: "Saskatchewan / Manitoba",
      typeId: riverType.id,
      historicalSignificance: "Key route of the fur trade connecting Hudson Bay to the Athabasca region. Peter Pond used this route in 1778 to reach the rich beaver country."
    }
  });

  const columbiaRiver = await prisma.waterway.create({
    data: {
      name: "Columbia River",
      indigenousName: "Wimahl / Nch'i-Wàna",
      indigenousLanguage: "Sahaptin",
      description: "Largest river in the Pacific Northwest, originating in BC's Columbia Lake and flowing 2,000 km to the Pacific Ocean.",
      latitude: 50.3100,
      longitude: -116.5533,
      regionName: "British Columbia",
      typeId: riverType.id,
      historicalSignificance: "David Thompson became the first European to navigate the entire length in 1811. The river was central to the Pacific fur trade."
    }
  });

  // Great Lakes
  const lakeSuperior = await prisma.waterway.create({
    data: {
      name: "Lake Superior",
      indigenousName: "Gichigami",
      indigenousLanguage: "Ojibwe",
      description: "Largest freshwater lake by surface area in the world. The name Gichigami means 'Great Sea' in Ojibwe.",
      latitude: 47.7,
      longitude: -87.5,
      regionName: "Ontario",
      typeId: lakeType.id,
      historicalSignificance: "Gateway to the western fur trade. Étienne Brûlé likely reached it in 1622, and it was central to Ojibwe territory and culture."
    }
  });

  const lakeHuron = await prisma.waterway.create({
    data: {
      name: "Lake Huron",
      indigenousName: "Karegnondi",
      indigenousLanguage: "Wyandot",
      description: "Second largest of the Great Lakes by surface area. Named after the Huron (Wyandot) people by French explorers.",
      latitude: 44.8,
      longitude: -82.4,
      regionName: "Ontario",
      typeId: lakeType.id,
      historicalSignificance: "Champlain reached its shores in 1615. Became crucial to French-Indigenous trade relations and the Jesuit missions."
    }
  });

  const lakeOntario = await prisma.waterway.create({
    data: {
      name: "Lake Ontario",
      indigenousName: "Skanadario",
      indigenousLanguage: "Seneca",
      description: "Smallest of the Great Lakes by surface area but with the greatest average depth. The name means 'beautiful lake' in Iroquoian languages.",
      latitude: 43.7,
      longitude: -77.9,
      regionName: "Ontario",
      typeId: lakeType.id,
      historicalSignificance: "Controlled by the Haudenosaunee (Iroquois), it was the gateway from the St. Lawrence to the upper Great Lakes and western territories."
    }
  });

  const lakeWinnipeg = await prisma.waterway.create({
    data: {
      name: "Lake Winnipeg",
      indigenousName: "Win-nipi",
      indigenousLanguage: "Cree",
      description: "Tenth largest freshwater lake in the world, located in Manitoba. The name means 'muddy waters' in Cree.",
      latitude: 52.1,
      longitude: -97.25,
      regionName: "Manitoba",
      typeId: lakeType.id,
      historicalSignificance: "Crossroads of the western fur trade. La Vérendrye reached it in 1733, and it connected the Hudson Bay and St. Lawrence trading networks."
    }
  });

  const greatSlaveLake = await prisma.waterway.create({
    data: {
      name: "Great Slave Lake",
      indigenousName: "Tu Nedhé",
      indigenousLanguage: "Dene",
      description: "Deepest lake in North America (614 m) and ninth largest in the world. Source of the Mackenzie River.",
      latitude: 61.6667,
      longitude: -114.0,
      regionName: "Northwest Territories",
      typeId: lakeType.id,
      historicalSignificance: "Named after the Slavey Dene people. Samuel Hearne was first European to see it (1771). Gateway to the Mackenzie River route north."
    }
  });

  const greatBearLake = await prisma.waterway.create({
    data: {
      name: "Great Bear Lake",
      indigenousName: "Sahtu",
      indigenousLanguage: "Dene",
      description: "Largest lake entirely within Canada and fourth largest in North America. Located on the Arctic Circle.",
      latitude: 66.0,
      longitude: -121.0,
      regionName: "Northwest Territories",
      typeId: lakeType.id,
      historicalSignificance: "Remote location meant late European contact. John Franklin wintered here in 1825-1827 during his Arctic expeditions."
    }
  });

  const lakeAthabasca = await prisma.waterway.create({
    data: {
      name: "Lake Athabasca",
      indigenousName: "Desnethché",
      indigenousLanguage: "Dene",
      description: "Eighth largest lake in Canada, straddling Alberta and Saskatchewan. The name Athabasca means 'place where there are reeds' in Cree.",
      latitude: 59.25,
      longitude: -109.5,
      regionName: "Alberta / Saskatchewan",
      typeId: lakeType.id,
      historicalSignificance: "Heart of the Athabasca fur trade. Peter Pond established a post here in 1778, opening the incredibly rich beaver country."
    }
  });

  // Hudson Bay
  const hudsonBay = await prisma.waterway.create({
    data: {
      name: "Hudson Bay",
      indigenousName: "Wînipekw Kihci-kâmiy",
      indigenousLanguage: "Cree",
      description: "Massive inland sea connected to the Atlantic and Arctic Oceans. Second largest bay in the world after Bay of Bengal.",
      latitude: 60.0,
      longitude: -85.0,
      regionName: "Multiple Provinces/Territories",
      typeId: bayType.id,
      historicalSignificance: "Named after Henry Hudson (1611). Gateway for the Hudson's Bay Company, which established trading posts along its shores starting in 1668."
    }
  });

  const jamesBay = await prisma.waterway.create({
    data: {
      name: "James Bay",
      indigenousName: "Wînipekw",
      indigenousLanguage: "Cree",
      description: "Southern extension of Hudson Bay, between Ontario and Quebec. Important for the fur trade and Cree communities.",
      latitude: 53.0,
      longitude: -80.5,
      regionName: "Ontario / Quebec",
      typeId: bayType.id,
      historicalSignificance: "Named after Thomas James (1631). Site of early HBC posts including Moose Factory (1673), one of the oldest English settlements in Canada."
    }
  });

  console.log("✅ Created waterways");

  // Link explorers to waterways
  await prisma.explorerWaterway.createMany({
    data: [
      { explorerId: champlain.id, waterwayId: stLawrence.id, yearExplored: 1608, expeditionNotes: "Founded Quebec City on the St. Lawrence River" },
      { explorerId: champlain.id, waterwayId: ottawaRiver.id, yearExplored: 1613, expeditionNotes: "Explored the Ottawa River seeking route to China" },
      { explorerId: champlain.id, waterwayId: lakeHuron.id, yearExplored: 1615, expeditionNotes: "First European to reach Lake Huron via French River" },
      { explorerId: mackenzie.id, waterwayId: mackenzieRiver.id, yearExplored: 1789, expeditionNotes: "Traveled river to Arctic Ocean in search of Pacific" },
      { explorerId: mackenzie.id, waterwayId: lakeAthabasca.id, yearExplored: 1789, expeditionNotes: "Starting point for journey to Arctic Ocean" },
      { explorerId: thompson.id, waterwayId: columbiaRiver.id, yearExplored: 1811, expeditionNotes: "First European to travel full length to Pacific" },
      { explorerId: thompson.id, waterwayId: saskatchewanRiver.id, yearExplored: 1786, expeditionNotes: "Surveyed and mapped the river system" },
      { explorerId: hearne.id, waterwayId: churchillRiver.id, yearExplored: 1770, expeditionNotes: "Traveled overland from Churchill to Arctic" },
      { explorerId: hearne.id, waterwayId: greatSlaveLake.id, yearExplored: 1771, expeditionNotes: "First European to see Great Slave Lake" },
      { explorerId: franklin.id, waterwayId: greatBearLake.id, yearExplored: 1825, expeditionNotes: "Wintered at Fort Franklin while mapping Arctic coast" },
      { explorerId: franklin.id, waterwayId: mackenzieRiver.id, yearExplored: 1825, expeditionNotes: "Explored Mackenzie Delta and Arctic coast" },
      { explorerId: fraser.id, waterwayId: fraserRiver.id, yearExplored: 1808, expeditionNotes: "First European to navigate the entire Fraser River" }
    ]
  });

  console.log("✅ Linked explorers to waterways");

  // Create fur trade info
  await prisma.furTradeInfo.createMany({
    data: [
      {
        waterwayId: stLawrence.id,
        tradingCompany: "French Crown / Multiple Companies",
        peakTradePeriod: "1600-1760",
        primaryFurs: "Beaver, Marten",
        tradeRouteNotes: "Gateway to New France. Montreal became the center of the French fur trade."
      },
      {
        waterwayId: ottawaRiver.id,
        tradingCompany: "North West Company",
        peakTradePeriod: "1780-1821",
        primaryFurs: "Beaver, Marten, Otter",
        tradeRouteNotes: "Main canoe route from Montreal to the pays d'en haut. Voyageurs paddled up to 18 hours daily."
      },
      {
        waterwayId: saskatchewanRiver.id,
        tradingCompany: "Hudson's Bay Company / North West Company",
        peakTradePeriod: "1774-1870",
        primaryFurs: "Beaver, Muskrat, Wolf",
        tradeRouteNotes: "Highway to the prairies. Rival companies built competing posts along its length."
      },
      {
        waterwayId: churchillRiver.id,
        tradingCompany: "Hudson's Bay Company / North West Company",
        peakTradePeriod: "1774-1821",
        primaryFurs: "Beaver, Marten, Lynx",
        tradeRouteNotes: "Connected HBC posts to rich Athabasca beaver country via Methye Portage."
      },
      {
        waterwayId: lakeAthabasca.id,
        tradingCompany: "North West Company / HBC",
        peakTradePeriod: "1778-1821",
        primaryFurs: "Beaver (finest quality)",
        tradeRouteNotes: "The richest beaver country in North America. Competition here was fierce between rival companies."
      },
      {
        waterwayId: hudsonBay.id,
        tradingCompany: "Hudson's Bay Company",
        peakTradePeriod: "1670-1870",
        primaryFurs: "Beaver, various",
        tradeRouteNotes: "HBC established posts around the bay, waiting for Indigenous traders to bring furs down the rivers."
      },
      {
        waterwayId: fraserRiver.id,
        tradingCompany: "North West Company / HBC",
        peakTradePeriod: "1808-1846",
        primaryFurs: "Beaver, Sea Otter",
        tradeRouteNotes: "Pacific slope fur trade. Simon Fraser established posts hoping the river led to the Columbia."
      },
      {
        waterwayId: columbiaRiver.id,
        tradingCompany: "North West Company / Pacific Fur Company / HBC",
        peakTradePeriod: "1811-1846",
        primaryFurs: "Beaver, Sea Otter, Salmon",
        tradeRouteNotes: "Gateway to Pacific trade. Fort Vancouver became headquarters for Columbia District."
      }
    ]
  });

  console.log("✅ Created fur trade information");

  // Create notable locations
  await prisma.location.createMany({
    data: [
      // St. Lawrence locations
      {
        name: "Quebec City",
        indigenousName: "Kébec",
        indigenousLanguage: "Algonquin",
        description: "Founded in 1608 by Samuel de Champlain, this fortified city became the capital of New France and heart of the fur trade.",
        latitude: 46.8139,
        longitude: -71.2080,
        locationType: "Settlement",
        yearEstablished: 1608,
        historicalNotes: "Kébec means 'where the river narrows' in Algonquin. The narrow point made it strategically important for controlling river traffic.",
        waterwayId: stLawrence.id,
        cartographerId: null
      },
      {
        name: "Montreal",
        indigenousName: "Tiohtià:ke / Mooniyang",
        indigenousLanguage: "Mohawk / Anishinaabemowin",
        description: "Originally a fortified mission, Montreal became the departure point for fur trade voyageurs heading west.",
        latitude: 45.5017,
        longitude: -73.5673,
        locationType: "Settlement",
        yearEstablished: 1642,
        historicalNotes: "Site of Hochelaga, an Iroquoian village visited by Cartier in 1535. The annual fur trade fair drew thousands.",
        waterwayId: stLawrence.id,
        cartographerId: null
      },
      // Hudson Bay locations
      {
        name: "York Factory",
        indigenousName: "Kichiwasakahikanihk",
        indigenousLanguage: "Cree",
        description: "Most important HBC trading post, located at the mouth of the Hayes River. Gateway to the western fur country.",
        latitude: 57.0047,
        longitude: -92.3016,
        locationType: "Trading Post",
        yearEstablished: 1684,
        historicalNotes: "Name means 'at the big house' in Cree. Tens of thousands of beaver pelts passed through here annually at its peak.",
        waterwayId: hudsonBay.id,
        cartographerId: null
      },
      {
        name: "Fort Churchill",
        indigenousName: null,
        indigenousLanguage: null,
        description: "Northern HBC post and departure point for Samuel Hearne's journeys to the Arctic.",
        latitude: 58.7684,
        longitude: -94.1650,
        locationType: "Fort",
        yearEstablished: 1717,
        historicalNotes: "Stone fort built 1731-1771 to protect against French attacks. Now a national historic site.",
        waterwayId: hudsonBay.id,
        cartographerId: null
      },
      // Great Lakes locations
      {
        name: "Sault Ste. Marie",
        indigenousName: "Baawitigong",
        indigenousLanguage: "Ojibwe",
        description: "Strategic portage at the rapids between Lake Superior and Lake Huron. Meeting place for Indigenous peoples for millennia.",
        latitude: 46.4977,
        longitude: -84.3476,
        locationType: "Portage",
        yearEstablished: null,
        historicalNotes: "Baawitigong means 'at the rapids.' Annual whitefish runs made this a gathering place for centuries.",
        waterwayId: lakeSuperior.id,
        cartographerId: null
      },
      {
        name: "Grand Portage",
        indigenousName: "Gichi-onigaming",
        indigenousLanguage: "Ojibwe",
        description: "Major North West Company post and beginning of the 14-km portage around the falls of the Pigeon River.",
        latitude: 47.9611,
        longitude: -89.6868,
        locationType: "Portage",
        yearEstablished: 1731,
        historicalNotes: "Annual Rendezvous held here where winterers met Montreal canoes. Route connected Lake Superior to interior.",
        waterwayId: lakeSuperior.id,
        cartographerId: null
      },
      // Saskatchewan River locations
      {
        name: "Cumberland House",
        indigenousName: null,
        indigenousLanguage: null,
        description: "First inland post of the Hudson's Bay Company, established by Samuel Hearne in 1774.",
        latitude: 53.9612,
        longitude: -102.2889,
        locationType: "Trading Post",
        yearEstablished: 1774,
        historicalNotes: "Marked HBC's shift from waiting at Hudson Bay to competing inland. Still an active community today.",
        waterwayId: saskatchewanRiver.id,
        cartographerId: null
      },
      {
        name: "Fort Edmonton",
        indigenousName: "Amiskwaciy-wâskahikan",
        indigenousLanguage: "Cree",
        description: "Major HBC post that grew to become Alberta's capital. Name means 'beaver hills house' in Cree.",
        latitude: 53.5461,
        longitude: -113.4938,
        locationType: "Fort",
        yearEstablished: 1795,
        historicalNotes: "Originally Fort Augustus (NWC) and Edmonton House (HBC) built side by side. Center of prairie fur trade.",
        waterwayId: saskatchewanRiver.id,
        cartographerId: null
      },
      // Athabasca region
      {
        name: "Fort Chipewyan",
        indigenousName: "K'ai Tailé",
        indigenousLanguage: "Dene",
        description: "Gateway to the Mackenzie River system and one of the oldest continuously occupied European settlements in Alberta.",
        latitude: 58.7181,
        longitude: -111.1519,
        locationType: "Fort",
        yearEstablished: 1788,
        historicalNotes: "Founded by the North West Company. Both Alexander Mackenzie's expeditions departed from here.",
        waterwayId: lakeAthabasca.id,
        cartographerId: null
      },
      // Mackenzie River
      {
        name: "Fort Good Hope",
        indigenousName: "Radeyilıkoe",
        indigenousLanguage: "Dene",
        description: "North West Company post established along the Mackenzie River, important for northern fur trade.",
        latitude: 66.2567,
        longitude: -128.6317,
        locationType: "Fort",
        yearEstablished: 1805,
        historicalNotes: "Located just south of the Arctic Circle. Franklin's expeditions resupplied here.",
        waterwayId: mackenzieRiver.id,
        cartographerId: null
      },
      // Fraser River
      {
        name: "Fort Langley",
        indigenousName: null,
        indigenousLanguage: null,
        description: "HBC post that became the birthplace of British Columbia when the colony was proclaimed here in 1858.",
        latitude: 49.1725,
        longitude: -122.5736,
        locationType: "Fort",
        yearEstablished: 1827,
        historicalNotes: "Traded furs and salmon. Gold Rush transformed it from fur post to colonial center.",
        waterwayId: fraserRiver.id,
        cartographerId: null
      },
      // Ottawa River
      {
        name: "Fort Témiscamingue",
        indigenousName: "Obadjiwan",
        indigenousLanguage: "Algonquin",
        description: "Strategic post at the head of Lake Timiskaming, controlling the route to the upper Ottawa.",
        latitude: 47.1333,
        longitude: -79.4500,
        locationType: "Fort",
        yearEstablished: 1720,
        historicalNotes: "One of the most important posts of the French regime. Site of annual fur trade gatherings.",
        waterwayId: ottawaRiver.id,
        cartographerId: joliet.id
      }
    ]
  });

  console.log("✅ Created historic locations");

  console.log("\n🎉 Database seeded successfully!");
  console.log(`
Summary:
- ${await prisma.waterwayType.count()} waterway types
- ${await prisma.waterway.count()} waterways
- ${await prisma.explorer.count()} explorers
- ${await prisma.cartographer.count()} cartographers
- ${await prisma.indigenousNation.count()} Indigenous nations
- ${await prisma.location.count()} historic locations
- ${await prisma.furTradeInfo.count()} fur trade records
  `);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
