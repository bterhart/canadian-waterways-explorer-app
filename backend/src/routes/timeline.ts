import { Hono } from "hono";
import { db } from "../db";
import { loadRelated, attachRelated } from "../lib/related";

const timelineRouter = new Hono();

// GET / - List timeline events with optional filters
timelineRouter.get("/", async (c) => {
  const theme = c.req.query("theme");
  const importance = c.req.query("importance");
  const startYear = c.req.query("startYear");
  const endYear = c.req.query("endYear");

  const whereClause: {
    theme?: string;
    importance?: string;
    year?: {
      gte?: number;
      lte?: number;
    };
  } = {};

  if (theme) {
    whereClause.theme = theme;
  }
  if (importance) {
    whereClause.importance = importance;
  }
  if (startYear || endYear) {
    whereClause.year = {};
    if (startYear) {
      whereClause.year.gte = parseInt(startYear, 10);
    }
    if (endYear) {
      whereClause.year.lte = parseInt(endYear, 10);
    }
  }

  const events = await db.timelineEvent.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      year: true,
      month: true,
      day: true,
      endYear: true,
      isApproximate: true,
      theme: true,
      imageUrl: true,
      iconType: true,
      explorerId: true,
      waterwayId: true,
      locationId: true,
      importance: true,
    },
    orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }],
  });

  // The app shows and opens the related explorer / waterway / location by name
  const maps = await loadRelated({
    explorerIds: events.map((e) => e.explorerId),
    waterwayIds: events.map((e) => e.waterwayId),
    locationIds: events.map((e) => e.locationId),
  });

  return c.json({ data: events.map((e) => attachRelated(e, maps)) });
});

// GET /themes - Get all unique themes
timelineRouter.get("/themes", async (c) => {
  const events = await db.timelineEvent.findMany({
    select: { theme: true },
    distinct: ["theme"],
  });

  const themes = events.map((e) => e.theme);

  return c.json({ data: themes });
});

// GET /:id - Get a single timeline event
timelineRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const event = await db.timelineEvent.findUnique({
    where: { id },
  });

  if (!event) {
    return c.json(
      { error: { message: "Timeline event not found", code: "NOT_FOUND" } },
      404
    );
  }

  const maps = await loadRelated({
    explorerIds: [event.explorerId],
    waterwayIds: [event.waterwayId],
    locationIds: [event.locationId],
  });

  return c.json({ data: attachRelated(event, maps) });
});

export { timelineRouter };
