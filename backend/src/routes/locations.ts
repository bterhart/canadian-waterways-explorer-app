import { Hono } from "hono";
import { db } from "../db";
import { getReadingGuide } from "../lib/reading-guides";
import { listKnowledge } from "../lib/knowledge";

// Location router with imageUrl support
const locationsRouter = new Hono();

function parseAssociatedLocations(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

// Get all locations for map markers
locationsRouter.get("/", async (c) => {
  const locations = await db.location.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      locationType: true,
      yearEstablished: true,
      imageUrl: true,
      waterway: {
        select: { id: true, name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: locations });
});

// Get locations by type
locationsRouter.get("/type/:locationType", async (c) => {
  const locationType = c.req.param("locationType");

  const locations = await db.location.findMany({
    where: {
      locationType: {
        equals: locationType
      }
    },
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      locationType: true,
      yearEstablished: true,
      imageUrl: true,
      waterway: {
        select: { id: true, name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: locations });
});

// Get single location with full details
locationsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const location = await db.location.findUnique({
    where: { id },
    include: {
      waterway: {
        include: {
          type: true,
          explorers: {
            include: { explorer: true },
            orderBy: { yearExplored: 'asc' }
          },
          furTradeInfo: true
        }
      },
      cartographer: true
    }
  });

  if (!location) {
    return c.json({ error: { message: "Location not found", code: "NOT_FOUND" } }, 404);
  }

  // Figures named at this place itself (Matonabbee at Prince of Wales Fort) or on its water
  const notableFigureRows = await db.notableFigure.findMany({
  where: {
    OR: [
      { associatedLocations: { contains: location.name } },
      { associatedLocations: { contains: location.waterway.name } },
    ],
  },
  select: {
    id: true,
    name: true,
    alternateNames: true,
    birthYear: true,
    deathYear: true,
    nation: true,
    figureType: true,
    role: true,
    imageUrl: true,
    isFeatured: true,
    associatedLocations: true
  },
  orderBy: { name: "asc" }
});

const notableFigures = notableFigureRows
  .map((figure) => ({
    id: figure.id,
    name: figure.name,
    alternateNames: figure.alternateNames,
    birthYear: figure.birthYear,
    deathYear: figure.deathYear,
    nation: figure.nation,
    figureType: figure.figureType,
    role: figure.role,
    imageUrl: figure.imageUrl,
    isFeatured: figure.isFeatured,
    associatedLocations: parseAssociatedLocations(figure.associatedLocations),
  }))
  .filter((figure) => figure.associatedLocations.includes(location.name) || figure.associatedLocations.includes(location.waterway.name));

  const readingGuide = await getReadingGuide("location", location.id);
  // Knowledge given at this place by named Indigenous people (roadmap item 16)
  const knowledgeGiven = await listKnowledge({ locationId: location.id });

  return c.json({
    data: {
      ...location,
      waterway: {
        ...location.waterway,
        notableFigures,
      },
      readingGuide,
      knowledgeGiven,
    }
  });
});

// Get locations for a specific waterway
locationsRouter.get("/waterway/:waterwayId", async (c) => {
  const waterwayId = c.req.param("waterwayId");

  const locations = await db.location.findMany({
    where: { waterwayId },
    include: {
      cartographer: true
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: locations });
});

export { locationsRouter };
