/**
 * Seed file to add historical imagery throughout the application
 *
 * All images are sourced from Wikimedia Commons with appropriate licenses:
 * - Public Domain (PD) - works published before 1928 or by government
 * - CC BY-SA 4.0/3.0/2.0
 * - CC BY 4.0/3.0/2.0
 *
 * This seed adds:
 * 1. Bloody Falls massacre location and event with imagery
 * 2. La Vérendrye massacre (Lake of the Woods) event with imagery
 * 3. Images to existing explorers
 * 4. Images to existing historical events
 * 5. New historical events with imagery
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==================== IMAGE CONSTANTS ====================
// All images from Wikimedia Commons - Public Domain or CC licensed

const IMAGES = {
  // Explorer portraits
  SAMUEL_HEARNE: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Samuel_Hearne.jpg/800px-Samuel_Hearne.jpg",
  HEARNE_JOURNEY_MAP: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/A_Journey_from_Prince_of_Wales%27s_Fort_in_Hudson%27s_Bay_to_the_Northern_Ocean_1769%2C_1770%2C_1771%2C_1772_%28IA_journeyfromPrinc00hear%29.pdf/page1-800px-A_Journey_from_Prince_of_Wales%27s_Fort_in_Hudson%27s_Bay_to_the_Northern_Ocean_1769%2C_1770%2C_1771%2C_1772_%28IA_journeyfromPrinc00hear%29.pdf.jpg",

  LA_VERENDRYE: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/La_V%C3%A9rendrye.jpg/800px-La_V%C3%A9rendrye.jpg",

  MATONABBEE: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Matonabbee.jpg/800px-Matonabbee.jpg",

  HENRY_KELSEY: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Henry_Kelsey.jpg/800px-Henry_Kelsey.jpg",

  RADISSON_GROSEILLIERS: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Radisson_and_Groseilliers.jpg/800px-Radisson_and_Groseilliers.jpg",

  ETIENNE_BRULE: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/%C3%89tienne_Br%C3%BBl%C3%A9.jpg/800px-%C3%89tienne_Br%C3%BBl%C3%A9.jpg",

  JACQUES_MARQUETTE: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Jacques_Marquette.jpg/800px-Jacques_Marquette.jpg",

  LOUIS_JOLLIET: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Louis_Jolliet.jpg/800px-Louis_Jolliet.jpg",

  LA_SALLE: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Cavelier_de_la_Salle.png/800px-Cavelier_de_la_Salle.png",

  SIMON_FRASER: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Simon_Fraser_%28explorer%29.jpg/800px-Simon_Fraser_%28explorer%29.jpg",

  GEORGE_VANCOUVER: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/George_Vancouver_portrait.jpg/800px-George_Vancouver_portrait.jpg",

  JAMES_COOK: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Captainjamescookportrait.jpg/800px-Captainjamescookportrait.jpg",

  MARTIN_FROBISHER: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sir_Martin_Frobisher_by_Cornelis_Ketel.jpg/800px-Sir_Martin_Frobisher_by_Cornelis_Ketel.jpg",

  ROALD_AMUNDSEN: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Amundsen_in_fur_skins.jpg/800px-Amundsen_in_fur_skins.jpg",

  // Historical locations/scenes
  COPPERMINE_RIVER: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Coppermine_River.jpg/1280px-Coppermine_River.jpg",

  PRINCE_OF_WALES_FORT: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",

  YORK_FACTORY: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",

  FORT_WILLIAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",

  LAKE_OF_THE_WOODS: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Lake_of_the_Woods_aerial.jpg/1280px-Lake_of_the_Woods_aerial.jpg",

  FORT_ST_CHARLES_MEMORIAL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Fort_St._Charles.jpg/1280px-Fort_St._Charles.jpg",

  // Fur trade scenes
  VOYAGEURS_CANOE: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg/1280px-Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg",

  FUR_TRADERS: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Fur_Traders_Descending_the_Missouri.jpg/1280px-Fur_Traders_Descending_the_Missouri.jpg",

  CANOE_MANNED_BY_VOYAGEURS: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg/1280px-Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg",

  SHOOTING_THE_RAPIDS: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg/1280px-Shooting_the_Rapids%2C_by_Frances_Anne_Hopkins.jpg",

  // Indigenous leaders
  CROWFOOT: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Crowfoot.jpg/800px-Crowfoot.jpg",

  POUNDMAKER: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Poundmaker.jpg/800px-Poundmaker.jpg",

  BIG_BEAR: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Big_Bear_%28Cree_leader%29.jpg/800px-Big_Bear_%28Cree_leader%29.jpg",

  TECUMSEH: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tecumseh02.jpg/800px-Tecumseh02.jpg",

  SITTING_BULL: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sitting_Bull.jpg/800px-Sitting_Bull.jpg",

  // Arctic exploration
  HMS_EREBUS: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg/1280px-HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg",

  FRANKLIN_EXPEDITION: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Franklin%27s_lost_expedition.png/1280px-Franklin%27s_lost_expedition.png",

  // Battle scenes / Historical events
  PLAINS_OF_ABRAHAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Death_of_General_Wolfe.jpg/1280px-Death_of_General_Wolfe.jpg",

  BATTLE_OF_SEVEN_OAKS: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/BattleofSevenOaks1.jpg/1280px-BattleofSevenOaks1.jpg",

  LOUISBOURG: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Siege_of_Louisbourg_1758.jpg/1280px-Siege_of_Louisbourg_1758.jpg",

  // Treaty signing
  TREATY_SIGNING: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Treaty_negotiation.jpg/1280px-Treaty_negotiation.jpg",

  // Settlements
  QUEBEC_CITY_HISTORIC: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/QuebecCity_ChateauFrontenac1.jpg/1280px-QuebecCity_ChateauFrontenac1.jpg",

  MONTREAL_HISTORIC: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Montreal_1889.jpg/1280px-Montreal_1889.jpg",

  RED_RIVER_SETTLEMENT: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Red_river_1822.jpg/1280px-Red_river_1822.jpg",

  // HBC posts and scenes
  HBC_TRADING_POST: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fort_William_Historical_Park_%286021299353%29.jpg/1280px-Fort_William_Historical_Park_%286021299353%29.jpg",

  HBC_SHIP_IN_ICE: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/A_Ship_of_the_Hudson%27s_Bay_Company_in_the_Ice.jpg/1280px-A_Ship_of_the_Hudson%27s_Bay_Company_in_the_Ice.jpg",

  // Cartography
  THOMPSON_MAP: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/David_Thompson_Map.jpg/1280px-David_Thompson_Map.jpg",

  ARROWSMITH_MAP: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/1814_Arrowsmith_Map_of_North_America.jpg/1280px-1814_Arrowsmith_Map_of_North_America.jpg",
};

async function seedHistoricalImagery() {
  console.log("=== Seeding Historical Imagery ===\n");

  // ==================== 1. ADD BLOODY FALLS MASSACRE ====================
  console.log("Adding Bloody Falls massacre...\n");

  // First, find or create the Coppermine River waterway
  let coppermineWaterway = await prisma.waterway.findFirst({
    where: { name: { contains: "Coppermine" } }
  });

  if (!coppermineWaterway) {
    // First, find or create the river type
    let riverType = await prisma.waterwayType.findFirst({
      where: { name: "river" }
    });
    if (!riverType) {
      riverType = await prisma.waterwayType.create({
        data: { name: "river" }
      });
    }

    coppermineWaterway = await prisma.waterway.create({
      data: {
        name: "Coppermine River",
        indigenousName: "Kugluktuk (at mouth)",
        indigenousLanguage: "Inuinnaqtun",
        description: "The Coppermine River flows 845 km from Lac de Gras in the Northwest Territories to the Arctic Ocean at Coronation Gulf near Kugluktuk, Nunavut. It was the destination of Samuel Hearne's famous 1770-1772 expedition seeking copper deposits. The river passes through Kugluk/Bloody Falls Territorial Park, site of the 1771 massacre. The name Coppermine refers to the copper deposits found near its mouth, which had been traded by Indigenous peoples for centuries.",
        typeId: riverType.id,
        regionName: "Arctic",
        historicalSignificance: "Destination of Samuel Hearne's landmark overland expedition to the Arctic Ocean (1770-1772). Site of the Bloody Falls Massacre (1771). Traditional territory of the Copper Inuit (Kogluktogmiut). Source of native copper traded across the Arctic for millennia.",
        latitude: 67.8167,
        longitude: -115.0833,
      }
    });
    console.log("  Created Coppermine River waterway");
  }

  // Create Bloody Falls location
  const bloodyFallsLocation = await prisma.location.upsert({
    where: { id: "bloody_falls_location" },
    update: {},
    create: {
      id: "bloody_falls_location",
      name: "Bloody Falls",
      indigenousName: "Kugluk",
      indigenousLanguage: "Inuinnaqtun",
      description: "Kugluk/Bloody Falls is a series of rapids on the Coppermine River, approximately 15 km upstream from its mouth at Coronation Gulf. Now protected within Kugluk/Bloody Falls Territorial Park, the site has been continuously occupied for at least 7,000 years. The falls were named by Samuel Hearne after witnessing the massacre of a group of Copper Inuit by his Chipewyan guides on July 17, 1771. Today, the site serves as a place of reconciliation - in 1996, Inuit and Dene representatives held a sacred healing ceremony here.",
      latitude: 67.7333,
      longitude: -115.3333,
      locationType: "historic_site",
      yearEstablished: 1771,
      historicalNotes: "Site of the Bloody Falls Massacre (July 17, 1771). Designated a National Historic Site in 1978. Located within Kugluk/Bloody Falls Territorial Park. Archaeological evidence of 7,000 years of continuous occupation. Site of 1996 Inuit-Dene reconciliation ceremony.",
      waterwayId: coppermineWaterway.id,
    }
  });
  console.log("  Created/updated Bloody Falls location");

  // Create the Bloody Falls Massacre historical event
  await prisma.historicalEvent.upsert({
    where: { id: "bloody_falls_massacre_1771" },
    update: {
      imageUrl: IMAGES.SAMUEL_HEARNE,
    },
    create: {
      id: "bloody_falls_massacre_1771",
      title: "Bloody Falls Massacre",
      description: `On July 17, 1771, Samuel Hearne witnessed a devastating attack by his Chipewyan and Yellowknife Dene guides on a group of Copper Inuit camped at the falls on the Coppermine River. Led by Matonabbee, approximately 60 Dene warriors attacked the sleeping Inuit camp just after midnight, killing approximately 20 men, women, and children. Hearne was powerless to intervene and later wrote a traumatic account of the event.

Hearne recorded: "The shrieks and groans of the poor expiring wretches were truly dreadful... I am confident that my features must have feelingly expressed how sincerely I was affected at the barbarous scene I then witnessed; even at this hour I cannot reflect on the transactions of that horrid day without shedding tears."

The massacre reflected longstanding conflicts between the Dene and Inuit peoples over territory and resources. Some historians have questioned whether Hearne exaggerated or even invented aspects of his account, as his original field notes are lost and the published narrative was edited after his death.

In 1996, Inuit and Dene leaders held a reconciliation ceremony at Bloody Falls, symbolically healing the wounds of the past.`,
      latitude: 67.7333,
      longitude: -115.3333,
      locationName: "Bloody Falls, Coppermine River, Nunavut",
      year: 1771,
      month: 7,
      day: 17,
      isApproximate: false,
      category: "battle",
      significance: "major",
      imageUrl: IMAGES.SAMUEL_HEARNE,
      locationId: bloodyFallsLocation.id,
      waterwayId: coppermineWaterway.id,
    }
  });
  console.log("  Created/updated Bloody Falls Massacre event");

  // ==================== 2. ADD LA VÉRENDRYE MASSACRE (LAKE OF THE WOODS) ====================
  console.log("\nAdding La Vérendrye massacre (Lake of the Woods)...\n");

  // Find Lake of the Woods waterway
  let lakeOfTheWoods = await prisma.waterway.findFirst({
    where: { name: { contains: "Lake of the Woods" } }
  });

  if (!lakeOfTheWoods) {
    // First, find or create the lake type
    let lakeType = await prisma.waterwayType.findFirst({
      where: { name: "lake" }
    });
    if (!lakeType) {
      lakeType = await prisma.waterwayType.create({
        data: { name: "lake" }
      });
    }

    lakeOfTheWoods = await prisma.waterway.create({
      data: {
        name: "Lake of the Woods",
        indigenousName: "Lake of the Island of the Golden Sands (Ojibwe)",
        indigenousLanguage: "Ojibwe",
        description: "Lake of the Woods is a large lake straddling the Canada-US border in Ontario, Manitoba, and Minnesota. It has over 14,500 islands and covers 4,350 square kilometers. The lake was a crucial junction in the fur trade route from Montreal to the western interior. Fort St. Charles, established by La Vérendrye in 1732, served as a key base for western exploration.",
        typeId: lakeType.id,
        regionName: "Great Lakes/Prairies",
        historicalSignificance: "Site of Fort St. Charles (1732-1763). Location of the 1736 massacre of Jean-Baptiste de La Vérendrye, Father Aulneau, and 19 voyageurs. Key junction on the Montreal-to-the-West fur trade route.",
        latitude: 49.3333,
        longitude: -94.75,
      }
    });
    console.log("  Created Lake of the Woods waterway");
  }

  // Create Massacre Island location
  const massacreIslandLocation = await prisma.location.upsert({
    where: { id: "massacre_island_location" },
    update: {},
    create: {
      id: "massacre_island_location",
      name: "Massacre Island (Lake of the Woods)",
      indigenousName: "Île au Massacre",
      indigenousLanguage: "French",
      description: "A small island in Lake of the Woods, located a few kilometers from Fort St. Charles, where on June 6, 1736, Jean-Baptiste de La Vérendrye (eldest son of explorer Pierre La Vérendrye), Jesuit missionary Father Jean-Pierre Aulneau, and 19 French-Canadian voyageurs were killed by Dakota (Sioux) warriors. The party had departed Fort St. Charles heading to Fort Michilimackinac for supplies when they were ambushed on their first night out. All 21 men were beheaded.",
      latitude: 49.35,
      longitude: -94.8,
      locationType: "historic_site",
      yearEstablished: 1736,
      historicalNotes: "Site of the 1736 massacre. The remains of Father Aulneau and Jean-Baptiste de La Vérendrye were buried at Fort St. Charles and later moved. In 1908, the bones of the 21 victims were discovered by excavators. Father Aulneau's remains are now at St. Boniface Cathedral in Winnipeg.",
      waterwayId: lakeOfTheWoods.id,
    }
  });
  console.log("  Created/updated Massacre Island location");

  // Create Fort St. Charles location
  await prisma.location.upsert({
    where: { id: "fort_st_charles_location" },
    update: {},
    create: {
      id: "fort_st_charles_location",
      name: "Fort St. Charles",
      description: "Fort St. Charles was established by Pierre Gaultier de La Vérendrye in 1732 on the western shore of Lake of the Woods' Northwest Angle. It served as the primary base for La Vérendrye's western explorations and the westernmost point of New France for many years. The fort was the departure point for the ill-fated 1736 expedition. It was abandoned in 1763 after France ceded its North American territories to Britain. The site was rediscovered in 1908, and the remains of the 1736 massacre victims were found beneath the chapel.",
      latitude: 49.3667,
      longitude: -95.15,
      locationType: "fort",
      yearEstablished: 1732,
      historicalNotes: "Established 1732 by La Vérendrye. Westernmost outpost of New France. Base for western exploration. Site of burial of 1736 massacre victims. Abandoned 1763. Rediscovered 1908.",
      waterwayId: lakeOfTheWoods.id,
    }
  });
  console.log("  Created/updated Fort St. Charles location");

  // Create the Lake of the Woods Massacre historical event
  await prisma.historicalEvent.upsert({
    where: { id: "lake_of_the_woods_massacre_1736" },
    update: {
      imageUrl: IMAGES.LA_VERENDRYE,
    },
    create: {
      id: "lake_of_the_woods_massacre_1736",
      title: "Lake of the Woods Massacre",
      description: `On June 6, 1736, a party of 21 Frenchmen was massacred on a small island in Lake of the Woods, just a few kilometers from Fort St. Charles. The victims included Jean-Baptiste Gaultier de La Vérendrye (the eldest son of explorer Pierre La Vérendrye), Jesuit missionary Father Jean-Pierre Aulneau, and 19 French-Canadian voyageurs.

The group had departed Fort St. Charles the previous day, heading to Fort Michilimackinac to obtain badly needed winter supplies. On their first night, camped on what would become known as "Île au Massacre" (Massacre Island), they were attacked by a war party of approximately 100 Dakota (Sioux) warriors.

The attack was retaliation for La Vérendrye's trade alliance with the Dakota's enemies - the Cree and Assiniboine peoples - to whom he had been supplying firearms. The Dakota, led by Chief Sacred Born, had warned La Vérendrye to cease this trade.

All 21 men were killed and beheaded. When the bodies were found days later, Father Aulneau was discovered kneeling with an arrow in his side, his chest split open, and his hands in a position of prayer. The severed heads of the 19 voyageurs were arranged on beaver pelts.

The remains were buried at Fort St. Charles beneath the chapel. In 1908, when the fort ruins were excavated, the bones were rediscovered. Father Aulneau's remains were eventually moved to St. Boniface Cathedral in Winnipeg, where they were interred in 1976, 240 years after his death.`,
      latitude: 49.35,
      longitude: -94.8,
      locationName: "Massacre Island, Lake of the Woods",
      year: 1736,
      month: 6,
      day: 6,
      isApproximate: false,
      category: "battle",
      significance: "major",
      imageUrl: IMAGES.LA_VERENDRYE,
      locationId: massacreIslandLocation.id,
      waterwayId: lakeOfTheWoods.id,
    }
  });
  console.log("  Created/updated Lake of the Woods Massacre event");

  // ==================== 3. UPDATE EXPLORER IMAGES ====================
  console.log("\nUpdating explorer images...\n");

  const explorerImageUpdates = [
    { name: "Samuel Hearne", imageUrl: IMAGES.SAMUEL_HEARNE },
    { name: "Pierre Gaultier de Varennes, sieur de La Vérendrye", imageUrl: IMAGES.LA_VERENDRYE },
    { name: "Pierre La Verendrye", imageUrl: IMAGES.LA_VERENDRYE },
    { name: "La Vérendrye", imageUrl: IMAGES.LA_VERENDRYE },
    { name: "Henry Kelsey", imageUrl: IMAGES.HENRY_KELSEY },
    { name: "Etienne Brule", imageUrl: IMAGES.ETIENNE_BRULE },
    { name: "Étienne Brûlé", imageUrl: IMAGES.ETIENNE_BRULE },
    { name: "Jacques Marquette", imageUrl: IMAGES.JACQUES_MARQUETTE },
    { name: "Father Marquette", imageUrl: IMAGES.JACQUES_MARQUETTE },
    { name: "Louis Jolliet", imageUrl: IMAGES.LOUIS_JOLLIET },
    { name: "Rene-Robert Cavelier, Sieur de La Salle", imageUrl: IMAGES.LA_SALLE },
    { name: "La Salle", imageUrl: IMAGES.LA_SALLE },
    { name: "Simon Fraser", imageUrl: IMAGES.SIMON_FRASER },
    { name: "George Vancouver", imageUrl: IMAGES.GEORGE_VANCOUVER },
    { name: "Captain James Cook", imageUrl: IMAGES.JAMES_COOK },
    { name: "James Cook", imageUrl: IMAGES.JAMES_COOK },
    { name: "Martin Frobisher", imageUrl: IMAGES.MARTIN_FROBISHER },
    { name: "Roald Amundsen", imageUrl: IMAGES.ROALD_AMUNDSEN },
  ];

  for (const update of explorerImageUpdates) {
    const explorer = await prisma.explorer.findFirst({
      where: { name: { contains: update.name.split(" ")[0] } }
    });

    if (explorer) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl: update.imageUrl }
      });
      console.log(`  Updated image for: ${explorer.name}`);
    }
  }

  // ==================== 4. UPDATE HISTORICAL EVENT IMAGES ====================
  console.log("\nUpdating historical event images...\n");

  const eventImageUpdates = [
    { title: "Hearne Reaches Arctic Ocean", imageUrl: IMAGES.SAMUEL_HEARNE },
    { title: "Battle of the Plains of Abraham", imageUrl: IMAGES.PLAINS_OF_ABRAHAM },
    { title: "Battle of Seven Oaks", imageUrl: IMAGES.BATTLE_OF_SEVEN_OAKS },
    { title: "Capture of Louisbourg", imageUrl: IMAGES.LOUISBOURG },
    { title: "Franklin Expedition Departs", imageUrl: IMAGES.FRANKLIN_EXPEDITION },
    { title: "Franklin's Ships Trapped in Ice", imageUrl: IMAGES.HMS_EREBUS },
    { title: "Discovery of HMS Erebus", imageUrl: IMAGES.HMS_EREBUS },
    { title: "Discovery of HMS Terror", imageUrl: IMAGES.HMS_EREBUS },
    { title: "Champlain Founds Quebec City", imageUrl: IMAGES.QUEBEC_CITY_HISTORIC },
    { title: "Fort William Becomes NWC Headquarters", imageUrl: IMAGES.FORT_WILLIAM },
    { title: "Grand Portage Rendezvous", imageUrl: IMAGES.VOYAGEURS_CANOE },
    { title: "Hudson's Bay Company Founded", imageUrl: IMAGES.HBC_SHIP_IN_ICE },
    { title: "North West Company Formed", imageUrl: IMAGES.VOYAGEURS_CANOE },
    { title: "Selkirk Settlers Arrive", imageUrl: IMAGES.RED_RIVER_SETTLEMENT },
    { title: "La Verendrye Builds Fort Rouge", imageUrl: IMAGES.LA_VERENDRYE },
    { title: "Cook Arrives at Nootka Sound", imageUrl: IMAGES.JAMES_COOK },
    { title: "Thompson Reaches the Pacific via Columbia River", imageUrl: IMAGES.THOMPSON_MAP },
    { title: "Amundsen Completes Northwest Passage", imageUrl: IMAGES.ROALD_AMUNDSEN },
    { title: "Frobisher Lands at Baffin Island", imageUrl: IMAGES.MARTIN_FROBISHER },
    { title: "Treaty 6 Signed at Fort Carlton", imageUrl: IMAGES.CROWFOOT },
    { title: "Numbered Treaties Begin (Treaty 1)", imageUrl: IMAGES.TREATY_SIGNING },
  ];

  for (const update of eventImageUpdates) {
    const event = await prisma.historicalEvent.findFirst({
      where: { title: update.title }
    });

    if (event) {
      await prisma.historicalEvent.update({
        where: { id: event.id },
        data: { imageUrl: update.imageUrl }
      });
      console.log(`  Updated image for event: ${update.title}`);
    }
  }

  // ==================== 5. ADD INDIGENOUS LEADER NOTABLE FIGURES ====================
  console.log("\nAdding Indigenous leader notable figures with images...\n");

  const indigenousLeaders = [
    {
      id: "matonabbee_leader",
      name: "Matonabbee",
      figureType: "indigenous_leader",
      role: "Chipewyan Leader and Guide",
      biography: "Matonabbee (c. 1737-1782) was a Chipewyan (Dene) leader and guide who led Samuel Hearne on his successful third expedition to the Arctic Ocean in 1770-1772. Born of a Chipewyan father and possibly a slave woman of Cree descent, Matonabbee was raised partly at Prince of Wales Fort, where he learned to speak Cree and some English. He became the most influential Chipewyan leader of his era, serving as the primary intermediary between his people and the Hudson's Bay Company. After the French captured Prince of Wales Fort in 1782, Matonabbee took his own life, reportedly in despair over the loss of his trade connections.",
      significance: "Led Samuel Hearne's successful Arctic expedition. Principal Chipewyan trading captain for HBC. Master diplomat who negotiated peace between Chipewyan and Cree peoples.",
      imageUrl: IMAGES.MATONABBEE,
      birthYear: 1737,
      deathYear: 1782,
      nation: "Chipewyan (Dene)",
    },
    {
      id: "crowfoot_leader",
      name: "Crowfoot (Isapo-Muxika)",
      figureType: "indigenous_leader",
      role: "Siksika (Blackfoot) Chief",
      biography: "Crowfoot (c. 1830-1890) was a chief of the Siksika (Blackfoot) Nation and one of the most influential Indigenous leaders during the signing of the numbered treaties. Born a Blood (Kainai), he was adopted into the Siksika and rose to become head chief through his wisdom, bravery, and diplomatic skills. He played a crucial role in the signing of Treaty 7 in 1877, though he later expressed regret about how the treaties were implemented. During the 1885 North-West Rebellion, Crowfoot kept his people at peace, a decision that protected them but was controversial among some Indigenous leaders.",
      significance: "Principal chief of the Siksika Nation. Key signatory of Treaty 7 (1877). Maintained peace during the 1885 North-West Rebellion. Renowned for his eloquent speeches and diplomatic wisdom.",
      imageUrl: IMAGES.CROWFOOT,
      birthYear: 1830,
      deathYear: 1890,
      nation: "Siksika (Blackfoot)",
    },
    {
      id: "poundmaker_leader",
      name: "Poundmaker (Pîhtokahanapiwiyin)",
      figureType: "indigenous_leader",
      role: "Plains Cree Chief",
      biography: "Poundmaker (c. 1842-1886) was a chief of the Plains Cree who initially refused to sign Treaty 6 in 1876, concerned about its provisions. He eventually signed in 1879 when conditions for his people became desperate. During the 1885 North-West Rebellion, Poundmaker attempted to maintain peace but was drawn into conflict at the Battle of Cut Knife Hill, where his warriors successfully defended against a Canadian force led by Colonel Otter. Despite his peace efforts, Poundmaker was convicted of treason-felony and imprisoned. He died shortly after his release, his health broken by imprisonment.",
      significance: "Plains Cree chief who questioned Treaty 6 terms. Leader during the 1885 North-West Rebellion. Victor at the Battle of Cut Knife Hill. Symbol of Indigenous resistance and injustice.",
      imageUrl: IMAGES.POUNDMAKER,
      birthYear: 1842,
      deathYear: 1886,
      nation: "Plains Cree",
    },
    {
      id: "big_bear_leader",
      name: "Big Bear (Mistahimaskwa)",
      figureType: "indigenous_leader",
      role: "Plains Cree Chief",
      biography: "Big Bear (c. 1825-1888) was a Plains Cree chief who resisted signing Treaty 6, holding out until 1882. He foresaw that the treaties would destroy his people's way of life and fought to maintain their independence. During the 1885 North-West Rebellion, warriors from his band participated in the Frog Lake Massacre, though Big Bear personally opposed the violence and worked to protect white captives. He was convicted of treason-felony and imprisoned, dying shortly after his release in 1888.",
      significance: "Resisted Treaty 6 for six years. Prophetic warnings about treaty consequences. Worked to protect captives during the 1885 Rebellion despite being blamed for violence. Symbol of resistance to colonization.",
      imageUrl: IMAGES.BIG_BEAR,
      birthYear: 1825,
      deathYear: 1888,
      nation: "Plains Cree",
    },
  ];

  for (const leader of indigenousLeaders) {
    await prisma.notableFigure.upsert({
      where: { id: leader.id },
      update: {
        name: leader.name,
        biography: leader.biography,
        significance: leader.significance,
        imageUrl: leader.imageUrl,
      },
      create: leader,
    });
    console.log(`  Added/updated notable figure: ${leader.name}`);
  }

  // ==================== 6. ADD ADDITIONAL HISTORICAL EVENTS WITH IMAGERY ====================
  console.log("\nAdding additional historical events with imagery...\n");

  const additionalEvents = [
    {
      id: "hearne_first_expedition_1769",
      title: "Hearne's First Arctic Expedition Begins",
      description: "On November 6, 1769, Samuel Hearne departed Fort Prince of Wales on his first attempt to find the copper mines reported by Indigenous traders and to search for a Northwest Passage. Guided by Chipewyan who abandoned him, Hearne was forced to return after only 200 miles. This first attempt taught him valuable lessons about Arctic travel and the importance of Indigenous guides.",
      latitude: 58.7982,
      longitude: -94.1639,
      locationName: "Fort Prince of Wales, Churchill, Manitoba",
      year: 1769,
      month: 11,
      day: 6,
      isApproximate: false,
      category: "exploration",
      significance: "normal",
      imageUrl: IMAGES.PRINCE_OF_WALES_FORT,
    },
    {
      id: "hearne_second_expedition_1770",
      title: "Hearne's Second Arctic Expedition",
      description: "Samuel Hearne set out on his second expedition on February 23, 1770. This attempt also failed when his quadrant was broken, making navigation impossible. However, during this journey he met Matonabbee, the influential Chipewyan leader who would become his guide and mentor for the successful third expedition.",
      latitude: 58.7982,
      longitude: -94.1639,
      locationName: "Fort Prince of Wales, Churchill, Manitoba",
      year: 1770,
      month: 2,
      day: 23,
      isApproximate: false,
      category: "exploration",
      significance: "normal",
      imageUrl: IMAGES.SAMUEL_HEARNE,
    },
    {
      id: "hearne_third_expedition_1770",
      title: "Hearne's Successful Third Expedition Begins",
      description: "On December 7, 1770, Samuel Hearne set out on his third and ultimately successful expedition to the Arctic Ocean. This time he was guided by Matonabbee, who insisted on bringing women to do the essential work of making camps, preparing food, and repairing clothing. The expedition would cover approximately 5,600 kilometers over 18 months.",
      latitude: 58.7982,
      longitude: -94.1639,
      locationName: "Fort Prince of Wales, Churchill, Manitoba",
      year: 1770,
      month: 12,
      day: 7,
      isApproximate: false,
      category: "exploration",
      significance: "major",
      imageUrl: IMAGES.SAMUEL_HEARNE,
    },
    {
      id: "surrender_prince_of_wales_fort_1782",
      title: "Surrender of Prince of Wales Fort",
      description: "On August 8, 1782, Samuel Hearne surrendered Prince of Wales Fort to the French naval squadron under Admiral La Pérouse without a fight. The massive stone fort, which had taken 40 years to build, was defended by only 39 men against 400 French sailors and marines. The French destroyed the fort's walls and cannons before departing. Upon learning of the fort's capture, Matonabbee killed himself and his six wives, reportedly in despair over the loss of his trading partner.",
      latitude: 58.7982,
      longitude: -94.1639,
      locationName: "Prince of Wales Fort, Churchill, Manitoba",
      year: 1782,
      month: 8,
      day: 8,
      isApproximate: false,
      category: "battle",
      significance: "major",
      imageUrl: IMAGES.PRINCE_OF_WALES_FORT,
    },
    {
      id: "la_verendrye_reaches_lake_winnipeg_1733",
      title: "La Vérendrye Reaches Lake Winnipeg",
      description: "In September 1733, Pierre La Vérendrye reached Lake Winnipeg, becoming the first European to see this vast body of water. He established Fort Maurepas at the mouth of the Red River, opening the door to western exploration. La Vérendrye's journeys were driven by his quest for the 'Western Sea' (Pacific Ocean) and the expansion of the French fur trade.",
      latitude: 50.4,
      longitude: -96.9,
      locationName: "Lake Winnipeg, Manitoba",
      year: 1733,
      month: 9,
      isApproximate: true,
      category: "exploration",
      significance: "major",
      imageUrl: IMAGES.LA_VERENDRYE,
    },
    {
      id: "voyageur_great_rendezvous_1793",
      title: "A Voyageur Great Rendezvous",
      description: "Each summer, voyageurs from Montreal (called 'mangeurs de lard' or pork eaters) met wintering partners from the interior (called 'hommes du nord' or northmen) at Grand Portage, and later Fort William. The 1793 rendezvous was particularly significant as it occurred during a peak period of the fur trade, with hundreds of voyageurs gathering to exchange furs for trade goods, renew contracts, and celebrate with feasting, drinking, and competitions.",
      latitude: 48.3809,
      longitude: -89.2477,
      locationName: "Fort William, Thunder Bay, Ontario",
      year: 1793,
      isApproximate: true,
      category: "fur_trade",
      significance: "normal",
      imageUrl: IMAGES.VOYAGEURS_CANOE,
    },
    {
      id: "1996_bloody_falls_reconciliation",
      title: "Bloody Falls Reconciliation Ceremony",
      description: "In 1996, Inuit and Dene leaders gathered at Bloody Falls for a sacred reconciliation ceremony, symbolically healing the wounds from the 1771 massacre. This event represented a significant moment of Indigenous reconciliation, as descendants of both the Chipewyan attackers and the Copper Inuit victims came together in ceremony. The gathering acknowledged the historical trauma while looking toward a shared future of understanding and respect.",
      latitude: 67.7333,
      longitude: -115.3333,
      locationName: "Bloody Falls, Coppermine River, Nunavut",
      year: 1996,
      isApproximate: true,
      category: "indigenous",
      significance: "major",
      imageUrl: IMAGES.COPPERMINE_RIVER,
    },
    {
      id: "fort_st_charles_rediscovery_1908",
      title: "Rediscovery of Fort St. Charles",
      description: "In 1908, excavators led by Joseph Blain discovered the ruins of Fort St. Charles on Lake of the Woods. Beneath the remains of the chapel, they found the bones of the 21 men killed in the 1736 massacre, including Father Aulneau and Jean-Baptiste de La Vérendrye. The discovery sparked renewed interest in the La Vérendrye expeditions and led to the eventual reburial of Father Aulneau's remains at St. Boniface Cathedral in Winnipeg.",
      latitude: 49.3667,
      longitude: -95.15,
      locationName: "Fort St. Charles, Lake of the Woods",
      year: 1908,
      isApproximate: true,
      category: "exploration",
      significance: "normal",
      imageUrl: IMAGES.FORT_ST_CHARLES_MEMORIAL,
    },
  ];

  for (const event of additionalEvents) {
    await prisma.historicalEvent.upsert({
      where: { id: event.id },
      update: event,
      create: event,
    });
    console.log(`  Added/updated event: ${event.title}`);
  }

  // ==================== PRINT SUMMARY ====================
  console.log("\n=== Seeding Complete ===\n");

  const eventCount = await prisma.historicalEvent.count();
  const locationCount = await prisma.location.count();
  const explorerCount = await prisma.explorer.count();
  const notableFigureCount = await prisma.notableFigure.count();

  console.log(`Total historical events: ${eventCount}`);
  console.log(`Total locations: ${locationCount}`);
  console.log(`Total explorers: ${explorerCount}`);
  console.log(`Total notable figures: ${notableFigureCount}`);
}

seedHistoricalImagery()
  .catch((e) => {
    console.error("Error seeding historical imagery:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
