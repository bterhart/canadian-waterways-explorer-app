import { Hono } from "hono";
import { db } from "../db";
import { getReadingGuide } from "../lib/reading-guides";
import { getExplorerConnections } from "../lib/connections";
import { attachRelated, loadRelated } from "../lib/related";

const explorersRouter = new Hono();

// Get all explorers
explorersRouter.get("/", async (c) => {
  const explorers = await db.explorer.findMany({
    select: {
      id: true,
      name: true,
      birthYear: true,
      deathYear: true,
      nationality: true,
      imageUrl: true
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: explorers });
});

// Get single explorer with full details
explorersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const explorer = await db.explorer.findUnique({
    where: { id },
    include: {
      waterways: {
        include: {
          // Only what the app reads. A full waterway row carries kmlData (up to 12.7 MB per
          // waterway), which made this response 15 MB for explorers of the Great Lakes.
          waterway: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!explorer) {
    return c.json({ error: { message: "Explorer not found", code: "NOT_FOUND" } }, 404);
  }

  const readingGuide = await getReadingGuide("explorer", explorer.id);
  // Expedition route layer (roadmap item 2): the explorer's dated journeys, for "Show on map"
  const expeditions = await db.expedition.findMany({
    where: { explorerId: explorer.id },
    orderBy: [{ startYear: "asc" }, { sortOrder: "asc" }],
    select: { id: true, name: true, startYear: true, endYear: true, summary: true, color: true, source: true, _count: { select: { legs: true } } },
  });

  // Everything about this person (roadmap item 1): the records that name the explorer, each
  // openable in the app. Documents, events and maps link by id; discoveries, notable figures and
  // lesson key figures link by name, matched after dropping honorifics.
  const connections = await getExplorerConnections(explorer);
  const refs = await loadRelated({
    waterwayIds: [...connections.timelineEvents, ...connections.historicalEvents, ...connections.discoveries].map((e) => e.waterwayId),
    locationIds: [...connections.timelineEvents, ...connections.historicalEvents].map((e) => e.locationId),
  });

  return c.json({
    data: {
      ...explorer,
      readingGuide,
      expeditions: expeditions.map(({ _count, ...e }) => ({ ...e, legCount: _count.legs })),
      documents: connections.documents,
      timelineEvents: connections.timelineEvents.map((e) => attachRelated(e, refs)),
      historicalEvents: connections.historicalEvents.map((e) => attachRelated(e, refs)),
      discoveries: connections.discoveries.map((d) => ({ ...d, waterway: d.waterwayId ? refs.waterways.get(d.waterwayId) ?? null : null })),
      notableFigures: connections.notableFigures,
      maps: connections.maps,
      lessonPlans: connections.lessonPlans,
    },
  });
});

// Search explorers by name
explorersRouter.get("/search/:query", async (c) => {
  const query = c.req.param("query");

  const explorers = await db.explorer.findMany({
    where: {
      name: { contains: query }
    },
    select: {
      id: true,
      name: true,
      birthYear: true,
      deathYear: true,
      nationality: true
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: explorers });
});

export { explorersRouter };
