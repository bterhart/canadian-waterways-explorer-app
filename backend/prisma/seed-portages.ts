/**
 * Seed file for Notable Canadian Fur Trade Portages
 *
 * Portages were the critical land crossings that connected waterways and enabled
 * the fur trade to span the continent. This file adds historically significant
 * portages with their Indigenous names, geographic details, and connections to
 * explorers and the fur trade.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PortageData {
  name: string;
  indigenousName: string | null;
  indigenousLanguage: string | null;
  description: string;
  latitude: number;
  longitude: number;
  locationType: "Portage";
  yearEstablished: number | null;
  historicalNotes: string;
  waterwayName: string; // The waterway this portage is associated with
}

const portages: PortageData[] = [
  // ==================== GRAND PORTAGE ====================
  {
    name: "Grand Portage",
    indigenousName: "Gichi-onigaming",
    indigenousLanguage: "Ojibwe",
    description: `Grand Portage was the most famous portage in the Canadian fur trade, serving as the main route around the falls and rapids of the Pigeon River between Lake Superior and the interior waterways. The portage was approximately 13.6 km (8.5 miles) long, making it one of the longest portages on the fur trade routes.

The name "Grand Portage" in French and "Gichi-onigaming" (meaning "great carrying place") in Ojibwe both refer to its length and importance. For the Anishinaabe people, this portage had been used for centuries before European contact.

The site became the summer rendezvous point for the North West Company from 1784 to 1803, where "winterers" from the interior met the Montreal brigades. Thousands of voyageurs, traders, and Indigenous peoples gathered here annually, creating a vibrant temporary city. The fort at Grand Portage became one of the largest fur trade centers in North America.

In 1803, when the international boundary placed Grand Portage in American territory, the NWC moved its operations to Fort William on the Kaministiquia River, though the Grand Portage route had been the preferred path for over a century.`,
    latitude: 47.9611,
    longitude: -89.6868,
    locationType: "Portage",
    yearEstablished: 1731,
    historicalNotes: `First European use documented by La Vérendrye in 1731, though the route was used by Indigenous peoples for millennia. North West Company headquarters from 1784-1803. Annual summer rendezvous attracted thousands. Voyageurs made multiple trips carrying 90-pound "pieces" across the 8.5-mile trail. The portage rose 600 feet from Lake Superior to the height of land. Young voyageurs (mangeurs de lard) who completed the crossing were inducted as "hommes du nord" (men of the north) through a traditional "baptism" ceremony. Now a U.S. National Monument.`,
    waterwayName: "Lake Superior",
  },

  // ==================== METHYE PORTAGE (LA LOCHE) ====================
  {
    name: "Methye Portage",
    indigenousName: "La Loche",
    indigenousLanguage: "French/Cree",
    description: `Methye Portage, also known as Portage La Loche, was the longest portage on the entire transcontinental fur trade route, stretching 19 km (12 miles) across the height of land between the Hudson Bay and Arctic/Mackenzie River drainage basins. This portage was the only land crossing between the two great watershed systems.

The portage crossed from Lac La Loche (in the Churchill River system draining to Hudson Bay) to the Clearwater River (flowing to the Athabasca and ultimately to the Arctic Ocean via the Mackenzie River). This made it the essential gateway to the incredibly rich Athabasca fur country.

Peter Pond first crossed this portage in 1778, opening the Athabasca trade that made the North West Company wealthy. After Pond, virtually every major explorer heading to the Athabasca, Mackenzie River, or Arctic had to cross Methye Portage, including Alexander Mackenzie, David Thompson, Simon Fraser, and John Franklin.

The portage's name comes from the methye (burbot or freshwater cod) found in Lac La Loche. The Dene and Cree peoples had used this crossing for centuries before European arrival.`,
    latitude: 56.5,
    longitude: -109.4,
    locationType: "Portage",
    yearEstablished: 1778,
    historicalNotes: `First European crossing by Peter Pond in 1778. Gateway to the Athabasca fur country. Longest portage on the transcontinental route at 19 km (12 miles). Alexander Mackenzie crossed it in 1789 en route to the Arctic Ocean and again in 1793 on his Pacific journey. The portage crossed the continental divide between the Hudson Bay and Arctic Ocean watersheds. Voyageurs called the viewpoint at the north end "Rendezvous Lake Overlook" for its stunning views. Now a Saskatchewan Provincial Historic Site.`,
    waterwayName: "Churchill River (Saskatchewan)",
  },

  // ==================== HAUTEUR DES TERRES (HEIGHT OF LAND) ====================
  {
    name: "Hauteur des Terres",
    indigenousName: "Ishpadinaa",
    indigenousLanguage: "Ojibwe",
    description: `Hauteur des Terres (French for "Height of Land") was one of the most symbolically important portages on the voyageur route, marking the continental divide between waters flowing to the Atlantic Ocean and those flowing to Hudson Bay.

Located between North Lake and South Lake in present-day Ontario's Quetico Provincial Park, this relatively short portage (about 200 meters) marked a profound geographical and psychological transition. Waters on the south side eventually reach the Atlantic via the Great Lakes and St. Lawrence; waters on the north flow to Hudson Bay via the Rainy River, Lake Winnipeg, and the Nelson River.

For voyageurs, crossing the Height of Land was a rite of passage. Those who had never crossed before were subjected to a traditional "baptism" - being splashed with water and cedar boughs - and required to swear an oath never to let another novice pass without similar treatment. After this ceremony, a mangeur de lard (pork eater, the greenhorn paddlers from Montreal) became a true homme du nord (man of the north).

The portage was part of the Dawson Route used by the North West Company and later by settlers heading to the Red River.`,
    latitude: 48.4,
    longitude: -91.3,
    locationType: "Portage",
    yearEstablished: 1688,
    historicalNotes: `Part of the traditional voyageur route from Montreal to the interior. Marked the continental divide between Atlantic and Hudson Bay watersheds. Site of the traditional voyageur "baptism" ceremony. Jacques de Noyon likely crossed here in 1688. La Vérendrye used this route from 1731. Located in present-day Quetico Provincial Park. The nearby "Voyageur's Monument" commemorates this symbolic crossing.`,
    waterwayName: "Ottawa River",
  },

  // ==================== LONG SAULT PORTAGE ====================
  {
    name: "Long Sault Portage",
    indigenousName: "Kichi-asini",
    indigenousLanguage: "Algonquin",
    description: `Long Sault Portage bypassed the treacherous Long Sault rapids on the Ottawa River, one of the most dangerous obstacles on the route from Montreal to the interior. The rapids stretched for several kilometers, with a series of violent cataracts that made direct passage by canoe impossible.

The portage, approximately 2 km long, was one of the busiest on the Ottawa River route. Thousands of canoes passed this way annually during the height of the fur trade, as it was the main highway between Montreal and the pays d'en haut (upper country).

The site gained historical significance in 1660 when Adam Dollard des Ormeaux and a small group of French colonists and Indigenous allies made a legendary stand against a much larger Iroquois war party near the rapids. While the battle's details are debated, it became a foundational myth of New France.

The rapids were flooded in 1958 with the construction of the Carillon Dam as part of the St. Lawrence Seaway project. The portage site is now largely underwater.`,
    latitude: 45.55,
    longitude: -74.6,
    locationType: "Portage",
    yearEstablished: 1610,
    historicalNotes: `One of the busiest portages on the Montreal-to-interior route. Site of the 1660 "Long Sault" battle between French colonists and Iroquois. Champlain passed this way in 1613 and 1615. The rapids were considered among the most dangerous on the Ottawa River. Now flooded by the Carillon Dam (1958). Dollard des Ormeaux memorial commemorates the 1660 battle.`,
    waterwayName: "Ottawa River",
  },

  // ==================== CHAUDIÈRE PORTAGE ====================
  {
    name: "Chaudière Portage",
    indigenousName: "Asticou",
    indigenousLanguage: "Algonquin",
    description: `Chaudière Portage bypassed the spectacular Chaudière Falls on the Ottawa River at the site of present-day Ottawa. The falls, where the entire Ottawa River plunges over a cliff, made the portage absolutely essential for travel upriver.

The name "Chaudière" (French for "cauldron" or "boiler") refers to the churning, pot-like appearance of the water at the base of the falls. The Algonquin name "Asticou" means "boiling water." The Algonquin people considered the falls sacred and offered tobacco to the spirits before crossing.

The portage was approximately 1 km long on the Quebec (north) side of the river. This location at the junction of the Rideau, Gatineau, and Ottawa rivers made it a natural meeting place for Indigenous peoples and later for the fur trade. The site was so strategic that it eventually became Canada's capital city.

Samuel de Champlain passed the Chaudière Falls in 1613 on his journey up the Ottawa River. He noted the Indigenous custom of offering tobacco to the manitou of the falls. The location remained an important gathering place throughout the fur trade era.`,
    latitude: 45.4236,
    longitude: -75.7091,
    locationType: "Portage",
    yearEstablished: 1613,
    historicalNotes: `First documented European crossing by Champlain in 1613. The Algonquin considered the falls sacred. Traditional tobacco offerings were made before crossing. Strategic location at the confluence of three rivers. Site eventually became Canada's capital (Ottawa/Hull). The falls were later harnessed for hydroelectric power and lumber processing. Victoria Island, between the channels, remains significant to Indigenous peoples.`,
    waterwayName: "Ottawa River",
  },

  // ==================== FROG PORTAGE ====================
  {
    name: "Frog Portage",
    indigenousName: "Athapapuskow",
    indigenousLanguage: "Cree",
    description: `Frog Portage was a crucial crossing on the Churchill River in present-day Saskatchewan, connecting the Missinipi (Churchill River) to the Sturgeon-weir River system and providing access to the rich fur regions of the Athabasca.

The portage was about 500 meters long, relatively short but extremely significant as it marked the junction between two major trade routes. From here, traders could continue west on the Churchill River or turn north toward the Athabasca via the Sturgeon-weir River.

The name "Athapapuskow" is Cree for "halfway across rocks" or "narrows between rocks," referring to the rocky terrain at this crossing. The English name "Frog Portage" may derive from the many frogs found in the marshy areas nearby.

This portage became even more important after Peter Pond opened the Athabasca trade in 1778. Brigades heading to the Athabasca often split here, with some continuing on the Churchill River and others taking the Sturgeon-weir route. The Hudson's Bay Company and North West Company both maintained posts near Frog Portage to control this vital junction.`,
    latitude: 55.72,
    longitude: -103.0,
    locationType: "Portage",
    yearEstablished: 1774,
    historicalNotes: `Key junction on the Churchill River system. Samuel Hearne may have passed nearby on his journey to establish Cumberland House (1774). Critical for the Athabasca trade after 1778. Both HBC and NWC maintained posts near the portage. Henry Kelsey may have passed this area in 1690. The Cree considered this an important gathering and trading site.`,
    waterwayName: "Churchill River (Saskatchewan)",
  },

  // ==================== RAT PORTAGE ====================
  {
    name: "Rat Portage",
    indigenousName: "Waazhushk-onigaming",
    indigenousLanguage: "Ojibwe",
    description: `Rat Portage connected Lake of the Woods to the Winnipeg River, serving as a critical link on the route between Lake Superior and Lake Winnipeg. The portage bypassed a series of rapids where the waters of the vast Lake of the Woods funneled into the Winnipeg River.

The name comes from the Ojibwe "Waazhushk" (muskrat), referring to the abundant muskrats in the area. The site became the town of Rat Portage, later renamed Kenora, Ontario.

This portage was heavily used during the fur trade era as brigades moved between Grand Portage (later Fort William) and the western posts around Lake Winnipeg. La Vérendrye passed through here in 1732-1733 on his way to establish the first French posts in the west.

The area around Rat Portage became contentious in the late 19th century, with both Ontario and Manitoba claiming jurisdiction - a dispute not resolved until 1884 when it was confirmed as part of Ontario. The town became a major lumber center and is now known as Kenora, a popular tourist destination.`,
    latitude: 49.7669,
    longitude: -94.4894,
    locationType: "Portage",
    yearEstablished: 1732,
    historicalNotes: `Critical portage between Lake of the Woods and Winnipeg River. La Vérendrye used this route to establish western posts (1732-33). Jean-Baptiste de La Vérendrye passed through shortly before his death at the Lake of the Woods Massacre (1736). Site became the town of Rat Portage, renamed Kenora in 1905. Ontario-Manitoba boundary dispute centered on this area (settled 1884). Now a tourist destination known as the "Lake of the Woods" region.`,
    waterwayName: "Lake Winnipeg",
  },

  // ==================== ECHIMAMISH PORTAGE ====================
  {
    name: "Echimamish Portage",
    indigenousName: "Echimamish",
    indigenousLanguage: "Cree",
    description: `Echimamish Portage was one of the shortest but most significant portages in the fur trade, connecting the Hayes River system to the Nelson River system in present-day Manitoba. At only about 2.5 km (1.5 miles), it enabled travel between York Factory on Hudson Bay and the interior of the continent.

The Cree name "Echimamish" means "the water that flows both ways" - a reference to the very low divide between the two river systems. At certain water levels, the flow direction could actually appear to reverse, leading to the name.

This portage was essential to the Hudson's Bay Company's operations. York Factory at the mouth of the Hayes River was the company's principal depot, and the route via the Echimamish connected it to Norway House and the vast interior trade network.

The relatively easy crossing made this the preferred route from Hudson Bay to the interior, favored over the more difficult Nelson River route despite the Nelson being the larger river. The Echimamish-Hayes route became known as the "York Factory Express" route in the 19th century.`,
    latitude: 54.7,
    longitude: -93.8,
    locationType: "Portage",
    yearEstablished: 1690,
    historicalNotes: `Henry Kelsey may have used this route in 1690 on his journey to the prairies. Critical to HBC operations from York Factory. The low divide meant waters could appear to flow both ways. Part of the "York Factory Express" route. Norway House, just to the west, became a major HBC distribution center. The route remained important until the railway reached Norway House in the 1920s.`,
    waterwayName: "Hudson Bay",
  },

  // ==================== FRENCH PORTAGE ====================
  {
    name: "French Portage",
    indigenousName: "Wemitigoozhii-onigaming",
    indigenousLanguage: "Ojibwe",
    description: `French Portage connected the French River to Georgian Bay on Lake Huron, completing the connection between the Ottawa River system and the Great Lakes. This was one of the most historically significant portages in Canada, used for centuries by Indigenous peoples and later by every major explorer heading west.

The portage bypassed the rapids and waterfalls where the French River enters Georgian Bay. At about 400 meters, it was relatively short but absolutely essential to the east-west trade route.

The river and portage are named for the French explorers who used this route to reach the interior. Étienne Brûlé likely crossed here as early as 1610, followed by Champlain in 1615. For the next 200 years, virtually every French expedition heading west passed this way.

The route via the Ottawa River, Lake Nipissing, and the French River became known as the "voyageur highway" - the main corridor connecting Montreal to the western fur country. The North West Company's brigades used this route annually, as did later HBC brigades after the 1821 merger.`,
    latitude: 45.95,
    longitude: -80.5,
    locationType: "Portage",
    yearEstablished: 1610,
    historicalNotes: `One of the earliest European-used portages in Canada. Étienne Brûlé crossed here around 1610. Champlain passed in 1615, reaching Lake Huron and Huronia. Thousands of voyageur canoes crossed annually. Part of the "voyageur highway" from Montreal to the interior. The French River is now a Canadian Heritage River and Provincial Park. The 30,000 Islands region of Georgian Bay begins near here.`,
    waterwayName: "Lake Huron",
  },

  // ==================== NIPSING PORTAGE (VASE PORTAGE) ====================
  {
    name: "La Vase Portages",
    indigenousName: "Waabitigweyang",
    indigenousLanguage: "Ojibwe",
    description: `La Vase Portages (also called the "Vase Portages" or "Mud Portages") were a series of portages connecting Lake Nipissing to the Mattawa River on the historic voyageur route between Montreal and the western interior. The portages totaled about 9 km and were notorious for their muddy, difficult terrain.

The name "La Vase" (French for "mud" or "slime") accurately describes the conditions voyageurs faced - the portage trails often passed through swampy, waterlogged ground that made footing treacherous and canoe-carrying exhausting.

Despite the difficult conditions, this route was preferred over alternatives because it provided the most direct connection between the Ottawa River system and Lake Nipissing. From Lake Nipissing, travelers could access the French River and Georgian Bay, opening the route to the entire Great Lakes and western interior.

Every major expedition heading west from Montreal passed through La Vase Portages, including Champlain's 1615 journey to Huronia, the Jesuit missionaries heading to their missions, and countless voyageur brigades carrying trade goods and furs.`,
    latitude: 46.25,
    longitude: -79.55,
    locationType: "Portage",
    yearEstablished: 1615,
    historicalNotes: `Champlain crossed in 1615, calling it the worst portage he had encountered. The muddy conditions gave it its name. Total length of about 9 km through difficult terrain. Jesuit missionaries used this route to reach Huronia. Part of the main voyageur highway from Montreal. Now partially in Samuel de Champlain Provincial Park. The route is commemorated in the park's interpretive programs.`,
    waterwayName: "Ottawa River",
  },

  // ==================== SASKATCHEWAN RIVER PORTAGE (THE PAS) ====================
  {
    name: "The Pas Portage",
    indigenousName: "Opaskwayak",
    indigenousLanguage: "Cree",
    description: `The Pas Portage (at the site of present-day The Pas, Manitoba) was a strategic crossing on the Saskatchewan River that allowed travelers to avoid difficult rapids and access the interior trade networks. The Cree name "Opaskwayak" means "the narrows" or "wooded narrows."

This location, where the Saskatchewan River narrows and creates rapids, had been an important gathering and trading site for Cree and other Indigenous peoples for centuries. It was a natural crossroads connecting the Saskatchewan River system to the routes leading north toward the Churchill River and Hudson Bay.

Henry Kelsey may have passed through this area in 1690-1692 during his journey to the prairies. The site gained importance during the fur trade as competing companies established posts nearby. Cumberland House, established by Samuel Hearne in 1774 as the first HBC inland post, was located not far upriver.

The Pas became an important settlement in the 19th and 20th centuries, serving as a gateway to northern Manitoba. The community remains an important center for the Opaskwayak Cree Nation.`,
    latitude: 53.825,
    longitude: -101.25,
    locationType: "Portage",
    yearEstablished: 1690,
    historicalNotes: `Ancient gathering site for Cree peoples. Henry Kelsey may have visited in 1690-1692. Near Cumberland House, first HBC inland post (1774). Strategic location connecting Saskatchewan River to northern routes. Opaskwayak Cree Nation maintains presence. The town of The Pas grew around this historic crossing.`,
    waterwayName: "Saskatchewan River",
  },

  // ==================== WINNIPEG RIVER PORTAGES - SLAVE FALLS ====================
  {
    name: "Slave Falls Portage",
    indigenousName: "Awakanish",
    indigenousLanguage: "Ojibwe",
    description: `Slave Falls Portage was one of numerous portages along the Winnipeg River that voyageur brigades had to navigate when traveling between Lake of the Woods and Lake Winnipeg. The Winnipeg River, with its many rapids and waterfalls, required over 25 portages along its length.

The name "Slave Falls" is a translation of the Ojibwe "Awakanish," though the origin of the name is uncertain - it may refer to captives taken in intertribal conflicts or to the enslaving nature of the difficult work required at this portage.

The falls created one of the more challenging portages on the river, requiring careful navigation and significant physical effort. Each rapid or falls on the Winnipeg River had its own character, and experienced voyageurs knew each one's particular dangers and best approaches.

The Winnipeg River route was the main highway between Fort William (and earlier Grand Portage) and the posts around Lake Winnipeg. Every brigade heading to or from the interior had to navigate these portages, making the Winnipeg River voyageurs among the most skilled in the trade.`,
    latitude: 50.2,
    longitude: -95.35,
    locationType: "Portage",
    yearEstablished: 1732,
    historicalNotes: `One of over 25 portages on the Winnipeg River route. La Vérendrye's expedition passed through in 1732-33. Part of the main route between Fort William and Lake Winnipeg. The Winnipeg River's many rapids created dangerous but essential portages. Experienced guides were crucial for safe passage. Several of the falls are now harnessed for hydroelectric power.`,
    waterwayName: "Lake Winnipeg",
  },

  // ==================== GRANDE DÉCHARGE ====================
  {
    name: "Grande Décharge",
    indigenousName: "Gashkanagamong",
    indigenousLanguage: "Ojibwe",
    description: `Grande Décharge (French for "Great Discharge") was a famous portage on the Saguenay River system, connecting Lac Saint-Jean to the Saguenay River. The portage bypassed a dramatic series of falls and rapids where the lake's waters discharged into the river.

This portage was part of one of the earliest European-Indigenous trade routes in Canada, predating the more famous Ottawa River route to the west. The Saguenay River system connected to the St. Lawrence at Tadoussac, one of the first and most important fur trading posts in New France.

The dramatic landscape of the Grande Décharge - with its roaring falls and steep cliffs - made a strong impression on early French explorers. The challenging terrain required skilled portaging but provided a vital connection to the hunting grounds around Lac Saint-Jean and beyond to James Bay.

The Ilnu (Montagnais) people used this route for centuries before European contact, traveling between their summer camps on the St. Lawrence and their interior hunting territories. They guided French traders along this route from the earliest days of the fur trade.`,
    latitude: 48.6,
    longitude: -72.0,
    locationType: "Portage",
    yearEstablished: 1600,
    historicalNotes: `One of the earliest fur trade routes in Canada. Used by Ilnu (Montagnais) for centuries before European contact. Connected Tadoussac on the St. Lawrence to Lac Saint-Jean and beyond. Part of a route reaching to James Bay. The dramatic falls and rapids made for challenging but scenic portaging. The area is now largely developed for hydroelectric power.`,
    waterwayName: "St. Lawrence River",
  },
];

// ==================== TIMELINE EVENTS FOR PORTAGES ====================

const portageTimelineEvents = [
  {
    title: "Grand Portage Becomes NWC Headquarters",
    description:
      "The North West Company formally establishes Grand Portage as its interior headquarters, making it the annual rendezvous point where brigades from Montreal meet winterers from the interior. Thousands of traders, voyageurs, and Indigenous peoples gather each summer.",
    year: 1784,
    theme: "fur_trade",
    importance: "major",
  },
  {
    title: "Peter Pond Crosses Methye Portage",
    description:
      "Connecticut-born trader Peter Pond becomes the first European to cross Methye Portage, opening the route to the incredibly rich Athabasca fur country. This 19-km portage across the continental divide will become the most important gateway to the Arctic watershed.",
    year: 1778,
    theme: "exploration",
    importance: "major",
  },
  {
    title: "Grand Portage Route Abandoned",
    description:
      "With the international boundary placing Grand Portage in American territory, the North West Company relocates its summer rendezvous to Fort William on the Kaministiquia River, ending over a century of use of the Grand Portage route.",
    year: 1803,
    theme: "fur_trade",
    importance: "normal",
  },
  {
    title: "Champlain Crosses Chaudière Falls",
    description:
      "Samuel de Champlain becomes one of the first Europeans to cross the Chaudière Portage on the Ottawa River. He notes the Algonquin custom of offering tobacco to the spirits of the falls before crossing.",
    year: 1613,
    theme: "exploration",
    importance: "normal",
  },
  {
    title: "La Vérendrye Opens Western Route",
    description:
      "Pierre Gaultier de La Vérendrye uses the Grand Portage and western waterways to establish a chain of posts extending French influence beyond Lake Superior. His expeditions rely on Indigenous knowledge and traditional portage routes.",
    year: 1731,
    theme: "exploration",
    importance: "major",
  },
];

// ==================== EXPLORER-PORTAGE CONNECTIONS ====================

interface ExplorerPortageConnection {
  explorerName: string;
  portageName: string;
  year: number | null;
  notes: string;
}

const explorerConnections: ExplorerPortageConnection[] = [
  {
    explorerName: "Pierre Gaultier de Varennes, Sieur de La Vérendrye",
    portageName: "Grand Portage",
    year: 1731,
    notes: "Used Grand Portage to establish western posts",
  },
  {
    explorerName: "Peter Pond",
    portageName: "Methye Portage",
    year: 1778,
    notes: "First European to cross Methye Portage",
  },
  {
    explorerName: "Alexander Mackenzie",
    portageName: "Methye Portage",
    year: 1789,
    notes: "Crossed Methye Portage en route to the Arctic Ocean",
  },
  {
    explorerName: "David Thompson",
    portageName: "Methye Portage",
    year: 1798,
    notes: "Surveyed and mapped Methye Portage route",
  },
  {
    explorerName: "Samuel de Champlain",
    portageName: "Chaudière Portage",
    year: 1613,
    notes: "First documented European crossing",
  },
  {
    explorerName: "Samuel de Champlain",
    portageName: "French Portage",
    year: 1615,
    notes: "Used this route to reach Huronia",
  },
  {
    explorerName: "Samuel de Champlain",
    portageName: "La Vase Portages",
    year: 1615,
    notes: "Crossed on journey to Huronia, called it the worst portage",
  },
  {
    explorerName: "Henry Kelsey",
    portageName: "Echimamish Portage",
    year: 1690,
    notes: "Likely used this route on his prairie journey",
  },
  {
    explorerName: "Samuel Hearne",
    portageName: "Frog Portage",
    year: 1774,
    notes: "Passed through area when establishing Cumberland House",
  },
];

// ==================== MAIN SEED FUNCTION ====================

async function seedPortages(): Promise<void> {
  console.log("Starting seed for notable Canadian fur trade portages...\n");

  try {
    // Track statistics
    let portagesCreated = 0;
    let portagesUpdated = 0;
    let eventsCreated = 0;
    let eventsUpdated = 0;

    // ==================== SEED PORTAGES ====================
    console.log("=== Seeding Portages ===\n");

    for (const portage of portages) {
      // Find the associated waterway
      const waterway = await prisma.waterway.findFirst({
        where: { name: portage.waterwayName },
      });

      if (!waterway) {
        console.log(`  ⚠ Skipping ${portage.name}: Waterway "${portage.waterwayName}" not found`);
        continue;
      }

      // Check if portage already exists
      const existing = await prisma.location.findFirst({
        where: {
          name: portage.name,
          locationType: "Portage",
        },
      });

      const portageData = {
        name: portage.name,
        indigenousName: portage.indigenousName,
        indigenousLanguage: portage.indigenousLanguage,
        description: portage.description,
        latitude: portage.latitude,
        longitude: portage.longitude,
        locationType: portage.locationType,
        yearEstablished: portage.yearEstablished,
        historicalNotes: portage.historicalNotes,
        waterwayId: waterway.id,
      };

      if (existing) {
        console.log(`  ↻ Updating: ${portage.name}`);
        await prisma.location.update({
          where: { id: existing.id },
          data: portageData,
        });
        portagesUpdated++;
      } else {
        console.log(`  ✓ Creating: ${portage.name}`);
        await prisma.location.create({
          data: portageData,
        });
        portagesCreated++;
      }
    }

    // ==================== SEED TIMELINE EVENTS ====================
    console.log("\n=== Seeding Timeline Events ===\n");

    for (const event of portageTimelineEvents) {
      const existing = await prisma.timelineEvent.findFirst({
        where: {
          title: event.title,
          year: event.year,
        },
      });

      if (existing) {
        console.log(`  ↻ Updating: ${event.title}`);
        await prisma.timelineEvent.update({
          where: { id: existing.id },
          data: event,
        });
        eventsUpdated++;
      } else {
        console.log(`  ✓ Creating: ${event.title}`);
        await prisma.timelineEvent.create({
          data: event,
        });
        eventsCreated++;
      }
    }

    // ==================== SUMMARY ====================
    console.log("\n=== Seed Complete ===\n");

    const totalPortages = await prisma.location.count({
      where: { locationType: "Portage" },
    });

    console.log(`Summary:
- Portages created: ${portagesCreated}
- Portages updated: ${portagesUpdated}
- Timeline events created: ${eventsCreated}
- Timeline events updated: ${eventsUpdated}
- Total portages in database: ${totalPortages}

Notable portages added:
- Grand Portage (NWC headquarters)
- Methye Portage (longest portage, gateway to Athabasca)
- Hauteur des Terres (Height of Land - continental divide)
- Long Sault Portage (Ottawa River)
- Chaudière Portage (at present-day Ottawa)
- Frog Portage (Churchill River junction)
- Rat Portage (now Kenora)
- Echimamish Portage (York Factory route)
- French Portage (Georgian Bay)
- La Vase Portages (Lake Nipissing)
- The Pas Portage (Saskatchewan River)
- Slave Falls Portage (Winnipeg River)
- Grande Décharge (Saguenay River)
`);
  } catch (error) {
    console.error("Error during seed:", error);
    throw error;
  }
}

// Run seed
seedPortages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
