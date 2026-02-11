import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { nanoid } from "nanoid";

const mapAnnotationsRouter = new Hono();

// =========================
// Validation Schemas
// =========================

const createMapAnnotationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  centerLatitude: z.number().optional(),
  centerLongitude: z.number().optional(),
  zoomLevel: z.number().optional(),
});

const updateMapAnnotationSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  centerLatitude: z.number().optional().nullable(),
  centerLongitude: z.number().optional().nullable(),
  zoomLevel: z.number().optional().nullable(),
  isPublic: z.boolean().optional(),
});

const createPinSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  title: z.string().min(1, "Pin title is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  linkedWaterwayId: z.string().optional(),
  linkedLocationId: z.string().optional(),
  linkedExplorerId: z.string().optional(),
});

const createRouteSchema = z.object({
  title: z.string().min(1, "Route title is required"),
  description: z.string().optional(),
  coordinates: z.array(z.tuple([z.number(), z.number()])).min(2, "Route must have at least 2 points"),
  color: z.string().optional(),
  strokeWidth: z.number().int().positive().optional(),
  isDashed: z.boolean().optional(),
  compareToExplorerId: z.string().optional(),
});

const createNoteSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  content: z.string().min(1, "Note content is required"),
  backgroundColor: z.string().optional(),
});

// =========================
// Helper Functions
// =========================

function generateShareCode(): string {
  return nanoid(10);
}

function parseAnnotation(annotation: {
  pins: { createdAt: Date }[];
  routes: { coordinates: string; createdAt: Date }[];
  notes: { createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...annotation,
    pins: annotation.pins.map((pin) => ({
      ...pin,
      createdAt: pin.createdAt.toISOString(),
    })),
    routes: annotation.routes.map((route) => ({
      ...route,
      coordinates: JSON.parse(route.coordinates),
      createdAt: route.createdAt.toISOString(),
    })),
    notes: annotation.notes.map((note) => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
    createdAt: annotation.createdAt.toISOString(),
    updatedAt: annotation.updatedAt.toISOString(),
  };
}

// =========================
// Map Annotation CRUD
// =========================

// GET / - List user's saved maps
mapAnnotationsRouter.get("/", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json(
      { error: { message: "userId query parameter is required", code: "BAD_REQUEST" } },
      400
    );
  }

  const annotations = await prisma.userMapAnnotation.findMany({
    where: { userId },
    include: {
      pins: true,
      routes: true,
      notes: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return c.json({
    data: annotations.map(parseAnnotation),
  });
});

// POST / - Create new annotated map
mapAnnotationsRouter.post(
  "/",
  zValidator("json", createMapAnnotationSchema),
  async (c) => {
    const data = c.req.valid("json");

    const annotation = await prisma.userMapAnnotation.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        centerLatitude: data.centerLatitude,
        centerLongitude: data.centerLongitude,
        zoomLevel: data.zoomLevel,
      },
      include: {
        pins: true,
        routes: true,
        notes: true,
      },
    });

    return c.json({ data: parseAnnotation(annotation) }, 201);
  }
);

// GET /shared/:shareCode - Get shared map (public)
mapAnnotationsRouter.get("/shared/:shareCode", async (c) => {
  const shareCode = c.req.param("shareCode");

  const annotation = await prisma.userMapAnnotation.findFirst({
    where: {
      shareCode,
      isPublic: true,
    },
    include: {
      pins: true,
      routes: true,
      notes: true,
    },
  });

  if (!annotation) {
    return c.json(
      { error: { message: "Shared map not found or not public", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: parseAnnotation(annotation) });
});

// GET /:id - Get map with all annotations
mapAnnotationsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const annotation = await prisma.userMapAnnotation.findUnique({
    where: { id },
    include: {
      pins: true,
      routes: true,
      notes: true,
    },
  });

  if (!annotation) {
    return c.json(
      { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: parseAnnotation(annotation) });
});

// PUT /:id - Update map (title, description, bounds)
mapAnnotationsRouter.put(
  "/:id",
  zValidator("json", updateMapAnnotationSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existing = await prisma.userMapAnnotation.findUnique({
      where: { id },
    });

    if (!existing) {
      return c.json(
        { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
        404
      );
    }

    const annotation = await prisma.userMapAnnotation.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.centerLatitude !== undefined && { centerLatitude: data.centerLatitude }),
        ...(data.centerLongitude !== undefined && { centerLongitude: data.centerLongitude }),
        ...(data.zoomLevel !== undefined && { zoomLevel: data.zoomLevel }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      include: {
        pins: true,
        routes: true,
        notes: true,
      },
    });

    return c.json({ data: parseAnnotation(annotation) });
  }
);

// DELETE /:id - Delete map
mapAnnotationsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.userMapAnnotation.findUnique({
    where: { id },
  });

  if (!existing) {
    return c.json(
      { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.userMapAnnotation.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Map deleted successfully" } });
});

// =========================
// Sharing
// =========================

// POST /:id/share - Generate share code
mapAnnotationsRouter.post("/:id/share", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.userMapAnnotation.findUnique({
    where: { id },
  });

  if (!existing) {
    return c.json(
      { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Generate new share code if not exists
  const shareCode = existing.shareCode || generateShareCode();

  const annotation = await prisma.userMapAnnotation.update({
    where: { id },
    data: {
      shareCode,
      isPublic: true,
    },
    include: {
      pins: true,
      routes: true,
      notes: true,
    },
  });

  return c.json({
    data: {
      ...parseAnnotation(annotation),
      shareUrl: `/api/map-annotations/shared/${shareCode}`,
    },
  });
});

// =========================
// Export
// =========================

// GET /:id/export - Export map data as JSON (for PDF generation client-side)
mapAnnotationsRouter.get("/:id/export", async (c) => {
  const id = c.req.param("id");

  const annotation = await prisma.userMapAnnotation.findUnique({
    where: { id },
    include: {
      pins: true,
      routes: true,
      notes: true,
    },
  });

  if (!annotation) {
    return c.json(
      { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Format export data
  const exportData = {
    title: annotation.title,
    description: annotation.description,
    exportedAt: new Date().toISOString(),
    mapView: {
      centerLatitude: annotation.centerLatitude,
      centerLongitude: annotation.centerLongitude,
      zoomLevel: annotation.zoomLevel,
    },
    pins: annotation.pins.map((pin) => ({
      id: pin.id,
      title: pin.title,
      description: pin.description,
      latitude: pin.latitude,
      longitude: pin.longitude,
      color: pin.color,
      icon: pin.icon,
      linkedWaterwayId: pin.linkedWaterwayId,
      linkedLocationId: pin.linkedLocationId,
      linkedExplorerId: pin.linkedExplorerId,
    })),
    routes: annotation.routes.map((route) => ({
      id: route.id,
      title: route.title,
      description: route.description,
      coordinates: JSON.parse(route.coordinates),
      color: route.color,
      strokeWidth: route.strokeWidth,
      isDashed: route.isDashed,
      compareToExplorerId: route.compareToExplorerId,
    })),
    notes: annotation.notes.map((note) => ({
      id: note.id,
      content: note.content,
      latitude: note.latitude,
      longitude: note.longitude,
      backgroundColor: note.backgroundColor,
    })),
    statistics: {
      totalPins: annotation.pins.length,
      totalRoutes: annotation.routes.length,
      totalNotes: annotation.notes.length,
    },
  };

  return c.json({ data: exportData });
});

// =========================
// Pins CRUD
// =========================

// POST /:id/pin - Add a pin
mapAnnotationsRouter.post(
  "/:id/pin",
  zValidator("json", createPinSchema),
  async (c) => {
    const annotationId = c.req.param("id");
    const data = c.req.valid("json");

    const annotation = await prisma.userMapAnnotation.findUnique({
      where: { id: annotationId },
    });

    if (!annotation) {
      return c.json(
        { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
        404
      );
    }

    const pin = await prisma.mapPin.create({
      data: {
        annotationId,
        latitude: data.latitude,
        longitude: data.longitude,
        title: data.title,
        description: data.description,
        color: data.color,
        icon: data.icon,
        linkedWaterwayId: data.linkedWaterwayId,
        linkedLocationId: data.linkedLocationId,
        linkedExplorerId: data.linkedExplorerId,
      },
    });

    return c.json({
      data: {
        ...pin,
        createdAt: pin.createdAt.toISOString(),
      },
    }, 201);
  }
);

// DELETE /:id/pin/:pinId - Remove a pin
mapAnnotationsRouter.delete("/:id/pin/:pinId", async (c) => {
  const annotationId = c.req.param("id");
  const pinId = c.req.param("pinId");

  const existingPin = await prisma.mapPin.findFirst({
    where: { id: pinId, annotationId },
  });

  if (!existingPin) {
    return c.json(
      { error: { message: "Pin not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.mapPin.delete({
    where: { id: pinId },
  });

  return c.json({ data: { success: true, message: "Pin deleted successfully" } });
});

// =========================
// Routes CRUD
// =========================

// POST /:id/route - Add a route
mapAnnotationsRouter.post(
  "/:id/route",
  zValidator("json", createRouteSchema),
  async (c) => {
    const annotationId = c.req.param("id");
    const data = c.req.valid("json");

    const annotation = await prisma.userMapAnnotation.findUnique({
      where: { id: annotationId },
    });

    if (!annotation) {
      return c.json(
        { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
        404
      );
    }

    const route = await prisma.mapRoute.create({
      data: {
        annotationId,
        title: data.title,
        description: data.description,
        coordinates: JSON.stringify(data.coordinates),
        color: data.color,
        strokeWidth: data.strokeWidth,
        isDashed: data.isDashed,
        compareToExplorerId: data.compareToExplorerId,
      },
    });

    return c.json({
      data: {
        ...route,
        coordinates: JSON.parse(route.coordinates),
        createdAt: route.createdAt.toISOString(),
      },
    }, 201);
  }
);

// DELETE /:id/route/:routeId - Remove a route
mapAnnotationsRouter.delete("/:id/route/:routeId", async (c) => {
  const annotationId = c.req.param("id");
  const routeId = c.req.param("routeId");

  const existingRoute = await prisma.mapRoute.findFirst({
    where: { id: routeId, annotationId },
  });

  if (!existingRoute) {
    return c.json(
      { error: { message: "Route not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.mapRoute.delete({
    where: { id: routeId },
  });

  return c.json({ data: { success: true, message: "Route deleted successfully" } });
});

// =========================
// Notes CRUD
// =========================

// POST /:id/note - Add a note
mapAnnotationsRouter.post(
  "/:id/note",
  zValidator("json", createNoteSchema),
  async (c) => {
    const annotationId = c.req.param("id");
    const data = c.req.valid("json");

    const annotation = await prisma.userMapAnnotation.findUnique({
      where: { id: annotationId },
    });

    if (!annotation) {
      return c.json(
        { error: { message: "Map annotation not found", code: "NOT_FOUND" } },
        404
      );
    }

    const note = await prisma.mapNote.create({
      data: {
        annotationId,
        latitude: data.latitude,
        longitude: data.longitude,
        content: data.content,
        backgroundColor: data.backgroundColor,
      },
    });

    return c.json({
      data: {
        ...note,
        createdAt: note.createdAt.toISOString(),
      },
    }, 201);
  }
);

// DELETE /:id/note/:noteId - Remove a note
mapAnnotationsRouter.delete("/:id/note/:noteId", async (c) => {
  const annotationId = c.req.param("id");
  const noteId = c.req.param("noteId");

  const existingNote = await prisma.mapNote.findFirst({
    where: { id: noteId, annotationId },
  });

  if (!existingNote) {
    return c.json(
      { error: { message: "Note not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.mapNote.delete({
    where: { id: noteId },
  });

  return c.json({ data: { success: true, message: "Note deleted successfully" } });
});

export { mapAnnotationsRouter };
