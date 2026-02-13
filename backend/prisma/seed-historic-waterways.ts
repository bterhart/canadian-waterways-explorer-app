import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding historically important waterways for the fur trade...");

  // Get the River waterway type
  const riverType = await prisma.waterwayType.findUnique({ where: { name: "River" } });

  if (!riverType) {
    throw new Error("River waterway type not found. Run main seed first.");
  }

  // Get relevant explorers for linking
  const davidThompson = await prisma.explorer.findFirst({ where: { name: "David Thompson" } });
  const samuelHearne = await prisma.explorer.findFirst({ where: { name: "Samuel Hearne" } });
  const champlain = await prisma.explorer.findFirst({ where: { name: { contains: "Champlain" } } });
  const mackenzie = await prisma.explorer.findFirst({ where: { name: "Alexander Mackenzie" } });
  const laVerendrye = await prisma.explorer.findFirst({ where: { name: { contains: "Vérendrye" } } });
  const etienneBrule = await prisma.explorer.findFirst({ where: { name: { contains: "Brûlé" } } });

  // 1. Seine River (Ontario) - Fur trade route connecting Rainy Lake to Lake of the Woods
  const seineRiver = await prisma.waterway.upsert({
    where: { id: "seine-river-ontario-waterway" },
    update: {},
    create: {
      id: "seine-river-ontario-waterway",
      name: "Seine River",
      indigenousName: null,
      indigenousLanguage: null,
      description: "A river in northwestern Ontario flowing approximately 240 km from its headwaters near the height of land to Rainy Lake. The river passes through numerous lakes and was a vital link in the fur trade canoe route system.",
      latitude: 48.65,
      longitude: -92.5,
      regionName: "Ontario",
      typeId: riverType.id,
      historicalSignificance: "The Seine River was an important fur trade route connecting Rainy Lake to the interior waterway systems. Voyageurs used this route as part of the broader network linking Lake Superior to Lake of the Woods and beyond to the western prairies. The river required numerous portages around rapids and falls, making it a challenging but essential trade corridor."
    }
  });
  console.log("Created Seine River (Ontario)");

  // 2. Atikokan River (Ontario) - Part of fur trade route near present-day Atikokan
  const atikokanRiver = await prisma.waterway.upsert({
    where: { id: "atikokan-river-waterway" },
    update: {},
    create: {
      id: "atikokan-river-waterway",
      name: "Atikokan River",
      indigenousName: "Atikokan",
      indigenousLanguage: "Ojibwe",
      description: "A river in northwestern Ontario near the town of Atikokan. The name derives from an Ojibwe word meaning 'caribou bones,' referring to the area's significance for caribou hunting. The river connects to the Quetico-Superior canoe country.",
      latitude: 48.75,
      longitude: -91.62,
      regionName: "Ontario",
      typeId: riverType.id,
      historicalSignificance: "The Atikokan River was part of the extensive fur trade route system in northwestern Ontario. Located near the junction of several important canoe routes, this area served as a crossroads for Indigenous traders and later voyageurs traveling between Lake Superior, Rainy Lake, and the interior. The region was frequented by Ojibwe peoples who had established trade networks long before European contact."
    }
  });
  console.log("Created Atikokan River");

  // 3. Souris River (Manitoba/Saskatchewan) - Important river flowing into Assiniboine
  const sourisRiver = await prisma.waterway.upsert({
    where: { id: "souris-river-waterway" },
    update: {},
    create: {
      id: "souris-river-waterway",
      name: "Souris River",
      indigenousName: "Mouse River",
      indigenousLanguage: null,
      description: "A river flowing approximately 700 km through Saskatchewan, Manitoba, and North Dakota before joining the Assiniboine River near Brandon, Manitoba. The name 'Souris' is French for 'mouse,' likely referring to the field mice common in the area.",
      latitude: 49.85,
      longitude: -99.95,
      regionName: "Manitoba / Saskatchewan",
      typeId: riverType.id,
      historicalSignificance: "The Souris River was an important fur trade route connecting the Assiniboine River system to the southern prairies. Fur traders used this river to access the rich beaver country of the northern Great Plains. The river valley also served as a corridor for Indigenous peoples, including the Assiniboine and Cree, who traded furs and pemmican with European traders. Several fur trade posts were established along its course during the late 18th and early 19th centuries."
    }
  });
  console.log("Created Souris River");

  // 4. Red Deer River (Alberta) - Major river explored by David Thompson and fur traders
  const redDeerRiver = await prisma.waterway.upsert({
    where: { id: "red-deer-river-alberta-waterway" },
    update: {},
    create: {
      id: "red-deer-river-alberta-waterway",
      name: "Red Deer River",
      indigenousName: "Waskasoo Seepee",
      indigenousLanguage: "Cree",
      description: "A major river in Alberta flowing approximately 740 km from the Rocky Mountains through the prairies to join the South Saskatchewan River. The Cree name 'Waskasoo Seepee' and the English name both refer to the elk (wapiti) that frequented the river valley.",
      latitude: 51.67,
      longitude: -113.0,
      regionName: "Alberta",
      typeId: riverType.id,
      historicalSignificance: "The Red Deer River was explored by David Thompson and other fur traders during the late 18th and early 19th centuries. The river valley served as an important route into the foothills and Rocky Mountains. Thompson mapped portions of this river during his extensive surveys of western Canada. The Blackfoot, Cree, and other Indigenous nations used the river valley for seasonal movements and as buffalo hunting grounds. Trading posts were established along the river to trade with Indigenous peoples for furs, buffalo robes, and pemmican."
    }
  });
  console.log("Created Red Deer River (Alberta)");

  // 5. French River (Ontario) - CRITICAL voyageur route from Lake Nipissing to Georgian Bay
  const frenchRiver = await prisma.waterway.upsert({
    where: { id: "french-river-waterway" },
    update: {},
    create: {
      id: "french-river-waterway",
      name: "French River",
      indigenousName: "Wikondenong",
      indigenousLanguage: "Ojibwe",
      description: "A river in northeastern Ontario flowing approximately 110 km from Lake Nipissing to Georgian Bay on Lake Huron. Despite its relatively short length, the French River was one of the most important waterways in Canadian history, serving as the gateway between the St. Lawrence-Great Lakes system and the vast interior of the continent.",
      latitude: 46.0,
      longitude: -80.5,
      regionName: "Ontario",
      typeId: riverType.id,
      historicalSignificance: "The French River was arguably the most critical link in the historic voyageur highway from Montreal to the continental interior. This was the route taken by virtually every explorer, missionary, and fur trader heading west for over 200 years. Samuel de Champlain and Etienne Brule were among the first Europeans to travel this route in 1615. The route followed the Ottawa River, crossed Lake Nipissing via the Mattawa River, then descended the French River to Georgian Bay and Lake Huron. From there, traders could reach Lake Superior and the rich fur country beyond. The North West Company's voyageurs paddled this route annually, their canoes laden with trade goods heading west and furs heading east. The river's numerous channels, rapids, and portages became intimately familiar to generations of paddlers. Today, the French River is a Canadian Heritage River recognized for its outstanding cultural significance."
    }
  });
  console.log("Created French River (Ontario) - THE historic voyageur route");

  // Create fur trade info for the new waterways
  await prisma.furTradeInfo.upsert({
    where: { waterwayId: seineRiver.id },
    update: {},
    create: {
      waterwayId: seineRiver.id,
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1780-1821",
      primaryFurs: "Beaver, Muskrat, Otter",
      tradeRouteNotes: "Part of the voyageur route connecting Lake Superior to Rainy Lake and the western interior. Numerous portages required around rapids."
    }
  });

  await prisma.furTradeInfo.upsert({
    where: { waterwayId: atikokanRiver.id },
    update: {},
    create: {
      waterwayId: atikokanRiver.id,
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1780-1821",
      primaryFurs: "Beaver, Marten, Lynx",
      tradeRouteNotes: "Junction area for multiple canoe routes in the Quetico-Superior wilderness. Indigenous traders gathered here for centuries before European contact."
    }
  });

  await prisma.furTradeInfo.upsert({
    where: { waterwayId: sourisRiver.id },
    update: {},
    create: {
      waterwayId: sourisRiver.id,
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1790-1870",
      primaryFurs: "Beaver, Buffalo robes, Pemmican",
      tradeRouteNotes: "Connected the Assiniboine River to the southern prairies. Important for both fur trade and provisioning with pemmican and buffalo products."
    }
  });

  await prisma.furTradeInfo.upsert({
    where: { waterwayId: redDeerRiver.id },
    update: {},
    create: {
      waterwayId: redDeerRiver.id,
      tradingCompany: "North West Company / Hudson's Bay Company",
      peakTradePeriod: "1790-1870",
      primaryFurs: "Beaver, Buffalo robes, Wolf, Elk",
      tradeRouteNotes: "Route into the foothills and Rocky Mountains. David Thompson explored and mapped portions during his western surveys. Important for trade with Blackfoot and Cree peoples."
    }
  });

  await prisma.furTradeInfo.upsert({
    where: { waterwayId: frenchRiver.id },
    update: {},
    create: {
      waterwayId: frenchRiver.id,
      tradingCompany: "French Crown / North West Company",
      peakTradePeriod: "1615-1821",
      primaryFurs: "Beaver, Marten, Otter",
      tradeRouteNotes: "THE main voyageur highway from Montreal to the interior. Every major explorer and fur trader passed this way. Part of the Ottawa River - Mattawa River - Lake Nipissing - French River route to the Great Lakes."
    }
  });

  console.log("Created fur trade information for all new waterways");

  // Link explorers to waterways
  const explorerWaterwayLinks = [];

  // David Thompson and Red Deer River
  if (davidThompson) {
    explorerWaterwayLinks.push({
      explorerId: davidThompson.id,
      waterwayId: redDeerRiver.id,
      yearExplored: 1800,
      expeditionNotes: "Explored and mapped the Red Deer River valley as part of his extensive surveys of western Canada. Noted the elk herds that gave the river its name."
    });
  }

  // Champlain and French River
  if (champlain) {
    explorerWaterwayLinks.push({
      explorerId: champlain.id,
      waterwayId: frenchRiver.id,
      yearExplored: 1615,
      expeditionNotes: "Traveled the French River route to Georgian Bay and Lake Huron, opening the voyageur highway that would be used for over 200 years."
    });
  }

  // Etienne Brule and French River (if he exists in DB)
  if (etienneBrule) {
    explorerWaterwayLinks.push({
      explorerId: etienneBrule.id,
      waterwayId: frenchRiver.id,
      yearExplored: 1615,
      expeditionNotes: "Accompanied Champlain or preceded him on the French River route. As Champlain's interpreter, Brule became one of the first Europeans to see the Great Lakes."
    });
  }

  // La Verendrye and Souris/Seine if he exists
  if (laVerendrye) {
    explorerWaterwayLinks.push({
      explorerId: laVerendrye.id,
      waterwayId: seineRiver.id,
      yearExplored: 1732,
      expeditionNotes: "Used the waterway routes through the Rainy Lake region as part of his western exploration network."
    });
    explorerWaterwayLinks.push({
      explorerId: laVerendrye.id,
      waterwayId: sourisRiver.id,
      yearExplored: 1738,
      expeditionNotes: "The La Verendrye family explored the prairie river systems while seeking a route to the Western Sea."
    });
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

  console.log("\nHistorically important waterways added successfully!");
  console.log(`
Summary of new waterways:
1. Seine River (Ontario) - Fur trade route connecting Rainy Lake to Lake of the Woods
2. Atikokan River (Ontario) - Part of fur trade route system near present-day Atikokan
3. Souris River (Manitoba/Saskatchewan) - Important river flowing into Assiniboine, used by fur traders
4. Red Deer River (Alberta) - Major river explored by David Thompson and fur traders
5. French River (Ontario) - CRITICAL - Historic voyageur highway from Lake Nipissing to Georgian Bay

The French River is especially significant as it was part of the main voyageur route:
Montreal -> Ottawa River -> Mattawa River -> Lake Nipissing -> French River -> Georgian Bay -> Lake Huron -> Lake Superior -> Western Interior

Every major explorer used this route: Champlain, Brule, the Jesuits, La Salle, the voyageurs of the NWC, and countless others.
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
