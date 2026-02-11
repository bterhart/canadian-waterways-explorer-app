// Maritime exploration seed script
// Adds east and west coast explorers, coastal waterways, and historic landing sites

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚓ Adding maritime exploration data...\n");

  // ==================== ADD COASTAL WATERWAYS ====================
  console.log("🌊 Adding coastal waterways and bays...");

  // Get waterway types
  const bayType = await prisma.waterwayType.findFirst({ where: { name: "Bay" } });
  const straitType = await prisma.waterwayType.findFirst({ where: { name: "Strait" } });

  // Create Strait type if it doesn't exist
  let straitTypeId = straitType?.id;
  if (!straitTypeId) {
    const newStrait = await prisma.waterwayType.create({
      data: { name: "Strait" }
    });
    straitTypeId = newStrait.id;
    console.log("  ✅ Created Strait waterway type");
  }

  // Create Sound type
  let soundType = await prisma.waterwayType.findFirst({ where: { name: "Sound" } });
  if (!soundType) {
    soundType = await prisma.waterwayType.create({
      data: { name: "Sound" }
    });
    console.log("  ✅ Created Sound waterway type");
  }

  // Create Inlet type
  let inletType = await prisma.waterwayType.findFirst({ where: { name: "Inlet" } });
  if (!inletType) {
    inletType = await prisma.waterwayType.create({
      data: { name: "Inlet" }
    });
    console.log("  ✅ Created Inlet waterway type");
  }

  const coastalWaterways = [
    // East Coast
    {
      name: "Baie des Chaleurs",
      indigenousName: "Mawiomi'kik",
      indigenousLanguage: "Mi'kmaq",
      description: "A bay on the Atlantic coast forming the border between Quebec and New Brunswick. Jacques Cartier named it 'Baie de Chaleur' (Bay of Heat) in 1534 due to the warm summer weather. It was a vital fishing ground for the Mi'kmaq for thousands of years before European contact.",
      latitude: 47.9,
      longitude: -65.5,
      regionName: "Quebec/New Brunswick",
      typeId: bayType!.id,
      historicalSignificance: "Site of first recorded contact between Jacques Cartier and the Mi'kmaq people on July 7, 1534. Cartier wrote of the Mi'kmaq waving furs on sticks, initiating trade. The bay later became important for the cod fishery and Acadian settlement.",
      boundaryCoordinates: JSON.stringify([
        [48.1, -66.3], [48.0, -65.8], [47.9, -65.3], [47.8, -64.8],
        [47.7, -64.5], [47.5, -64.3], [47.3, -64.5], [47.2, -65.0],
        [47.4, -65.5], [47.6, -66.0], [47.8, -66.2], [48.1, -66.3]
      ]),
    },
    {
      name: "Gaspé Bay",
      indigenousName: "Gespeg",
      indigenousLanguage: "Mi'kmaq",
      description: "A bay at the eastern tip of the Gaspé Peninsula in Quebec. The name derives from the Mi'kmaq word 'Gespeg' meaning 'end of the land.' Jacques Cartier erected a cross here in 1534, claiming the land for France.",
      latitude: 48.83,
      longitude: -64.48,
      regionName: "Quebec",
      typeId: bayType!.id,
      historicalSignificance: "On July 24, 1534, Jacques Cartier erected a 30-foot wooden cross at Gaspé, claiming the land for King Francis I of France. Chief Donnacona of the Stadaconans (St. Lawrence Iroquoians) protested this claim, beginning a complex relationship that would shape New France.",
      boundaryCoordinates: JSON.stringify([
        [48.9, -64.6], [48.85, -64.4], [48.8, -64.3], [48.75, -64.4],
        [48.8, -64.5], [48.85, -64.55], [48.9, -64.6]
      ]),
    },
    {
      name: "Strait of Belle Isle",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A strait between Labrador and the island of Newfoundland, connecting the Gulf of St. Lawrence with the Atlantic Ocean. It is 125 km long and 15-60 km wide, known for its strong currents and frequent fog.",
      latitude: 51.5,
      longitude: -56.5,
      regionName: "Newfoundland and Labrador",
      typeId: straitTypeId!,
      historicalSignificance: "Used by Norse explorers around 1000 AD and later by Basque whalers in the 1500s. John Cabot likely passed through here in 1497. The strait was a major route for European fishing fleets accessing the rich Grand Banks.",
      boundaryCoordinates: JSON.stringify([
        [52.0, -55.5], [51.8, -55.8], [51.5, -56.5], [51.2, -57.2],
        [51.0, -57.5], [51.2, -57.8], [51.5, -57.5], [51.8, -56.8],
        [52.0, -56.0], [52.0, -55.5]
      ]),
    },
    {
      name: "Bonavista Bay",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A large bay on the northeast coast of Newfoundland, believed to be where John Cabot first sighted North America in 1497. The name 'Bonavista' (beautiful vista) is traditionally attributed to Cabot's exclamation upon seeing the land.",
      latitude: 48.7,
      longitude: -53.5,
      regionName: "Newfoundland and Labrador",
      typeId: bayType!.id,
      historicalSignificance: "Traditional site of John Cabot's North American landfall on June 24, 1497. His voyage for Henry VII of England established English claims to North America and revealed the rich cod fisheries of the Grand Banks.",
      boundaryCoordinates: JSON.stringify([
        [49.2, -53.0], [49.0, -53.2], [48.8, -53.5], [48.6, -53.8],
        [48.4, -54.0], [48.3, -53.6], [48.5, -53.2], [48.7, -53.0],
        [49.0, -52.8], [49.2, -53.0]
      ]),
    },
    {
      name: "Placentia Bay",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A large bay on the southeast coast of Newfoundland. It was the site of the French colony of Plaisance and later became a major naval base. The bay is notable for its historical importance in the French-English struggle for North America.",
      latitude: 47.2,
      longitude: -54.2,
      regionName: "Newfoundland and Labrador",
      typeId: bayType!.id,
      historicalSignificance: "French established Plaisance as their capital in Newfoundland (1662-1713). Site of the Atlantic Charter meeting between Churchill and Roosevelt in 1941. The bay's strategic position made it crucial for controlling access to the Gulf of St. Lawrence.",
      boundaryCoordinates: JSON.stringify([
        [47.8, -53.8], [47.5, -54.0], [47.2, -54.3], [46.9, -54.5],
        [46.7, -54.2], [46.9, -53.8], [47.2, -53.6], [47.5, -53.7],
        [47.8, -53.8]
      ]),
    },
    // West Coast
    {
      name: "Nootka Sound",
      indigenousName: "Yuquot",
      indigenousLanguage: "Nuu-chah-nulth",
      description: "A sound on the west coast of Vancouver Island. The Mowachaht/Muchalaht First Nation have inhabited this area for over 4,000 years. It became the focal point of European exploration and competing imperial claims in the late 18th century.",
      latitude: 49.58,
      longitude: -126.62,
      regionName: "British Columbia",
      typeId: soundType.id,
      historicalSignificance: "First point of European contact on Canada's Pacific coast when Spanish explorer Juan Pérez arrived in 1774. Captain James Cook landed in 1778 and spent a month trading with the Nuu-chah-nulth. The 'Nootka Crisis' (1789-1794) nearly caused war between Britain and Spain.",
      boundaryCoordinates: JSON.stringify([
        [49.7, -126.5], [49.65, -126.55], [49.6, -126.65], [49.55, -126.7],
        [49.5, -126.65], [49.52, -126.55], [49.58, -126.5], [49.65, -126.48],
        [49.7, -126.5]
      ]),
    },
    {
      name: "Burrard Inlet",
      indigenousName: "Tsleil-Waututh",
      indigenousLanguage: "Halkomelem",
      description: "A coastal fjord in southwestern British Columbia, forming the heart of Vancouver's harbour. Named by Captain George Vancouver in 1792 after his friend Sir Harry Burrard. The inlet has been home to Coast Salish peoples for thousands of years.",
      latitude: 49.3,
      longitude: -123.1,
      regionName: "British Columbia",
      typeId: inletType.id,
      historicalSignificance: "Explored by Captain George Vancouver in June 1792. Spanish explorers Galiano and Valdés met Vancouver here, sharing charts and information. The inlet became the site of the Hastings Mill (1867) and later the city of Vancouver.",
      boundaryCoordinates: JSON.stringify([
        [49.35, -123.3], [49.32, -123.2], [49.3, -123.1], [49.28, -123.0],
        [49.3, -122.9], [49.32, -122.95], [49.33, -123.05], [49.34, -123.15],
        [49.35, -123.3]
      ]),
    },
    {
      name: "English Bay",
      indigenousName: "Iy'álmexw",
      indigenousLanguage: "Squamish",
      description: "A bay forming the southern entrance to Burrard Inlet at Vancouver. Spanish Banks, on its southern shore, was named by Captain Vancouver to honor the Spanish explorers he met in the area in 1792.",
      latitude: 49.28,
      longitude: -123.18,
      regionName: "British Columbia",
      typeId: bayType!.id,
      historicalSignificance: "Site where Captain George Vancouver met Spanish explorers Dionisio Alcalá Galiano and Cayetano Valdés on June 22, 1792. Vancouver named the beaches 'Spanish Banks' to commemorate this friendly meeting between rival imperial powers.",
      boundaryCoordinates: JSON.stringify([
        [49.3, -123.25], [49.28, -123.2], [49.27, -123.15], [49.26, -123.12],
        [49.28, -123.1], [49.29, -123.15], [49.3, -123.2], [49.3, -123.25]
      ]),
    },
    {
      name: "Friendly Cove (Yuquot)",
      indigenousName: "Yuquot",
      indigenousLanguage: "Nuu-chah-nulth",
      description: "A small cove in Nootka Sound, Vancouver Island. 'Yuquot' means 'where the wind blows from all directions.' It was the summer village of the Mowachaht people and became the most important European trading post on the northwest coast.",
      latitude: 49.59,
      longitude: -126.61,
      regionName: "British Columbia",
      typeId: bayType!.id,
      historicalSignificance: "Captain Cook named it 'Friendly Cove' in 1778 due to the welcoming reception from Chief Maquinna. Spain established a fort here in 1789, leading to the Nootka Crisis. The Convention of 1794 opened the coast to British trade and settlement.",
      boundaryCoordinates: JSON.stringify([
        [49.595, -126.62], [49.59, -126.615], [49.585, -126.61],
        [49.588, -126.605], [49.593, -126.608], [49.595, -126.62]
      ]),
    },
    {
      name: "Juan de Fuca Strait",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A strait 153 km long between Vancouver Island and Washington State. Named for Greek navigator Apostolos Valerianos (Juan de Fuca), who claimed to have discovered it in 1592 while sailing for Spain, though this account is disputed.",
      latitude: 48.3,
      longitude: -124.0,
      regionName: "British Columbia/Washington",
      typeId: straitTypeId!,
      historicalSignificance: "Explored by Spanish, British, and American expeditions in the late 18th century. The boundary through the strait was disputed until 1872. The strait remains a major shipping channel for vessels heading to Vancouver, Seattle, and other Pacific ports.",
      boundaryCoordinates: JSON.stringify([
        [48.5, -124.8], [48.4, -124.5], [48.3, -124.0], [48.2, -123.5],
        [48.15, -123.2], [48.2, -123.0], [48.3, -123.3], [48.4, -123.8],
        [48.5, -124.3], [48.5, -124.8]
      ]),
    },
    {
      name: "Georgia Strait",
      indigenousName: "Salish Sea",
      indigenousLanguage: "Coast Salish languages",
      description: "A major strait between Vancouver Island and the British Columbia mainland, part of the Salish Sea. Over 240 km long and 30-55 km wide, it has been the homeland of Coast Salish peoples for over 10,000 years.",
      latitude: 49.3,
      longitude: -123.8,
      regionName: "British Columbia",
      typeId: straitTypeId!,
      historicalSignificance: "Named by Captain George Vancouver in 1792 in honor of King George III. Spanish explorer José María Narváez was the first European to sail through (1791). The strait became the main shipping route to the mainland and the focus of colonial settlement.",
      boundaryCoordinates: JSON.stringify([
        [50.0, -125.0], [49.7, -124.5], [49.3, -123.8], [49.0, -123.5],
        [48.8, -123.3], [49.0, -123.0], [49.3, -123.3], [49.7, -124.0],
        [50.0, -124.5], [50.0, -125.0]
      ]),
    },
    {
      name: "Queen Charlotte Sound",
      indigenousName: "Hecate",
      indigenousLanguage: null,
      description: "A large body of water between Vancouver Island, Haida Gwaii, and the British Columbia mainland. Known for rough seas and strong winds, it was a challenging passage for early explorers.",
      latitude: 51.5,
      longitude: -128.5,
      regionName: "British Columbia",
      typeId: soundType.id,
      historicalSignificance: "Named by Captain George Vancouver in 1792 after the ship HMS Queen Charlotte. The sound was traversed by Spanish, British, and Russian expeditions seeking the Northwest Passage and trade opportunities.",
      boundaryCoordinates: JSON.stringify([
        [52.0, -129.0], [51.7, -128.5], [51.5, -128.0], [51.3, -127.5],
        [51.0, -127.3], [51.2, -128.0], [51.5, -128.5], [51.8, -129.0],
        [52.0, -129.0]
      ]),
    },
    {
      name: "Lituya Bay",
      indigenousName: "Ltu.aa",
      indigenousLanguage: "Tlingit",
      description: "A fjord on the coast of Alaska, visited by French explorer La Pérouse in 1786. The bay is known for its extreme tidal currents and the devastating 1958 mega-tsunami (highest wave ever recorded at 524 meters).",
      latitude: 58.64,
      longitude: -137.63,
      regionName: "Alaska (visited from Canada expeditions)",
      typeId: bayType!.id,
      historicalSignificance: "La Pérouse landed here in July 1786 during his global expedition. Tragically, 21 French sailors drowned when their boats were caught in tidal currents. A cenotaph was erected on the island in the bay's center to commemorate them.",
      boundaryCoordinates: JSON.stringify([
        [58.7, -137.7], [58.65, -137.65], [58.6, -137.6], [58.58, -137.55],
        [58.6, -137.5], [58.65, -137.55], [58.68, -137.6], [58.7, -137.7]
      ]),
    },
  ];

  for (const waterway of coastalWaterways) {
    const existing = await prisma.waterway.findFirst({
      where: { name: waterway.name }
    });

    if (!existing) {
      await prisma.waterway.create({ data: waterway });
      console.log(`  ✅ Added ${waterway.name}`);
    } else {
      await prisma.waterway.update({
        where: { id: existing.id },
        data: waterway
      });
      console.log(`  ✅ Updated ${waterway.name}`);
    }
  }

  // ==================== ADD MARITIME EXPLORERS ====================
  console.log("\n👤 Adding maritime explorers...");

  const maritimeExplorers = [
    // East Coast Early Explorers
    {
      name: "John Cabot (Giovanni Caboto)",
      birthYear: 1450,
      deathYear: 1500,
      nationality: "Venetian/Italian (sailing for England)",
      biography: "Italian navigator and explorer who sailed under the commission of Henry VII of England in 1497. His voyage to North America was the first European exploration of the mainland since the Norse 500 years earlier. He made landfall somewhere on the Atlantic coast, likely Newfoundland or Cape Breton, and claimed the land for England.",
      notableAchievements: "First European since the Norse to reach the North American mainland (1497). Discovered the rich cod fisheries of the Grand Banks. Established England's claim to North America. His second voyage in 1498 ended in mystery—he was never seen again.",
    },
    {
      name: "Juan Pérez",
      birthYear: 1725,
      deathYear: 1775,
      nationality: "Spanish",
      biography: "Spanish naval officer who led the first documented European expedition to the Pacific Northwest in 1774. He reached as far north as Haida Gwaii (which he named 'Islas de la Reina Carlota') and made first contact with the Haida people before sailing south to Nootka Sound.",
      notableAchievements: "First European to see the Pacific coast of Canada (1774). Made first European contact with the Haida people. His expedition established Spain's claims to the northwest coast.",
    },
    {
      name: "Bruno de Heceta (Hezeta)",
      birthYear: 1744,
      deathYear: 1807,
      nationality: "Spanish",
      biography: "Spanish naval officer and explorer who led an expedition to the Pacific Northwest in 1775. He was the first European to set foot on the coast of what is now Washington State and discovered the mouth of the Columbia River, though he did not enter it.",
      notableAchievements: "First European to discover the Columbia River mouth (1775). Led Spanish claim-staking expedition along the Pacific coast. His charts were used by later explorers.",
    },
    {
      name: "Juan Francisco de la Bodega y Quadra",
      birthYear: 1743,
      deathYear: 1794,
      nationality: "Spanish (born in Peru)",
      biography: "Spanish naval officer who made three major expeditions to the Pacific Northwest (1775, 1779, 1792). He explored as far north as Alaska and later served as Spanish commandant at Nootka Sound. He developed a famous friendship with Captain George Vancouver during negotiations over Nootka.",
      notableAchievements: "Explored Alaska coast (1775, 1779). Served as Spanish commandant at Nootka. Negotiated with Vancouver during the Nootka Crisis. Vancouver named 'Quadra's and Vancouver's Island' (later shortened to Vancouver Island) in his honor.",
    },
    {
      name: "Captain James Cook",
      birthYear: 1728,
      deathYear: 1779,
      nationality: "English",
      biography: "The famous British explorer, navigator, and cartographer who made three Pacific voyages. On his third voyage (1776-1779), seeking the Northwest Passage from the Pacific side, he became the first European to make recorded contact with the Hawaiian Islands and explored the Pacific coast from Oregon to Alaska, spending a month at Nootka Sound.",
      notableAchievements: "First European to thoroughly explore and map the northwest coast (1778). Made detailed contact with Nuu-chah-nulth people at Nootka Sound. His expedition's sea otter pelts sparked the maritime fur trade. Killed in Hawaii in 1779.",
    },
    {
      name: "Jean-François de Galaup, comte de La Pérouse",
      birthYear: 1741,
      deathYear: 1788,
      nationality: "French",
      biography: "French naval officer and explorer who led a scientific expedition around the world (1785-1788). He explored the Pacific coast from Alaska to California in 1786, making important scientific observations. His expedition disappeared in the Solomon Islands in 1788.",
      notableAchievements: "Explored Alaska coast including Lituya Bay where 21 of his men drowned (1786). Made detailed scientific observations of the northwest coast. His journals were recovered and published posthumously. Mysteriously lost near Vanikoro in 1788.",
    },
    {
      name: "Captain George Vancouver",
      birthYear: 1757,
      deathYear: 1798,
      nationality: "English",
      biography: "British Royal Navy officer who led a four-year expedition (1791-1795) to chart the northwest coast of North America. As a young midshipman, he had sailed with Captain Cook. His meticulous surveys produced charts so accurate they were used into the 20th century.",
      notableAchievements: "Created the most detailed charts of the Pacific Northwest. Circumnavigated Vancouver Island, proving it was an island. Named numerous landmarks including Puget Sound, Mount Baker, and Spanish Banks. His negotiations with Bodega y Quadra at Nootka helped resolve the crisis peacefully.",
    },
    {
      name: "William Bligh",
      birthYear: 1754,
      deathYear: 1817,
      nationality: "English",
      biography: "British naval officer famous (or infamous) for the Mutiny on the Bounty (1789). Before that event, he served as sailing master on Captain Cook's third voyage (1776-1779) and visited Nootka Sound. Bligh Island and Bligh Cove in Nootka Sound are named after him.",
      notableAchievements: "Served as sailing master under Cook during the 1778 Nootka Sound visit. His navigational skills were renowned—after the Bounty mutiny, he navigated an open boat 6,700 km to safety. Later became Governor of New South Wales.",
    },
    {
      name: "Dionisio Alcalá Galiano",
      birthYear: 1760,
      deathYear: 1805,
      nationality: "Spanish",
      biography: "Spanish naval officer and explorer who led an expedition to survey the Strait of Georgia in 1792. He and Cayetano Valdés circumnavigated Vancouver Island, meeting George Vancouver at Spanish Banks. He died heroically at the Battle of Trafalgar.",
      notableAchievements: "Surveyed the Strait of Georgia and circumnavigated Vancouver Island (1792). His friendly meeting with Vancouver at Point Grey led to the naming of Spanish Banks. Died commanding the Bahama at Trafalgar (1805).",
    },
    {
      name: "Cayetano Valdés",
      birthYear: 1767,
      deathYear: 1835,
      nationality: "Spanish",
      biography: "Spanish naval officer who co-commanded the 1792 expedition with Galiano. Together they proved Vancouver Island was indeed an island by circumnavigating it. Valdés later became a distinguished admiral and briefly Captain General of Cadiz.",
      notableAchievements: "Co-circumnavigated Vancouver Island (1792). Met Vancouver at Spanish Banks. Commanded the Neptuno at Trafalgar and survived. Rose to high naval rank in Spain.",
    },
    {
      name: "Vitus Bering",
      birthYear: 1681,
      deathYear: 1741,
      nationality: "Danish (sailing for Russia)",
      biography: "Danish navigator in Russian service who led two major expeditions to determine whether Asia and North America were connected. On his second expedition (1741), he reached Alaska, but his ship was wrecked on the return voyage. Bering died of scurvy on what is now Bering Island.",
      notableAchievements: "Proved that Asia and North America were separate continents (Bering Strait). First European to sight Alaska from the west (1741). His expedition's sea otter pelts sparked Russian interest in Alaska.",
    },
    {
      name: "Aleksei Chirikov",
      birthYear: 1703,
      deathYear: 1748,
      nationality: "Russian",
      biography: "Russian navigator who commanded the St. Paul on Bering's second expedition. He actually reached the Alaska coast before Bering and was the first European to sight the northwest coast from the Pacific side. He lost two landing parties in mysterious circumstances, likely killed by Tlingit warriors.",
      notableAchievements: "First European to sight Alaska from the sea (July 15, 1741, two days before Bering). Lost 21 men when two landing parties disappeared. His voyage established Russian claims to Alaska.",
    },
    {
      name: "Robert Gray",
      birthYear: 1755,
      deathYear: 1806,
      nationality: "American",
      biography: "American merchant captain who commanded the first American vessel to circumnavigate the globe (1787-1790). On his second voyage, he became the first European to enter the Columbia River (1792), which he named after his ship. His voyages helped establish American claims to the Oregon Territory.",
      notableAchievements: "First American to circumnavigate the globe. First European to enter the Columbia River (May 11, 1792). His discovery strengthened American claims to the Pacific Northwest.",
    },
    {
      name: "José María Narváez",
      birthYear: 1768,
      deathYear: 1840,
      nationality: "Spanish",
      biography: "Spanish naval officer and pilot who was the first European to explore the Strait of Georgia (1791). His expedition, under Francisco de Eliza, also explored much of the San Juan Islands and Puget Sound region. His charts guided later Spanish and British expeditions.",
      notableAchievements: "First European to sail through the Strait of Georgia (1791). Explored and charted the inland waters around Vancouver Island. His work provided the foundation for later surveys by Vancouver and Galiano.",
    },
  ];

  for (const explorer of maritimeExplorers) {
    const existing = await prisma.explorer.findFirst({
      where: { name: explorer.name }
    });

    if (!existing) {
      await prisma.explorer.create({ data: explorer });
      console.log(`  ✅ Added ${explorer.name}`);
    } else {
      await prisma.explorer.update({
        where: { id: existing.id },
        data: explorer
      });
      console.log(`  ✅ Updated ${explorer.name}`);
    }
  }

  // ==================== ADD HISTORIC LANDING SITES ====================
  console.log("\n📍 Adding historic landing sites and exploration locations...");

  // Get waterway IDs
  const waterways = await prisma.waterway.findMany();
  const waterwayMap = new Map(waterways.map(w => [w.name, w.id]));

  const landingSites = [
    // East Coast
    {
      name: "Cape Bonavista",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A headland on the east coast of Newfoundland, traditionally considered the site where John Cabot first sighted North America on June 24, 1497. A statue of Cabot stands here, and the nearby lighthouse is a National Historic Site.",
      latitude: 48.7,
      longitude: -53.08,
      locationType: "Cultural Site",
      yearEstablished: 1497,
      historicalNotes: "John Cabot's landfall site (traditional). On June 24, 1497 (St. John the Baptist Day), Cabot likely saw this coast and claimed it for Henry VII. The exact landing spot is debated—Cape Breton also claims the honor.",
      waterwayId: waterwayMap.get("Bonavista Bay"),
    },
    {
      name: "Cartier's Cross at Gaspé",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The site where Jacques Cartier erected a 30-foot wooden cross on July 24, 1534, claiming the land for France. Chief Donnacona's protest at this event marked the beginning of complex French-Indigenous relations.",
      latitude: 48.84,
      longitude: -64.49,
      locationType: "Cultural Site",
      yearEstablished: 1534,
      historicalNotes: "Cartier's cross bore the words 'Vive le Roi de France.' Chief Donnacona made clear through gestures that the land belonged to his people. Cartier kidnapped Donnacona's sons Domagaya and Taignoagny, taking them to France.",
      waterwayId: waterwayMap.get("Gaspé Bay"),
    },
    {
      name: "Port-Royal (Habitation)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The site of the first permanent European settlement north of Florida, established by Pierre Dugua de Mons and Samuel de Champlain in 1605. The habitation included North America's first social club, the Order of Good Cheer.",
      latitude: 44.7,
      longitude: -65.6,
      locationType: "Settlement",
      yearEstablished: 1605,
      historicalNotes: "Founded in 1605, abandoned 1607, re-established 1610. The first agricultural settlement in Canada. Marc Lescarbot wrote the first play performed in North America here (1606). Destroyed by Virginians in 1613.",
      waterwayId: waterwayMap.get("Bay of Fundy") || waterwayMap.get("St. Lawrence River"),
    },
    {
      name: "Red Bay Basque Whaling Station",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A 16th-century Basque whaling station on the southern coast of Labrador. At its peak in the 1560s, up to 2,000 men worked here each summer, processing whale oil in massive tryworks. Now a UNESCO World Heritage Site.",
      latitude: 51.73,
      longitude: -56.43,
      locationType: "Settlement",
      yearEstablished: 1530,
      historicalNotes: "The world's largest whaling port in the 1500s. Basque whalers from Spain and France hunted right and bowhead whales. The galleon San Juan sank here in 1565 with a full cargo of whale oil. Over 140,000 whales were processed during the station's operation.",
      waterwayId: waterwayMap.get("Strait of Belle Isle"),
    },
    // West Coast
    {
      name: "Friendly Cove Landing (Cook's Landing)",
      indigenousName: "Yuquot",
      indigenousLanguage: "Nuu-chah-nulth",
      description: "The site where Captain James Cook's ships Resolution and Discovery anchored for nearly a month in April 1778. Cook's men traded with Chief Maquinna's people and made repairs to their ships. This was the first significant European contact on Canada's west coast.",
      latitude: 49.59,
      longitude: -126.61,
      locationType: "Cultural Site",
      yearEstablished: 1778,
      historicalNotes: "Cook arrived March 29, 1778, and stayed until April 26. His crew traded iron and brass for sea otter pelts, not realizing their value. When these pelts sold for enormous prices in China, the maritime fur trade began. Cook was killed in Hawaii ten months later.",
      waterwayId: waterwayMap.get("Nootka Sound") || waterwayMap.get("Friendly Cove (Yuquot)"),
    },
    {
      name: "Spanish Banks Beach",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A series of beaches in Vancouver named by Captain George Vancouver to commemorate his friendly meeting with Spanish explorers Galiano and Valdés on June 22, 1792. The meeting demonstrated that exploration could be cooperative rather than competitive.",
      latitude: 49.27,
      longitude: -123.22,
      locationType: "Cultural Site",
      yearEstablished: 1792,
      historicalNotes: "Vancouver's ships (Discovery and Chatham) met the Spanish schooners Sutil and Mexicana here. The explorers shared charts and information, then sailed together through the Strait of Georgia. Vancouver named the spot to honor Spanish courtesy.",
      waterwayId: waterwayMap.get("English Bay"),
    },
    {
      name: "Fort San Miguel (Spanish Fort at Nootka)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "Spanish fort established at Friendly Cove in 1789 by Esteban José Martínez. The seizure of British ships here caused the 'Nootka Crisis' that nearly led to war between Spain and Britain. The fort was the first European settlement on Canada's west coast.",
      latitude: 49.59,
      longitude: -126.61,
      locationType: "Fort",
      yearEstablished: 1789,
      historicalNotes: "Martínez arrested British traders and seized their ships in 1789, claiming Spanish sovereignty. The crisis was resolved by the Nootka Conventions (1790-1794). Bodega y Quadra commanded the fort during negotiations with Vancouver in 1792.",
      waterwayId: waterwayMap.get("Nootka Sound") || waterwayMap.get("Friendly Cove (Yuquot)"),
    },
    {
      name: "Bligh Island (Nootka Sound)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "An island in Nootka Sound named after William Bligh, who served as sailing master on Cook's third voyage. Bligh later became famous for the Bounty mutiny. The island is now part of a provincial marine park.",
      latitude: 49.63,
      longitude: -126.55,
      locationType: "Cultural Site",
      yearEstablished: 1778,
      historicalNotes: "Named to honor William Bligh's service under Cook in 1778. Bligh was responsible for navigation and chart-making. His skills were legendary—after the Bounty mutiny (1789), he navigated 6,700 km in an open boat.",
      waterwayId: waterwayMap.get("Nootka Sound"),
    },
    {
      name: "La Pérouse Memorial (Lituya Bay)",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A cenotaph on Cenotaph Island in Lituya Bay commemorating 21 French sailors who drowned when their boats were caught in the bay's treacherous tidal currents on July 13, 1786, during La Pérouse's expedition.",
      latitude: 58.64,
      longitude: -137.60,
      locationType: "Cultural Site",
      yearEstablished: 1786,
      historicalNotes: "La Pérouse called the bay 'Port des Français.' The tragedy occurred when two boats were swept out by extreme tidal currents. La Pérouse wrote movingly of the loss. The expedition itself disappeared in the Solomon Islands two years later.",
      waterwayId: waterwayMap.get("Lituya Bay"),
    },
    {
      name: "Point Grey (Vancouver Meeting Point)",
      indigenousName: "Ulksen",
      indigenousLanguage: "Musqueam",
      description: "A point of land at the entrance to English Bay where Vancouver first encountered the Spanish ships. Named by Vancouver for his friend Captain George Grey. The area has been Musqueam territory for thousands of years.",
      latitude: 49.27,
      longitude: -123.26,
      locationType: "Cultural Site",
      yearEstablished: 1792,
      historicalNotes: "On June 21, 1792, Vancouver's boats exploring Burrard Inlet encountered Galiano and Valdés here. The next day at Spanish Banks, the commanders met and agreed to share information. Vancouver's survey continued through the Georgia Strait.",
      waterwayId: waterwayMap.get("English Bay"),
    },
    {
      name: "Desolation Sound",
      indigenousName: "Klahoose Territory",
      indigenousLanguage: "Mainland Comox",
      description: "A sound at the northern end of the Strait of Georgia, named by Captain Vancouver in 1792 because of its lack of fish and seemingly barren shores. Ironically, it is now one of BC's most popular marine parks.",
      latitude: 50.08,
      longitude: -124.73,
      locationType: "Cultural Site",
      yearEstablished: 1792,
      historicalNotes: "Vancouver named it June 27, 1792, writing: 'There was not a single prospect that was pleasing to the eye...our residence here was truly forlorn.' His crew was tired and supplies were low. Modern visitors find it beautiful.",
      waterwayId: waterwayMap.get("Georgia Strait"),
    },
    {
      name: "Columbia River Mouth (Chinook Point)",
      indigenousName: "Wimahl",
      indigenousLanguage: "Chinook",
      description: "The mouth of the Columbia River, first entered by American captain Robert Gray in May 1792. Spanish explorer Heceta had sighted the entrance in 1775 but could not enter. The river became the key to American claims in the Oregon Territory.",
      latitude: 46.25,
      longitude: -124.05,
      locationType: "Cultural Site",
      yearEstablished: 1792,
      historicalNotes: "Robert Gray crossed the dangerous bar on May 11, 1792, naming the river after his ship. He traded with Chinook people for nine days. George Vancouver's lieutenant Broughton explored 160 km upriver later that year, claiming it for Britain.",
      waterwayId: waterwayMap.get("Columbia River"),
    },
  ];

  for (const site of landingSites) {
    if (!site.waterwayId) {
      console.log(`  ⚠️ Skipping ${site.name} - no waterway found`);
      continue;
    }

    const existing = await prisma.location.findFirst({
      where: { name: site.name }
    });

    // Create data object with confirmed waterwayId
    const siteData = {
      name: site.name,
      indigenousName: site.indigenousName,
      indigenousLanguage: site.indigenousLanguage,
      description: site.description,
      latitude: site.latitude,
      longitude: site.longitude,
      locationType: site.locationType,
      yearEstablished: site.yearEstablished,
      historicalNotes: site.historicalNotes,
      waterwayId: site.waterwayId, // Guaranteed to be string after check above
    };

    if (!existing) {
      await prisma.location.create({ data: siteData });
      console.log(`  ✅ Added ${site.name}`);
    } else {
      await prisma.location.update({
        where: { id: existing.id },
        data: siteData
      });
      console.log(`  ✅ Updated ${site.name}`);
    }
  }

  // ==================== LINK EXPLORERS TO WATERWAYS ====================
  console.log("\n🔗 Linking maritime explorers to waterways...");

  const explorers = await prisma.explorer.findMany();
  const explorerMap = new Map(explorers.map(e => [e.name, e.id]));

  // Refresh waterway map with new waterways
  const allWaterways = await prisma.waterway.findMany();
  const allWaterwayMap = new Map(allWaterways.map(w => [w.name, w.id]));

  const maritimeLinks = [
    // John Cabot
    { explorer: "John Cabot (Giovanni Caboto)", waterway: "Bonavista Bay", year: 1497, notes: "Traditional site of first landfall on June 24, 1497. Cabot claimed the land for Henry VII of England and reported abundant cod." },
    { explorer: "John Cabot (Giovanni Caboto)", waterway: "Strait of Belle Isle", year: 1497, notes: "Likely sailed through or near the strait during his exploration of the Newfoundland coast." },

    // Jacques Cartier
    { explorer: "Jacques Cartier", waterway: "Baie des Chaleurs", year: 1534, notes: "Named the bay July 7, 1534 due to warm weather. First recorded European-Mi'kmaq contact and trade." },
    { explorer: "Jacques Cartier", waterway: "Gaspé Bay", year: 1534, notes: "Erected a cross claiming the land for France on July 24, 1534. Chief Donnacona protested." },
    { explorer: "Jacques Cartier", waterway: "St. Lawrence River", year: 1535, notes: "Second voyage (1535-1536). Sailed up the St. Lawrence to Stadacona (Quebec City) and Hochelaga (Montreal)." },

    // Spanish Explorers
    { explorer: "Juan Pérez", waterway: "Nootka Sound", year: 1774, notes: "First European to reach Nootka Sound (August 8, 1774). Traded with Nuu-chah-nulth from his ship but did not land." },
    { explorer: "Juan Pérez", waterway: "Queen Charlotte Sound", year: 1774, notes: "Explored the waters near Haida Gwaii, making first European contact with the Haida." },
    { explorer: "Bruno de Heceta (Hezeta)", waterway: "Columbia River", year: 1775, notes: "First European to sight the Columbia River mouth (August 17, 1775), though strong currents prevented entry." },
    { explorer: "Juan Francisco de la Bodega y Quadra", waterway: "Nootka Sound", year: 1775, notes: "Reached Nootka on first expedition (1775). Returned as Spanish commandant in 1789-1794." },
    { explorer: "Juan Francisco de la Bodega y Quadra", waterway: "Queen Charlotte Sound", year: 1775, notes: "Explored the northern coast on his 1775 and 1779 expeditions." },

    // Captain Cook
    { explorer: "Captain James Cook", waterway: "Nootka Sound", year: 1778, notes: "Arrived March 29, 1778, and stayed nearly a month. First sustained European contact on the northwest coast. His crew's sea otter pelts sparked the maritime fur trade." },
    { explorer: "Captain James Cook", waterway: "Juan de Fuca Strait", year: 1778, notes: "Sailed past the strait entrance in March 1778 but did not explore it, believing it was not the Northwest Passage." },

    // Vancouver's expedition
    { explorer: "Captain George Vancouver", waterway: "Nootka Sound", year: 1792, notes: "Met with Bodega y Quadra to negotiate resolution of the Nootka Crisis. Named 'Quadra's and Vancouver's Island.'" },
    { explorer: "Captain George Vancouver", waterway: "Burrard Inlet", year: 1792, notes: "Explored the inlet June 13, 1792, naming it after his friend Sir Harry Burrard." },
    { explorer: "Captain George Vancouver", waterway: "English Bay", year: 1792, notes: "Named Spanish Banks here after meeting Galiano and Valdés on June 22, 1792." },
    { explorer: "Captain George Vancouver", waterway: "Juan de Fuca Strait", year: 1792, notes: "Extensively surveyed the strait and its inlets in 1792." },
    { explorer: "Captain George Vancouver", waterway: "Georgia Strait", year: 1792, notes: "Named after King George III. Circumnavigated Vancouver Island to prove it was an island." },
    { explorer: "Captain George Vancouver", waterway: "Queen Charlotte Sound", year: 1792, notes: "Named after HMS Queen Charlotte during his surveys of the coast." },

    // Bligh
    { explorer: "William Bligh", waterway: "Nootka Sound", year: 1778, notes: "Served as sailing master under Cook. Bligh Island in Nootka Sound is named after him." },

    // Spanish 1792 expedition
    { explorer: "Dionisio Alcalá Galiano", waterway: "Georgia Strait", year: 1792, notes: "Circumnavigated Vancouver Island with Valdés. Met Vancouver at Spanish Banks." },
    { explorer: "Dionisio Alcalá Galiano", waterway: "English Bay", year: 1792, notes: "Met Vancouver at Point Grey on June 21-22, 1792. Shared charts and sailed together." },
    { explorer: "Cayetano Valdés", waterway: "Georgia Strait", year: 1792, notes: "Co-commanded with Galiano. Together they completed the first circumnavigation of Vancouver Island by Europeans." },
    { explorer: "Cayetano Valdés", waterway: "English Bay", year: 1792, notes: "Present at the meeting with Vancouver that resulted in the naming of Spanish Banks." },
    { explorer: "José María Narváez", waterway: "Georgia Strait", year: 1791, notes: "First European to explore the Strait of Georgia (July 1791). Surveyed much of the inland waters." },
    { explorer: "José María Narváez", waterway: "Juan de Fuca Strait", year: 1791, notes: "Explored the eastern reaches of the strait before entering the Strait of Georgia." },

    // La Pérouse
    { explorer: "Jean-François de Galaup, comte de La Pérouse", waterway: "Lituya Bay", year: 1786, notes: "Landed July 2, 1786. Lost 21 men to tidal currents on July 13. Erected a memorial on Cenotaph Island." },

    // Russians
    { explorer: "Vitus Bering", waterway: "Queen Charlotte Sound", year: 1741, notes: "Approached Alaska coast from the west. His expedition's sea otter pelts sparked Russian interest." },
    { explorer: "Aleksei Chirikov", waterway: "Queen Charlotte Sound", year: 1741, notes: "First European to sight the northwest coast from the sea (July 15, 1741). Lost 21 men in mysterious circumstances." },

    // Robert Gray
    { explorer: "Robert Gray", waterway: "Columbia River", year: 1792, notes: "First European to enter the Columbia River (May 11, 1792). Named it after his ship. Traded with Chinook people." },
    { explorer: "Robert Gray", waterway: "Nootka Sound", year: 1789, notes: "First American to visit Nootka Sound (1789). Returned in 1792 before discovering the Columbia." },
  ];

  for (const link of maritimeLinks) {
    const explorerId = explorerMap.get(link.explorer);
    const waterwayId = allWaterwayMap.get(link.waterway);

    if (explorerId && waterwayId) {
      const existing = await prisma.explorerWaterway.findFirst({
        where: { explorerId, waterwayId }
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
        await prisma.explorerWaterway.update({
          where: { id: existing.id },
          data: {
            yearExplored: link.year,
            expeditionNotes: link.notes,
          }
        });
        console.log(`  ✅ Updated ${link.explorer} → ${link.waterway} (${link.year})`);
      }
    } else {
      if (!explorerId) console.log(`  ⚠️ Explorer not found: ${link.explorer}`);
      if (!waterwayId) console.log(`  ⚠️ Waterway not found: ${link.waterway}`);
    }
  }

  console.log("\n🎉 Maritime exploration data complete!");

  // Print summary
  const explorerCount = await prisma.explorer.count();
  const waterwayCount = await prisma.waterway.count();
  const locationCount = await prisma.location.count();
  const linkCount = await prisma.explorerWaterway.count();

  console.log(`\nSummary:`);
  console.log(`  - ${explorerCount} total explorers`);
  console.log(`  - ${waterwayCount} waterways (including coastal)`);
  console.log(`  - ${locationCount} historic locations`);
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
