import { Hono } from "hono";
import { prisma } from "../prisma";

const printablesRouter = new Hono();

// GET / - List all published printable resources
printablesRouter.get("/", async (c) => {
  const resourceType = c.req.query("type");
  const topic = c.req.query("topic");
  const gradeLevel = c.req.query("gradeLevel");

  const whereClause: {
    isPublished: boolean;
    resourceType?: string;
    topic?: string;
    gradeLevel?: string;
  } = {
    isPublished: true,
  };

  if (resourceType) {
    whereClause.resourceType = resourceType;
  }
  if (topic) {
    whereClause.topic = topic;
  }
  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }

  const printables = await prisma.printableResource.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      resourceType: true,
      gradeLevel: true,
      topic: true,
      previewImageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: printables });
});

// GET /types - Get all unique resource types
printablesRouter.get("/types", async (c) => {
  const resources = await prisma.printableResource.findMany({
    where: { isPublished: true },
    select: { resourceType: true },
    distinct: ["resourceType"],
  });

  const types = resources.map((r) => r.resourceType);

  return c.json({ data: types });
});

// GET /topics - Get all unique topics
printablesRouter.get("/topics", async (c) => {
  const resources = await prisma.printableResource.findMany({
    where: { isPublished: true },
    select: { topic: true },
    distinct: ["topic"],
  });

  const topics = resources.map((r) => r.topic);

  return c.json({ data: topics });
});

// GET /:id - Get a single printable resource
printablesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const printable = await prisma.printableResource.findUnique({
    where: { id, isPublished: true },
  });

  if (!printable) {
    return c.json(
      { error: { message: "Printable resource not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: printable });
});

export { printablesRouter };
