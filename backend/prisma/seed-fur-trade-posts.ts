// Comprehensive seed script for Hudson's Bay Company and North West Company
// forts and trading posts throughout Canada and the western US

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏰 Adding fur trade forts and trading posts...\n");

  // Get waterway IDs
  const waterways = await prisma.waterway.findMany();
  const waterwayMap = new Map(waterways.map(w => [w.name, w.id]));

  // ==================== HUDSON'S BAY COMPANY POSTS ====================
  console.log("🔵 Adding Hudson's Bay Company posts...");

  const hbcPosts = [
    // Hudson Bay Coastal Posts (The "Bay" posts)
    {
      name: "Prince of Wales Fort",
      indigenousName: "Eskimo Point",
      indigenousLanguage: "Cree",
      description: "Massive stone fortress at the mouth of the Churchill River, the most substantial fortification built by the HBC. Construction took 40 years (1731-1771). Samuel Hearne surrendered it without a fight to La Pérouse's French expedition in 1782, who partially destroyed it.",
      latitude: 58.80,
      longitude: -94.22,
      locationType: "Fort",
      yearEstablished: 1717,
      historicalNotes: "Original wooden fort (1717). Stone fortress begun 1731, completed 1771. Notable factors: James Knight (1717), Richard Norton (1730s), Moses Norton (1760s), Samuel Hearne (1775-1782). Hearne launched his Arctic expeditions from here. Surrendered 1782, never fully restored.",
      waterwayId: waterwayMap.get("Churchill River (Saskatchewan)") || waterwayMap.get("Hudson Bay"),
    },
    {
      name: "York Factory",
      indigenousName: "Kichiwasinahikan",
      indigenousLanguage: "Cree",
      description: "The most important HBC trading post for nearly 200 years, serving as the main depot for the company's inland trade. Located at the mouth of the Hayes River, it was the hub of the fur trade network stretching to the Rocky Mountains.",
      latitude: 57.00,
      longitude: -92.31,
      locationType: "Fort",
      yearEstablished: 1684,
      historicalNotes: "Founded 1684, captured by French 1694 and 1697, returned to HBC 1713. 'York boats' were designed here for inland transport. Notable factors: Henry Kelsey (1718-1722), James Isham (1737-1761). Peak trading period 1780s-1870s. Closed 1957. Now a National Historic Site.",
      waterwayId: waterwayMap.get("Hudson Bay") || waterwayMap.get("Nelson River"),
    },
    {
      name: "Fort Albany",
      indigenousName: null,
      indigenousLanguage: null,
      description: "One of the original HBC posts on James Bay, established near the mouth of the Albany River. It was a key trading center for the Cree peoples of the James Bay lowlands and served as the southern anchor of the Bay trade.",
      latitude: 52.27,
      longitude: -81.58,
      locationType: "Fort",
      yearEstablished: 1679,
      historicalNotes: "Second oldest HBC post (after Rupert House). Attacked by French forces multiple times. Served as administrative center for the 'Bottom of the Bay' district. The nearby community of Fort Albany First Nation continues today.",
      waterwayId: waterwayMap.get("James Bay"),
    },
    {
      name: "Moose Factory",
      indigenousName: "Moosonipi",
      indigenousLanguage: "Cree",
      description: "The oldest English-speaking settlement in Ontario, established on an island in the Moose River near James Bay. It served as the administrative headquarters for the HBC's Southern Department and remains an active community today.",
      latitude: 51.27,
      longitude: -80.60,
      locationType: "Fort",
      yearEstablished: 1673,
      historicalNotes: "Established by Charles Bayly, first HBC governor. Captured by French in 1686, returned 1693, captured again 1697, returned 1713. The 'factory' refers to the resident 'factor' (trading post manager). Now the oldest continuously inhabited English settlement in Ontario.",
      waterwayId: waterwayMap.get("James Bay"),
    },
    {
      name: "Fort Severn",
      indigenousName: "Wasahikamach",
      indigenousLanguage: "Cree",
      description: "A trading post at the mouth of the Severn River on Hudson Bay. It served the Cree populations of the Hudson Bay lowlands and was an important link in the coastal trading network.",
      latitude: 55.98,
      longitude: -87.65,
      locationType: "Trading Post",
      yearEstablished: 1685,
      historicalNotes: "One of the early Bay posts. Relatively small but strategically located. The nearby community of Fort Severn First Nation is now the northernmost community in Ontario accessible only by air or winter road.",
      waterwayId: waterwayMap.get("Hudson Bay"),
    },
    {
      name: "Fort Churchill (HBC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The successor post to Prince of Wales Fort, established after the French destruction in 1782. It became the main HBC post on the Churchill River and a key base for Arctic exploration and trade.",
      latitude: 58.77,
      longitude: -94.17,
      locationType: "Fort",
      yearEstablished: 1783,
      historicalNotes: "Built to replace the destroyed Prince of Wales Fort. Less elaborate than its predecessor. Served as base for Arctic trade and exploration until 1930s. The modern town of Churchill grew up around it.",
      waterwayId: waterwayMap.get("Churchill River (Saskatchewan)") || waterwayMap.get("Hudson Bay"),
    },
    // Inland HBC Posts - Nelson/Hayes River System
    {
      name: "Norway House",
      indigenousName: "Kinosao Sipi",
      indigenousLanguage: "Cree",
      description: "A crucial transportation hub where routes from Hudson Bay, Lake Winnipeg, and the Saskatchewan country converged. Named for Norwegian axemen who built it. It became the administrative headquarters for the HBC's Northern Department after 1821.",
      latitude: 53.99,
      longitude: -97.84,
      locationType: "Fort",
      yearEstablished: 1814,
      historicalNotes: "Built by Norwegian workers brought to Red River. After the HBC-NWC merger (1821), became headquarters of the Northern Department. Annual councils held here. Governor George Simpson based operations here. The York boat brigades assembled here for the journey to York Factory.",
      waterwayId: waterwayMap.get("Lake Winnipeg") || waterwayMap.get("Nelson River"),
    },
    {
      name: "Oxford House",
      indigenousName: "Manto Sipi",
      indigenousLanguage: "Cree",
      description: "A key waypoint on the route between York Factory and the interior posts. Located on Oxford Lake, it served as a provisioning depot and trading center for the local Cree population.",
      latitude: 54.95,
      longitude: -95.27,
      locationType: "Trading Post",
      yearEstablished: 1798,
      historicalNotes: "Important provision post on the York Factory-Cumberland House route. The brigade route passed through here carrying furs to the Bay and trade goods inland. The community of Oxford House First Nation continues today.",
      waterwayId: waterwayMap.get("Nelson River") || waterwayMap.get("Hudson Bay"),
    },
    // Saskatchewan River System
    {
      name: "Cumberland House",
      indigenousName: "Wāskahikanihk",
      indigenousLanguage: "Cree",
      description: "The first inland HBC post, established by Samuel Hearne in 1774 to compete with the pedlars from Montreal. Located on Pine Island in the Saskatchewan River delta, it opened the way for HBC expansion across the prairies.",
      latitude: 53.97,
      longitude: -102.27,
      locationType: "Fort",
      yearEstablished: 1774,
      historicalNotes: "Founded by Samuel Hearne September 1774. First HBC post away from Hudson Bay coast. Built to intercept furs going to Canadian pedlars. Peter Fidler and David Thompson both served here. Now Saskatchewan's oldest continuously inhabited community.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort Carlton",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A major HBC post on the North Saskatchewan River that served as a provisions depot and pemmican supply center. It was a key stop on the Carlton Trail connecting Red River to Edmonton.",
      latitude: 52.85,
      longitude: -106.18,
      locationType: "Fort",
      yearEstablished: 1810,
      historicalNotes: "Originally built 1795 as Carlton House, relocated 1810. Major pemmican and provisions depot. Treaty 6 negotiations held here (1876). Destroyed during the North-West Rebellion (1885). Site now a provincial historic park.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort Edmonton (HBC)",
      indigenousName: "Amiskwacîwâskahikan",
      indigenousLanguage: "Cree",
      description: "The main HBC post on the upper North Saskatchewan River, serving as the gateway to the Athabasca country and the mountain passes to the Pacific. It was one of the most important posts in the entire HBC network.",
      latitude: 53.52,
      longitude: -113.47,
      locationType: "Fort",
      yearEstablished: 1795,
      historicalNotes: "Built 1795 to compete with NWC's Fort Augustus across the river. Relocated several times. Chief Factor John Rowand made it the dominant post in the region (1823-1854). Supplied provisions for the entire Saskatchewan district. The city of Edmonton grew from it.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Rocky Mountain House",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The westernmost HBC post in the Saskatchewan district, located near the Rocky Mountains. It served as a base for trade with the Blackfoot Confederacy and for exploration of the mountain passes.",
      latitude: 52.37,
      longitude: -114.92,
      locationType: "Fort",
      yearEstablished: 1799,
      historicalNotes: "Built near NWC's Rocky Mountain House. David Thompson used it as base for his 1807 crossing of the Rockies. Dangerous location due to Blackfoot raids. Abandoned and rebuilt multiple times. Now a National Historic Site.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    // Athabasca Country
    {
      name: "Fort Chipewyan",
      indigenousName: "Ełtth'ı Kǫ́ę́",
      indigenousLanguage: "Dene",
      description: "The oldest continuously inhabited European settlement in Alberta, founded on Lake Athabasca. It was the gateway to the Mackenzie River system and the central depot for the rich Athabasca fur trade.",
      latitude: 58.72,
      longitude: -111.15,
      locationType: "Fort",
      yearEstablished: 1788,
      historicalNotes: "Founded by NWC's Roderick Mackenzie (Alexander's cousin). HBC established rival post 1815. After 1821 merger, became the main depot for the Athabasca district. Alexander Mackenzie launched both his great expeditions from here (1789, 1793). Still an active community.",
      waterwayId: waterwayMap.get("Lake Athabasca"),
    },
    {
      name: "Fort Resolution",
      indigenousName: "Deninu Kųę́",
      indigenousLanguage: "Dene",
      description: "A trading post on Great Slave Lake that served as a key point for trade with the Dene peoples and as a waypoint on the route to the Mackenzie River. One of the oldest settlements in the Northwest Territories.",
      latitude: 61.17,
      longitude: -113.68,
      locationType: "Fort",
      yearEstablished: 1786,
      historicalNotes: "Originally NWC post (Old Fort Resolution). HBC post established 1815. Key trading center for the Chipewyan and Yellowknife Dene. Now the oldest continuously occupied community in the NWT.",
      waterwayId: waterwayMap.get("Great Slave Lake"),
    },
    {
      name: "Fort Simpson",
      indigenousName: "Łíídlįį Kųę́",
      indigenousLanguage: "Dene",
      description: "Located at the confluence of the Liard and Mackenzie Rivers, Fort Simpson became the administrative headquarters for the Mackenzie District. It was named after George Simpson, the 'Little Emperor' who governed the HBC for decades.",
      latitude: 61.86,
      longitude: -121.35,
      locationType: "Fort",
      yearEstablished: 1804,
      historicalNotes: "Originally NWC's Fort of the Forks (1804). Renamed Fort Simpson after the HBC-NWC merger (1821) for Governor George Simpson. Became headquarters of Mackenzie District. Alexander Mackenzie passed this point in 1789.",
      waterwayId: waterwayMap.get("Mackenzie River"),
    },
    {
      name: "Fort Good Hope",
      indigenousName: "Rádeyı̨lı̨kǫ́ę́",
      indigenousLanguage: "Gwich'in",
      description: "A trading post on the Mackenzie River north of the Arctic Circle, serving the Gwich'in and Hare peoples. One of the most remote HBC posts, it operated in extreme conditions.",
      latitude: 66.26,
      longitude: -128.63,
      locationType: "Trading Post",
      yearEstablished: 1805,
      historicalNotes: "Originally NWC post. Located north of Arctic Circle. The church of Our Lady of Good Hope (1885) is a National Historic Site. John Bell explored west from here to the Yukon River (1842-1846).",
      waterwayId: waterwayMap.get("Mackenzie River"),
    },
    {
      name: "Fort Norman",
      indigenousName: "Tulı́t'a",
      indigenousLanguage: "Dene",
      description: "A trading post at the confluence of the Great Bear River and the Mackenzie River. It served as a base for exploration of the Great Bear Lake region and trade with the Mountain Dene.",
      latitude: 64.91,
      longitude: -125.57,
      locationType: "Trading Post",
      yearEstablished: 1810,
      historicalNotes: "Originally NWC post. Named for William Norman, an early trader. John Franklin's expeditions passed here (1825-1827). Oil discovered nearby at Norman Wells (1920). Now the community of Tulita.",
      waterwayId: waterwayMap.get("Mackenzie River"),
    },
    // Red River / Rupert's Land Posts
    {
      name: "Fort Garry (Upper)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The main HBC post at the Forks of the Red and Assiniboine Rivers, which became the center of the Red River Settlement and eventually the city of Winnipeg. It was the gateway to the western plains.",
      latitude: 49.88,
      longitude: -97.13,
      locationType: "Fort",
      yearEstablished: 1822,
      historicalNotes: "Built after the 1821 merger to replace Fort Gibraltar. Named for Nicholas Garry, HBC deputy governor. Seat of government for Rupert's Land. Louis Riel seized it in 1869-1870 during the Red River Rebellion. Site now in downtown Winnipeg.",
      waterwayId: waterwayMap.get("Red River"),
    },
    {
      name: "Lower Fort Garry",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A stone fort built downstream from Upper Fort Garry, intended as the main depot for the HBC's Northern Department. The best-preserved stone fur trade post in North America.",
      latitude: 50.12,
      longitude: -96.97,
      locationType: "Fort",
      yearEstablished: 1830,
      historicalNotes: "Built by Governor George Simpson as a grander replacement for Upper Fort Garry, but flooding made it impractical. Used for provisioning and later as a training center. Treaty 1 signed here (1871). Now a National Historic Site.",
      waterwayId: waterwayMap.get("Red River"),
    },
    {
      name: "Fort Ellice",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post at the confluence of the Qu'Appelle and Assiniboine Rivers, serving as an important stop on the Carlton Trail and a center for the plains pemmican trade.",
      latitude: 50.52,
      longitude: -101.30,
      locationType: "Fort",
      yearEstablished: 1831,
      historicalNotes: "Named for Edward Ellice, HBC committee member. Key pemmican depot for supplying the northern brigades. Treaty 4 negotiations began here (1874). Abandoned late 1800s.",
      waterwayId: waterwayMap.get("Assiniboine River"),
    },
    {
      name: "Fort Qu'Appelle",
      indigenousName: "Kâ-têpwêt",
      indigenousLanguage: "Cree",
      description: "A trading post in the Qu'Appelle Valley of present-day Saskatchewan, established to tap into the rich buffalo hunting grounds of the plains. The name means 'river that calls' from a Cree legend.",
      latitude: 50.77,
      longitude: -103.80,
      locationType: "Fort",
      yearEstablished: 1852,
      historicalNotes: "Originally built by HBC 1852. Important during the buffalo robe trade era. Treaty 4 signed at nearby Fort Qu'Appelle Lakes (1874). The town of Fort Qu'Appelle grew from this post.",
      waterwayId: waterwayMap.get("Assiniboine River") || waterwayMap.get("Saskatchewan River"),
    },
    // Columbia District / Pacific Coast
    {
      name: "Fort Vancouver (HBC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The main HBC depot for the Columbia District and the Pacific Northwest, located on the north bank of the Columbia River. Under Chief Factor John McLoughlin, it became the center of British influence in the Oregon Country.",
      latitude: 45.62,
      longitude: -122.67,
      locationType: "Fort",
      yearEstablished: 1825,
      historicalNotes: "Built by John McLoughlin after the 1821 merger combined HBC and NWC. Became the 'New York of the Pacific.' McLoughlin ('Father of Oregon') aided American settlers despite company policy. Transferred to US with Oregon Treaty (1846). Now a US National Historic Site.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    {
      name: "Fort Victoria",
      indigenousName: "Camosack",
      indigenousLanguage: "Lekwungen",
      description: "Established as the new HBC headquarters for the Pacific coast after the loss of Fort Vancouver to the Americans. It became the nucleus of the city of Victoria, British Columbia's capital.",
      latitude: 48.43,
      longitude: -123.37,
      locationType: "Fort",
      yearEstablished: 1843,
      historicalNotes: "Built by James Douglas to replace Fort Vancouver after the Oregon Treaty became likely. Became the capital of the Colony of Vancouver Island (1849). The city of Victoria grew around it. Fort site now in downtown Victoria.",
      waterwayId: waterwayMap.get("Juan de Fuca Strait") || waterwayMap.get("Georgia Strait"),
    },
    {
      name: "Fort Langley",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post on the Fraser River that became the birthplace of British Columbia. It was a major center for the salmon trade and the starting point for the Fraser River gold rush.",
      latitude: 49.17,
      longitude: -122.57,
      locationType: "Fort",
      yearEstablished: 1827,
      historicalNotes: "Built to counter American expansion and exploit the salmon trade. James Douglas proclaimed the Colony of British Columbia here (1858). Called the 'birthplace of BC.' Now a National Historic Site with restored buildings.",
      waterwayId: waterwayMap.get("Fraser River"),
    },
    {
      name: "Fort St. James",
      indigenousName: "Nak'azdli",
      indigenousLanguage: "Carrier",
      description: "The administrative headquarters of the HBC's New Caledonia district in central British Columbia. Originally a NWC post, it became one of the longest-operating fur trade posts in the province.",
      latitude: 54.44,
      longitude: -124.26,
      locationType: "Fort",
      yearEstablished: 1806,
      historicalNotes: "Founded by Simon Fraser and John Stuart for the NWC. Named for the patron saint of Spain (ironic given Spanish claims to the coast). Headquarters of New Caledonia district. James Douglas served here. Now a National Historic Site.",
      waterwayId: waterwayMap.get("Fraser River"),
    },
    {
      name: "Fort Kamloops",
      indigenousName: "Tk'emlúps",
      indigenousLanguage: "Secwepemc",
      description: "A trading post at the confluence of the North and South Thompson Rivers in the BC interior. It served the Secwepemc (Shuswap) peoples and was a key link between the coast and the interior fur trade.",
      latitude: 50.67,
      longitude: -120.33,
      locationType: "Fort",
      yearEstablished: 1812,
      historicalNotes: "Originally NWC's Fort Thompson. Renamed after the Secwepemc word 'Tk'emlúps' (where the rivers meet). Important depot for the interior fur trade. The city of Kamloops grew from this post.",
      waterwayId: waterwayMap.get("Fraser River") || waterwayMap.get("Columbia River"),
    },
    {
      name: "Fort Nez Percés (Fort Walla Walla)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post at the confluence of the Walla Walla and Columbia Rivers, serving the Nez Perce, Cayuse, and Walla Walla peoples. An important post in the Columbia District.",
      latitude: 46.05,
      longitude: -118.93,
      locationType: "Fort",
      yearEstablished: 1818,
      historicalNotes: "Built by NWC's Donald McKenzie. One of the main posts in the interior Columbia country. Near site of later Whitman Mission (1836). Abandoned 1855 during the Yakama War. Now in Washington State.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    {
      name: "Fort Colville",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A major HBC post on the upper Columbia River that served as the agricultural center for the Columbia District. It supplied provisions to posts throughout the Pacific Northwest.",
      latitude: 48.60,
      longitude: -118.07,
      locationType: "Fort",
      yearEstablished: 1825,
      historicalNotes: "Named for Andrew Colville, HBC governor. Major agricultural operation with extensive farms. Supplied other posts with flour, beef, and produce. Closed 1871 after US purchase of the region. Site now in Washington State.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    // Northern Posts
    {
      name: "Fort Yukon",
      indigenousName: "Gwichyaa Zhee",
      indigenousLanguage: "Gwich'in",
      description: "The most remote HBC post, established on the Yukon River in what was then Russian America. It was the only HBC post in Alaska and operated despite being in Russian territory.",
      latitude: 66.56,
      longitude: -145.27,
      locationType: "Trading Post",
      yearEstablished: 1847,
      historicalNotes: "Built by Alexander Hunter Murray on Russian territory (unknowingly at first). Traded with Gwich'in people. After US purchase of Alaska (1867), discovered to be in US territory and transferred to American traders (1869).",
      waterwayId: waterwayMap.get("Yukon River"),
    },
    {
      name: "Fort McPherson",
      indigenousName: "Teetł'it Zheh",
      indigenousLanguage: "Gwich'in",
      description: "A trading post on the Peel River near its confluence with the Mackenzie, serving the Gwich'in peoples of the northern Yukon. One of the northernmost posts in the HBC network.",
      latitude: 67.44,
      longitude: -134.88,
      locationType: "Trading Post",
      yearEstablished: 1840,
      historicalNotes: "Originally Peel River Post. Renamed for HBC Chief Factor Murdoch McPherson. Key post for the Gwich'in fur trade. Provided supplies for the 'Lost Patrol' (1911), four RCMP officers who died trying to reach Dawson City.",
      waterwayId: waterwayMap.get("Mackenzie River"),
    },
  ];

  // ==================== NORTH WEST COMPANY POSTS ====================
  console.log("\n🔴 Adding North West Company posts...");

  const nwcPosts = [
    // Great Lakes / Montreal Route
    {
      name: "Fort William (NWC)",
      indigenousName: "Animikie-Waajiw",
      indigenousLanguage: "Ojibwe",
      description: "The great inland headquarters of the North West Company on Lake Superior. Every summer, the partners from Montreal and the wintering partners from the interior met here for the annual rendezvous to exchange furs, trade goods, and conduct company business.",
      latitude: 48.38,
      longitude: -89.29,
      locationType: "Fort",
      yearEstablished: 1803,
      historicalNotes: "Replaced Grand Portage after it fell into US territory (1796). Named for William McGillivray, NWC chief director. At its peak, over 2,000 people gathered for the annual meeting. Seized by Lord Selkirk (1816) during the pemmican war. Passed to HBC 1821. Reconstructed as a major heritage site.",
      waterwayId: waterwayMap.get("Lake Superior"),
    },
    {
      name: "Grand Portage",
      indigenousName: "Gichi-Onigaming",
      indigenousLanguage: "Ojibwe",
      description: "The original inland headquarters of the fur trade on the western shore of Lake Superior. The 13.6 km portage bypassed waterfalls on the Pigeon River. After it fell into US territory, the NWC moved to Fort William.",
      latitude: 47.96,
      longitude: -89.68,
      locationType: "Fort",
      yearEstablished: 1731,
      historicalNotes: "Used by French traders from 1731. The NWC made it their main depot (1784-1803). The 'Grand Portage' was one of the most difficult portages in the fur trade. Now a US National Monument. La Vérendrye passed through here.",
      waterwayId: waterwayMap.get("Lake Superior"),
    },
    {
      name: "Fort Kaministiquia",
      indigenousName: null,
      indigenousLanguage: null,
      description: "An early French trading post on the Kaministiquia River near Lake Superior. It was a precursor to the later Fort William and served as an alternative route to Grand Portage.",
      latitude: 48.40,
      longitude: -89.32,
      locationType: "Fort",
      yearEstablished: 1679,
      historicalNotes: "French post established by Daniel Greysolon, Sieur du Lhut (1679). Used the Kaministiquia route to the interior. Abandoned after the British conquest. The NWC later built Fort William at this strategic location.",
      waterwayId: waterwayMap.get("Lake Superior"),
    },
    {
      name: "Sault Ste. Marie Post",
      indigenousName: "Baawitigong",
      indigenousLanguage: "Ojibwe",
      description: "A strategic trading location at the rapids between Lake Superior and Lake Huron. Both French and later British/Canadian traders maintained posts here to control access to the upper Great Lakes.",
      latitude: 46.50,
      longitude: -84.35,
      locationType: "Trading Post",
      yearEstablished: 1668,
      historicalNotes: "French mission and trading post from 1668. NWC maintained a post here. The rapids required all goods to be portaged. The first canal was built in 1797 (American side) and 1895 (Canadian side). The city grew around this portage point.",
      waterwayId: waterwayMap.get("Lake Huron") || waterwayMap.get("Lake Superior"),
    },
    // Interior NWC Posts
    {
      name: "Fort Augustus (NWC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post built directly across the river from the HBC's Fort Edmonton. The two rival posts competed for trade with the Blackfoot and Cree peoples until the 1821 merger.",
      latitude: 53.52,
      longitude: -113.46,
      locationType: "Fort",
      yearEstablished: 1795,
      historicalNotes: "Built same time as HBC's Edmonton House, across the river. Intense competition between the two posts. John Rowand served here before moving to HBC. After 1821 merger, operations consolidated at Edmonton House. Site now part of Edmonton.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort George (NWC - Saskatchewan)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post on the North Saskatchewan River, competing with HBC's Buckingham House. Part of the string of rival posts along the Saskatchewan River system.",
      latitude: 53.72,
      longitude: -110.18,
      locationType: "Fort",
      yearEstablished: 1792,
      historicalNotes: "One of several competing posts on the Saskatchewan. The NWC built posts close to HBC establishments to intercept trade. Abandoned after the 1821 merger.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort Vermilion (NWC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post on the Peace River in northern Alberta, established to extend the fur trade into the rich beaver country of the Peace River watershed.",
      latitude: 58.39,
      longitude: -116.04,
      locationType: "Fort",
      yearEstablished: 1788,
      historicalNotes: "Part of NWC expansion into the Peace River country. Charles Boyer and later Alexander Mackenzie used it as a base. After merger, became an HBC post. One of the earliest posts in northern Alberta.",
      waterwayId: waterwayMap.get("Peace River"),
    },
    {
      name: "Fort Dunvegan",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post on the Peace River established by the NWC to trade with the Beaver (Dunne-za) peoples. Named after the ancestral seat of the McLeod clan in Scotland.",
      latitude: 56.11,
      longitude: -118.60,
      locationType: "Fort",
      yearEstablished: 1805,
      historicalNotes: "Founded by Archibald Norman McLeod. Important post for the Peace River trade. Alexander Mackenzie passed this area during his 1793 expedition. Now a provincial historic site with restored buildings.",
      waterwayId: waterwayMap.get("Peace River"),
    },
    {
      name: "Fort McLeod (BC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The first permanent European settlement in mainland British Columbia, established by Simon Fraser as a base for NWC expansion into New Caledonia (central BC).",
      latitude: 55.05,
      longitude: -123.07,
      locationType: "Fort",
      yearEstablished: 1805,
      historicalNotes: "Founded by Simon Fraser, named for his colleague Archibald McLeod. First permanent European settlement in mainland BC. Base for Fraser's exploration of the river bearing his name. Still an active community.",
      waterwayId: waterwayMap.get("Peace River") || waterwayMap.get("Fraser River"),
    },
    {
      name: "Fort George (NWC - BC)",
      indigenousName: "Lheidli",
      indigenousLanguage: "Carrier",
      description: "A North West Company post at the confluence of the Nechako and Fraser Rivers in central British Columbia. It became the hub of the New Caledonia district's transportation network.",
      latitude: 53.92,
      longitude: -122.77,
      locationType: "Fort",
      yearEstablished: 1807,
      historicalNotes: "Founded by Simon Fraser. Key transportation hub for New Caledonia. Named for King George III. The city of Prince George grew from this location. Fraser launched his 1808 Fraser River expedition from here.",
      waterwayId: waterwayMap.get("Fraser River"),
    },
    {
      name: "Fort Alexandria",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post on the Fraser River named after Alexander Mackenzie, who had reached this point on his 1793 overland journey to the Pacific.",
      latitude: 52.13,
      longitude: -122.45,
      locationType: "Fort",
      yearEstablished: 1821,
      historicalNotes: "Named for Alexander Mackenzie. Marked the head of navigation on the Fraser for brigades from New Caledonia. Goods were portaged from here to Fort Kamloops. Important link in the brigade trail system.",
      waterwayId: waterwayMap.get("Fraser River"),
    },
    {
      name: "Rocky Mountain House (NWC)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post near the Rocky Mountains, built close to the HBC's Acton House. David Thompson used it as a base for his exploration of the mountain passes and the Columbia River.",
      latitude: 52.36,
      longitude: -114.91,
      locationType: "Fort",
      yearEstablished: 1799,
      historicalNotes: "Built same time as HBC's nearby post. David Thompson's base for his 1807 crossing of the Rockies via Howse Pass. Later moved several times. Site now a National Historic Site shared with HBC remains.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Kootenay House",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post established by David Thompson on the upper Columbia River, the first trading post in the Columbia Basin and the starting point for his exploration of the entire river.",
      latitude: 50.18,
      longitude: -115.75,
      locationType: "Trading Post",
      yearEstablished: 1807,
      historicalNotes: "Built by David Thompson after crossing Howse Pass. First European trading post in the Columbia Basin. Thompson's base for exploring and mapping the Columbia River system. The Ktunaxa (Kootenay) people traded here.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    {
      name: "Spokane House",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company and later HBC post near the junction of the Spokane and Little Spokane Rivers. It was an important post for trade with the Spokane and other Plateau peoples.",
      latitude: 47.82,
      longitude: -117.45,
      locationType: "Trading Post",
      yearEstablished: 1810,
      historicalNotes: "Founded by Finan McDonald and Jaco Finlay for NWC. First permanent European settlement in present-day Washington State. Abandoned in favor of Fort Colville (1826). Site now a Washington State park.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    {
      name: "Fort Astoria / Fort George",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Originally John Jacob Astor's Pacific Fur Company post at the mouth of the Columbia River, it was purchased by the NWC during the War of 1812 and renamed Fort George. The first American settlement on the Pacific coast.",
      latitude: 46.19,
      longitude: -123.83,
      locationType: "Fort",
      yearEstablished: 1811,
      historicalNotes: "Built by Astor's Pacific Fur Company (1811). Sold to NWC (1813) and renamed Fort George. David Thompson arrived here 1811, finding Americans already established. Replaced by Fort Vancouver (1825) as main depot. Site now in Astoria, Oregon.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
    // XY Company and other posts
    {
      name: "Fort Gibraltar",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A North West Company post at the Forks of the Red and Assiniboine Rivers, built to counter HBC's expansion into the Red River region and the Selkirk Settlement.",
      latitude: 49.89,
      longitude: -97.12,
      locationType: "Fort",
      yearEstablished: 1809,
      historicalNotes: "Built to compete with HBC in Red River. Destroyed by Selkirk colonists (1816) during the 'Pemmican War.' Rebuilt and seized again. After 1821 merger, replaced by Fort Garry. Site now in Winnipeg's Forks area.",
      waterwayId: waterwayMap.get("Red River"),
    },
    {
      name: "Fort Pembina",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post on the Red River near the present US-Canada border. It was a key post for the pemmican trade and witnessed intense competition between fur trade rivals.",
      latitude: 48.97,
      longitude: -97.24,
      locationType: "Fort",
      yearEstablished: 1797,
      historicalNotes: "NWC, XY Company, and HBC all had posts here at various times. Charles Chaboillez established NWC post. Important for pemmican provisioning. After 1818 boundary survey, found to be in US territory.",
      waterwayId: waterwayMap.get("Red River"),
    },
    {
      name: "Fort Lac La Pluie (Fort Frances)",
      indigenousName: "Koochiching",
      indigenousLanguage: "Ojibwe",
      description: "A trading post at Rainy Lake on the border lakes route between Lake Superior and Lake Winnipeg. A crucial waypoint on the voyageur highway.",
      latitude: 48.61,
      longitude: -93.40,
      locationType: "Fort",
      yearEstablished: 1731,
      historicalNotes: "Originally French post built by La Vérendrye (1731). NWC post established 1790s. Renamed Fort Frances for the wife of Governor George Simpson (1830). Key stop on the canoe route. City of Fort Frances grew here.",
      waterwayId: waterwayMap.get("Lake Superior") || waterwayMap.get("Lake Winnipeg"),
    },
    {
      name: "Bas-de-la-Rivière (Fort Alexander)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post at the mouth of the Winnipeg River where it enters Lake Winnipeg. An important provisioning point and transportation hub on the route from Lake Superior to the interior.",
      latitude: 50.62,
      longitude: -96.34,
      locationType: "Fort",
      yearEstablished: 1792,
      historicalNotes: "NWC established post here. Strategic location at entrance to Lake Winnipeg. Brigades assembled here before crossing the lake. After 1821, became HBC's Fort Alexander. Site now Sagkeeng First Nation.",
      waterwayId: waterwayMap.get("Lake Winnipeg"),
    },
  ];

  // Additional posts to cover more of the network
  const additionalPosts = [
    // More HBC posts
    {
      name: "Fort Pelly",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A Hudson's Bay Company post on the Assiniboine River in present-day Saskatchewan, serving as headquarters for the Swan River District. Named for HBC governor John Henry Pelly.",
      latitude: 51.85,
      longitude: -101.87,
      locationType: "Fort",
      yearEstablished: 1824,
      historicalNotes: "District headquarters for Swan River. Important for the northern plains fur trade. Connected to the pemmican trade network. Site now a provincial historic site.",
      waterwayId: waterwayMap.get("Assiniboine River"),
    },
    {
      name: "Fort Pitt",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A Hudson's Bay Company post on the North Saskatchewan River, established as a major trading center for the Cree and a provisioning depot. Scene of important events during the 1885 Rebellion.",
      latitude: 53.58,
      longitude: -109.85,
      locationType: "Fort",
      yearEstablished: 1830,
      historicalNotes: "Named for British Prime Minister William Pitt. Major trading center for Cree peoples. Treaty 6 signed here (1876). During 1885 Rebellion, besieged by Big Bear's followers. NWMP and civilians escaped by raft down the river.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort Battleford",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A Hudson's Bay Company post and later NWMP post at the confluence of the Battle and North Saskatchewan Rivers. It served as the first capital of the North-West Territories (1876-1883).",
      latitude: 52.73,
      longitude: -108.28,
      locationType: "Fort",
      yearEstablished: 1875,
      historicalNotes: "HBC post built 1875. NWMP established post 1876. Capital of NWT 1876-1883. Scene of tensions during 1885 Rebellion. Eight Indigenous men executed here after the rebellion. Now a National Historic Site.",
      waterwayId: waterwayMap.get("Saskatchewan River"),
    },
    {
      name: "Fort Liard",
      indigenousName: "Echaot'l Kǫ́ę́",
      indigenousLanguage: "Dene",
      description: "A trading post at the confluence of the Liard and South Nahanni Rivers in the southwestern Northwest Territories, serving the Dene peoples of the mountainous region.",
      latitude: 60.24,
      longitude: -123.07,
      locationType: "Trading Post",
      yearEstablished: 1805,
      historicalNotes: "Originally NWC post. One of the most remote posts in the network. Served the Dene of the southern Mackenzie Mountains. Still an active community today.",
      waterwayId: waterwayMap.get("Mackenzie River"),
    },
    {
      name: "Fort Rae",
      indigenousName: "Behchokǫ̀",
      indigenousLanguage: "Tłı̨chǫ",
      description: "A trading post on the north arm of Great Slave Lake, established to trade with the Tłı̨chǫ (Dogrib) Dene peoples. Named after Arctic explorer Dr. John Rae.",
      latitude: 62.82,
      longitude: -116.05,
      locationType: "Trading Post",
      yearEstablished: 1852,
      historicalNotes: "Named for Dr. John Rae, the Arctic explorer who determined Franklin's fate. Served the Tłı̨chǫ Dene. Now part of the community of Behchokǫ̀, the largest Dene community in Canada.",
      waterwayId: waterwayMap.get("Great Slave Lake"),
    },
    {
      name: "Fort Providence",
      indigenousName: "Zhahti Kų́ę́",
      indigenousLanguage: "Dene",
      description: "A trading post on the Mackenzie River just downstream from Great Slave Lake, serving as a waypoint for traffic on the Mackenzie and a trading center for the Dene.",
      latitude: 61.35,
      longitude: -117.65,
      locationType: "Trading Post",
      yearEstablished: 1786,
      historicalNotes: "Originally NWC's Old Fort Providence. Alexander Mackenzie stopped here 1789. After 1821, became HBC post. Oblate missionaries established mission 1861. Community continues today.",
      waterwayId: waterwayMap.get("Great Slave Lake") || waterwayMap.get("Mackenzie River"),
    },
    {
      name: "Fort Reliance",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A trading post at the eastern end of Great Slave Lake, established by George Back as a base for his search for John Ross and later used as a trading post.",
      latitude: 62.71,
      longitude: -109.17,
      locationType: "Trading Post",
      yearEstablished: 1833,
      historicalNotes: "Built by George Back as base for his 1833-1835 expedition to find John Ross. Later became HBC trading post. Named for the support (reliance) provided by local Dene. Abandoned in early 1900s.",
      waterwayId: waterwayMap.get("Great Slave Lake"),
    },
    // More Pacific coast posts
    {
      name: "Fort Rupert",
      indigenousName: "'Nakwaxda'xw",
      indigenousLanguage: "Kwakwala",
      description: "An HBC post on the northeastern coast of Vancouver Island, established primarily for coal mining but also serving as a trading center for the Kwakwaka'wakw peoples.",
      latitude: 50.68,
      longitude: -127.18,
      locationType: "Fort",
      yearEstablished: 1849,
      historicalNotes: "Built for coal mining operations. First major industrial operation on Vancouver Island. Miners from Scotland brought here. Site of early labor disputes. Named for Prince Rupert, first HBC governor.",
      waterwayId: waterwayMap.get("Queen Charlotte Sound") || waterwayMap.get("Georgia Strait"),
    },
    {
      name: "Fort Simpson (BC)",
      indigenousName: "Lax Kw'alaams",
      indigenousLanguage: "Sm'algyax",
      description: "An HBC post on the northwest coast of British Columbia, established to trade with the Tsimshian peoples and counter Russian expansion from Alaska.",
      latitude: 54.56,
      longitude: -130.43,
      locationType: "Fort",
      yearEstablished: 1831,
      historicalNotes: "Named for Governor George Simpson. Key post for northwest coast trade. Moved 1834 to present location at Port Simpson. Methodist missionaries arrived 1857. Community of Lax Kw'alaams continues today.",
      waterwayId: waterwayMap.get("Queen Charlotte Sound"),
    },
    {
      name: "Fort McLoughlin",
      indigenousName: null,
      indigenousLanguage: null,
      description: "An HBC post on Campbell Island on the central BC coast, established to expand trade with the Heiltsuk peoples. Named for Chief Factor John McLoughlin.",
      latitude: 52.16,
      longitude: -128.04,
      locationType: "Fort",
      yearEstablished: 1833,
      historicalNotes: "Named for John McLoughlin, Chief Factor at Fort Vancouver. Traded with Heiltsuk and other central coast peoples. Closed 1843 when trade shifted to Fort Victoria. Site now on Bella Bella reserve.",
      waterwayId: waterwayMap.get("Queen Charlotte Sound"),
    },
    // Eastern posts
    {
      name: "Tadoussac",
      indigenousName: "Totouskak",
      indigenousLanguage: "Innu",
      description: "One of the oldest European trading sites in North America, at the confluence of the Saguenay and St. Lawrence Rivers. It was a major meeting point for Indigenous peoples long before European contact.",
      latitude: 48.15,
      longitude: -69.72,
      locationType: "Trading Post",
      yearEstablished: 1600,
      historicalNotes: "Pierre Chauvin established trading post 1600. Champlain visited 1603. Key location for the early French fur trade. Traditional gathering place for Innu, Cree, and Algonquin peoples. One of the oldest continuously inhabited European sites in Canada.",
      waterwayId: waterwayMap.get("St. Lawrence River") || waterwayMap.get("Saguenay River"),
    },
    {
      name: "Fort Témiscamingue",
      indigenousName: "Obadjiwan",
      indigenousLanguage: "Algonquin",
      description: "A trading post on Lake Témiscamingue on the Quebec-Ontario border, part of the important trade route between Montreal and James Bay.",
      latitude: 47.13,
      longitude: -79.45,
      locationType: "Fort",
      yearEstablished: 1720,
      historicalNotes: "French established post 1720. On route connecting Ottawa River to James Bay via Abitibi. NWC and HBC both operated here. Important for birchbark canoe construction. Now Fort-Témiscamingue National Historic Site.",
      waterwayId: waterwayMap.get("Ottawa River"),
    },
    {
      name: "Rupert House (Fort Charles)",
      indigenousName: "Waskaganish",
      indigenousLanguage: "Cree",
      description: "The oldest HBC post, established at the mouth of the Rupert River on James Bay. Named for Prince Rupert, the first governor of the Hudson's Bay Company.",
      latitude: 51.48,
      longitude: -78.77,
      locationType: "Fort",
      yearEstablished: 1668,
      historicalNotes: "The very first HBC post, established by Médard des Groseilliers on the Nonsuch expedition. Named for Prince Rupert. Attacked by French 1686. Continuous operation for over 300 years. Community of Waskaganish continues today.",
      waterwayId: waterwayMap.get("James Bay"),
    },
  ];

  // Combine all posts
  const allPosts = [...hbcPosts, ...nwcPosts, ...additionalPosts];

  // Add all posts to database
  for (const post of allPosts) {
    if (!post.waterwayId) {
      console.log(`  ⚠️ Skipping ${post.name} - no waterway found`);
      continue;
    }

    const existing = await prisma.location.findFirst({
      where: { name: post.name }
    });

    const postData = {
      name: post.name,
      indigenousName: post.indigenousName,
      indigenousLanguage: post.indigenousLanguage,
      description: post.description,
      latitude: post.latitude,
      longitude: post.longitude,
      locationType: post.locationType,
      yearEstablished: post.yearEstablished,
      historicalNotes: post.historicalNotes,
      waterwayId: post.waterwayId,
    };

    if (!existing) {
      await prisma.location.create({ data: postData });
      console.log(`  ✅ Added ${post.name}`);
    } else {
      await prisma.location.update({
        where: { id: existing.id },
        data: postData
      });
      console.log(`  ✅ Updated ${post.name}`);
    }
  }

  // ==================== ADD FUR TRADE INFO TO WATERWAYS ====================
  console.log("\n📦 Adding fur trade information to waterways...");

  const furTradeInfoData = [
    {
      waterwayName: "Churchill River (Saskatchewan)",
      tradingCompany: "Hudson's Bay Company / North West Company",
      peakTradePeriod: "1717-1870",
      primaryFurs: "Beaver, marten, otter, fox",
      tradeRouteNotes: "Key route connecting Hudson Bay to the Athabasca country via Methye Portage. The 'English River' route for HBC brigades. Peter Pond's crucial 1778 crossing opened the rich Athabasca trade.",
    },
    {
      waterwayName: "Saskatchewan River",
      tradingCompany: "Hudson's Bay Company / North West Company",
      peakTradePeriod: "1774-1870",
      primaryFurs: "Beaver, wolf, buffalo robes, pemmican",
      tradeRouteNotes: "The great highway to the Rocky Mountains. Both companies built competing posts along its length. Major pemmican provisioning route. Cumberland House (1774) was HBC's first inland post.",
    },
    {
      waterwayName: "Red River",
      tradingCompany: "North West Company / Hudson's Bay Company / XY Company",
      peakTradePeriod: "1797-1870",
      primaryFurs: "Buffalo robes, pemmican, beaver",
      tradeRouteNotes: "Center of the pemmican trade vital for provisioning fur brigades. The Red River Settlement (1812) caused conflict between HBC and NWC. The Métis developed their distinctive culture here.",
    },
    {
      waterwayName: "Columbia River",
      tradingCompany: "North West Company / Hudson's Bay Company / Pacific Fur Company",
      peakTradePeriod: "1811-1846",
      primaryFurs: "Beaver, sea otter (early period), salmon trade",
      tradeRouteNotes: "Dominated by Fort Vancouver under John McLoughlin. The 'Columbia Express' connected the Pacific to York Factory. Lost to the US in the Oregon Treaty (1846).",
    },
    {
      waterwayName: "Fraser River",
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1806-1858",
      primaryFurs: "Beaver, marten, lynx, salmon",
      tradeRouteNotes: "Simon Fraser's 1808 descent proved it was not the Columbia. The 'New Caledonia' fur trade centered on this river. Fur trade ended with the 1858 Gold Rush.",
    },
    {
      waterwayName: "Mackenzie River",
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1789-1900",
      primaryFurs: "Beaver, muskrat, marten, white fox, lynx",
      tradeRouteNotes: "Alexander Mackenzie's 1789 journey opened this vast territory. The most remote posts in the fur trade network. Transportation challenges made furs here extremely valuable.",
    },
    {
      waterwayName: "Athabasca River",
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1778-1870",
      primaryFurs: "Beaver (premium quality), marten",
      tradeRouteNotes: "The 'Athabasca country' produced the finest beaver pelts in North America. Peter Pond's 1778 expedition opened this trade. Fort Chipewyan became the central depot.",
    },
    {
      waterwayName: "Peace River",
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1788-1870",
      primaryFurs: "Beaver, marten, fisher",
      tradeRouteNotes: "Named for the peace made between Cree and Beaver peoples. Alexander Mackenzie's 1793 transcontinental route followed this river. Fort Vermilion and Fort Dunvegan were key posts.",
    },
    {
      waterwayName: "Lake Superior",
      tradingCompany: "North West Company",
      peakTradePeriod: "1784-1821",
      primaryFurs: "Transport hub (furs from interior)",
      tradeRouteNotes: "The voyageur highway. Canoes from Montreal met 'north canoes' from the interior at Grand Portage/Fort William. The annual rendezvous was the highlight of the fur trade year.",
    },
    {
      waterwayName: "Lake Winnipeg",
      tradingCompany: "North West Company / Hudson's Bay Company / XY Company",
      peakTradePeriod: "1730s-1870",
      primaryFurs: "Beaver, sturgeon, pemmican",
      tradeRouteNotes: "Crossroads of the western fur trade. La Vérendrye reached it in 1733. Norway House at its northern end became the HBC's administrative center after 1821.",
    },
    {
      waterwayName: "Hudson Bay",
      tradingCompany: "Hudson's Bay Company",
      peakTradePeriod: "1670-1870",
      primaryFurs: "All furs from the interior; coastal trade in whale oil, walrus ivory",
      tradeRouteNotes: "The sea route that made the HBC possible. Ships from London exchanged goods for furs at the Bay posts. York Factory was the main depot. The 'home guard' Cree supplied geese and other provisions.",
    },
    {
      waterwayName: "James Bay",
      tradingCompany: "Hudson's Bay Company",
      peakTradePeriod: "1668-1870",
      primaryFurs: "Beaver, marten, river otter",
      tradeRouteNotes: "Site of the first HBC posts: Rupert House (1668), Moose Factory (1673), Fort Albany (1679). The 'Bottom of the Bay' district. Attacked by French forces multiple times before 1713.",
    },
    {
      waterwayName: "Ottawa River",
      tradingCompany: "French / North West Company",
      peakTradePeriod: "1600-1821",
      primaryFurs: "Beaver (from interior, transported through)",
      tradeRouteNotes: "The voyageur route from Montreal to the Great Lakes and beyond. Champlain traveled it in 1613. Mattawa-French River route connected to Lake Huron. Thousands of canoes passed this way.",
    },
    {
      waterwayName: "Nootka Sound",
      tradingCompany: "British maritime traders",
      peakTradePeriod: "1785-1825",
      primaryFurs: "Sea otter (extremely valuable in China trade)",
      tradeRouteNotes: "The maritime fur trade center. Cook's 1778 visit sparked the trade when his crew's pelts sold for enormous prices in China. Traders from Britain, America, and Spain competed here.",
    },
  ];

  for (const info of furTradeInfoData) {
    const waterway = await prisma.waterway.findFirst({
      where: { name: info.waterwayName }
    });

    if (!waterway) {
      console.log(`  ⚠️ Waterway not found: ${info.waterwayName}`);
      continue;
    }

    const existing = await prisma.furTradeInfo.findFirst({
      where: { waterwayId: waterway.id }
    });

    const furTradeData = {
      waterwayId: waterway.id,
      tradingCompany: info.tradingCompany,
      peakTradePeriod: info.peakTradePeriod,
      primaryFurs: info.primaryFurs,
      tradeRouteNotes: info.tradeRouteNotes,
    };

    if (!existing) {
      await prisma.furTradeInfo.create({ data: furTradeData });
      console.log(`  ✅ Added fur trade info: ${info.waterwayName}`);
    } else {
      await prisma.furTradeInfo.update({
        where: { id: existing.id },
        data: furTradeData
      });
      console.log(`  ✅ Updated fur trade info: ${info.waterwayName}`);
    }
  }

  console.log("\n🎉 Fur trade posts data complete!");

  // Print summary
  const locationCount = await prisma.location.count();
  const furTradeCount = await prisma.furTradeInfo.count();
  const fortCount = await prisma.location.count({ where: { locationType: "Fort" } });
  const tradingPostCount = await prisma.location.count({ where: { locationType: "Trading Post" } });

  console.log(`\nSummary:`);
  console.log(`  - ${locationCount} total locations`);
  console.log(`  - ${fortCount} forts`);
  console.log(`  - ${tradingPostCount} trading posts`);
  console.log(`  - ${furTradeCount} waterways with fur trade information`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
