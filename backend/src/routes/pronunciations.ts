import { Hono } from "hono";
import { prisma } from "../prisma";

const pronunciationsRouter = new Hono();

// GET / - List all pronunciation guides
pronunciationsRouter.get("/", async (c) => {
  const termType = c.req.query("termType");
  const language = c.req.query("language");

  const whereClause: {
    termType?: string;
    language?: string;
  } = {};

  if (termType) {
    whereClause.termType = termType;
  }
  if (language) {
    whereClause.language = language;
  }

  const pronunciations = await prisma.pronunciationGuide.findMany({
    where: whereClause,
    select: {
      id: true,
      term: true,
      termType: true,
      language: true,
      phonetic: true,
      audioUrl: true,
      meaning: true,
    },
    orderBy: [{ termType: "asc" }, { term: "asc" }],
  });

  return c.json({ data: pronunciations });
});

// GET /term-types - Get all unique term types
pronunciationsRouter.get("/term-types", async (c) => {
  const guides = await prisma.pronunciationGuide.findMany({
    select: { termType: true },
    distinct: ["termType"],
  });

  const types = guides.map((g) => g.termType);

  return c.json({ data: types });
});

// GET /languages - Get all unique languages
pronunciationsRouter.get("/languages", async (c) => {
  const guides = await prisma.pronunciationGuide.findMany({
    where: { language: { not: null } },
    select: { language: true },
    distinct: ["language"],
  });

  const languages = guides.map((g) => g.language).filter(Boolean);

  return c.json({ data: languages });
});

// GET /by-term/:term - Get pronunciation by term (URL encoded)
pronunciationsRouter.get("/by-term/:term", async (c) => {
  const term = decodeURIComponent(c.req.param("term"));

  const pronunciation = await prisma.pronunciationGuide.findFirst({
    where: { term: { equals: term } },
  });

  if (!pronunciation) {
    return c.json(
      { error: { message: "Pronunciation guide not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: pronunciation });
});

// GET /:id - Get a single pronunciation guide by ID
pronunciationsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const pronunciation = await prisma.pronunciationGuide.findUnique({
    where: { id },
  });

  if (!pronunciation) {
    return c.json(
      { error: { message: "Pronunciation guide not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: pronunciation });
});

export { pronunciationsRouter };
