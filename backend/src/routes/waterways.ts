import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "../db";
import { requireAdmin, requireSuperAdmin } from "../lib/admin-middleware";
import { buildGeometry, TIER_CONFIG } from "../lib/kml-geometry";
import type { TierName, WaterwayGeometry } from "../lib/kml-geometry";

const waterwaysRouter = new Hono();

// Simplified geometry cache: KML changes only through the admin upload/delete
// routes below, which clear the entries for that waterway.
const geometryCache = new Map<string, WaterwayGeometry | null>();
const geometryCacheKey = (id: string, tier: TierName) => `${id}:${tier}`;
const invalidateGeometry = (id: string) => {
  for (const tier of Object.keys(TIER_CONFIG) as TierName[]) geometryCache.delete(geometryCacheKey(id, tier));
};

const RIVER_OVERVIEW_PATH = join(import.meta.dir, "../../generated/river-overview.json");
let riverOverviewCache: unknown | null = null;

async function getRiverOverviewDataset() {
  if (riverOverviewCache) return riverOverviewCache;

  const raw = await readFile(RIVER_OVERVIEW_PATH, "utf-8");
  riverOverviewCache = JSON.parse(raw);
  return riverOverviewCache;
}

function parseAssociatedLocations(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

// Get all waterways with basic info for map markers
waterwaysRouter.get("/", async (c) => {
  const waterways = await db.waterway.findMany({
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
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Get precomputed nationwide river overview geometry for the home map
waterwaysRouter.get("/overview/rivers", async (c) => {
  try {
    const dataset = await getRiverOverviewDataset();
    c.header("Cache-Control", "public, max-age=3600");
    return c.json({ data: dataset });
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      return c.json(
        { error: { message: "River overview dataset not found", code: "NOT_FOUND" } },
        404
      );
    }

    return c.json(
      { error: { message: "Failed to load river overview dataset", code: "INTERNAL_ERROR" } },
      500
    );
  }
});

// Get waterways by region/province
waterwaysRouter.get("/region/:regionName", async (c) => {
  const regionName = c.req.param("regionName");

  const waterways = await db.waterway.findMany({
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

  const waterways = await db.waterway.findMany({
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
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Search waterways by name
waterwaysRouter.get("/search/:query", async (c) => {
  const query = c.req.param("query");

  const waterways = await db.waterway.findMany({
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
      type: {
        select: { name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return c.json({ data: waterways });
});

// Get KML status for all waterways (superadmin only)
waterwaysRouter.get("/admin/kml-status", requireAdmin, requireSuperAdmin, async (c) => {
  const waterways = await db.waterway.findMany({
    select: {
      id: true,
      name: true,
      regionName: true,
      kmlData: true,
      type: { select: { name: true } }
    },
    orderBy: { name: "asc" }
  });

  const result = waterways.map(w => ({
    id: w.id,
    name: w.name,
    regionName: w.regionName,
    type: w.type.name,
    hasKml: !!w.kmlData
  }));

  return c.json({ data: result });
});

// Get single waterway with full details
waterwaysRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const waterway = await db.waterway.findUnique({
    where: { id },
    include: {
      type: true,
      explorers: {
        include: { explorer: true },
        orderBy: { yearExplored: "asc" }
      },
      furTradeInfo: true,
      locations: {
        include: { cartographer: true }
      },
      discoveries: true
    }
  });

  if (!waterway) {
    return c.json({ error: { message: "Waterway not found", code: "NOT_FOUND" } }, 404);
  }

  const notableFigureRows = await db.notableFigure.findMany({
  where: {
    associatedLocations: { contains: waterway.name }
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
    isFeatured: true,
    associatedLocations: true
  },
  orderBy: { name: "asc" }
});

const notableFigures = notableFigureRows
  .map((figure) => ({
    id: figure.id,
    name: figure.name,
    alternateNames: figure.alternateNames,
    birthYear: figure.birthYear,
    deathYear: figure.deathYear,
    nation: figure.nation,
    figureType: figure.figureType,
    role: figure.role,
    imageUrl: figure.imageUrl,
    isFeatured: figure.isFeatured,
    associatedLocations: parseAssociatedLocations(figure.associatedLocations),
  }))
  .filter((figure) => figure.associatedLocations.includes(waterway.name));

  // Raw KML is never sent to clients (up to 12.7 MB per row); the map draws the
  // boundary from GET /:id/geometry instead.
  const { kmlData, ...publicWaterway } = waterway;

  return c.json({
    data: {
      ...publicWaterway,
      hasKml: !!kmlData,
      notableFigures,
    }
  });
});

// Simplified boundary/route geometry for the map, by zoom tier (public)
waterwaysRouter.get("/:id/geometry", async (c) => {
  const id = c.req.param("id");
  const tierParam = c.req.query("tier") ?? "local";
  if (!(tierParam in TIER_CONFIG)) {
    return c.json(
      { error: { message: "tier must be one of nation, region, local", code: "BAD_REQUEST" } },
      400
    );
  }
  const tier = tierParam as TierName;
  const key = geometryCacheKey(id, tier);

  if (!geometryCache.has(key)) {
    const waterway = await db.waterway.findUnique({
      where: { id },
      select: { kmlData: true, type: { select: { name: true } } },
    });
    if (!waterway) {
      return c.json({ error: { message: "Waterway not found", code: "NOT_FOUND" } }, 404);
    }
    geometryCache.set(
      key,
      waterway.kmlData ? buildGeometry(waterway.kmlData, waterway.type?.name ?? "", tier) : null
    );
  }

  c.header("Cache-Control", "public, max-age=3600");
  return c.json({ data: geometryCache.get(key) ?? null });
});

// Upload KML data for a waterway (superadmin only)
waterwaysRouter.post("/:id/kml", requireAdmin, requireSuperAdmin, async (c) => {
  const id = c.req.param("id");

  const waterway = await db.waterway.findUnique({ where: { id } });
  if (!waterway) {
    return c.json({ error: { message: "Waterway not found", code: "NOT_FOUND" } }, 404);
  }

  const body = await c.req.parseBody();
  const file = body["kml"];

  if (!file || typeof file === "string") {
    return c.json({ error: { message: "No KML file provided", code: "BAD_REQUEST" } }, 400);
  }

  const kmlText = await (file as File).text();

  if (!kmlText.includes("<kml") && !kmlText.includes("<KML")) {
    return c.json({ error: { message: "Invalid KML file", code: "BAD_REQUEST" } }, 400);
  }

  const updated = await db.waterway.update({
    where: { id },
    data: { kmlData: kmlText },
    select: { id: true, name: true }
  });
  invalidateGeometry(id);

  return c.json({ data: { ...updated, kmlUploaded: true } });
});

// Delete KML data for a waterway (superadmin only)
waterwaysRouter.delete("/:id/kml", requireAdmin, requireSuperAdmin, async (c) => {
  const id = c.req.param("id");

  const updated = await db.waterway.update({
    where: { id },
    data: { kmlData: null },
    select: { id: true, name: true }
  });
  invalidateGeometry(id);

  return c.json({ data: { ...updated, kmlUploaded: false } });
});

export { waterwaysRouter };
