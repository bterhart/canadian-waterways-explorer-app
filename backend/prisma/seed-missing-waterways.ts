import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding missing waterways mentioned in README...");

  // Get waterway types
  const bayType = await prisma.waterwayType.findUnique({ where: { name: "Bay" } });
  const straitType = await prisma.waterwayType.findUnique({ where: { name: "Strait" } });
  const soundType = await prisma.waterwayType.findUnique({ where: { name: "Sound" } });
  const inletType = await prisma.waterwayType.findUnique({ where: { name: "Inlet" } });
  const riverType = await prisma.waterwayType.findUnique({ where: { name: "River" } });

  if (!bayType || !straitType || !soundType || !inletType || !riverType) {
    throw new Error("Missing required waterway types");
  }

  // Get relevant explorers
  const franklin = await prisma.explorer.findFirst({ where: { name: { contains: "Franklin" } } });
  const mcclure = await prisma.explorer.findFirst({ where: { name: { contains: "McClure" } } });
  const mackenzie = await prisma.explorer.findFirst({ where: { name: "Alexander Mackenzie" } });
  const frobisher = await prisma.explorer.findFirst({ where: { name: "Martin Frobisher" } });
  const davis = await prisma.explorer.findFirst({ where: { name: "John Davis" } });
  const baffin = await prisma.explorer.findFirst({ where: { name: "William Baffin" } });
  const parry = await prisma.explorer.findFirst({ where: { name: { contains: "Parry" } } });
  const back = await prisma.explorer.findFirst({ where: { name: { contains: "Back" } } });
  const foxe = await prisma.explorer.findFirst({ where: { name: "Luke Foxe" } });

  // 1. Terror Bay - Where HMS Terror was found (2016)
  const terrorBay = await prisma.waterway.upsert({
    where: { id: "terror-bay-waterway" },
    update: {},
    create: {
      id: "terror-bay-waterway",
      name: "Terror Bay",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A bay on the southern coast of King William Island in Nunavut. Named after HMS Terror, one of the ships from Sir John Franklin's ill-fated expedition to find the Northwest Passage.",
      latitude: 68.9,
      longitude: -98.8,
      regionName: "Nunavut",
      typeId: bayType.id,
      historicalSignificance: "Site of the discovery of HMS Terror in 2016, 168 years after the ship was abandoned during the Franklin Expedition. The wreck was found remarkably well-preserved in 24 meters of water."
    }
  });
  console.log("Created Terror Bay");

  // 2. Mercy Bay - Where HMS Investigator was found (Banks Island)
  const mercyBay = await prisma.waterway.upsert({
    where: { id: "mercy-bay-waterway" },
    update: {},
    create: {
      id: "mercy-bay-waterway",
      name: "Mercy Bay",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A bay on the northern coast of Banks Island in the Northwest Territories. Named by Captain Robert McClure in 1851 when his ship HMS Investigator became trapped in ice here.",
      latitude: 74.1,
      longitude: -117.8,
      regionName: "Northwest Territories",
      typeId: bayType.id,
      historicalSignificance: "HMS Investigator was trapped here for nearly three years (1851-1853). The crew was eventually rescued, making McClure and his men the first to traverse the Northwest Passage (partly on foot). The wreck was discovered in 2010."
    }
  });
  console.log("Created Mercy Bay");

  // 3. Queen Maud Gulf - Where HMS Erebus was found (2014)
  const queenMaudGulf = await prisma.waterway.upsert({
    where: { id: "queen-maud-gulf-waterway" },
    update: {},
    create: {
      id: "queen-maud-gulf-waterway",
      name: "Queen Maud Gulf",
      indigenousName: "Uquqtuuq",
      indigenousLanguage: "Inuktitut",
      description: "A large gulf in the central Canadian Arctic, between the Adelaide Peninsula and King William Island. Named after Queen Maud of Norway.",
      latitude: 68.5,
      longitude: -101.0,
      regionName: "Nunavut",
      typeId: bayType.id,
      historicalSignificance: "Site of the discovery of HMS Erebus in 2014, Franklin's flagship. The wreck was found in excellent condition in the shallow waters of Wilmot and Crampton Bay. Inuit oral history helped guide searchers to the location."
    }
  });
  console.log("Created Queen Maud Gulf");

  // 4. Dean Channel - Where Mackenzie inscribed "from Canada, by land" at Bella Coola
  const deanChannel = await prisma.waterway.upsert({
    where: { id: "dean-channel-waterway" },
    update: {},
    create: {
      id: "dean-channel-waterway",
      name: "Dean Channel",
      indigenousName: "Nuxalk Territory",
      indigenousLanguage: "Nuxalk",
      description: "A fjord on the central coast of British Columbia, extending inland from Fitz Hugh Sound. The Bella Coola River flows into the channel at the town of Bella Coola.",
      latitude: 52.4,
      longitude: -127.0,
      regionName: "British Columbia",
      typeId: inletType.id,
      historicalSignificance: "Alexander Mackenzie reached the Pacific Ocean here on July 22, 1793, becoming the first European to cross North America north of Mexico. He inscribed on a rock: 'Alexander Mackenzie, from Canada, by land, the twenty-second of July, one thousand seven hundred and ninety-three.'"
    }
  });
  console.log("Created Dean Channel");

  // 5. Foxe Basin - Named after Luke Foxe
  const foxeBasin = await prisma.waterway.upsert({
    where: { id: "foxe-basin-waterway" },
    update: {},
    create: {
      id: "foxe-basin-waterway",
      name: "Foxe Basin",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A large oceanic basin between Baffin Island and the Melville Peninsula. Connected to Hudson Bay through Foxe Channel and to Baffin Bay through Fury and Hecla Strait.",
      latitude: 67.0,
      longitude: -78.0,
      regionName: "Nunavut",
      typeId: bayType.id,
      historicalSignificance: "Named after English explorer Luke Foxe who explored the area in 1631 searching for the Northwest Passage. His expedition overlapped with that of Thomas James. Important habitat for walrus and polar bears."
    }
  });
  console.log("Created Foxe Basin");

  // 6. Davis Strait - Named after John Davis
  const davisStrait = await prisma.waterway.upsert({
    where: { id: "davis-strait-waterway" },
    update: {},
    create: {
      id: "davis-strait-waterway",
      name: "Davis Strait",
      indigenousName: "Ikkerasak",
      indigenousLanguage: "Inuktitut",
      description: "A northern arm of the Labrador Sea, lying between Greenland and Baffin Island. It connects the Labrador Sea to Baffin Bay and is an important route for Arctic shipping.",
      latitude: 66.5,
      longitude: -58.0,
      regionName: "Multiple Territories",
      typeId: straitType.id,
      historicalSignificance: "Named after John Davis, the English explorer who first sailed through it in 1585 while searching for the Northwest Passage. Davis made three voyages to this region (1585-1587) and reached 72 degrees north latitude."
    }
  });
  console.log("Created Davis Strait");

  // 7. Baffin Bay - Named after William Baffin
  const baffinBay = await prisma.waterway.upsert({
    where: { id: "baffin-bay-waterway" },
    update: {},
    create: {
      id: "baffin-bay-waterway",
      name: "Baffin Bay",
      indigenousName: "Salliq",
      indigenousLanguage: "Inuktitut",
      description: "A marginal sea of the North Atlantic Ocean between Baffin Island and Greenland. Connected to the Atlantic through Davis Strait and to the Arctic Ocean through several straits.",
      latitude: 73.0,
      longitude: -68.0,
      regionName: "Nunavut",
      typeId: bayType.id,
      historicalSignificance: "Named after William Baffin, the English navigator who explored it in 1616. Baffin's voyage reached 77 degrees north, a record that stood for 236 years. He correctly identified Lancaster Sound as a potential Northwest Passage route."
    }
  });
  console.log("Created Baffin Bay");

  // 8. Lancaster Sound - Key passage in Northwest Passage
  const lancasterSound = await prisma.waterway.upsert({
    where: { id: "lancaster-sound-waterway" },
    update: {},
    create: {
      id: "lancaster-sound-waterway",
      name: "Lancaster Sound",
      indigenousName: "Tallurutiup Imanga",
      indigenousLanguage: "Inuktitut",
      description: "A passage of water in Nunavut between Devon Island and Baffin Island. It is the eastern entrance to the Northwest Passage and one of the most biologically productive marine areas in the Arctic.",
      latitude: 74.3,
      longitude: -84.0,
      regionName: "Nunavut",
      typeId: soundType.id,
      historicalSignificance: "William Baffin discovered the entrance in 1616. William Parry was the first to sail through in 1819, proving it was the gateway to the Northwest Passage. Named after James Lancaster. Now part of Tallurutiup Imanga National Marine Conservation Area."
    }
  });
  console.log("Created Lancaster Sound");

  // 9. Frobisher Bay - Named after Martin Frobisher
  const frobisherBay = await prisma.waterway.upsert({
    where: { id: "frobisher-bay-waterway" },
    update: {},
    create: {
      id: "frobisher-bay-waterway",
      name: "Frobisher Bay",
      indigenousName: "Tasiujarjuaq",
      indigenousLanguage: "Inuktitut",
      description: "A inlet of the Labrador Sea on the southeastern coast of Baffin Island. The city of Iqaluit, capital of Nunavut, is located at the bay's head.",
      latitude: 63.0,
      longitude: -66.5,
      regionName: "Nunavut",
      typeId: bayType.id,
      historicalSignificance: "Named after Martin Frobisher, who explored it in 1576-1578 during his search for the Northwest Passage. Frobisher mistakenly believed he had found gold ore here, leading to one of history's great mining frauds."
    }
  });
  console.log("Created Frobisher Bay");

  // 10. Cumberland Sound - Explored by John Davis
  const cumberlandSound = await prisma.waterway.upsert({
    where: { id: "cumberland-sound-waterway" },
    update: {},
    create: {
      id: "cumberland-sound-waterway",
      name: "Cumberland Sound",
      indigenousName: "Tiniqqivik",
      indigenousLanguage: "Inuktitut",
      description: "A large inlet on the southeastern coast of Baffin Island, extending 250 km inland. Known for its abundant marine life and Inuit history.",
      latitude: 65.5,
      longitude: -65.0,
      regionName: "Nunavut",
      typeId: soundType.id,
      historicalSignificance: "Named by John Davis in 1585 after his patron George Clifford, Earl of Cumberland. Davis explored the sound believing it might be the Northwest Passage. It later became important for whaling in the 19th century."
    }
  });
  console.log("Created Cumberland Sound");

  // 11. Parry Channel - Named after William Edward Parry
  const parryChannel = await prisma.waterway.upsert({
    where: { id: "parry-channel-waterway" },
    update: {},
    create: {
      id: "parry-channel-waterway",
      name: "Parry Channel",
      indigenousName: null,
      indigenousLanguage: null,
      description: "The collective name for the main waterway through the Canadian Arctic Archipelago, consisting of Lancaster Sound, Barrow Strait, Viscount Melville Sound, and McClure Strait.",
      latitude: 74.5,
      longitude: -100.0,
      regionName: "Nunavut / Northwest Territories",
      typeId: straitType.id,
      historicalSignificance: "Named after Sir William Edward Parry, who navigated much of this route in 1819-1820. His expedition was the first to penetrate deep into the Arctic Archipelago, reaching as far as Melville Island."
    }
  });
  console.log("Created Parry Channel");

  // 12. Bellot Strait - Key Northwest Passage route
  const bellotStrait = await prisma.waterway.upsert({
    where: { id: "bellot-strait-waterway" },
    update: {},
    create: {
      id: "bellot-strait-waterway",
      name: "Bellot Strait",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A narrow strait separating Somerset Island from the Boothia Peninsula. Only 2 km wide at its narrowest point, it is the northernmost point of the North American mainland.",
      latitude: 71.9,
      longitude: -94.5,
      regionName: "Nunavut",
      typeId: straitType.id,
      historicalSignificance: "Discovered in 1852 by Joseph-Rene Bellot during his search for the Franklin Expedition. It proved to be a crucial link in one of the navigable routes of the Northwest Passage, connecting Peel Sound to Franklin Strait."
    }
  });
  console.log("Created Bellot Strait");

  // 13. Back River (Great Fish River) - Named after George Back
  const backRiver = await prisma.waterway.upsert({
    where: { id: "back-river-waterway" },
    update: {},
    create: {
      id: "back-river-waterway",
      name: "Back River",
      indigenousName: "Hanninyuaq",
      indigenousLanguage: "Inuinnaqtun",
      description: "A 974 km river flowing through Nunavut from near the Arctic Circle to Chantrey Inlet on the Arctic coast. Also historically known as the Great Fish River.",
      latitude: 66.0,
      longitude: -95.0,
      regionName: "Nunavut",
      typeId: riverType.id,
      historicalSignificance: "Named after Sir George Back, who descended the river in 1834 searching for John Ross's expedition. The final survivors of the Franklin Expedition attempted to reach this river in 1848. Franklin had orders to descend it if his ships became trapped."
    }
  });
  console.log("Created Back River");

  // 14. Chesterfield Inlet - Important Hudson Bay inlet
  const chesterfieldInlet = await prisma.waterway.upsert({
    where: { id: "chesterfield-inlet-waterway" },
    update: {},
    create: {
      id: "chesterfield-inlet-waterway",
      name: "Chesterfield Inlet",
      indigenousName: "Igluligaarjuk",
      indigenousLanguage: "Inuktitut",
      description: "A 200 km long inlet on the northwestern shore of Hudson Bay, extending inland to Baker Lake. The community of Chesterfield Inlet is located at its mouth.",
      latitude: 63.3,
      longitude: -90.7,
      regionName: "Nunavut",
      typeId: inletType.id,
      historicalSignificance: "Explored by Samuel Hearne in 1770 while searching for copper deposits. Named after Philip Stanhope, 4th Earl of Chesterfield. The inlet was long thought to be a potential route to the Northwest Passage."
    }
  });
  console.log("Created Chesterfield Inlet");

  // Link waterways to relevant explorers
  const explorerWaterwayLinks = [];

  if (franklin) {
    explorerWaterwayLinks.push(
      { explorerId: franklin.id, waterwayId: terrorBay.id, yearExplored: 1847, expeditionNotes: "HMS Terror abandoned near here during Franklin's final expedition" },
      { explorerId: franklin.id, waterwayId: queenMaudGulf.id, yearExplored: 1847, expeditionNotes: "Franklin's ships became trapped in ice in this area" }
    );
  }

  if (mcclure) {
    explorerWaterwayLinks.push(
      { explorerId: mcclure.id, waterwayId: mercyBay.id, yearExplored: 1851, expeditionNotes: "HMS Investigator trapped here; McClure named it for the 'mercy of Providence'" }
    );
  }

  if (mackenzie) {
    explorerWaterwayLinks.push(
      { explorerId: mackenzie.id, waterwayId: deanChannel.id, yearExplored: 1793, expeditionNotes: "Reached the Pacific Ocean here, first European to cross North America north of Mexico" }
    );
  }

  if (foxe) {
    explorerWaterwayLinks.push(
      { explorerId: foxe.id, waterwayId: foxeBasin.id, yearExplored: 1631, expeditionNotes: "Explored the basin searching for Northwest Passage" }
    );
  }

  if (davis) {
    explorerWaterwayLinks.push(
      { explorerId: davis.id, waterwayId: davisStrait.id, yearExplored: 1585, expeditionNotes: "First European to sail through during search for Northwest Passage" },
      { explorerId: davis.id, waterwayId: cumberlandSound.id, yearExplored: 1585, expeditionNotes: "Named after his patron, Earl of Cumberland" }
    );
  }

  if (baffin) {
    explorerWaterwayLinks.push(
      { explorerId: baffin.id, waterwayId: baffinBay.id, yearExplored: 1616, expeditionNotes: "Explored the bay and correctly identified Lancaster Sound as potential passage" },
      { explorerId: baffin.id, waterwayId: lancasterSound.id, yearExplored: 1616, expeditionNotes: "Discovered the entrance but did not sail through" }
    );
  }

  if (parry) {
    explorerWaterwayLinks.push(
      { explorerId: parry.id, waterwayId: lancasterSound.id, yearExplored: 1819, expeditionNotes: "First to sail through, proving it was gateway to Northwest Passage" },
      { explorerId: parry.id, waterwayId: parryChannel.id, yearExplored: 1819, expeditionNotes: "Navigated much of this route, reaching Melville Island" }
    );
  }

  if (frobisher) {
    explorerWaterwayLinks.push(
      { explorerId: frobisher.id, waterwayId: frobisherBay.id, yearExplored: 1576, expeditionNotes: "Explored during search for Northwest Passage; mistakenly believed he found gold" }
    );
  }

  if (back) {
    explorerWaterwayLinks.push(
      { explorerId: back.id, waterwayId: backRiver.id, yearExplored: 1834, expeditionNotes: "Descended the river searching for John Ross's expedition" }
    );
  }

  // Create explorer-waterway links
  for (const link of explorerWaterwayLinks) {
    await prisma.explorerWaterway.upsert({
      where: {
        explorerId_waterwayId: {
          explorerId: link.explorerId,
          waterwayId: link.waterwayId
        }
      },
      update: {},
      create: link
    });
  }
  console.log(`Created ${explorerWaterwayLinks.length} explorer-waterway links`);

  // Create archaeological discovery links for the Franklin ships
  const erebusDiscovery = await prisma.archaeologicalDiscovery.findFirst({
    where: { name: { contains: "Erebus" } }
  });

  const terrorDiscovery = await prisma.archaeologicalDiscovery.findFirst({
    where: { name: { contains: "Terror" } }
  });

  const investigatorDiscovery = await prisma.archaeologicalDiscovery.findFirst({
    where: { name: { contains: "Investigator" } }
  });

  // Update discoveries to link to correct waterways
  if (erebusDiscovery) {
    await prisma.archaeologicalDiscovery.update({
      where: { id: erebusDiscovery.id },
      data: { waterwayId: queenMaudGulf.id }
    });
    console.log("Linked HMS Erebus discovery to Queen Maud Gulf");
  }

  if (terrorDiscovery) {
    await prisma.archaeologicalDiscovery.update({
      where: { id: terrorDiscovery.id },
      data: { waterwayId: terrorBay.id }
    });
    console.log("Linked HMS Terror discovery to Terror Bay");
  }

  if (investigatorDiscovery) {
    await prisma.archaeologicalDiscovery.update({
      where: { id: investigatorDiscovery.id },
      data: { waterwayId: mercyBay.id }
    });
    console.log("Linked HMS Investigator discovery to Mercy Bay");
  }

  console.log("\nMissing waterways added successfully!");
  console.log(`
Summary of new waterways:
1. Terror Bay - HMS Terror discovery site (2016)
2. Mercy Bay - HMS Investigator site, Banks Island
3. Queen Maud Gulf - HMS Erebus discovery site (2014)
4. Dean Channel - Mackenzie's "from Canada, by land" inscription
5. Foxe Basin - Named after Luke Foxe
6. Davis Strait - Named after John Davis
7. Baffin Bay - Named after William Baffin
8. Lancaster Sound - Gateway to Northwest Passage
9. Frobisher Bay - Named after Martin Frobisher
10. Cumberland Sound - Explored by John Davis
11. Parry Channel - Named after William Edward Parry
12. Bellot Strait - Key Northwest Passage route
13. Back River - Named after George Back (also Great Fish River)
14. Chesterfield Inlet - Important Hudson Bay inlet
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
