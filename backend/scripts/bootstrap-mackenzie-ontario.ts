import { prisma } from "../src/prisma";

const WATERWAY_ID = "mackenzie-river-ontario-waterway";
const WATERWAY_NAME = "Mackenzie River (Ontario)";

const FIGURE_ID = "roderick-mckenzie-notable-figure";
const FIGURE_NAME = "Roderick McKenzie";

async function main() {
  const riverType = await prisma.waterwayType.findFirst({
    where: { name: { equals: "River" } },
    select: { id: true },
  });

  if (!riverType) {
    throw new Error('WaterwayType "River" not found.');
  }

  await prisma.waterway.upsert({
    where: { id: WATERWAY_ID },
    update: {
      name: WATERWAY_NAME,
      indigenousName: null,
      indigenousLanguage: null,
      description:
        "A short river in Shuniah Township east of Thunder Bay that flows into Lake Superior near MacKenzie Point. It is distinct from the much larger Mackenzie River in the Northwest Territories and is known locally for MacKenzie Falls and the surrounding Lake Superior shoreline landscape.",
      latitude: 48.5501,
      longitude: -88.93339,
      regionName: "Ontario",
      typeId: riverType.id,
      historicalSignificance:
        "This Lake Superior tributary is best understood within the broader history of Anishinaabe territory, the north shore of Gichigami, and the Fort William fur-trade world. The nearby point and river name are plausibly connected to Roderick McKenzie, a prominent North West Company and later Hudson's Bay Company trader associated with Fort William. The river and surrounding Thunder Bay landscape were also depicted in nineteenth-century art.",
      imageUrl: null,
      galleryImages: null,
      videoUrl: null,
    },
    create: {
      id: WATERWAY_ID,
      name: WATERWAY_NAME,
      indigenousName: null,
      indigenousLanguage: null,
      description:
        "A short river in Shuniah Township east of Thunder Bay that flows into Lake Superior near MacKenzie Point. It is distinct from the much larger Mackenzie River in the Northwest Territories and is known locally for MacKenzie Falls and the surrounding Lake Superior shoreline landscape.",
      latitude: 48.5501,
      longitude: -88.93339,
      regionName: "Ontario",
      typeId: riverType.id,
      historicalSignificance:
        "This Lake Superior tributary is best understood within the broader history of Anishinaabe territory, the north shore of Gichigami, and the Fort William fur-trade world. The nearby point and river name are plausibly connected to Roderick McKenzie, a prominent North West Company and later Hudson's Bay Company trader associated with Fort William. The river and surrounding Thunder Bay landscape were also depicted in nineteenth-century art.",
      imageUrl: null,
      galleryImages: null,
      videoUrl: null,
    },
  });

  await prisma.notableFigure.upsert({
    where: { id: FIGURE_ID },
    update: {
      name: FIGURE_NAME,
      alternateNames: "Roderick McKenzie Sr.; Roddy McKenzie",
      birthYear: 1771,
      deathYear: 1859,
      nation: "Scottish / North West Company / Hudson's Bay Company",
      birthPlace: "Assynt, Scotland",
      figureType: "trader",
      role: "North West Company fur trader; later Hudson's Bay Company chief trader and chief factor",
      biography:
        "Roderick McKenzie was a prominent fur trader in the North West Company and later the Hudson's Bay Company. His career was strongly tied to northwestern Ontario and the Lake Superior trade world, and he assumed command of Fort William in 1825.",
      significance:
        "Important Lake Superior fur-trade figure and plausible regional namesake for the Ontario Mackenzie River and associated landmarks near Thunder Bay.",
      associatedExplorers: JSON.stringify([
        {
          name: "Alexander Mackenzie",
          relationship: "Relative and fellow North West Company figure",
        },
      ]),
      achievements: JSON.stringify([
        "Prominent North West Company trader",
        "Commanded Fort William in 1825",
        "Later served as Hudson's Bay Company chief trader and chief factor",
      ]),
      associatedLocations: JSON.stringify([
        "Fort William",
        "Thunder Bay",
        "Mackenzie River (Ontario)",
      ]),
      activePeriodStart: 1790,
      activePeriodEnd: 1852,
      imageUrl: null,
      isFeatured: false,
    },
    create: {
      id: FIGURE_ID,
      name: FIGURE_NAME,
      alternateNames: "Roderick McKenzie Sr.; Roddy McKenzie",
      birthYear: 1771,
      deathYear: 1859,
      nation: "Scottish / North West Company / Hudson's Bay Company",
      birthPlace: "Assynt, Scotland",
      figureType: "trader",
      role: "North West Company fur trader; later Hudson's Bay Company chief trader and chief factor",
      biography:
        "Roderick McKenzie was a prominent fur trader in the North West Company and later the Hudson's Bay Company. His career was strongly tied to northwestern Ontario and the Lake Superior trade world, and he assumed command of Fort William in 1825.",
      significance:
        "Important Lake Superior fur-trade figure and plausible regional namesake for the Ontario Mackenzie River and associated landmarks near Thunder Bay.",
      associatedExplorers: JSON.stringify([
        {
          name: "Alexander Mackenzie",
          relationship: "Relative and fellow North West Company figure",
        },
      ]),
      achievements: JSON.stringify([
        "Prominent North West Company trader",
        "Commanded Fort William in 1825",
        "Later served as Hudson's Bay Company chief trader and chief factor",
      ]),
      associatedLocations: JSON.stringify([
        "Fort William",
        "Thunder Bay",
        "Mackenzie River (Ontario)",
      ]),
      activePeriodStart: 1790,
      activePeriodEnd: 1852,
      imageUrl: null,
      isFeatured: false,
    },
  });

  await prisma.notableFigureWaterway.upsert({
    where: {
      notableFigureId_waterwayId: {
        notableFigureId: FIGURE_ID,
        waterwayId: WATERWAY_ID,
      },
    },
    update: {
      relationship: "Probable regional namesake",
      notes:
        "Associated with the Fort William / Lake Superior trade world rather than documented here as an explorer.",
    },
    create: {
      notableFigureId: FIGURE_ID,
      waterwayId: WATERWAY_ID,
      relationship: "Probable regional namesake",
      notes:
        "Associated with the Fort William / Lake Superior trade world rather than documented here as an explorer.",
    },
  });

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
