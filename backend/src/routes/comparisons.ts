import { Hono } from "hono";
import { prisma } from "../prisma";

const comparisonsRouter = new Hono();

// GET / - List all published comparison templates
comparisonsRouter.get("/", async (c) => {
  const comparisonType = c.req.query("type");
  const gradeLevel = c.req.query("gradeLevel");

  const whereClause: {
    isPublished: boolean;
    comparisonType?: string;
    gradeLevel?: string;
  } = {
    isPublished: true,
  };

  if (comparisonType) {
    whereClause.comparisonType = comparisonType;
  }
  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }

  const comparisons = await prisma.comparisonTemplate.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      comparisonType: true,
      gradeLevel: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: comparisons });
});

// GET /types - Get all unique comparison types
comparisonsRouter.get("/types", async (c) => {
  const comparisons = await prisma.comparisonTemplate.findMany({
    where: { isPublished: true },
    select: { comparisonType: true },
    distinct: ["comparisonType"],
  });

  const types = comparisons.map((c) => c.comparisonType);

  return c.json({ data: types });
});

// GET /:id - Get a single comparison template with full details
comparisonsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const comparison = await prisma.comparisonTemplate.findUnique({
    where: { id, isPublished: true },
  });

  if (!comparison) {
    return c.json(
      { error: { message: "Comparison template not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse JSON fields
  const result = {
    ...comparison,
    items: JSON.parse(comparison.items),
    criteria: JSON.parse(comparison.criteria),
    analysisPrompts: comparison.analysisPrompts
      ? JSON.parse(comparison.analysisPrompts)
      : null,
  };

  return c.json({ data: result });
});

// GET /generate/explorers - Generate dynamic explorer comparison
comparisonsRouter.get("/generate/explorers", async (c) => {
  const ids = c.req.query("ids");

  if (!ids) {
    return c.json(
      { error: { message: "Explorer IDs are required", code: "BAD_REQUEST" } },
      400
    );
  }

  const explorerIds = ids.split(",");

  const explorers = await prisma.explorer.findMany({
    where: { id: { in: explorerIds } },
    include: {
      waterways: {
        include: {
          waterway: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (explorers.length < 2) {
    return c.json(
      { error: { message: "At least 2 explorers are required for comparison", code: "BAD_REQUEST" } },
      400
    );
  }

  // Build comparison data
  const comparisonData = explorers.map((explorer) => ({
    id: explorer.id,
    name: explorer.name,
    birthYear: explorer.birthYear,
    deathYear: explorer.deathYear,
    nationality: explorer.nationality,
    biography: explorer.biography,
    notableAchievements: explorer.notableAchievements,
    waterwaysExplored: explorer.waterways.map((w) => ({
      id: w.waterway.id,
      name: w.waterway.name,
      yearExplored: w.yearExplored,
    })),
  }));

  return c.json({
    data: {
      comparisonType: "explorers",
      items: comparisonData,
      criteria: [
        { criterion: "Time Period", description: "When did they live and explore?" },
        { criterion: "Nationality", description: "Where were they from?" },
        { criterion: "Waterways", description: "What waterways did they explore?" },
        { criterion: "Achievements", description: "What were their notable achievements?" },
      ],
    },
  });
});

// GET /generate/forts - Generate dynamic fort/trading post comparison
comparisonsRouter.get("/generate/forts", async (c) => {
  const ids = c.req.query("ids");

  if (!ids) {
    return c.json(
      { error: { message: "Location IDs are required", code: "BAD_REQUEST" } },
      400
    );
  }

  const locationIds = ids.split(",");

  const locations = await prisma.location.findMany({
    where: {
      id: { in: locationIds },
      locationType: { in: ["Fort", "Trading Post"] },
    },
    include: {
      waterway: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (locations.length < 2) {
    return c.json(
      { error: { message: "At least 2 forts/trading posts are required for comparison", code: "BAD_REQUEST" } },
      400
    );
  }

  const comparisonData = locations.map((location) => ({
    id: location.id,
    name: location.name,
    indigenousName: location.indigenousName,
    locationType: location.locationType,
    yearEstablished: location.yearEstablished,
    historicalNotes: location.historicalNotes,
    waterway: location.waterway
      ? { id: location.waterway.id, name: location.waterway.name }
      : null,
    latitude: location.latitude,
    longitude: location.longitude,
  }));

  return c.json({
    data: {
      comparisonType: "forts",
      items: comparisonData,
      criteria: [
        { criterion: "Year Established", description: "When was it established?" },
        { criterion: "Location", description: "Where is it located?" },
        { criterion: "Waterway", description: "What waterway is it on?" },
        { criterion: "Historical Significance", description: "Why was it important?" },
      ],
    },
  });
});

export { comparisonsRouter };
