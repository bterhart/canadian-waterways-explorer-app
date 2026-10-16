import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { requireAdmin } from "../lib/admin-middleware";
import { getReadingGuide } from "../lib/reading-guides";

const notableFiguresRouter = new Hono();

interface AssociatedExplorerEntry {
  name?: string;
  relationship?: string;
  explorerId?: string | null;
}

// Honorifics the figure JSON sometimes carries or omits relative to Explorer.name
// ("John Franklin" vs "Sir John Franklin", "George Back" vs "Sir George Back").
const normalizePersonName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\b(sir|dr\.?|captain|lord)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Give every associated-explorer entry an `explorerId`: the stored one when present,
 * otherwise the Explorer row whose name matches exactly or after dropping honorifics.
 * Entries that match nothing keep explorerId null and render as plain text.
 */
async function resolveAssociatedExplorers(raw: string | null): Promise<AssociatedExplorerEntry[] | null> {
  if (!raw) return null;
  let entries: AssociatedExplorerEntry[];
  try {
    const parsed = JSON.parse(raw);
    entries = Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
  const unresolved = entries.filter((e) => !e.explorerId && e.name);
  if (unresolved.length === 0) return entries.map((e) => ({ ...e, explorerId: e.explorerId ?? null }));

  const explorers = await db.explorer.findMany({ select: { id: true, name: true } });
  const byExact = new Map(explorers.map((e) => [e.name, e.id]));
  const byNormalized = new Map(explorers.map((e) => [normalizePersonName(e.name), e.id]));

  return entries.map((e) => {
    if (e.explorerId) return e;
    const name = e.name ?? "";
    const id = byExact.get(name) ?? byNormalized.get(normalizePersonName(name)) ?? null;
    return { ...e, explorerId: id };
  });
}

// Get all notable figures with optional filtering
notableFiguresRouter.get("/", async (c) => {
  const figureType = c.req.query("figureType");
  const nation = c.req.query("nation");
  const search = c.req.query("search");

  const where: {
    figureType?: string;
    nation?: string;
    OR?: Array<{
      name?: { contains: string };
      alternateNames?: { contains: string };
      role?: { contains: string };
    }>;
  } = {};

  if (figureType) {
    where.figureType = figureType;
  }

  if (nation) {
    where.nation = nation;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { alternateNames: { contains: search } },
      { role: { contains: search } },
    ];
  }

  const figures = await db.notableFigure.findMany({
    where,
    select: {
      id: true,
      name: true,
      alternateNames: true,
      birthYear: true,
      deathYear: true,
      nation: true,
      figureType: true,
      role: true,
      imageUrl: true,
      isFeatured: true,
      activePeriodStart: true,
      activePeriodEnd: true,
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  // Parse JSON fields for response
  const parsedFigures = figures.map((figure) => ({
    ...figure,
  }));

  return c.json({ data: parsedFigures });
});

// Get featured notable figures
notableFiguresRouter.get("/featured", async (c) => {
  const figures = await db.notableFigure.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      name: true,
      alternateNames: true,
      birthYear: true,
      deathYear: true,
      nation: true,
      figureType: true,
      role: true,
      imageUrl: true,
      significance: true,
    },
    orderBy: { name: "asc" },
  });

  return c.json({ data: figures });
});

// Get figures by explorer name (search by associated explorers)
notableFiguresRouter.get("/by-explorer/:explorerName", async (c) => {
  const explorerName = c.req.param("explorerName");

  const figures = await db.notableFigure.findMany({
    where: {
      associatedExplorers: { contains: explorerName },
    },
    select: {
      id: true,
      name: true,
      alternateNames: true,
      birthYear: true,
      deathYear: true,
      nation: true,
      figureType: true,
      role: true,
      imageUrl: true,
      associatedExplorers: true,
    },
    orderBy: { name: "asc" },
  });

  // Parse associatedExplorers JSON
  const parsedFigures = figures.map((figure) => ({
    ...figure,
    associatedExplorers: figure.associatedExplorers
      ? JSON.parse(figure.associatedExplorers)
      : null,
  }));

  return c.json({ data: parsedFigures });
});

// Get available figure types
notableFiguresRouter.get("/types", async (c) => {
  const figures = await db.notableFigure.findMany({
    select: { figureType: true },
    distinct: ["figureType"],
  });

  const types = figures.map((f) => f.figureType).sort();
  return c.json({ data: types });
});

// Get available nations
notableFiguresRouter.get("/nations", async (c) => {
  const figures = await db.notableFigure.findMany({
    where: { nation: { not: null } },
    select: { nation: true },
    distinct: ["nation"],
  });

  const nations = figures.map((f) => f.nation).filter(Boolean).sort();
  return c.json({ data: nations });
});

// Get single notable figure with full details
notableFiguresRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const figure = await db.notableFigure.findUnique({
    where: { id },
  });

  if (!figure) {
    return c.json(
      { error: { message: "Notable figure not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse JSON fields; associated explorers gain an explorerId the app can open
  const [associatedExplorers, readingGuide] = await Promise.all([
    resolveAssociatedExplorers(figure.associatedExplorers),
    getReadingGuide("notable_figure", figure.id),
  ]);
  const parsedFigure = {
    ...figure,
    associatedExplorers,
    achievements: figure.achievements ? JSON.parse(figure.achievements) : null,
    associatedLocations: figure.associatedLocations
      ? JSON.parse(figure.associatedLocations)
      : null,
    readingGuide,
  };

  return c.json({ data: parsedFigure });
});

// Admin: Create a new notable figure
const createFigureSchema = z.object({
  name: z.string().min(1),
  alternateNames: z.string().optional(),
  birthYear: z.number().optional(),
  deathYear: z.number().optional(),
  nation: z.string().optional(),
  birthPlace: z.string().optional(),
  figureType: z.string().min(1),
  role: z.string().min(1),
  biography: z.string().min(1),
  significance: z.string().min(1),
  associatedExplorers: z.array(z.any()).optional(),
  achievements: z.array(z.string()).optional(),
  associatedLocations: z.array(z.string()).optional(),
  activePeriodStart: z.number().optional(),
  activePeriodEnd: z.number().optional(),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

notableFiguresRouter.post(
  "/",
  requireAdmin,
  zValidator("json", createFigureSchema),
  async (c) => {
    const data = c.req.valid("json");

    const figure = await db.notableFigure.create({
      data: {
        name: data.name,
        alternateNames: data.alternateNames,
        birthYear: data.birthYear,
        deathYear: data.deathYear,
        nation: data.nation,
        birthPlace: data.birthPlace,
        figureType: data.figureType,
        role: data.role,
        biography: data.biography,
        significance: data.significance,
        associatedExplorers: data.associatedExplorers
          ? JSON.stringify(data.associatedExplorers)
          : null,
        achievements: data.achievements
          ? JSON.stringify(data.achievements)
          : null,
        associatedLocations: data.associatedLocations
          ? JSON.stringify(data.associatedLocations)
          : null,
        activePeriodStart: data.activePeriodStart,
        activePeriodEnd: data.activePeriodEnd,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured ?? false,
      },
    });

    return c.json({ data: figure }, 201);
  }
);

// Admin: Update a notable figure
notableFiguresRouter.patch(
  "/:id",
  requireAdmin,
  zValidator("json", createFigureSchema.partial()),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existing = await db.notableFigure.findUnique({ where: { id } });
    if (!existing) {
      return c.json(
        { error: { message: "Notable figure not found", code: "NOT_FOUND" } },
        404
      );
    }

    const updateData: Record<string, unknown> = { ...data };

    // Convert arrays to JSON strings
    if (data.associatedExplorers !== undefined) {
      updateData.associatedExplorers = data.associatedExplorers
        ? JSON.stringify(data.associatedExplorers)
        : null;
    }
    if (data.achievements !== undefined) {
      updateData.achievements = data.achievements
        ? JSON.stringify(data.achievements)
        : null;
    }
    if (data.associatedLocations !== undefined) {
      updateData.associatedLocations = data.associatedLocations
        ? JSON.stringify(data.associatedLocations)
        : null;
    }

    const figure = await db.notableFigure.update({
      where: { id },
      data: updateData,
    });

    return c.json({ data: figure });
  }
);

// Admin: Delete a notable figure
notableFiguresRouter.delete("/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");

  const existing = await db.notableFigure.findUnique({ where: { id } });
  if (!existing) {
    return c.json(
      { error: { message: "Notable figure not found", code: "NOT_FOUND" } },
      404
    );
  }

  await db.notableFigure.delete({ where: { id } });

  return c.json({ data: { success: true } });
});

export { notableFiguresRouter };
