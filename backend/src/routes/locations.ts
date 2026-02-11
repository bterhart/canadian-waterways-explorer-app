import { Hono } from "hono";
import { prisma } from "../prisma";

const locationsRouter = new Hono();

// Get all locations for map markers
locationsRouter.get("/", async (c) => {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      locationType: true,
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

  const locations = await prisma.location.findMany({
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

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      waterway: {
        include: {
          type: true
        }
      },
      cartographer: true
    }
  });

  if (!location) {
    return c.json({ error: { message: "Location not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: location });
});

// Get locations for a specific waterway
locationsRouter.get("/waterway/:waterwayId", async (c) => {
  const waterwayId = c.req.param("waterwayId");

  const locations = await prisma.location.findMany({
    where: { waterwayId },
    include: {
      cartographer: true
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: locations });
});

export { locationsRouter };
