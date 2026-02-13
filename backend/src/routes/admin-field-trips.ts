import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAdmin } from "../lib/admin-middleware";

const adminFieldTripsRouter = new Hono();

// Require admin authentication for all routes
adminFieldTripsRouter.use("*", requireAdmin);

// Validation schemas
const createFieldTripSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  estimatedMinutes: z.number().int().positive().default(30),
  theme: z.string().min(1, "Theme is required"),
  coverImageUrl: z.string().url().optional(),
  isPublished: z.boolean().default(false),
});

const updateFieldTripSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  theme: z.string().min(1).optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean().optional(),
});

const createStopSchema = z.object({
  orderIndex: z.number().int().min(0),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  locationId: z.string().optional(),
  waterwayId: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  funFact: z.string().optional(),
  thinkQuestion: z.string().optional(),
});

const updateStopSchema = z.object({
  orderIndex: z.number().int().min(0).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  locationId: z.string().optional().nullable(),
  waterwayId: z.string().optional().nullable(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url().optional().nullable(),
  funFact: z.string().optional().nullable(),
  thinkQuestion: z.string().optional().nullable(),
});

// GET / - List all field trips (including unpublished)
adminFieldTripsRouter.get("/", async (c) => {
  const fieldTrips = await prisma.virtualFieldTrip.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      estimatedMinutes: true,
      theme: true,
      coverImageUrl: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
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
    isPublished: trip.isPublished,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
    stopCount: trip._count.stops,
  }));

  return c.json({ data: result });
});

// GET /:id - Get a single field trip with stops for editing
adminFieldTripsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const fieldTrip = await prisma.virtualFieldTrip.findUnique({
    where: { id },
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

// POST / - Create a new field trip
adminFieldTripsRouter.post(
  "/",
  zValidator("json", createFieldTripSchema),
  async (c) => {
    const data = c.req.valid("json");

    const fieldTrip = await prisma.virtualFieldTrip.create({
      data: {
        title: data.title,
        description: data.description,
        gradeLevel: data.gradeLevel,
        estimatedMinutes: data.estimatedMinutes,
        theme: data.theme,
        coverImageUrl: data.coverImageUrl,
        isPublished: data.isPublished,
      },
    });

    return c.json({ data: fieldTrip }, 201);
  }
);

// PATCH /:id - Update a field trip
adminFieldTripsRouter.patch(
  "/:id",
  zValidator("json", updateFieldTripSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existingTrip = await prisma.virtualFieldTrip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return c.json(
        { error: { message: "Field trip not found", code: "NOT_FOUND" } },
        404
      );
    }

    const fieldTrip = await prisma.virtualFieldTrip.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.estimatedMinutes !== undefined && {
          estimatedMinutes: data.estimatedMinutes,
        }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.coverImageUrl !== undefined && {
          coverImageUrl: data.coverImageUrl,
        }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    return c.json({ data: fieldTrip });
  }
);

// DELETE /:id - Delete a field trip
adminFieldTripsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingTrip = await prisma.virtualFieldTrip.findUnique({
    where: { id },
  });

  if (!existingTrip) {
    return c.json(
      { error: { message: "Field trip not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.virtualFieldTrip.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Field trip deleted successfully" } });
});

// POST /:tripId/stops - Add a stop to a field trip
adminFieldTripsRouter.post(
  "/:tripId/stops",
  zValidator("json", createStopSchema),
  async (c) => {
    const tripId = c.req.param("tripId");
    const data = c.req.valid("json");

    const trip = await prisma.virtualFieldTrip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return c.json(
        { error: { message: "Field trip not found", code: "NOT_FOUND" } },
        404
      );
    }

    const stop = await prisma.fieldTripStop.create({
      data: {
        tripId,
        orderIndex: data.orderIndex,
        title: data.title,
        description: data.description,
        locationId: data.locationId,
        waterwayId: data.waterwayId,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        funFact: data.funFact,
        thinkQuestion: data.thinkQuestion,
      },
    });

    return c.json({ data: stop }, 201);
  }
);

// PATCH /:tripId/stops/:stopId - Update a stop
adminFieldTripsRouter.patch(
  "/:tripId/stops/:stopId",
  zValidator("json", updateStopSchema),
  async (c) => {
    const tripId = c.req.param("tripId");
    const stopId = c.req.param("stopId");
    const data = c.req.valid("json");

    const existingStop = await prisma.fieldTripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!existingStop) {
      return c.json(
        { error: { message: "Stop not found", code: "NOT_FOUND" } },
        404
      );
    }

    const stop = await prisma.fieldTripStop.update({
      where: { id: stopId },
      data: {
        ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.locationId !== undefined && { locationId: data.locationId }),
        ...(data.waterwayId !== undefined && { waterwayId: data.waterwayId }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.audioUrl !== undefined && { audioUrl: data.audioUrl }),
        ...(data.funFact !== undefined && { funFact: data.funFact }),
        ...(data.thinkQuestion !== undefined && { thinkQuestion: data.thinkQuestion }),
      },
    });

    return c.json({ data: stop });
  }
);

// DELETE /:tripId/stops/:stopId - Delete a stop
adminFieldTripsRouter.delete("/:tripId/stops/:stopId", async (c) => {
  const tripId = c.req.param("tripId");
  const stopId = c.req.param("stopId");

  const existingStop = await prisma.fieldTripStop.findFirst({
    where: { id: stopId, tripId },
  });

  if (!existingStop) {
    return c.json(
      { error: { message: "Stop not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.fieldTripStop.delete({
    where: { id: stopId },
  });

  return c.json({ data: { success: true, message: "Stop deleted successfully" } });
});

export { adminFieldTripsRouter };
