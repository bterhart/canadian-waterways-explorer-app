import { Hono } from "hono";
import { prisma } from "../prisma";

const discoveriesRouter = new Hono();

// Get all archaeological discoveries
discoveriesRouter.get("/", async (c) => {
  const discoveries = await prisma.archaeologicalDiscovery.findMany({
    orderBy: { discoveryYear: "desc" },
    include: {
      waterway: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return c.json({ data: discoveries });
});

// Get a single discovery with full details
discoveriesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const discovery = await prisma.archaeologicalDiscovery.findUnique({
    where: { id },
    include: {
      waterway: {
        select: {
          id: true,
          name: true,
          indigenousName: true,
          latitude: true,
          longitude: true,
          regionName: true,
          type: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!discovery) {
    return c.json({ error: { message: "Discovery not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: discovery });
});

// Get discoveries related to a specific waterway
discoveriesRouter.get("/waterway/:waterwayId", async (c) => {
  const waterwayId = c.req.param("waterwayId");

  const discoveries = await prisma.archaeologicalDiscovery.findMany({
    where: { waterwayId },
    orderBy: { discoveryYear: "desc" }
  });

  return c.json({ data: discoveries });
});

export { discoveriesRouter };
