import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { applyScope, scopeForUser } from "../lib/content-scope";
import { completeResource, POINTS } from "../lib/progress";
import { loadRelated } from "../lib/related";

const completeSchema = z.object({
  userId: z.string().min(1, "userId is required"), // device identity (mobile lib/identity.ts)
});

const fieldTripsRouter = new Hono();

// GET / - List all published virtual field trips
fieldTripsRouter.get("/", async (c) => {
  // Class content scope (spec 10.27): a student device sends its id; the list is cut to what its classes allow.
  const scopeUserId = c.req.query("userId");
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

  const fieldTrips = await db.virtualFieldTrip.findMany({
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

  return c.json({ data: applyScope(await scopeForUser(scopeUserId), result, "field_trip") });
});

// GET /:id - Get a single field trip with all stops
fieldTripsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const fieldTrip = await db.virtualFieldTrip.findUnique({
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

  // Each stop may point at the pin and the waterway it stands on; the app opens them
  const maps = await loadRelated({
    waterwayIds: fieldTrip.stops.map((s) => s.waterwayId),
    locationIds: fieldTrip.stops.map((s) => s.locationId),
  });
  const stops = fieldTrip.stops.map((s) => ({
    ...s,
    location: s.locationId ? maps.locations.get(s.locationId) ?? null : null,
    waterway: s.waterwayId ? maps.waterways.get(s.waterwayId) ?? null : null,
  }));

  return c.json({ data: { ...fieldTrip, stops } });
});

// POST /:id/complete - A device finished the field trip: points, achievements,
// and completion of any matching class assignment (PUBLIC, device-id keyed).
fieldTripsRouter.post(
  "/:id/complete",
  zValidator("json", completeSchema),
  async (c) => {
    const id = c.req.param("id");
    const { userId } = c.req.valid("json");

    const trip = await db.virtualFieldTrip.findUnique({
      where: { id, isPublished: true },
      select: { id: true },
    });
    if (!trip) {
      return c.json(
        { error: { message: "Field trip not found", code: "NOT_FOUND" } },
        404
      );
    }

    const result = await completeResource({
      userId,
      kind: "field_trip",
      resourceId: id,
      points: POINTS.fieldTripCompleted,
      activityType: "field_trip_completed",
    });

    return c.json({ data: result });
  }
);

export { fieldTripsRouter };
