import { Hono } from "hono";
import { prisma } from "../prisma";

const explorersRouter = new Hono();

// Get all explorers
explorersRouter.get("/", async (c) => {
  const explorers = await prisma.explorer.findMany({
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

  const explorer = await prisma.explorer.findUnique({
    where: { id },
    include: {
      waterways: {
        include: {
          waterway: {
            include: {
              type: true
            }
          }
        }
      }
    }
  });

  if (!explorer) {
    return c.json({ error: { message: "Explorer not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: explorer });
});

// Search explorers by name
explorersRouter.get("/search/:query", async (c) => {
  const query = c.req.param("query");

  const explorers = await prisma.explorer.findMany({
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
