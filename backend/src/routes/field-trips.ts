import { Hono } from "hono";
import { prisma } from "../prisma";

const fieldTripsRouter = new Hono();

// GET / - List all published virtual field trips
fieldTripsRouter.get("/", async (c) => {
  const gradeLevel = c.req.query("gradeLevel");
  const theme = c.req.query("theme");

  const whereClause: {
    isPublished: boolean;
    gradeLevel?: string;
    theme?: string;
  } = {
    isPublished: true,
  };

  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }
  if (theme) {
    whereClause.theme = theme;
  }

  const fieldTrips = await prisma.virtualFieldTrip.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      estimatedMinutes: true,
      theme: true,
      coverImageUrl: true,
      createdAt: true,
      _count: {
        select: { stops: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = fieldTrips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    gradeLevel: trip.gradeLevel,
    estimatedMinutes: trip.estimatedMinutes,
    theme: trip.theme,
    coverImageUrl: trip.coverImageUrl,
    createdAt: trip.createdAt,
    stopCount: trip._count.stops,
  }));

  return c.json({ data: result });
});

// GET /:id - Get a single field trip with all stops
fieldTripsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const fieldTrip = await prisma.virtualFieldTrip.findUnique({
    where: { id, isPublished: true },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!fieldTrip) {
    return c.json(
      { error: { message: "Field trip not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: fieldTrip });
});

export { fieldTripsRouter };
