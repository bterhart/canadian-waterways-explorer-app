import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "../prisma";
import { requireAdmin, requireSuperAdmin } from "../lib/admin-middleware";

const waterwaysRouter = new Hono();

const RIVER_OVERVIEW_PATH = join(import.meta.dir, "../../generated/river-overview.json");
let riverOverviewCache: unknown | null = null;

async function getRiverOverviewDataset() {
  if (riverOverviewCache) return riverOverviewCache;

  const raw = await readFile(RIVER_OVERVIEW_PATH, "utf-8");
  riverOverviewCache = JSON.parse(raw);
  return riverOverviewCache;
}

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
  const waterways = await prisma.waterway.findMany({
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

  const waterway = await prisma.waterway.findUnique({
    where: { id },
    include: {
      type: true,
      explorers: {
        include: {
          explorer: true
        },
        orderBy: {
          yearExplored: "asc"
        }
      },
      furTradeInfo: true,
      locations: {
        include: {
          cartographer: true
        }
      },
      discoveries: true
    }
  });

  if (!waterway) {
    return c.json({ error: { message: "Waterway not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({ data: waterway });
});

// Upload KML data for a waterway (superadmin only)
waterwaysRouter.post("/:id/kml", requireAdmin, requireSuperAdmin, async (c) => {
  const id = c.req.param("id");

  const waterway = await prisma.waterway.findUnique({ where: { id } });
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

  const updated = await prisma.waterway.update({
    where: { id },
    data: { kmlData: kmlText },
    select: { id: true, name: true }
  });

  return c.json({ data: { ...updated, kmlUploaded: true } });
});

// Delete KML data for a waterway (superadmin only)
waterwaysRouter.delete("/:id/kml", requireAdmin, requireSuperAdmin, async (c) => {
  const id = c.req.param("id");

  const updated = await prisma.waterway.update({
    where: { id },
    data: { kmlData: null },
    select: { id: true, name: true }
  });

  return c.json({ data: { ...updated, kmlUploaded: false } });
});

export { waterwaysRouter };
