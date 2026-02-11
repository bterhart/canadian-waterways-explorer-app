import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface HistoricalEventSeed {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  year: number;
  month?: number;
  day?: number;
  isApproximate: boolean;
  category: string;
  significance: string;
  imageUrl?: string;
}

const historicalEvents: HistoricalEventSeed[] = [
  // ==================== EASTERN CANADA ====================
  {
    title: "Cartier Raises Cross at Gaspe",
    description:
      "On July 24, 1534, Jacques Cartier erected a large wooden cross at Gaspe Peninsula, claiming the land for France. This marked the beginning of French colonization in North America. The Iroquoian chief Donnacona and his people witnessed this act, which Cartier claimed was merely a navigational marker.",
    latitude: 48.8378,
    longitude: -64.4823,
    locationName: "Gaspe Peninsula, Quebec",
    year: 1534,
    month: 7,
    day: 24,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Champlain Founds Quebec City",
    description:
      "Samuel de Champlain established a permanent French settlement at Quebec on July 3, 1608. He built a fortified habitation at the foot of Cap Diamant, which became the heart of New France. This settlement would become the capital of French Canada and remains one of North America's oldest cities.",
    latitude: 46.8139,
    longitude: -71.208,
    locationName: "Quebec City, Quebec",
    year: 1608,
    month: 7,
    day: 3,
    isApproximate: false,
    category: "settlement",
    significance: "major",
  },
  {
    title: "Battle of the Plains of Abraham",
    description:
      "On September 13, 1759, British forces under General James Wolfe defeated the French army of Marquis de Montcalm on the Plains of Abraham. This decisive battle lasting only 15 minutes determined the fate of New France. Both commanding generals died from wounds received during the battle.",
    latitude: 46.8008,
    longitude: -71.2161,
    locationName: "Plains of Abraham, Quebec City",
    year: 1759,
    month: 9,
    day: 13,
    isApproximate: false,
    category: "battle",
    significance: "major",
  },
  {
    title: "Franklin Expedition Departs",
    description:
      "Sir John Franklin's ill-fated expedition departed from Greenhithe, England, with HMS Erebus and HMS Terror on May 19, 1845. The expedition aimed to navigate and chart the Northwest Passage. All 129 crew members perished, making it one of the worst disasters in the history of polar exploration.",
    latitude: 51.4497,
    longitude: 0.1787,
    locationName: "Greenhithe, England (departure point)",
    year: 1845,
    month: 5,
    day: 19,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Cartier at Montreal (Hochelaga)",
    description:
      "In October 1535, Jacques Cartier visited the Iroquoian village of Hochelaga on Montreal Island. He climbed the mountain he named Mont Royal (Mount Royal), from which Montreal takes its name. The village had about 1,500 inhabitants living in longhouses surrounded by palisades.",
    latitude: 45.5088,
    longitude: -73.5878,
    locationName: "Montreal, Quebec",
    year: 1535,
    month: 10,
    isApproximate: true,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Founding of Halifax",
    description:
      "Colonel Edward Cornwallis founded Halifax on June 21, 1749, establishing a British stronghold to counter the French fortress of Louisbourg. The city was named after George Montagu-Dunk, 2nd Earl of Halifax. It became the capital of Nova Scotia and a crucial naval base.",
    latitude: 44.6488,
    longitude: -63.5752,
    locationName: "Halifax, Nova Scotia",
    year: 1749,
    month: 6,
    day: 21,
    isApproximate: false,
    category: "settlement",
    significance: "major",
  },
  {
    title: "Capture of Louisbourg",
    description:
      "British forces under General Jeffrey Amherst and Admiral Edward Boscawen captured the French fortress of Louisbourg on July 26, 1758, after a siege lasting seven weeks. This victory opened the St. Lawrence River to British invasion, leading to the fall of Quebec the following year.",
    latitude: 45.891,
    longitude: -59.9786,
    locationName: "Louisbourg, Nova Scotia",
    year: 1758,
    month: 7,
    day: 26,
    isApproximate: false,
    category: "battle",
    significance: "major",
  },

  // ==================== GREAT LAKES ====================
  {
    title: "Brule Sees Lake Superior",
    description:
      "Etienne Brule, the first European to explore the Great Lakes interior, reached Lake Superior around 1618. As Champlain's interpreter, Brule lived among the Huron-Wendat people and explored vast territories. He is considered the first European to see four of the five Great Lakes.",
    latitude: 46.7867,
    longitude: -84.7263,
    locationName: "Sault Ste. Marie area",
    year: 1618,
    isApproximate: true,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Fort Frontenac Established",
    description:
      "In 1673, Governor Louis de Buade de Frontenac established Fort Frontenac at the site of present-day Kingston, Ontario. The fort controlled the entrance to Lake Ontario and became a crucial link in the French fur trade network. It served as a base for expeditions into the interior.",
    latitude: 44.2305,
    longitude: -76.481,
    locationName: "Kingston, Ontario",
    year: 1673,
    isApproximate: true,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "La Salle at Niagara",
    description:
      "Rene-Robert Cavelier, Sieur de La Salle arrived at the Niagara River in 1679 and built the first sailing ship to navigate the upper Great Lakes. The Griffon, launched above Niagara Falls, carried furs from Green Bay before mysteriously disappearing on its return voyage.",
    latitude: 43.0896,
    longitude: -79.0849,
    locationName: "Niagara Falls, Ontario",
    year: 1679,
    isApproximate: true,
    category: "exploration",
    significance: "normal",
  },
  {
    title: "Founding of Detroit",
    description:
      "Antoine de la Mothe Cadillac founded Fort Pontchartrain du Detroit on July 24, 1701, establishing French control of the strategic strait between Lake Erie and Lake Huron. The settlement became a major fur trading center and remains an important city today.",
    latitude: 42.3314,
    longitude: -83.0458,
    locationName: "Detroit, Michigan",
    year: 1701,
    month: 7,
    day: 24,
    isApproximate: false,
    category: "settlement",
    significance: "major",
  },
  {
    title: "Father Marquette at Michilimackinac",
    description:
      "In 1671, Father Jacques Marquette established a mission at St. Ignace, near the Straits of Mackinac. This location became a crucial junction for the French fur trade, connecting Lakes Michigan, Huron, and Superior. Marquette later explored the Mississippi River with Louis Jolliet.",
    latitude: 45.8669,
    longitude: -84.7286,
    locationName: "St. Ignace, Michigan",
    year: 1671,
    isApproximate: true,
    category: "exploration",
    significance: "normal",
  },

  // ==================== PRAIRIES ====================
  {
    title: "Kelsey Reaches the Prairies",
    description:
      "Henry Kelsey of the Hudson's Bay Company became the first European to see the Canadian prairies in 1690. Traveling from York Factory, he witnessed vast herds of bison and met the Assiniboine and Cree peoples. His journal contains the first English descriptions of the Great Plains.",
    latitude: 52.5,
    longitude: -106.0,
    locationName: "Saskatchewan prairies",
    year: 1690,
    isApproximate: true,
    category: "exploration",
    significance: "major",
  },
  {
    title: "La Verendrye Builds Fort Rouge",
    description:
      "Pierre Gaultier de Varennes, sieur de La Verendrye established Fort Rouge in 1738 at the junction of the Red and Assiniboine Rivers. This location would later become Winnipeg. La Verendrye was seeking a route to the Western Sea while expanding the French fur trade.",
    latitude: 49.8844,
    longitude: -97.1297,
    locationName: "Winnipeg, Manitoba",
    year: 1738,
    isApproximate: true,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "Selkirk Settlers Arrive",
    description:
      "The first group of Scottish settlers recruited by Lord Selkirk arrived at the Red River Colony on August 30, 1812. These settlers faced extreme hardships, including conflict with the North West Company and the Pemmican War. The colony became the foundation of Manitoba.",
    latitude: 49.8951,
    longitude: -97.1384,
    locationName: "Red River Colony, Manitoba",
    year: 1812,
    month: 8,
    day: 30,
    isApproximate: false,
    category: "settlement",
    significance: "major",
  },
  {
    title: "Battle of Seven Oaks",
    description:
      "On June 19, 1816, a confrontation between Metis hunters and Hudson's Bay Company settlers at Seven Oaks resulted in the deaths of 21 colonists, including Governor Robert Semple. This event galvanized Metis identity and is commemorated in Pierre Falcon's famous song.",
    latitude: 49.9167,
    longitude: -97.15,
    locationName: "Seven Oaks, Manitoba",
    year: 1816,
    month: 6,
    day: 19,
    isApproximate: false,
    category: "battle",
    significance: "major",
  },
  {
    title: "Treaty 6 Signed at Fort Carlton",
    description:
      "Treaty 6 was signed at Fort Carlton on August 23, 1876, between the Crown and the Plains and Woods Cree, Assiniboine, and other First Nations. The treaty covered central Saskatchewan and Alberta. Chief Poundmaker and Chief Big Bear initially refused to sign, concerned about its terms.",
    latitude: 52.85,
    longitude: -106.2,
    locationName: "Fort Carlton, Saskatchewan",
    year: 1876,
    month: 8,
    day: 23,
    isApproximate: false,
    category: "treaty",
    significance: "major",
  },
  {
    title: "Thompson Reaches the Prairies via Mandan Villages",
    description:
      "David Thompson, the great surveyor and mapmaker, spent the winter of 1797-98 with the Mandan people along the Missouri River. His detailed observations and maps would later prove invaluable to understanding the geography of the northern Great Plains.",
    latitude: 47.3,
    longitude: -101.0,
    locationName: "Mandan Villages, North Dakota",
    year: 1797,
    isApproximate: true,
    category: "exploration",
    significance: "normal",
  },

  // ==================== NORTH ====================
  {
    title: "Hearne Reaches Arctic Ocean",
    description:
      "Samuel Hearne of the Hudson's Bay Company became the first European to reach the Arctic Ocean overland on July 17, 1771. Guided by Chipewyan leader Matonabbee, he reached the mouth of the Coppermine River after an arduous journey from Fort Prince of Wales.",
    latitude: 67.8167,
    longitude: -115.0833,
    locationName: "Coppermine River mouth, Nunavut",
    year: 1771,
    month: 7,
    day: 17,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Franklin's Ships Trapped in Ice",
    description:
      "In September 1846, HMS Erebus and HMS Terror became trapped in ice off King William Island. The ships would never sail again. Franklin died in June 1847, and the remaining crew attempted to walk to safety, all perishing in what remains one of polar exploration's greatest mysteries.",
    latitude: 69.0,
    longitude: -98.5,
    locationName: "King William Island, Nunavut",
    year: 1846,
    month: 9,
    isApproximate: true,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Discovery of HMS Erebus",
    description:
      "On September 7, 2014, a Parks Canada-led expedition discovered the wreck of HMS Erebus in Queen Maud Gulf, 168 years after it was abandoned. The well-preserved wreck lies in 11 meters of water and has yielded numerous artifacts providing insights into the expedition's fate.",
    latitude: 68.9333,
    longitude: -98.8833,
    locationName: "Queen Maud Gulf, Nunavut",
    year: 2014,
    month: 9,
    day: 7,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Discovery of HMS Terror",
    description:
      "HMS Terror was discovered on September 12, 2016, in Terror Bay off King William Island. The ship was remarkably well-preserved, sitting upright on the seafloor in 24 meters of water. Inuit oral histories helped guide researchers to the location.",
    latitude: 68.9,
    longitude: -98.9,
    locationName: "Terror Bay, Nunavut",
    year: 2016,
    month: 9,
    day: 12,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Frobisher Lands at Baffin Island",
    description:
      "Martin Frobisher landed on Baffin Island in 1576, becoming one of the first Europeans to set foot in the Canadian Arctic. He was searching for the Northwest Passage and believed he had found gold ore, leading to two more expeditions. The ore proved worthless.",
    latitude: 62.85,
    longitude: -65.75,
    locationName: "Frobisher Bay, Baffin Island",
    year: 1576,
    isApproximate: true,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Amundsen Completes Northwest Passage",
    description:
      "Norwegian explorer Roald Amundsen and his crew on the Gjoa completed the first navigation of the Northwest Passage on August 26, 1905, arriving at Herschel Island. The voyage took three years and succeeded where many had failed by using a small vessel and learning from Inuit.",
    latitude: 69.5708,
    longitude: -138.9108,
    locationName: "Herschel Island, Yukon",
    year: 1905,
    month: 8,
    day: 26,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },

  // ==================== WEST COAST ====================
  {
    title: "Cook Arrives at Nootka Sound",
    description:
      "Captain James Cook anchored at Nootka Sound on Vancouver Island on March 29, 1778, during his third voyage of exploration. He spent a month trading with the Nuu-chah-nulth people and repairing his ships. This visit sparked British and Spanish interest in the Pacific Northwest.",
    latitude: 49.5833,
    longitude: -126.6167,
    locationName: "Nootka Sound, British Columbia",
    year: 1778,
    month: 3,
    day: 29,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Mackenzie Reaches the Pacific",
    description:
      "Alexander Mackenzie became the first European to cross North America north of Mexico when he reached the Pacific Ocean on July 22, 1793. He painted his famous inscription on a rock at Dean Channel: 'Alexander Mackenzie, from Canada, by land, the twenty-second of July, one thousand seven hundred and ninety-three.'",
    latitude: 52.3778,
    longitude: -127.4667,
    locationName: "Bella Coola, British Columbia",
    year: 1793,
    month: 7,
    day: 22,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },
  {
    title: "Vancouver Meets Galiano and Valdes",
    description:
      "On June 21, 1792, British explorer George Vancouver met Spanish explorers Dionisio Alcala Galiano and Cayetano Valdes in the Strait of Georgia. Despite their nations' competing claims, they cooperated in surveying the coastline, sharing information and sailing together through what is now called Vancouver Island.",
    latitude: 49.0,
    longitude: -123.75,
    locationName: "Strait of Georgia, British Columbia",
    year: 1792,
    month: 6,
    day: 21,
    isApproximate: false,
    category: "exploration",
    significance: "normal",
  },
  {
    title: "Juan de Fuca Strait Discovered",
    description:
      "In 1592, Greek navigator Apostolos Valerianos, sailing under the name Juan de Fuca for Spain, claimed to have discovered the strait that now bears his name. While his account was doubted for centuries, the strait between Vancouver Island and Washington State was later named after him.",
    latitude: 48.3,
    longitude: -124.0,
    locationName: "Juan de Fuca Strait",
    year: 1592,
    isApproximate: true,
    category: "exploration",
    significance: "normal",
  },
  {
    title: "Fort Victoria Established",
    description:
      "James Douglas of the Hudson's Bay Company established Fort Victoria on March 14, 1843, to replace Fort Vancouver as the company's Pacific headquarters. The fort would grow into the city of Victoria, becoming the capital of British Columbia.",
    latitude: 48.4284,
    longitude: -123.3656,
    locationName: "Victoria, British Columbia",
    year: 1843,
    month: 3,
    day: 14,
    isApproximate: false,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "Thompson Reaches the Pacific via Columbia River",
    description:
      "David Thompson arrived at the mouth of the Columbia River on July 15, 1811, completing his epic journey down the river. He found American fur traders already established at Fort Astoria. Thompson had mapped the entire length of the Columbia, one of his greatest achievements.",
    latitude: 46.2444,
    longitude: -123.9588,
    locationName: "Astoria, Oregon (Columbia River mouth)",
    year: 1811,
    month: 7,
    day: 15,
    isApproximate: false,
    category: "exploration",
    significance: "major",
  },

  // ==================== FUR TRADE ====================
  {
    title: "Hudson's Bay Company Founded",
    description:
      "The Hudson's Bay Company was incorporated by royal charter on May 2, 1670, granting it a monopoly over the fur trade in the vast Hudson Bay drainage basin, known as Rupert's Land. The company would shape Canadian history for centuries and remains in operation today as a retail company.",
    latitude: 57.0,
    longitude: -92.0,
    locationName: "Hudson Bay (general territory)",
    year: 1670,
    month: 5,
    day: 2,
    isApproximate: false,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "North West Company Formed",
    description:
      "The North West Company was formally organized in 1779 as a partnership of Montreal fur traders to compete with the Hudson's Bay Company. Based in Montreal, the Nor'Westers pushed exploration westward and employed thousands of voyageurs paddling brigades of canoes.",
    latitude: 45.5017,
    longitude: -73.5673,
    locationName: "Montreal, Quebec",
    year: 1779,
    isApproximate: true,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "Grand Portage Rendezvous",
    description:
      "Each summer from the 1770s to 1803, fur traders from Montreal met traders from the interior at Grand Portage on Lake Superior. This rendezvous was the annual gathering where furs from the interior were exchanged for trade goods, and the voyageurs celebrated before the long journey back.",
    latitude: 47.9596,
    longitude: -89.6914,
    locationName: "Grand Portage, Minnesota",
    year: 1784,
    isApproximate: true,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "Fort William Becomes NWC Headquarters",
    description:
      "After the Jay Treaty (1794) placed Grand Portage in American territory, the North West Company relocated its inland headquarters to Fort William (now Thunder Bay) in 1803. The massive fort complex included warehouses, a great hall, and housing for over 1,000 people during the annual rendezvous.",
    latitude: 48.3809,
    longitude: -89.2477,
    locationName: "Thunder Bay, Ontario",
    year: 1803,
    isApproximate: true,
    category: "fur_trade",
    significance: "major",
  },
  {
    title: "HBC and NWC Merge",
    description:
      "On March 21, 1821, the Hudson's Bay Company and North West Company merged after years of violent competition that nearly bankrupted both companies. The merged company kept the HBC name and royal charter, gaining monopoly control over the fur trade across British North America.",
    latitude: 51.5074,
    longitude: -0.1278,
    locationName: "London, England (merger location)",
    year: 1821,
    month: 3,
    day: 21,
    isApproximate: false,
    category: "fur_trade",
    significance: "major",
  },

  // ==================== INDIGENOUS HISTORY ====================
  {
    title: "Numbered Treaties Begin (Treaty 1)",
    description:
      "Treaty 1 was signed on August 3, 1871, at Lower Fort Garry, marking the beginning of the Numbered Treaties. The Anishinaabe and Swampy Cree peoples ceded lands in southern Manitoba in exchange for reserves, annuities, and other provisions. This established the template for subsequent treaties.",
    latitude: 50.1667,
    longitude: -96.9667,
    locationName: "Lower Fort Garry, Manitoba",
    year: 1871,
    month: 8,
    day: 3,
    isApproximate: false,
    category: "treaty",
    significance: "major",
  },
  {
    title: "Creation of Nunavut",
    description:
      "On April 1, 1999, Nunavut ('Our Land' in Inuktitut) became Canada's newest territory, fulfilling the largest land claim agreement in Canadian history. The territory covers two million square kilometers and is governed primarily by Inuit. Iqaluit serves as the capital.",
    latitude: 63.7467,
    longitude: -68.5167,
    locationName: "Iqaluit, Nunavut",
    year: 1999,
    month: 4,
    day: 1,
    isApproximate: false,
    category: "indigenous",
    significance: "major",
  },
  {
    title: "Beothuk Extinction - Death of Shanawdithit",
    description:
      "Shanawdithit, believed to be the last member of the Beothuk people of Newfoundland, died of tuberculosis in St. John's on June 6, 1829. Her death marked the extinction of the Beothuk, who had lived in Newfoundland for thousands of years before European contact.",
    latitude: 47.5615,
    longitude: -52.7126,
    locationName: "St. John's, Newfoundland",
    year: 1829,
    month: 6,
    day: 6,
    isApproximate: false,
    category: "indigenous",
    significance: "major",
  },
];

async function seedHistoricalEvents() {
  console.log("Seeding historical events...");

  // Clear existing events
  await prisma.historicalEvent.deleteMany({});
  console.log("Cleared existing historical events");

  // Insert new events
  for (const event of historicalEvents) {
    await prisma.historicalEvent.create({
      data: event,
    });
  }

  console.log(`Successfully seeded ${historicalEvents.length} historical events`);
}

seedHistoricalEvents()
  .catch((e) => {
    console.error("Error seeding historical events:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
