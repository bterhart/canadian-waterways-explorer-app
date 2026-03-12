import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simplified boundary coordinates for major waterways
// In production, these would come from GeoJSON data sources

// St. Lawrence River - simplified path from Lake Ontario to Gulf
const stLawrenceCoords = [
  [43.2, -79.2], [43.5, -78.8], [44.0, -76.5], [44.3, -76.0], [44.5, -75.7],
  [44.8, -75.5], [45.0, -74.8], [45.5, -73.6], [45.8, -73.2], [46.1, -72.9],
  [46.5, -72.3], [46.8, -71.2], [47.0, -70.8], [47.3, -70.2], [47.8, -69.5],
  [48.3, -69.0], [48.8, -68.2], [49.2, -67.0], [49.5, -66.0]
];

// Mackenzie River - from Great Slave Lake to Arctic
const mackenzieCoords = [
  [61.5, -117.2], [62.0, -118.0], [62.8, -119.5], [63.5, -121.0], [64.2, -123.0],
  [64.8, -124.5], [65.3, -126.0], [65.8, -127.5], [66.3, -128.5], [66.8, -130.0],
  [67.3, -131.5], [67.8, -133.0], [68.3, -134.0], [68.9, -136.4]
];

// Fraser River - from Rocky Mountains to Pacific
const fraserCoords = [
  [52.9, -118.4], [52.5, -119.3], [52.2, -120.5], [51.8, -121.3], [51.2, -121.8],
  [50.7, -122.0], [50.2, -121.8], [49.8, -121.5], [49.4, -121.8], [49.2, -122.5],
  [49.2, -122.9]
];

// Ottawa River
const ottawaCoords = [
  [46.4, -79.1], [46.2, -78.5], [45.9, -77.8], [45.7, -77.0], [45.6, -76.3],
  [45.5, -75.9], [45.4, -75.7]
];

// Saskatchewan River
const saskatchewanCoords = [
  [52.5, -117.5], [52.8, -115.5], [53.0, -113.5], [53.2, -111.0], [53.3, -108.5],
  [53.2, -106.0], [53.1, -104.0], [53.0, -101.5], [53.2, -99.3]
];

// Churchill River
const churchillCoords = [
  [54.8, -108.5], [55.2, -106.5], [55.5, -104.5], [55.8, -102.5], [56.2, -100.5],
  [56.5, -98.5], [56.8, -96.5], [57.0, -94.2]
];

// Columbia River (Canadian section)
const columbiaCoords = [
  [50.2, -115.8], [50.5, -116.0], [50.8, -117.0], [51.0, -117.5], [51.3, -117.8],
  [51.8, -118.0], [52.2, -118.5]
];

// Lake Superior outline (simplified polygon)
const lakeSuperiorCoords = [
  [46.5, -84.5], [46.8, -85.5], [47.2, -86.5], [47.5, -87.5], [47.8, -88.5],
  [48.0, -89.0], [48.3, -89.3], [48.5, -89.0], [48.3, -88.0], [48.0, -87.0],
  [47.5, -86.0], [47.0, -85.0], [46.5, -84.5]
];

// Lake Huron outline (simplified polygon)
const lakeHuronCoords = [
  [43.5, -82.0], [44.0, -82.5], [44.5, -82.8], [45.0, -83.0], [45.5, -83.5],
  [46.0, -83.8], [46.0, -82.5], [45.5, -81.5], [45.0, -81.0], [44.5, -81.5],
  [44.0, -81.5], [43.5, -82.0]
];

// Lake Ontario outline (simplified polygon)
const lakeOntarioCoords = [
  [43.2, -79.8], [43.3, -79.0], [43.5, -78.0], [43.8, -77.0], [44.0, -76.5],
  [44.0, -77.5], [43.8, -78.5], [43.5, -79.3], [43.2, -79.8]
];

// Lake Winnipeg outline (simplified polygon)
const lakeWinnipegCoords = [
  [50.4, -96.5], [50.8, -97.0], [51.5, -97.2], [52.0, -97.0], [52.5, -96.8],
  [53.0, -97.5], [53.5, -98.0], [53.3, -97.0], [52.8, -96.5], [52.2, -96.5],
  [51.5, -96.8], [50.8, -96.5], [50.4, -96.5]
];

// Great Slave Lake outline (simplified polygon)
const greatSlaveCoords = [
  [61.0, -116.5], [61.3, -115.5], [61.5, -114.0], [62.0, -113.0], [62.5, -112.0],
  [62.8, -111.0], [62.5, -110.5], [62.0, -111.5], [61.5, -112.5], [61.2, -114.0],
  [61.0, -115.5], [61.0, -116.5]
];

// Great Bear Lake outline (simplified polygon)
const greatBearCoords = [
  [65.5, -123.0], [65.8, -122.0], [66.2, -121.0], [66.5, -120.0], [66.8, -119.0],
  [67.0, -119.5], [66.8, -120.5], [66.5, -121.5], [66.0, -122.5], [65.5, -123.0]
];

// Lake Athabasca outline (simplified polygon)
const lakeAthabascaCoords = [
  [58.5, -111.0], [58.8, -110.5], [59.2, -109.5], [59.5, -108.5], [59.5, -107.5],
  [59.2, -108.0], [58.8, -109.0], [58.5, -110.0], [58.5, -111.0]
];

// Hudson Bay outline (simplified - major points)
const hudsonBayCoords = [
  [51.0, -79.5], [52.0, -80.0], [54.0, -82.0], [56.0, -85.0], [58.0, -88.0],
  [60.0, -90.0], [62.0, -92.0], [63.0, -91.0], [63.5, -87.0], [63.0, -82.0],
  [61.0, -80.0], [58.0, -78.0], [55.0, -77.0], [52.0, -78.0], [51.0, -79.5]
];

// James Bay outline (simplified polygon)
const jamesBayCoords = [
  [51.0, -79.5], [51.5, -80.0], [52.0, -80.5], [52.5, -81.0], [53.0, -81.5],
  [53.5, -82.0], [54.0, -81.5], [53.5, -80.5], [53.0, -79.5], [52.5, -79.0],
  [52.0, -78.5], [51.5, -79.0], [51.0, -79.5]
];

async function main() {
  console.log("🌊 Updating waterways with boundary coordinates...");

  // Update existing waterways with boundaries
  const waterways = await prisma.waterway.findMany();

  for (const waterway of waterways) {
    let coords: number[][] | null = null;

    switch (waterway.name) {
      case "St. Lawrence River":
        coords = stLawrenceCoords;
        break;
      case "Mackenzie River":
        coords = mackenzieCoords;
        break;
      case "Fraser River":
        coords = fraserCoords;
        break;
      case "Ottawa River":
        coords = ottawaCoords;
        break;
      case "Saskatchewan River":
        coords = saskatchewanCoords;
        break;
      case "Churchill River (Saskatchewan)":
        coords = churchillCoords;
        break;
      case "Columbia River":
        coords = columbiaCoords;
        break;
      case "Lake Superior":
        coords = lakeSuperiorCoords;
        break;
      case "Lake Huron":
        coords = lakeHuronCoords;
        break;
      case "Lake Ontario":
        coords = lakeOntarioCoords;
        break;
      case "Lake Winnipeg":
        coords = lakeWinnipegCoords;
        break;
      case "Great Slave Lake":
        coords = greatSlaveCoords;
        break;
      case "Great Bear Lake":
        coords = greatBearCoords;
        break;
      case "Lake Athabasca":
        coords = lakeAthabascaCoords;
        break;
      case "Hudson Bay":
        coords = hudsonBayCoords;
        break;
      case "James Bay":
        coords = jamesBayCoords;
        break;
    }

    if (coords) {
      await prisma.waterway.update({
        where: { id: waterway.id },
        data: { kmlData: JSON.stringify(coords) }
      });
      console.log(`  ✅ Updated ${waterway.name} with ${coords.length} coordinate points`);
    }
  }

  // Add additional waterways
  console.log("\n📍 Adding more waterways...");

  const riverType = await prisma.waterwayType.findUnique({ where: { name: "River" } });
  const lakeType = await prisma.waterwayType.findUnique({ where: { name: "Lake" } });

  if (!riverType || !lakeType) {
    throw new Error("Waterway types not found");
  }

  // Additional Rivers
  const additionalRivers = [
    {
      name: "Nelson River",
      indigenousName: "Pichikaministik-sipi",
      indigenousLanguage: "Cree",
      description: "Major river flowing from Lake Winnipeg to Hudson Bay. One of the largest rivers in Canada by volume.",
      latitude: 56.5,
      longitude: -94.5,
      regionName: "Manitoba",
      typeId: riverType.id,
      historicalSignificance: "Key route for the Hudson's Bay Company connecting the interior to York Factory. Samuel Hearne traveled portions in 1774.",
      kmlData: JSON.stringify([
        [50.4, -96.8], [51.0, -96.0], [52.0, -95.0], [53.0, -94.0], [54.0, -93.5],
        [55.0, -93.0], [56.0, -93.5], [57.0, -92.5]
      ])
    },
    {
      name: "Athabasca River",
      indigenousName: "Ayaskatawa-sipi",
      indigenousLanguage: "Cree",
      description: "Flows from the Columbia Icefield in Jasper National Park to Lake Athabasca. Named from Cree meaning 'place where there are reeds'.",
      latitude: 56.8,
      longitude: -111.4,
      regionName: "Alberta",
      typeId: riverType.id,
      historicalSignificance: "Major fur trade route. Peter Pond used this route to reach the Athabasca region in 1778.",
      kmlData: JSON.stringify([
        [52.2, -117.2], [53.0, -117.5], [54.0, -116.5], [55.0, -114.5], [56.0, -112.5],
        [57.0, -111.5], [58.0, -111.0], [58.7, -111.0]
      ])
    },
    {
      name: "Peace River",
      indigenousName: "Unchaga",
      indigenousLanguage: "Beaver",
      description: "Major tributary of the Slave River, named for the peace made between the Cree and Beaver peoples at Peace Point.",
      latitude: 58.8,
      longitude: -117.3,
      regionName: "Alberta / British Columbia",
      typeId: riverType.id,
      historicalSignificance: "Alexander Mackenzie ascended this river in 1793 on his journey to the Pacific Ocean. Key fur trade corridor.",
      kmlData: JSON.stringify([
        [55.0, -122.0], [55.5, -120.5], [56.0, -118.5], [56.5, -117.5], [57.0, -117.0],
        [57.5, -116.5], [58.0, -115.5], [58.5, -114.5], [59.0, -112.0]
      ])
    },
    {
      name: "Red River",
      indigenousName: "Miskwi-sipi",
      indigenousLanguage: "Cree",
      description: "Flows north through Manitoba to Lake Winnipeg. Named for the reddish-brown sediment it carries.",
      latitude: 49.9,
      longitude: -97.1,
      regionName: "Manitoba",
      typeId: riverType.id,
      historicalSignificance: "Site of the Red River Settlement (1812) and the Métis homeland. Central to the 1869-70 Red River Resistance.",
      kmlData: JSON.stringify([
        [46.0, -96.8], [47.0, -97.0], [48.0, -97.1], [49.0, -97.0], [49.9, -97.1],
        [50.3, -96.8]
      ])
    },
    {
      name: "Assiniboine River",
      indigenousName: "Assiniwi-sipi",
      indigenousLanguage: "Cree",
      description: "Major tributary of the Red River, flowing through the prairies of Saskatchewan and Manitoba.",
      latitude: 49.9,
      longitude: -97.3,
      regionName: "Manitoba / Saskatchewan",
      typeId: riverType.id,
      historicalSignificance: "Named after the Assiniboine people. Important trading route with posts like Brandon House and Fort Ellice.",
      kmlData: JSON.stringify([
        [51.0, -106.0], [50.5, -104.0], [50.0, -102.0], [49.8, -100.0], [49.9, -98.5],
        [49.9, -97.3]
      ])
    },
    {
      name: "Yukon River",
      indigenousName: "Kwanlin",
      indigenousLanguage: "Southern Tutchone",
      description: "One of the longest rivers in North America, flowing from British Columbia through Yukon and Alaska to the Bering Sea.",
      latitude: 62.5,
      longitude: -136.0,
      regionName: "Yukon",
      typeId: riverType.id,
      historicalSignificance: "Highway of the Klondike Gold Rush (1896-99). Traditional territory of numerous First Nations.",
      kmlData: JSON.stringify([
        [59.5, -134.5], [60.5, -135.0], [61.5, -136.0], [62.5, -137.0], [63.5, -139.0],
        [64.0, -140.5], [64.5, -141.0]
      ])
    },
    {
      name: "Coppermine River",
      indigenousName: "Kugluk",
      indigenousLanguage: "Inuinnaqtun",
      description: "Flows from Point Lake to the Arctic Ocean at Coronation Gulf. Named for copper deposits found along its banks.",
      latitude: 66.5,
      longitude: -116.0,
      regionName: "Northwest Territories / Nunavut",
      typeId: riverType.id,
      historicalSignificance: "Samuel Hearne became the first European to reach the Arctic Ocean overland via this river in 1771.",
      kmlData: JSON.stringify([
        [64.8, -113.0], [65.2, -114.0], [65.8, -115.0], [66.2, -116.0], [66.8, -116.5],
        [67.5, -115.8], [67.8, -115.1]
      ])
    },
    {
      name: "Thelon River",
      indigenousName: "Thelon",
      indigenousLanguage: "Inuit",
      description: "Remote wilderness river flowing through the tundra to Baker Lake. Known as the last great wilderness river in North America.",
      latitude: 64.5,
      longitude: -102.0,
      regionName: "Northwest Territories / Nunavut",
      typeId: riverType.id,
      historicalSignificance: "Traditional caribou hunting grounds for Inuit peoples. The Thelon Wildlife Sanctuary was established in 1927.",
      kmlData: JSON.stringify([
        [63.5, -108.0], [64.0, -106.0], [64.3, -104.0], [64.5, -102.0], [64.3, -100.0],
        [64.0, -98.0], [64.2, -96.0]
      ])
    },
    {
      name: "Saguenay River",
      indigenousName: "Saguenay",
      indigenousLanguage: "Innu",
      description: "Deep fjord-like river flowing from Lac Saint-Jean to the St. Lawrence. Known for its dramatic cliffs and whale watching.",
      latitude: 48.4,
      longitude: -70.9,
      regionName: "Quebec",
      typeId: riverType.id,
      historicalSignificance: "Trading route for the Innu people. The first European trading post in Quebec was established at Tadoussac in 1600.",
      kmlData: JSON.stringify([
        [48.5, -72.0], [48.4, -71.5], [48.3, -71.0], [48.3, -70.5], [48.2, -70.0],
        [48.1, -69.7]
      ])
    },
    {
      name: "Saint John River",
      indigenousName: "Wolastoq",
      indigenousLanguage: "Maliseet",
      description: "Longest river in the Maritime provinces, flowing through New Brunswick to the Bay of Fundy. Wolastoq means 'beautiful and bountiful river'.",
      latitude: 46.2,
      longitude: -67.3,
      regionName: "New Brunswick",
      typeId: riverType.id,
      historicalSignificance: "Central to Wolastoqiyik (Maliseet) culture for thousands of years. Named by Samuel de Champlain on Saint John the Baptist Day, 1604.",
      kmlData: JSON.stringify([
        [47.5, -69.2], [47.0, -68.5], [46.5, -67.8], [46.0, -67.0], [45.5, -66.5],
        [45.3, -66.1]
      ])
    }
  ];

  for (const river of additionalRivers) {
    const existing = await prisma.waterway.findFirst({ where: { name: river.name } });
    if (!existing) {
      await prisma.waterway.create({ data: river });
      console.log(`  ✅ Added ${river.name}`);
    }
  }

  // Additional Lakes
  const additionalLakes = [
    {
      name: "Lake Erie",
      indigenousName: "Erielhonan",
      indigenousLanguage: "Erie",
      description: "Shallowest and warmest of the Great Lakes. Named after the Erie people who lived along its southern shore.",
      latitude: 42.2,
      longitude: -81.2,
      regionName: "Ontario",
      typeId: lakeType.id,
      historicalSignificance: "Scene of naval battles in the War of 1812. The Erie Canal (1825) connected it to the Atlantic.",
      kmlData: JSON.stringify([
        [41.4, -82.8], [41.6, -82.0], [42.0, -81.0], [42.4, -80.0], [42.8, -79.0],
        [42.6, -79.5], [42.2, -80.5], [41.8, -81.5], [41.4, -82.5], [41.4, -82.8]
      ])
    },
    {
      name: "Lake Michigan",
      indigenousName: "Michi-gami",
      indigenousLanguage: "Ojibwe",
      description: "Third largest Great Lake by area. The only Great Lake entirely within the United States, though shared with Canadian waters historically.",
      latitude: 43.8,
      longitude: -87.0,
      regionName: "Shared (US/Canada border area)",
      typeId: lakeType.id,
      historicalSignificance: "Jean Nicolet was the first European to explore its shores in 1634, seeking a route to China.",
      kmlData: JSON.stringify([
        [41.8, -87.5], [42.5, -87.0], [43.5, -86.5], [44.5, -86.0], [45.5, -85.5],
        [46.0, -86.0], [45.5, -87.0], [44.5, -87.5], [43.5, -87.5], [42.5, -87.5], [41.8, -87.5]
      ])
    },
    {
      name: "Reindeer Lake",
      indigenousName: "Atik Sakahikan",
      indigenousLanguage: "Cree",
      description: "Second largest lake entirely within Saskatchewan. Remote wilderness lake on the Canadian Shield.",
      latitude: 57.3,
      longitude: -102.3,
      regionName: "Saskatchewan / Manitoba",
      typeId: lakeType.id,
      historicalSignificance: "Traditional territory of the Woodland Cree. Named for the woodland caribou that migrate through the area.",
      kmlData: JSON.stringify([
        [56.5, -102.5], [57.0, -102.0], [57.5, -101.5], [58.0, -102.0], [57.8, -103.0],
        [57.3, -103.5], [56.8, -103.0], [56.5, -102.5]
      ])
    },
    {
      name: "Lake Nipigon",
      indigenousName: "Animbiigoo Zaaga'igan",
      indigenousLanguage: "Ojibwe",
      description: "Largest lake entirely within Ontario. Feeds Lake Superior via the Nipigon River.",
      latitude: 49.8,
      longitude: -88.5,
      regionName: "Ontario",
      typeId: lakeType.id,
      historicalSignificance: "Site of Fort Nipigon, a French trading post established in 1678. Important link between the Great Lakes and northern fur trade.",
      kmlData: JSON.stringify([
        [49.3, -89.0], [49.5, -88.5], [49.8, -88.0], [50.2, -88.0], [50.5, -88.5],
        [50.3, -89.0], [49.8, -89.5], [49.3, -89.0]
      ])
    },
    {
      name: "Lesser Slave Lake",
      indigenousName: "Utikuma",
      indigenousLanguage: "Cree",
      description: "Large lake in north-central Alberta, the largest lake entirely within the province.",
      latitude: 55.5,
      longitude: -115.5,
      regionName: "Alberta",
      typeId: lakeType.id,
      historicalSignificance: "Site of Treaty 8 signing in 1899. Named 'Slave' by the Cree for the Slavey Dene people who lived to the north.",
      kmlData: JSON.stringify([
        [55.2, -116.0], [55.4, -115.5], [55.6, -115.0], [55.8, -114.5], [55.6, -114.0],
        [55.3, -114.5], [55.2, -115.5], [55.2, -116.0]
      ])
    }
  ];

  for (const lake of additionalLakes) {
    const existing = await prisma.waterway.findFirst({ where: { name: lake.name } });
    if (!existing) {
      await prisma.waterway.create({ data: lake });
      console.log(`  ✅ Added ${lake.name}`);
    }
  }

  // Add more locations
  console.log("\n📍 Adding more historic locations...");

  const additionalLocations = [
    {
      name: "Fort William",
      indigenousName: "Animikie-wekwed",
      indigenousLanguage: "Ojibwe",
      description: "The grand depot of the North West Company, where voyageurs from Montreal met winterers from the interior.",
      latitude: 48.3808,
      longitude: -89.2477,
      locationType: "Fort",
      yearEstablished: 1803,
      historicalNotes: "Named after William McGillivray. Site of the annual Rendezvous where up to 2,000 people gathered.",
    },
    {
      name: "Fort Garry",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Hudson's Bay Company fort at the junction of the Red and Assiniboine Rivers. Nucleus of modern Winnipeg.",
      latitude: 49.8844,
      longitude: -97.1348,
      locationType: "Fort",
      yearEstablished: 1822,
      historicalNotes: "Center of the Red River Settlement and later the provisional government during the 1869 Red River Resistance.",
    },
    {
      name: "Fort Vancouver",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Headquarters of the Hudson's Bay Company's Columbia Department, controlling the Pacific Northwest fur trade.",
      latitude: 45.6261,
      longitude: -122.6551,
      locationType: "Fort",
      yearEstablished: 1824,
      historicalNotes: "Dr. John McLoughlin ruled here as 'King of the Columbia.' Now a US National Historic Site.",
    },
    {
      name: "Methye Portage",
      indigenousName: "Lac la Loche",
      indigenousLanguage: "Cree/Dene",
      description: "The longest and most difficult portage in the fur trade route, 19 km over the height of land.",
      latitude: 56.5,
      longitude: -109.4,
      locationType: "Portage",
      yearEstablished: null,
      historicalNotes: "Only portage connecting Hudson Bay watershed to Mackenzie/Arctic watershed. Used for over 100 years.",
    },
    {
      name: "Moose Factory",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Second oldest English settlement in Canada after Fort Albany. HBC trading post on Moose River.",
      latitude: 51.2578,
      longitude: -80.6087,
      locationType: "Trading Post",
      yearEstablished: 1673,
      historicalNotes: "Captured by the French in 1686 but returned to Britain. Continuous trading post for over 350 years.",
    },
    {
      name: "Fort Albany",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Oldest English settlement in Ontario, on the Albany River flowing into James Bay.",
      latitude: 52.2500,
      longitude: -81.5833,
      locationType: "Fort",
      yearEstablished: 1679,
      historicalNotes: "One of the original HBC posts. Changed hands between English and French several times.",
    },
    {
      name: "Norway House",
      indigenousName: "Kinosew Sipi",
      indigenousLanguage: "Cree",
      description: "Major HBC inland post at the north end of Lake Winnipeg, hub of the western fur trade.",
      latitude: 53.9828,
      longitude: -97.8397,
      locationType: "Trading Post",
      yearEstablished: 1814,
      historicalNotes: "Site of the 1875 treaty negotiations. Norwegian boat builders were brought here, hence the name.",
    },
    {
      name: "Fort Simpson",
      indigenousName: "Łíídlįį Kųę́",
      indigenousLanguage: "Dene",
      description: "Strategic HBC post at the confluence of the Liard and Mackenzie Rivers.",
      latitude: 61.8628,
      longitude: -121.3531,
      locationType: "Fort",
      yearEstablished: 1804,
      historicalNotes: "Named after Sir George Simpson, HBC Governor. Gateway to the Mackenzie District.",
    },
    {
      name: "Tadoussac",
      indigenousName: "Totouskak",
      indigenousLanguage: "Innu",
      description: "Site of the first permanent European trading post in Canada, at the mouth of the Saguenay River.",
      latitude: 48.1468,
      longitude: -69.7208,
      locationType: "Trading Post",
      yearEstablished: 1600,
      historicalNotes: "Basque whalers visited before official establishment. Traditional meeting place for Indigenous peoples.",
    },
    {
      name: "Fort St. James",
      indigenousName: "Nak'azdli",
      indigenousLanguage: "Carrier",
      description: "Simon Fraser's headquarters for New Caledonia, the most remote outpost of the fur trade.",
      latitude: 54.4439,
      longitude: -124.2553,
      locationType: "Fort",
      yearEstablished: 1806,
      historicalNotes: "Capital of New Caledonia for nearly 50 years. Now a National Historic Site with original buildings.",
    },
  ];

  // Get waterway IDs for linking
  const stLawrence = await prisma.waterway.findFirst({ where: { name: "St. Lawrence River" } });
  const mackenzie = await prisma.waterway.findFirst({ where: { name: "Mackenzie River" } });
  const fraser = await prisma.waterway.findFirst({ where: { name: "Fraser River" } });
  const lakeWinnipeg = await prisma.waterway.findFirst({ where: { name: "Lake Winnipeg" } });
  const lakeSuperior = await prisma.waterway.findFirst({ where: { name: "Lake Superior" } });
  const jamesBay = await prisma.waterway.findFirst({ where: { name: "James Bay" } });
  const churchillR = await prisma.waterway.findFirst({ where: { name: "Churchill River (Saskatchewan)" } });
  const saguenay = await prisma.waterway.findFirst({ where: { name: "Saguenay River" } });

  const locationWaterwayMap: Record<string, string | undefined> = {
    "Fort William": lakeSuperior?.id,
    "Fort Garry": lakeWinnipeg?.id,
    "Methye Portage": churchillR?.id,
    "Moose Factory": jamesBay?.id,
    "Fort Albany": jamesBay?.id,
    "Norway House": lakeWinnipeg?.id,
    "Fort Simpson": mackenzie?.id,
    "Tadoussac": saguenay?.id || stLawrence?.id,
    "Fort St. James": fraser?.id,
  };

  for (const loc of additionalLocations) {
    const existing = await prisma.location.findFirst({ where: { name: loc.name } });
    if (!existing) {
      const waterwayId = locationWaterwayMap[loc.name];
      if (waterwayId) {
        await prisma.location.create({
          data: { ...loc, waterwayId }
        });
        console.log(`  ✅ Added ${loc.name}`);
      }
    }
  }

  // Create default admin user
  console.log("\n👤 Creating default admin user...");
  const existingAdmin = await prisma.adminUser.findFirst({ where: { email: "admin@waterways.edu" } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: "admin@waterways.edu",
        name: "Administrator",
        passwordHash: "admin123", // In production, this should be properly hashed
        role: "superadmin"
      }
    });
    console.log("  ✅ Created admin user (email: admin@waterways.edu, password: admin123)");
  }

  console.log("\n🎉 Database update complete!");

  const stats = {
    waterways: await prisma.waterway.count(),
    locations: await prisma.location.count(),
    explorers: await prisma.explorer.count(),
    nations: await prisma.indigenousNation.count(),
  };

  console.log(`
Summary:
- ${stats.waterways} waterways (with boundary coordinates)
- ${stats.locations} historic locations
- ${stats.explorers} explorers
- ${stats.nations} Indigenous nations
  `);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
