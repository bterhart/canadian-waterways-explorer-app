import { Hono } from "hono";
import { prisma } from "../prisma";

const waterwaysRouter = new Hono();

// Get all waterways with basic info for map markers
waterwaysRouter.get("/", async (c) => {
  const waterways = await prisma.waterway.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      regionName: true,
      boundaryCoordinates: true,
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Get waterways by region/province
waterwaysRouter.get("/region/:regionName", async (c) => {
  const regionName = c.req.param("regionName");

  const waterways = await prisma.waterway.findMany({
    where: {
      regionName: {
        contains: regionName
      }
    },
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      regionName: true,
      boundaryCoordinates: true,
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Get waterways by type (river, lake, etc.)
waterwaysRouter.get("/type/:typeName", async (c) => {
  const typeName = c.req.param("typeName");

  const waterways = await prisma.waterway.findMany({
    where: {
      type: {
        name: {
          equals: typeName
        }
      }
    },
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      regionName: true,
      boundaryCoordinates: true,
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Get single waterway with full details
waterwaysRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const waterway = await prisma.waterway.findUnique({
    where: { id },
    include: {
      type: true,
      explorers: {
        include: {
          explorer: true
        }
      },
      furTradeInfo: true,
      locations: {
        include: {
          cartographer: true
        }
      }
    }
  });

  if (!waterway) {
    return c.json({ error: { message: "Waterway not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: waterway });
});

// Search waterways by name
waterwaysRouter.get("/search/:query", async (c) => {
  const query = c.req.param("query");

  const waterways = await prisma.waterway.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { indigenousName: { contains: query } }
      ]
    },
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      regionName: true,
      boundaryCoordinates: true,
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

export { waterwaysRouter };
