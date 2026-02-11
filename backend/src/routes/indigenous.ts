import { Hono } from "hono";
import { prisma } from "../prisma";

const indigenousRouter = new Hono();

// Get all indigenous nations
indigenousRouter.get("/nations", async (c) => {
  const nations = await prisma.indigenousNation.findMany({
    orderBy: { name: "asc" }
  });

  return c.json({ data: nations });
});

// Get single indigenous nation
indigenousRouter.get("/nations/:id", async (c) => {
  const id = c.req.param("id");

  const nation = await prisma.indigenousNation.findUnique({
    where: { id }
  });

  if (!nation) {
    return c.json({ error: { message: "Indigenous nation not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: nation });
});

// Get all cartographers
indigenousRouter.get("/cartographers", async (c) => {
  const cartographers = await prisma.cartographer.findMany({
    include: {
      _count: {
        select: { locations: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: cartographers });
});

// Get single cartographer with mapped locations
indigenousRouter.get("/cartographers/:id", async (c) => {
  const id = c.req.param("id");

  const cartographer = await prisma.cartographer.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          waterway: true
        }
      }
    }
  });

  if (!cartographer) {
    return c.json({ error: { message: "Cartographer not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: cartographer });
});

// Get waterway types
indigenousRouter.get("/waterway-types", async (c) => {
  const types = await prisma.waterwayType.findMany({
    include: {
      _count: {
        select: { waterways: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: types });
});

export { indigenousRouter };
