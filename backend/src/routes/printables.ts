import { Hono } from "hono";
import { db } from "../db";
import { applyScope, scopeForUser } from "../lib/content-scope";

const printablesRouter = new Hono();

// GET / - List all published printable resources
printablesRouter.get("/", async (c) => {
  // Class content scope (spec 10.27): a student device sends its id; the list is cut to what its classes allow.
  const scopeUserId = c.req.query("userId");
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

  const printables = await db.printableResource.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      resourceType: true,
      gradeLevel: true,
      topic: true,
      previewImageUrl: true,
      fileUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: applyScope(await scopeForUser(scopeUserId), printables) });
});

// GET /types - Get all unique resource types
printablesRouter.get("/types", async (c) => {
  const resources = await db.printableResource.findMany({
    where: { isPublished: true },
    select: { resourceType: true },
    distinct: ["resourceType"],
  });

  const types = resources.map((r) => r.resourceType);

  return c.json({ data: types });
});

// GET /topics - Get all unique topics
printablesRouter.get("/topics", async (c) => {
  const resources = await db.printableResource.findMany({
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

  const printable = await db.printableResource.findUnique({
    where: { id, isPublished: true },
  });

  if (!printable) {
    return c.json(
      { error: { message: "Printable resource not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Public route: never hand students the answer key or teacher notes.
  const { answerKey: _answerKey, teacherNotes: _teacherNotes, ...publicFields } = printable;

  return c.json({ data: publicFields });
});

export { printablesRouter };
